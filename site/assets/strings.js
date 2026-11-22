/* All user-facing text, English + Hebrew side by side. See docs/BIBLE.md §7.
   S(key, en, he). Values are HTML. {name} is replaced by PV.t(key, {name: ...}).
   Wrap math (equations, ranges) in <span class="eq">…</span> so it stays left-to-right in Hebrew. */
const STRINGS = { en: {}, he: {} };
function S(key, en, he) { STRINGS.en[key] = en; STRINGS.he[key] = he; }

/* ---------- shared ---------- */
S('back', `← All activities`, `→ כל הפעילויות`);
S('tg_sound', `Sound effects`, `צלילים`);
S('tg_speak', `Say numbers out loud`, `הקראת המספרים`);
S('tg_lang', `Hebrew / English`, `עברית / אנגלית`);
S('speak_on', `I will say the numbers`, `אני אגיד את המספרים`);
S('kbd_hint', `Keyboard: ← take one away · → add one`, `מקלדת: ← להוריד אחת · → להוסיף אחת`);
S('edge_up', `Start just before a ten (then <span class="eq">+1</span>):`, `התחילו רגע לפני עשרת (ואז <span class="eq">+1</span>):`);
S('edge_down', `Start on a ten (then <span class="eq">−1</span>):`, `התחילו בעשרת שלמה (ואז <span class="eq">−1</span>):`);
S('lbl_hundreds', `hundreds`, `מאות`);
S('lbl_tens', `tens`, `עשרות`);
S('lbl_ones', `ones`, `יחידות`);
S('too_many', `{tens} and {ones} — too many ones!`, `{tens} ו־{ones} — יותר מדי יחידות!`);

/* ---------- exchange engine (sticks & bundles) ---------- */
S('ex_max', `{max} is the biggest number on this page.`, `<span class="eq">{max}</span> הוא המספר הכי גדול בעמוד הזה.`);
S('ex_ten_ones', `Now there are <b class="o">10 ones</b>! That is too many for the ones place…`, `עכשיו יש <b class="o">10 יחידות</b>! זה יותר מדי בשביל מקום היחידות…`);
S('say_ten_ones', `ten ones!`, `עשר יחידות!`);
S('ex_make_ten', `<b class="o">10 ones</b> make <b class="t">1 ten</b>!`, `<b class="o">10 יחידות</b> הן <b class="t">עשרת אחת</b>!`);
S('ex_done', `{eq} → {tens} and {ones}`, `{eq} — {tens} ו־{ones}`);
S('say_plus1', `{a} plus one is {b}`, `{a} ועוד אחת זה {b}`);
S('say_minus1', `{a} minus one is {b}`, `{a} פחות אחת זה {b}`);
S('ex_zero', `We are at zero — nothing to take away!`, `אנחנו באפס — אין מה להוריד!`);
S('ex_open', `There are <b class="o">0 ones</b> to take away! Let's <b>open a ten</b>.`, `יש <b class="o">0 יחידות</b> — אין מה להוריד! בואו <b>נפרק עשרת</b>.`);
S('ex_opened', `<b class="t">1 ten</b> opens into <b class="o">10 ones</b>. Now we can take one away.`, `<b class="t">עשרת אחת</b> נפתחת ל־<b class="o">10 יחידות</b>. עכשיו אפשר להוריד אחת.`);
S('ex_set', `This is <b>{n}</b>. Press <b class="eq">+1</b> or <b class="eq">−1</b>.`, `זה <b>{n}</b>. לחצו <b class="eq">+1</b> או <b class="eq">−1</b>.`);
S('ex_over', `<span class="eq">{n} + {k}</span> is more than {max} — the biggest number on this page.`, `<span class="eq">{n} + {k}</span> זה יותר מ־{max} — המספר הכי גדול בעמוד הזה.`);
S('ex_under', `<span class="eq">{n} − {k}</span> is less than 0 — we can't take away that many!`, `<span class="eq">{n} − {k}</span> זה פחות מאפס — אי אפשר להוריד כל כך הרבה!`);
S('say_plus', `{a} plus {k} is {b}`, `{a} ועוד {k} זה {b}`);
S('say_minus', `{a} minus {k} is {b}`, `{a} פחות {k} זה {b}`);
S('mat_tens', `Tens`, `עשרות`);
S('mat_ones', `Ones`, `יחידות`);

