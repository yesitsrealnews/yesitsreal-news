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


## Affiches de campagne (politiques)

**1ter** — quand un **politique nommé** est le sujet (ou un acteur central) du papier, chercher sa **dernière affiche de campagne** comme candidat cover avant le stock thématique générique.

Prefer when :

- official campaign material or Wikimedia Commons (PD/CC) of the latest campaign poster
- clear credit (party / campaign / photographer) + link to source page

Allowed :

- Commons PD/CC0/BY/BY-SA of campaign posters
- official campaign assets released for press use / public domain where stated

**Forbidden :**

- unpaid wire / agency photos of the politician without rights
- private social crops
- AI “fake poster”
- parody posters not used by the campaign

If rights are unclear → keep Commons thematic (place, institution, object). Tone flat: illustrate the public figure via their own campaign image, not a meme crop.

## Français — rédaction

**Le français n’est pas une traduction calquée de l’anglais.** Chaque papier FR doit être écrit comme un article de presse française : syntaxe correcte, accords, temps, ponctuation typographique française (« » ; espaces fines avant ; ? !), formulation idiomatique.

Interdit :
- anglicismes de structure (calques word-for-word)
- phrases qui « sonnent » EN en FR
- titres FR qui sont juste l’EN traduit mot à mot quand une tournure FR naturelle existe

Ordre conseillé : rédiger le FR pour le lecteur FR (souvent `originalLang: "fr"`), puis l’EN — ou réécrire le FR à part, jamais coller une gloss.

Ton flat YES IT’S REAL inchangé. Exactitude sourcée inchangée.

Ton flat YES IT'S REAL inchangé. Exactitude sourcée inchangée.

**Exception UK / Angleterre / faits britanniques :** en VF, monter d’un cran le moqueur (ironie française, piques sèches). Toujours vrai, sourcé, plat — pas de satire inventée, pas de grief, pas de mineurs.
