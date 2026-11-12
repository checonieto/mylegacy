import AVFoundation
import CryptoKit
import Observation

/// Reads questions aloud. Uses a natural AI voice through the Rork AI gateway
/// (each clip is cached on disk after the first listen) and falls back to the
/// system voice when the network or the gateway is unavailable.
@Observable
final class QuestionReader: NSObject {
    private(set) var isSpeaking = false
    private let synthesizer = AVSpeechSynthesizer()
    private var player: AVAudioPlayer?
    private var loadTask: Task<Void, Never>?

    override init() {
        super.init()
        synthesizer.delegate = self
    }

    func speak(_ text: String, language: AppLanguage) {
        stop()
        isSpeaking = true
        loadTask = Task { @MainActor [weak self] in
            guard let self else { return }
            do {
                let fileURL = try await Narrator.speechFile(for: text, language: language)
                guard !Task.isCancelled else { return }
                try self.play(fileURL: fileURL)
            } catch is CancellationError {
                return
            } catch {
                guard !Task.isCancelled else { return }
                self.speakWithSystemVoice(text, language: language)
            }
        }
    }

    func stop() {
        loadTask?.cancel()
        loadTask = nil
        player?.stop()
        player = nil
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        isSpeaking = false
    }

    // MARK: - Playback

    private func play(fileURL: URL) throws {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        try? session.setActive(true)

        let player = try AVAudioPlayer(contentsOf: fileURL)
        player.delegate = self
        self.player = player
        player.play()
    }

    private func speakWithSystemVoice(_ text: String, language: AppLanguage) {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        try? session.setActive(true)

        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: language.speechCode)
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate * 0.92
        utterance.pitchMultiplier = 1.0
        utterance.preUtteranceDelay = 0.15
        synthesizer.speak(utterance)
    }
}

extension QuestionReader: AVSpeechSynthesizerDelegate, AVAudioPlayerDelegate {
    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        Task { @MainActor in self.isSpeaking = false }
    }

    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        Task { @MainActor in self.isSpeaking = false }
    }

    nonisolated func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        Task { @MainActor in
            if self.player === player {
                self.player = nil
                self.isSpeaking = false
            }
        }
    }
}

/// Fetches warm, natural narration clips from the AI gateway and caches them
/// under Application Support so each question is generated at most once.
enum Narrator {
    private static let model = "elevenlabs/eleven-v3"
    /// Jade — warm Mexican Spanish; Sarah — mature, reassuring English; Mayla — warm Brazilian Portuguese narrator.
    private static let voices: [AppLanguage: String] = [
        .es: "lP1VZ61RLnDtOoz41b3D",
        .en: "EXAVITQu4vr4xnSDxMaL",
        .pt: "NS7yU4WmAouJsg84X3Mg",
    ]

    private struct Body: Encodable {
        let text: String
        let voice: String
        let providerOptions: ProviderOptions?
    }

    private struct ProviderOptions: Encodable {
        let elevenlabs: ElevenLabs
    }

    private struct ElevenLabs: Encodable {
        let voiceSettings: VoiceSettings
    }

    private struct VoiceSettings: Encodable {
        let stability = 0.6
        let similarityBoost = 0.75
        let useSpeakerBoost = true
    }

    private struct Response: Decodable {
        let audio: String
    }

    private enum NarratorError: LocalizedError {
        case unavailable
        var errorDescription: String? { "Narration unavailable" }
    }

    static func speechFile(for text: String, language: AppLanguage) async throws -> URL {
        let cacheURL = cacheURL(for: text, language: language)
        if FileManager.default.fileExists(atPath: cacheURL.path) {
            return cacheURL
        }

        let base = Config.EXPO_PUBLIC_TOOLKIT_URL
        let key = Config.EXPO_PUBLIC_RORK_TOOLKIT_SECRET_KEY
        guard !base.isEmpty, !key.isEmpty, let voice = voices[language],
              let url = URL(string: "\(base)/v2/vercel/v4/ai/speech-model") else {
            throw NarratorError.unavailable
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.timeoutInterval = 120
        request.setValue("Bearer \(key)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(model, forHTTPHeaderField: "ai-model-id")
        request.setValue("0.0.1", forHTTPHeaderField: "ai-gateway-protocol-version")
        request.httpBody = try JSONEncoder().encode(
            Body(
                text: text,
                voice: voice,
                providerOptions: ProviderOptions(elevenlabs: ElevenLabs(voiceSettings: VoiceSettings()))
            )
        )

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw NarratorError.unavailable
        }
        let decoded = try JSONDecoder().decode(Response.self, from: data)
        guard let audio = Data(base64Encoded: decoded.audio), !audio.isEmpty else {
            throw NarratorError.unavailable
        }

        try FileManager.default.createDirectory(at: cacheURL.deletingLastPathComponent(), withIntermediateDirectories: true)
        try audio.write(to: cacheURL, options: .atomic)
        return cacheURL
    }

    private static func cacheURL(for text: String, language: AppLanguage) -> URL {
        // The voice id is part of the key so switching to a better voice
        // automatically regenerates every clip instead of replaying old ones.
        let voice = voices[language] ?? "system"
        let digest = SHA256.hash(data: Data("\(language.rawValue)|\(voice)|\(text)".utf8))
        let hash = digest.map { String(format: "%02x", $0) }.joined()
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent("TTSCache/v2/\(hash).mp3", isDirectory: false)
    }
}
