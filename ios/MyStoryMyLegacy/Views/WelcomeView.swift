import SwiftUI

struct WelcomeView: View {
    @Environment(LegacyStore.self) private var store
    @Environment(LanguageStore.self) private var languageStore
    @Environment(Router.self) private var router
    @Environment(VoiceSettings.self) private var voiceSettings

    @State private var slide = 0
    @State private var showNameEntry = false
    @State private var appeared = false
    @State private var reader = QuestionReader()

    private var t: Strings { languageStore.t }

    var body: some View {
        ZStack {
            ParchmentBackground()

            if showNameEntry {
                NameEntryView {
                    withAnimation(.smooth) { showNameEntry = false }
                    router.push(.questions)
                } onBack: {
                    withAnimation(.smooth) { showNameEntry = false }
                }
                .transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .opacity))
            } else {
                welcome
                    .transition(.opacity)
            }
        }
        .toolbar(.hidden, for: .navigationBar)
        .onAppear {
            withAnimation(.spring(response: 0.7, dampingFraction: 0.8).delay(0.05)) { appeared = true }
            // Give the entrance a moment, then read the instructions aloud.
            Task { @MainActor in
                try? await Task.sleep(for: .seconds(0.7))
                if !showNameEntry { readSlide() }
            }
        }
        .onDisappear {
            reader.stop()
        }
        .onChange(of: slide) { _, _ in readSlide() }
        .onChange(of: showNameEntry) { _, isShowing in
            if isShowing { reader.stop() }
        }
        .onChange(of: voiceSettings.isEnabled) { _, enabled in
            if enabled {
                readSlide()
            } else {
                reader.stop()
            }
        }
        .onChange(of: languageStore.language) { _, _ in
            if voiceSettings.isEnabled { readSlide() }
        }
    }

    // MARK: Voice

    private var slideSpokenText: String {
        switch slide {
        case 0:
            [t.welcomeTitle, t.welcomeText1, t.welcomeText2].joined(separator: " ")
        case 1:
            ([t.whoCanFillTitle, t.whoCanFillText] + t.bullets).joined(separator: " ")
        default:
            ([t.howToUseTitle] + t.steps.map { "\($0.title) \($0.text)" }).joined(separator: " ")
        }
    }

    private func readSlide() {
        guard voiceSettings.isEnabled, !showNameEntry else { return }
        reader.speak(slideSpokenText, language: languageStore.language)
    }

    private func toggleVoice() {
        Haptics.tap()
        voiceSettings.isEnabled.toggle()
    }

    private var welcome: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                Spacer()
                VoiceToggleButton(
                    isOn: voiceSettings.isEnabled,
                    onLabel: t.soundOn,
                    offLabel: t.soundOff
                ) {
                    toggleVoice()
                }
                LanguageToggle()
            }
            .padding(.horizontal, 20)
            .padding(.top, 6)

            header
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 12)

            carouselHeader
                .padding(.horizontal, 24)
                .padding(.top, 14)

            TabView(selection: $slide) {
                slideCard {
                    welcomeSlide
                }
                .tag(0)
                slideCard {
                    whoSlide
                }
                .tag(1)
                slideCard {
                    howSlide
                }
                .tag(2)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .frame(maxHeight: .infinity)
            .sensoryFeedback(.selection, trigger: slide)

            navigationRow
                .padding(.horizontal, 20)
                .padding(.bottom, 10)

            if store.answeredCount > 0 {
                progressSection
                    .padding(.horizontal, 20)
                    .padding(.bottom, 8)
            }
        }
    }

    // MARK: Header

    private var header: some View {
        VStack(spacing: 10) {
            BookEmblem(size: 76)
            Text(t.title)
                .font(.system(.largeTitle, design: .serif, weight: .bold))
                .foregroundStyle(Palette.ink)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.7)
                .lineLimit(2)
            Text(t.subtitle)
                .font(.system(.body, design: .serif).italic())
                .foregroundStyle(Palette.walnutLight)
                .multilineTextAlignment(.center)
        }
        .padding(.horizontal, 24)
        .padding(.top, 4)
    }

    private var carouselHeader: some View {
        HStack {
            Text(t.carouselTitle.uppercased())
                .font(.caption.weight(.bold))
                .kerning(1.4)
                .foregroundStyle(Palette.goldDeep)
            Spacer()
            HStack(spacing: 8) {
                ForEach(0..<3, id: \.self) { index in
                    Button {
                        withAnimation(.snappy) { slide = index }
                    } label: {
                        Capsule()
                            .fill(slide == index ? Palette.gold : Palette.borderStrong)
                            .frame(width: slide == index ? 24 : 8, height: 8)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("\(index + 1)")
                }
            }
            .animation(.snappy, value: slide)
        }
    }

    // MARK: Slides

    private func slideCard<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                content()
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .scrollIndicators(.hidden)
        .heirloomCard(padding: 22, radius: 24)
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
    }

    private func slideTitle(_ text: String, icon: String? = nil) -> some View {
        VStack(spacing: 10) {
            if let icon {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundStyle(Palette.gold)
            }
            Text(text)
                .font(.system(.title2, design: .serif, weight: .bold))
                .foregroundStyle(Palette.ink)
                .multilineTextAlignment(.center)
            Ornament()
        }
        .frame(maxWidth: .infinity)
        .padding(.bottom, 4)
    }

    private var welcomeSlide: some View {
        Group {
            slideTitle(t.welcomeTitle, icon: "book.pages")
            bodyText(t.welcomeText1)
            bodyText(t.welcomeText2)
        }
    }

    private var whoSlide: some View {
        Group {
            slideTitle(t.whoCanFillTitle, icon: "person.2")
            bodyText(t.whoCanFillText)
            ForEach(t.bullets, id: \.self) { bullet in
                HStack(alignment: .firstTextBaseline, spacing: 12) {
                    Text("❧")
                        .font(.title3)
                        .foregroundStyle(Palette.gold)
                    bodyText(bullet)
                }
            }
        }
    }

    private var howSlide: some View {
        Group {
            slideTitle(t.howToUseTitle, icon: "list.number")
            ForEach(Array(t.steps.enumerated()), id: \.offset) { index, step in
                HStack(alignment: .top, spacing: 14) {
                    Text("\(index + 1)")
                        .font(.system(.headline, design: .serif, weight: .bold))
                        .foregroundStyle(Palette.walnut)
                        .frame(width: 34, height: 34)
                        .background(Palette.chip, in: .circle)
                        .overlay { Circle().strokeBorder(Palette.gold, lineWidth: 1.5) }
                    VStack(alignment: .leading, spacing: 4) {
                        Text(step.title)
                            .font(.system(.headline, design: .serif))
                            .foregroundStyle(Palette.ink)
                        Text(step.text)
                            .font(.callout)
                            .foregroundStyle(Palette.walnutLight)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
    }

    private func bodyText(_ text: String) -> some View {
        Text(text)
            .font(.body)
            .foregroundStyle(Palette.walnut)
            .lineSpacing(5)
            .fixedSize(horizontal: false, vertical: true)
    }

    // MARK: Navigation

    private var navigationRow: some View {
        HStack {
            Button {
                withAnimation(.snappy) { slide -= 1 }
            } label: {
                Label(t.carouselPrevious, systemImage: "chevron.left")
                    .labelStyle(.titleAndIcon)
                    .font(.headline)
                    .foregroundStyle(Palette.walnut)
                    .padding(.vertical, 12)
                    .padding(.horizontal, 16)
                    .background(Palette.card, in: .capsule)
                    .overlay { Capsule().strokeBorder(Palette.border) }
            }
            .buttonStyle(PressableStyle())
            .opacity(slide > 0 ? 1 : 0)
            .disabled(slide == 0)

            Spacer()

            Button(t.carouselSkip) { start() }
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(Palette.muted)

            Spacer()

            Button {
                if slide < 2 {
                    withAnimation(.snappy) { slide += 1 }
                } else {
                    start()
                }
            } label: {
                HStack(spacing: 6) {
                    Text(slide == 2 ? t.carouselStart : t.carouselNext)
                    Image(systemName: "chevron.right")
                }
                .font(.headline)
                .foregroundStyle(slide == 2 ? Palette.onDark : Palette.walnut)
                .padding(.vertical, 12)
                .padding(.horizontal, 18)
                .background {
                    if slide == 2 {
                        Capsule().fill(Palette.walnutGradient)
                    } else {
                        Capsule().fill(Palette.card)
                    }
                }
                .overlay { Capsule().strokeBorder(slide == 2 ? Palette.gold.opacity(0.5) : Palette.border) }
            }
            .buttonStyle(PressableStyle())
        }
    }

    private var progressSection: some View {
        VStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(t.progressTitle)
                        .font(.system(.headline, design: .serif))
                        .foregroundStyle(Palette.ink)
                    Spacer()
                    Text("\(store.answeredCount)/\(store.totalCount)")
                        .font(.subheadline.weight(.bold).monospacedDigit())
                        .foregroundStyle(Palette.goldDeep)
                }
                GoldProgressBar(value: Double(store.answeredCount) / Double(store.totalCount))
                Text(t.fill(t.progressText, ["answered": store.answeredCount, "total": store.totalCount]))
                    .font(.footnote)
                    .foregroundStyle(Palette.walnutLight)
            }
            .heirloomCard(padding: 16, radius: 18)

            WalnutButton(title: t.continueButton, trailingImage: "chevron.right") {
                Haptics.tap()
                start()
            }
        }
    }

    private func start() {
        Haptics.tap()
        if store.personName.trimmingCharacters(in: .whitespaces).isEmpty {
            withAnimation(.smooth) { showNameEntry = true }
        } else {
            router.push(.questions)
        }
    }
}

