# YES IT'S REAL — consignes projet

## Mise en ligne (obligatoire, à chaque tour)

Chaque demande de mise à jour, correction ou nouvelle fonction **doit aussi
être publiée sur le site en ligne** [https://www.yesitsreal.news](https://www.yesitsreal.news).

L’aperçu sandbox n’est pas le site. **yesitsreal.news est le site.**

`git push` vers GitHub **ne suffit pas** : l’intégration Vercel ne promeut
pas toujours `main` en production. Après un commit produit :

1. `git add` / `git commit` sur `main` (message court, ton desk)
2. `git push origin main`
3. `vercel --prod --yes` depuis `/workspace` (projet `yesitsreal-news`)
4. Vérifier le HTML de **https://www.yesitsreal.news** (logo NEWS, nav, thème)
   — pas seulement l’alias `*.vercel.app` ni l’aperçu
5. Dire à l’éditeur que c’est **en ligne**, avec ce qui a changé

Ne jamais clore un tour « c’est fait » si la prod n’a pas reçu le commit.
