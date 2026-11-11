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

/// Gold-ringed cream medallion holding the user's logo mark.
struct BookEmblem: View {
    var size: CGFloat = 88

    var body: some View {
        ZStack {
            Circle()
                .fill(LinearGradient(colors: [Palette.card, Palette.cream], startPoint: .topLeading, endPoint: .bottomTrailing))
            Circle()
                .strokeBorder(Palette.gold, lineWidth: size * 0.035)
            Circle()
                .strokeBorder(Palette.gold.opacity(0.35), lineWidth: 1)
                .padding(size * 0.09)
            Image("LogoMark")
                .resizable()
                .scaledToFit()
                .padding(.horizontal, size * 0.19)
                .padding(.vertical, size * 0.26)
        }
        .frame(width: size, height: size)
        .shadow(color: Palette.walnut.opacity(0.3), radius: 10, y: 5)
        .accessibilityHidden(true)
    }
}

/// Speaker on/off circle used on the welcome and question screens.
struct VoiceToggleButton: View {
    let isOn: Bool
    let onLabel: String
    let offLabel: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: isOn ? "speaker.wave.2.fill" : "speaker.slash.fill")
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(isOn ? Palette.onDark : Palette.muted)
                .contentTransition(.symbolEffect(.replace))
                .frame(width: 44, height: 44)
                .background(isOn ? AnyShapeStyle(Palette.walnutGradient) : AnyShapeStyle(Palette.card), in: .circle)
                .overlay { Circle().strokeBorder(isOn ? Palette.gold.opacity(0.6) : Palette.border, lineWidth: 1.5) }
        }
        .buttonStyle(PressableStyle())
        .accessibilityLabel(isOn ? onLabel : offLabel)
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
