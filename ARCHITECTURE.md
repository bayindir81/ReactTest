# 🏗️ EnglishLearnTV - Uygulama Mimarisi ve Veri Akışı

## 📐 Genel Mimari

### Katmanlı Mimari

```
┌─────────────────────────────────────────────────┐
│          UI Layer (Screens & Components)        │
│  ┌─────────────┐  ┌──────────────┐             │
│  │  Screens    │  │  Components  │             │
│  └─────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘
                      ↓ ↑
┌─────────────────────────────────────────────────┐
│         State Management (Context API)          │
│              AppContext.tsx                      │
└─────────────────────────────────────────────────┘
                      ↓ ↑
┌─────────────────────────────────────────────────┐
│           Services & Utilities Layer            │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐       │
│  │   API   │  │  Parser  │  │   TTS    │       │
│  └─────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────┘
                      ↓ ↑
┌─────────────────────────────────────────────────┐
│              Data Layer                          │
│  ┌────────────┐       ┌─────────────┐          │
│  │ AsyncStorage│      │  Mock Data  │          │
│  └────────────┘       └─────────────┘          │
└─────────────────────────────────────────────────┘
```

## 🔄 Veri Akış Diyagramı

### 1. Uygulama Başlangıcı

```
App.tsx
  │
  ├─→ AppProvider (Context)
  │     ├─→ Load User Words (AsyncStorage)
  │     ├─→ Load User Progress (AsyncStorage)
  │     └─→ Fetch Series (API)
  │
  └─→ RootNavigator
        └─→ MainTabs (Bottom Tab Navigator)
              ├─→ ExploreScreen
              ├─→ WordListScreen
              ├─→ LearningScreen
              ├─→ AnalyticsScreen
              └─→ ProfileScreen
```

### 2. Dizi Keşfetme → Altyazı Okuma Akışı

```
ExploreScreen
  │
  ├─→ User taps series card
  │
  ├─→ Navigate to SeriesDetailScreen
  │     │
  │     ├─→ selectSeries(seriesId)
  │     │     └─→ fetchEpisodes(seriesId)
  │     │
  │     └─→ Display episodes
  │           │
  │           └─→ User taps episode
  │                 │
  │                 └─→ Navigate to SubtitlePlayerScreen
  │                       │
  │                       ├─→ loadSubtitle(episodeId)
  │                       │     ├─→ fetchEpisode()
  │                       │     └─→ fetchSubtitle()
  │                       │           └─→ parseSubtitleToWords()
  │                       │
  │                       └─→ Display subtitle lines
  │                             │
  │                             ├─→ User taps word
  │                             │     ├─→ fetchWordDefinition()
  │                             │     ├─→ speakWord()
  │                             │     └─→ Show WordDefinition Modal
  │                             │           │
  │                             │           └─→ User clicks "I Know" / "I Don't Know"
  │                             │                 └─→ addUserWord()
  │                             │                       └─→ Save to AsyncStorage
  │                             │
  │                             └─→ User taps sentence
  │                                   └─→ speakSentence()
```

### 3. Kelime Öğrenme Akışı

```
WordListScreen
  │
  ├─→ Display userWords[]
  │     ├─→ Filter by status (known/unknown/learning)
  │     └─→ Each word shows WordCard component
  │
  └─→ User navigates to LearningScreen
        │
        ├─→ Choose learning mode
        │     ├─→ Word Mode (Flashcard)
        │     ├─→ Sentence Mode
        │     └─→ Subtitle Mode
        │
        └─→ Navigate to LearningModeScreen
              │
              ├─→ startLearningSession(mode, words)
              │     └─→ Create LearningSession with FlashCards
              │
              ├─→ Show flashcards
              │     ├─→ Display word
              │     ├─→ User taps to flip
              │     └─→ Show definition/example
              │
              ├─→ User marks correct/wrong
              │     └─→ reviewWord(wordId, correct)
              │           └─→ Update session stats
              │
              └─→ Session complete
                    └─→ endLearningSession()
                          ├─→ Calculate duration
                          ├─→ Update daily progress
                          └─→ Save to AsyncStorage
```

## 🎯 State Management Detayları

### AppContext State Yapısı

```typescript
AppState {
  // Series State
  series: Series[]                  // All available series
  selectedSeries: Series | null     // Currently viewing series
  episodes: Episode[]               // Episodes of selected series

  // Subtitle State
  currentSubtitle: Subtitle | null  // Current subtitle being viewed
  currentEpisode: Episode | null    // Current episode

  // User Data
  userWords: UserWord[]             // User's saved words
  wordStats: UserWordStats          // Statistics about user's words

  // Learning
  learningSession: LearningSession | null  // Active learning session

  // Progress
  userProgress: UserProgress        // Overall user progress

  // UI State
  isLoading: boolean
  error: string | null
}
```

