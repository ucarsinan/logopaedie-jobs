# Herkunftsrückbau v01 — lokal, 30.10.2026

Sinan beauftragt die Prüfung der offenen Punkte B27–B30 und lokale Vorbereitung der Entfernung personenbezogener Herkunftszuordnung. Keine Veröffentlichung, kein Commit/Push und keine Kontoänderung. Ausgangsstand fdd6127182b966d9a2e850924b73642e47a87f14.

Vier Runtime-Dateien: ApplicationContact.astro, bestehende Jobroute, application-form.mjs und application-mail.mjs. Beide hidden-quelle-Felder sowie UTM/fbclid/Referrer-/sessionStorage-Erfassung entfernt; Parser und Mail geben keine Quelle weiter. Einmaliges Legacy-Feld wird nur als Schlüssel erkannt und ignoriert; alte Clients können den Wert weiterhin im Request übertragen. Duplikate und andere unbekannte Felder bleiben gesperrt. Endpoint, Antwortfrist, Origin-Regeln, 8-KiB-Limit, Honeypot, Fehlerpfade und JSON-/No-JS-Verhalten bleiben erhalten. Keine neue Aggregatmessung, keine Löschung bestehender Mails oder Sessionwerte und keine Analyticsänderung.

Nachweise: erwartete TDD-Fehler zuerst 6/91, danach 91/91; gesamte Suite 151/151 und ./scripts/verify.sh mit Node22 bestanden. Typecheck nicht konfiguriert. Unabhängiger Review ohne handlungsrelevante Befunde. Beide lokalen Formulare mit synthetischen Kampagnenparametern ohne Herkunftsfeld, Schritt und Rückweg im Browser geprüft; kein Versand. Bestehende Datenschutz-/Impressumsentwürfe hashgleich erhalten.

Ausführlicher Nachweisbericht, Quellenmatrix, Manifest, tatsächliches Delta, Tests und Screenshots im zentralen Projekt: /Users/sinanucar/Development/Logopädie/reports/2026-10-30-datenschutz-herkunft-v01/BERICHT.md.

B27 lokal vorbereitet, produktiv offen. B28 wartet auf aktuelle Tarif-/Analytics-/Vertragsmetadaten; Vercel-/STRATO-Browser zunächst nur Anmeldung. B29 braucht Geräte-/Backup-/Löschumsetzung; bestehende Vorgaben bleiben anerkannt. B30: fachliche Aufsicht Duisburg öffentlich belegt, Emels individuelle Berufsangaben kommen separat. Infrastruktur und Analytics können weiterhin URL/Referrer verarbeiten. Vor einem eigenen späteren Release muss der Datenschutzhinweis konsistent abgeschlossen werden; dieser Bericht erteilt keine Freigabe.

Eine zusätzliche Prüfkopie wurde vom Speicher-Startschutz abgelehnt; keine Kopie angelegt, stattdessen bestehenden In-place-Build verwendet. Nichts installiert oder gelöscht. Bestehende Buildausgaben zur nächsten Durchsicht behalten; Bereinigung nur nach konkretem Auftrag.

Verwendete Skills: zielgerichtet-arbeiten; gdpr-data-handling; test-driven-development; verification-before-completion; dispatching-parallel-agents; vercel:deployments-cicd. Es wurde nichts gestaged, committed oder gepusht.
