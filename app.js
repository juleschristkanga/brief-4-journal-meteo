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
async function main( ) {

  ouvrirSaisie( );

  let releves = await chargerDonnees();

  let quitter = false;
  while (!quitter) {
    menu();
    const choix = await demander("Choisissez une option : ");
    switch (choix) {
      case '1':
        const nouveauReleve = await ajouterReleve(releves);
        if (nouveauReleve) {
          releves.push(nouveauReleve);
          await enregistrerJson(FICHIER_DONNEES, releves);
          console.log("Relevé ajouté avec succès.");
        }
  fermerSaisie();
        break;
      case '2':
        console.log(listerReleves(releves));
        break;
      case '3':
        const dateRecherche = await demander("Entrez la date (AAAA-MM-JJ) : ");
        const releveTrouve = trouverParDate(releves, dateRecherche);
        if (releveTrouve) {
          console.log(formaterReleve(releveTrouve));
        } else {
          console.log("Aucun relevé trouvé pour cette date.");
        }
        break;
      case '4':
        const joursPluvieuxList = joursPluvieux(releves, SEUIL_JOUR_PLUVIEUX);
        if (joursPluvieuxList.length > 0) {
          console.log("Jours pluvieux :");
          console.log(listerReleves(joursPluvieuxList));
        } else {
          console.log("Aucun jour pluvieux trouvé.");
        }
        break;
      case '5':
        const moyenneTemp = moyenneTemperature(releves);
        const cumulPluieTotal = cumulPluie(releves);
        const minMaxTemp = temperatureMinMax(releves);
        console.log(`Moyenne des températures : ${moyenneTemp !== null ? moyenneTemp + " °C" : "N/A"}`);
        console.log(`Cumul des pluies : ${cumulPluieTotal} mm`);
        if (minMaxTemp) {
          console.log(`Température minimale : ${minMaxTemp.min} °C`);
          console.log(`Température maximale : ${minMaxTemp.max} °C`);
        } else {
          console.log("Aucune donnée de température disponible.");
        }
        break;
      case '0':
        quitter = true;
        break;
      default:
        console.log("Option invalide. Veuillez réessayer.");
    }
   
  }
main().catch((error) => {
  console.error(`Erreur inattendue : ${error.message}`);
  fermerSaisie();
})
}