/* ---------- index ---------- */
S('site_title', `Number Lab`, `מעבדת המספרים`);
S('hero_a', `Number`, `מעבדת`);
S('hero_b', `Lab`, `המספרים`);
S('hero_sub', `Games and animations for adding and subtracting up to 100 — and for the tricky moment when <b>19 becomes 20</b>.`,
  `משחקים ואנימציות לחיבור ולחיסור עד 100 — ובמיוחד לרגע המבלבל שבו <b>19 הופך ל־20</b>.`);
S('idea_ones', `10 ones`, `10 יחידות`);
S('idea_ten', `1 ten`, `עשרת אחת`);
S('idea_note', `— every page here shows this one big idea.`, `— כל עמוד כאן מראה את הרעיון הגדול הזה.`);
S('sec_watch', `👀 Watch it happen`, `👀 צפו איך זה קורה`);
S('sec_watch_sub', `Press <span class="eq">+1</span> and <span class="eq">−1</span> and watch how the number changes when you cross a ten.`,
  `לחצו <span class="eq">+1</span> ו־<span class="eq">−1</span> וראו איך המספר משתנה כשעוברים עשרת.`);
S('sec_strat', `🦘 Adding &amp; taking away`, `🦘 חיבור וחיסור`);
S('sec_strat_sub', `A smart way to add or subtract across a ten.`, `דרך חכמה לחבר ולחסר מעבר לעשרת.`);
S('sec_games', `🎮 Games`, `🎮 משחקים`);
S('sec_games_sub', `Quick practice on the "edges" — the numbers right before and after a ten.`, `תרגול קצר על ה"גבולות" — המספרים שרגע לפני ורגע אחרי עשרת.`);
S('tag_start', `Start here`, `מתחילים כאן`);
S('tag_memory', `Memory`, `זיכרון`);
S('tag_listen', `Listening`, `הקשבה`);
S('tag_addsub', `+ and −`, `+ ו־−`);

S('bu_name', `Sticks &amp; Bundles`, `מקלות וצרורות`);
S('bu_desc', `10 loose sticks get a rubber band and become 1 bundle of ten.`, `10 מקלות בודדים מקבלים גומייה והופכים לצרור אחד של עשר.`);
S('nl_name', `Number Line Jumps`, `קפיצות על ישר המספרים`);
S('nl_desc', `Make a ten first: <span class="eq">38 + 5 = 38 + 2 + 3</span>. Step-by-step jumps with number bonds.`,
  `קודם משלימים לעשרת: <span class="eq">38 + 5 = 38 + 2 + 3</span>. קפיצות צעד אחר צעד עם פירוק המספר.`);
S('em_name', `Ten Twins`, `תאומי העשרת`);
S('em_desc', `Memory game: match 29 with 30, 59 with 60, 89 with 90…`, `משחק זיכרון: מתאימים את 29 ל־30, את 59 ל־60, את 89 ל־90…`);
S('sm_name', `Spot the Mistake`, `מצאו את הטעות`);
S('sm_desc', `Ollie the Owl counts across a ten — sometimes wrong. Can you catch it?`, `ינשופי הינשוף סופר מעבר לעשרת — ולפעמים טועה. תצליחו לתפוס אותו?`);

S('tips_title', `👨‍👩‍👧 Tips for grown-ups`, `👨‍👩‍👧 טיפים להורים`);
S('tip1', `<b>Short and often.</b> 5–10 minutes a day works better than one long session.`, `<b>קצר ולעתים קרובות.</b> 5–10 דקות ביום עובדות טוב יותר מפעם אחת ארוכה.`);
S('tip2', `<b>Start with Sticks &amp; Bundles</b>, starting at 17. Ask "what will happen to the tens?" <i>before</i> pressing <span class="eq">+1</span>.`,
  `<b>התחילו ב"מקלות וצרורות"</b> מ־17. שאלו "מה יקרה לעשרות?" <i>לפני</i> שלוחצים <span class="eq">+1</span>.`);
