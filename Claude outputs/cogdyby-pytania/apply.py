#!/usr/bin/env python3
"""Apply the "Co gdyby…?" questions to the CoGdyby repo. Run from the repo root:
   python3 <path>/apply.py <path>/pytania.json
Every replacement must match exactly once, otherwise nothing is written."""
import json, sys, pathlib

root = pathlib.Path('.')
data = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
TAG = '{% cogdyby /%}'
out = {}

def read(p):
    return out.get(p) or (root / p).read_text(encoding='utf-8')

def rep(p, old, new):
    s = read(p)
    n = s.count(old)
    if n != 1:
        sys.exit(f'ABORT {p}: expected 1 match, got {n}: {old[:70]!r}')
    out[p] = s.replace(old, new)

# 1. Posts: frontmatter + tag under the intro
for slug, items in data.items():
    p = f'src/content/blog/{slug}.mdoc'
    s = read(p)
    if 'pytania:' in s or TAG in s:
        sys.exit(f'ABORT {p}: already has pytania')
    lines = s.split('\n')
    assert lines[0] == '---'
    end = lines.index('---', 1)
    yaml = ['pytania:']
    for q, a, sec in items:
        yaml += [f'  - pytanie: {json.dumps(q, ensure_ascii=False)}',
                 f'    odpowiedz: {json.dumps(a, ensure_ascii=False)}',
                 f'    sekcja: {json.dumps(sec, ensure_ascii=False)}']
    lines[end:end] = yaml
    first_h2 = next(i for i, l in enumerate(lines) if l.startswith('## '))
    lines[first_h2:first_h2] = [TAG, '']
    body = '\n'.join(lines)
    for q, a, sec in items:
        if f'\n## {sec}\n' not in body:
            sys.exit(f'ABORT {p}: no heading "## {sec}"')
    out[p] = body

# 2. Small additions so every question is answered in the post itself
B = 'src/content/blog/'
rep(B + 'bezpieczenstwo-pozarowe-w-domu.mdoc',
    'gdy czujka zacznie sygnalizować rozładowanie.',
    'gdy czujka zacznie sygnalizować rozładowanie. Zwykle robi to krótkimi, pojedynczymi piknięciami co jakiś czas.\n'
    '- Głośny, ciągły alarm, także w nocy, oznacza dym. Obudź domowników i wyjdźcie tak, jak w planie wyjścia.')
rep(B + 'co-robic-gdy-czujesz-gaz.mdoc',
    'Jeśli podejrzewasz zatrucie czadem, wyprowadź',
    'Jeśli czujnik czadu włączy alarm albo podejrzewasz zatrucie, wyprowadź')
rep(B + 'domowe-umiejetnosci.mdoc',
    'poproś hydraulika o wymianę, zanim będzie potrzebny.',
    'poproś hydraulika o wymianę, zanim będzie potrzebny. Gdy wybije bezpiecznik, podnieś w tablicy wyłącznik, który zadziałał. '
    'Jeśli od razu wyłącza się znowu, odłącz ostatnio włączone urządzenie, a gdy to nie pomaga, wezwij elektryka.')
rep(B + 'syreny-alarmowe-sygnaly.mdoc',
    'Radio na baterie przyda się, gdy nie ma prądu.\n',
    'Radio na baterie przyda się, gdy nie ma prądu.\n- W nocy obudź domowników. Latarka i radio na baterie w stałym miejscu ułatwią to po ciemku.\n')
rep(B + 'alert-rcb-jak-dziala.mdoc',
    'np. starszym rodzicom.\n',
    'np. starszym rodzicom.\n- Alert może przyjść także w nocy. Dobrze, żeby przynajmniej jeden telefon w domu nie był całkiem wyciszony na noc.\n')

# 3. Schema, Keystatic, Markdoc tag
rep('src/content.config.ts',
    '    draft: z.boolean().default(false),\n  }),\n});',
    '    draft: z.boolean().default(false),\n'
    '    // "Co gdyby…?" questions: the box under the intro ({% cogdyby /%}), the short answers at\n'
    '    // the end, FAQPage JSON-LD and the /co-gdyby/ hub. `sekcja` is the exact text of the H2\n'
    '    // the question links to; the build fails if it is missing (src/lib/pytania.js).\n'
    '    pytania: z\n'
    '      .array(z.object({ pytanie: z.string(), odpowiedz: z.string(), sekcja: z.string() }))\n'
    '      .max(5)\n'
    '      .default([]),\n'
    '  }),\n});')
