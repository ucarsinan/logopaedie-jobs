# URL-Wahrheitstabelle Logopaediejobs

Datum: 2026-07-09

Zweck: Lokaler SEO-Contract fuer Phase 1 der Indexierungsreparatur.

Canonical host: `https://xn--logopdiejobs-kcb.de`

Regeln:

- Kanonische Zielseiten enden mit `/`.
- Unicode-, `www`-, `http`-, No-Slash- und Legacy-URLs sind Redirect- oder
  Alternate-Faelle.
- Redirect-Quellen gehoeren nicht in Sitemap oder interne Links.
- Legal-/Utility-Seiten bleiben aus der Sitemap und sind `noindex`.
- GSC-Produktionsaktionen bleiben separate Gates.

| url | typ | expected_status | expected_final_url | expected_canonical | in_sitemap | robots | internal_links_min | gsc_action |
|---|---|---:|---|---|---|---|---|---|
| `https://xn--logopdiejobs-kcb.de/` | `canonical_indexable` | 200 | `https://xn--logopdiejobs-kcb.de/` | `https://xn--logopdiejobs-kcb.de/` | ja | crawlbar, kein `noindex` | Navigation/Logo/Footer | beobachten |
| `http://xn--logopdiejobs-kcb.de/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/` | `https://xn--logopdiejobs-kcb.de/` | nein | n/a | 0 | keine |
| `https://www.xn--logopdiejobs-kcb.de/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/` | `https://xn--logopdiejobs-kcb.de/` | nein | n/a | 0 | keine |
| `https://logopaediejobs.de/` | `alternate_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/` | `https://xn--logopdiejobs-kcb.de/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/index.html` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/` | `https://xn--logopdiejobs-kcb.de/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/jobs/` | `canonical_indexable` | 200 | `https://xn--logopdiejobs-kcb.de/jobs/` | `https://xn--logopdiejobs-kcb.de/jobs/` | ja | crawlbar, kein `noindex` | Navigation + Footer + Hub | Indexierung beantragen nach Deploy-Gate |
| `https://xn--logopdiejobs-kcb.de/jobs` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/jobs/` | `https://xn--logopdiejobs-kcb.de/jobs/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | `canonical_indexable` | 200 | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | ja | crawlbar, kein `noindex` | Navigation CTA + Jobs-Hub + Artikel-CTA | Indexierung beantragen nach Deploy-Gate |
| `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/jobs/neu/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/jobs/neu` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/` | `canonical_indexable` | 200 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/` | `https://xn--logopdiejobs-kcb.de/berufshandbuch/` | ja | crawlbar, kein `noindex` | Navigation + Footer + Artikel | Indexierung beantragen nach Deploy-Gate |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/` | `https://xn--logopdiejobs-kcb.de/berufshandbuch/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/gehaltsrechner/` | `canonical_indexable` | 200 | `https://xn--logopdiejobs-kcb.de/gehaltsrechner/` | `https://xn--logopdiejobs-kcb.de/gehaltsrechner/` | ja | crawlbar, kein `noindex` | Navigation + Footer + Artikel | beobachten |
| `https://xn--logopdiejobs-kcb.de/gehaltsrechner` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/gehaltsrechner/` | `https://xn--logopdiejobs-kcb.de/gehaltsrechner/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/arbeiten-duisburg/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Jobs-Hub + Related | Indexierung beantragen nach Deploy-Gate |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/ausbildung-nrw-2026/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Berufshandbuch + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/bewerbung-logopaedie-tipps/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Berufshandbuch + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/deutsch-tuerkische-logopaedie-duisburg/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Berufshandbuch + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/freie-praxis-oder-klinik-logopaedie/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Jobdetail + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/logopaedie-bewerbung-ohne-anschreiben/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Jobdetail + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/logopaedin-duisburg-gesucht/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Jobs-Hub + Jobdetail | Indexierung beantragen nach Deploy-Gate |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/willkommen/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Berufshandbuch + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/gehalt-logopaedie-nrw/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Jobs-Hub + Jobdetail + Gehaltsrechner | Indexierung beantragen nach Deploy-Gate |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/4-tage-woche-logopaedie/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Jobs-Hub + Jobdetail | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/bilinguale-sprachtherapie/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Berufshandbuch + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/stottertherapie-spezialisierung/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Berufshandbuch + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/berufshandbuch/teilzeit-modelle/` | `canonical_indexable` | 200 | self | self | ja | crawlbar, kein `noindex` | Berufshandbuch + Related | beobachten |
| `https://xn--logopdiejobs-kcb.de/ratgeber/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/` | `https://xn--logopdiejobs-kcb.de/berufshandbuch/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/ratgeber/gehalt-logopaedie-nrw/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/gehalt-logopaedie-nrw/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/ratgeber/bewerbung-logopaedie-tipps/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/bewerbung-logopaedie-tipps/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/ratgeber/stottertherapie-spezialisierung/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/stottertherapie-spezialisierung/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/ratgeber/teilzeit-modelle/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/teilzeit-modelle/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/ratgeber/deutsch-tuerkische-logopaedie-duisburg/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/deutsch-tuerkische-logopaedie-duisburg/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/gehalt/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/gehalt-logopaedie-nrw/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/4-tage-woche/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/4-tage-woche-logopaedie/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/bilingual/` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/berufshandbuch/bilinguale-sprachtherapie/` | target | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/datenschutz/` | `noindex_utility` | 200 | self | self | nein | `noindex, nofollow` | Footer only | keine |
| `https://xn--logopdiejobs-kcb.de/datenschutz` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/datenschutz/` | `https://xn--logopdiejobs-kcb.de/datenschutz/` | nein | n/a | 0 | keine |
| `https://xn--logopdiejobs-kcb.de/impressum/` | `noindex_utility` | 200 | self | self | nein | `noindex, nofollow` | Footer only | keine |
| `https://xn--logopdiejobs-kcb.de/impressum` | `redirect_expected` | 301/308 | `https://xn--logopdiejobs-kcb.de/impressum/` | `https://xn--logopdiejobs-kcb.de/impressum/` | nein | n/a | 0 | keine |

## GSC-Prioritaet nach Deploy-Gate

1. `/jobs/logopaedin-sprachtherapeut-duisburg/`
2. `/jobs/`
3. `/`
4. `/berufshandbuch/`
5. `/berufshandbuch/logopaedin-duisburg-gesucht/`
6. `/berufshandbuch/gehalt-logopaedie-nrw/`
7. `/gehaltsrechner/`
8. `/berufshandbuch/4-tage-woche-logopaedie/`

Nicht einreichen: Redirectquellen, `/jobs/neu/`, alte `/ratgeber/*`-URLs,
Legal-Seiten und Admin-/Utility-Pfade.
