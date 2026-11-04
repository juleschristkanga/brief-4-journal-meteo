# Dictionnaire des données

> Un champ par ligne, d'après `SUJET.md` et le fichier de `donnees/`. La première ligne sert de modèle.

| Champ | Signification | Type | Règle de validation | Unité | Exemple |
| --- | --- | --- | --- | --- | --- |
| `id` | Identifiant unique | texte | non vide, absent des données | — | M08 |
| date |date du relevé |texte |format AAAA-MM-JJ, date valide | — | 2026-10-22|
| temperatureC |Température du jour | nombre| nombre valide , négatif/décimal possible| °C| 26|
| pluieMm |La Pluie en mm |nombre | >=|mm |15 |
| humiditeAirPct |Humidité relative de l'air en % | nombre| entre 0 et 100|% |85 |

**Listes de valeurs autorisées** : Aucune liste fermée de valeurs.
Plages autorisées : temperatureC ( négatif , nul ou décimal accepté) ; pluieMn (nombre >= 0) ; humiditeAirPct ( nombre entre 0 et 100 , bornes comprises); date ( date existant au format AAAA-MM-JJ) ; id( text non vide , unique)

 **Sources** : SUJET.md, donnees/releves.json, fiche station
