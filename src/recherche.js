// Rechercher et trier les relevés.
// Fiche : fiches/4-rechercher-trier.md · Vérifier : npm run test:recherche

// Seuil d'exercice pour compter une « journée pluvieuse », en mm.
// Ce n'est pas un seuil d'alerte : il ne prévoit ni inondation ni stress hydrique.
export const SEUIL_JOUR_PLUVIEUX = 10;

// Renvoie le premier relevé fait à cette date (texte AAAA-MM-JJ), ou undefined s'il n'y en a pas.
export function trouverParDate(releves, dateStr) {
  // Vérification du format strict AAAA-MM-JJ
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;

  // Extraction et conversion en nombres
  const [_, annee, mois, jour] = match.map(Number);

  // Validation de l'existence réelle de la date (les mois commencent à 0 en JS)
  const objetDate = new Date(annee, mois - 1, jour);
  const dateExiste = 
    objetDate.getFullYear() === annee &&
    objetDate.getMonth() === mois - 1 &&
    objetDate.getDate() === jour;

  if (!dateExiste) return undefined;

  // Recherche dans les relevés
  return releves.find((releve) => releve.date === dateStr);
}


// Renvoie un NOUVEAU tableau avec les relevés dont la pluie est SUPÉRIEURE OU ÉGALE au seuil (en mm).
export function joursPluvieux(releves, seuil) {
  
  return releves.filter((releve) => releve.pluieMm >= seuil); //tableau de relevés filtré pour ne garder que ceux dont la pluie est supérieure ou égale au seuil

}

// Renvoie une COPIE triée par température croissante, avec un comparateur numérique.
// Deux relevés égaux gardent leur ordre d'origine. Le tableau reçu ne doit pas changer d'ordre.
export function trierParTemperature(releves) {
  return [...releves].sort((a, b) => a.temperatureC - b.temperatureC); //copie du tableau de relevés triée par température croissante
}

// Renvoie une COPIE triée par pluie croissante, avec un comparateur numérique.
// Deux relevés égaux gardent leur ordre d'origine. Le tableau reçu ne doit pas changer d'ordre.
export function trierParPluie(releves) {
  throw new Error('TODO : coder trierParPluie dans src/recherche.js');
}
