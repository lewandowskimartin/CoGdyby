import sys
p='src/pages/quiz/wynik.astro'; s=open(p).read()
def rep(a,b,count=1):
    global s
    assert s.count(a)==count, (s.count(a), a[:80])
    s=s.replace(a,b)

rep("""      <p class="q-manage">{MANAGE.lead} <strong""","""      <p class="q-manage"><span data-manage-lead>{MANAGE.lead}</span> <strong""")
rep("To zajmuje około 2 minut.","To zajmuje kilka minut.")
rep("Znasz kogoś, komu też przydadzą się te dwie minuty?","Znasz kogoś, komu ten quiz też się przyda?")
rep("Quiz zajmuje dwie minuty i nie wymaga zapisu:","Quiz zajmuje kilka minut i nie wymaga zapisu:")

# Card with links for this household, right after the plan.
rep("""      <EarlyAccessPromo variant="results" />""","""      <div class="q-card q-home" data-home-card data-local={JSON.stringify(localPages)} hidden>
        <span class="eyebrow">Dopasowane do Twojego domu</span>
        <h2>Przydatne dla Twojego domu</h2>
        <p class="q-home__profile" data-home-profile></p>
        <ul class="q-home__links" data-home-links></ul>
      </div>

      <EarlyAccessPromo variant="results" />""")

# Frontmatter: which local pages are live, so the card never links to a draft.
rep("""const tier = Object.fromEntries(TIERS.map((t) => [t.id, t]));
---""","""const tier = Object.fromEntries(TIERS.map((t) => [t.id, t]));

// Live local pages (slug → name). The household card links to one only if it's published.
const localPages = Object.fromEntries((await publishedAreas()).map((e) => [e.id, e.data?.name ?? e.id]));
---""")
rep("""import '../../styles/quiz.css';""","""import { publishedAreas } from '../../lib/local.js';
import '../../styles/quiz.css';""")

# Script: profile from the URL, scored and worded for the household.
rep("""  import { parseAnswers, scoreAnswers } from '../../lib/quizScore.js';
  import { PACK, AREAS, BENCHMARK } from '../../data/quiz.js';""","""  import { parseAnswers, scoreAnswers, parseProfile, encodeProfile, profileFlags } from '../../lib/quizScore.js';
  import { PACK, AREAS, BENCHMARK, MANAGE, PROFILE_STEPS, PROFILE_LINKS, REGIONS } from '../../data/quiz.js';""")
rep("""  const answers = parseAnswers(new URLSearchParams(location.search).get('a'));""","""  const params = new URLSearchParams(location.search);
  const answers = parseAnswers(params.get('a'));
  const profile = parseProfile(params.get('p'), params.get('r'));
  const flags = profileFlags(profile);""")
rep("""    const r = scoreAnswers(answers);""","""    const r = scoreAnswers(answers, { profile });""")
rep("""    $('[data-manage-text]').textContent = r.manage.text;""","""    if (flags.alone) $('[data-manage-lead]').textContent = MANAGE.leadAlone;
    $('[data-manage-text]').textContent = r.manage.text;""")
rep("""    const storeKey = 'pah_plan_' + answers.join('');""","""    const storeKey = 'pah_plan_' + params.get('a') + (params.get('p') ?? '');""")

# Household card: a one-line summary of what they told us, and the pages that fit.
rep("""    // Pack offer: headline by band""","""    // ---- Matched to your home ----
    const homeCard = $('[data-home-card]');
    if (homeCard) {
      const step = (id) => PROFILE_STEPS.find((s) => s.id === id);
      const parts = [];
      if (profile.home) parts.push(step('home').options.find((o) => o.id === profile.home).short);
      if (profile.people) {
        const n = profile.people;
        parts.push(n >= 6 ? '6 lub więcej osób' : n === 1 ? '1 osoba' : n <= 4 ? `${n} osoby` : `${n} osób`);
      }
      const who = step('who').options.filter((o) => profile.who.includes(o.id)).map((o) => o.short);
      if (who.length) parts.push(who.join(', '));
      const region = REGIONS.find((x) => x.id === profile.region);
      if (region) parts.push(region.label);

      const links = PROFILE_LINKS.filter((l) => flags[l.flag]).map((l) => ({ ...l }));
      const live = JSON.parse(homeCard.dataset.local || '{}');
      if (region && live[region.id]) {
        links.unshift({ href: `/local/${region.id}/`, label: `Województwo ${region.label}: lokalne zagrożenia i ważne numery` });
      }

      if (parts.length) {
        $('[data-home-profile]').textContent = `${parts.join(' · ')}. Pytania i porady są dopasowane do tych odpowiedzi.`;
      }
      const ul = $('[data-home-links]');
      for (const l of links) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = l.href;
        a.textContent = l.label;
        a.addEventListener('click', () => track('quiz_home_link', { href: l.href }, { beacon: true }));
        li.append(a);
        ul.append(li);
      }
      // Only worth a card when there's somewhere to go from it.
      homeCard.hidden = links.length === 0;
    }

    // Pack offer: headline by band""")

