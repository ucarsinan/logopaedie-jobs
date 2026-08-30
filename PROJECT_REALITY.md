# PROJECT_REALITY

Last audit: 2026-08-30
Recommendation: continue
Confidence: high

## Core Problem
- Problem: Die Praxis fuer Logopaedie Simsek braucht qualifizierte Erstkontakte fuer mehrere eigene, unbefristete Logopaedie- und Sprachtherapie-Stellen.
- Affected user: Staatlich anerkannte und zugelassene Logopaed:innen und Sprachtherapeut:innen im Raum Duisburg, einschliesslich Berufsanfänger:innen.
- Painful current workflow: Interessierte muessen Arbeitsbedingungen, Passung und Kontaktwege schnell und ohne klassische Bewerbungsunterlagen einschaetzen koennen.
- Desired real-world outcome: Glaubwuerdige Erwartungen, unverbindlicher Erstkontakt, Kennenlernen, Einstellung und langfristige Zusammenarbeit.
- Success criteria: Qualifizierte Kontakte und Einstellungen fuer die Praxis, konsistente Employer-Truth-Aussagen, klare Kontaktwege und nachvollziehbare Mess-/Datenschutzregeln.

## Current State
- Implemented: Astro/Vercel-Site fuer ausschliesslich eigene Praxisstellen, Stellenuebersicht, Detailseite, Berufshandbuch, Gehaltsrechner, FAQ, kurzer E-Mail-Erstkontakt und Consent-Gating.
- Released: Die Employer-Truth-Harmonisierung wurde mit Commit `2d45fb6` auf `main` gepusht und am 30.08.2026 auf `https://xn--logopdiejobs-kcb.de/` live verifiziert.
- Released: Vollzeit 38,5 Stunden, variable Teilzeit, Vier-Tage-Woche, Verguetung, Weihnachtsgeld, Fortbildungsunterstuetzung, Einarbeitung, Qualifikation und Kontaktwege entsprechen der freigegebenen Arbeitgeberwahrheit.
- Cleanup: Das nicht referenzierte Alt-Creative `public/team.jpg` mit dem gesperrten Claim "TOP GEHALT" und die nicht mehr verwendete mobile `StickyApplyBar` sind aus dem aktiven Repository entfernt; das Social-Share-Bild liegt passend zu seinen JPEG-Daten als `og-image.jpg` vor.
- Measurement: Vercel Web Analytics wird live geladen. GA4-Code existiert hinter `PUBLIC_GA_MEASUREMENT_ID` und Consent-Gating; im Live-Audit vom 30.08.2026 war kein Google-Tag und keine GA-ID ausgeliefert.
- Not approved: Mehr-Arbeitgeber-Jobboerse, Supabase, Arbeitgeber-Self-Service, Admin-Moderation, neue Tracking-Events, Ads und weitere Kampagnenarbeit ohne zentralen Gate-Entscheid.

## Reality Findings
- Local evidence: `main` war vor diesem Cleanup mit `origin/main` synchron; der letzte vollstaendige Build erzeugte 21 Seiten und der Employer-Truth-Diff wurde auf Desktop und Mobil geprueft.
- Live evidence: Start-, Stellenuebersichts- und Detailseite zeigen die freigegebenen Arbeitsbedingungen; die fruehere feste mobile Bewerbungsleiste ist nicht mehr eingebunden.
- Branch evidence: Drei lokale Alt-Branches sind gemergt. `fix/ai-crawler-access` widerspricht der aktuellen Bot-Policy; `fix/vercel-bot-protection` enthaelt veraltete UI-Texte und nicht freigegebenes GA4-Eventtracking. Beide sind nicht zu mergen.
- Key uncertainty: Hiring-Ziel, Funnel-Baseline, Antwortzeit, Tracking-Owner, Aufbewahrung und Loeschfristen sind noch nicht festgelegt.

## Gaps And Risks
- Missing essentials: Messrahmen, Datenschutz-Owner, Funnel-/Retention-Baseline und Quellenreview fuer allgemeine Ratgeberstatistiken.
- Drift warnings: Mehr-Arbeitgeber-Jobboerse, zusaetzliche Content-Cluster, Ads, autonome Content-Produktion und Tracking-Ausbau vor Mess- und Datenschutzfreigabe.
- Risks: Allgemeine Ratgebertexte enthalten weiterhin Marktbeispiele zu 20-Stunden-Modellen, 100-Prozent-Fortbildung und Gehaltsaufschlaegen; diese sind keine Praxisversprechen, benoetigen aber belastbare Quellen.
- Technical debt: Mehrere alte Branches und ein temporaerer, ueberholter Worktree sind noch registriert und duerfen nur nach separater Freigabe entfernt werden.

## Next Logical Step
1. Step: Den dokumentierten Branch-/Worktree-Cleanup separat freigeben und danach den Mess-/Datenschutzrahmen mit der zentralen Strategie klaeren.
   Why: Produkt- und Inhaltsstand sind live; die verbleibenden Risiken liegen jetzt in Governance, Messung und veralteten Git-Referenzen.
   Validation: Keine ueberholten Worktrees/Branches, Vercel-/GA4-Status dokumentiert, KPI/Owner/Aufbewahrung entschieden.
   Stop/continue rule: Keine neuen Tracking-Events, Ads oder Content-Cluster vor Freigabe von `GATE-005`.

## Do Not Build Yet
- Stripe/Premium-Listings
- Arbeitgeber-Dashboard
- Supabase-Jobboerse
- oeffentliches Stellen-Einreichformular fuer externe Arbeitgeber
- Admin-Moderation fuer fremde Anzeigen
- weitere Content-Cluster ohne Messziel
- KI-Auto-Moderation
- komplexe Filterlogik vor echter Jobdatenbasis
- GA4-Eventtracking oder neue Analytics ohne Gate
- Social-/Ads-Automation ohne Owner, Budget und Messplan

## Source Links
- Zentrale Arbeitgeberwahrheit: `../Logopädie/docs/strategy/EMPLOYER_TRUTH.md`
- Google Search Central JobPosting: https://developers.google.com/search/docs/appearance/structured-data/job-posting
- Produktionsseite: https://xn--logopdiejobs-kcb.de/
