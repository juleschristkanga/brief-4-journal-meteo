// Journal météorologique de la ferme — point d'entrée : le menu.
// À vous d'écrire tout le menu : accueil, chargement des données, menu affiché avant chaque choix,
// actions, sortie et gestion des erreurs. Comportement et textes imposés : fiches/3-ajouter-lister.md.
// Lancer : node app.js
import { demander, fermerSaisie, ouvrirSaisie } from './src/saisie.js';
import { chargerJson, enregistrerJson } from './src/stockage.js';
import { ajouterReleve, formaterReleve, listerReleves, trouverParId } from './src/registre.js';
import { SEUIL_JOUR_PLUVIEUX, joursPluvieux, trierParPluie, trierParTemperature, trouverParDate } from './src/recherche.js';
import { cumulPluie, moyenneTemperature, temperatureMinMax } from './src/synthese.js';

const FICHIER_DONNEES = 'donnees/releves.json';
function menu() {
  console.log("=== Journal météorologique de la ferme ===");
  console.log("1. Ajouter un relevé");
  console.log("2. Lister les relevés");
  console.log("3. Rechercher par date");
  console.log("4. Afficher les jours pluvieux");
  console.log("5. Afficher les statistiques");
  console.log("0. Quitter");
}
async function chargerDonnees() {
  try {
    return await chargerJson(FICHIER_DONNEES);
  } catch (error) {
    console.error(`Erreur lors du chargement des données : ${error.message}`);
    return [];
  }
}
async function main() {

  ouvrirSaisie( );

  console.log("À compléter : écrivez le menu dans app.js (fiches/3-ajouter-lister.md).");
  fermerSaisie();
}

main();
