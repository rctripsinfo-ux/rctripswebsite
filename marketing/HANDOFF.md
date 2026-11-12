# RC Trips – Instagram / Meta Ads Video Handoff

**Repo:** `rctripsinfo-ux/rctripswebsite` · **Branch:** `ccr-2e059cb5-z5nme5` · **Folder:** `marketing/`

This file covers everything from the earlier Claude account: the business, the rules, the style, the files, how to re-render, and what is still left to do.

---

## 1. Business

- **Company:** Red Carpet Tours Pvt. Ltd. (brand **RC Trips**)
- **Website:** rctrips.com
- **WhatsApp:** use **+91 99109 85862** on all new ads (owner removed 72900 12474, Nov 2026; older ads still show the old number)
- **Goal:** grow Instagram and get leads from Meta (Facebook/Instagram) ads using short vertical ad videos (9:16, 1080x1920) with a WhatsApp CTA.

## 2. Packages (prices as given by the owner)

| Package | Price | Notes |
|---|---|---|
| **Kanatal** (Strangers Trip) | ₹6,800 | Weekend. Friday 10 PM from Delhi, back before Monday office. Surkanda Devi, zipline / sky roller / sky cycling / Horizon Bridge (included), Dhanaulti forest, bonfire, Tehri Lake banana ride. PDF: `briefs/Kanatal_Strangers_Trip.pdf` |
| **Rishikesh–Haridwar** (Strangers Trip) | ₹5,500 triple / ₹5,800 twin, +5% GST | Ages 16–36, departs 11 PM. Ganga Aarti etc. PDF: `briefs/Rishikesh_Haridwar_Strangers_Trip.pdf` |
| **Manali–Solang–Kasol** (Strangers Trip) | ₹10,000 triple / ₹10,500 twin, +GST | Ages 16–36. Day 1 night from Delhi to Day 5 morning, 2 nights in Manali. Activities are optional and paid. NOT a "weekend trip" (4 nights). PDF: `briefs/Manali_Kasol_Strangers_Trip.pdf` |
| **Agra–Mathura–Vrindavan** | ₹4,500 | Weekend. No PDF. Taj Mahal → Mathura (Krishna Janmabhoomi) → Vrindavan (evening aarti, Banke Bihari). Travel, hotel, food and trip captain included. No sharing rates or GST info given. |

## 3. Owner's rules (must follow)

### Scripts
- Give the **spoken script first**, wait for approval, then make the video. **One at a time.**
- **Male speaker** ("batata hoon", "kar dunga"). Written in **Roman Hinglish** (the owner asked for Devanagari only once, for Kanatal).
- **Casual and conversational**, like explaining the plan to a friend. **No drama**: the owner rejected lines like "mann shaant ho jaata hai" and "life mein ek baar".
- Simple words. No hard Hindi.
- **Every script needs a different hook.** Never repeat one; see `script_texts/STYLE_GUIDE.md` for hooks already used.
- For ads: put the **offer/price early** and end with a **WhatsApp CTA**: "neeche Book Now pe click karo, seedha WhatsApp pe baat karte hain".
- Length: about 30–60 sec of speech.
- For Manali the owner wanted **no price** and a more attractive tone, but not a very short script.
- The voice is made by the owner in **ElevenLabs** (MP3 + SRT). The owner sends both, and we build the video on them.

### Videos
- **Captions, "style 3":** word-by-word captions, ArchivoBlack font, white text with a black stroke, a **yellow rounded box behind the active word**, at y≈1180.
- **Top hook, "style C"** (PNG made with `scripts/hookbanner.py`, 1080x560, placed at the top):
  - line 1: "Delhi to X" plus an emoji (Poppins ExtraBoldItalic 88, white, shadow)
  - line 2: yellow "WEEKEND TRIP"
  - line 3: a black translucent pill with "• Food • Hotel • …"
  - line 4: small "Sirf ₹X • Book on WhatsApp"
  - Manali uses "ENJOY THIS WEEKEND" with no price.
