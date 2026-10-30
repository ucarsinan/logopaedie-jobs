// Reine Umrechnung eigener Vertragsdaten, keine Markt- oder Tarifprognose.
export interface RechnerInput {
  stundenlohn: number;
  wochenstunden: number;
  sonderzahlungJahr: number;
  arbeitgeberbeitragJahr: number;
}

export interface RechnerErgebnis {
  bruttoMonat: number;
  bruttoJahr: number;
  bruttoJahrMitSonderzahlung: number;
  arbeitgeberbeitragJahr: number;
}

export function berechneGehalt(input: RechnerInput): RechnerErgebnis {
  for (const key of ['stundenlohn', 'wochenstunden', 'sonderzahlungJahr', 'arbeitgeberbeitragJahr'] as const) {
    const value = input[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 ||
        ((key === 'stundenlohn' || key === 'wochenstunden') && value === 0)) {
      throw new RangeError('Bitte gültige positive Lohn- und Stundenwerte sowie nichtnegative Jahresbeträge eingeben.');
    }
  }
  const jahr = input.stundenlohn * input.wochenstunden * 52;
  const mitSonderzahlung = jahr + input.sonderzahlungJahr;
  if (![jahr, mitSonderzahlung].every(Number.isFinite)) {
    throw new RangeError('Die eingegebenen Beträge sind zu groß.');
  }
  const bruttoMonat = Math.round((jahr / 12) * 100) / 100;
  const bruttoJahr = Math.round(jahr * 100) / 100;
  const bruttoJahrMitSonderzahlung = Math.round(mitSonderzahlung * 100) / 100;
  if (![bruttoMonat, bruttoJahr, bruttoJahrMitSonderzahlung].every(value => Number.isFinite(value) && value > 0)) {
    throw new RangeError('Die eingegebenen Beträge sind für eine Berechnung auf Cent zu groß oder zu klein.');
  }
  return {
    bruttoMonat,
    bruttoJahr,
    bruttoJahrMitSonderzahlung,
    arbeitgeberbeitragJahr: input.arbeitgeberbeitragJahr,
  };
}
