import SwiftUI
import UIKit

/// The warm "heirloom book" palette shared with the Expo app.
enum Palette {
    static let cream = Color(hex: 0xFBF5EA)
    static let parchment = Color(hex: 0xF0E4D0)
    static let card = Color(hex: 0xFFFDF7)
    static let border = Color(hex: 0xE8DBC2)
    static let borderStrong = Color(hex: 0xD9C9AC)
    static let chip = Color(hex: 0xF5EBD8)
    static let walnut = Color(hex: 0x5C4332)
    static let walnutLight = Color(hex: 0x7A5C42)
    static let ink = Color(hex: 0x3D2F24)
    static let gold = Color(hex: 0xC9A227)
    static let goldDeep = Color(hex: 0x9A7B3F)
    static let muted = Color(hex: 0xA89B88)
    static let disabled = Color(hex: 0xC9BBA8)
    static let brick = Color(hex: 0xB54A32)
    static let onDark = Color(hex: 0xFFF8EC)

    static let walnutGradient = LinearGradient(
        colors: [walnut, walnutLight],
        startPoint: .leading,
        endPoint: .trailing
    )
}

extension Color {
    init(hex: UInt32, opacity: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: opacity
        )
    }
}

extension UIColor {
    convenience init(hex: UInt32, alpha: CGFloat = 1) {
        self.init(
            red: CGFloat((hex >> 16) & 0xFF) / 255,
            green: CGFloat((hex >> 8) & 0xFF) / 255,
            blue: CGFloat(hex & 0xFF) / 255,
            alpha: alpha
        )
    }
}

/// Parchment backdrop with a soft golden glow, used behind every screen.
struct ParchmentBackground: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Palette.cream, Palette.parchment],
                startPoint: .top,
                endPoint: .bottom
            )
            RadialGradient(
                colors: [Palette.gold.opacity(0.14), .clear],
                center: .top,
                startRadius: 10,
                endRadius: 420
            )
            RadialGradient(
                colors: [Palette.walnut.opacity(0.06), .clear],
                center: .bottomTrailing,
                startRadius: 10,
                endRadius: 380
            )
        }
        .ignoresSafeArea()
    }
}

/// Thin gold rule with a sparkle — the book's ornament.
struct Ornament: View {
    var width: CGFloat = 44
    var body: some View {
        HStack(spacing: 10) {
            Rectangle().fill(Palette.gold.opacity(0.55)).frame(width: width, height: 1)
            Image(systemName: "sparkle")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(Palette.gold)
            Rectangle().fill(Palette.gold.opacity(0.55)).frame(width: width, height: 1)
        }
        .accessibilityHidden(true)
    }
}

/// Cream card with a warm border and soft walnut shadow.
struct HeirloomCard: ViewModifier {
    var padding: CGFloat = 20
    var radius: CGFloat = 20
    func body(content: Content) -> some View {
        content
            .padding(padding)
            .background(Palette.card, in: .rect(cornerRadius: radius))
            .overlay {
                RoundedRectangle(cornerRadius: radius)
                    .strokeBorder(Palette.border, lineWidth: 1)
            }
            .shadow(color: Palette.walnut.opacity(0.08), radius: 8, y: 3)
    }
}

extension View {
    func heirloomCard(padding: CGFloat = 20, radius: CGFloat = 20) -> some View {
        modifier(HeirloomCard(padding: padding, radius: radius))
    }
}

/// Pressed-state scale for every tappable surface.
struct PressableStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .opacity(configuration.isPressed ? 0.88 : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

/// Large walnut-gradient pill button.
struct WalnutButton: View {
    let title: String
    var systemImage: String? = nil
    var trailingImage: String? = nil
    var isEnabled: Bool = true
    var isLoading: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                if isLoading {
                    ProgressView().tint(Palette.onDark)
                } else if let systemImage {
                    Image(systemName: systemImage)
                }
                Text(title)
                if let trailingImage, !isLoading {
                    Image(systemName: trailingImage)
                }
            }
            .font(.system(.title3, design: .serif, weight: .semibold))
            .foregroundStyle(Palette.onDark)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 17)
            .background {
                if isEnabled {
                    Capsule().fill(Palette.walnutGradient)
                } else {
                    Capsule().fill(LinearGradient(colors: [Palette.disabled, Color(hex: 0xB5A58F)], startPoint: .leading, endPoint: .trailing))
                }
            }
            .overlay { Capsule().strokeBorder(Palette.gold.opacity(isEnabled ? 0.45 : 0), lineWidth: 1) }
            .shadow(color: Palette.walnut.opacity(isEnabled ? 0.28 : 0), radius: 10, y: 5)
        }
        .buttonStyle(PressableStyle())
        .disabled(!isEnabled || isLoading)
    }
}

/// "Recording the story and legacy of …" banner shown on every inner screen.
struct NameBanner: View {
    let prefix: String
    let name: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "book.closed.fill")
                .font(.footnote)
                .foregroundStyle(Palette.gold)
            (Text(prefix + " ") + Text(name).font(.system(.subheadline, design: .serif, weight: .bold)).foregroundColor(Palette.walnut))
                .font(.subheadline)
                .foregroundStyle(Palette.walnutLight)
                .lineLimit(2)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .padding(.horizontal, 20)
        .background(Palette.card)
        .overlay(alignment: .bottom) {
            Rectangle().fill(Palette.border).frame(height: 1)
        }
    }
}

enum Haptics {
    static func tap() { UIImpactFeedbackGenerator(style: .light).impactOccurred() }
    static func medium() { UIImpactFeedbackGenerator(style: .medium).impactOccurred() }
    static func success() { UINotificationFeedbackGenerator().notificationOccurred(.success) }
}
