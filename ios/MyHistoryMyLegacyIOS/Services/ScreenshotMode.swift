#if DEBUG && targetEnvironment(simulator)
import SwiftUI

/// Simulator-only screenshot mode for App Store capture.
/// Entirely compiled out of release builds — never runs for real users.
/// Activated only with the explicit launch argument
/// `-RORK_SCREENSHOT_SCENARIO app-store` (positive match only).
@MainActor
enum ScreenshotMode {
    static let scenarioID = "app-store"

    private static var scenario: String? {
        UserDefaults.standard.string(forKey: "RORK_SCREENSHOT_SCENARIO")
    }
    static var isActive: Bool { scenario == scenarioID }
    private static var target: String? {
        UserDefaults.standard.string(forKey: "RORK_SCREENSHOT_TARGET")
    }

    /// Seeds deterministic, local demo data before LegacyStore mounts.
    /// Idempotent: every launch with the scenario set rewrites the same state.
    static func seedIfNeeded() {
        guard isActive else { return }
        let language = LanguageStore().language
        let (name, answers) = Self.demoContent(for: language)

        UserDefaults.standard.set(false, forKey: "voice_enabled")
        UserDefaults.standard.set(name, forKey: "legacy_person_name")
        let stringKeyed = Dictionary(uniqueKeysWithValues: answers.map { (String($0.key), $0.value) })
        if let data = try? JSONEncoder().encode(stringKeyed) {
            UserDefaults.standard.set(data, forKey: "legacy_answers")
        }
    }

    /// Routes the navigation stack straight to the requested capture target.
    static func route(_ router: Router) {
        guard isActive else { return }
        switch target {
        case "questions": router.path = [.questions]
        case "review": router.path = [.questions, .review]
        case "book": router.path = [.questions, .review, .book]
        default: break
        }
    }

    private static func demoContent(for language: AppLanguage) -> (String, [Int: String]) {
        switch language {
        case .es:
            return ("María Elena García", [
                1: "Las tardes en el patio de mi abuela, con el olor a jazmín y las historias que contaba mientras preparaba café de olla.",
                2: "Jugábamos a las canicas en la calle; yo guardaba las ganadoras en una lata de galletas.",
                3: "Doña Carmen, mi maestra de primaria, que me enseñó a leer con un libro de cuentos viejo.",
                4: "Un día entero de campo con mi padre; regresamos cantando en el camión de la ruta.",
                5: "El caldo de pollo con arroz que hacía mi madre los domingos, para toda la familia.",
                6: "Ver a mis hijos crecer y después tener a sus propios hijos.",
                7: "Cada diciembre, cuando toda la familia se junta alrededor de la mesa.",
                8: "Aprendí que la paciencia cura casi todo, y que las palabras amables no cuestan nada.",
                9: "Me gustaría que me recuerden riendo, con las manos ocupadas en algo bueno para la familia.",
                10: "Que siempre digan la verdad y cuiden a los suyos.",
            ])
        case .en:
            return ("María Elena García", [
                1: "The afternoons in my grandmother's courtyard, with the scent of jasmine and the stories she told while making stove-top coffee.",
                2: "We played marbles in the street; I kept my winnings in an old biscuit tin.",
                3: "Mrs. Carmen, my primary school teacher, who taught me to read with a worn storybook.",
                4: "A whole day in the countryside with my father; we rode home singing on the bus.",
                5: "The chicken soup with rice my mother made on Sundays for the whole family.",
                6: "Watching my children grow up, and later seeing them have children of their own.",
                7: "Every December, when the whole family gathers around the table.",
                8: "I learned that patience cures almost everything, and that kind words cost nothing.",
                9: "I would like to be remembered laughing, with my hands busy doing something good for the family.",
                10: "Always tell the truth and take care of your own.",
            ])
        case .pt:
            return ("Maria Elena García", [
                1: "As tardes no quintal da minha avó, com o cheiro de jasmim e as histórias que ela contava enquanto fazia café no fogão.",
                2: "Brincávamos de bolas de gude na rua; eu guardava os prêmios numa lata de biscoitos.",
                3: "Dona Carmen, minha professora do primário, que me ensinou a ler com um livro de histórias velho.",
                4: "Um dia inteiro no campo com meu pai; voltamos cantando no ônibus.",
                5: "O canja de galinha com arroz que minha mãe fazia nos domingos para toda a família.",
                6: "Ver meus filhos crescerem e, mais tarde, terem filhos próprios.",
                7: "Todo dezembro, quando a família inteira se reúne à mesa.",
                8: "Aprendi que a paciência quase tudo cura, e que palavras gentis não custam nada.",
                9: "Gostaria que me lembrassem rindo, com as mãos ocupadas fazendo algo bom para a família.",
                10: "Que sempre digam a verdade e cuidem dos seus.",
            ])
        }
    }
}

extension View {
    /// Marks a routed screen so strict replay can verify the target. Invisible.
    func screenshotTargetMarker(_ name: String) -> some View {
        overlay(alignment: .topLeading) {
            Color.clear
                .frame(width: 2, height: 2)
                .accessibilityElement()
                .accessibilityLabel("rork.screenshot.target.\(name)")
        }
    }

    /// Readiness marker exposed only once seeding is complete. Invisible.
    func screenshotReadyMarker() -> some View {
        overlay(alignment: .topLeading) {
            Color.clear
                .frame(width: 2, height: 2)
                .accessibilityElement()
                .accessibilityIdentifier("rork.screenshot.ready.\(ScreenshotMode.scenarioID)")
        }
    }
}
#endif
