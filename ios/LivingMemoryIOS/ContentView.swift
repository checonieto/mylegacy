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

    var body: some View {
        NavigationStack(path: $router.path) {
            WelcomeView()
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .questions: QuestionsView()
                    case .review: ReviewView()
                    case .book: BookView()
                    }
                }
        }
        .environment(router)
    }
}

#Preview {
    ContentView()
        .environment(LegacyStore())
        .environment(LanguageStore())
}
