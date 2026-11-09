import PhotosUI
import SwiftUI

struct QuestionsView: View {
    @Environment(LegacyStore.self) private var store
    @Environment(LanguageStore.self) private var languageStore
    @Environment(Router.self) private var router
    @Environment(\.openURL) private var openURL

    @State private var index = 0
    @State private var draft = ""
    @State private var mode: InputMode = .text
    @State private var soundOn = true
    @State private var reader = QuestionReader()
    @State private var recorder = VoiceRecorder()
    @State private var photoItem: PhotosPickerItem?
    @State private var showRemovePhoto = false
    @State private var showFinished = false
    @State private var showMicDenied = false
    @State private var errorMessage: String?
    @State private var savedPulse = false
    @State private var didAppear = false
    @FocusState private var editorFocused: Bool

    enum InputMode { case text, voice }

    private var t: Strings { languageStore.t }
    private var language: AppLanguage { languageStore.language }
    private var question: Question { Question.all[index] }
    private var questionText: String { question.text(language) }
    private var spokenText: String { question.id == 1 ? "\(questionText) \(t.hint)" : questionText }
    private var trimmedDraft: String { draft.trimmingCharacters(in: .whitespacesAndNewlines) }

    var body: some View {
        VStack(spacing: 0) {
            if !store.personName.isEmpty {
                NameBanner(prefix: t.recordingFor, name: store.personName)
            }
            progressHeader

            ScrollViewReader { proxy in
                ScrollView {
                    VStack(spacing: 18) {
                        Color.clear.frame(height: 0).id("top")
                        categoryBadge
                        questionCard
                        hintCard
                        answerSection
                        photoSection
                        if !trimmedDraft.isEmpty {
                            saveButton
                                .transition(.move(edge: .bottom).combined(with: .opacity))
                        }
                        quickNavigation
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                    .padding(.bottom, 24)
                    .animation(.snappy, value: trimmedDraft.isEmpty)
                }
                .scrollDismissesKeyboard(.interactively)
                .onChange(of: index) { _, _ in
                    proxy.scrollTo("top", anchor: .top)
                }
            }
        }
        .background(ParchmentBackground())
        .safeAreaInset(edge: .bottom) { bottomBar }
        .navigationTitle(t.navQuestions)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    commitDraft()
                    router.push(.review)
                } label: {
                    Image(systemName: "text.book.closed")
                }
                .accessibilityLabel(t.viewAnswers)
            }
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button(t.save) {
                    commitDraft()
                    editorFocused = false
                }
                .fontWeight(.semibold)
            }
        }
        .onAppear {
            guard !didAppear else { return }
            didAppear = true
            if store.answeredCount > 0,
               let firstUnanswered = Question.all.firstIndex(where: { !store.hasAnswer($0.id) }),
               firstUnanswered != index {
                index = firstUnanswered
            } else {
                loadQuestion()
            }
        }
        .onDisappear {
            reader.stop()
            if recorder.phase == .recording { recorder.cancel() }
            commitDraft()
        }
        .onChange(of: index) { _, _ in loadQuestion() }
        .onChange(of: photoItem) { _, item in
            guard let item else { return }
            Task { await loadPhoto(item) }
        }
        .alert(t.removePhotoTitle, isPresented: $showRemovePhoto) {
            Button(t.cancel, role: .cancel) {}
            Button(t.remove, role: .destructive) {
                store.removePhoto(for: question.id)
                Haptics.medium()
            }
        } message: {
            Text(t.removePhotoMessage)
        }
        .alert(t.finishedTitle, isPresented: $showFinished) {
            Button(t.stayHere, role: .cancel) {}
            Button(t.viewAnswers) { router.push(.review) }
        } message: {
            Text(t.finishedMessage)
        }
        .alert(t.micPermissionTitle, isPresented: $showMicDenied) {
            Button(t.cancel, role: .cancel) {}
            Button(t.openSettings) {
                if let url = URL(string: UIApplication.openSettingsURLString) { openURL(url) }
            }
        } message: {
            Text(t.micPermissionMessage)
        }
        .alert(t.errorTitle, isPresented: Binding(get: { errorMessage != nil }, set: { if !$0 { errorMessage = nil } })) {
            Button(t.ok, role: .cancel) {}
        } message: {
            Text(errorMessage ?? "")
        }
        .sensoryFeedback(.success, trigger: savedPulse)
    }

    // MARK: - Header

    private var progressHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 14) {
                GoldProgressBar(value: Double(index + 1) / Double(Question.all.count))
                Button(action: toggleSound) {
                    Image(systemName: soundOn ? "speaker.wave.2.fill" : "speaker.slash.fill")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(soundOn ? Palette.onDark : Palette.muted)
                        .contentTransition(.symbolEffect(.replace))
                        .frame(width: 44, height: 44)
                        .background(soundOn ? AnyShapeStyle(Palette.walnutGradient) : AnyShapeStyle(Palette.card), in: .circle)
                        .overlay { Circle().strokeBorder(soundOn ? Palette.gold.opacity(0.6) : Palette.border, lineWidth: 1.5) }
                }
                .buttonStyle(PressableStyle())
                .accessibilityLabel(soundOn ? t.soundOn : t.soundOff)
            }
            Text(t.fill(t.questionOf, ["current": index + 1, "total": Question.all.count]))
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(Palette.walnutLight)
                .contentTransition(.numericText())
                .animation(.snappy, value: index)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
    }

    private var categoryBadge: some View {
        Text("\(question.category.icon)  \(question.category.name(language))")
            .font(.system(.subheadline, design: .serif, weight: .semibold))
            .foregroundStyle(Palette.walnut)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Palette.chip, in: .capsule)
            .overlay { Capsule().strokeBorder(Palette.gold.opacity(0.5), lineWidth: 1) }
            .frame(maxWidth: .infinity, alignment: .leading)
            .id("cat-\(question.category.rawValue)")
    }

    private var questionCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(t.fill(t.questionLabel, ["number": question.id]).uppercased())
                .font(.caption.weight(.bold))
                .kerning(1.4)
                .foregroundStyle(Palette.goldDeep)
            Text(questionText)
                .font(.system(.title2, design: .serif, weight: .semibold))
                .foregroundStyle(Palette.ink)
                .lineSpacing(4)
                .fixedSize(horizontal: false, vertical: true)
                .id(question.id)
                .transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .opacity))

            Button {
                if reader.isSpeaking {
                    reader.stop()
                } else {
                    reader.speak(spokenText, language: language)
                }
                Haptics.tap()
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: reader.isSpeaking ? "stop.fill" : "speaker.wave.2.fill")
                        .symbolEffect(.variableColor.iterative, isActive: reader.isSpeaking)
                    Text(reader.isSpeaking ? t.stopListening : t.listen)
                }
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(Palette.goldDeep)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Palette.gold.opacity(0.12), in: .capsule)
                .overlay { Capsule().strokeBorder(Palette.gold.opacity(0.45), lineWidth: 1) }
            }
            .buttonStyle(PressableStyle())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .heirloomCard(padding: 22, radius: 22)
        .overlay(alignment: .leading) {
            UnevenRoundedRectangle(topLeadingRadius: 22, bottomLeadingRadius: 22)
                .fill(Palette.gold)
                .frame(width: 5)
        }
        .animation(.smooth(duration: 0.35), value: question.id)
    }

    private var hintCard: some View {
        HStack(alignment: .center, spacing: 14) {
            HStack(spacing: -6) {
                ForEach(["pencil", "mic.fill", "camera.fill"], id: \.self) { icon in
                    Image(systemName: icon)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Palette.walnutLight)
                        .frame(width: 32, height: 32)
                        .background(Palette.card, in: .circle)
                        .overlay { Circle().strokeBorder(Palette.border, lineWidth: 1) }
                }
            }
            Text(t.hint)
                .font(.callout)
                .foregroundStyle(Palette.walnut)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Palette.chip.opacity(0.7), in: .rect(cornerRadius: 18))
        .overlay {
            RoundedRectangle(cornerRadius: 18)
                .strokeBorder(Palette.border, style: StrokeStyle(lineWidth: 1, dash: [4, 3]))
        }
    }

    // MARK: - Answer

    private var answerSection: some View {
        VStack(spacing: 14) {
            modePicker

            ZStack(alignment: .topLeading) {
                TextEditor(text: $draft)
                    .font(.system(.title3, design: .serif))
                    .foregroundStyle(Palette.ink)
                    .lineSpacing(4)
                    .scrollContentBackground(.hidden)
                    .focused($editorFocused)
                    .disabled(recorder.phase != .idle)
                    .padding(10)
                if draft.isEmpty {
                    Text(mode == .text ? t.placeholder : t.voicePlaceholder)
                        .font(.system(.title3, design: .serif))
                        .foregroundStyle(Palette.muted)
                        .padding(.horizontal, 15)
                        .padding(.vertical, 18)
                        .allowsHitTesting(false)
                }
            }
            .frame(minHeight: mode == .text ? 200 : 130)
            .background(Palette.card, in: .rect(cornerRadius: 18))
            .overlay {
                RoundedRectangle(cornerRadius: 18)
                    .strokeBorder(editorFocused ? Palette.gold : Palette.border, lineWidth: editorFocused ? 2 : 1)
            }
            .animation(.snappy, value: editorFocused)

            if mode == .voice {
                recordControl
                    .transition(.scale(scale: 0.9).combined(with: .opacity))
            }
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.85), value: mode)
    }

    private var modePicker: some View {
        HStack(spacing: 6) {
            modeButton(.text, title: t.writeMode, icon: "square.and.pencil")
            modeButton(.voice, title: t.recordMode, icon: "mic.fill")
        }
        .padding(5)
        .background(Palette.chip, in: .capsule)
        .overlay { Capsule().strokeBorder(Palette.border) }
    }

    private func modeButton(_ value: InputMode, title: String, icon: String) -> some View {
        let active = mode == value
        return Button {
            mode = value
            if value == .voice { editorFocused = false }
            Haptics.tap()
        } label: {
            Label(title, systemImage: icon)
                .font(.headline)
                .foregroundStyle(active ? Palette.onDark : Palette.walnutLight)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background {
                    if active { Capsule().fill(Palette.walnutGradient) }
                }
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(active ? .isSelected : [])
    }

    private var recordControl: some View {
        VStack(spacing: 14) {
            switch recorder.phase {
            case .transcribing:
                VStack(spacing: 12) {
                    ProgressView()
                        .controlSize(.large)
                        .tint(Palette.walnutLight)
                    Text(t.transcribing)
                        .font(.headline)
                        .foregroundStyle(Palette.walnutLight)
                }
                .frame(height: 150)
            case .recording, .idle:
                let isRecording = recorder.phase == .recording
                Button(action: toggleRecording) {
                    ZStack {
                        if isRecording {
                            TimelineView(.animation(minimumInterval: 1 / 20)) { _ in
                                let level = recorder.currentLevel()
                                ZStack {
                                    Circle()
                                        .fill(Palette.brick.opacity(0.12))
                                        .frame(width: 150, height: 150)
                                        .scaleEffect(0.8 + level * 0.35)
                                    Circle()
                                        .fill(Palette.brick.opacity(0.18))
                                        .frame(width: 120, height: 120)
                                        .scaleEffect(0.85 + level * 0.25)
                                }
                                .animation(.easeOut(duration: 0.12), value: level)
                            }
                        } else {
                            Circle()
                                .fill(Palette.gold.opacity(0.12))
                                .frame(width: 130, height: 130)
                        }
                        Circle()
                            .fill(isRecording ? AnyShapeStyle(Palette.brick) : AnyShapeStyle(Palette.card))
                            .frame(width: 96, height: 96)
                            .overlay { Circle().strokeBorder(isRecording ? Palette.onDark.opacity(0.4) : Palette.gold, lineWidth: 2.5) }
                            .shadow(color: (isRecording ? Palette.brick : Palette.walnut).opacity(0.3), radius: 12, y: 5)
                        Image(systemName: isRecording ? "stop.fill" : "mic.fill")
                            .font(.system(size: 36, weight: .semibold))
                            .foregroundStyle(isRecording ? Palette.onDark : Palette.walnut)
                            .contentTransition(.symbolEffect(.replace))
                    }
                    .frame(height: 150)
                }
                .buttonStyle(PressableStyle())
                .accessibilityLabel(isRecording ? t.stop : t.recordPrompt)

                if isRecording {
                    Text(timeString(recorder.elapsed))
                        .font(.system(.title3, design: .monospaced, weight: .semibold))
                        .foregroundStyle(Palette.brick)
                        .contentTransition(.numericText())
                }
                Text(isRecording ? t.recordingNow : t.recordPrompt)
                    .font(.headline)
                    .foregroundStyle(isRecording ? Palette.brick : Palette.walnutLight)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .animation(.snappy, value: recorder.phase)
    }

    // MARK: - Photo

    private var photoSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(t.photoTitle)
                    .font(.system(.headline, design: .serif))
                    .foregroundStyle(Palette.ink)
                Text(t.photoSubtitle)
                    .font(.footnote)
                    .foregroundStyle(Palette.walnutLight)
            }

            if let photo = store.photos[question.id] {
                Image(uiImage: photo)
                    .resizable()
                    .scaledToFill()
                    .frame(maxWidth: .infinity)
                    .frame(height: 220)
                    .clipShape(.rect(cornerRadius: 14))
                    .padding(6)
                    .background(Color.white, in: .rect(cornerRadius: 18))
                    .overlay { RoundedRectangle(cornerRadius: 18).strokeBorder(Palette.border) }
                    .overlay(alignment: .topTrailing) {
                        HStack(spacing: 8) {
                            PhotosPicker(selection: $photoItem, matching: .images) {
                                Label(t.changePhoto, systemImage: "photo")
                                    .font(.footnote.weight(.semibold))
                                    .foregroundStyle(Palette.onDark)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .background(Palette.walnut.opacity(0.85), in: .capsule)
                            }
                            Button {
                                showRemovePhoto = true
                            } label: {
                                Image(systemName: "trash.fill")
                                    .font(.footnote.weight(.semibold))
                                    .foregroundStyle(Palette.onDark)
                                    .frame(width: 34, height: 34)
                                    .background(Palette.brick, in: .circle)
                            }
                            .accessibilityLabel(t.remove)
                        }
                        .padding(14)
                    }
                    .transition(.scale(scale: 0.95).combined(with: .opacity))
            } else {
                PhotosPicker(selection: $photoItem, matching: .images) {
                    VStack(spacing: 8) {
                        Image(systemName: "camera.fill")
                            .font(.title2)
                        Text(t.addPhoto)
                            .font(.headline)
                    }
                    .foregroundStyle(Palette.walnutLight)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 26)
                    .background(Palette.card.opacity(0.7), in: .rect(cornerRadius: 18))
                    .overlay {
                        RoundedRectangle(cornerRadius: 18)
                            .strokeBorder(Palette.borderStrong, style: StrokeStyle(lineWidth: 1.5, dash: [6, 4]))
                    }
                }
                .buttonStyle(PressableStyle())
            }
        }
        .animation(.smooth, value: store.photos[question.id] != nil)
    }

    private var saveButton: some View {
        WalnutButton(
            title: isDraftSaved ? t.saved : t.saveButton,
            systemImage: isDraftSaved ? "checkmark.seal.fill" : "checkmark"
        ) {
            commitDraft()
            editorFocused = false
        }
    }

    private var isDraftSaved: Bool {
        store.answers[question.id] == trimmedDraft
    }

    // MARK: - Quick navigation

    private var quickNavigation: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(t.quickNav.uppercased())
                .font(.caption.weight(.bold))
                .kerning(1.2)
                .foregroundStyle(Palette.goldDeep)
            ScrollViewReader { proxy in
                ScrollView(.horizontal) {
                    LazyHStack(spacing: 8) {
                        ForEach(Array(Question.all.enumerated()), id: \.element.id) { i, q in
                            quickNavChip(index: i, question: q)
                                .id(q.id)
                        }
                    }
                    .padding(.vertical, 6)
                    .padding(.horizontal, 2)
                }
                .scrollIndicators(.hidden)
                .onAppear { proxy.scrollTo(question.id, anchor: .center) }
                .onChange(of: index) { _, _ in
                    withAnimation(.snappy) { proxy.scrollTo(question.id, anchor: .center) }
                }
            }
        }
        .padding(.top, 6)
    }

    private func quickNavChip(index i: Int, question q: Question) -> some View {
        let isCurrent = i == index
        let answered = store.hasAnswer(q.id)
        return Button {
            commitDraft()
            index = i
            Haptics.tap()
        } label: {
            Text("\(q.id)")
                .font(.system(.subheadline, design: .serif, weight: .bold))
                .foregroundStyle(isCurrent ? Palette.onDark : (answered ? Palette.walnut : Palette.muted))
                .frame(width: 44, height: 44)
                .background {
                    if isCurrent {
                        Circle().fill(Palette.walnutGradient)
                    } else if answered {
                        Circle().fill(Palette.gold.opacity(0.22))
                    } else {
                        Circle().fill(Palette.card)
                    }
                }
                .overlay {
                    Circle().strokeBorder(isCurrent ? Palette.gold : (answered ? Palette.gold.opacity(0.6) : Palette.border), lineWidth: isCurrent ? 2 : 1)
                }
                .overlay(alignment: .topTrailing) {
                    if store.photos[q.id] != nil {
                        Image(systemName: "camera.fill")
                            .font(.system(size: 7, weight: .bold))
                            .foregroundStyle(Palette.walnut)
                            .frame(width: 16, height: 16)
                            .background(Palette.card, in: .circle)
                            .overlay { Circle().strokeBorder(Palette.gold, lineWidth: 1) }
                            .offset(x: 3, y: -3)
                    }
                }
        }
        .buttonStyle(PressableStyle())
    }

    // MARK: - Bottom bar

    private var bottomBar: some View {
        HStack(spacing: 12) {
            Button(action: goPrevious) {
                HStack(spacing: 6) {
                    Image(systemName: "chevron.left")
                    Text(t.previous)
                }
                .font(.headline)
                .foregroundStyle(index == 0 ? Palette.borderStrong : Palette.walnutLight)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 15)
                .background(Palette.card, in: .capsule)
                .overlay { Capsule().strokeBorder(index == 0 ? Palette.border : Palette.borderStrong, lineWidth: 1.5) }
            }
            .buttonStyle(PressableStyle())
            .disabled(index == 0)

            Button(action: goNext) {
                HStack(spacing: 6) {
                    Text(index == Question.all.count - 1 ? t.finish : t.next)
                    Image(systemName: index == Question.all.count - 1 ? "checkmark" : "chevron.right")
                }
                .font(.headline)
                .foregroundStyle(Palette.onDark)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 15)
                .background(Palette.walnutGradient, in: .capsule)
                .overlay { Capsule().strokeBorder(Palette.gold.opacity(0.5), lineWidth: 1) }
                .shadow(color: Palette.walnut.opacity(0.25), radius: 8, y: 4)
            }
            .buttonStyle(PressableStyle())
        }
        .padding(.horizontal, 20)
        .padding(.top, 12)
        .padding(.bottom, 8)
        .background {
            Palette.card
                .overlay(alignment: .top) { Rectangle().fill(Palette.border).frame(height: 1) }
                .ignoresSafeArea()
        }
    }

    // MARK: - Actions

    private func loadQuestion() {
        draft = store.answers[question.id] ?? ""
        reader.stop()
        if soundOn {
            reader.speak(spokenText, language: language)
        }
    }

    private func commitDraft() {
        let text = trimmedDraft
        guard !text.isEmpty, store.answers[question.id] != text else { return }
        store.saveAnswer(text, for: question.id)
        savedPulse.toggle()
    }

    private func goNext() {
        Haptics.tap()
        if recorder.phase == .recording { recorder.cancel() }
        commitDraft()
        if index < Question.all.count - 1 {
            withAnimation(.smooth) { index += 1 }
        } else {
            showFinished = true
        }
    }

    private func goPrevious() {
        Haptics.tap()
        if recorder.phase == .recording { recorder.cancel() }
        commitDraft()
        if index > 0 {
            withAnimation(.smooth) { index -= 1 }
        }
    }

    private func toggleSound() {
        Haptics.tap()
        if soundOn {
            reader.stop()
        } else {
            reader.speak(questionText, language: language)
        }
        withAnimation(.snappy) { soundOn.toggle() }
    }

    private func toggleRecording() {
        switch recorder.phase {
        case .idle:
            reader.stop()
            editorFocused = false
            Haptics.medium()
            Task {
                do {
                    try await recorder.start()
                } catch VoiceRecorder.RecorderError.permissionDenied {
                    showMicDenied = true
                } catch {
                    errorMessage = t.recordError
                }
            }
        case .recording:
            Haptics.medium()
            let questionID = question.id
            Task {
                do {
                    let text = try await recorder.stopAndTranscribe(language: language)
                    guard !text.isEmpty else { return }
                    if questionID == question.id {
                        draft = draft.isEmpty ? text : "\(draft) \(text)"
                        commitDraft()
                    }
                } catch {
                    errorMessage = t.transcribeError
                }
            }
        case .transcribing:
            break
        }
    }

    private func loadPhoto(_ item: PhotosPickerItem) async {
        defer { photoItem = nil }
        do {
            guard let data = try await item.loadTransferable(type: Data.self),
                  let image = UIImage(data: data) else {
                errorMessage = t.photoError
                return
            }
            store.savePhoto(image, for: question.id)
            Haptics.success()
        } catch {
            errorMessage = t.photoError
        }
    }

    private func timeString(_ interval: TimeInterval) -> String {
        let seconds = Int(interval)
        return String(format: "%d:%02d", seconds / 60, seconds % 60)
    }
}