### Actions (State Mutations)

```typescript
AppActions {
  // Series Actions
  fetchSeries(): void
  selectSeries(seriesId: string): void
  fetchEpisodes(seriesId: string): void

  // Subtitle Actions
  loadSubtitle(episodeId: string): void

  // User Words Actions
  addUserWord(word: UserWord): void
  updateWordStatus(wordId: string, status: WordKnowledgeStatus): void
  toggleFavorite(wordId: string): void
  deleteUserWord(wordId: string): void

  // Learning Actions
  startLearningSession(mode: LearningMode, words: UserWord[]): void
  endLearningSession(): void
  reviewWord(wordId: string, correct: boolean): void

  // Progress Actions
  updateDailyProgress(progress: Partial<DailyProgress>): void

  // Utility
  clearError(): void
}
```

## 📊 Veri Modelleri İlişkileri

```
Series (1) ──── (N) Episodes
  │                  │
  │                  │
  │                  └──── (1) Subtitle
  │                           │
  │                           └──── (N) SubtitleLines
  └──── (N) UserWords                    │
                                         └──── (N) SubtitleWords

UserProgress ──── (N) WeeklyProgress
                       │
                       └──── (N) DailyProgress

LearningSession ──── (N) FlashCards ──── (1) UserWord
```

## 🔧 Component Hierarchy

### Screen Components

```
RootNavigator
├── MainTabs
│   ├── ExploreScreen
│   │   └── SeriesCard (multiple)
│   ├── WordListScreen
│   │   └── WordCard (multiple)
│   ├── LearningScreen
│   ├── AnalyticsScreen
│   └── ProfileScreen
│
└── Stack Screens
    ├── SeriesDetailScreen
    ├── SubtitlePlayerScreen
    │   └── SubtitleLineComponent (multiple)
    ├── WordDetailScreen
    └── LearningModeScreen
```

### Component Özellikleri

#### SeriesCard
```typescript
Props:
  series: Series
  onPress: () => void

Kullanıldığı Yer:
  - ExploreScreen (liste halinde)
```

#### SubtitleLineComponent
```typescript
Props:
  line: SubtitleLine
  onWordPress: (word: string, context: string) => void
  onLinePress: (line: SubtitleLine) => void
  isActive?: boolean
  userKnownWords?: Set<string>

Özellikler:
  - Her kelime tıklanabilir
  - Bilinen kelimeler vurgulanmaz
  - Bilinmeyen kelimeler sarı arka plan
  - Satıra tıklanınca TTS
```

#### WordCard
```typescript
Props:
  word: UserWord
  onSpeak?: () => void
  onMarkKnown?: () => void
  onMarkUnknown?: () => void
  onToggleFavorite?: () => void
  onPress?: () => void
  showActions?: boolean

Kullanıldığı Yerler:
  - WordListScreen
  - LearningModeScreen (flashcard olarak)
```

## 🔄 Lifecycle Akışları

### 1. Uygulama İlk Açılışı

```
1. App.tsx render
2. AppProvider mount
   ├─→ useEffect: loadInitialData()
   │     ├─→ Load userWords from AsyncStorage
   │     ├─→ Load userProgress from AsyncStorage
   │     └─→ fetchSeries() from API
   └─→ RootNavigator render
         └─→ MainTabs render
               └─→ ExploreScreen (default tab)
```

### 2. Altyazı Okuma Session

```
1. SubtitlePlayerScreen mount
   └─→ useEffect: loadSubtitle(episodeId)
         ├─→ API.fetchEpisodeById()
         ├─→ API.fetchSubtitle()
         └─→ Set currentSubtitle state

2. User clicks word
   ├─→ handleWordPress(word, context)
   │     ├─→ API.fetchWordDefinition(word)
   │     ├─→ speakWord(word) [TTS]
   │     └─→ Show modal
   │
   └─→ User clicks "I Don't Know"
         └─→ addUserWord()
               ├─→ Create UserWord object
               ├─→ Update userWords state
               ├─→ Save to AsyncStorage
               └─→ API.saveUserWord() [backend sync]
```

### 3. Learning Session

