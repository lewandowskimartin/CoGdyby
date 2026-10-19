# Prepared at Home — photography drop-in guide

Five image slots are live on the homepage with warm placeholders. To go live with real
photos: **download a photo, resize/compress it, save it over the placeholder using the
exact same filename in `public/img/`.** No code changes needed.

## The look to hold to
Warm natural light, cream / terracotta tones, candid not posed, real UK homes, calm and
reassuring — never fearful or "prepper". Diverse, ordinary families. Avoid tactical/military
gear, US-style bunkers, harsh studio light, and obvious stock-smile shots.

## Licensing — free for commercial use
- **Unsplash** and **Pexels**: free to use commercially, no attribution required. Always
  glance at the licence line on the photo's own page before downloading.
- **Do not** use Getty / iStock / Shutterstock links from search results — those are paid.

## The five slots

| Save as (in `public/img/`) | Ratio / min width | What to look for |
|---|---|---|
| `hero-home.jpg` | ~7:6, ≥1600px | Parent + child (or couple) writing/filling something in at a kitchen table. A calm centre area works best — a product card sits on top with a soft dark overlay. |
| `lifestyle-band.jpg` | ~2.3:1 wide, ≥1800px | A cosy UK kitchen/living room in evening light, or a relaxed family at home. Keep the key subject to the **right** — the left ~45% is darkened for the caption. |
| `feature-plan.jpg` | square (1:1), ≥1000px | Hands filling in a form or notebook on a table. Close, warm, human. |
| `feature-grabbag.jpg` | square (1:1), ≥1000px | A backpack or holdall packed and ready by a front door. Domestic, not tactical. |
| `feature-print.jpg` | square (1:1), ≥1000px | A printed note/card held on a fridge with a magnet, or a sheet pinned in a kitchen. |

## Where to look (pre-filled searches)

**hero-home.jpg**
- Unsplash: https://unsplash.com/s/photos/family-kitchen-table · https://unsplash.com/s/photos/writing-at-kitchen-table
- Pexels: https://www.pexels.com/search/family%20kitchen%20table/

**lifestyle-band.jpg**
- Unsplash: https://unsplash.com/s/photos/cosy-home-evening · https://unsplash.com/s/photos/family-living-room
- Pexels: https://www.pexels.com/search/cozy%20home/

**feature-plan.jpg**
- Unsplash: https://unsplash.com/s/photos/filling-out-form · https://unsplash.com/s/photos/writing-notebook-table
- Pexels: https://www.pexels.com/search/writing%20on%20paper/

**feature-grabbag.jpg**
- Unsplash: https://unsplash.com/s/photos/backpack-by-door · https://unsplash.com/s/photos/packed-bag
- Pexels: https://www.pexels.com/search/backpack%20by%20door/

**feature-print.jpg**
- Unsplash: https://unsplash.com/s/photos/note-on-fridge · https://unsplash.com/s/photos/kitchen-fridge
- Pexels: https://www.pexels.com/search/fridge%20note/

## Before you save
1. **Crop** to roughly the ratio above (the slots use `object-fit: cover`, so exact ratio
   isn't critical, but cropping avoids awkward framing).
2. **Compress** at https://squoosh.app or https://tinypng.com — aim for **under ~200 KB**
   each. Cloudflare optimises further, but smaller source = faster page.
3. Save over the placeholder with the **same filename**, commit, push. Done.

## Optional upgrade later
For automatic WebP + responsive `srcset`, move these into `src/assets/` and switch the
`<img>` tags to Astro's `<Image>` component. Not needed for launch — plain lazy-loaded
`<img>` is fine and fast.