- **Look:** xfade transitions between shots, whoosh sound and white flash on some cuts, a slight zoom-in on every shot, boosted saturation.
- **End card:** place name, price, "Book Now on WhatsApp", +91 72900 12474, rctrips.com, plus the **Red Carpet logo** (`logo/rc.jpg`), which fades in at the card time.
- **No GST/TCS text** on the videos.
- **Background music:** the final ask was **NO background music**. The owner adds copyright-free music manually. If music is added, keep it clearly **lower than the voice**.
- **Footage:** use RC's own group clips (`kanA_*` / `kanB_*`) for group, captain and masti lines, and Pexels stock for places. **Check that a clip really shows the right place.** Earlier mistakes, now fixed: a Japanese street, a Nepal prayer-flag alley and a tea garden had been used for Manali/Kasol.

## 4. Current status

### Final videos (in `deliverables/`, re-encoded smaller for GitHub)
| File | What |
|---|---|
| `Kanatal_Ad_NO_MUSIC.mp4` | Kanatal ad, no music (final) |
| `Manali_Ad_NO_MUSIC.mp4` | Manali–Solang–Kasol ad, no music (final) |
| `Rishikesh_Ad_02_NO_MUSIC.mp4` | Rishikesh–Haridwar ad, no music (final) |
| `Vrindavan_Ad_NO_MUSIC.mp4` | Agra–Mathura–Vrindavan ad, no music (final, 35 sec) |
| `Kanatal_AD_Hyperfun.mp4` | Kanatal with copyright-free music (Incompetech "Hyperfun") |
| `Manali_AD_DigitalLemonade.mp4` | Manali with copyright-free music (Incompetech "Digital Lemonade") |

The **Rishikesh + "Inspired"** music version never finished rendering (the file was broken), so it is not included.

Not included on purpose: versions with **copyrighted songs** (Love You Zindagi, Ilahi, As It Was, Jhula Jhulaye). Those songs **cannot be used in Meta ads**.

### Pending / ideas
- **Vrindavan footage:** there is no real footage of Banke Bihari temple or Krishna Janmabhoomi; Prem Mandir, a temple-gate crowd and Vrindavan street clips stand in. The aarti clip is from a ghat, not Vrindavan. Swap these if the owner sends real clips.
- **Manali footage:** real clips of Hidimba Temple, Mall Road and Kasol market would be better (optional).
- **Music:** if music is needed for ads, use **Meta Sound Collection** (safest for ads) or Incompetech (CC BY, needs credit "Kevin MacLeod (incompetech.com), CC BY 4.0"). Pixabay was blocked in the old environment.
- New packages and scripts follow the same rules.

## 5. Folder map (`marketing/`)

```
HANDOFF.md            ← this file
render_all.sh         ← re-renders the 4 no-music ads + logo
scripts/
  render_ad.py        ← main renderer (shots + xfade + style-3 captions + banner + end card + audio)
  hookbanner.py       ← makes the style-C top hook PNG (uses hookstyles.py)
  hookstyles.py       ← hook style samples (A/B/C…) + shared drawing functions
  fetch_pexels.py     ← re-downloads the Pexels stock clips listed in footage/pexels_clips.txt
  k2srt.py            ← rebuilt the broken Kanatal2 SRT from whisper word timestamps
  (others: older renderers, beat-sync reel, cover maker, transcription helpers)
cfg/                  ← one config per video
  k_nm.py, m_nm.py, rish2_nm.py, vrind.py   ← the 4 FINAL no-music configs
  k_cf.py, m_cf.py, r_cf.py                ← copyright-free music versions
  kanatal2.py, manali.py, rish2.py         ← copyrighted-song versions (songs NOT in repo)
  rish.py, agra.py                         ← older first versions
vo/                   ← owner's ElevenLabs voiceovers + SRTs (kanatal2, manali, rishikesh2, vrindavan)
work/                 ← banner PNGs (banner_k2/man/r2/v.png), kanatal2_fixed.srt (use this, NOT vo/kanatal2.srt)
script_texts/         ← STYLE_GUIDE.md (script rules + used hooks), final VO texts
briefs/               ← package PDFs (Kanatal, Rishikesh, Manali)
fonts/                ← ArchivoBlack, Poppins, Anton, Bebas, NotoColorEmoji, NotoSansDevanagari …
logo/rc.jpg           ← Red Carpet logo
music/                ← Incompetech CC-BY tracks (Hyperfun, Digital_Lemonade, Inspired)
footage/proxy/        ← RC's OWN trip clips used in the ads (kanA_*, kanB_*, tehri_013), re-encoded
footage/pexels/bfast.mp4
footage/pexels_clips.txt ← list of Pexels clip IDs to re-download
index/meta.json       ← duration/size of RC's own clips (the renderer needs it)
deliverables/         ← finished videos
```

