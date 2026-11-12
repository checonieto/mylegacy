import Foundation
import Observation

/// Shared "read aloud" preference, persisted across launches and used by
/// every screen that speaks (welcome instructions and questions).
@Observable
final class VoiceSettings {
    private static let key = "voice_enabled"

    var isEnabled: Bool {
        didSet { UserDefaults.standard.set(isEnabled, forKey: Self.key) }
    }

    init() {
        if UserDefaults.standard.object(forKey: Self.key) == nil {
            isEnabled = true
        } else {
            isEnabled = UserDefaults.standard.bool(forKey: Self.key)
        }
    }
}
