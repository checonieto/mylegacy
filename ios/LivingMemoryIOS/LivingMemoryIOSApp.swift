//
//  LivingMemoryIOSApp.swift
//  LivingMemoryIOS
//
//  Created by Rork on November 9, 2026.
//

import SwiftUI

@main
struct LivingMemoryIOSApp: App {
    @State private var store = LegacyStore()
    @State private var languageStore = LanguageStore()
    @State private var voiceSettings = VoiceSettings()

    init() {
        let titleColor = UIColor(hex: 0x3D2F24)
        let appearance = UINavigationBarAppearance()
        appearance.configureWithTransparentBackground()
        appearance.backgroundColor = UIColor(hex: 0xFBF5EA).withAlphaComponent(0.92)
        appearance.shadowColor = UIColor(hex: 0xE8DBC2)
        let serifTitle = UIFont.systemFont(ofSize: 17, weight: .semibold).fontDescriptor.withDesign(.serif)
        if let serifTitle {
            appearance.titleTextAttributes = [.font: UIFont(descriptor: serifTitle, size: 18), .foregroundColor: titleColor]
        }
        UINavigationBar.appearance().standardAppearance = appearance
        UINavigationBar.appearance().scrollEdgeAppearance = appearance
        UINavigationBar.appearance().compactAppearance = appearance
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .environment(languageStore)
                .environment(voiceSettings)
                .tint(Palette.walnut)
                .preferredColorScheme(.light)
        }
    }
}