S('tip3', `<b>Go backwards too.</b> 40 → 39 is often harder than 39 → 40. Use <span class="eq">−1</span> and the "Start on a ten" buttons.`,
  `<b>גם אחורה.</b> המעבר מ־40 ל־39 קשה לפעמים יותר מהמעבר מ־39 ל־40. השתמשו ב־<span class="eq">−1</span> ובכפתורי "התחילו בעשרת שלמה".`);
S('tip4', `<b>Say it in tens and ones:</b> "29 is 2 tens and 9 ones. One more one makes 10 ones — a new ten!"`,
  `<b>דברו בעשרות ויחידות:</b> "29 זה 2 עשרות ו־9 יחידות. עוד יחידה אחת עושה 10 יחידות — עשרת חדשה!"`);
S('tip5', `<b>Try real objects as well.</b> Straws or popsicle sticks with rubber bands work just like the Sticks page.`,
  `<b>נסו גם עם חפצים אמיתיים.</b> קשיות או מקלות ארטיק עם גומיות עובדים בדיוק כמו עמוד המקלות.`);
S('tip6', `<b>Make mistakes on purpose.</b> Count "<span class="eq">…28, 29, 40!</span>" and let her catch you — just like Ollie the Owl.`,
  `<b>טעו בכוונה.</b> ספרו "<span class="eq">…28, 29, 40!</span>" ותנו לה לתפוס אתכם — בדיוק כמו ינשופי הינשוף.`);
S('tip7', `<b>The 🔔, 🗣️ and "עברית" buttons</b> (top of every page) turn sounds, spoken numbers and Hebrew on or off.`,
  `<b>הכפתורים 🔔, 🗣️ ו"עברית"</b> (בראש כל עמוד) מפעילים או מכבים צלילים, הקראת מספרים ועברית.`);
S('tip8', `Keyboard: <b>→</b> adds one and <b>←</b> takes one away on the animation pages.`, `מקלדת: <b>→</b> מוסיף אחת ו־<b>←</b> מוריד אחת בעמודי האנימציה.`);
S('footer', `Built with research from Eureka Math, Oak National Academy, Illustrative Mathematics, NCETM and others — see <code>docs/BIBLE.md</code>.`,
  `נבנה על בסיס מחקר מ־Eureka Math, Oak National Academy, Illustrative Mathematics, NCETM ועוד — ראו <code>docs/BIBLE.md</code>.`);

/* ---------- Sticks & Bundles ---------- */
S('bu_title', `🪵 Sticks &amp; Bundles`, `🪵 מקלות וצרורות`);
S('bu_intro', `When we have <b class="o">10 loose sticks</b>, we put a rubber band around them. Now they are <b class="t">1 bundle of ten</b>, and the bundle moves to the tens side.`,
  `כשיש לנו <b class="o">10 מקלות בודדים</b>, שמים עליהם גומייה. עכשיו הם <b class="t">צרור אחד של עשר</b>, והצרור עובר לצד של העשרות.`);
S('bu_mat_tens', `Tens (bundles)`, `עשרות (צרורות)`);
S('bu_mat_ones', `Ones (loose sticks)`, `יחידות (מקלות)`);
S('bu_start', `Press <b class="eq">+1</b> to add a stick. What happens at 20?`, `לחצו <b class="eq">+1</b> כדי להוסיף מקל. מה יקרה ב־20?`);
S('bu_steps', `Add or take away several sticks at once. Try <span class="eq">18 + 5</span> — watch the ones reach 10 in the middle of the jump!`,
  `הוסיפו או הורידו כמה מקלות בבת אחת. נסו <span class="eq">18 + 5</span> — שימו לב איך היחידות מגיעות ל־10 באמצע הקפיצה!`);

/* ---------- Adding with Sticks (column addition) ---------- */
S('ba_name', `Adding with Sticks`, `חיבור עם מקלות`);
S('ba_desc', `Column addition with sticks: join the ones, bundle 10 of them into a new ten and carry the 1 — <span class="eq">26 + 47</span>.`,
  `חיבור במאונך עם מקלות: מחברים את היחידות, אורזים 10 מהן לעשרת חדשה ומעבירים את ה־1 — <span class="eq">26 + 47</span>.`);
