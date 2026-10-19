# Blog hero images — art direction and prompts

One main picture for each of the 18 live guides, written as paste-ready prompts for Grok or Gemini. Oct 2026.

## The look (from the Photography Guide)

Warm natural light, cream and terracotta tones, real UK homes, candid rather than posed, calm rather than fearful. No tactical or prepper gear, no harsh studio light, no stock smiles.

Site palette the images should sit with: cream `#F3EBDD`, panel `#F6EFE4`, espresso `#2B2721`, warm grey `#5C554A`, terracotta `#CF5F33` (accent only).

## Rules for the whole set

- **One series, one look.** Same light, lens and palette on every image so the blog reads as a set. Vary the shot type instead: hands close-ups, still lifes, people at home, a couple of exteriors.
- **No text in the image.** The headline lives on the page and on the auto-generated OG cards. AI tools also garble lettering. Anything with writing (cards, checklists, forms) is described as blurred and unreadable.
- **Calm, even for scary topics.** Gas, fire, flood and storm images show preparation, never the emergency. No flames, no flood water, nobody distressed.
- **Readable at thumbnail size.** One clear subject per image, kept in the central third so it survives a 16:9 desktop crop and a square mobile crop.
- **Distinctly British.** Three-pin sockets, white panel radiators, sash windows, brick terraces, wellies. Nothing American.
- **No brands.** Unlabelled tins and bottles, no logos.
- **Honest.** These are AI-generated people. Don't caption or use them as real customers or testimonials.

## Format and delivery

