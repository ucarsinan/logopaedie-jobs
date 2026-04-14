// src/lib/gehalt-daten.ts
// Datengrundlage für den Logopädie-Gehaltsrechner NRW 2026
//
// Quellen:
// - Bundesagentur für Arbeit, Entgeltatlas (Berufsgruppe 81724 – Logopädie), Stand 2025
// - jobvector Gehaltsreport Logopädie 2025
// - StepStone Gehaltsreport Gesundheitswesen 2025
// - dbl-Praxisumfrage 2024/2025 zu Gehältern in freien Praxen
// - TVöD-VKA Entgeltgruppe 9a (für Klinik-Setting als Referenz)
//
// Methodik:
// Basiswert = NRW-Median für staatl. anerkannte Logopädin in freier Praxis, Vollzeit (38,5h),
// nach Berufserfahrungsstufe. Setting, Qualifikation, Spezialisierung, Region und
// Arbeitszeit werden als multiplikative Modifikatoren angewendet.
// Zusatzleistungen werden separat als geldwerter Vorteil ausgewiesen.
//
// Die ausgegebene Spanne (min/max) spiegelt die reale Streuung der Daten (±8%) wider.
// Einzelne Arbeitgeber können darüber oder darunter liegen.

export type BerufsjahreStufe = '0' | '1-2' | '3-5' | '6-10' | '10+';
export type Setting = 'praxis' | 'klinik' | 'uniklinik' | 'fruehfoerderung' | 'schule';
export type Qualifikation = 'staatlich' | 'bachelor' | 'master';
export type Spezialisierung = 'paediatrie' | 'neurologie' | 'stottern' | 'bilingual' | 'keine';
export type Arbeitszeit = 'vollzeit' | 'vier-tage' | 'teilzeit-30' | 'teilzeit-20';
export type Region =
  | 'duesseldorf-koeln'
  | 'ruhrgebiet'
  | 'muenster-aachen'
  | 'ostwestfalen'
  | 'laendlich';

// Basis-Bruttomonatsgehalt (Vollzeit 38,5h, Praxis, staatl. anerkannt, NRW-Median)
const basisGehalt: Record<BerufsjahreStufe, number> = {
  '0': 2850,
  '1-2': 3050,
  '3-5': 3400,
  '6-10': 3700,
  '10+': 4000,
};

const settingFaktor: Record<Setting, { faktor: number; label: string }> = {
  praxis: { faktor: 1.00, label: 'Freie Praxis' },
  klinik: { faktor: 1.08, label: 'Klinik / Reha (TVöD)' },
  uniklinik: { faktor: 1.12, label: 'Universitätsklinik' },
  fruehfoerderung: { faktor: 0.95, label: 'Frühförderstelle' },
  schule: { faktor: 0.97, label: 'Schule / Integration' },
};

const qualifikationFaktor: Record<Qualifikation, { faktor: number; label: string }> = {
  staatlich: { faktor: 1.00, label: 'Staatlich anerkannt' },
  bachelor: { faktor: 1.05, label: 'Bachelor Logopädie / Sprachtherapie' },
  master: { faktor: 1.10, label: 'Master Logopädie / Sprachtherapie' },
};

const spezialisierungFaktor: Record<Spezialisierung, { faktor: number; label: string }> = {
  keine: { faktor: 1.00, label: 'Keine / allgemein' },
  paediatrie: { faktor: 1.00, label: 'Pädiatrie' },
  neurologie: { faktor: 1.04, label: 'Neurologie (Aphasie, Dysphagie)' },
  stottern: { faktor: 1.05, label: 'Stottertherapie / Poltern' },
  bilingual: { faktor: 1.03, label: 'Bilinguale Kompetenz' },
};

const arbeitszeitFaktor: Record<Arbeitszeit, { faktor: number; label: string; stunden: number }> = {
  vollzeit: { faktor: 1.00, label: 'Vollzeit (38,5h)', stunden: 38.5 },
  'vier-tage': { faktor: 0.83, label: '4-Tage-Woche (32h)', stunden: 32 },
  'teilzeit-30': { faktor: 0.78, label: 'Teilzeit (30h)', stunden: 30 },
  'teilzeit-20': { faktor: 0.52, label: 'Teilzeit (20h)', stunden: 20 },
};

const regionFaktor: Record<Region, { faktor: number; label: string }> = {
  'duesseldorf-koeln': { faktor: 1.02, label: 'Düsseldorf / Köln / Bonn' },
  ruhrgebiet: { faktor: 1.01, label: 'Ruhrgebiet (Duisburg, Essen, Dortmund, Bochum)' },
  'muenster-aachen': { faktor: 1.00, label: 'Münster / Aachen' },
  ostwestfalen: { faktor: 0.98, label: 'Ostwestfalen-Lippe (Bielefeld, Paderborn)' },
  laendlich: { faktor: 0.96, label: 'Ländliche Regionen NRW' },
};

