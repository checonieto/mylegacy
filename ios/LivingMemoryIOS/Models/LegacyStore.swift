import Foundation
import Observation
import UIKit

/// Holds the person's name, answers, and photos. Answers live in UserDefaults;
/// photos are JPEG files in Application Support so large images never bloat defaults.
@Observable
final class LegacyStore {
    private enum Keys {
        static let answers = "legacy_answers"
        static let name = "legacy_person_name"
    }

    private let defaults = UserDefaults.standard

    var answers: [Int: String] = [:] {
        didSet { persistAnswers() }
    }

    var personName: String = "" {
        didSet { defaults.set(personName, forKey: Keys.name) }
    }

    private(set) var photos: [Int: UIImage] = [:]

    var answeredCount: Int {
        answers.values.filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }.count
    }

    var totalCount: Int { Question.all.count }

    var completedCategories: Int {
        StoryCategory.allCases.filter { cat in
            cat.questions.allSatisfy { hasAnswer($0.id) }
        }.count
    }

    init() {
        load()
    }

    func hasAnswer(_ id: Int) -> Bool {
        guard let value = answers[id] else { return false }
        return !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    func saveAnswer(_ text: String, for id: Int) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        answers[id] = trimmed
    }

    func savePhoto(_ image: UIImage, for id: Int) {
        let resized = image.resizedToFit(maxDimension: 1600)
        guard let data = resized.jpegData(compressionQuality: 0.82) else { return }
        do {
            try FileManager.default.createDirectory(at: Self.photosDirectory, withIntermediateDirectories: true)
            try data.write(to: Self.photoURL(for: id), options: .atomic)
            photos[id] = resized
        } catch {
            print("Failed to save photo: \(error)")
        }
    }

    func removePhoto(for id: Int) {
        try? FileManager.default.removeItem(at: Self.photoURL(for: id))
        photos[id] = nil
    }

    func clearAll() {
        answers = [:]
        personName = ""
        photos = [:]
        try? FileManager.default.removeItem(at: Self.photosDirectory)
        defaults.removeObject(forKey: Keys.answers)
        defaults.removeObject(forKey: Keys.name)
    }

    // MARK: - Persistence

    private func persistAnswers() {
        let stringKeyed = Dictionary(uniqueKeysWithValues: answers.map { (String($0.key), $0.value) })
        if let data = try? JSONEncoder().encode(stringKeyed) {
            defaults.set(data, forKey: Keys.answers)
        }
    }

    private func load() {
        if let data = defaults.data(forKey: Keys.answers),
           let decoded = try? JSONDecoder().decode([String: String].self, from: data) {
            var result: [Int: String] = [:]
            for (key, value) in decoded {
                if let id = Int(key) { result[id] = value }
            }
            answers = result
        } else if defaults.object(forKey: Keys.answers) != nil {
            // Corrupted data — clear it rather than crash.
            defaults.removeObject(forKey: Keys.answers)
        }

        personName = defaults.string(forKey: Keys.name) ?? ""

        var loaded: [Int: UIImage] = [:]
        for question in Question.all {
            let url = Self.photoURL(for: question.id)
            if let image = UIImage(contentsOfFile: url.path) {
                loaded[question.id] = image
            }
        }
        photos = loaded
    }

    private static var photosDirectory: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent("LegacyPhotos", isDirectory: true)
    }

    private static func photoURL(for id: Int) -> URL {
        photosDirectory.appendingPathComponent("question-\(id).jpg")
    }
}

extension UIImage {
    func resizedToFit(maxDimension: CGFloat) -> UIImage {
        let largest = max(size.width, size.height)
        guard largest > maxDimension else { return self }
        let scale = maxDimension / largest
        let newSize = CGSize(width: size.width * scale, height: size.height * scale)
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        return UIGraphicsImageRenderer(size: newSize, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: newSize))
        }
    }
}