- Generate at **16:9 landscape** (choose it in the tool's aspect-ratio setting; the prompt also states it).
- Export **1600×900 WebP, under ~200KB** (squoosh.app), the same budget as the Photography Guide.
- Save as `public/blog/<slug>-hero.webp` (Keystatic's image folder).
- **Pinterest variant (optional):** swap "landscape 16:9" for "portrait 2:3" in the prompt and keep the subject centred. Export 1000×1500.
- **Keep the OG cards as they are.** They're generated at build time with the headline and "Guide" chip, which works better for link previews than a photo. The hero is for the article page and Pinterest.

## Before you use an image, check

- Hands and fingers look right
- No stray letters, numbers or logos (common on fridge cards, meters, packaging)
- Sockets, radiators and windows look British
- Palette is warm and muted, not saturated
- Nothing unsafe is shown (no candles near children, no flames, no one fiddling with gas pipework)

Expect to regenerate two to four times per image and pick the best.

## Tool notes

- **Gemini:** handles long descriptive prompts well. If text creeps in, add "absolutely no text or writing anywhere" to the end and regenerate.
- **Grok:** can push colours warmer or more saturated than you want. The palette line usually holds it; if not, add "muted, desaturated, natural colours".
- Check each tool's current terms for commercial use before publishing.

---

## The 18 prompts

Each prompt is self-contained. Copy the whole code block.

### Start here

#### 1. What the UK government's Prepare campaign means for your household
`/blog/what-the-uk-prepare-campaign-means-for-your-household/` → `what-the-uk-prepare-campaign-means-for-your-household-hero.webp`
**Concept:** starting a plan at the kitchen table.
**Alt text:** A woman writing a household plan in a notebook at her kitchen table with a mug of tea.

```
Over-the-shoulder view of a woman in her forties sitting at a wooden kitchen table, writing a short list in an open notebook with a pencil, a mug of tea and a folded printed leaflet beside her, morning light from a sash window, a kettle and a fruit bowl softly blurred behind. The handwriting is too small and soft-focus to read. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft natural daylight from a window, gentle shadows, shallow depth of field, 35mm lens at eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood; candid, not posed; nobody looks at the camera. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 2. The 5 UK emergency numbers every household should know
`/blog/uk-emergency-numbers-every-household-should-know/` → `uk-emergency-numbers-every-household-should-know-hero.webp`
**Concept:** numbers on the fridge, where everyone can see them.
**Alt text:** A handwritten card of emergency numbers being pinned to a fridge door beside a child's drawing.

```
Close-up of a cream fridge door with a handwritten card held by a simple round magnet, next to a child's crayon drawing of a house; the card's handwriting is blurred and unreadable. A hand is just pinning the card in place. Bright kitchen in soft focus behind. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft natural daylight from a window, gentle shadows, shallow depth of field, 35mm lens at eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood; candid, not posed; nobody looks at the camera. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 3. Cheap ways to make your home emergency-ready in the UK
`/blog/cheap-ways-to-prepare-for-emergencies-uk/` → `cheap-ways-to-prepare-for-emergencies-uk-hero.webp`
**Concept:** everyday low-cost basics, gathered in a basket.
**Alt text:** A kitchen basket with a torch, batteries, tins and bottled water, everyday low-cost emergency basics.

```
A woven basket on a wooden kitchen worktop holding a few everyday low-cost items: a small LED torch, a pack of AA batteries, three plain unlabelled tins, a bottle of still water and a folded linen tea towel. A hand is placing a tin into the basket. Unbranded packaging only. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft natural daylight from a window, gentle shadows, shallow depth of field, 35mm lens at eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood; candid, not posed; nobody looks at the camera. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 4. 8 practical home skills that save money and build resilience
`/blog/home-skills-that-save-money/` → `home-skills-that-save-money-hero.webp`
**Concept:** a small, useful skill in action.
**Alt text:** Hands bleeding a radiator with a radiator key, a small home skill that saves money.

```
Close-up of a pair of hands using a small brass radiator key to bleed a white panel radiator under a window, a folded cloth held beneath the valve to catch drips. Autumn light, a houseplant on the windowsill, the corner of a cosy British living room. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft natural daylight from a window, gentle shadows, shallow depth of field, 35mm lens at eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood; candid, not posed; nobody looks at the camera. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

### Power cuts and winter

#### 5. UK blackout checklist: what every home should have ready
`/blog/uk-blackout-checklist/` → `uk-blackout-checklist-hero.webp`
**Concept:** the "blackout drawer", organised.
**Alt text:** An open kitchen drawer neatly holding a torch, radio, power bank, batteries and a checklist.

```
Top-down view of an open wooden kitchen drawer, neatly organised: a wind-up torch, spare batteries, a small portable radio, a power bank with its cable coiled, a manual tin opener and a folded paper checklist with blurred, unreadable handwriting. Soft daylight from the side. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft natural daylight from a window, gentle shadows, shallow depth of field, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 6. The digital landline switchover: what it means for your household
`/blog/digital-landline-switchover-uk/` → `digital-landline-switchover-uk-hero.webp`
**Concept:** an older person, independent at home, on the landline with an alarm pendant.
**Alt text:** An older woman on her landline phone at home, wearing a personal alarm pendant.

```
A woman in her seventies sitting in an armchair by a window, holding a cordless landline phone to her ear mid-conversation with a relaxed expression, a small personal alarm pendant on a cord around her neck. A broadband router and a phone base on a side table, softly out of focus. A knitted throw over the armchair, framed family photos blurred in the background. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft natural daylight from a window, gentle shadows, shallow depth of field, 35mm lens at eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood; candid, not posed; she does not look at the camera. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No danger, no disaster. Editorial magazine quality.
```

#### 7. How to prepare for a power cut in the UK
`/blog/how-to-prepare-for-a-power-cut-uk/` → `how-to-prepare-for-a-power-cut-uk-hero.webp`
**Concept:** a power cut that's cosy because they were ready.
**Alt text:** A parent and child under a blanket reading by a battery lantern during a power cut.

```
Evening in a cosy British living room during a power cut: a mother and a young child sit together under a wool blanket on a sofa, reading a picture book by the light of a battery-powered LED lantern on the coffee table. Warm, gentle and safe. No candles and no open flames anywhere. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft warm lantern light, gentle shadows, shallow depth of field, 35mm lens at eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring mood; candid, not posed; nobody looks at the camera. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 8. What to do during a power cut — a calm UK guide
`/blog/what-to-do-during-a-power-cut-uk/` → `what-to-do-during-a-power-cut-uk-hero.webp`
**Concept:** the first calm minutes: radio on, torch out, fridge shut.
**Alt text:** A hand winding up a radio by torchlight on a kitchen table during a power cut.

```
At dusk in a dim British kitchen, a hand turns the handle of a small wind-up radio on a wooden table, a lit LED torch lying beside it casting a soft pool of light; the fridge in the background is closed. Quiet, calm and practical. No candles and no open flames. Photorealistic lifestyle photograph, landscape 16:9. Low, soft torchlight and fading daylight, gentle shadows, shallow depth of field, 35mm lens, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 9. Will the UK have blackouts this winter? What to do either way
`/blog/will-the-uk-have-blackouts-this-winter/` → `will-the-uk-have-blackouts-this-winter-hero.webp`
**Concept:** an ordinary winter street with the lights on. Reassurance, not worry.
**Alt text:** A row of British terraced houses at winter dusk with warm lights in the windows.

```
A row of red-brick British terraced houses at winter dusk, blue hour, light frost on the pavement and on parked car roofs, warm yellow light glowing from most windows, a street lamp just coming on. Peaceful and ordinary. Exterior wide shot. Photorealistic photograph, landscape 16:9. Soft natural dusk light, subtle film grain, 35mm lens at street level. Muted palette of deep blue dusk with warm cream and soft terracotta window glows and espresso-brown brick; no saturated or neon colours. Calm, reassuring mood. Keep the row of houses centred with space around it so the image can be cropped to a square. No text, letters, numbers, logos, house numbers or number plates readable anywhere. No danger, no disaster. Editorial magazine quality.
```

#### 10. The Priority Services Register explained
`/blog/priority-services-register-uk-explained/` → `priority-services-register-uk-explained-hero.webp`
**Concept:** helping an older parent sign up for support.
**Alt text:** A daughter helping her elderly father with paperwork at his kitchen table.

```
A woman in her forties sitting beside her elderly father at his kitchen table, helping him fill in a paper form while he holds a pen; a teapot and two cups between them; the paperwork is out of focus and unreadable. Affectionate and unhurried. Photorealistic lifestyle photograph, landscape 16:9. Real, lived-in British home, soft natural daylight from a window, gentle shadows, shallow depth of field, 35mm lens at eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood; candid, not posed; nobody looks at the camera. Keep the main subjects in the central third with space around them so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No danger, no disaster. Editorial magazine quality.
```

### Storms, floods, gas and fire

#### 11. How to prepare for a storm in the UK
`/blog/how-to-prepare-for-a-storm-uk/` → `how-to-prepare-for-a-storm-uk-hero.webp`
**Concept:** securing the garden before the wind arrives.
**Alt text:** A person moving garden furniture into a shed on a windy day before a storm.

```
On a blustery grey autumn day, a person in a raincoat wheels a wooden garden chair into a shed in a small British back garden, trees leaning slightly in the wind, a brick wall behind and a wheelie bin already tucked against it. Purposeful and calm, not dramatic. Photorealistic lifestyle photograph, landscape 16:9. Soft overcast daylight, gentle shadows, 35mm lens at eye level, subtle film grain. Muted palette of grey sky, cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, everyday mood; candid; the person faces away from the camera. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No damage, no danger, no disaster. Editorial magazine quality.
```

#### 12. What to do before, during and after a flood in the UK
`/blog/what-to-do-in-a-flood-uk/` → `what-to-do-in-a-flood-uk-hero.webp`
**Concept:** ready by the back door on a wet day. No flood water shown.
**Alt text:** Wellies, a torch and a waterproof document pouch ready by a back door on a rainy day.

```
By a back door: a pair of green wellington boots on a coir mat, a torch and a clear waterproof document pouch on a small wooden bench, rain streaking the glass panel of the door, a grey garden beyond. No flood water, only calm readiness. Photorealistic still-life photograph, landscape 16:9. Real British home, soft grey daylight through the door, gentle shadows, shallow depth of field, 35mm lens, subtle film grain. Muted palette of cream, oatmeal, soft terracotta and espresso-brown accents with the green of the boots; no saturated or neon colours. Calm, reassuring mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere, including on the documents. No danger, no disaster. Editorial magazine quality.
```

#### 13. What to do if you smell gas in the UK
`/blog/what-to-do-if-you-smell-gas-uk/` → `what-to-do-if-you-smell-gas-uk-hero.webp`
**Concept:** knowing where the emergency control valve is.
**Alt text:** A hand on the emergency control valve beside a gas meter in a cupboard.

```
Close-up inside a tidy British utility cupboard: a hand resting on the lever of the emergency control valve on the pipe beside a domestic gas meter, soft light from the open cupboard door. The meter display is blurred and unreadable. Clean, ordinary and calm. No flames, no hob, no smoke. Photorealistic still-life photograph, landscape 16:9. Soft natural light, gentle shadows, shallow depth of field, 35mm lens, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No danger, no disaster. Editorial magazine quality.
```

#### 14. Home fire safety checklist for UK households
`/blog/home-fire-safety-uk-checklist/` → `home-fire-safety-uk-checklist-hero.webp`
**Concept:** the monthly smoke alarm test.
**Alt text:** A hand pressing the test button on a smoke alarm on a hallway ceiling.

```
Looking up at a hallway ceiling in a British home: a hand presses the test button on a white round smoke alarm, soft daylight from a landing window, a fabric pendant lampshade slightly out of focus. Photorealistic lifestyle photograph, landscape 16:9. Soft natural daylight, gentle shadows, shallow depth of field, 35mm lens, subtle film grain. Muted warm palette of cream ceiling, oatmeal walls, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, everyday mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No smoke, no flames, no danger, no disaster. Editorial magazine quality.
```

### Kit, water and food

#### 15. What to put in a UK emergency kit — a home checklist
`/blog/what-to-put-in-a-uk-emergency-kit/` → `what-to-put-in-a-uk-emergency-kit-hero.webp`
**Concept:** the home kit, stored under the stairs (distinct from the grab bag).
**Alt text:** An under-stairs cupboard neatly stocked with water, tins, a torch, first aid kit and blankets.

```
A British under-stairs cupboard with its door open, showing a neatly packed clear storage box and a shelf: bottles of still water, plain unlabelled tins, a first aid kit in a plain green case, a torch and a folded wool blanket. Tidy and domestic, not military. Warm light spilling in from the hallway. Photorealistic still-life photograph, landscape 16:9. Soft natural light, gentle shadows, shallow depth of field, 35mm lens, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 16. How to build a UK emergency grab bag — a practical checklist
`/blog/uk-emergency-grab-bag-checklist/` → `uk-emergency-grab-bag-checklist-hero.webp`
**Concept:** a packed everyday bag by the front door.
**Alt text:** A packed rucksack by the front door with coats and keys, ready to grab.

```
A packed everyday rucksack in a muted oatmeal colour resting on a doormat by a British front door with a frosted glass panel, coats hanging on hooks above, a set of keys in a small ceramic bowl on a side table. Domestic and ready to grab, not tactical. Photorealistic still-life photograph, landscape 16:9. Soft natural daylight through the frosted glass, gentle shadows, shallow depth of field, 35mm lens at low eye level, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No tactical, military or survival gear, no danger, no disaster. Editorial magazine quality.
```

#### 17. How much water should you store for an emergency? A UK guide
`/blog/how-much-water-to-store-emergency-uk/` → `how-much-water-to-store-emergency-uk-hero.webp`
**Concept:** a simple, tidy water store.
**Alt text:** A hand adding a large bottle of still water to a row stored in a pantry.

```
A row of large clear 5-litre bottles of still water on a pantry floor beside a wooden shelf, a hand placing one more bottle at the end of the line, soft daylight catching the water. The bottles have no labels or branding. Photorealistic still-life photograph, landscape 16:9. Real British home, soft natural daylight, gentle shadows, shallow depth of field, 35mm lens, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No danger, no disaster. Editorial magazine quality.
```

#### 18. Building an emergency food supply on a budget — a UK guide
`/blog/emergency-food-supply-uk-budget/` → `emergency-food-supply-uk-budget-hero.webp`
**Concept:** rotating the cupboard, newest at the back.
**Alt text:** A hand rotating tins in a tidy kitchen cupboard, newest at the back.

```
An open kitchen cupboard with tidy rows of plain unlabelled tins, glass jars, pasta and rice; a hand places a new tin at the back of a row while the older ones sit at the front. Unbranded packaging, soft morning light. Photorealistic still-life photograph, landscape 16:9. Real British home, soft natural daylight from a window, gentle shadows, shallow depth of field, 35mm lens, subtle film grain. Muted warm palette of cream, oatmeal, soft terracotta and espresso-brown accents; no saturated or neon colours. Calm, reassuring, everyday mood. Keep the main subject in the central third with space around it so the image can be cropped to a square. No text, letters, numbers, logos or brand names anywhere. No danger, no disaster. Editorial magazine quality.
```

---

## Not done yet

Post pages don't render a hero image. `PostLayout.astro` has no image slot and the blog schema has no image field. Wiring it means: a `heroImage` + `heroAlt` field in `keystatic.config.ts` and `src/content.config.ts`, then rendering it in `PostLayout.astro` (responsive, lazy below the fold, eager above). OG cards stay as they are.
