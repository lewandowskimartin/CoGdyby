/* Open Graph card template — Co gdyby.
   Mirrors the site's visual system from src/styles/global.css:
   cream paper, espresso ink, terracotta accent, Fraunces display + DM Sans + IBM Plex Mono.
   Rendered to PNG at build time by render.js; no browser involved, so this is a plain
   VDOM tree (satori accepts React-shaped objects) rather than JSX. */

export const W = 1200;
export const H = 630;

// Tokens lifted verbatim from :root in global.css so the cards can never drift from the site.
const C = {
  paper: '#F3EBDD',
  paper2: '#FBF7F0',
  panel2: '#EEE6D8',
  ink: '#2B2721',
  inkSoft: '#5C554A',
  muted: '#716A5C',
  action: '#CF5F33',
  accentInk: '#AD4C28', // the darker terracotta used for .eyebrow and filled buttons (AA on paper)
  hair: '#E5DBCB',
};

const DISP = 'Fraunces';
const BODY = 'DM Sans';
const MONO = 'IBM Plex Mono';

const el = (style, children) => ({ type: 'div', props: { style, children } });
const text = (style, value) => ({ type: 'div', props: { style, children: value } });

/* Headline sizes step down as the title gets longer, so a 30-character title fills
   the card and an 80-character one still fits three lines without clipping. */
function headlineSize(s) {
  const n = s.length;
  if (n <= 32) return 74;
  if (n <= 46) return 64;
  if (n <= 60) return 56;
  if (n <= 78) return 48;
  return 42;
}

/* Chip variants double as the category signal — the one element readable at
   feed-thumbnail size. Filled terracotta = paid pack, filled ink = the course,
   outline = free things, null = legal/utility pages. */
function chip(spec) {
  if (!spec) return null;

  const filled = spec.variant === 'accent' || spec.variant === 'ink';
  const bg =
    spec.variant === 'accent' ? C.accentInk : spec.variant === 'ink' ? C.ink : 'transparent';

  return el(
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bg,
      border: filled ? 'none' : `2px solid ${C.hair}`,
      borderRadius: 14,
      padding: filled ? '16px 26px' : '14px 24px',
    },
    [
      text(
        {
          fontFamily: BODY,
          fontSize: 30,
          fontWeight: 700,
          lineHeight: 1.1,
          color: filled ? '#FFFFFF' : C.ink,
        },
        spec.label
      ),
      spec.caption
        ? text(
            {
              fontFamily: BODY,
              fontSize: 13,
              fontWeight: 400,
              marginTop: 5,
              color: filled ? 'rgba(255,255,255,0.86)' : C.muted,
            },
            spec.caption
          )
        : null,
    ].filter(Boolean)
  );
}

/**
 * @param {{eyebrow: string, headline: string, sub?: string,
 *          chip?: {label: string, caption?: string, variant: 'accent'|'ink'|'outline'}}} page
 */
export function card(page) {
  const size = headlineSize(page.headline);

  return el(
    {
      width: W,
      height: H,
      display: 'flex',
      backgroundColor: C.paper,
      padding: 34,
    },
    [
      el(
        {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: C.paper2,
          border: `1px solid ${C.hair}`,
          borderRadius: 28,
          padding: '54px 62px 50px',
        },
        [
          // Terracotta rule — the same accent mark the site uses above section headings.
          el({ display: 'flex', width: 52, height: 5, borderRadius: 3, backgroundColor: C.action }),

          text(
            {
              fontFamily: MONO,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: C.accentInk,
              marginTop: 26,
            },
            page.eyebrow
          ),

          text(
            {
              fontFamily: DISP,
              fontSize: size,
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: -1.6,
              color: C.ink,
              marginTop: 20,
              maxWidth: 960,
            },
            page.headline
          ),

          page.sub
            ? text(
                {
                  fontFamily: BODY,
                  fontSize: 21,
                  fontWeight: 400,
                  lineHeight: 1.45,
                  color: C.muted,
                  marginTop: 22,
                  maxWidth: 780,
                },
                page.sub
              )
            : null,

          el({ display: 'flex', flexGrow: 1 }),

          // Footer: wordmark + domain on the left, category chip on the right.
          el(
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderTop: `1px solid ${C.hair}`,
              paddingTop: 26,
            },
            [
              el({ display: 'flex', flexDirection: 'column' }, [
                text(
                  { fontFamily: DISP, fontSize: 25, fontWeight: 600, color: C.ink },
                  'Co gdyby'
                ),
                text(
                  {
                    fontFamily: MONO,
                    fontSize: 13,
                    letterSpacing: 1,
                    color: C.muted,
                    marginTop: 7,
                  },
                  'cogdyby.pl'
                ),
              ]),
              chip(page.chip),
            ].filter(Boolean)
          ),
        ].filter(Boolean)
      ),
    ]
  );
}
