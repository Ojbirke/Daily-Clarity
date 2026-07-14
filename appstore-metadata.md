# App Store-metadata — Daily Clarity

Two localizations. **English is primary** (app UI + screenshots are English).
**Norwegian is a metadata-only localization** for search visibility in the
Norwegian store — the app itself does NOT need translating. Norwegian screenshots
are optional polish; the nb listing can launch with the English screenshots.

Fixed vs. the current live listing:
- Removed "No notifications" (we added an optional reminder).
- Removed the false "Premium" claim (Patterns is free).
- Added the new streak feature.

---

# 🇬🇧 English (primary)

## App Name / Title  (max 30)
```
Daily Clarity: Focus & Calm
```
(27 chars — drops the redundant "App", adds search keywords.)

## Subtitle  (max 30)
```
One mindful check-in a day
```
(26 chars — adds "mindful" and "check-in".)

## Keywords  (max 100, comma-separated, no spaces)
```
mood,intention,journal,habit,reflect,wellbeing,energy,mindfulness,gratitude,morning,mental,stress
```
(97 chars. No repeats of words already in the title/subtitle.)

## Promotional Text  (max 170 — editable without review)
```
One clear moment a day. Choose your intention — Focus, Calm, or Energy — in under a minute, and build a quiet streak day by day.
```

## Description  (max 4000)
```
Daily Clarity is a simple daily check-in to help you focus on what you need most — in under one minute.

Each day, choose one intention:
Focus. Calm. Or Energy.

That's it.

No accounts.
No feeds.
No pressure.

Just one clear moment a day.

HOW IT WORKS
• Open the app once a day
• Choose Focus, Calm, or Energy
• Optionally add a short note
• You're done for today

Your choice is locked for the day, encouraging presence instead of overthinking.

BUILD A STREAK
See how many days in a row you've checked in. A calm nudge to come back — with no pressure.

COLORS THAT MATCH YOUR DAY
Tap the icon on the locked screen to activate color themes. 10 unique palettes for each choice — Focus, Calm, and Energy.

PATTERNS
See your choices over time on the Patterns screen. Completely free.

WHY PEOPLE USE DAILY CLARITY
• To start the day with intention
• To slow down without journaling
• To build awareness without tracking everything
• To reflect — without being overwhelmed

If you'd like, you can turn on a gentle daily reminder for your check-in. It's entirely optional — you're in control.

Daily Clarity is not a habit tracker or a mental health app. It's a quiet space for one small, intentional decision.

PRIVACY
Daily Clarity respects your privacy.
All data stays on your device.
No accounts. No tracking.
```

## What's New  (release notes)
```
• New: build a streak — see how many days in a row you've checked in.
• Optional, gentle daily reminder for your check-in.
• Under-the-hood cleanup for better stability and performance.
```

## Screenshot captions
1. One question. One minute.
2. Set your intention — add a note
3. Then you're done for today
4. Colors that match your mood
5. See your patterns over time

---

# 🇳🇴 Norsk (Bokmål — sekundær, kun metadata)

## Appnavn / Tittel  (maks 30)
```
Daily Clarity: Fokus & Ro
```
(25 tegn.)

## Undertittel  (maks 30)
```
Daglig innsjekk for sinnsro
```
(27 tegn.)

## Nøkkelord  (maks 100, komma, ingen mellomrom)
```
humør,energi,intensjon,mindfulness,refleksjon,dagbok,vane,morgen,mental,velvære,stress,mål,rutine
```
(97 tegn.)

## Kampanjetekst  (maks 170)
```
Ett klart øyeblikk om dagen. Velg dagens intensjon — Fokus, Ro eller Energi — på under ett minutt, og bygg en rolig serie dag for dag.
```

## Beskrivelse  (maks 4000)
```
Daily Clarity er en enkel daglig innsjekk som hjelper deg å fokusere på det du trenger mest — på under ett minutt.

Hver dag velger du én intensjon:
Fokus. Ro. Eller Energi.

Så enkelt er det.

Ingen konto.
Ingen feed.
Ingen mas.

Bare ett klart øyeblikk om dagen.

SLIK FUNGERER DET
• Åpne appen én gang om dagen
• Velg Fokus, Ro eller Energi
• Legg til et kort notat om du vil
• Ferdig for i dag

Valget ditt låses for dagen — det oppmuntrer til nærvær i stedet for overtenkning.

BYGG EN SERIE
Se hvor mange dager på rad du har sjekket inn. En rolig motivasjon til å komme tilbake — helt uten press.

FARGER SOM MATCHER DAGEN
Trykk på ikonet på den låste skjermen for å aktivere fargetema. 10 unike paletter for hvert valg — Fokus, Ro og Energi.

MØNSTRE
Se valgene dine over tid på Mønstre-skjermen. Helt gratis.

HVORFOR FOLK BRUKER DAILY CLARITY
• For å starte dagen med intensjon
• For å roe ned uten å skrive dagbok
• For å bygge bevissthet uten å spore alt
• For å reflektere — uten å bli overveldet

Vil du, kan du slå på en mild daglig påminnelse om dagens innsjekk. Du bestemmer selv — den er helt valgfri.

Daily Clarity er verken en vaneteller eller en app for psykisk helse. Det er et stille rom for én liten, bevisst avgjørelse.

PERSONVERN
Daily Clarity respekterer personvernet ditt.
Alle data blir værende på enheten din.
Ingen konto. Ingen sporing.
```

## Nytt i denne versjonen
```
• Nytt: bygg en serie — se hvor mange dager på rad du har sjekket inn.
• Valgfri, mild daglig påminnelse om dagens innsjekk.
• Rydding under panseret for bedre stabilitet og ytelse.
```

## Skjermbilde-captions
1. Ett spørsmål. Ett minutt.
2. Sett intensjonen din — legg til et notat
3. Så er du ferdig for i dag
4. Farger som matcher humøret ditt
5. Se mønstrene dine over tid

---

## URL-er (begge lokaliseringer)
- Support:  `https://dailyclarity.managemyapps.app/support.html`
- Personvern / Privacy:  `https://dailyclarity.managemyapps.app/privacy.html`
- Marketing (valgfri):  `https://dailyclarity.managemyapps.app/`

## Innsending
- **English** localization: English screenshots (already have them).
- **Norsk** localization: kan gjenbruke de engelske skjermbildene nå; bytt til
  norsk-tekstede skjermbilder senere om ønskelig (ikke nødvendig for lansering).
- **Ikke** nødvendig å oversette selve appen.
- app.json: sett `version` > 2.0 og `buildNumber` høyere enn siste build.
```
