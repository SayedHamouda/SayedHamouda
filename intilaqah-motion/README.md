# انطلاقة — Motion Case Study (Remotion)

فيديو رأسي 1080×1920 · 30fps · 4:00 (7200 فريم) — تنفيذ سكريبت «انطلاقة — سكريبت فيديو الموشن».

## التشغيل

```bash
npm install
npm run studio          # معاينة وتعديل
npm run render          # → out/intilaqah.mp4
```

## الأصول (Assets)

| المجلد | المحتوى | الحالة |
|---|---|---|
| `public/screens/` | شاشات الموبايل (@2x) والويب (@1x) — أسماء الملفات من الـAsset Manifest | **لسه — الفيديو بيعرض بدائل مرسومة لحد ما تتحط** |
| `public/brand/` | `sayed-avatar.jpg` ✓ · `asset-mascot-launch.svg` · `logo-intilaqah.svg` | الصورة موجودة · الصاروخ واللوجو مرسومين بالكود كبديل |
| `public/ds/` | `ds-colors.png` · `ds-type.png` · `ds-spacing.png` · `ds-buttons.png` · `ds-mascot.png` · `ds-icons.png` | اختياري — المشهد 6 مرسوم بالكود من التوكنز |
| `public/audio/music.mp3` | تراك lo-fi أصلي 120 BPM + whoosh/pop | ✓ (`npm run music` يعيد توليده) |
| `public/fonts/` | Cairo 400–800 (عربي + لاتيني) محلي | ✓ |

أي ملف تحطّه بالاسم الصح في المجلد بيستبدل البديل المرسوم تلقائيًا (`npm run manifest` بيتشغّل قبل كل render).

### تصدير الشاشات من Figma بأمر واحد

```bash
FIGMA_TOKEN=xxxx npm run figma   # Personal access token بصلاحية File content: read
npm run render
```

## البنية

```
src/
  theme.ts              توكنز الألوان والحركة + الخط + asset()
  Video.tsx             جدول المشاهد + الـwipe الأصفر + الصوت
  components/           Caption · PhoneFrame · BrowserFrame · Screen(ScrollShot) · Counter · Card · Ticker · Rocket · Stars
  scenes/               S01…S10 حسب السكريبت
scripts/
  make_music.py         توليد الموسيقى (numpy + ffmpeg)
  fetch-figma.mjs       تصدير الشاشات من Figma REST API
  gen-manifest.mjs      يكتشف الأصول الموجودة
```

## قواعد البراند المطبّقة
- مفيش `box-shadow` — العمق بطبقات offset مسطّحة وحدود.
- العربي فوق والإنجليزي تحته (53% من الحجم · opacity 0.7).
- النصوص بعيدة عن أول 250px وآخر 350px (منطقة واجهة السوشيال).
- كل تغيير مشهد على ثانية زوجية = بداية بار عند 120 BPM.
- الأرقام لاتيني دايمًا.
