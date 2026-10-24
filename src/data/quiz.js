// Quiz gotowości — jedyne źródło prawdy dla pytań, progów punktacji i CTA.
// Kolejność pytań = kolejność wyświetlania. Kolejność AREAS = priorytet rozstrzygania remisów
// dla „najsłabszego obszaru” i braków. Punkty: indeks opcji 0, 1, 2. Wynik = suma punktów × 5 (0–100).

export const QUIZ_PATH = '/quiz/'; // trailing slash: the host redirects the bare path
export const RESULTS_PATH = '/quiz/wynik/';

// Oferta pakietu na stronie wyników. Link do kasy jest w src/config/pack.ts.
import { PACK_CONFIG, packHref } from '../config/pack.ts';

export const PACK = {
  url: packHref(),
  price: PACK_CONFIG.PRICE,
  includes: [
    '12 stron do druku, które wypełniasz ręcznie',
    'Karta na lodówkę z najważniejszymi numerami',
    'Karty ICE do portfela i lista rzeczy do plecaka ewakuacyjnego',
    'Strona planu dla dzieci',
  ],
  reassurance: 'Plik od razu po zakupie · drukujesz bez limitu · zostaje u Ciebie na zawsze',
  fallbackUrl: '/darmowa-karta/',
  fallbackLabel: 'Pobierz darmową kartę na lodówkę',
};

// Adres akcji formularza MailerLite, z PUBLIC_MAILERLITE_ACTION lub wklejony tutaj.
// Pusty = krok z e-mailem jest ukryty.
export const EMAIL_FORM = {
  action: import.meta.env?.PUBLIC_MAILERLITE_ACTION ?? '',
};

export const AREAS = [
  { id: 'plan', label: 'Plan rodzinny' },
  { id: 'power', label: 'Prąd i media' },
  { id: 'supplies', label: 'Jedzenie i woda' },
  { id: 'leaving', label: 'Szybkie opuszczenie domu' },
  { id: 'warnings', label: 'Ostrzeżenia i bliscy' },
];

