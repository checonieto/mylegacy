import SwiftUI

struct ReviewView: View {
    @Environment(LegacyStore.self) private var store
    @Environment(LanguageStore.self) private var languageStore
    @Environment(Router.self) private var router

    @State private var editingId: Int?
    @State private var draft: String = ""
    @State private var showStartNew = false
    @State private var showNoAnswers = false
    @State private var showIncomplete = false
    @FocusState private var editorFocused: Bool

    private var t: Strings { languageStore.t }
    private var language: AppLanguage { languageStore.language }

    private var answeredCategories: [StoryCategory] {
        StoryCategory.allCases.filter { cat in
            cat.questions.contains { store.hasAnswer($0.id) || store.photos[$0.id] != nil }
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            if !store.personName.isEmpty {
                NameBanner(prefix: t.recordingFor, name: store.personName)
            }

            ScrollView {
                VStack(spacing: 22) {
                    header

                    if answeredCategories.isEmpty {
                        emptyState
                    } else {
                        ForEach(answeredCategories, id: \.self) { category in
                            categorySection(category)
                        }
                    }

                    StartNewStoryButton(title: t.startNewButton) {
                        Haptics.medium()
                        showStartNew = true
                    }
                    .padding(.top, 8)
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
                .padding(.bottom, 24)
            }
            .scrollDismissesKeyboard(.interactively)

            bottomBar
        }
        .background(ParchmentBackground())
        .navigationTitle(t.navReview)
        .navigationBarTitleDisplayMode(.inline)
        .alert(t.startNewTitle, isPresented: $showStartNew) {
            Button(t.cancel, role: .cancel) {}
            Button(t.startNewButton, role: .destructive) {
                store.clearAll()
                router.popToRoot()
            }
        } message: {
            Text(t.startNewMessage)
        }
        .alert(t.noAnswersTitle, isPresented: $showNoAnswers) {
            Button(t.ok, role: .cancel) {}
        } message: {
            Text(t.noAnswersMessage)
        }
        .alert(t.incompleteTitle, isPresented: $showIncomplete) {
            Button(t.cancel, role: .cancel) {}
            Button(t.generateBookButton) { router.push(.book) }
        } message: {
            Text(t.fill(t.incompleteMessage, ["answered": store.answeredCount, "total": store.totalCount]))
        }
    }

    // MARK: - Sections

    private var header: some View {
        VStack(spacing: 10) {
            Text(t.reviewTitle)
                .font(.system(.largeTitle, design: .serif, weight: .bold))
                .foregroundStyle(Palette.ink)
            Ornament()
            Text(t.fill(t.reviewSubtitle, ["answered": store.answeredCount, "total": store.totalCount]))
                .font(.body)
                .foregroundStyle(Palette.walnutLight)
            GoldProgressBar(value: Double(store.answeredCount) / Double(max(store.totalCount, 1)))
                .padding(.horizontal, 30)
                .padding(.top, 4)
        }
        .multilineTextAlignment(.center)
    }

    private var emptyState: some View {
        VStack(spacing: 18) {
            Image(systemName: "text.book.closed")
                .font(.system(size: 44, weight: .light))
                .foregroundStyle(Palette.goldDeep)
            Text(t.emptyState)
                .font(.system(.title3, design: .serif))
                .foregroundStyle(Palette.walnut)
                .multilineTextAlignment(.center)
            WalnutButton(title: t.startNow, trailingImage: "arrow.right") {
                Haptics.tap()
                router.push(.questions)
            }
        }
        .frame(maxWidth: .infinity)
        .heirloomCard(padding: 28)
    }

    private func categorySection(_ category: StoryCategory) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 10) {
                Text(category.icon).font(.title2)
                Text(category.name(language))
                    .font(.system(.title2, design: .serif, weight: .bold))
                    .foregroundStyle(Palette.walnut)
                Spacer(minLength: 0)
            }
            Rectangle().fill(Palette.gold.opacity(0.5)).frame(height: 1)

