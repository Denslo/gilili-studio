# Number Lab — Project Bible

> The single source of truth for **what we are building, why, and how**.
> Read this before adding a feature. Update it when you add one.

---

## 1. Purpose

A small website of visual animations and games that helps a 2nd-grade child
learn **addition and subtraction within 100**.

The first and main target is one specific difficulty:

> **Understanding what happens to a two-digit number when it crosses a ten**
> — 9 → 10, 19 → 20, 79 → 80 — and the reverse (40 → 39).

Children often know the number *names* but not the *structure*. Typical errors
(documented by Illustrative Mathematics): after 29 saying "40" or "20", or
writing "210" for "2 tens and 10 ones".

## 2. The one big idea (every page teaches it)

**10 ones make 1 ten. 1 ten can be opened into 10 ones.**

- Counting up: when the ones place reaches 10, the ten ones are *bundled* into
  one ten. The ones digit goes back to 0, the tens digit goes up by 1.
- Counting down: when there are 0 ones and we need to take one away, we
  *unbundle* (open) one ten into 10 ones, then take one away.

Every animation must make this moment **slow, visible, and narrated**:
1. Show the "too many" state (ones = 10, shown in red as `1 | 10`).
2. Show the regrouping (bundle / snap / fill the frame / roll the wheel).
3. Show the new number with the changed digits popping.
4. Caption it in words: "19 + 1 = 20 → 2 tens and 0 ones".

## 3. Teaching principles (from the research)

| # | Principle | Source |
|---|-----------|--------|
| P1 | Teach regrouping as **bundling** 10 ones into 1 ten (and unbundling for subtraction). | Eureka / Unbounded G2 M3; Eureka G2 M4 |
| P2 | **Link concrete ↔ picture ↔ digits ↔ words** at the same time. | Fresno Unified G2 planner |
| P3 | Practice the **edges** on purpose (x9 ↔ x0), forwards and backwards. | Illustrative Mathematics "Crossing the Decade"; Oak National Academy |
| P4 | Let kids **spot deliberate mistakes** in counting so they learn what "sounds wrong". | Oak National Academy |
| P5 | Start with problems that **don't** cross a ten, then ones that do (89+3, 51−2). | Kentucky Center for Mathematics |
| P6 | Use the hundred chart's structure: rows = a decade, columns = same ones digit, down = +10. | Big Ideas Learning; Concordia study |
| P7 | **Bridge through ten** for addition/subtraction: 38 + 5 = 38 + 2 + 3. | Oak; NCETM; nzmaths |
| P8 | Short, frequent sessions beat long drills. | Think Academy |

## 4. Design system

- **Every number shown stays under 100 (0–99)** — the parent's rule (2026-11-15). That includes answers, distractors and number-line ticks: crossings stop at 89 → 90, there is no 99 → 100, and no "210"-style wrong answers.

- **Colors are meaning, not decoration.** Never reuse them for something else.
  - Tens = **blue** `--tens #2f6fdb` (soft `#dfe9ff`)
  - Ones = **orange** `--ones #f08a24` (soft `#ffe9d3`)
  - Hundreds = **purple** `--hund #8e44ad`
  - Correct = green `--good`, mistake/too-many = red `--bad`
- **Tens always on the left, ones on the right** (just like the written number).
- Big touch targets (≥ 56px), rounded font (Nunito), lots of whitespace.
- Animations: 250–1300 ms. The crossing moment is deliberately slow.
- Sound effects are on by default (toggle 🔔). Spoken numbers are **off** by
  default (toggle 🗣️). Speech follows the site language (he-IL / en-US).

### Motion
- **Transform + opacity only** (no layout-animating properties except the stick
  margins while bundling, which the engine needs for reflow on narrow screens).
  CSS keyframes/transitions for UI, `requestAnimationFrame` for synchronised
  sequences (the kangaroo riding the arc tip), the Web Animations API for
  celebration riders. No animation library.
- Two easings live in `:root`: `--spring` (overshoot, for things that *arrive*:
  sticks, bundles, cards, numbers) and `--settle` (soft ease-out, for everything
  else). Arrivals get a squash/stretch at the end (bundle landing, kangaroo).
- **The teaching moment stays slow and legible.** Crossing a ten is still
  1400 ms "too many" → 1000 ms bundling → arrival; celebrations never block
  clicks or cover the caption for long. Decoration must not delay the lesson.
