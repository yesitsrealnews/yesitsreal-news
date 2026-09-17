# Desk beat — daily scan

Not a robot. When the desk runs a revue de presse, **read this file and
`src/lib/data/revue-search.ts` first**. Call `buildRevueSearchPlan(new Date())`
and run those queries (web_search + X). Prefer 2–4 clean pieces. If nothing
clean, publish nothing.

## Always
- Already published. Named URL. No invented quotes.
- Funny: bureaucracy, official idiocy, animal/tech/sports/romance fails, crime fails that do not punch down.
- NEVER: deaths, killings, war, disaster victims, minors, sexual crime, poverty, illness, Ponzi.
- **France-heavy.** Other geographies rotate. Do not hit the same three US local TV affiliates two days in a row.
- Cross-source when you can. Satire hosts stay out (`SATIRE_SITE_EXCLUDE`).

## Search base (do not improvise a smaller list)
The live lists live in `revue-search.ts`:
- `SITE_CLUSTERS` — PQR FR (always) + BE/CH/QC (always) + world clusters that **rotate**
- `QUERY_PACKS` — beats: animaux, voisin, municipal, travaux/bateau, vol-bizarre, OVNI, tribunal, fetish (adults), science
- Plan = France queries + `site:` chunks + 2 X `from:` newsroom queries, last 10 days

Also pull the RSS file du matin (`priorityFeeds()` in `rss-feeds.ts`) — insolite / faits-divers first.

## France (heavy — every run)
Ouest-France, Le Télégramme, Sud Ouest, Charente Libre, La Dépêche, Midi Libre, L’Indépendant, Le Progrès, Le Dauphiné, L’Est Républicain, DNA, L’Alsace, Vosges Matin, RL, Le Bien Public, La Voix du Nord, Nord Littoral, Courrier Picard, Paris-Normandie, Nice-Matin, Var-Matin, La Provence, Corse-Matin, Corse Net Infos, La Montagne, Le Populaire, Le Berry, L’Yonne, Journal du Centre, La Nouvelle République, L’Écho Républicain, La République du Centre, La Manche Libre, Tendance Ouest, Le Parisien, 20 Minutes, franceinfo / France 3, ICI-France Bleu, actu.fr, Maire-info, GEIPAN.
Commissariats / préfectures Facebook-X. PV de conseils municipaux.

## Belgique / Suisse / Québec (every run)
DH, Sudinfo, RTBF, L’Avenir, La Libre, Le Soir, HLN, Nieuwsblad, Brussels Times, BX1, 20 minutes CH, Tribune de Genève, 24 Heures, Blick, RTS, La Liberté, La Presse, Journal de Montréal, Le Devoir, Radio-Canada.

## Rotate (2–3 clusters per revue)
UK/IE · US locaux / odd desks · Iberia/PT · IT/DACH/NL · Nordiques · LatAm · Asie · Afrique/Maghreb · Aus/NZ · Science/institutions.

## Cover
Wikimedia Commons / CC / PD only. Credit in cover-credits.json. Do not steal news photos.
