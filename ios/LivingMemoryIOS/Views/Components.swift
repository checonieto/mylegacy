import SwiftUI

/// ES / EN pill switch.
struct LanguageToggle: View {
    @Environment(LanguageStore.self) private var languageStore

    var body: some View {
        HStack(spacing: 2) {
            Image(systemName: "globe")
                .font(.footnote.weight(.semibold))
                .foregroundStyle(Palette.walnutLight)
                .padding(.leading, 8)
                .padding(.trailing, 2)
            ForEach(AppLanguage.allCases) { lang in
                let active = languageStore.language == lang
                Button {
                    withAnimation(.snappy) { languageStore.language = lang }
                    Haptics.tap()
                } label: {
                    Text(lang.rawValue.uppercased())
                        .font(.footnote.weight(.bold))
                        .foregroundStyle(active ? Palette.onDark : Palette.walnutLight)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background {
                            if active { Capsule().fill(Palette.walnut) }
                        }
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(active ? .isSelected : [])
            }
        }
        .padding(3)
        .background(Palette.card, in: .capsule)
        .overlay { Capsule().strokeBorder(Palette.border, lineWidth: 1) }
        .shadow(color: Palette.walnut.opacity(0.08), radius: 4, y: 2)
        .sensoryFeedback(.selection, trigger: languageStore.language)
    }
}

/// Walnut medallion with a gold ring holding an open book.
struct BookEmblem: View {
    var size: CGFloat = 88

    var body: some View {
        ZStack {
            Circle()
                .fill(LinearGradient(colors: [Palette.walnut, Palette.walnutLight], startPoint: .topLeading, endPoint: .bottomTrailing))
            Circle()
                .strokeBorder(Palette.gold, lineWidth: size * 0.035)
            Circle()
                .strokeBorder(Palette.gold.opacity(0.35), lineWidth: 1)
                .padding(size * 0.09)
            Image(systemName: "book.fill")
                .font(.system(size: size * 0.4, weight: .medium))
                .foregroundStyle(Palette.onDark)
        }
        .frame(width: size, height: size)
        .shadow(color: Palette.walnut.opacity(0.3), radius: 10, y: 5)
        .accessibilityHidden(true)
    }
}

/// Gold progress bar.
struct GoldProgressBar: View {
    let value: Double

    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .leading) {
                Capsule().fill(Palette.border)
                Capsule()
                    .fill(LinearGradient(colors: [Palette.gold, Palette.goldDeep], startPoint: .leading, endPoint: .trailing))
                    .frame(width: max(8, proxy.size.width * min(max(value, 0), 1)))
            }
        }
        .frame(height: 8)
        .animation(.spring(response: 0.5, dampingFraction: 0.8), value: value)
    }
}

/// Destructive "Start New Story" outline button.
struct StartNewStoryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label(title, systemImage: "arrow.counterclockwise")
                .font(.headline)
                .foregroundStyle(Palette.brick)
                .padding(.vertical, 14)
                .padding(.horizontal, 24)
                .frame(maxWidth: .infinity)
                .background(Palette.card, in: .capsule)
                .overlay { Capsule().strokeBorder(Palette.brick, lineWidth: 2) }
        }
        .buttonStyle(PressableStyle())
    }
}
