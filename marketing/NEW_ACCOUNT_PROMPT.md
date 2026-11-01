# Prompt to paste in the new Claude account (Claude Code on the web)

Start a Claude Code session on the repo **rctripsinfo-ux/rctripswebsite**, branch **ccr-2e059cb5-z5nme5**. Then paste this:

---

You are taking over the RC Trips (Red Carpet Tours Pvt. Ltd., rctrips.com, WhatsApp +91 72900 12474) Instagram and Meta ads video work from another Claude account.

Everything is in this repo, on branch `ccr-2e059cb5-z5nme5`, in the `marketing/` folder. Start by reading `marketing/HANDOFF.md` fully, then `marketing/script_texts/STYLE_GUIDE.md`. They have the packages and prices, my rules, the video style, the file map, how to re-render, and what is pending.

Short version of how I work:
- **Packages:**
  - Kanatal ₹6,800
  - Rishikesh–Haridwar ₹5,500 triple / ₹5,800 twin
  - Manali–Solang–Kasol ₹10,000 triple / ₹10,500 twin (don't show the price in its video)
  - Agra–Mathura–Vrindavan ₹4,500
- **Scripts:**
  - Always give me the spoken script first and wait for my OK, one at a time.
  - Male speaker, Roman Hinglish, casual like talking to a friend, no drama lines.
  - A new hook every time.
  - Price early, and end with the WhatsApp "Book Now" CTA.
- **Voice:** I make it in ElevenLabs and send you the MP3 + SRT. You make the video with `marketing/scripts/render_ad.py` (see the HANDOFF):
  - "style 3" word-by-word captions with a yellow box on the active word
  - the "style C" top hook made with `hookbanner.py`
  - xfade transitions
  - an end card with WhatsApp, rctrips.com and the Red Carpet logo
- **Music:** no background music in the videos (I add it myself). No GST/TCS text.
- **Footage:** use our own group clips (`footage/proxy`) for group and masti lines, and Pexels for places. Check the clip really shows the right place.
- **Before rendering:** the Pexels stock clips are not in git. Re-download them with `python3 marketing/scripts/fetch_pexels.py marketing` (needs a Pexels API key in `PEXELS_API_KEY`, or the Pexels connector).
- **Saving work:** commit and push your work to the same branch so nothing is lost.

Reply in Hinglish. First confirm you have read the handoff, and list the 4 packages and the current status in a few lines.

---
