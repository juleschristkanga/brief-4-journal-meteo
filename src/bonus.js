// BONUS — Pour aller plus loin. Facultatif : commencez seulement quand le socle est complet.
// Fiche : fiches/7-bonus.md · Vérifier : npm run test:bonus
// Pas de modèle pour ce fichier : à vous de combiner ce que vous avez appris.
import { trouverParId, verifierReleve } from './registre.js';

// Les champs qu'on a le droit de modifier. L'identifiant n'en fait pas partie.
export const CHAMPS_MODIFIABLES = ['date', 'temperatureC', 'pluieMm', 'humiditeAirPct'];

// Retire du journal le relevé qui a cet identifiant.
// Renvoie le relevé retiré, ou undefined s'il n'existe pas : le journal ne change pas.

export function supprimerReleve(releves, id) {
  const index = releves.findIndex((releve) => releve.id === id);
  if (index === -1) {
    return undefined;
  }
  const [releveSupprime] = releves.splice(index, 1);
  return releveSupprime;
}

// Modifie UN champ du relevé qui a cet identifiant. La nouvelle valeur arrive sous forme de TEXTE.
// Renvoie un tableau de messages d'erreur ; [] si la modification est faite.
// Vérifiez dans cet ordre et arrêtez-vous au premier problème : identifiant inconnu (une erreur)
// · champ 'id', non modifiable (une erreur) · champ absent de CHAMPS_MODIFIABLES (une erreur)
// · valeur refusée par les règles de l'ajout (leurs erreurs). En cas d'erreur, le relevé ne change pas.
// Exemple : modifierReleve(releves, 'M03', 'pluieMm', '11') → [] et M03 a maintenant 11 mm (un nombre).
//modifier Releve change la pluie de M03, convertie en nombre
//modifierReleve accepte une température décimale avec une virgule
export function modifierReleve(releves, id, champ, valeur) { 
  const releve = trouverParId(releves, id);
  if (!releve) {
    return [`Identifiant ${id} inconnu.`];
  }
  if (champ === 'id') {
    return ['Le champ id ne peut pas être modifié.'];
  }
  if (!CHAMPS_MODIFIABLES.includes(champ)) {
    return [`Champ ${champ} inconnu.`];
  }
  if (champ === 'temperatureC' || champ === 'pluieMm' || champ === 'humiditeAirPct') {
    valeur = valeur.replace(',', '.'); // Remplace la virgule par un point pour les nombres décimaux
    return verifierReleve({ ...releve, [champ]: valeur }, releves);
  }

  const saisie = { ...releve, [champ]: valeur };
  const erreurs = verifierReleve(saisie, releves);
  if (erreurs.length > 0) {
    return erreurs;
  }
  releve[champ] = champ === 'date' ? valeur : parseFloat(valeur.replace(',', '.'));
  return [];
}
//modifier le Releve, change la pluie de M03, convertie en nombre

// Renvoie une COPIE triée par température décroissante : la plus chaude d'abord.
export function trierParTemperatureDecroissante(releves) {
return [...releves].sort((a, b) => b.temperatureC - a.temperatureC);
}

// Renvoie le relevé dont la température est la plus haute (le premier en cas d'égalité),
// ou null si la liste est vide.
export function journeeLaPlusChaude(releves) {
  if (releves.length === 0) {
    
    return null;
  }
  return [...releves].sort((a, b) => b.temperatureC - a.temperatureC)[0];
}
