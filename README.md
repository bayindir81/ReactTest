# 📺 EnglishLearnTV - Dizi ile İngilizce Öğrenme Uygulaması

React Native ile geliştirilmiş, TV dizileri ve altyazılar kullanarak İngilizce öğreten kapsamlı bir mobil uygulama.

## 🎯 Özellikler

### 📱 Ana Özellikler

#### 1. Dizi Keşfetme (Explore)
- ✅ Kategori bazlı dizi arama (Drama, Comedy, Sci-Fi, vb.)
- ✅ Dizi kapak görselleri ve detaylı bilgiler
- ✅ Popüler, yeni eklenen filtreleri
- ✅ Gelişmiş arama kutusu
- ✅ CEFR seviye göstergeleri (A1-C2)

#### 2. Dizi Detay Ekranı
- ✅ Sezon ve bölüm listesi
- ✅ Bölümlere tıklayınca altyazılar yüklenir
- ✅ Dizi açıklaması, seviye önerisi
- ✅ Oyuncu kadrosu ve detaylar
- ✅ IMDb benzeri tasarım

#### 3. Altyazı Oynatma Ekranı
- ✅ Bölümün İngilizce altyazısını paragraf-satır-kelime bazlı gösterme
- ✅ **Kelimeye tıklama özellikleri:**
  - İngilizce seslendirme (Text-to-Speech)
  - Kelime anlamı ve tanımlar
  - Fonetik gösterim
  - Örnek cümleler
  - Türkçe çeviri
  - "Biliyorum / Bilmiyorum" butonları
  - Kullanıcı kendi listesine ekleyebilme
- ✅ **Altyazı satırına tıklama:**
  - Cümleyi sesli okuma
  - Cümlenin anlamını gösterme
  - O cümledeki tüm kelimeleri listeleme

#### 4. Kullanıcının Kelime Listesi
- ✅ Biliyorum kelimeleri listesi
- ✅ Bilmiyorum kelimeleri listesi
- ✅ Öğreniyorum kelimeleri
- ✅ Favoriler
- ✅ Filtreleme ve arama

#### 5. Üç Öğrenme Modu
- ✅ **Kelime Modu**: Flashcard ile kelime öğrenme
- ✅ **Cümle Modu**: Bağlamsal öğrenme
- ✅ **Altyazı Modu**: Tam metin okuma

#### 6. Analytics / İlerleme Takibi
- ✅ Öğrenilen kelime sayısı
- ✅ En çok tekrar edilen kelimeler
- ✅ Günlük çalışma grafiği
- ✅ Streak (ardışık gün) takibi
- ✅ CEFR seviye ilerleme takibi

## 🏗️ Teknik Mimari

### Teknoloji Stack

```
📦 Frontend Framework
├─ React Native + Expo
├─ TypeScript
└─ React Navigation

📊 State Management
└─ Context API (AppContext)

🎨 UI/Styling
└─ React Native StyleSheet (Tailwind benzeri tasarım)

🔊 Text-to-Speech
└─ expo-speech

💾 Veri Yönetimi
├─ AsyncStorage (local storage)
└─ Mock API (gerçek API için hazır yapı)
```

### Proje Klasör Yapısı

```
ReactTest/
├── App.tsx                          # Ana uygulama giriş noktası
├── package.json                     # Bağımlılıklar
├── tsconfig.json                    # TypeScript config
│
├── src/
│   ├── types/
│   │   └── index.ts                 # Tüm TypeScript type tanımları
│   │
│   ├── data/                        # Mock data
│   │   ├── mockSeriesData.json      # Dizi listesi
│   │   ├── mockEpisodesData.json    # Bölümler
│   │   ├── mockSubtitleData.json    # Altyazılar
│   │   └── mockWordDefinitionData.json
│   │
│   ├── contexts/
│   │   └── AppContext.tsx           # Global state management
│   │
│   ├── navigation/
│   │   └── RootNavigator.tsx        # Navigation yapısı
│   │
│   ├── services/
│   │   └── api.ts                   # API servisleri
│   │
│   ├── utils/
│   │   ├── subtitleParser.ts        # Altyazı parsing
│   │   └── textToSpeech.ts          # TTS fonksiyonları
│   │
│   ├── components/
│   │   ├── common/                  # Ortak componentler
│   │   ├── series/
│   │   │   └── SeriesCard.tsx       # Dizi kartı
│   │   ├── subtitle/
│   │   │   └── SubtitleLineComponent.tsx
│   │   ├── word/
│   │   │   └── WordCard.tsx         # Kelime kartı
│   │   └── learning/                # Öğrenme modları
│   │
│   └── screens/
│       ├── Explore/
│       │   └── ExploreScreen.tsx    # Dizi keşfetme
│       ├── SeriesDetail/
│       │   └── SeriesDetailScreen.tsx
│       ├── SubtitlePlayer/
│       │   └── SubtitlePlayerScreen.tsx
│       ├── WordList/
│       │   ├── WordListScreen.tsx
│       │   └── WordDetailScreen.tsx
│       ├── LearningModes/
│       │   ├── LearningScreen.tsx
│       │   └── LearningModeScreen.tsx
│       ├── Analytics/
│       │   └── AnalyticsScreen.tsx
│       └── Profile/
│           └── ProfileScreen.tsx
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

```bash
Node.js >= 16
npm veya yarn
Expo CLI
```

### Adım 1: Bağımlılıkları Yükle

```bash
npm install
# veya
yarn install
```

### Adım 2: Uygulamayı Çalıştır

```bash
# Development server başlat
npm start
# veya
expo start

