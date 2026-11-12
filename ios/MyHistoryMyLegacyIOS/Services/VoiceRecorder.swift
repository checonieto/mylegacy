import AVFoundation
import Observation

/// Records the person's voice and turns it into text through the Rork AI gateway.
@Observable
final class VoiceRecorder {
    enum Phase: Equatable { case idle, recording, transcribing }

    enum RecorderError: LocalizedError {
        case permissionDenied
        case couldNotStart
        case transcriptionUnavailable
        case transcriptionFailed

        var errorDescription: String? {
            switch self {
            case .permissionDenied: "Microphone permission denied"
            case .couldNotStart: "Could not start recording"
            case .transcriptionUnavailable: "Transcription is unavailable"
            case .transcriptionFailed: "Transcription failed"
            }
        }
    }

    private(set) var phase: Phase = .idle
    private(set) var elapsed: TimeInterval = 0
    private var recorder: AVAudioRecorder?
    private var fileURL: URL?
    private var timer: Timer?

    var permissionDenied: Bool {
        AVAudioApplication.shared.recordPermission == .denied
    }

    func start() async throws {
        let granted = await AVAudioApplication.requestRecordPermission()
        guard granted else { throw RecorderError.permissionDenied }

        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
            try session.setActive(true)
        } catch {
            throw RecorderError.couldNotStart
        }

        let url = FileManager.default.temporaryDirectory.appendingPathComponent("answer-\(UUID().uuidString).m4a")
        let settings: [String: Any] = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 44_100,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue,
        ]

        do {
            let recorder = try AVAudioRecorder(url: url, settings: settings)
            recorder.isMeteringEnabled = true
            guard recorder.record() else { throw RecorderError.couldNotStart }
            self.recorder = recorder
            self.fileURL = url
            elapsed = 0
            phase = .recording
            timer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self] _ in
                Task { @MainActor in
                    guard let self, let recorder = self.recorder else { return }
                    self.elapsed = recorder.currentTime
                }
            }
        } catch {
            throw RecorderError.couldNotStart
        }
    }

    /// Normalised microphone level 0...1 for the live waveform.
    func currentLevel() -> CGFloat {
        guard let recorder, recorder.isRecording else { return 0 }
        recorder.updateMeters()
        let power = recorder.averagePower(forChannel: 0)
        let normalized = max(0, (power + 50) / 50)
        return CGFloat(normalized)
    }

    func cancel() {
        timer?.invalidate()
        timer = nil
        recorder?.stop()
        recorder = nil
        if let fileURL { try? FileManager.default.removeItem(at: fileURL) }
        fileURL = nil
        phase = .idle
    }

    func stopAndTranscribe(language: AppLanguage) async throws -> String {
        timer?.invalidate()
        timer = nil
        recorder?.stop()
        recorder = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)

        guard let url = fileURL else {
            phase = .idle
            throw RecorderError.transcriptionFailed
        }
        phase = .transcribing
        defer {
            try? FileManager.default.removeItem(at: url)
            fileURL = nil
            phase = .idle
        }
        return try await Transcriber.transcribe(fileURL: url, language: language)
    }
}

enum Transcriber {
    private struct Body: Encodable {
        let audio: String
        let mediaType: String
        let providerOptions: [String: [String: String]]?
    }

    private struct Response: Decodable {
        let text: String
    }

    static func transcribe(fileURL: URL, language: AppLanguage) async throws -> String {
        let base = Config.EXPO_PUBLIC_TOOLKIT_URL
        let key = Config.EXPO_PUBLIC_RORK_TOOLKIT_SECRET_KEY
        guard !base.isEmpty, !key.isEmpty,
              let url = URL(string: "\(base)/v2/vercel/v4/ai/transcription-model") else {
            throw VoiceRecorder.RecorderError.transcriptionUnavailable
        }

        let data = try Data(contentsOf: fileURL)
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.timeoutInterval = 120
        request.setValue("Bearer \(key)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("microsoft/mai-transcribe-2", forHTTPHeaderField: "ai-model-id")
        request.setValue("0.0.1", forHTTPHeaderField: "ai-gateway-protocol-version")
        request.httpBody = try JSONEncoder().encode(
            Body(audio: data.base64EncodedString(), mediaType: "audio/mp4", providerOptions: nil)
        )

        let (responseData, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw VoiceRecorder.RecorderError.transcriptionFailed
        }
        let decoded = try JSONDecoder().decode(Response.self, from: responseData)
        return decoded.text.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