S('ba_title', `➕ Adding with Sticks`, `➕ חיבור עם מקלות`);
S('ba_intro', `We add <b class="o">ones with ones</b> and <b class="t">tens with tens</b>. When the ones make 10 or more, we put a rubber band around 10 of them — a new ten — and <b>carry</b> it to the tens column. That is the little <b class="t">1</b> written above the tens.`,
  `מחברים <b class="o">יחידות עם יחידות</b> ו<b class="t">עשרות עם עשרות</b>. כשמתקבלות 10 יחידות או יותר, שמים גומייה על 10 מהן — עשרת חדשה — ו<b>מעבירים</b> אותה לטור העשרות. זה ה־<b class="t">1</b> הקטן שכותבים מעל העשרות.`);
S('ba_level', `Problems:`, `תרגילים:`);
S('ba_lv_easy', `No carry`, `בלי העברה`);
S('ba_lv_carry', `With carry`, `עם העברה`);
S('ba_lv_mix', `Mixed`, `מעורב`);
S('ba_show', `🎬 Show me`, `🎬 הראו לי`);
S('ba_step', `Next step →`, `הצעד הבא ←`);
S('ba_new', `New problem`, `תרגיל חדש`);
S('ba_row_sum', `together`, `ביחד`);
S('ba_lbl_carry', `carry`, `העברה`);
S('ba_start', `First we add the <b class="o">ones</b>. Press <b>Next step</b>.`, `קודם מחברים את ה<b class="o">יחידות</b>. לחצו <b>הצעד הבא</b>.`);
S('ba_ones_ok', `Ones: {eq}. We write <b class="o">{d}</b> in the ones place.`, `יחידות: {eq}. כותבים <b class="o">{d}</b> במקום היחידות.`);
S('ba_ones_many', `Ones: {eq}. <b class="o">{n} ones</b> — too many for the ones place! 10 of them make a ten…`,
  `יחידות: {eq}. <b class="o">{n} יחידות</b> — יותר מדי בשביל מקום היחידות! 10 מהן הן עשרת…`);
S('ba_band', `We put a rubber band around <b class="o">10 ones</b> — that is <b class="t">1 ten</b>!`, `שמים גומייה על <b class="o">10 יחידות</b> — זאת <b class="t">עשרת אחת</b>!`);
S('ba_carry', `The new ten moves to the tens column, and we write a small <b class="t">1</b> above — the carry. <b class="o">{d}</b> stay in the ones place.`,
  `העשרת החדשה עוברת לטור העשרות, וכותבים <b class="t">1</b> קטן למעלה — זאת ההעברה. במקום היחידות נשארות <b class="o">{d}</b>.`);
S('ba_tens', `Tens: {eq}. We write <b class="t">{d}</b> in the tens place.`, `עשרות: {eq}. כותבים <b class="t">{d}</b> במקום העשרות.`);
S('ba_tens_carry', `Tens: {eq} — don't forget the carried <b class="t">1</b>! We write <b class="t">{d}</b> in the tens place.`,
  `עשרות: {eq} — לא לשכוח את ה־<b class="t">1</b> שהעברנו! כותבים <b class="t">{d}</b> במקום העשרות.`);
S('ba_done', `⭐ {eq} → {tens} and {ones}`, `⭐ {eq} — {tens} ו־{ones}`);
S('ba_say', `{a} plus {b} is {r}`, `{a} ועוד {b} זה {r}`);

/* ---------- Number Line ---------- */
S('nl_title', `🦘 Number Line Jumps`, `🦘 קפיצות על ישר המספרים`);
S('nl_intro', `<b>Make a ten first!</b> To work out <span class="eq">38 + 5</span>, first jump to the next ten (<span class="eq">38 + <b class="o">2</b> = 40</span>), then jump the rest (<span class="eq">40 + <b class="g">3</b> = 43</span>). It works for taking away too: <span class="eq">52 − 4 → 52 − 2 = 50 → 50 − 2 = 48</span>.`,
  `<b>קודם משלימים לעשרת!</b> כדי לחשב <span class="eq">38 + 5</span>, קופצים קודם לעשרת הבאה (<span class="eq">38 + <b class="o">2</b> = 40</span>), ואז קופצים את השאר (<span class="eq">40 + <b class="g">3</b> = 43</span>). זה עובד גם בחיסור: <span class="eq">52 − 4 → 52 − 2 = 50 → 50 − 2 = 48</span>.`);
