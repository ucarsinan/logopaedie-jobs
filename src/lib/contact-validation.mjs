// Shared by browser and server. Plausibility checks do not prove identity or reachability.
export function normalizeContactValue(value) {
  return String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
}

export function isContactEmail(value) {
  if (value.length > 160 || /\s/.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  if (!/^[\p{L}\p{N}!#$%&'*+\-/=?^_`{|}~.]+$/u.test(local)) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && labels.every(label => label.length <= 63 && /^[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?$/u.test(label))
    && /^[\p{L}]{2,}$/u.test(labels.at(-1));
}

function isContactPhone(value) {
  if (!/^\+?[\d\s()./\-‐‑‒–—−]+$/u.test(value)) return false;
  let depth = 0;
  for (const char of value) {
    if (char === '(' && ++depth > 1) return false;
    if (char === ')' && --depth < 0) return false;
  }
  if (depth || /\(\s*\)/.test(value)) return false;
  const international = value.startsWith('+') || value.startsWith('00');
  let digits = (international ? value.replace(/\(0\)/g, '') : value).replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  // Common international notation +49 (0)203 is accepted without counting the optional trunk zero.
  return digits.length >= 6 && digits.length <= 15 && !/^(\d)\1+$/.test(digits);
}

export function contactFieldError(field, rawValue) {
  const value = normalizeContactValue(rawValue);
  if (field === 'name') {
    if (!value) return 'Bitte gib deinen Namen an.';
    if (value.length > 100) return 'Bitte beschränke deinen Namen auf 100 Zeichen.';
    if (!/\p{L}/u.test(value) || !/^[\p{L}\p{M}\s.'’ʼ\-‐‑–·]+$/u.test(value)) return 'Bitte gib deinen Namen ohne Ziffern oder andere Sonderzeichen an. Bindestriche und Apostrophe sind möglich.';
  }
  if (field === 'kontakt') {
    if (!value) return 'Bitte gib eine Telefonnummer oder E-Mail-Adresse an.';
    if (value.length > 160) return 'Bitte beschränke die Kontaktangabe auf 160 Zeichen.';
    if (value.includes('@')) {
      if (!isContactEmail(value)) return 'Bitte prüfe die E-Mail-Adresse, zum Beispiel name@beispiel.de.';
    } else if (!isContactPhone(value)) return 'Bitte gib eine vollständige Telefonnummer mit Vorwahl oder eine E-Mail-Adresse an.';
  }
  if (field === 'nachricht' && String(rawValue ?? '').length > 1500) return 'Deine Nachricht darf höchstens 1.500 Zeichen enthalten.';
  return '';
}