# iOS'ta çalıştır
npm run ios

# Android'de çalıştır
npm run android
```

## 📊 Veri Akışı ve State Management

### Context API Yapısı

```typescript
AppContext
├── State
│   ├── series[]              # Tüm diziler
│   ├── selectedSeries        # Seçili dizi
│   ├── episodes[]            # Bölümler
│   ├── currentSubtitle       # Aktif altyazı
│   ├── currentEpisode        # Aktif bölüm
│   ├── userWords[]           # Kullanıcı kelimeleri
│   ├── wordStats             # Kelime istatistikleri
│   ├── learningSession       # Aktif öğrenme oturumu
│   └── userProgress          # Kullanıcı ilerlemesi
│
└── Actions
    ├── fetchSeries()
    ├── selectSeries()
    ├── loadSubtitle()
    ├── addUserWord()
    ├── updateWordStatus()
    ├── startLearningSession()
    └── endLearningSession()
```

### Veri Modelleri

#### Series (Dizi)
```typescript
{
  id: string
  title: string
  description: string
  coverImage: string
  category: SeriesCategory
  level: CEFRLevel (A1-C2)
  rating: number
  totalEpisodes: number
  tags: string[]
}
```

#### Subtitle (Altyazı)
```typescript
{
  episodeId: string
  lines: SubtitleLine[]
  totalWords: number
  uniqueWords: number
}
```

#### SubtitleLine (Altyazı Satırı)
```typescript
{
  id: string
  text: string
  translation?: string
  words: SubtitleWord[]  // Kelimeye bölünmüş
  startTime: number
  endTime: number
}
```

#### UserWord (Kullanıcı Kelimesi)
```typescript
{
  id: string
  word: string
  status: 'known' | 'unknown' | 'learning'
  source: {
    seriesId: string
    episodeId: string
    context: string  // Kelimenin bulunduğu cümle
  }
  isFavorite: boolean
  reviewCount: number
}
```

## 🎨 Ekran Açıklamaları

### 1. Explore Screen (Keşfet)
- Tüm dizileri kategorilere göre listeler
- Arama ve filtreleme
- Dizi kartları (SeriesCard component)

### 2. Series Detail Screen
- Dizi bilgileri
- Sezon seçici
- Bölüm listesi
- Her bölüm tıklanabilir → SubtitlePlayer'a gider

### 3. Subtitle Player Screen ⭐ (En Önemli)
- Altyazı satırlarını gösterir
- **Kelimeye tıklama:**
  - WordDefinition modal açılır
  - TTS ile söylenir
  - Anlamı ve örnek cümleler gösterilir
  - "Biliyorum/Bilmiyorum" butonları
- **Satıra tıklama:**
  - Cümle seslendirilir
  - Türkçe çeviri gösterilir

### 4. Word List Screen
- Kullanıcının kaydettiği kelimeleri listeler
- Filtre: Tümü, Biliyorum, Bilmiyorum, Favoriler
- Her kelime için WordCard component

### 5. Learning Screen
- 3 öğrenme modu seçeneği:
  - Word Mode (Flashcard)
  - Sentence Mode
  - Subtitle Mode

### 6. Learning Mode Screen (Flashcard)
- Kelime flashcard'ları
- Çevir-kontrol et mantığı
- İlerleme takibi
- Doğru/Yanlış sayacı

### 7. Analytics Screen
- Toplam kelime sayısı
- Günlük/haftalık istatistikler
- Seviye ilerleme çubuğu
- Başarı rozetleri

### 8. Profile Screen
- Kullanıcı bilgileri
- Ayarlar (TTS, bildirimler, tema)
- Günlük hedef ayarlama

## 🔧 Önemli Utility Fonksiyonlar

### subtitleParser.ts

```typescript
// Altyazı metnini kelimelere böler
parseSubtitleLineToWords(text: string): SubtitleWord[]

// SRT formatını parse eder
parseSRTSubtitle(srtContent: string): SubtitleLine[]

// VTT formatını parse eder
parseVTTSubtitle(vttContent: string): SubtitleLine[]

// Benzersiz kelimeleri çıkarır
getUniqueWords(lines: SubtitleLine[]): string[]
```

### textToSpeech.ts

```typescript
// Kelimeyi seslendirir
speakWord(word: string): Promise<void>

// Cümleyi seslendirir
speakSentence(sentence: string): Promise<void>