S('nl_practice', `Practice:`, `תרגול:`);
S('nl_add', `Adding +`, `חיבור +`);
S('nl_sub', `Taking away −`, `חיסור −`);
S('nl_both', `Both`, `שניהם`);
S('nl_q0_add', `How many to jump from <b>{a}</b> up to the next ten, <b class="t">{ten}</b>?`, `כמה צריך לקפוץ מ־<b>{a}</b> עד העשרת הבאה, <b class="t">{ten}</b>?`);
S('nl_q0_sub', `How many to jump back from <b>{a}</b> to the ten, <b class="t">{ten}</b>?`, `כמה צריך לקפוץ אחורה מ־<b>{a}</b> עד העשרת, <b class="t">{ten}</b>?`);
S('nl_step1', `Step 1: get to the ten.`, `שלב 1: משלימים לעשרת.`);
S('nl_q1_add', `We need to add <b>{b}</b> in all. We used <b class="o">{s1}</b>. How many are left?`, `צריך להוסיף <b>{b}</b> בסך הכול. כבר הוספנו <b class="o">{s1}</b>. כמה נשאר?`);
S('nl_q1_sub', `We need to take away <b>{b}</b> in all. We used <b class="o">{s1}</b>. How many are left?`, `צריך להוריד <b>{b}</b> בסך הכול. כבר הורדנו <b class="o">{s1}</b>. כמה נשאר?`);
S('nl_q2', `So, {eq} = ?`, `אז כמה זה {eq}?`);
S('nl_c0', `{eq}. We made a ten!`, `{eq}. השלמנו לעשרת!`);
S('nl_c1', `<b>{b}</b> is <b class="o">{s1}</b> and <b class="g">{s2}</b>. {eq}`, `<b>{b}</b> זה <b class="o">{s1}</b> ו־<b class="g">{s2}</b>. {eq}`);
S('nl_great', `⭐ Great! {eq}`, `⭐ כל הכבוד! {eq}`);
S('nl_say_add', `{a} plus {b} is {r}`, `{a} ועוד {b} זה {r}`);
S('nl_say_sub', `{a} minus {b} is {r}`, `{a} פחות {b} זה {r}`);
S('nl_h0', `Count the little jumps from {a} to {ten} on the line.`, `ספרו את הקפיצות הקטנות מ־{a} עד {ten} על הישר.`);
S('nl_h1', `{eq} — what goes with {s1} to make {b}?`, `{eq} — כמה צריך להוסיף ל־{s1} כדי לקבל {b}?`);
S('nl_h2', `Look where the dot landed on the number line!`, `הסתכלו איפה הנקודה נחתה על ישר המספרים!`);
S('nl_show', `🎬 Show me`, `🎬 הראו לי`);
S('nl_next', `Next problem →`, `התרגיל הבא ←`);

/* ---------- Ten Twins ---------- */
S('em_title', `👯 Ten Twins`, `👯 תאומי העשרת`);
S('em_intro', `Memory game! Flip two cards. Find each number and the number that comes <b>right after it</b> — like <b>29</b> and <b>30</b>. Watch the <b class="t">tens</b> digit change!`,
  `משחק זיכרון! הופכים שני קלפים. מצאו כל מספר ואת המספר שבא <b>מיד אחריו</b> — כמו <b>29</b> ו־<b>30</b>. שימו לב איך ספרת ה<b class="t">עשרות</b> משתנה!`);
