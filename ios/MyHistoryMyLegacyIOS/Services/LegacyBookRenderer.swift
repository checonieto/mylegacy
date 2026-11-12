import CoreText
import UIKit

/// Draws the Legacy Book as a real, multi-page PDF: a walnut-and-gold cover,
/// then every answered question grouped by chapter, with photos inline.
struct LegacyBookRenderer {
    let personName: String
    let language: AppLanguage
    let answers: [Int: String]
    let photos: [Int: UIImage]

    private var t: Strings { language.strings }

    private let pageRect = CGRect(x: 0, y: 0, width: 612, height: 792)
    private let margin: CGFloat = 60
    private let headerSpace: CGFloat = 46
    private let footerSpace: CGFloat = 50

    private static let walnut = UIColor(hex: 0x5C4332)
    private static let walnutLight = UIColor(hex: 0x7A5C42)
    private static let gold = UIColor(hex: 0xC9A227)
    private static let goldDeep = UIColor(hex: 0x9A7B3F)
    private static let ink = UIColor(hex: 0x3D2F24)
    private static let paper = UIColor(hex: 0xFFFDF7)
    private static let cream = UIColor(hex: 0xFFF8EC)
    private static let rule = UIColor(hex: 0xE8DBC2)

    private func serif(_ size: CGFloat, bold: Bool = false, italic: Bool = false) -> UIFont {
        let name: String
        switch (bold, italic) {
        case (true, true): name = "Georgia-BoldItalic"
        case (true, false): name = "Georgia-Bold"
        case (false, true): name = "Georgia-Italic"
        case (false, false): name = "Georgia"
        }
        return UIFont(name: name, size: size) ?? .systemFont(ofSize: size, weight: bold ? .bold : .regular)
    }

    func render() throws -> URL {
        let safeName = personName
            .components(separatedBy: CharacterSet.alphanumerics.inverted)
            .filter { !$0.isEmpty }
            .joined(separator: "-")
        let baseName: String
        switch language {
        case .es: baseName = "Libro-del-Legado"
        case .en: baseName = "Legacy-Book"
        case .pt: baseName = "Livro-do-Legado"
        }
        let fileName = baseName + (safeName.isEmpty ? "" : "-\(safeName)") + ".pdf"
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(fileName)

        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = [
            kCGPDFContextTitle as String: t.title + (personName.isEmpty ? "" : " — \(personName)"),
            kCGPDFContextAuthor as String: personName.isEmpty ? "Living Memory" : personName,
            kCGPDFContextCreator as String: "Living Memory",
        ]
        let renderer = UIGraphicsPDFRenderer(bounds: pageRect, format: format)
        try renderer.writePDF(to: url) { context in
            drawCover(context)
            var cursor = PageCursor(renderer: self, context: context)
            cursor.newPage()

            for category in StoryCategory.allCases {
                let answered = category.questions.filter { !(answers[$0.id] ?? "").trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
                guard !answered.isEmpty else { continue }
                cursor.drawChapterHeader(category)
                for question in answered {
                    cursor.drawQuestion(question, answer: answers[question.id] ?? "", photo: photos[question.id])
                }
                cursor.y += 14
            }
            cursor.drawClosingQuote()
        }
        return url
    }

    // MARK: - Cover

    private func drawCover(_ context: UIGraphicsPDFRendererContext) {
        context.beginPage()
        let cg = context.cgContext

        let colors = [Self.walnut.cgColor, Self.walnutLight.cgColor] as CFArray
        if let gradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: colors, locations: [0, 1]) {
            cg.drawLinearGradient(gradient, start: .zero, end: CGPoint(x: pageRect.width, y: pageRect.height), options: [])
        }

        // Double gold frame
        cg.setStrokeColor(Self.gold.cgColor)
        cg.setLineWidth(2)
        cg.stroke(pageRect.insetBy(dx: 32, dy: 32))
        cg.setLineWidth(0.75)
        cg.stroke(pageRect.insetBy(dx: 40, dy: 40))

        // Corner diamonds
        for point in [CGPoint(x: 32, y: 32), CGPoint(x: pageRect.width - 32, y: 32),
                      CGPoint(x: 32, y: pageRect.height - 32), CGPoint(x: pageRect.width - 32, y: pageRect.height - 32)] {
            let d = UIBezierPath()
            d.move(to: CGPoint(x: point.x, y: point.y - 7))
            d.addLine(to: CGPoint(x: point.x + 7, y: point.y))
            d.addLine(to: CGPoint(x: point.x, y: point.y + 7))
            d.addLine(to: CGPoint(x: point.x - 7, y: point.y))
            d.close()
            Self.gold.setFill()
            d.fill()
        }

        let center = NSMutableParagraphStyle()
        center.alignment = .center
        center.lineSpacing = 4
        let width = pageRect.width - 160
        var y: CGFloat = 230

        func drawCentered(_ text: String, font: UIFont, color: UIColor, spacingAfter: CGFloat) {
            let attr = NSAttributedString(string: text, attributes: [.font: font, .foregroundColor: color, .paragraphStyle: center])
            let size = attr.boundingRect(with: CGSize(width: width, height: .greatestFiniteMagnitude), options: [.usesLineFragmentOrigin, .usesFontLeading], context: nil)
            attr.draw(with: CGRect(x: 80, y: y, width: width, height: ceil(size.height)), options: [.usesLineFragmentOrigin, .usesFontLeading], context: nil)
            y += ceil(size.height) + spacingAfter
        }

        // The user's logo mark, tinted cream, crowns the cover.
        if let mark = UIImage(named: "LogoMark")?.withTintColor(Self.cream, renderingMode: .alwaysOriginal), mark.size.width > 0 {
            let markWidth: CGFloat = 96
            let markHeight = markWidth * (mark.size.height / mark.size.width)
            mark.draw(in: CGRect(x: pageRect.midX - markWidth / 2, y: 128, width: markWidth, height: markHeight))
        }

        drawCentered("❦", font: serif(30), color: Self.gold, spacingAfter: 24)
        drawCentered(t.title, font: serif(40, bold: true), color: Self.cream, spacingAfter: 18)
        drawCentered(t.pdfSubtitle, font: serif(15, italic: true), color: Self.cream.withAlphaComponent(0.85), spacingAfter: 34)

        cg.setStrokeColor(Self.gold.cgColor)
        cg.setLineWidth(1.5)
        cg.move(to: CGPoint(x: pageRect.midX - 60, y: y))
        cg.addLine(to: CGPoint(x: pageRect.midX + 60, y: y))
        cg.strokePath()
        y += 34

        if !personName.isEmpty {
            drawCentered(t.namePrompt, font: serif(13), color: Self.cream.withAlphaComponent(0.75), spacingAfter: 10)
            drawCentered(personName, font: serif(30, italic: true), color: Self.gold, spacingAfter: 30)
        }

        let date = Date().formatted(Date.FormatStyle(date: .long, time: .omitted).locale(language.locale))
        y = pageRect.height - 150
        drawCentered(date, font: serif(13), color: Self.cream.withAlphaComponent(0.8), spacingAfter: 0)
    }

