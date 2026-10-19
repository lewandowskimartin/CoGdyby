# Power cut video pilot: shot list

Post 6, "A power cut, sorted in one drawer". Vertical 9:16, 8 seconds, one continuous take with a slow push-in. Adults only, no text, no candles, no children.

Storyboard images: `storyboard-overview.png` plus one sheet per scene (`scene-1` to `scene-6`).

## Scenes

### 1. Dusk, lights on (0.0 to 1.5 s)

- **Shot:** wide-medium, eye level. The slow push-in begins (100% to 103%).
- **Action:** a woman in her forties, in a cardigan, sits at a wooden table with two mugs. The ceiling pendant is on and the window shows blue dusk. Nothing is wrong yet.
- **Light:** warm pendant light inside, cool dusk outside.
- **Audio:** quiet room tone.
- **Watch for:** tidy, ordinary room. No clutter, no candles, no children. "She starts seated" is my addition; your original prompt does not say.

### 2. The light goes off (1.5 to 2.5 s)

- **Shot:** same framing, push-in continues (103% to 106%).
- **Action:** the ceiling light cuts off. The room drops into blue dusk and the window becomes the brightest thing in frame. She pauses and glances up with a small breath out. No alarm.
- **Light:** warm to cool in one clean cut, no flicker.
- **Audio:** room tone only. The light makes no sound; the one click is saved for the torch.
- **Watch for:** one clean cut, no flicker or sparks. Cosy dusk, not horror. Her face stays readable.

### 3. The drawer (2.5 to 4.0 s)

- **Shot:** medium, slightly wider so the drawer unit stays in frame (106% to 110%).
- **Action:** she stands, unhurried, steps to the unit beside the table, opens the top drawer in one smooth pull and lifts out a small torch.
- **Light:** a soft silhouette against the window, cool and dim.
- **Audio:** room tone.
- **Watch for:** hands and drawers are where video models slip. Keep the drawer within arm's reach of the table and in shot. Plain black torch, no brand, nothing tactical.

### 4. Click (4.0 to 5.0 s)

- **Shot:** closer, chest and hands (110% to 114%).
- **Action:** she clicks the torch on with her thumb. Soft warm-white light blooms in her hands and catches her lower face. It is the first warm light since the room went dark.
- **Light:** warm-white at her hands, the rest of the room stays dusk blue.
- **Audio:** the one soft click, at about 4.3 s.
- **Watch for:** soft and warm, not a hard cold LED glare, and not pointing into the lens. Regenerate if it blows out.

### 5. A pool of light (5.0 to 6.5 s)

- **Shot:** medium, low table height (114% to 118%).
- **Action:** she stands the torch on its flat end in the middle of the table, lens facing up, so it works like a lamp. A soft warm pool of light spreads over the table and the mugs.
- **Light:** warm pool on the table, a faint glow up the wall, dusk blue beyond.
- **Audio:** room tone.
- **Watch for:** the highest-risk beat. Veo may let the torch roll or float. Say "stands on its flat end, lens facing up" and reject any take where it tips.

### 6. Back at the table (6.5 to 8.0 s)

- **Shot:** medium close, final slow hold for about one second (118% to 120%).
- **Action:** she sits back, picks up her mug and holds it in both hands, lit warmly by the torch. A little steam. The last second is almost still so the title can sit over it.
- **Light:** warm on her face and hands, soft and low.
- **Audio:** room tone.
- **Watch for:** end on stillness. Keep the top 14% and bottom 20% free of important action, because Reels and Pinterest UI cover them.

## Sense-check: this is a lot for eight seconds

Six beats in eight seconds is tight. Veo follows the order of actions reliably and exact timings loosely, so expect it to rush the middle (scenes 3 to 5). Two ways to handle it:

1. **Try the single take first** with the tightened prompt below. Run a few Fast takes, then render the best in Quality.
2. **If it rushes, split it.** Generate clip A (scenes 1 to 3, ending as she lifts out the torch). Take its last frame and use it as the start image for clip B (scenes 4 to 6) with image-to-video. Cut on the click at about 4.3 s. Reference images need 8-second clips, and video extension adds 7 seconds at 720p only, so image-to-video from the last frame is the cleaner join.

## Tightened prompt (v2)

> Vertical 9:16, 8 seconds, one continuous take, photorealistic, slow gentle push-in, shallow depth of field, soft natural colour grade. A calm UK kitchen at dusk, cream walls, window showing blue evening light, wooden table with two mugs of tea, a unit with drawers beside the table. A woman in her forties in a cardigan sits at the table. The ceiling light goes off and the room drops into soft dusk. She glances up, unbothered, then stands, opens the top drawer of the unit in one smooth pull and takes out a small plain black torch. She clicks it on with her thumb. She stands it on its flat end in the middle of the table, lens facing up, like a lamp, making a soft warm pool of light over the table and mugs. She sits back and picks up her mug in both hands. Calm, unhurried. No text, no logos, no children, no candles. Audio: quiet room tone and one soft click only, no music, no speech.

What changed from your version: she starts seated, the drawer unit is named and placed beside the table, the torch is "plain black" and stands "on its flat end, lens facing up", and she picks up the mug in both hands.

## After generating

- **Review every frame.** The ASA holds you responsible for AI output. Reject warped hands, a wrong torch, or a drawer that opens oddly.
- **Title overlay (edit):** "A power cut, sorted in one drawer" in Fraunces, from 5.0 to 8.0 s, in the middle band of the frame, clear of the top 14% and bottom 20%.
- **End card (edit):** freeze the last frame for 3 seconds with the six checklist items from Post 6, the note that 105 is for England, Scotland and Wales (Northern Ireland 03457 643643), and the guide URL with UTM tags.
- **Caption:** the Post 6 copy plus one calm line such as "Clip made with AI".
- **Audio:** keep the room tone or mute and add your own. Most people watch with sound off, so nothing in the clip depends on it.
- **Visible watermark:** check whether your Gemini or Flow tier adds one and where it sits, then test with one clip before planning the layout.
