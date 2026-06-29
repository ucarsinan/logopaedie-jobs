# SECURITY.md

## Datenschutz und Sicherheit

Dieses Projekt kann Bewerbungs- und Kontaktdaten verarbeiten. Agenten behandeln alle personenbezogenen Daten als sensibel.

## Regeln

- Keine echten Bewerbungsdaten in Logs, Tests, Screenshots, Reports oder Prompts kopieren.
- Testdaten synthetisch halten.
- Service-Keys, Tokens und Env Vars nie ausgeben.
- Public- und Admin-Kontext sauber trennen.
- Admin-Routen duerfen nicht in Sitemap oder oeffentlicher Navigation landen, wenn sie nicht oeffentlich gedacht sind.
- Formularvalidierung serverseitig absichern.
- Datenschutz-/Consent-Texte nicht beiläufig veraendern.

## Sicherheitspruefung vor Abschluss

Vor Abschluss fragen:

1. Sind personenbezogene Daten betroffen?
2. Wurde ein Secret beruehrt oder ausgegeben?
3. Veraendert die Aenderung Admin-Zugriff, Formularannahme oder Datenbankzugriff?
4. Veraendert die Aenderung SEO-Indexierung oder Sitemap?
5. Sind Tests/Checks passend dokumentiert?
