# ملخص المشروع: فيلم «الخطوة الأولى» (للتسليم لشات جديد)

## 1. المشروع
- **صاحب المشروع:** سيد حمودة، UI/UX Designer ومدرّس.
- **الهدف:** فيلم أنيميشن قصير بستايل **Pixar 3D**، بيتعرض في **أول محاضرة** لطلاب مبتدئين في كورس UI/UX، كتعارف وبداية للكورس.
- **الفكرة:** رحلة خريج مصري:
  1. اتخرج ومش لاقي شغل.
  2. سمع إن البرمجة فيها فلوس، فجرّب مجال وفشل.
  3. اكتشف UI/UX وحبه.
  4. لقاه متشعب جدًا (UX وUI وCX وResearch وWriting…)، وكل يوم فيه تحديثات، والـ AI مخوّفه إنه هياخد مكانه.
  5. اتحبط.
  6. **سيد بياخد بإيده خطوة خطوة:** يعني إيه UI/UX من الأول، وإيه أدوار السوق، وإزاي نذاكر ونشتغل، وإزاي نستخدم الـ AI **صح**. لا نعتمد عليه 100% ولا على نفسنا 100%، **الـ AI يسرّعنا وإحنا اللي بنقود**.
- **الرسالة الختامية:** `Don't compete with AI. Direct it.` بعدها `Day 01`.
- **الطابع:** واقعي ومؤثر وبيلمس الناس (تعاطف)، **من غير حوار** (الصوت موسيقى ومؤثرات بس)، وإيقاع **بطيء وطبيعي**. **المدة الكلية مش مهمة.**

## 2. الشخصيات (الشيتات المعتمدة)
| الشخصية | الوصف الثابت |
|---|---|
| **زياد** (البطل، 22 سنة) | شعر أسود كيرلي منكوش، من غير دقن، عيون بني كبيرة. **هودي برتقالي واسع `#FF7A1A`** بأربطة بيضا، وجوجر رمادي غامق، وكوتشي أبيض، وشنطة كحلي. في التخرج: روب أسود ووشاح برتقالي |
| **ماما سعاد** (الأم، حوالي 50 سنة) | قصيرة، ممتلئة شوية، وشها مدوّر وطيب، ونفس عيون وحواجب زياد. **حجاب وردي باهت `#C98B9C`**، و**نضارة قراية في سلسلة خرز**، وموبايل بجراب وردي. في البيت: عباية بيج بورد صغير. في التخرج: عباية كحلي وغوايش دهب |
| **بوت** (الـ AI) | روبوت أبيض لامع في حجم قطة، وشه شاشة سودا وعيونه Cyan `#22D3EE`، وفيه أنتينا، وبيطير من غير رجلين، وعلى صدره زرار ✨. **بيظهر جوه الشاشات بس** |
| **سيد** (المنتور) | تيشيرت أسود، وجينز أزرق، وكوتشي أبيض، وساعة سودا في الإيد الشمال. **من غير حلق.** ⚠️ **شيت سيد الشبيه بيه لسه ماتعملش**: المحاولات اللي من وصف مكتوب مانجحتش. المطلوب إن سيد يولّده بنفسه في Gemini (Nano Banana) أو Flow، برفع صوره الحقيقية (3 صور) ومعاها شيت زياد كمرجع للستايل. الـ Prompt موجود في المحادثة القديمة وفي `04-character-prompts.md` |

## 3. الأدوات وطريقة الشغل
- **سيد بيولّد الفيديو بنفسه في Google Flow بموديل Omni 1:** كليبات **10 ثواني**، بدقة **360p عشان يوفّر Credits**. وفيه موديل تاني عنده بيولّد 30 ثانية مرة واحدة.
- **دور Claude:** يكتب السيناريو والـ Prompts، ويراجع الكليبات اللي سيد بيرفعها كادر كادر، ويطلّع **آخر Frame** من كل كليب، ويحفظ كل حاجة في GitHub.
- **قيود عند Claude:**
  - موديلات الفيديو في Weave محتاجة اشتراك مدفوع، والتوليدات المجانية بتاعة الصور خلصت.
  - البيئة بتمنع `www.figma.com` و`media.weavy.ai`، فـ Claude مايقدرش يشوف أو ينزّل الصور اللي بتتولّد هناك.
  - Figma AI بيولّد صور من **كلام بس**، ومابيشوفش الصور المرجعية.