struct NameEntryView: View {
    @Environment(LegacyStore.self) private var store
    @Environment(LanguageStore.self) private var languageStore
    let onContinue: () -> Void
    let onBack: () -> Void

    @State private var name = ""
    @FocusState private var focused: Bool

    private var t: Strings { languageStore.t }
    private var isValid: Bool { !name.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onBack) {
                    Image(systemName: "chevron.left")
                        .font(.headline)
                        .foregroundStyle(Palette.walnut)
                        .frame(width: 44, height: 44)
                        .background(Palette.card, in: .circle)
                        .overlay { Circle().strokeBorder(Palette.border) }
                }
                .accessibilityLabel(t.carouselPrevious)
                Spacer()
                LanguageToggle()
            }
            .padding(.horizontal, 20)
            .padding(.top, 6)

            ScrollView {
                VStack(spacing: 18) {
                    BookEmblem(size: 92)
                        .padding(.top, 8)
                    Text(t.title)
                        .font(.system(.title, design: .serif, weight: .bold))
                        .foregroundStyle(Palette.ink)
                        .multilineTextAlignment(.center)
                    Ornament()
                    Text(t.namePrompt)
                        .font(.system(.title3, design: .serif).italic())
                        .foregroundStyle(Palette.walnutLight)
                        .multilineTextAlignment(.center)

                    TextField(t.namePlaceholder, text: $name)
                        .font(.system(.title2, design: .serif))
                        .foregroundStyle(Palette.ink)
                        .multilineTextAlignment(.center)
                        .textInputAutocapitalization(.words)
                        .autocorrectionDisabled()
                        .submitLabel(.go)
                        .focused($focused)
                        .onSubmit(submit)
                        .padding(.vertical, 16)
                        .padding(.horizontal, 16)
                        .background(Palette.cream, in: .rect(cornerRadius: 16))
                        .overlay {
                            RoundedRectangle(cornerRadius: 16)
                                .strokeBorder(focused ? Palette.gold : Palette.borderStrong, lineWidth: focused ? 2 : 1)
                        }
                        .animation(.snappy, value: focused)

                    WalnutButton(title: t.nameButton, trailingImage: "chevron.right", isEnabled: isValid, action: submit)
                        .padding(.top, 4)
                }
                .heirloomCard(padding: 26, radius: 28)
                .padding(.horizontal, 20)
                .padding(.vertical, 24)
            }
            .scrollDismissesKeyboard(.interactively)
        }
        .onAppear { focused = true }
    }

    private func submit() {
        guard isValid else { return }
        store.personName = name.trimmingCharacters(in: .whitespaces)
        Haptics.success()
        focused = false
        onContinue()
    }
}
