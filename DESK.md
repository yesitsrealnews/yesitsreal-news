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

## Mugshots / photos d’identité judiciaire

**1bis** — quand le papier est courts / faits-divers et que le sujet réel est l’accusé nommé, une mugshot officielle **droits clairs** peut remplacer la cover thématique Commons. Sinon garder Commons thématique.

Prefer when :

- the accused is named in public charging docs **AND**
- a booking photo is released as **public record** by police/jail, **OR** is already on Wikimedia Commons (PD/CC).

Allowed licenses/labels :

- PD, CC0 / CC BY / CC BY-SA, or « Public record » from a named agency (e.g. MDCR, county sheriff)
- Always credit agency + link to the record/page used

**Forbidden :**

- minors
- photos from private social media
- AI faces
- cropped sensational tabloid composites without clear rights
- paywalled agency wire photos we don’t have rights to

Placement : use as `public/covers/{id}.jpg` like any cover; do not invent a second gallery system.

Tone : flat illustration of the public record, not mockery crop.

Keep existing Commons-first order; mugshot sits as **1bis** only when rights are clear and the person is the real subject of the paper.