S('em_pairs', `Pairs:`, `זוגות:`);
S('em_flips', `Flips:`, `הפיכות:`);
S('em_tap', `Tap a card to flip it.`, `לחצו על קלף כדי להפוך אותו.`);
S('em_new', `New game`, `משחק חדש`);
S('em_match', `✅ {eq}! 9 ones + 1 = 10 ones = 1 more ten.`, `✅ {eq}! 9 יחידות ועוד אחת הן 10 יחידות — עוד עשרת!`);
S('em_all', `🎉 You found all 6 twins in <b>{f}</b> flips!`, `🎉 מצאתם את כל 6 הזוגות ב־<b>{f}</b> הפיכות!`);
S('em_not', `{a} and {b} are not twins. Twins are next-door numbers, like <b>19</b> and <b>20</b>.`, `{a} ו־{b} הם לא תאומים. תאומים הם מספרים שכנים, כמו <b>19</b> ו־<b>20</b>.`);

/* ---------- Spot the Mistake ---------- */
S('sm_title', `🦉 Spot the Mistake`, `🦉 מצאו את הטעות`);
S('sm_intro', `Ollie the Owl is learning to count, but sometimes makes a mistake when crossing a ten. Listen and watch. Tap the <b>wrong</b> number — or tell Ollie it was all right!`,
  `ינשופי הינשוף לומד לספור, אבל לפעמים טועה כשהוא עובר עשרת. הקשיבו והסתכלו. לחצו על המספר <b>השגוי</b> — או תגידו לינשופי שהכול היה נכון!`);
S('sm_score', `Score: {n}`, `ניקוד: {n}`);
S('sm_up', `Let me count up…`, `אני סופר קדימה…`);
S('sm_down', `Let me count down…`, `אני סופר אחורה…`);
S('sm_right_q', `Did I get it right?`, `צדקתי?`);
S('sm_all_ok', `👍 All correct!`, `👍 הכול נכון!`);
S('sm_tap', `Tap the wrong number — or press <b>All correct!</b>`, `לחצו על המספר השגוי — או על <b>הכול נכון!</b>`);
S('sm_exp_fwd', `After <b>{prev}</b> comes <b>{c}</b>: {prev} has <b class="o">9 ones</b>, one more makes <b class="o">10 ones</b> = a new ten, so the <b class="t">tens</b> go from {t} to {t1}.`,
  `אחרי <b>{prev}</b> בא <b>{c}</b>: ב־{prev} יש <b class="o">9 יחידות</b>, עוד אחת עושה <b class="o">10 יחידות</b> — עשרת חדשה, אז מספר ה<b class="t">עשרות</b> עולה מ־{t} ל־{t1}.`);
S('sm_exp_back', `Before <b>{prev}</b> comes <b>{c}</b>: {prev} has <b class="o">0 ones</b>, so we open a ten — <b class="t">{tens}</b> and <b class="o">9 ones</b>.`,
  `לפני <b>{prev}</b> בא <b>{c}</b>: ב־{prev} יש <b class="o">0 יחידות</b>, אז מפרקים עשרת — ויש <b class="t">{tens}</b> ו־<b class="o">9 יחידות</b>.`);
S('sm_why_skip', `skipped a whole ten`, `דילג על עשרת שלמה`);
S('sm_why_stay', `forgot to change the tens`, `שכח לשנות את העשרות`);
S('sm_why_noopen', `forgot to open a ten — the tens digit must go down`, `שכח לפרק עשרת — ספרת העשרות צריכה לרדת`);
S('sm_why_nine', `forgot the 9 ones`, `שכח את 9 היחידות`);
S('sm_catch', `⭐ Good catch! Ollie {why}. `, `⭐ תפסתם! ינשופי {why}. `);
S('sm_none', `⭐ Right — no mistakes this time! `, `⭐ נכון — הפעם לא היו טעויות! `);
S('sm_oops', `Oops! Thank you for catching that!`, `אופס! תודה שתפסתם!`);
S('sm_yay', `Yay, I got it right!`, `יש! צדקתי!`);
S('sm_was', `Hmm, the mistake was {v}.`, `הממ, הטעות הייתה {v}.`);
S('sm_actually', `Actually, I counted it all right!`, `בעצם, ספרתי הכול נכון!`);
S('sm_next', `Next →`, `הבא ←`);