// TTS'yi durdurur
stopSpeaking(): Promise<void>
```

## 📡 API Yapısı

Tüm API fonksiyonları `src/services/api.ts` içinde:

```typescript
// Dizileri getir
fetchSeries(): Promise<SeriesListResponse>

// Bölümleri getir
fetchEpisodes(seriesId: string): Promise<Episode[]>

// Altyazı getir
fetchSubtitle(episodeId: string): Promise<Subtitle>

// Kelime tanımı getir
fetchWordDefinition(word: string): Promise<WordDefinition>

// Kullanıcı kelimesi kaydet
saveUserWord(userWord: UserWord): Promise<UserWord>
```

**Not:** Şu an mock data kullanılıyor. Gerçek API için aynı interface'leri kullanarak backend'e bağlanabilirsiniz.

## 🎯 Örnek API JSON Çıktıları

### Series List Response
```json
{
  "success": true,
  "data": {
    "series": [
      {
        "id": "series_1",
        "title": "Friends",
        "level": "B1",
        "category": "comedy",
        "rating": 9.2,
        "totalEpisodes": 236
      }
    ]
  }
}
```

### Subtitle Response
```json
{
  "subtitle": {
    "episodeId": "ep_friends_s01e01",
    "lines": [
      {
        "id": "sub_1",
        "text": "There's nothing to tell!",
        "translation": "Anlatacak bir şey yok!",
        "words": [
          {
            "word": "There's",
            "normalizedWord": "there's",
            "isPunctuation": false
          }
        ]
      }
    ]
  }
}
```

### Word Definition Response
```json
{
  "word": {
    "word": "remarkable",
    "phonetic": "/rɪˈmɑːrkəbl/",
    "level": "B2",
    "meanings": [
      {
        "partOfSpeech": "adjective",
        "definitions": [
          {
            "definition": "worthy of attention; striking",
            "example": "The film has some remarkable special effects.",
            "translation": "Dikkat çekici, olağanüstü"
          }
        ]
      }
    ]
  }
}
```

## 🎨 UI/UX Tasarım Prensipler

### Renk Paleti
```
Primary: #6366f1 (Indigo)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Danger: #ef4444 (Red)
Gray Scale: #111827 - #f9fafb
```

### Tipografi
- **Başlıklar**: 24-28px, Bold
- **Alt başlıklar**: 18-20px, Semibold
- **Gövde metni**: 14-16px, Regular
- **Küçük metin**: 11-13px, Medium

### Component Yapısı
- **Card elevation**: 2-4 (shadow)
- **Border radius**: 8-16px
- **Padding**: 12-20px
- **Gap/spacing**: 8-16px

## 📝 Geliştirme Notları

### TypeScript Kullanımı
Tüm component'ler ve fonksiyonlar TypeScript ile yazılmıştır. Type safety için:
- Interface'ler `src/types/index.ts` içinde
- Strict mode aktif
- Component props için interface tanımları

### State Management Best Practices
- Context API kullanımı
- AsyncStorage ile persistence
- Optimistic updates
- Error handling

### Performance Optimizations
- FlatList virtualization
- Memoization (React.memo)
- Lazy loading
- Image caching

## 🔮 Gelecek Geliştirmeler

### v2.0 Roadmap
- [ ] Gerçek backend API entegrasyonu
- [ ] Video player ekleme (subtitle sync ile)
- [ ] Spaced repetition algoritması
- [ ] Offline mode
- [ ] Sosyal özellikler (arkadaşlarla yarışma)
- [ ] AI destekli kelime önerileri
- [ ] Voice recognition (pronunciation practice)
- [ ] Gamification (rozetler, seviyeler)

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

EnglishLearnTV - 2024

---

## 🎓 Nasıl Kullanılır?

### Kullanım Senaryosu

1. **Dizi Seç**: Explore ekranından seviyene uygun bir dizi seç
2. **Bölüm Aç**: Series Detail'den bir bölüm seç
3. **Altyazı Oku**: Subtitle Player'da altyazıları oku
4. **Kelime Öğren**: Bilmediğin kelimelere tıkla, anlamını öğren
5. **Kaydet**: "Bilmiyorum" butonuna bas, kelime listene ekle
6. **Pratik Yap**: Learning ekranından flashcard ile pratik yap
7. **İlerlemeni Takip Et**: Analytics'te ne kadar ilerlediğini gör

## 🌟 Öne Çıkan Özellikler

✨ **Kelime Bazlı Altyazı Gösterimi**: Her kelime tıklanabilir
✨ **Akıllı Vurgulama**: Bilmediğin kelimeler sarı ile vurgulanır
✨ **Bağlamsal Öğrenme**: Kelimeyi gördüğün cümle kaydedilir
✨ **TTS Entegrasyonu**: Her kelime ve cümle sesli okunabilir
✨ **İlerleme Takibi**: Günlük hedef, streak, seviye sistemi
✨ **Flashcard Sistemi**: Spaced repetition benzeri öğrenme

---

**🚀 Hemen dene ve dizilerle İngilizce öğrenmeye başla!**