export const QUESTIONS = [
  {
    id: 'q1',
    cost: 'free',
    tier: 'week',
    effort: '20 minut',
    area: 'plan',
    text: 'Czy macie w domu spisany plan na sytuację kryzysową, z miejscem spotkania, gdyby nie dało się wrócić do domu?',
    options: ['Nie', 'Rozmawialiśmy o tym', 'Tak, jest spisany'],
    gap: 'Brak spisanego planu rodzinnego',
    fix: 'Ustalcie miejsce spotkania i zapiszcie je na kartce, razem z tym, kto do kogo dzwoni.',
    packPage: 'Strony z miejscem spotkania i informacjami o domu',
  },
  {
    id: 'q2',
    cost: 'free',
    tier: 'week',
    effort: '10 minut',
    area: 'plan',
    text: 'Czy najważniejsze numery telefonów są zapisane na papierze, a nie tylko w telefonie?',
    options: ['Nie', 'Niektóre', 'Tak'],
    gap: 'Najważniejsze numery są tylko w telefonie',
    fix: 'Zapisz na kartce pięć numerów: ktoś z rodziny, sąsiad, przychodnia, pogotowie energetyczne i ubezpieczyciel.',
    packPage: 'Strona kontaktów alarmowych i karta na lodówkę',
  },
  {
    id: 'q3',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'supplies',
    text: 'Czy w domu jest jedzenie, które wystarczy wszystkim na kilka dni, także bez gotowania?',
    options: ['Nie', 'Może na jeden dzień', 'Tak, na kilka dni'],
    gap: 'Za mało jedzenia, które nie wymaga gotowania',
    fix: 'Przy najbliższych zakupach dołóż po trzy posiłki bez gotowania na osobę (konserwy, pieczywo chrupkie, orzechy) i sprawdź, czy w szufladzie jest otwieracz do konserw.',
    packPage: 'Lista zestawu awaryjnego',
  },
  {
    id: 'q4',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'supplies',
    text: 'Czy trzymasz w domu zapas wody butelkowanej?',
    options: ['Nie', 'Trochę', 'Tak, wystarczy wszystkim na kilka dni'],
    gap: 'Za mały zapas wody pitnej',
    fix: 'Rządowy Poradnik bezpieczeństwa zaleca co najmniej 3 litry wody na osobę na dobę, na minimum 3 dni. Dla trzyosobowej rodziny to około 27 litrów. Zacznij od kilku zgrzewek przy najbliższych zakupach.',
    packPage: 'Lista zestawu awaryjnego',
  },
  {
    id: 'q5',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'power',
    text: 'Czy masz latarkę, zapasowe baterie i naładowany power bank w miejscu, które znajdziesz po ciemku?',
    options: ['Nie', 'Część z tego', 'Tak, wszystkie trzy'],
    gap: 'Brak latarki lub power banku pod ręką',
    fix: 'Włóż latarkę, zapasowe baterie i power bank do jednej szuflady. Latarka jest bezpieczniejsza niż świece, zwłaszcza przy dzieciach.',
    packPage: 'Lista zestawu awaryjnego',
  },
  {
    id: 'q6',
    cost: 'free',
    tier: 'week',
    effort: '30 minut',
    area: 'power',
    text: 'Czy ktoś w domu wie, jak zakręcić wodę i gaz oraz wyłączyć prąd?',
    options: ['Nie', 'Wiemy o jednym lub dwóch', 'Tak, o wszystkich trzech'],
    gap: 'Nie wiadomo, jak zakręcić wodę i gaz lub wyłączyć prąd',
    fix: 'W najbliższy weekend znajdźcie główny zawór wody, zawór gazu i tablicę z bezpiecznikami. Pokażcie je wszystkim dorosłym i starszym dzieciom.',
    packPage: 'Strona zaworów i wyłączników',
  },
  {
    id: 'q7',
    cost: 'shop',
    tier: 'longer',
    effort: 'Popołudnie',
    area: 'leaving',
    text: 'Gdyby trzeba było wyjść z domu w 10 minut, czy plecak ewakuacyjny jest gotowy?',
    options: ['Nie', 'Częściowo', 'Tak'],
    gap: 'Brak gotowego plecaka ewakuacyjnego',
    fix: 'Zacznij od jednego plecaka przy drzwiach: latarka, power bank, woda, przekąski, leki i kopie dokumentów. Rzeczy dla dzieci dołożysz później.',
    packPage: 'Lista do plecaka ewakuacyjnego',
  },
  {
    id: 'q8',
    cost: 'free',
    tier: 'week',
    effort: '30 minut',
    area: 'leaving',
    text: 'Czy dokumenty tożsamości, polisy i inne ważne papiery da się zabrać w minutę?',
    options: ['Nie', 'Część z nich', 'Tak, leżą razem'],
    gap: 'Ważne dokumenty leżą w różnych miejscach',
    fix: 'Włóż dowody osobiste, akty urodzenia dzieci i polisy (albo ich kopie) do jednej teczki i trzymaj ją obok planu.',
    packPage: 'Strona z informacjami o domu',
  },
  {
    id: 'q9',
    cost: 'free',
    tier: 'week',
    effort: '5 minut',
    area: 'warnings',
    text: 'Czy dowiesz się na czas o ostrzeżeniu przed powodzią, wichurą lub innym zagrożeniem?',
    options: ['Nie wiem', 'Tylko z alertów w telefonie', 'Tak, mam aplikację RSO i śledzę ostrzeżenia IMGW'],
    gap: 'Brak sprawdzonych źródeł ostrzeżeń',
    fix: 'Alert RCB przychodzi SMS-em na każdy telefon w zagrożonym rejonie. Warto też zainstalować bezpłatną aplikację Regionalny System Ostrzegania (RSO) i sprawdzać ostrzeżenia IMGW dla swojego powiatu.',
    packPage: null,
  },
  {
    id: 'q10',
    cost: 'free',
    tier: 'week',
    effort: '10 minut',
    area: 'warnings',
    text: 'Czy jesteście umówieni z sąsiadem lub kimś bliskim, że w razie problemów sprawdzicie, co u siebie słychać?',
    options: ['Nie', 'Tak, ale tylko luźno', 'Tak, wyraźnie się umówiliśmy'],
    gap: 'Nikt nie jest umówiony, że Was sprawdzi',
    fix: 'Wymień się numerami z sąsiadem lub kimś z rodziny i umówcie się, że przy dłuższej przerwie w prądzie sprawdzicie, co u siebie słychać.',
    packPage: 'Strona kontaktów alarmowych',
  },
];

// Strona wyników grupuje wszystkie zaległe działania w te trzy progi. „W tym tygodniu” zawiera
// tylko działania, które nic nie kosztują, więc etykieta to fakt, a nie szacunek ceny.
// `cap` utrzymuje pierwszy próg na tyle krótki, by dało się go skończyć; nadmiar spada niżej.
export const AREA_STATUS = {
  sorted: 'Gotowe',          // komplet punktów
  partly: 'Częściowo',       // połowa lub więcej
  notYet: 'Jeszcze nie',     // poniżej połowy
  start: 'Zacznij tutaj',    // najsłabszy obszar, gdy też jest poniżej połowy
};

// Zdanie o zapasach liczone jest wyłącznie z odpowiedzi o jedzeniu i wodzie. Słabsza z dwóch
// wyznacza przedział: szafka pełna konserw nie pomoże bez wody.
export const MANAGE_AREA = 'supplies';

