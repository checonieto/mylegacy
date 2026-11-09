import SwiftUI
import UIKit

struct BookView: View {
    @Environment(LegacyStore.self) private var store
    @Environment(LanguageStore.self) private var languageStore
    @Environment(Router.self) private var router
    @Environment(\.dismiss) private var dismiss

    @State private var pdfURL: URL?
    @State private var isGenerating = false
    @State private var showSuccess = false
    @State private var showError = false
    @State private var showStartNew = false
    @State private var appeared = false

    private var t: Strings { languageStore.t }

    var body: some View {
        VStack(spacing: 0) {
            if !store.personName.isEmpty {
                NameBanner(prefix: t.recordingFor, name: store.personName)
            }

            ScrollView {
                VStack(spacing: 22) {
                    header
                    summaryCard
                    if let pdfURL {
                        readyCard(pdfURL)
                    } else {
                        previewCard
                    }
                    actions
                }
                .padding(.horizontal, 20)
                .padding(.top, 24)
                .padding(.bottom, 32)
            }
        }
        .background(ParchmentBackground())
        .navigationTitle(t.navBook)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            withAnimation(.spring(response: 0.7, dampingFraction: 0.75)) { appeared = true }
        }
        .onChange(of: languageStore.language) { _, _ in pdfURL = nil }
        .alert(t.successTitle, isPresented: $showSuccess) {
            Button(t.ok, role: .cancel) {}
        } message: {
            Text(t.successMessage)
        }
        .alert(t.errorTitle, isPresented: $showError) {
            Button(t.ok, role: .cancel) {}
        } message: {
            Text(t.errorMessage)
        }
        .alert(t.startNewTitle, isPresented: $showStartNew) {
            Button(t.cancel, role: .cancel) {}
            Button(t.startNewButton, role: .destructive) {
                store.clearAll()
                router.popToRoot()
            }
        } message: {
            Text(t.startNewMessage)
        }
    }

    // MARK: - Sections

    private var header: some View {
        VStack(spacing: 14) {
            BookEmblem(size: 96)
                .scaleEffect(appeared ? 1 : 0.6)
                .opacity(appeared ? 1 : 0)
            Text(t.pdfTitle)
                .font(.system(.largeTitle, design: .serif, weight: .bold))
                .foregroundStyle(Palette.ink)
            Ornament()
            Text(t.pdfSubtitle)
                .font(.body)
                .foregroundStyle(Palette.walnutLight)
        }
        .multilineTextAlignment(.center)
    }

    private var summaryCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(t.summaryTitle)
                .font(.system(.title3, design: .serif, weight: .bold))
                .foregroundStyle(Palette.walnut)
            summaryRow(icon: "checkmark.circle.fill", label: t.questionsAnswered, value: "\(store.answeredCount) / \(store.totalCount)")
            Divider().overlay(Palette.border)
            summaryRow(icon: "books.vertical.fill", label: t.categoriesCompleted, value: "\(store.completedCategories) / \(StoryCategory.allCases.count)")
            Divider().overlay(Palette.border)
            summaryRow(icon: "photo.fill", label: t.photosIncluded, value: "\(store.photos.count)")
        }
        .heirloomCard()
    }

    private func summaryRow(icon: String, label: String, value: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(Palette.goldDeep)
                .frame(width: 28)
            Text(label)
                .font(.body)
                .foregroundStyle(Palette.ink)
            Spacer(minLength: 8)
            Text(value)
                .font(.system(.title3, design: .serif, weight: .bold))
                .foregroundStyle(Palette.walnut)
                .monospacedDigit()
        }
    }

    private var previewCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(t.previewTitle)
                .font(.system(.title3, design: .serif, weight: .bold))
                .foregroundStyle(Palette.walnut)
            ForEach(t.previews, id: \.self) { item in
                HStack(alignment: .top, spacing: 12) {
                    Image(systemName: "checkmark.seal.fill")
                        .foregroundStyle(Palette.gold)
                    Text(item)
                        .font(.body)
                        .foregroundStyle(Palette.ink)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .heirloomCard()
    }

    private func readyCard(_ url: URL) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 48))
                .foregroundStyle(Palette.gold)
                .symbolEffect(.bounce, value: url)
            Text(t.bookReady)
                .font(.system(.title2, design: .serif, weight: .bold))
                .foregroundStyle(Palette.walnut)

            HStack(spacing: 12) {
                Button {
                    Haptics.tap()
                    printBook(url)
                } label: {
                    Label(t.print, systemImage: "printer.fill")
                        .font(.headline)
                        .foregroundStyle(Palette.walnut)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 15)
                        .background(Palette.chip, in: .capsule)
                        .overlay { Capsule().strokeBorder(Palette.borderStrong, lineWidth: 1) }
                }
                .buttonStyle(PressableStyle())

                ShareLink(item: url) {
                    Label(t.share, systemImage: "square.and.arrow.up")
                        .font(.headline)
                        .foregroundStyle(Palette.onDark)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 15)
                        .background(Palette.walnutGradient, in: .capsule)
                }
                .buttonStyle(PressableStyle())
            }
        }
        .frame(maxWidth: .infinity)
        .heirloomCard(padding: 22)
        .transition(.scale(scale: 0.92).combined(with: .opacity))
    }

    private var actions: some View {
        VStack(spacing: 14) {
            WalnutButton(
                title: isGenerating ? t.generating : (pdfURL == nil ? t.generatePDF : t.regenerate),
                systemImage: pdfURL == nil ? "doc.richtext.fill" : "arrow.clockwise",
                isEnabled: store.answeredCount > 0,
                isLoading: isGenerating
            ) {
                generate()
            }

            Button {
                Haptics.tap()
                dismiss()
            } label: {
                Label(t.back, systemImage: "chevron.left")
                    .font(.headline)
                    .foregroundStyle(Palette.walnut)
                    .padding(.vertical, 12)
            }
            .buttonStyle(PressableStyle())

            StartNewStoryButton(title: t.startNewButton) {
                Haptics.medium()
                showStartNew = true
            }
        }
    }

    // MARK: - Actions

    private func generate() {
        guard !isGenerating else { return }
        Haptics.medium()
        isGenerating = true
        let renderer = LegacyBookRenderer(
            personName: store.personName,
            language: languageStore.language,
            answers: store.answers,
            photos: store.photos
        )
        Task {
            // Let the loading state render before the drawing work starts.
            try? await Task.sleep(for: .milliseconds(120))
            do {
                let url = try renderer.render()
                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) { pdfURL = url }
                isGenerating = false
                Haptics.success()
                showSuccess = true
            } catch {
                isGenerating = false
                showError = true
            }
        }
    }

    private func printBook(_ url: URL) {
        let controller = UIPrintInteractionController.shared
        let info = UIPrintInfo(dictionary: nil)
        info.outputType = .general
        info.jobName = t.navBook
        controller.printInfo = info
        controller.printingItem = url
        controller.present(animated: true)
    }
}