    // MARK: - Flowing content

    fileprivate struct PageCursor {
        let renderer: LegacyBookRenderer
        let context: UIGraphicsPDFRendererContext
        var y: CGFloat = 0
        var pageNumber = 1

        var top: CGFloat { renderer.margin + renderer.headerSpace }
        var bottom: CGFloat { renderer.pageRect.height - renderer.margin - renderer.footerSpace + 30 }
        var left: CGFloat { renderer.margin }
        var width: CGFloat { renderer.pageRect.width - renderer.margin * 2 }

        mutating func newPage() {
            context.beginPage()
            pageNumber += 1
            LegacyBookRenderer.paper.setFill()
            UIRectFill(renderer.pageRect)

            let headerAttrs: [NSAttributedString.Key: Any] = [
                .font: renderer.serif(9, italic: true),
                .foregroundColor: LegacyBookRenderer.goldDeep,
            ]
            let header = renderer.t.title + (renderer.personName.isEmpty ? "" : "  ·  \(renderer.personName)")
            (header as NSString).draw(at: CGPoint(x: left, y: renderer.margin - 18), withAttributes: headerAttrs)

            let cg = context.cgContext
            cg.setStrokeColor(LegacyBookRenderer.rule.cgColor)
            cg.setLineWidth(0.75)
            cg.move(to: CGPoint(x: left, y: renderer.margin - 2))
            cg.addLine(to: CGPoint(x: left + width, y: renderer.margin - 2))
            cg.strokePath()

            let numberStyle = NSMutableParagraphStyle()
            numberStyle.alignment = .center
            let number = NSAttributedString(string: "— \(pageNumber) —", attributes: [
                .font: renderer.serif(10),
                .foregroundColor: LegacyBookRenderer.walnutLight,
                .paragraphStyle: numberStyle,
            ])
            number.draw(in: CGRect(x: left, y: renderer.pageRect.height - renderer.margin + 6, width: width, height: 16))

            y = top
        }

        mutating func ensureSpace(_ height: CGFloat) {
            if y + height > bottom { newPage() }
        }

        mutating func drawChapterHeader(_ category: StoryCategory) {
            ensureSpace(130)
            let title = NSAttributedString(string: category.name(renderer.language), attributes: [
                .font: renderer.serif(24, bold: true),
                .foregroundColor: LegacyBookRenderer.walnut,
            ])
            let size = title.boundingRect(with: CGSize(width: width, height: 200), options: [.usesLineFragmentOrigin], context: nil)
            title.draw(with: CGRect(x: left, y: y, width: width, height: ceil(size.height)), options: [.usesLineFragmentOrigin], context: nil)
            y += ceil(size.height) + 8

            let cg = context.cgContext
            cg.setStrokeColor(LegacyBookRenderer.gold.cgColor)
            cg.setLineWidth(2)
            cg.move(to: CGPoint(x: left, y: y))
            cg.addLine(to: CGPoint(x: left + 70, y: y))
            cg.strokePath()
            cg.setLineWidth(0.5)
            cg.move(to: CGPoint(x: left + 76, y: y))
            cg.addLine(to: CGPoint(x: left + width, y: y))
            cg.strokePath()
            y += 26
        }

        mutating func drawQuestion(_ question: Question, answer: String, photo: UIImage?) {
            ensureSpace(110)

            let label = NSAttributedString(
                string: renderer.t.fill(renderer.t.questionLabel, ["number": question.id]).uppercased(),
                attributes: [.font: UIFont.systemFont(ofSize: 9, weight: .bold), .foregroundColor: LegacyBookRenderer.goldDeep, .kern: 1.4]
            )
            label.draw(at: CGPoint(x: left, y: y))
            y += 16

            let questionStyle = NSMutableParagraphStyle()
            questionStyle.lineSpacing = 3
            drawFlowing(NSAttributedString(string: question.text(renderer.language), attributes: [
                .font: renderer.serif(15, bold: true),
                .foregroundColor: LegacyBookRenderer.ink,
                .paragraphStyle: questionStyle,
            ]), indent: 0)
            y += 8

            let answerStyle = NSMutableParagraphStyle()
            answerStyle.lineSpacing = 6
            answerStyle.paragraphSpacing = 8
            drawFlowing(NSAttributedString(string: answer, attributes: [
                .font: renderer.serif(12.5),
                .foregroundColor: LegacyBookRenderer.walnut,
                .paragraphStyle: answerStyle,
            ]), indent: 14, withRule: true)

            if let photo {
                y += 12
                let maxW: CGFloat = min(width - 14, 340)
                let maxH: CGFloat = 250
                let scale = min(maxW / photo.size.width, maxH / photo.size.height)
                let size = CGSize(width: photo.size.width * scale, height: photo.size.height * scale)
                ensureSpace(size.height + 16)
                let frame = CGRect(x: left + 14, y: y, width: size.width, height: size.height)
                let border = frame.insetBy(dx: -5, dy: -5)
                UIColor.white.setFill()
                UIRectFill(border)
                let cg = context.cgContext
                cg.setStrokeColor(LegacyBookRenderer.rule.cgColor)
                cg.setLineWidth(1)
                cg.stroke(border)
                photo.draw(in: frame)
                y += size.height + 10
            }

            y += 22
        }

        mutating func drawClosingQuote() {
            ensureSpace(120)
            y += 20
            let style = NSMutableParagraphStyle()
            style.alignment = .center
            let ornament = NSAttributedString(string: "❦", attributes: [.font: renderer.serif(22), .foregroundColor: LegacyBookRenderer.gold, .paragraphStyle: style])
            ornament.draw(in: CGRect(x: left, y: y, width: width, height: 30))
            y += 38
            drawFlowing(NSAttributedString(string: renderer.t.footerQuote, attributes: [
                .font: renderer.serif(14, italic: true),
                .foregroundColor: LegacyBookRenderer.walnutLight,
                .paragraphStyle: style,
            ]), indent: 30)
        }

        /// Draws text that can span multiple pages, splitting with Core Text.
        mutating func drawFlowing(_ text: NSAttributedString, indent: CGFloat, withRule: Bool = false) {
            guard text.length > 0 else { return }
            let framesetter = CTFramesetterCreateWithAttributedString(text)
            let textWidth = width - indent * (withRule ? 1 : 2)
            let x = left + indent
            var location = 0
            var emptyAttempts = 0

            while location < text.length {
                let available = bottom - y
                if available < 30 { newPage(); continue }

                var fit = CFRange()
                let suggested = CTFramesetterSuggestFrameSizeWithConstraints(
                    framesetter, CFRange(location: location, length: 0), nil,
                    CGSize(width: textWidth, height: available), &fit
                )
                if fit.length == 0 {
                    emptyAttempts += 1
                    if emptyAttempts > 2 { break }
                    newPage()
                    continue
                }
                emptyAttempts = 0

                let chunk = text.attributedSubstring(from: NSRange(location: location, length: fit.length))
                let height = ceil(suggested.height)
                chunk.draw(with: CGRect(x: x, y: y, width: textWidth, height: available),
                           options: [.usesLineFragmentOrigin, .usesFontLeading], context: nil)

                if withRule {
                    let cg = context.cgContext
                    cg.setStrokeColor(LegacyBookRenderer.gold.withAlphaComponent(0.7).cgColor)
                    cg.setLineWidth(2)
                    cg.move(to: CGPoint(x: left + 2, y: y + 2))
                    cg.addLine(to: CGPoint(x: left + 2, y: y + height))
                    cg.strokePath()
                }

                y += height
                location += fit.length
                if location < text.length { newPage() }
            }
        }
    }
}
