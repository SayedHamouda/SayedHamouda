# الـ Visual System: ألوان الفيديو وخريطة المترو

**ملف Figma:** https://www.figma.com/design/t8ga2oqckHEs7dW2ZLRDlg
- الصفحة `🎨 Foundations & Components`: الـ Component `Metro / Station`
- الصفحة `🗺 Scene 06 — Metro Map`: نسخة السلايد ونسخة الفيديو (Shot 21)

## فكرة الألوان: كل لون له دور في القصة

| Token | القيمة | الدور |
|---|---|---|
| `color/character/ziad` | `#FF7A1A` | زياد، والـ Pin «أنت هنا»، والـ Eyebrow |
| `color/character/bot` | `#22D3EE` | الـ AI في الفيلم كله |
| `color/character/mentor` | `#14161F` | سيد |
| `color/ui/selection` | `#0D99FF` | Bounding Box ومشهد الـ Pause (أزرق Figma) |
| `color/ui/highlight` | `#F5B700` | الهدف «Portfolio Ready» |
| `color/bg/map` | `#FBF8F2` | خلفية الخريطة (Cream دافي) |

**ليه الخلفية Cream؟** مشهد 4 كان مظلم، وفيه سحابة سودا. الخريطة هي لحظة «الشمس طلعت»، فالانتقال من الضلمة للنور بيكمّل القصة. وكمان الألوان المشبعة على خلفية فاتحة بتفضل واضحة على البروجكتور.

## خطوط المترو: Collection `Metro Line` بـ 6 Modes

| الخط | اللون | ليه |
|---|---|---|
| 1 Mindset | Purple `#7C3AED` | البداية والتفكير |
| 2 Understand | Blue `#2563EB` | البحث والهدوء |
| 3 Design | Orange `#FF7A1A` | **لون زياد**، لأن التصميم هو اللي هو جاي عشانه |
| 4 Validate & Ship | Green `#16A34A` | جاهز للإطلاق |
| 5 AI Era | Cyan `#0891B2` | **عيلة لون بوت**، بس أغمق عشان يتقري على الـ Cream |
| 6 Career | Ink `#14161F` | **لون سيد**، والنهاية: تبقى زي المنتور |

## Component: `Metro / Station`
- **Variants:** `State=Upcoming | Current | Done`
- **Properties:** `Number` و`Title` (Text)
- **اللون:** مربوط بـ `line/color`. تختار الخط بإنك تعمل Explicit Mode على الـ Instance (من 1 Mindset لحد 6 Career)
- **الاستخدام في الكورس:** في أول كل محاضرة، المحطات اللي خلصت تبقى `Done`، ومحطة النهارده `Current`، والباقي `Upcoming`

## الخط
**Readex Pro**: بيدعم العربي والإنجليزي، وأطرافه مدوّرة شوية فبيمشي مع ستايل الـ 3D الكرتوني.

## اتجاه الخريطة
من اليمين للشمال (RTL)، عشان الطلبة بيقروا عربي، ومحطة 01 فوق على اليمين.