## 6. How to re-render

Needs: `ffmpeg`, Python 3 with `Pillow`. Optionally `faster-whisper` for fixing SRTs.

```bash
cd marketing
PEXELS_API_KEY=xxxx python3 scripts/fetch_pexels.py "$PWD"   # one time, ~1.2 GB of stock clips
bash render_all.sh                                          # outputs in render/
```

### Config keys (`cfg/*.py`, executed with `S` = marketing folder)
| Key | Meaning |
|---|---|
| `name` | Output name; the video goes to `render/<name>.mp4` |
| `words` | The VO text. Caption groups are split by `|`; `_` joins two words that the SRT has as one entry |
| `merges` | SRT entry indexes to merge with the next one (broken tokens like "6" + ",800") |
| `shots` | `[(word_index, clip, start_offset_fraction)]`. A clip is `kanB_018` (own, in `footage/proxy`) or `man/p27852530` (Pexels, `footage/man/…`) |
| `flash` | Shot numbers that get a white flash and whoosh |
| `xfade` | True for transitions |
| `card` | End-card text lines `(text, size, colour, y, [box colour])`. Shown from the start of the last shot |
| `banner_png`, `banner_y` | Top hook image |
| `music`, `music_ss`, `music_lufs`, `duck` | Background music (None means no music) |

The **word count in `words` must match the number of SRT entries** after merges, or there will be an assert error.

### Make a new top hook
```bash
python3 -I scripts/hookbanner.py "$PWD" work/banner_new.png "Delhi to Kanatal" "🏕" "WEEKEND TRIP" "• Food • Hotel • Travel • Bonfire" "Sirf ₹6,800 • Book on WhatsApp"
```

### Add the logo (render_all.sh does this)
The logo is overlaid at 415:270, size 250x250, and fades in at the END time:

| Ad | END time |
|---|---|
| Kanatal | 41.32 |
| Manali | 47.3 |
| Rishikesh | 61.56 |
| Vrindavan | 30.85 |

## 7. Copyright notes
- Songs the owner sent (**Love You Zindagi, Ilahi cover, As It Was instrumental, Jhula Jhulaye**) are copyrighted. Do not use them in paid ads, because Meta will mute the ad or reject it.
- Pexels clips are free for commercial use.
- Incompetech tracks are CC BY and need a credit line.

