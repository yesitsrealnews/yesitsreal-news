# Cambuse — consignes

## Photo, chaque papier

**Aucun article ne sort sans image.** Interdit : dégradé « TRUE », blob SVG, visuel IA par défaut, stock flou hors sujet.

Ordre obligatoire :

1. **Wikimedia Commons** (PD, CC0, CC BY, CC BY-SA). Sujet réel du papier (animal, lieu, objet, personne si photo Commons existante).
2. Même règle Unsplash / Pexels **uniquement** si Commons n’a rien de tenable. Crédit + licence.
3. **Imagine, à la limite** — dernier recours, si rien de libre n’illustre. Pas de visages de personnes vivantes inventés. Pas de fausse une photojournalistique. Style photo, pas cartoon.

Fichiers : `public/covers/{id}.jpg` + entrée `src/lib/cover-credits.json` (artist, license, page). Crédit affiché sur l’image.

Script : `python3 scripts/fetch-covers.py`

Sans jpg + crédit → **on ne pousse pas**.
