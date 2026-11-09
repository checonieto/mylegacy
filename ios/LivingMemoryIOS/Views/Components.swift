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

/// Grandfather (glasses) and grandmother (hair bun) hand-drawn medallions.
/// All features are laid out inside one circle and clipped to it, so they
/// always line up with the face.
struct ElderlyCouple: View {
    var size: CGFloat = 60

    var body: some View {
        HStack(spacing: 16) {
            GrandfatherMedallion(size: size)
            Rectangle()
                .fill(Palette.gold.opacity(0.6))
                .frame(width: 1, height: size * 0.7)
            GrandmotherMedallion(size: size)
        }
        .accessibilityHidden(true)
    }
}

private struct GrandfatherMedallion: View {
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle()
                .fill(LinearGradient(colors: [Palette.walnut, Palette.walnutLight], startPoint: .topLeading, endPoint: .bottomTrailing))

            Circle() // hair
                .fill(Palette.muted)
                .frame(width: size * 0.68, height: size * 0.68)
                .offset(y: -size * 0.30)

            Circle() // face
                .fill(Palette.card)
                .frame(width: size * 0.62, height: size * 0.62)
                .offset(y: size * 0.04)

            GlassesShape()
                .stroke(Palette.walnut, lineWidth: max(1.4, size * 0.03))
                .frame(width: size * 0.44, height: size * 0.16)
                .offset(y: -size * 0.02)

            SmileShape()
                .stroke(Palette.walnutLight, style: StrokeStyle(lineWidth: max(1.2, size * 0.025), lineCap: .round))
                .frame(width: size * 0.2, height: size * 0.1)
                .offset(y: size * 0.17)
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay { Circle().strokeBorder(Palette.gold, lineWidth: 2.5) }
        .shadow(color: Palette.walnut.opacity(0.25), radius: 6, y: 3)
    }
}

private struct GrandmotherMedallion: View {
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle()
                .fill(LinearGradient(colors: [Color(hex: 0x9A6B4F), Palette.walnutLight], startPoint: .topLeading, endPoint: .bottomTrailing))

            Circle() // hair mass
                .fill(Palette.muted)
                .frame(width: size * 0.78, height: size * 0.78)
                .offset(y: -size * 0.12)

            Circle() // bun
                .fill(Palette.muted)
                .overlay { Circle().strokeBorder(Palette.card, lineWidth: 1.5) }
                .frame(width: size * 0.28, height: size * 0.28)
                .offset(y: -size * 0.36)

            Circle() // face
                .fill(Palette.card)
                .frame(width: size * 0.56, height: size * 0.56)
                .offset(y: size * 0.08)

            HStack(spacing: size * 0.11) { // eyes
                Circle().fill(Palette.walnut).frame(width: size * 0.055, height: size * 0.055)
                Circle().fill(Palette.walnut).frame(width: size * 0.055, height: size * 0.055)
            }
            .offset(y: size * 0.02)

            SmileShape()
                .stroke(Palette.walnutLight, style: StrokeStyle(lineWidth: max(1.2, size * 0.025), lineCap: .round))
                .frame(width: size * 0.18, height: size * 0.09)
                .offset(y: size * 0.19)

            HStack(spacing: size * 0.56) { // earrings
                Circle().fill(Palette.gold).frame(width: size * 0.06, height: size * 0.06)
                Circle().fill(Palette.gold).frame(width: size * 0.06, height: size * 0.06)
            }
            .offset(y: size * 0.14)
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay { Circle().strokeBorder(Palette.gold, lineWidth: 2.5) }
        .shadow(color: Palette.walnut.opacity(0.25), radius: 6, y: 3)
    }
}

private struct GlassesShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let lensWidth = rect.height * 1.1
        path.addEllipse(in: CGRect(x: rect.minX, y: rect.minY, width: lensWidth, height: rect.height))
        path.addEllipse(in: CGRect(x: rect.maxX - lensWidth, y: rect.minY, width: lensWidth, height: rect.height))
        path.move(to: CGPoint(x: rect.minX + lensWidth, y: rect.midY))
        path.addLine(to: CGPoint(x: rect.maxX - lensWidth, y: rect.midY))
        return path
    }
}

private struct SmileShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.addArc(
            center: CGPoint(x: rect.midX, y: rect.minY),
            radius: rect.width / 2,
            startAngle: .degrees(25),
            endAngle: .degrees(155),
            clockwise: false
        )
        return path
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