```
1. LearningModeScreen mount
   └─→ useEffect: startLearningSession()
         ├─→ Filter userWords (status !== 'known')
         ├─→ Create FlashCard[] from UserWord[]
         └─→ Set learningSession state

2. User reviews word
   └─→ handleNext(correct: boolean)
         ├─→ reviewWord(wordId, correct)
         │     └─→ Update session stats
         ├─→ Move to next card
         └─→ If last card:
               └─→ endLearningSession()
                     ├─→ Calculate duration
                     ├─→ updateDailyProgress()
                     └─→ Save to AsyncStorage
```

## 🗄️ Data Persistence Strategy

### AsyncStorage Keys

```typescript
const STORAGE_KEYS = {
  USER_WORDS: '@englishlearntv:userWords',
  USER_PROGRESS: '@englishlearntv:userProgress',
  USER_ID: '@englishlearntv:userId',
}
```

### Save Strategy

```
User Action → State Update → AsyncStorage Save → API Call (optional)

Example:
addUserWord()
  ├─→ Update userWords state (immediate UI update)
  ├─→ AsyncStorage.setItem() (persistence)
  └─→ API.saveUserWord() (backend sync, non-blocking)
```

### Load Strategy

```
App Start
  ├─→ AsyncStorage.getItem(USER_WORDS)
  │     └─→ Parse and set state
  ├─→ AsyncStorage.getItem(USER_PROGRESS)
  │     └─→ Parse and set state
  └─→ API.fetchSeries()
        └─→ Update series state
```

## 🎨 UI Rendering Flow

### Conditional Rendering Pattern

```typescript
// ExploreScreen example
{isLoading ? (
  <LoadingSpinner />
) : filteredSeries.length > 0 ? (
  <FlatList data={filteredSeries} ... />
) : (
  <EmptyState message="No series found" />
)}
```

### Modal Pattern (WordDefinition)

```typescript
// SubtitlePlayerScreen
const [showWordModal, setShowWordModal] = useState(false);
const [selectedWord, setSelectedWord] = useState<string | null>(null);

// User clicks word
handleWordPress(word) {
  setSelectedWord(word);
  setShowWordModal(true);  // → Modal appears
  fetchWordDefinition(word);
  speakWord(word);
}

// User closes or takes action
handleMarkKnown() {
  addUserWord(...);
  setShowWordModal(false);  // → Modal disappears
}
```

## 🚀 Performance Optimizations

### 1. FlatList Virtualization

```typescript
<FlatList
  data={filteredSeries}
  renderItem={renderSeriesItem}
  keyExtractor={item => item.id}
  // Only renders visible items + buffer
/>
```

### 2. Memoization (Future Enhancement)

```typescript
// Component memoization
export default React.memo(SeriesCard);

// useMemo for expensive calculations
const filteredWords = useMemo(
  () => userWords.filter(w => w.status === filter),
  [userWords, filter]
);
```

### 3. Lazy State Updates

```typescript
// Only update relevant state
const updateWordStatus = (wordId, status) => {
  setUserWords(prev =>
    prev.map(w => w.id === wordId ? {...w, status} : w)
  );
  // Don't re-fetch entire list
};
```

## 🔐 Error Handling Strategy

### API Error Handling

```typescript
try {
  setIsLoading(true);
  setError(null);

  const data = await API.fetchSeries();
  setSeries(data.series);

} catch (err) {
  setError('Failed to fetch series');
  console.error(err);
} finally {
  setIsLoading(false);
}
```

### User Feedback

```
Error States:
  ├─→ Loading: <ActivityIndicator />
  ├─→ Error: <ErrorMessage error={error} />
  └─→ Empty: <EmptyState message="..." />
```

## 🧪 Testing Strategy (Future)

### Unit Tests
- Utility functions (subtitleParser, TTS)
- State management actions
- API service functions

### Integration Tests
- Screen navigation flows
- Context provider behavior
- AsyncStorage integration

### E2E Tests
- Complete user journeys
- Word learning flow
- Series → Episode → Subtitle flow

## 📈 Scalability Considerations

### Future Backend Integration

```
Current: Mock API (api.ts)
Future:  Real API endpoints

Steps:
1. Replace mock functions in api.ts
2. Add authentication (JWT tokens)
3. Implement proper error handling
4. Add offline queue for user actions
5. Implement data caching strategy
```

### Performance at Scale

```
Optimizations needed for 1000+ words:
├─→ Pagination for word lists
├─→ Virtual scrolling
├─→ Search indexing
└─→ Lazy loading of definitions
```

---

Bu mimari dokümantasyonu, uygulamanın teknik yapısını ve veri akışını detaylı olarak açıklamaktadır. Geliştiricilerin projeyi anlaması ve katkıda bulunması için hazırlanmıştır.