export const MANAGE_BANDS = [
  { id: 'under-a-day', min: 0, text: 'mniej niż jeden dzień' },
  { id: 'about-a-day', min: 1, text: 'mniej więcej jeden dzień' },
  { id: 'a-few-days', min: 2, text: 'kilka dni', note: ' Poradnik bezpieczeństwa zaleca zapasy na minimum 3 dni.' },
];

export const MANAGE = {
  lead: 'Zapasy jedzenia i wody wystarczą Wam na',
  sub: 'To orientacyjna ocena na podstawie Twoich odpowiedzi o jedzeniu i wodzie.',
  kitLabel: 'Policz zapasy dokładnie dla swojego domu',
};

export const AREAS_HEADING = 'Jak wygląda Twój dom';

export const TIERS = [
  { id: 'week', label: 'W tym tygodniu', note: 'Za darmo, każde zajmie mniej niż godzinę', cap: 3 },
  { id: 'month', label: 'W tym miesiącu', note: 'Pozostałe, od najważniejszych' },
  { id: 'longer', label: 'W dłuższej perspektywie', note: 'Większe zadania i regularne przeglądy' },
];

// Zawsze dopisywane do ostatniego progu, niezależnie od wyniku. Tych rzeczy quiz nie sprawdza,
// a to one utrzymują plan w dobrym stanie, więc nawet komplet punktów zostawia coś do zrobienia.
export const STANDING_ACTIONS = [
  {
    id: 'drill',
    gap: 'Zróbcie jeden wieczór próbny bez prądu',
    fix: 'Wybierzcie wieczór, wyłączcie światło na godzinę i zobaczcie, po co każdy sięga. Tak najszybciej widać, czego brakuje w zapasach. Dzieci zwykle traktują to jak przygodę.',
    effort: 'Jeden wieczór',
    area: null,
    packPage: null,
  },
  {
    id: 'review',
    gap: 'Zaplanuj przegląd zapasów przy zmianie czasu',
    fix: 'Dwa razy w roku, przy zmianie czasu, sprawdź daty ważności jedzenia, wody, baterii i leków. Przeczytajcie też razem plan, żeby wszyscy go pamiętali.',
    effort: 'Dwa razy w roku',
    area: null,
    packPage: null,
  },
];

export const BANDS = [
  {
    id: 'starting',
    min: 0,
    label: 'Początek drogi',
    summary: 'Tu zaczyna większość domów. Każdy krok poniżej jest mały i da się go zrobić przy okazji.',
    cta: 'Pakiet przeprowadzi Cię przez wszystkie te kroki, strona po stronie.',
    course: {
      lead: true,
      heading: 'Wolisz przejść przez to z przewodnikiem?',
      text: 'Braków jest kilka i sama lista rzadko wystarcza, żeby je uzupełnić. Kurs „Gotowi w 30 dni” prowadzi od miejsca, w którym jesteś teraz, jednym krótkim krokiem w tygodniu: woda, ciepło i światło, jedzenie i leki, plan na wypadek, gdy telefony nie działają, a na koniec próbny wieczór bez prądu i wydrukowany plan.',
    },
  },
  {
    id: 'partly',
    min: 40,
    label: 'W połowie drogi',
    summary: 'Część podstaw jest już gotowa. Pozostałe braki uzupełnisz szybko.',
    cta: 'Pakiet pomoże uzupełnić te braki i zebrać wszystko na papierze.',
    course: {
      lead: false,
      heading: 'Zostały rzeczy, które najłatwiej odłożyć',
      text: 'Łatwiejsza połowa jest za Tobą. Kurs „Gotowi w 30 dni” obejmuje to, co zwykle zostaje na później: wymianę zapasów, plan na wypadek, gdy telefony nie działają, i jeden próbny wieczór bez prądu.',
    },
  },
  {
    id: 'well',
    min: 75,
    label: 'Dom dobrze przygotowany',
    summary: 'Większość podstaw jest już gotowa.',
    cta: 'Najtrudniejsze za Tobą. Przenieś plan na papier, żeby był pod ręką, gdy zabraknie prądu.',
    course: {
      lead: false,
      heading: 'Czy domownicy poradzą sobie bez Ciebie?',
      text: 'Kurs „Gotowi w 30 dni” pomaga przekazać plan reszcie rodziny. Chodzi o to, żeby każdy domownik wiedział, co robić, nawet gdy Ciebie nie ma w domu, i żeby wszystko było spisane na papierze.',
    },
  },
];

export const BENCHMARK = {
  text: 'Rządowy Poradnik bezpieczeństwa zaleca, by każdy dom miał zapasy wody, jedzenia i leków na minimum 3 dni.',
  url: 'https://www.gov.pl/poradnikbezpieczenstwa',
};
