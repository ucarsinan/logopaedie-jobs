# Logopädie Jobs — Vollausbau zur echten Jobs-Site

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Website von einer einfachen Landing Page zu einer vollständigen, professionellen Logopädie-Jobs-Site ausbauen, die von Logopädinnen im Internet gefunden wird und zur Bewerbung konvertiert.

**Architecture:** Astro SSG (kein Server-Side State) — alle Komponenten sind `.astro` Dateien. Neue Sektionen = neue Komponenten in `src/components/`, neue Seiten in `src/pages/`. Keine externe DB, kein CMS — Inhalte direkt im Code.

**Tech Stack:** Astro 6, Tailwind CSS v4 (custom colors: `simsek-green` #81b728, `simsek-blue` #2487c1), vanilla JS für Interaktivität, `@astrojs/sitemap` für automatische Sitemap.

---

## Vorab-Review: Aktueller Stand

### Was funktioniert ✅
- Canonical-URLs korrekt (www-Fix deployed)
- Schema.org JobPosting + FAQ Schema vorhanden
- QuickApply 3-Step Flow funktioniert
- Astro + Tailwind v4 Setup sauber
- Logo SVG vorhanden
- 4 Praxis-Bilder vorhanden (suche.jpg, praxis-bild-1/2/3.jpg, team.jpg)
- Sitemap wird automatisch generiert
- robots.txt korrekt

### Was fehlt / kaputt ist ❌
| # | Problem | Auswirkung | Priorität |
|---|---------|-----------|-----------|
| 1 | `/og-image.png` fehlt (meta tags zeigen drauf) | Social Sharing zeigt leeres Bild | KRITISCH |
| 2 | Mobile Navigation fehlt (kein Hamburger-Menü) | 60% der Nutzer haben keine Navigation | KRITISCH |
| 3 | `addressRegion` fehlt in JobSchema | Google for Jobs Warning | HOCH |
| 4 | Benefits nur 3 Karten (4-Tage-Woche, Bilingualität fehlen) | Wichtige USPs nicht sichtbar | HOCH |
| 5 | FAQ nicht sichtbar (nur als LD+JSON) | Verpasste Trust-Signale, verpasster Content | HOCH |
| 6 | Anforderungen/Qualifikationen Section fehlt | Bewerber wissen nicht, wen wir suchen | HOCH |
| 7 | `team.jpg` nicht genutzt | Verpasster Trust-Faktor | MITTEL |
| 8 | Bilder nicht mit Astro `<Image>` optimiert | Langsamere Ladezeit | MITTEL |
| 9 | Impressum/Datenschutz verlinken auf external | Rechtlich + UX schwach | MITTEL |
| 10 | Gehalt-Highlight Section fehlt | Stärkstes Argument nicht prominent | MITTEL |

---

## File Map

### Zu modifizieren:
- `src/components/JobSchema.astro` — `addressRegion` hinzufügen
- `src/components/Navigation.astro` — Mobile Hamburger-Menü
- `src/components/Benefits.astro` — Auf 6 Karten erweitern
- `src/components/Hero.astro` — team.jpg integrieren
- `src/pages/index.astro` — Neue Sektionen einbinden
- `src/layouts/Layout.astro` — og-image.png path korrekt, hreflang

### Neu zu erstellen:
- `public/og-image.png` — Social Sharing Bild (1200×630px)
- `src/components/SalaryBanner.astro` — Gehalt-Banner zwischen Hero und Aufgaben
- `src/components/Anforderungen.astro` — Was wir uns wünschen
- `src/components/FaqSection.astro` — Sichtbare FAQ (ergänzt FaqSchema)
- `src/pages/impressum.astro` — Impressum-Seite
- `src/pages/datenschutz.astro` — Datenschutz-Seite

---

## Phase 1: Kritische Fixes

### Task 1: addressRegion in JobSchema hinzufügen

**Files:**
- Modify: `src/components/JobSchema.astro`

- [ ] **Step 1: Datei öffnen und `addressRegion` ergänzen**

In `src/components/JobSchema.astro`, Zeile 55 (nach `postalCode`):
```astro
"addressLocality": jobData.location.city,
"postalCode": jobData.location.zip,
"addressRegion": "Nordrhein-Westfalen",
"addressCountry": "DE"
```

- [ ] **Step 2: Commit**
```bash
git add src/components/JobSchema.astro
git commit -m "fix: add addressRegion to JobSchema for Google for Jobs"
```

---

### Task 2: OG-Image erstellen

**Files:**
- Create: `public/og-image.png`

- [ ] **Step 1: OG-Image erstellen**

Erstelle ein 1200×630px PNG mit folgendem Inhalt (kann mit einem Online-Tool wie Canva, Figma oder `sharp` CLI erstellt werden):
- Hintergrund: `#1e293b` (slate-900)
- Logo oben links (SVG als PNG exportiert)
- Großer Text: "Logopädin Job Duisburg 2026"
- Subtext: "3.800 – 5.200 € · 4-Tage-Woche · Hbf-nah"
- Accent-Bar unten: Grün `#81b728`

**Minimal-Alternative:** Kopiere eines der Praxis-Bilder und speichere es als `og-image.png`:
```bash
cp public/praxis-bild-1.jpg public/og-image.png
```
(Nicht ideal, aber sofort funktionierend — Social Sharing zeigt dann ein echtes Bild.)

- [ ] **Step 2: Verify**

Öffne: https://developers.facebook.com/tools/debug/ oder https://cards-dev.twitter.com/validator
Trage die URL ein und prüfe, ob das Bild erscheint.

- [ ] **Step 3: Commit**
```bash
git add public/og-image.png
git commit -m "feat: add og-image for social sharing"
```

---

### Task 3: Mobile Navigation mit Hamburger-Menü

**Files:**
- Modify: `src/components/Navigation.astro`

- [ ] **Step 1: Navigation ersetzen**

Ersetze den gesamten Inhalt von `src/components/Navigation.astro`:

```astro
---
import Logo from './Logo.astro';
---
<nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
  <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <a href="/" class="block hover:opacity-90 transition-opacity" aria-label="Zur Startseite">
      <Logo class="h-10 md:h-12 w-auto" />
    </a>

    <!-- Desktop Nav -->
    <div class="hidden md:flex items-center gap-8">
      <a href="#aufgaben" class="text-sm font-semibold text-slate-600 hover:text-simsek-blue transition-colors no-underline">Was dich erwartet</a>
      <a href="#benefits" class="text-sm font-semibold text-slate-600 hover:text-simsek-blue transition-colors no-underline">Vorteile</a>
      <a href="#apply" class="text-sm font-semibold text-slate-600 hover:text-simsek-blue transition-colors no-underline">Bewerbung</a>
      <div class="h-4 w-[1px] bg-slate-200"></div>
      <a href="https://logopaedie-simsek.de" target="_blank" class="text-xs font-bold text-simsek-green hover:text-simsek-blue uppercase tracking-wider no-underline">Zur Praxis</a>
    </div>

    <!-- Mobile: CTA + Hamburger -->
    <div class="flex md:hidden items-center gap-3">
      <a href="#apply" class="px-4 py-2 bg-simsek-green text-white text-sm font-bold rounded-xl no-underline">
        Bewerben
      </a>
      <button id="mobile-menu-btn" aria-label="Menü öffnen" class="p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <svg id="icon-open" class="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg id="icon-close" class="w-6 h-6 text-slate-700 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Dropdown -->
  <div id="mobile-menu" class="hidden md:hidden border-t border-slate-100 bg-white">
    <div class="max-w-7xl mx-auto px-6 py-4 space-y-1">
      <a href="#aufgaben" class="mobile-nav-link block py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl no-underline transition-colors">Was dich erwartet</a>
      <a href="#benefits" class="mobile-nav-link block py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl no-underline transition-colors">Vorteile</a>
      <a href="#apply" class="mobile-nav-link block py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl no-underline transition-colors">Bewerbung</a>
      <div class="pt-2 border-t border-slate-100 mt-2">
        <a href="https://logopaedie-simsek.de" target="_blank" class="block py-3 px-4 text-sm font-bold text-simsek-green hover:bg-slate-50 rounded-xl no-underline transition-colors">Zur Praxis →</a>
      </div>
    </div>
  </div>
</nav>

<script is:inline>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    iconOpen.classList.toggle('hidden', !isOpen);
    iconClose.classList.toggle('hidden', isOpen);
  });

  // Close on nav link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    });
  });
</script>
```

- [ ] **Step 2: Visuell prüfen**

`npm run dev` starten, Browser auf < 768px verkleinern, Hamburger-Icon prüfen.

- [ ] **Step 3: Commit**
```bash
git add src/components/Navigation.astro
git commit -m "feat: add responsive mobile navigation with hamburger menu"
```

---

## Phase 2: Content-Erweiterung

### Task 4: Benefits auf 6 Karten erweitern

**Files:**
- Modify: `src/components/Benefits.astro`

- [ ] **Step 1: Benefits-Grid auf 6 Karten erweitern**

Ersetze den gesamten Inhalt von `src/components/Benefits.astro`:

```astro
---
---
<section id="benefits" class="py-24 bg-white text-left">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
      <div class="max-w-2xl">
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Deine Vorteile</h2>
        <p class="text-lg text-slate-600">Wir haben unseren Mitarbeiterinnen zugehört. Das hier ist ihnen am wichtigsten.</p>
      </div>
      <div class="hidden md:block text-simsek-blue font-bold text-lg italic tracking-wider">#TeamSimsek</div>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Gehalt -->
      <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-simsek-green transition-all group">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-simsek-green mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">Top Gehalt</h3>
        <p class="text-slate-600 leading-relaxed text-sm">3.800 – 5.200 € monatlich. Deutlich über dem NRW-Durchschnitt – weil gute Therapie fair entlohnt werden muss.</p>
      </div>

      <!-- Lage -->
      <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-simsek-blue transition-all group">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-simsek-blue mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">Beste Lage</h3>
        <p class="text-slate-600 leading-relaxed text-sm">Tonhallenstraße 21 – direkt im Zentrum, nur 2 Min. Fußweg vom Duisburger Hbf. Kein Stress mit Parkplatz.</p>
      </div>

      <!-- Fortbildung -->
      <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-simsek-green transition-all group">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-simsek-green mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">100% Fortbildung</h3>
        <p class="text-slate-600 leading-relaxed text-sm">Wir übernehmen alle Kosten und geben dir bezahlten Sonderurlaub. ISTP, Lax Vox®, Dysphagie – du entscheidest.</p>
      </div>

      <!-- 4-Tage-Woche -->
      <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-simsek-blue transition-all group">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-simsek-blue mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">4-Tage-Woche</h3>
        <p class="text-slate-600 leading-relaxed text-sm">Flexibles Arbeitszeitmodell möglich. 4 Tage volle Energie statt 5 Tage Erschöpfung – dein Privatleben zählt.</p>
      </div>

      <!-- Bilingual -->
      <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-simsek-green transition-all group">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-simsek-green mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">Bilinguales Team</h3>
        <p class="text-slate-600 leading-relaxed text-sm">Deutsch-Türkisches Team – einzigartig in Duisburg. Interkulturelles Arbeiten als echte Stärke, nicht als Nische.</p>
      </div>

      <!-- Modernes Arbeiten -->
      <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-simsek-blue transition-all group">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-simsek-blue mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">Modernes Material</h3>
        <p class="text-slate-600 leading-relaxed text-sm">Helle, moderne Praxisräume mit aktuellem Therapiematerial. 3. OG mit Aufzug – alles da, was du brauchst.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Prüfen**

`npm run dev` starten, Benefits-Sektion sichtet — 6 Karten, 2 Spalten × 3 Reihen auf Desktop, 1 Spalte auf Mobile.

- [ ] **Step 3: Commit**
```bash
git add src/components/Benefits.astro
git commit -m "feat: expand benefits to 6 cards (add 4-Tage-Woche, bilingual, modern)"
```

---

### Task 5: Anforderungen-Sektion erstellen

**Files:**
- Create: `src/components/Anforderungen.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Anforderungen.astro erstellen**

Erstelle `src/components/Anforderungen.astro`:

```astro
---
---
<section id="anforderungen" class="py-24 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid lg:grid-cols-2 gap-16 items-start">

      <div>
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6 uppercase tracking-tight leading-tight">
          Wen wir <br/><span class="text-simsek-blue">suchen.</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed mb-8">
          Du musst keine Übermensch sein. Aber du solltest Lust haben, wirklich gute Therapie zu machen – und dabei du selbst zu sein.
        </p>

        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-simsek-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-simsek-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900">Staatlich geprüfte Logopädin / Logopäde (m/w/d)</p>
              <p class="text-sm text-slate-500">Abschluss Pflicht. Berufsanfänger willkommen.</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-simsek-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-simsek-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900">Freude an der Arbeit mit Kindern & Erwachsenen</p>
              <p class="text-sm text-slate-500">Von Pädiatrie bis Neurologie – breit aufgestellt oder spezialisiert.</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-simsek-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-simsek-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900">Offenheit für interkulturelles Arbeiten</p>
              <p class="text-sm text-slate-500">Deutsch ist Pflicht. Türkischkenntnisse sind ein Plus, aber kein Muss.</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-simsek-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-simsek-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900">Teamgeist & Eigenverantwortung</p>
              <p class="text-sm text-slate-500">Wir arbeiten auf Augenhöhe. Hierarchien halten wir flach.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-900 text-white p-8 rounded-[2rem]">
          <h3 class="text-xl font-bold mb-6 text-simsek-green uppercase tracking-wide">Was du bekommst</h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center gap-3"><span class="text-simsek-green font-bold text-lg">✓</span> 3.800 – 5.200 € / Monat</li>
            <li class="flex items-center gap-3"><span class="text-simsek-green font-bold text-lg">✓</span> 4-Tage-Woche möglich</li>
            <li class="flex items-center gap-3"><span class="text-simsek-green font-bold text-lg">✓</span> 100% Fortbildungskosten übernommen</li>
            <li class="flex items-center gap-3"><span class="text-simsek-green font-bold text-lg">✓</span> Bezahlter Sonderurlaub für Kurse</li>
            <li class="flex items-center gap-3"><span class="text-simsek-green font-bold text-lg">✓</span> Moderne Praxisräume mit Aufzug</li>
            <li class="flex items-center gap-3"><span class="text-simsek-green font-bold text-lg">✓</span> 2 Minuten zum Duisburger Hbf</li>
            <li class="flex items-center gap-3"><span class="text-simsek-green font-bold text-lg">✓</span> Bilinguales, herzliches Team</li>
          </ul>
          <div class="mt-8 pt-6 border-t border-white/10">
            <a href="#apply" class="inline-flex items-center gap-2 px-6 py-3 bg-simsek-green text-white font-bold rounded-xl no-underline hover:scale-[1.02] transition-transform text-sm">
              Jetzt bewerben →
            </a>
          </div>
        </div>
        <p class="text-xs text-slate-400 text-center">Vollzeit oder Teilzeit möglich · Frühestmöglich oder ab Vereinbarung</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: In index.astro einbinden**

Öffne `src/pages/index.astro` und füge den Import und die Komponente hinzu:

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
import Hero from '../components/Hero.astro';
import Aufgaben from '../components/Aufgaben.astro';
import Anforderungen from '../components/Anforderungen.astro';
import QuickApply from '../components/QuickApply.astro';
import Benefits from '../components/Benefits.astro';
import About from '../components/About.astro';
import Gallery from '../components/Gallery.astro';
import Footer from '../components/Footer.astro';
// ...
---

<Layout title={pageTitle} description={pageDescription}>
  <Navigation />
  <main>
    <Hero />
    <Aufgaben />
    <Anforderungen />
    <QuickApply />
    <Benefits />
    <About />
    <Gallery />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 3: Visuell prüfen**

`npm run dev` starten, neue Sektion nach Aufgaben prüfen.

- [ ] **Step 4: Commit**
```bash
git add src/components/Anforderungen.astro src/pages/index.astro
git commit -m "feat: add Anforderungen section with requirements and benefits overview"
```

---

### Task 6: Sichtbare FAQ-Sektion

**Files:**
- Create: `src/components/FaqSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: FaqSection.astro erstellen**

Erstelle `src/components/FaqSection.astro`:

```astro
---
const faqs = [
  {
    q: "Welche Stelle bietet die Praxis Şimşek an?",
    a: "Wir suchen eine Logopädin bzw. einen Logopäden (m/w/d) in Vollzeit oder Teilzeit. Die Stelle ist an unserem Standort Tonhallenstraße 21, 47051 Duisburg – nur 2 Minuten vom Hauptbahnhof."
  },
  {
    q: "Wie hoch ist das Gehalt?",
    a: "3.800 – 5.200 € monatlich, je nach Erfahrung und Stundenzahl. Das liegt deutlich über dem Branchendurchschnitt für Logopädinnen in NRW."
  },
  {
    q: "Muss ich Türkisch sprechen?",
    a: "Nein. Deutsch ist Pflicht, Türkischkenntnisse sind ein Plus – aber kein Muss. Wir suchen in erster Linie fachliche Kompetenz und Lust auf ein diverses Team."
  },
  {
    q: "Wie läuft die Bewerbung ab?",
    a: "Schreib uns einfach per WhatsApp oder E-Mail – kein Lebenslauf nötig für den ersten Kontakt. Wir laden dich zu einem lockeren Kennenlerngespräch ein (Kaffee geht auf uns ☕)."
  },
  {
    q: "Gibt es die 4-Tage-Woche wirklich?",
    a: "Ja. Es ist ein optionales Modell – wir sprechen es im Erstgespräch durch. Viele unserer Therapeutinnen arbeiten 4 Tage, weil wir glauben: ausgeruhte Therapeuten machen bessere Therapie."
  }
];
---

<section id="faq" class="py-24 bg-slate-50">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 uppercase tracking-tight text-center">Häufige Fragen</h2>
    <p class="text-lg text-slate-600 text-center mb-16">Alles Wichtige auf einen Blick.</p>

    <div class="space-y-4">
      {faqs.map((faq, i) => (
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <button
            class="w-full text-left px-6 py-5 flex justify-between items-center gap-4 font-semibold text-slate-900 hover:bg-slate-50 transition-colors faq-btn"
            data-target={`faq-${i}`}
          >
            <span>{faq.q}</span>
            <svg class="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div id={`faq-${i}`} class="faq-body hidden px-6 pb-5">
            <p class="text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>

    <div class="mt-12 text-center">
      <p class="text-slate-500 mb-4">Noch eine Frage?</p>
      <a href="https://api.whatsapp.com/send?phone=4920334868690&text=Hallo%20Emel!%20Ich%20habe%20eine%20Frage%20zum%20Job." target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-simsek-green text-white font-bold rounded-xl no-underline hover:scale-[1.02] transition-transform text-sm">
        Direkt fragen (WhatsApp)
      </a>
    </div>
  </div>
</section>

<script is:inline>
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('.faq-icon');
      const isOpen = !body.classList.contains('hidden');
      body.classList.toggle('hidden', isOpen);
      icon.style.transform = isOpen ? '' : 'rotate(180deg)';
    });
  });
</script>
```

- [ ] **Step 2: In index.astro einbinden**

Füge in `src/pages/index.astro` FaqSection nach Gallery ein:

```astro
import FaqSection from '../components/FaqSection.astro';
// ...
<Gallery />
<FaqSection />
<Footer />
```

- [ ] **Step 3: Commit**
```bash
git add src/components/FaqSection.astro src/pages/index.astro
git commit -m "feat: add visible FAQ accordion section"
```

---

### Task 7: team.jpg in About-Sektion einbauen

**Files:**
- Modify: `src/components/About.astro`

- [ ] **Step 1: team.jpg einbinden**

In `src/components/About.astro`, füge nach dem `<div class="space-y-6">` Block auf der linken Seite ein Teambild hinzu. Direkt nach dem `<div class="space-y-6 text-left">` Opening-Tag und vor `<h2>`:

```astro
<div class="relative rounded-[2rem] overflow-hidden aspect-video mb-8 shadow-xl">
  <img
    src="/team.jpg"
    alt="Das Team der Praxis für Logopädie Şimşek in Duisburg"
    class="w-full h-full object-cover"
    loading="lazy"
  />
  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
</div>
```

- [ ] **Step 2: Prüfen**

`npm run dev` starten, About-Sektion — team.jpg sollte über dem Text erscheinen.

- [ ] **Step 3: Commit**
```bash
git add src/components/About.astro
git commit -m "feat: add team photo to About section"
```

---

## Phase 3: Rechtliches & Vertrauen

### Task 8: Impressum-Seite

**Files:**
- Create: `src/pages/impressum.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: impressum.astro erstellen**

Erstelle `src/pages/impressum.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Impressum | Praxis für Logopädie Şimşek" description="Impressum der Praxis für Logopädie Şimşek, Tonhallenstraße 21, 47051 Duisburg">
  <Navigation />
  <main class="max-w-3xl mx-auto px-6 py-24">
    <h1 class="text-4xl font-bold text-slate-900 mb-12 uppercase tracking-tight">Impressum</h1>

    <div class="prose prose-slate max-w-none space-y-8 text-slate-700">
      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">Angaben gemäß § 5 TMG</h2>
        <p>Praxis für Logopädie Şimşek<br/>
        Tonhallenstraße 21<br/>
        47051 Duisburg</p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">Kontakt</h2>
        <p>Telefon: +49 (0) 203 3486 8690<br/>
        E-Mail: <a href="mailto:info@logopaedie-simsek.de" class="text-simsek-blue hover:underline">info@logopaedie-simsek.de</a></p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>Emel Şimşek<br/>
        Tonhallenstraße 21<br/>
        47051 Duisburg</p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">Haftungsausschluss</h2>
        <p class="text-sm">Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
      </section>
    </div>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Footer-Link auf eigene Seite umstellen**

In `src/components/Footer.astro`, ändere:
```astro
<!-- Alt: -->
<a href="https://logopaedie-simsek.de/impressum" target="_blank" class="hover:text-white no-underline">Impressum</a>

<!-- Neu: -->
<a href="/impressum" class="hover:text-white no-underline">Impressum</a>
```

- [ ] **Step 3: Commit**
```bash
git add src/pages/impressum.astro src/components/Footer.astro
git commit -m "feat: add local impressum page"
```

---

### Task 9: Datenschutz-Seite

**Files:**
- Create: `src/pages/datenschutz.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: datenschutz.astro erstellen**

Erstelle `src/pages/datenschutz.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Datenschutz | Praxis für Logopädie Şimşek" description="Datenschutzerklärung der Praxis für Logopädie Şimşek">
  <Navigation />
  <main class="max-w-3xl mx-auto px-6 py-24">
    <h1 class="text-4xl font-bold text-slate-900 mb-12 uppercase tracking-tight">Datenschutzerklärung</h1>

    <div class="space-y-10 text-slate-700">
      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">1. Datenschutz auf einen Blick</h2>
        <p class="text-sm leading-relaxed">Diese Website wird als statische HTML-Seite über Vercel ausgeliefert. Es werden keine Cookies gesetzt und keine Nutzerdaten gespeichert. Beim Aufruf der Seite werden lediglich die technisch notwendigen Server-Logs von Vercel (IP-Adresse, Zeitstempel, aufgerufene URL) für max. 30 Tage gespeichert.</p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">2. Verantwortlicher</h2>
        <p class="text-sm leading-relaxed">Praxis für Logopädie Şimşek<br/>
        Emel Şimşek<br/>
        Tonhallenstraße 21, 47051 Duisburg<br/>
        E-Mail: info@logopaedie-simsek.de</p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">3. Kontaktaufnahme per WhatsApp / E-Mail</h2>
        <p class="text-sm leading-relaxed">Wenn Sie uns über WhatsApp oder E-Mail kontaktieren, werden Ihre Angaben zur Bearbeitung der Bewerbung gespeichert und genutzt. Eine Weitergabe an Dritte findet nicht statt. Die Daten werden gelöscht, sobald die Anfrage abgeschlossen ist.</p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">4. Externe Links</h2>
        <p class="text-sm leading-relaxed">Diese Website enthält Links zu WhatsApp (Meta Platforms Inc.). Für deren Datenschutzpraktiken sind wir nicht verantwortlich. Informationen dazu finden Sie in der Datenschutzerklärung von WhatsApp.</p>
      </section>

      <section>
        <h2 class="text-xl font-bold text-slate-900 mb-3">5. Ihre Rechte</h2>
        <p class="text-sm leading-relaxed">Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Wenden Sie sich dafür an: info@logopaedie-simsek.de</p>
      </section>
    </div>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Footer-Link anpassen**

In `src/components/Footer.astro`:
```astro
<!-- Alt: -->
<a href="https://logopaedie-simsek.de/datenschutz" target="_blank" class="no-underline">Datenschutz</a>

<!-- Neu: -->
<a href="/datenschutz" class="no-underline">Datenschutz</a>
```

- [ ] **Step 3: Commit**
```bash
git add src/pages/datenschutz.astro src/components/Footer.astro
git commit -m "feat: add local datenschutz page"
```

---

## Phase 4: SEO & Performance

### Task 10: hreflang + Robots meta optimieren

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: hreflang für DE hinzufügen**

In `src/layouts/Layout.astro`, nach der `<link rel="canonical">` Zeile:

```astro
<link rel="canonical" href={canonicalURL} />
<link rel="alternate" hreflang="de" href={canonicalURL} />
<link rel="alternate" hreflang="x-default" href={canonicalURL} />
```

- [ ] **Step 2: Commit**
```bash
git add src/layouts/Layout.astro
git commit -m "seo: add hreflang tags for German content"
```

---

### Task 11: Bilder mit loading="lazy" optimieren

**Files:**
- Modify: `src/components/Gallery.astro`
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Gallery images lazy-load**

In `src/components/Gallery.astro`, füge `loading="lazy"` zu allen `<img>` Tags hinzu:

```astro
<img
  src="/praxis-bild-1.jpg"
  alt="Einblick in die Praxisräume"
  class="w-full h-full object-cover"
  loading="lazy"
  decoding="async"
/>
```
(Gleiches für praxis-bild-2.jpg und praxis-bild-3.jpg)

- [ ] **Step 2: Hero image — eager (above-the-fold)**

In `src/components/Hero.astro`, das Hauptbild sollte `loading="eager"` haben (es ist above-the-fold):
```astro
<img
    src="/suche.jpg"
    alt="Das Team der Praxis Şimşek"
    class="w-full h-auto object-contain transform transition duration-700 group-hover:scale-105"
    loading="eager"
    fetchpriority="high"
/>
```

- [ ] **Step 3: Commit**
```bash
git add src/components/Gallery.astro src/components/Hero.astro
git commit -m "perf: add lazy loading to gallery images, eager to hero"
```

---

### Task 12: Navigation auf mobile um FAQ + Anforderungen erweitern

**Files:**
- Modify: `src/components/Navigation.astro`

- [ ] **Step 1: Nav-Links erweitern**

Im Desktop-Nav, einen Link zu "#anforderungen" hinzufügen:

```astro
<!-- Desktop Nav - nach "Was dich erwartet": -->
<a href="#anforderungen" class="text-sm font-semibold text-slate-600 hover:text-simsek-blue transition-colors no-underline">Anforderungen</a>
```

Im Mobile-Dropdown:
```astro
<a href="#anforderungen" class="mobile-nav-link block py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl no-underline transition-colors">Anforderungen</a>
```

- [ ] **Step 2: Commit**
```bash
git add src/components/Navigation.astro
git commit -m "feat: add Anforderungen nav link to desktop and mobile"
```

---

### Task 13: Deploy & Final Check

- [ ] **Step 1: Lokalen Build testen**

```bash
npm run build
npm run preview
```

Prüfe: keine Build-Fehler, alle Seiten ladbar.

- [ ] **Step 2: Checklist vor Deploy**

- [ ] Navigation Desktop → alle Links gehen zu Sektionen
- [ ] Navigation Mobile → Hamburger öffnet/schließt korrekt
- [ ] Benefits → 6 Karten sichtbar
- [ ] Anforderungen → neue Sektion zwischen Aufgaben und QuickApply
- [ ] FAQ-Sektion → Accordion funktioniert
- [ ] team.jpg → sichtbar in About
- [ ] /impressum → Seite ladbar
- [ ] /datenschutz → Seite ladbar
- [ ] Footer-Links → zeigen auf /impressum und /datenschutz (kein _blank)
- [ ] public/og-image.png → existiert

- [ ] **Step 3: Commit & Push**

```bash
git add -A
git commit -m "chore: final pre-deploy cleanup"
git push origin main
```

- [ ] **Step 4: Search Console — neue Sitemap einreichen**

Nach Deploy die Sitemap in Google Search Console neu einreichen, da neue Seiten (/impressum, /datenschutz) hinzugekommen sind:
- URL: `https://xn--logopdiejobs-kcb.de/sitemap-index.xml`
- Search Console → Sitemaps → URL eingeben → Senden

---

## Self-Review

### Spec Coverage ✅
- OG-Image → Task 2 ✅
- Mobile Navigation → Task 3 ✅
- addressRegion → Task 1 ✅
- Benefits 6 Karten → Task 4 ✅
- Anforderungen → Task 5 ✅
- FAQ sichtbar → Task 6 ✅
- team.jpg → Task 7 ✅
- Impressum/Datenschutz eigen → Tasks 8 & 9 ✅
- Performance (lazy load) → Tasks 11 ✅
- hreflang → Task 10 ✅

### Reihenfolge im Seitenaufbau (von oben nach unten):
1. Navigation (sticky)
2. Hero (Titel + CTAs + Bild)
3. Aufgaben (4 Fachbereiche)
4. **NEU: Anforderungen** (Wen wir suchen + Was du bekommst)
5. QuickApply (3-Step Flow)
6. Benefits (6 Karten)
7. About (Team-Bild + Text + Stats)
8. Gallery (3 Praxis-Fotos)
9. **NEU: FAQ** (5 Accordion-Fragen)
10. Footer
