# CareerSaathi Real-Time Voice-to-Voice (V2V) & 3D VRM Avatar Engine Specification

**Status:** APPROVED FOR IMPLEMENTATION  
**Date:** 2026-10-05  
**Target Stack:** Next.js SSE Streaming + Sarvam AI (Indic ASR & TTS) + Three.js / `@pixiv/three-vrm` + Web Audio API Analyser

---

## 1. System Overview

The CareerSaathi Real-Time Voice-to-Voice (V2V) & 3D VRM Avatar Engine delivers an interactive, bilingual (Hindi/English & regional dialects) AI career counsellor ("Saathi"). It bridges low-literacy barriers in rural/semi-urban households through conversational voice guidance, real-time avatar lip-sync & emotive gestures, and synchronized generative HUD cards.

```
                              ┌──────────────────────────────────────────────────┐
                              │               BROWSER CLIENT (React)             │
                              │  • Web Audio Mic Stream + RMS / Web VAD          │
                              │  • Three.js VRM Avatar Renderer                  │
                              │  • FFT Audio Analyser -> Blendshape Mapper       │
                              │  • Generative HUD Floating Card Deck             │
                              └───────────────┬──────────────────▲───────────────┘
                                              │                  │
                               Audio Chunks / │                  │ SSE Stream:
                               User Utterance │                  │ 1. Text Tokens
                                              │                  │ 2. Audio Chunks (Base64/MP3)
                                              │                  │ 3. Generative HUD Events
                                              ▼                  │
┌────────────────────────────────────────────────────────────────┴───────────────────────────────┐
│                           NEXT.JS 16 SSE STREAMING SERVER ROUTE                                │
│                          `/api/counselling/v2v-stream/route.ts`                                │
│                                                                                                │
│  ┌────────────────────────┐      ┌──────────────────────────────┐      ┌────────────────────┐  │
│  │ 1. Sarvam Saaras ASR   │ ───> │ 2. Streaming LLM Engine      │ ───> │ 3. Sarvam Bulbul   │  │
│  │ (Indic Speech-to-Text) │ Text │ (Gemini 2.0 / Claude 3.5)    │ Text │    Streaming TTS   │  │
│  │ • Hindi, Hinglish,     │      │ • Verified Trade Knowledge   │      │ • 24kHz Indic Voice│  │
│  │   Bhojpuri & Maithili  │      │ • Emits HUD Widget Triggers  │      │ • Chunked Audio    │  │
│  └────────────────────────┘      └──────────────┬───────────────┘      └────────────────────┘  │
│                                                 │                                              │
└─────────────────────────────────────────────────┼──────────────────────────────────────────────┘
                                                  ▼ (On Call End)
                                     ┌──────────────────────────────┐
                                     │  Trigger.dev Background Job  │
                                     │  (Extracts Family Sentiment  │
                                     │   & Prepares Call Brief)     │
                                     └──────────────────────────────┘
```

---

## 2. Core Technical Components

### 2.1 Voice Activity Detection (VAD) & Natural Interruption
* **Client-Side VAD (`src/lib/voice/vad-processor.ts`):**
  - Monitors microphone audio levels using an `AudioWorklet` or Web Audio `ScriptProcessorNode`.
  - Distinguishes human speech from ambient background noise using an energy threshold with rolling silence detection (default: 600ms trailing silence).
  - **Natural Interruption:** If user speaks while Saathi audio is currently playing, client cancels `audio.pause()`, flushes the current audio queue, and notifies the backend to cancel upstream generation.

---

### 2.2 Streaming Indic ASR & TTS (Sarvam AI Integration)
* **Speech-to-Text (`Sarvam Saaras`):**
  - Endpoint: `POST https://api.sarvam.ai/speech-to-text`
  - Model: `saaras:v2`
  - Handles mixed Hindi-English (Hinglish), Bhojpuri accents, and colloquial vocational terms.
* **Text-to-Speech (`Sarvam Bulbul`):**
  - Endpoint: `POST https://api.sarvam.ai/text-to-speech`
  - Model: `bulbul:v1`
  - Voice profiles: Regional female/male counsellor voices with natural prosody and low-latency chunking (< 750ms TTFA).

---