// Geldwerte Vorteile (Jahresbasis in Euro)
export type Zusatzleistung = 'fortbildung' | 'altersvorsorge' | 'fahrtkosten' | 'jobrad';
const zusatzWert: Record<Zusatzleistung, { wert: number; label: string }> = {
  fortbildung: { wert: 2000, label: '100 % Fortbildungsübernahme' },
  altersvorsorge: { wert: 1200, label: 'Betriebliche Altersvorsorge' },
  fahrtkosten: { wert: 900, label: 'Fahrtkostenzuschuss / Deutschland-Ticket' },
  jobrad: { wert: 600, label: 'JobRad / Dienstrad' },
};

export interface RechnerInput {
  berufsjahre: BerufsjahreStufe;
  setting: Setting;
  qualifikation: Qualifikation;
  spezialisierung: Spezialisierung;
  arbeitszeit: Arbeitszeit;
  region: Region;
  zusatzleistungen: Zusatzleistung[];
}

export interface RechnerErgebnis {
  bruttoMonatMin: number;
  bruttoMonatMittel: number;
  bruttoMonatMax: number;
  bruttoJahr: number;
  zusatzJahrWert: number;
  gesamtpaketJahr: number;
  nrwDurchschnittVergleich: number; // +/- in Prozent
  erklaerung: {
    basis: number;
    setting: string;
    qualifikation: string;
    spezialisierung: string;
    region: string;
    arbeitszeit: string;
    stunden: number;
  };
}

const NRW_DURCHSCHNITT_JAHR = 45850; // NRW-Median Logopädie Vollzeit laut jobvector/Entgeltatlas 2025

export function berechneGehalt(input: RechnerInput): RechnerErgebnis {
  const basis = basisGehalt[input.berufsjahre];
  const setting = settingFaktor[input.setting];
  const qualifikation = qualifikationFaktor[input.qualifikation];
  const spezialisierung = spezialisierungFaktor[input.spezialisierung];
  const arbeitszeit = arbeitszeitFaktor[input.arbeitszeit];
  const region = regionFaktor[input.region];

  const mittel =
    basis *
    setting.faktor *
    qualifikation.faktor *
    spezialisierung.faktor *
    arbeitszeit.faktor *
    region.faktor;

  const min = Math.round((mittel * 0.92) / 10) * 10;
  const max = Math.round((mittel * 1.08) / 10) * 10;
  const mittelGerundet = Math.round(mittel / 10) * 10;
  const jahr = mittelGerundet * 12;

  const zusatzWertJahr = input.zusatzleistungen.reduce(
    (sum, z) => sum + zusatzWert[z].wert,
    0
  );
  const gesamtpaket = jahr + zusatzWertJahr;

  // Vergleich zum NRW-Schnitt: normalisieren wir den eigenen Wert auf Vollzeit-Äquivalent
  const eigenesJahrVollzeitAequivalent = (mittelGerundet / arbeitszeit.faktor) * 12;
  const vergleich = Math.round(
    ((eigenesJahrVollzeitAequivalent - NRW_DURCHSCHNITT_JAHR) / NRW_DURCHSCHNITT_JAHR) * 100
  );

  return {
    bruttoMonatMin: min,
    bruttoMonatMittel: mittelGerundet,
    bruttoMonatMax: max,
    bruttoJahr: jahr,
    zusatzJahrWert: zusatzWertJahr,
    gesamtpaketJahr: gesamtpaket,
    nrwDurchschnittVergleich: vergleich,
    erklaerung: {
      basis,
      setting: setting.label,
      qualifikation: qualifikation.label,
      spezialisierung: spezialisierung.label,
      region: region.label,
      arbeitszeit: arbeitszeit.label,
      stunden: arbeitszeit.stunden,
    },
  };
}

export const optionen = {
  berufsjahre: [
    { value: '0', label: 'Berufsanfänger (0 Jahre)' },
    { value: '1-2', label: '1–2 Jahre' },
    { value: '3-5', label: '3–5 Jahre' },
    { value: '6-10', label: '6–10 Jahre' },
    { value: '10+', label: 'Mehr als 10 Jahre' },
  ],
  setting: Object.entries(settingFaktor).map(([value, { label }]) => ({ value, label })),
  qualifikation: Object.entries(qualifikationFaktor).map(([value, { label }]) => ({ value, label })),
  spezialisierung: Object.entries(spezialisierungFaktor).map(([value, { label }]) => ({ value, label })),
  arbeitszeit: Object.entries(arbeitszeitFaktor).map(([value, { label }]) => ({ value, label })),
  region: Object.entries(regionFaktor).map(([value, { label }]) => ({ value, label })),
  zusatzleistungen: Object.entries(zusatzWert).map(([value, { label, wert }]) => ({
    value,
    label,
    wert,
  })),
};

export const NRW_DURCHSCHNITT = NRW_DURCHSCHNITT_JAHR;