# Emailed link: the answers and the home, but never the "needs help" flags (s, c): those are
# about someone's health, and the link is stored by MailerLite.
rep("""      emailForm.querySelector('[data-field="url"]').value = location.origin + location.pathname + '?a=' + answers.join('');""","""      const emailParams = new URLSearchParams({ a: params.get('a') });
      const emailProfile = encodeProfile(profile, { drop: ['s', 'c'] });
      if (emailProfile) emailParams.set('p', emailProfile);
      if (profile.region) emailParams.set('r', profile.region);
      emailForm.querySelector('[data-field="url"]').value = location.origin + location.pathname + '?' + emailParams;""")
open(p,'w').write(s); print('wynik ok')

def edit(path, pairs):
    t=open(path).read()
    for a,b in pairs:
        assert t.count(a)==1,(path,a[:60]); t=t.replace(a,b)
    open(path,'w').write(t); print(path,'ok')

edit('src/components/QuizCta.astro',[
 ("text = `${n} krótkich pytań na podstawie rządowego Poradnika bezpieczeństwa. Dostajesz wynik w skali 0–100, trzy najważniejsze braki i bezpłatny sposób na każdy z nich.`,",
  "text = 'Pytania na podstawie rządowego Poradnika bezpieczeństwa, dopasowane do Twojego domu. Dostajesz wynik w skali 0–100, najważniejsze braki i bezpłatny sposób na każdy z nich.',"),
 ("cta = 'Przejdź quiz (2 minuty)',","cta = 'Przejdź quiz (4 minuty)',"),
 ("Sprawdź w 2 minuty.","Sprawdź w 4 minuty."),
 ("import { QUIZ_PATH, QUESTIONS } from '../data/quiz.js';\nconst n = QUESTIONS.length;","import { QUIZ_PATH } from '../data/quiz.js';"),
])
edit('src/pages/dla-rodziny.astro',[("text=\"Dziesięć prostych pytań, dwie minuty. Zobaczysz,","text=\"Kilka minut i proste pytania dopasowane do Waszego domu. Zobaczysz,")])
edit('src/pages/starsi-rodzice.astro',[("Odpowiedz na dziesięć pytań, myśląc o domu rodziców.","Odpowiedz na pytania quizu, myśląc o domu rodziców.")])
edit('src/pages/index.astro',[("Sprawdź swój dom w 2 minuty","Sprawdź swój dom w 4 minuty")])
edit('src/lib/og/pages.js',[("eyebrow: 'Quiz w 2 minuty',","eyebrow: 'Quiz w 4 minuty',"),("caption: 'Zajmuje 2 minuty'","caption: 'Zajmuje 4 minuty'")])
edit('src/pages/quiz/index.astro',[("'10 krótkich pytań i 2 minuty. Dostajesz wynik w skali 0–100, trzy najważniejsze braki","'Około 4 minut, pytania dopasowane do Twojego domu. Dostajesz wynik w skali 0–100, najważniejsze braki"),("Quiz gotowości · 2 minuty","Quiz gotowości · 4 minuty")])
edit('src/pages/polityka-prywatnosci.astro',[("chyba że wyślesz sobie link z wynikami, który zawiera ich krótki kod.</li>",
 "chyba że wyślesz sobie link z wynikami, który zawiera krótki kod odpowiedzi i podstawowe informacje o domu (rodzaj domu, liczba osób, czy są dzieci lub zwierzęta, województwo). Informacji o osobie starszej, chorej lub z niepełnosprawnością nie dołączamy do linku wysyłanego e-mailem.</li>")])