rep('keystatic.config.ts',
    '        content: fields.markdoc({',
    "        pytania: fields.array(\n"
    "          fields.object({\n"
    "            pytanie: fields.text({ label: 'Pytanie', description: 'Np. „Co gdyby nie było prądu przez trzy dni?”' }),\n"
    "            odpowiedz: fields.text({ label: 'Krótka odpowiedź', description: '1–2 zdania. Widać je na końcu wpisu i na stronie /co-gdyby/.', multiline: true }),\n"
    "            sekcja: fields.text({ label: 'Sekcja', description: 'Dokładny tekst nagłówka ## we wpisie, do którego prowadzi pytanie.' }),\n"
    "          }),\n"
    "          {\n"
    "            label: 'Pytania „Co gdyby…?”',\n"
    "            description: 'Około 3 pytań. Wpis musi mieć tag {% cogdyby /%} pod wstępem.',\n"
    "            itemLabel: (props) => props.fields.pytanie.value || 'Pytanie',\n"
    "          }\n"
    "        ),\n"
    '        content: fields.markdoc({')
rep('markdoc.config.mjs',
    "        cta: { type: String },\n      },\n    },\n  },\n});",
    "        cta: { type: String },\n      },\n    },\n"
    "    // 4. The `cogdyby` tag places the \"Co gdyby…?\" box right under a guide's intro:\n"
    "    //    {% cogdyby /%}\n"
    "    //    Questions come from the post's `pytania` field (see src/lib/pytania.js).\n"
    "    cogdyby: {\n"
    "      render: component('./src/components/CoGdybyBox.astro'),\n"
    "    },\n"
    "  },\n});")

# 4. PostLayout: answers section + FAQPage JSON-LD
L = 'src/layouts/PostLayout.astro'
rep(L, "import KitCta from '../components/KitCta.astro';\n",
    "import KitCta from '../components/KitCta.astro';\n"
    "import CoGdybyAnswers from '../components/CoGdybyAnswers.astro';\n"
    "import { pytaniaFor } from '../lib/pytania.js';\n")
rep(L, "const related = (RELATED[slug] ?? []).map((id) => posts.find((p) => p.id === id)).filter(Boolean);\n",
    "const related = (RELATED[slug] ?? []).map((id) => posts.find((p) => p.id === id)).filter(Boolean);\n\n"
    "// \"Co gdyby…?\" questions. The box under the intro comes from the {% cogdyby /%} tag in the\n"
    "// body; the short answers at the end and the FAQPage JSON-LD are added here.\n"
    "const post = posts.find((p) => p.id === slug);\n"
    "const pytania = post ? pytaniaFor(post) : [];\n"
    "const faqLd = pytania.length\n"
    "  ? {\n"
    "      '@context': 'https://schema.org',\n"
    "      '@type': 'FAQPage',\n"
    "      mainEntity: pytania.map((p) => ({\n"
    "        '@type': 'Question',\n"
    "        name: p.pytanie,\n"
    "        acceptedAnswer: { '@type': 'Answer', text: p.odpowiedz },\n"
    "      })),\n"
    "    }\n"
    "  : null;\n")
rep(L, '  <script type="application/ld+json" set:html={JSON.stringify(crumbsLd)} slot="head" />\n',
    '  <script type="application/ld+json" set:html={JSON.stringify(crumbsLd)} slot="head" />\n'
    '  {faqLd && <script type="application/ld+json" set:html={JSON.stringify(faqLd)} slot="head" />}\n')
rep(L, '      <div class="prose">\n        <slot />\n      </div>\n',
    '      <div class="prose">\n        <slot />\n      </div>\n'
    '      {pytania.length > 0 && <CoGdybyAnswers pytania={pytania} />}\n')

# 5. Links to the hub + OG card
rep('src/components/Footer.astro', '      <a href="/blog/">Poradniki</a>\n',
    '      <a href="/blog/">Poradniki</a>\n      <a href="/co-gdyby/">Co gdyby…? Pytania</a>\n')
rep('src/pages/blog/index.astro', 'potrzeba w Twoim domu.</p>',
    'potrzeba w Twoim domu. Krótkie odpowiedzi na pytania w rodzaju „co gdyby nie było prądu?” zebraliśmy na stronie <a href="/co-gdyby/">Co gdyby…?</a></p>')
rep('src/lib/og/pages.js', '  faq: {\n',
    "  'co-gdyby': {\n"
    "    eyebrow: 'Pytania i odpowiedzi',\n"
    "    headline: 'Co gdyby zabrakło prądu, wody albo przyszła wichura?',\n"
    "    sub: 'Krótkie odpowiedzi na pytania o przygotowanie domu, każda z linkiem do poradnika.',\n"
    "    chip: GUIDE_CHIP,\n"
    "  },\n\n"
    '  faq: {\n')

for p, s in out.items():
    (root / p).write_text(s, encoding='utf-8')
print(f'OK: {len(out)} files changed')
