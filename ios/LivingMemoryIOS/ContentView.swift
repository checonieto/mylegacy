import SwiftUI

enum Route: Hashable {
    case questions
    case review
    case book
}

@Observable
final class Router {
    var path: [Route] = []

    func push(_ route: Route) { path.append(route) }
    func popToRoot() { path.removeAll() }
}

struct ContentView: View {
    @State private var router = Router()

    @ViewBuilder
    private var rootScreen: some View {
        #if DEBUG && targetEnvironment(simulator)
        WelcomeView()
            .screenshotTargetMarker("welcome")
        #else
        WelcomeView()
        #endif
    }

    @ViewBuilder
    private func destination(_ route: Route) -> some View {
        switch route {
        case .questions:
            #if DEBUG && targetEnvironment(simulator)
            QuestionsView()
                .screenshotTargetMarker("questions")
            #else
            QuestionsView()
            #endif
        case .review:
            #if DEBUG && targetEnvironment(simulator)
            ReviewView()
                .screenshotTargetMarker("review")
            #else
            ReviewView()
            #endif
        case .book:
            #if DEBUG && targetEnvironment(simulator)
            BookView()
                .screenshotTargetMarker("book")
            #else
            BookView()
            #endif
        }
    }

    var body: some View {
        NavigationStack(path: $router.path) {
            rootScreen
                .navigationDestination(for: Route.self) { route in
                    destination(route)
                }
        }
        .environment(router)
        .onAppear {
            #if DEBUG && targetEnvironment(simulator)
            ScreenshotMode.route(router)
            #endif
        }
        .modifier(ScreenshotReadyMarker())
    }
}

/// Compiled out of release builds; adds the invisible readiness marker only
/// when the simulator screenshot scenario is active.
struct ScreenshotReadyMarker: ViewModifier {
    func body(content: Content) -> some View {
        #if DEBUG && targetEnvironment(simulator)
        if ScreenshotMode.isActive {
            content.overlay(alignment: .topLeading) {
                Color.clear
                    .frame(width: 2, height: 2)
                    .accessibilityElement()
                    .accessibilityIdentifier("rork.screenshot.ready.\(ScreenshotMode.scenarioID)")
            }
        } else {
            content
        }
        #else
        content
        #endif
    }
}

#Preview {
    ContentView()
        .environment(LegacyStore())
        .environment(LanguageStore())
}