## 8. New style (Nov 2026): music-only beat ads (like "Infinite Traveler" ads, but with price)
- No voiceover. Cuts on every 2 beats of the song (~1 sec), our own trip clips, ~19 sec + 3 sec end card.
- Persistent overlay `scripts/overlay_v2.py` → logo, "15+ Strangers • 1 Captain • Every Weekend", big neon title (Bricolage 800), tilted price sticker, 2N/3D + 6 icons bar (Material Icons), green WhatsApp pill.
- Everything stays inside the Meta Reels **safe zone**: x 120–960, y 250–1540, and x ≤ 880 for y > 720 (`python3 overlay_v2.py S out.png 1` draws the zone for checking).
- End card `scripts/card_v2.py`. Renderer `scripts/beatreel.py S cfg/kan_beat.py` → `render/<name>.mp4` and `<name>_NO_MUSIC.mp4`.
- Done: Kanatal (Love You Zindagi @38.15s), Rishikesh (Ilahi @42.35s), Manali (As It Was @4.57s, cut every beat). Songs are copyrighted, not in repo. Logo is NOT rounded (owner wants it as-is). Per-package text in cfg/ov/*_ov.py and *_card.py. Next: Vrindavan.
- **Manali age group is 18–36** (owner correction, Nov 2026; the PDF says 16–36). Confirm with the owner whether Rishikesh is also 18–36.
- **Departure dates:** Kanatal 27–29 Nov 2026, Rishikesh 27–29 Nov 2026, Manali 27 Nov–1 Dec 2026. Owner wants the date IN the video, start to end (red "Next Trip" pill above the price + on the end card). Change `date = ...` in cfg/ov/*_ov.py and *_card.py and re-render when dates change.

## 9. Organic daily reels (from 13 Nov 2026)
- `scripts/organic_reel.py S cfg/organic/<day>.py`: real clips, cuts on the song's beats (`music_key` from `work/trend_song_beats.json`, which needs the song MP3s in `music_trend/`, not in the repo because they are copyrighted), small logo top-right, text styles:
  - **"sunset"**: Cormorant SemiBold Italic, white + orange (255,178,91) keyword, soft dark glow. Used for trip moments.
  - **"bold"**: Montserrat ExtraBold uppercase, white + a yellow box on the highlighted line. Used for memes and offers.
- The owner gave these trending songs: Alfaaz, Signal, Shaam Shaandaar, Badtameez Dil, Laapata, Aahista Aahista. They are fine for organic posts only, never for paid ads.
- Plan: `CONTENT_PLAN_30_DAYS.md` (3 reels/day: 9 AM trip moment, 2 PM meme/value, 8 PM offer).

## 10. Creative reel formats (12 Nov 2026, the owner approved the direction)
- Brand kit:
  - **Colours:** lemon yellow #F7E733 (main), red #E2231A (logo), white, black.
  - **Fonts:** Gloock (the "Japan"-style display serif the owner likes), Montserrat ExtraBold (boxes), Poppins Medium Italic (small lines), Caveat (handwritten), Space Mono (camcorder).
- Formats in `scripts/creative_reels.py` (animated, beat-cut, song from `music_trend/`):
  - v1 **WhatsApp group chat → "2 GHANTE BAAD:" bus masti**
  - v2 **Camcorder POV** (REC, timer, date stamp)
  - v3 **Boarding pass offer** (ticket slides in, BOOKED stamp, price strip, Comment KANATAL end card)
- More still frames in `scripts/creative.py`: text-behind-subject (rembg u2net_human_seg), sticker cut-out, polaroid dump.

## 11. Owner rules for every reel (12 Nov 2026)
- **No Red Carpet logo** on reels (`SHOW_LOGO = False` in `creative_reels.py`).
- **Always energetic songs.** Never a slow or boring song.
- **Mix many different clip types in every video,** not only bus clips. Use `work/clip_catalog.json`: 173 own clips tagged by category and place.
  - **Categories:** adventure 46, scenic 43, water_fun 29, group_fun 22, journey_pov 12, temple 10, bus_masti 9, bonfire_night 2.
  - **Places:** Kanatal + Tehri 120, Udaipur 38, Manali 11, unknown 4.
- **Fonts the owner wants:** "Algino" (file needed from the owner, not on npm), Poppins + Italic, Helvetica Compressed (using Anton), Helvetica Bold Oblique (using Arimo Bold Italic), Cinzel and Cinzel Decorative. The owner will confirm the final choice.

## 12. PRO reel format (owner liked it, 12 Nov 2026)
- `scripts/pro_reel.py S cfg/pro/<x>.py`:
  - **Footage:** cinematic Pexels drone/views (`footage/stk/p<ID>.mp4`) mixed with our best people clips.
  - **Cuts:** on the beat (2 beats per shot), 0.18s xfade transitions (smoothleft/zoomin/smoothup…), punch-zoom at every cut.
  - **Look:** teal-orange grade + vignette + light grain.
  - **Text:** kinetic slam-in, Anton (Helvetica-Compressed look) in white/yellow, yellow box, Poppins.
  - **Sound:** whoosh SFX on cuts, boom on the drop.
- **Hook = 2 stock aerials with big text** ("Delhi se sirf 1 RAAT DOOR", "BADALON KE BEECH"). Then label every shot (ROPEWAY, ZIPLINE, TEHRI LAKE…). End: big place name + date/price + "Comment X".
- Owner uploaded Aligano (script font, `fonts/Aligano.ttf`). The owner first said not to use it, then said the Aligano version "bhi acha lag raha hai". Both versions exist: Kanatal_PRO_Aligano and Kanatal_PRO_Anton. Confirm the choice.
