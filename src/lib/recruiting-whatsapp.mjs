export const WHATSAPP_NUMBER = '4915510062296';
export const RECRUITING_PHONE_DISPLAY = '+49 155 10062296';
export const RECRUITING_PHONE_HREF = `tel:+${WHATSAPP_NUMBER}`;
export const RECRUITING_EMAIL = 'social@logopaedie-simsek.de';
export const RECRUITING_EMAIL_SUBJECT = 'Interesse an der Stelle in Duisburg';
export const RECRUITING_EMAIL_BODY =
  'Hallo,\n\nich interessiere mich für die Stelle als Logopäd:in / Sprachtherapeut:in in Duisburg und freue mich über eine Rückmeldung.\n\nViele Grüße';
export const RECRUITING_EMAIL_HREF =
  `mailto:${RECRUITING_EMAIL}?subject=${encodeURIComponent(RECRUITING_EMAIL_SUBJECT)}&body=${encodeURIComponent(RECRUITING_EMAIL_BODY)}`;
export const WHATSAPP_MESSAGE =
  'Hallo, ich interessiere mich für die Stelle als Logopäd:in / Sprachtherapeut:in in Duisburg.';
export const WHATSAPP_HREF =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