- **تجربة Remotion اتلغت.** سيد قال إنها غلط، والمطلوب **فيلم كرتون حقيقي، مش Motion graphics**.

## 4. قواعد كتابة الـ Prompts (اتعلمناها بالتجربة، **إلزامية**)
1. **كل كليب = لقطة واحدة متصلة** (One continuous shot) ومن غير قطع. وفيه **حدث واحد بس**، **بطيء وطبيعي**. ماتحشرش أحداث كتير في 10 ثواني.
2. **كل كليب بيبدأ من آخر Frame في الكليب اللي قبله**، والـ Prompt بيقول ده صراحةً (`The video begins exactly on the uploaded image…`).
3. **آخر ثانية ونص في كل كليب ثابتة تمامًا** ومن غير Motion blur، والشخصية باينة بوضوح، عشان التسليم للكليب الجاي يبقى سهل.
4. **حركة الكاميرا والعدسة والكادر لازم يتوصفوا** بالتفصيل، بس **كوصف طبيعي**.
5. ⚠️ **ممنوع أي Labels أو توقيتات جوه الـ Prompt** (زي `0-3s` أو `50mm` أو `screen-left`)، لأن الموديل كتبها على الشاشة. اكتب التتابع بـ «في الأول»، و«بعدين»، و«في الآخر».
6. ⚠️ **أول سطر وآخر سطر:** منع صريح لأي **كلام أو حروف أو أرقام** في الفيديو.
7. ⚠️ **الاتجاهات:** شمال ويمين **دايمًا من جسم الشخصية** (إيد زياد الشمال)، ومعاها اتجاه الصورة ومربوطة بحاجة ثابتة في المكان (الشباك، اللاب). **ماتعكسش الاتجاه.**
8. **اللبس يتكرر** في الـ Prompt (زياد بالهودي البرتقالي **طول الوقت**)، ومعاه ممنوع صريح لأي لبس تاني.
9. **ممنوع كروت أو شاشات طايرة في الهوا.** الإيميلات بتظهر على شاشة اللاب بس.
10. **ماتغيّرش أماكن حاجات اتأسست في كليبات قبل كده** (الباب مايظهرش في حتة ظهرت فيها حيطة أو شباك قبل كده).

## 5. اللي اتعمل (الكليبات المعتمدة)
| الكليب | الوقت | المحتوى | الملف |
|---|---|---|---|
| 1 | 0–10 | **التخرج:** Crane down من السما وسط الكابات، وبعدين ماما سعاد بتزغرط وتعدّل الشرّابة، وبعدين بتصوّره وهو بيعمل علامة نصر، وفي الآخر فلاش والصورة تبقى **برواز على مكتب في أوضة ضلمة** | `shots/scene01-graduation-v1.mp4` ✅ |
| 2 | 10–20 | **الرفض:** الكاميرا بتطلع من البرواز للاب، والإيميلات عليها علامات ✕ حمرا، وبعدين بتلف على **وش زياد** (Medium close-up، ضوء أزرق) | `shots/scene02-rejection-v2.mp4` ✅ |

**المكان في آخر كادر من الكليب 2** (`frames/scene02-v2-last.png`):
- زياد قدام الكاميرا.
- اللاب في مقدمة الكادر تحت (ناحية إيد زياد اليمين).
- **الشباك والحيطة ورا زياد ناحية إيده الشمال.**
- **الباب مش باين:** هو على **إيد زياد الشمال، بزاوية حوالي 65° قدّامه ناحية الكاميرا**، فنوره بيدخل من حافة الصورة اليمين ويقع على **خده الشمال**.
- **الكرسي اللي ماما سعاد هتقعد عليه جنب المكتب في نفس الناحية.**