/* ---------- Arrow Race ---------- */
S('ar_title', `🏁 Arrow Race`, `🏁 מרוץ החצים`);
S('ar_name', `Arrow Race`, `מרוץ החצים`);
S('ar_desc', `What comes next? Race the clock with the arrow keys — every right answer paints a picture, builds a rainbow or fills a smoothie cup.`,
  `מה המספר הבא? מרוץ נגד השעון עם מקשי החצים — כל תשובה נכונה צובעת תמונה, בונה קשת או ממלאת כוס שייק.`);
S('tag_race', `Speed`, `מהירות`);
S('ar_intro', `The number in the middle wants to know what comes <b>next</b>. Only one of the four numbers around it is right — press the arrow pointing to it (or tap it) as many times as you can before the clock runs out. Careful at the tens: after <b>29</b> comes <b>30</b>, not 40! Every right answer helps your buddy on the side.`,
  `המספר באמצע רוצה לדעת מה בא <b>אחריו</b>. רק אחד מארבעת המספרים מסביב נכון — לחצו על החץ שמצביע אליו (או עליו עצמו) כמה שיותר פעמים לפני שהזמן נגמר. שימו לב בעשרות: אחרי <b>29</b> בא <b>30</b>, לא 40! כל תשובה נכונה עוזרת לחבר שבצד.`);
S('ar_pick', `How long is the race?`, `כמה זמן יימשך המרוץ?`);
S('ar_sec', `{n} seconds`, `{n} שניות`);
S('ar_start', `🏁 Go!`, `🏁 יוצאים!`);
S('ar_how', `<span class="eq">← ↑ → ↓</span> on the keyboard, tap a number, or swipe.`, `<span class="eq">← ↑ → ↓</span> במקלדת, לחיצה על מספר, או החלקה עם האצבע.`);
S('ar_score', `Score: {n}`, `ניקוד: {n}`);
S('ar_best', `Best in {s} seconds: <b>{n}</b>`, `השיא ב־{s} שניות: <b>{n}</b>`);
S('ar_nobest', `No best score yet for {s} seconds.`, `עוד אין שיא ל־{s} שניות.`);
S('ar_ready', `Ready…`, `מוכנים…`);
S('ar_q', `What comes after <b>{n}</b>?`, `מה בא אחרי <b>{n}</b>?`);
S('ar_good', `✅ {eq}`, `✅ {eq}`);
S('ar_good_cross', `✅ {eq} — 9 ones + 1 = 10 ones = a new ten!`, `✅ {eq} — 9 יחידות ועוד אחת הן 10 יחידות — עשרת חדשה!`);
S('ar_wrong', `Not {w}. After <b>{n}</b> comes <b>{c}</b>.`, `לא {w}. אחרי <b>{n}</b> בא <b>{c}</b>.`);
S('ar_wrong_cross', `Not {w}. {eq}: ten ones make a new ten, and the ones go back to 0.`, `לא {w}. {eq}: עשר יחידות הן עשרת חדשה, והיחידות חוזרות ל־0.`);
S('ar_time', `⏱️ Time's up!`, `⏱️ נגמר הזמן!`);
S('ar_result', `<b>{n}</b> right answers in {s} seconds!`, `<b>{n}</b> תשובות נכונות ב־{s} שניות!`);
S('ar_misses', `Mistakes: {n}`, `טעויות: {n}`);
S('ar_newbest', `🏆 New best score!`, `🏆 שיא חדש!`);
S('ar_again', `🏁 Play again`, `🏁 עוד פעם`);
S('ar_change', `Change time`, `לשנות זמן`);
S('ar_buddy_monkey', `Help the monkey climb up to the banana!`, `עזרו לקוף לטפס עד הבננה!`);
S('ar_buddy_paint', `Paint the picture, one color at a time!`, `צבעו את התמונה, צבע אחרי צבע!`);
S('ar_buddy_rainbow', `Build the rainbow — then a unicorn will come to visit!`, `בנו את הקשת — ואז חד־קרן יבוא לבקר!`);
S('ar_buddy_smoothie', `Fill the glass with fruit for a smoothie!`, `מלאו את הכוס בפירות לשייק!`);