### 2.3 Real-Time 3D VRM Lip-Sync Engine (`src/lib/vrm/lip-sync-analyzer.ts`)
* Connects the Web Audio output stream to a 1024-bin `AnalyserNode`.
* Uses Fast Fourier Transform (FFT) frequency bands to calculate energy distribution in real time (60 FPS animation frame loop):
  - **Vowel `aa` (Open Mouth):** 300Hz – 900Hz band energy.
  - **Vowel `ee` (Wide Mouth):** 1.8kHz – 3.2kHz band energy.
  - **Vowel `ih` / `oh` / `ou` (Rounded):** Formant ratios between low & mid frequencies.
* Applies blendshape smoothing (`lerp` with factor `0.25`) to prevent jarring avatar mouth jitter.

---

### 2.4 Procedural Avatar Gesture Controller (`src/lib/vrm/gesture-controller.ts`)
Controls expressive, lifelike body language across distinct avatar states:

| Avatar State | Visual & Skeletal Animations |
|---|---|
| **Idle / Neutral** | Procedural breathing (subtle sine-wave oscillation on `spine` and `chest` bones) + natural double-blinking every 3.5–5s. |
| **Listening** | Subtle head tilt (+3° on Z-axis), attentive micro-nodding when user voice energy is detected, eye contact pinned to camera. |
| **Speaking** | Hand gesture activation (open palm pointing when HUD cards appear), subtle head movement synced to syllable cadence, dynamic eye blinking. |
| **Empathy / Reassurance** | Gentle head nod, softened eye expressions (`happy` / `relaxed` preset morphs) when discussing fee doubts or safety concerns. |

---

### 2.5 Generative UI HUD Event Stream
During the conversational stream, the LLM emits structured XML/JSON markers inside its output stream:
```xml
<hud_widget type="fee_comparison" tradeId="electrician" govtFee="1500" privateFee="35000" />
```
* The Next.js SSE route intercepts widget tokens, strips them from the spoken TTS string, and sends them as client SSE events:
  ```json
  event: hud_card
  data: {"type": "fee_comparison", "tradeId": "electrician", "govtFee": "₹1,500 / year", "privateFee": "₹35,000"}
  ```
* The 3D UI canvas mounts a floating glassmorphic card directly in the avatar stage, with 1-tap interactive options for the student.

---

## 3. API Contract (`/api/counselling/v2v-stream`)

### Request: `POST /api/counselling/v2v-stream`
- **Headers:** `Content-Type: multipart/form-data` or `application/json`
- **Body:**
  - `audio`: Base64 / binary audio buffer of student speech.
  - `sessionId`: UUID of ongoing counselling session.
  - `learnerId`: UUID of learner.
  - `selectedTradeId`: Active career trade context (e.g. `'electrician'`).
  - `language`: `'hi'` | `'en'`.

### Response: Server-Sent Events (`text/event-stream`)
```
event: user_transcript
data: {"text": "क्या इलेक्ट्रीशियन कोर्स में सरकारी नौकरी मिल सकती है?"}

event: assistant_chunk
data: {"text": "हाँ, बिल्कुल! सरकारी आईटीआई से NCVT सर्टिफिकेट मिलने के बाद...", "isFinal": false}

event: audio_chunk
data: {"audioBase64": "UklGRi4AAABXQVZF...", "format": "mp3", "chunkIndex": 0}

event: hud_card
data: {"type": "salary_growth", "tradeId": "electrician", "startingPay": "₹14,000 - ₹20,000", "payGrowth": "₹28,000+"}

event: done
data: {"sessionDuration": 45}
```

---

## 4. Error Handling & Rural Network Resilience
1. **Network Drop / Reconnect:** If SSE disconnects mid-sentence, the client retains the current transcript state and auto-reconnects with exponential backoff.
2. **Microphone Unavailable / Low-Bandwidth Fallback:** Seamlessly shifts to on-screen quick question chips (`"सरकारी फीस कितनी है?"`, `"नजदीकी कॉलेज कहाँ है?"`) with zero UI layout shift.
3. **TTS Fallback:** If Sarvam AI TTS network latency exceeds 2.5s, the client gracefully falls back to the native Web Speech API `SpeechSynthesisUtterance` while preserving VRM audio spectrum lip-sync.

---

## 5. Security & Privacy
* Microphones are active only during explicit call mode on `/counselling`.
* Audio streams are processed in-memory for ASR and never stored in plain text on unencrypted endpoints.
* Transcripts are written to Supabase `counselling_sessions` with RLS restricted to the authenticated learner and assigned senior counsellor.