## 6. الخطة الجاية (حدث واحد في كل كليب)
| الكليب | الحدث | الكادر الأخير |
|---|---|---|
| **3** ⏳ | النور الأصفر يدخل على خده الشمال، و**يقفل اللاب بهدوء وإحباط** (الـ Prompt تحت) | وشه نصه دافي ونصه ضل، وباصص ناحية الباب |
| 4 | الكاميرا تلف ناحية إيده الشمال: **ماما سعاد داخلة مبتسمة** وتقعد على الكرسي جنب المكتب | Two-shot ثابت، والموبايل في إيدها |
| 5 | **تديله الموبايل:** صور فيسبوك لولاد الجيران اللي اشتغلوا واشتروا عربيات، وأهاليهم فرحانين بيهم (نيتها تشجّعه) | شاشة الموبايل |
| 6 | الفوكس يطلع لوشه: **ابتسامة مصطنعة مليانة حزن داخلي** | وشه ثابت |
| 7 | تطبطب عليه وتبوس راسه **وتمشي**، والنور الأصفر يختفي | لوحده في الضلمة |
| 8 | يقوم ببطء و**ينام على السرير على ضهره** | نايم |
| 9 | الكاميرا تطلع فوقه، **Top shot**، ووشه للسقف | Top shot ثابت |
| بعدها | الكول سنتر، وبعدين الشرارة (بوست زميل الدفعة عن الشغل الجديد ومرتب البرمجة)، وبعدين تجربة Frontend والفشل، وبعدين اكتشاف UI/UX، وبعدين التشعبات وخوف الـ AI، وبعدين زميل يعمل **تاج لسيد في بوست على فيسبوك**، وبعدين سيد ياخد بإيده، وفي الآخر ماما سعاد تستخدم تطبيق زياد صممه بسهولة | |

## 7. الـ Prompt الجاهز للكليب 3
(First frame: `frames/scene02-v2-last.png`)
```
IMPORTANT: The video must contain absolutely NO text of any kind: no words, no letters, no numbers,
no captions, no subtitles, no labels, no camera notes, no on-screen graphics. Pure animation only.

A Pixar-style 3D animated film shot. One single continuous shot of about ten seconds, with no cuts,
no dialogue and no speech, only soft sad piano and quiet night ambience. The pacing is very slow,
calm and natural. Nothing happens fast.

The video begins exactly on the uploaded image, which is the last frame of the previous shot:
a medium close-up of Ziad facing the camera in his dark bedroom at night, his face lit by the cold
blue glow of the laptop at the bottom of the picture, with the window and the dark wall behind him.
Keep this exact camera angle, this room, this window and this Pixar style.

Ziad is a 22-year-old young man with messy curly black hair, clean-shaven, big brown eyes,
wearing his oversized bright orange hoodie the whole time. He is alone.

The bedroom door is never visible. It is off-screen on Ziad's left-hand side, slightly in front
of him, at about sixty-five degrees from his left shoulder toward the camera. Because of this, its
light comes in from the right edge of the picture. The window behind Ziad stays exactly as it is;
there is no door near the window.

At first, the camera is completely still and Ziad sits silently, tired, lit only by the blue
laptop light. Then a warm yellow light slowly spreads into the room from the off-screen door,
coming from the right edge of the picture, and falls softly on Ziad's left cheek and the left side
of his face. His eyes slowly move toward that light. Then, as the camera very slowly pushes in,
Ziad quietly and slowly closes the laptop lid with a long, disappointed exhale. The cold blue light
fades away. Now only the warm yellow light lights the left side of his face, and the other side
of his face falls into soft shadow. Finally the camera stops completely and holds a clean, steady
medium close-up of his face, half in warm light and half in shadow, his eyes looking toward the
off-screen door. The final moment is perfectly still with no motion blur.

No other character appears in this shot. No cuts, no new objects, no door inside the frame,
no floating screens. Reminder: absolutely no text, letters or numbers anywhere in the video.
```

## 8. الملفات (GitHub)
- **الريبو:** `SayedHamouda/SayedHamouda`، الفرع `claude/ecstatic-ride-313lkf`، المجلد `intro-animation/`
- `characters/`: شيتات زياد وبوت وماما سعاد (Previews)، وشيت الأفاتار القديم لسيد، وصورة مرجعية.
- `shots/`: الكليبات المعتمدة.
- `frames/`: آخر Frame من كل كليب.
- `04-character-prompts.md`: الـ Prompts بتاعة الشخصيات.
- `07-short-film-v3.md`: هيكل الفيلم.
- `HANDOFF.md`: الملف ده.
- ⚠️ **صور سيد الحقيقية ماترفعتش على GitHub** (الريبو Public).

## 9. تفضيلات سيد في الشغل
- **عربي بالعامية المصرية.** الـ Prompts بالإنجليزي.
- عايز **إخراج احترافي**: كاميرا، وعدسات، وديكور، وتعبيرات، وترتيب مشاهد منطقي.
- **ماتعرضش حاجة ماتطلبتش**، **ماتكررش أخطاء اتصلحت**، وراجع الفيديوهات اللي بيرفعها كويس قبل ما ترد.
- لو فيه غموض حقيقي، **اسأل سؤال واحد واضح** بدل ما تفترض.