- Every decorative loop/bounce is switched off under `prefers-reduced-motion`
  (`style.css` and each page's `<style>`); `PV.celebrate` falls back to a
  gentle star fade that only animates opacity.

### Celebrations (`PV.celebrate(level)`)
- `'small'` ≈ 3 s, unobtrusive: one effect (one character crossing, or 2–3
  flowers / butterflies / balloons), sometimes plus a star burst.
  Used for a single correct answer, a matched pair, crossing a ten, the carry.
- `'big'` ≈ 6.5–8 s: 1–2 effects, the second joining 1.2 s after the first,
  plus the win jingle. Used for a finished game, every 5th point, every 3rd
  solved problem (number line, adding with sticks), every 5th crossing on the
  sticks page.
- **Slow enough to enjoy.** Character effects use one constant, `CHAR_MS`
  (big 6500 / small 3000 ms): a character takes that long to cross the screen,
  with a gentle start and stop (`GLIDE` easing) and at most 2–3 characters per
  parade (5 flowers / balloons, 4 butterflies), staggered 0.7–1.6 s apart so
  they come one after another. Confetti and fireworks keep their own timings
  (≈3.6 s / 1.7 s).
- **Never piles up.** Every running character animation is tracked (`live`);
  a **small** celebration that arrives while characters are still on screen
  only adds a star burst, so the parade gets to finish (the parent wants time
  to enjoy the characters). A **big** one cancels them (`fxClear`) and takes
  over; a replaced big celebration does not launch its second effect. Sparkles and the particle canvases are left to
  finish on their own.
- Effects (random, never the same pick twice in a row): `confetti` (canvas),
  `fireworks` (canvas rockets + bursts), `rainbow` (SVG arcs drawing in, clouds),
  `unicorns` (🦄 with a sparkle trail), `bunnies` (🐰 hopping with squash),
  `mermaids` (🧜‍♀️ with bubbles and a wave), `elves` (an **original** little
  blue forest elf, inline SVG: leaf hat with an acorn, acorn-brown tunic — not a
  Smurf), `animals` (🦊 🦔 🦌 🐿️ 🦉 trotting by), `flowers` (inline-SVG flowers
  growing up from the bottom), `ships` (⛵ on a rolling wave), `butterflies`
  (🦋 fluttering upward), `balloons` (inline-SVG balloons in the design colors),
  `stars` (✨ burst). The list is exported as `PV.effects`.
- Each effect may add a quiet flourish on top (`PV.sound.boom / boing / gallop /
  bubbles / bells / whoosh / twinkle`); all respect the 🔔 toggle.
- Everything renders into one `position: fixed; inset: 0; overflow: hidden;
  pointer-events: none` layer (`.fx`, z-index 100) that is removed from the DOM
  when the last effect ends, so it can never cause horizontal scroll or block
  taps. Where every page triggers what:

  | Page | small | big |
  |------|-------|-----|
  | Sticks & Bundles (engine) | every crossing of a ten (bundle / unbundle), also mid-jump with ±2/5 | every 5th crossing |
  | Adding with Sticks | the carry (bundle lands in the tens mat), each solved problem | every 3rd solved problem |
  | Number Line Jumps | landing on the ten (step 1), each solved problem | every 3rd solved problem |
  | Ten Twins | each matched pair (+ `PV.sparkle` on the cards) | all 6 pairs found |
  | Spot the Mistake | each point (+ owl happy/surprised) | every 5th point |
  | Arrow Race | — (`PV.sparkle` on the right number; the buddy panel is the per-answer reward) | the end screen (time's up / new best) |

### Language & direction
- **Hebrew is the default** (toggle "עברית" in every header; off = English).
  The choice is saved in `localStorage` (`pv-hebrew`) and the page reloads.
- Hebrew pages are **right-to-left**, but **math stays left-to-right**, exactly as
  numbers are written in Hebrew: place-value boxes, mats (tens left, ones right),
  ± buttons, number line, counting sequences, memory cards.
  These containers get `direction: ltr` in `style.css`.
- Any equation or range inside a sentence must be wrapped with `PV.eq('…')` /
  `<span class="eq">…</span>` or it will be reversed by the bidi algorithm.
- Hebrew math vocabulary (as taught in Israeli schools): עשרות / יחידות / מאות,
  עשרת אחת, לפרק עשרת (unbundle), השלמה לעשרת (make a ten), לוח המאה,
  ישר המספרים, קוביות דינס, חשבונייה, מסגרת עשר. Number words use the feminine
  counting forms (אחת, שתיים… תשע־עשרה, עשרים ואחת).
- Fonts: Nunito (Latin, digits) + Rubik (Hebrew). Offline they fall back to system fonts.
- Keyboard: `→` / `+` = add one, `←` / `-` = take one away (on animation pages).

## 5. File structure

```
docs/
  BIBLE.md              ← this file
site/
  index.html            ← menu of all activities + parent tips
  assets/
    style.css           ← all shared styles + design tokens + RTL rules
    strings.js          ← ALL user-facing text, English + Hebrew side by side
    common.js           ← PV namespace: i18n, display, sounds, speech, exchange engine, celebrations
  pages/
    bundles.html        ← sticks & bundles (±1, ±2, ±5, ±10)
    bundles-add.html    ← adding with sticks: column addition 26 + 47 with the carry
    number-line.html    ← bridging-ten jumps (38 + 5 = 38 + 2 + 3)
    edge-match.html     ← memory game: 19 ↔ 20 pairs
    spot-mistake.html   ← the owl counts — find the mistake
    arrow-race.html     ← what comes next? arrow-key race against the clock + buddy panel
```

No build step, no dependencies (only Google Fonts). **Everything uses relative
paths and classic `<script>` tags (no modules, no fetch)**, so the site works by
simply double-clicking `site/index.html` (`file://`) — keep it that way. Serving
it also works: `cd site && python3 -m http.server 8000`.

**Hosting:** the repo is https://github.com/Denslo/gilili-studio (public). `.github/workflows/pages.yml` publishes `site/` to GitHub Pages on every push to `main`, so the live site is https://denslo.github.io/gilili-studio/ (the index) — push and it updates in about a minute.

## 6. Page catalog

The 2026-11-15 cut kept only these four pages. The removed ones (Ten Machine,
Base-Ten Blocks, Ten Frames, Bead Rack, Hundred Chart, Odometer, What Comes
Next?) are still described by the research above and can come back if needed.

| Page | What it shows | Research idea | Range |
|------|---------------|---------------|-------|
| **Sticks & Bundles** | 10 loose sticks get a rubber band and move to the tens mat. Buttons −10 −5 −2 −1 / +1 +2 +5 +10: sticks arrive one by one and the bundling runs in the middle of the jump (18 + 5 → 23); ±10 moves a whole bundle. Jumps that would leave 0–99 look dimmed and explain themselves. | Bundling (P1) | 0–99 |
| **Adding with Sticks** | Column addition (חיבור במאונך) of two two-digit numbers. Three rows of mats (first number, second number, "together") lined up with the written sum on the right. Steps: join the ones → if ≥ 10, a rubber band goes around 10 of them and the bundle flies to the tens mat *as* the small blue carry "1" pops above the tens column and the ones digit is written → join the tens (+ the carried one) → answer. Levels: no carry / with carry / mixed; "Show me" or "Next step". | Regrouping in written addition (P1 + P2) | sums ≤ 99 |
| **Number Line Jumps** | Step-by-step "make a ten" jumps with number bonds, + and −. | Bridging ten (P7) | within 100 |
| **Ten Twins** | Memory game: match each x9 with its x0. | IM "Crossing the Decade" Concentration (P3) | 9–90 |
| **Spot the Mistake** | The owl counts across a ten, sometimes wrong. Tap the wrong number. | Deliberate mistakes (P4) | 0–99 |
| **Arrow Race** | A number in the middle, four around it (↑ ← → ↓); exactly one is the next number. Arrow keys / tap / swipe, 30 · 60 · 90 s against a countdown ring, score + best per duration (`pv-ar-best-<s>`). Centers lean on the edges (55% x9, 17% x8); distractors are the classic errors — after 29: 40, 20, 39, 28; after 9: 20, 11, 8. A wrong answer shows the right one for 1.4 s and says why ("ten ones make a new ten"). A random **buddy** fills up step by step beside the race (panel on the **left** in both languages, stacked on top on phones): a painting that gets colored region by region (3 original SVG pictures: house / cat / sailboat — when complete the sun smiles and spins, flowers sway, the cat's tail wags, the boat rocks), a rainbow that gains one band per point and, when complete, is visited by a unicorn flying in on an arc, a smoothie glass that fruit plops into and then blends (lid, shake, swirl, straw, smiley), and a monkey climbing to a banana. A mistake takes one step back; finales take ≈ 4–5 s and never pause the race. | Crossing the decade, speed (P3, P8) | 0–99 |


## 7. Code conventions

- Each page = one HTML file in `site/pages/`, linking `../assets/style.css`,
  then at the end of `<body>`: `../assets/strings.js`, `../assets/common.js`,
  and the page logic in an inline `<script>`. Links are always relative.
- **No hard-coded text.** Static text: `<p data-i18n="key"></p>` (common.js fills
  it on load). Dynamic text: `PV.t('key', {param})`. Add every new key to
  `strings.js` with both languages: `S('key', \`English\`, \`עברית\`)`.
- Standard page shell:
  ```html
  <header class="topbar">
    <a class="back" href="../index.html" data-i18n="back"></a>
    <h1 data-i18n="xx_title"></h1>
    <div class="toggles" data-toggles></div>   <!-- common.js adds עברית / 🔔 / 🗣️ toggles -->
  </header>
  <main class="page"> … </main>
  ```
- Shared API (`site/assets/common.js`, global `PV`):
  - `PV.lang` → `'he'` or `'en'`; `PV.t(key, params)` → translated HTML
  - `PV.eq(html)` → keeps an equation left-to-right inside Hebrew text
  - `PV.units(k, 'ten'|'one'|'hundred')` → "2 tens" / "2 עשרות", "1 ten" / "עשרת אחת"
  - `PV.word(n)` → "nineteen" / "תשע־עשרה"
  - `PV.wait(ms)` → Promise
  - `PV.sound.pop() / bundle() / good() / bad() / win()` + celebration flourishes
    `twinkle() / boom() / boing() / gallop() / bubbles() / bells() / whoosh()`
  - `PV.say(text)` — speaks only if the 🗣️ toggle is on
  - `PV.makeDisplay(el, {hundreds})` → `{ show(n), showRaw(tens, ones) }` — big
    colored digit boxes + words ("nineteen · 1 ten and 9 ones")
  - `PV.exchange({...})` — the bundling engine used by the four manipulative
    pages. You supply `onesEl`, `tensEl`, `makeOne()`, `makeTen()`, a
    `groupClass` whose CSS shows the regrouping, a display and a caption. It
    handles +1 / −1 / set(n), the slow crossing sequence and captions, and
    celebrates every crossing (`cheer: false` to turn that off).
    `add(k)` (k may be negative) chains |k| single steps — one stick every
    `stepMs` (280) with the full crossing sequence wherever the ones reach 10 or
    run out — narrated as one equation (`18 + 5 = ?` … `18 + 5 = 23 → …`);
    `add(±10)` moves a whole bundle. `plus()`/`minus()` are `add(±1)`.
    `buttons` takes plain elements or `{ el, k }` pairs; the latter get the
    `dim` class whenever a jump of k would leave 0…max (tapping them shows
    `ex_over` / `ex_under`). Every registered button is `disabled` while a
    sequence runs, and `add/set` return at once when busy.
  - `PV.edgeChips(el, onPick)` — "try crossing a ten" quick-jump chips
  - `PV.bindKeys({plus, minus})`
  - `PV.celebrate('small' | 'big', {sound = true, only = null})` → Promise. Random
    celebration(s) — see §4 "Celebrations" for the effects, levels and where
    each page uses them. `only: ['unicorns', 'rainbow']` forces specific effects
    (handy for testing); `sound: false` when the page already played a jingle.
  - `PV.sparkle(el, n = 8)` — little stars burst out of an element (matched
    card, correct button). `PV.effects` — the list of effect names.
  - `PV.confetti(count, ms)` — canvas confetti on its own (also one of the effects)
  - `PV.shuffle(arr)`, `PV.rand(a, b)`
- All `localStorage` access is wrapped in try/catch (settings only).
- **Click guards (no double actions while animating).** Every input that starts an animation must be ignored until it finishes: a `busy`/`lock`/`answered` flag checked at the top of the handler, plus a `gen` counter bumped on every new round/problem/game so late `setTimeout`s and async loops from the old one return early. Disable the button that was pressed (e.g. "Next") so a double-click can't start two rounds. Used in number-line, edge-match (also locked while cards deal in) and spot-mistake (locked while the owl counts). On the stick pages the lock is a single `busy` flag + `lock(v)` that disables *every* button on the page (step buttons, edge chips, level chips, Show me / Next step / New problem): `PV.exchange` does it internally for the whole chained jump, and bundles-add holds the lock across the entire "Show me" run. Keyboard shortcuts call the same guarded functions, so they are dropped too; nothing is queued. Arrow Race: `locked` from the answer until the next round is drawn (keys, taps, swipes, double-taps in between are ignored), `starting`/`running` so Start / Play again can't run two timers, one `pending` next-round timer cleared on start/finish; the buddy keeps counting `level` during a finale (`partying`) and re-syncs its visuals when it ends, so answers never break an animation.

## 8. Backlog / future features

- [x] ~~Crossing 99 → 100 in the manipulative pages~~ — dropped: the parent wants every number under 100.
- [x] Two-digit + two-digit addition with regrouping (e.g. 27 + 15) — Adding with Sticks (v1.4). Next: let her choose each answer digit before it is revealed.
- [ ] Subtraction with unbundling for two-digit numbers (52 − 26).
- [ ] Progress tracking per skill (which edges are still hard) + simple parent view.
- [ ] Star/sticker rewards across pages.
- [ ] Money model (dimes and pennies) as another 10-for-1 trade.
- [ ] Printable worksheets matching each page.
- [ ] "Daily 5 minutes" mode that mixes one animation + one game (P8).

## 9. Change log

- **2026-11-07** — v1: bible, index, 11 pages, shared engine.
- **2026-11-07** — v1.1: Hebrew (default) + RTL with English toggle; all text moved to `strings.js`; verified working from `file://`.
- **2026-11-15** — v1.2: kept only Sticks & Bundles, Number Line Jumps, Ten Twins and Spot the Mistake; removed the other 7 pages and their strings. Sticks & Bundles is now the "start here" tile.
- **2026-11-15** — v1.3: smoother animations + random celebrations. Springy stick/bundle motion with a rubber-band snap, kangaroo that rides the drawn arc and lands with a squash, bouncy card flips with sparkles, an owl that floats, talks, and reacts (happy / surprised / thinking). New shared `PV.celebrate('small'|'big')` with 13 random, combinable effects (confetti, fireworks, rainbow, unicorns, bunnies, mermaids, original blue forest elves, forest animals, flowers, ships, butterflies, balloons, stars), reduced-motion fallback, wired into all four pages.
- **2026-11-15** — v1.4: sticks increments + adding with sticks. Sticks & Bundles gained −10 −5 −2 −1 / +1 +2 +5 +10 (`PV.exchange.add(k)`: sticks arrive one by one, the bundling/unbundling sequence runs mid-jump, ±10 moves a whole bundle, out-of-range jumps are dimmed and explained). New page **Adding with Sticks** (`bundles-add.html`): column addition of two two-digit numbers with three rows of mats aligned to the written sum; sticks fly between mats (FLIP + Web Animations), ten ones get a band and fly to the tens mat exactly when the small carry "1" appears; levels no carry / with carry / mixed; Show me / Next step. One busy lock per page drops repeated taps and key presses during animations. Celebrations slowed down so the characters can be enjoyed: parades take 3 s (small) / 6.5 s (big) to cross with a gentle glide, fewer characters per parade, staggered; a new celebration replaces the one still running instead of piling up.
- **2026-11-15** — v1.5: **Arrow Race** (`arrow-race.html`). What-comes-next race with the four arrow keys (also tap / swipe), 30 · 60 · 90 s countdown ring, score and best per duration in `localStorage`, `PV.celebrate('big')` at the end. Center numbers biased to x8/x9, distractors are the classic crossing-a-ten errors (210 / 40 / 20 / 39 / 28), wrong answers explained briefly. Buddy panel on the left (both languages) with one random buddy per game — painting (3 original pictures colored region by region, comes alive when complete), rainbow + visiting unicorn, smoothie glass that blends when full, monkey climbing to a banana — each steps back on a mistake and plays a leisurely 4–5 s finale that never pauses the race. Strings under `ar_`; `?buddy=painting|rainbow|smoothie|monkey` forces a buddy for testing.
- **2026-11-15** — v1.6: every number stays under 100. Arrow Race centers go up to 98 (→ 99) and no longer offer "210"-style or ≥ 100 distractors; Spot the Mistake counts up to 89 → 90 and dropped the "x10" mistake; Ten Twins pairs go up to 89 ↔ 90; Number Line ticks and choices stop at 99.

## 10. Sources

Research done 2026-11-07. Most are curricula and teacher guides rather than
studies; the Concordia work is the main research study. The odometer idea is
from a single practitioner blog.

**Bundling / place value**
- Unbounded (Eureka) Grade 2, Module 3, Topic A — https://lessons.unbounded.org/math/grade-2/module-3/topic-a
- Happy Numbers G2 M3 Topic A demo — https://happynumbers.com/demo/cards/294459/
- Fresno Unified Grade 2 Q1 Planner — https://instructional.fresnounified.org/wp-content/uploads/Grade-2-Quarter-1-Planner-17-18-1.pdf
- WestEd, Pacing instruction in Tier 3 — https://dwwlibrary.wested.org/media/pacing-instruction-in-tier-3.html
- Flip Education, Hundreds/Tens/Ones activities — https://flipeducation.ai/curriculum/us/mathematics/grade-2/understanding-hundreds-tens-and-ones/activities
- Boom Learning, Bundles of Tens — https://wow.boomlearning.com/deck/J22pA7Q8AourghRy2

**Unbundling for subtraction**
- Eureka G2 M4 Topic C parent tips — https://archive.southwestschools.org/media/eurekamathgr2/parent-tips_g2m4tc.pdf
- Kentucky Center for Mathematics, Bundles and Sticks — https://kcm.nku.edu/MathHub/docs/KCM_Bundles_and_Sticks.pdf
- Boom Learning, Should I Unbundle a Ten? — https://wow.boomlearning.com/deck/4MBdqiMc2Y9WWRiXa

**Crossing the decade / counting**
- Illustrative Mathematics, Assessing Counting Sequences — https://tasks.illustrativemathematics.org/content-standards/tasks/448
- Illustrative Mathematics, "Crossing the Decade" Concentration — https://tasks.illustrativemathematics.org/content-standards/tasks/405
- Oak National Academy, Crossing the tens boundary — https://www.thenational.academy/pupils/lessons/crossing-the-tens-boundary-counting-forwards/video
- Oak National Academy, Counting patterns within a decade — https://www.thenational.academy/teachers/programmes/maths-primary-ks1/units/pattern-in-counting-from-20-to-100/lessons/counting-patterns-within-a-decade
- Concordia study (counting by tens) — https://www.eurekalert.org/news-releases/1003015 and https://core.ac.uk/download/215487948.pdf
- Think Academy, Counting to 100 — https://www.thethinkacademy.com/blog/?p=31340
- AHS "Cross the Bridge" handout — https://www.ahschools.us/cms/lib/MN01909485/Centricity/domain/4278/grade%20k%20directions/Kcross%20the%20BRIDGE.pdf

**Hundred chart**
- Big Ideas Learning family letter — https://ada.bigideaslearning.com/qr-my24-g0/my24-g0-c10-family-letter-pdf
- k12helper hundred chart slides — https://k12helper.vercel.app/c/k/cc/cc-a/k-cc-a-1/slides/1

**Ten frames, bead rack, virtual manipulatives**
- Workybooks ten frames — https://www.workybooks.com/resources/virtual-manipulatives/ten-frames
- Brilliant, count with ten strips — https://brilliant.org/practice/kindergarten/counting/count-with-ten-strips-to-100/
- Math Learning Center Number Rack (free) — https://www.mathlearningcenter.org/snr
- Toy Theater place value manipulatives — https://toytheater.com/category/teacher-tools/virtual-manipulatives/place-value-manipulatives/
- onlinemathlearning count-by-tens sticks — https://www.onlinemathlearning.com/count-tens-worksheet-game.html
- Lancashire virtual manipulatives list — https://www.lancashire.gov.uk/media/932010/virtual-manipulatives-for-maths.pdf

**Odometer**
- Sine of the Times, The Return of the Odometer — https://www.sineofthetimes.org/the-return-of-the-odometer/

**Bridging ten on a number line**
- Oak, Add by bridging a multiple of ten — https://www.thenational.academy/teachers/programmes/maths-primary-ks1/units/adding-and-subtracting-ones-and-tens-to-and-from-2-digit-numbers/lessons/add-by-bridging-a-multiple-of-ten
- NCETM, Addition and subtraction: bridging 10 — https://ncetm.org.uk/classroom-resources/primm-111-addition-and-subtraction-bridging-10/
- nzmaths — https://nzmaths.co.nz/node/2912
- Dr Alice G, Bridging Through 10 game — https://medium.com/dr-alice-g-on-education/bridging-through-10-game-3-4a314f0aee91