            ForEach(category.questions.filter { store.hasAnswer($0.id) || store.photos[$0.id] != nil }, id: \.id) { question in
                answerCard(question)
            }
        }
    }

    private func answerCard(_ question: Question) -> some View {
        let isEditing = editingId == question.id
        let number = (Question.all.firstIndex(where: { $0.id == question.id }) ?? 0) + 1

        return VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .firstTextBaseline) {
                Text(t.fill(t.questionLabel, ["number": number]).uppercased())
                    .font(.caption.weight(.bold))
                    .tracking(1.2)
                    .foregroundStyle(Palette.goldDeep)
                Spacer()
                if !isEditing {
                    Button {
                        Haptics.tap()
                        draft = store.answers[question.id] ?? ""
                        withAnimation(.snappy) { editingId = question.id }
                        editorFocused = true
                    } label: {
                        Label(t.edit, systemImage: "pencil")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(Palette.walnut)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Palette.chip, in: .capsule)
                    }
                    .buttonStyle(PressableStyle())
                }
            }

            Text(question.text(language))
                .font(.system(.title3, design: .serif, weight: .semibold))
                .foregroundStyle(Palette.ink)
                .fixedSize(horizontal: false, vertical: true)

            if isEditing {
                ZStack(alignment: .topLeading) {
                    if draft.isEmpty {
                        Text(t.placeholderEdit)
                            .font(.title3)
                            .foregroundStyle(Palette.muted)
                            .padding(.horizontal, 17)
                            .padding(.vertical, 20)
                    }
                    TextEditor(text: $draft)
                        .font(.title3)
                        .foregroundStyle(Palette.ink)
                        .scrollContentBackground(.hidden)
                        .focused($editorFocused)
                        .frame(minHeight: 150)
                        .padding(12)
                }
                .background(Palette.cream, in: .rect(cornerRadius: 14))
                .overlay { RoundedRectangle(cornerRadius: 14).strokeBorder(Palette.gold, lineWidth: 1.5) }

                HStack(spacing: 12) {
                    Button {
                        editorFocused = false
                        withAnimation(.snappy) { editingId = nil }
                    } label: {
                        Text(t.cancel)
                            .font(.headline)
                            .foregroundStyle(Palette.walnut)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Palette.chip, in: .capsule)
                            .overlay { Capsule().strokeBorder(Palette.borderStrong, lineWidth: 1) }
                    }
                    .buttonStyle(PressableStyle())

                    Button {
                        saveDraft(for: question.id)
                    } label: {
                        Label(t.save, systemImage: "checkmark")
                            .font(.headline)
                            .foregroundStyle(Palette.onDark)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Palette.walnutGradient, in: .capsule)
                    }
                    .buttonStyle(PressableStyle())
                }
            } else {
                HStack(alignment: .top, spacing: 12) {
                    Rectangle().fill(Palette.gold).frame(width: 3)
                    Text(store.hasAnswer(question.id) ? (store.answers[question.id] ?? "") : t.noAnswer)
                        .font(.system(.title3, design: .serif))
                        .italic(!store.hasAnswer(question.id))
                        .foregroundStyle(store.hasAnswer(question.id) ? Palette.ink : Palette.muted)
                        .lineSpacing(4)
                        .fixedSize(horizontal: false, vertical: true)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }

            if let photo = store.photos[question.id] {
                VStack(alignment: .leading, spacing: 6) {
                    Image(uiImage: photo)
                        .resizable()
                        .scaledToFill()
                        .frame(maxWidth: .infinity)
                        .frame(height: 200)
                        .clipShape(.rect(cornerRadius: 12))
                        .overlay { RoundedRectangle(cornerRadius: 12).strokeBorder(Palette.border, lineWidth: 1) }
                    Label(t.photoLabel, systemImage: "photo")
                        .font(.footnote)
                        .foregroundStyle(Palette.walnutLight)
                }
            }
        }
        .heirloomCard(padding: 18, radius: 18)
    }

    private var bottomBar: some View {
        WalnutButton(title: t.generateBookButton, systemImage: "book.closed.fill") {
            Haptics.medium()
            if store.answeredCount == 0 {
                showNoAnswers = true
            } else if store.answeredCount < store.totalCount {
                showIncomplete = true
            } else {
                router.push(.book)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 12)
        .padding(.bottom, 8)
        .background(Palette.card.opacity(0.96))
        .overlay(alignment: .top) { Rectangle().fill(Palette.border).frame(height: 1) }
    }

    // MARK: - Actions

    private func saveDraft(for id: Int) {
        let trimmed = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            store.answers[id] = nil
        } else {
            store.saveAnswer(trimmed, for: id)
        }
        Haptics.success()
        editorFocused = false
        withAnimation(.snappy) { editingId = nil }
    }
}
