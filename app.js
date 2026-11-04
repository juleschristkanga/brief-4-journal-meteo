// Journal météorologique de la ferme — point d'entrée : le menu.
// À vous d'écrire tout le menu : accueil, chargement des données, menu affiché avant chaque choix,
// actions, sortie et gestion des erreurs. Comportement et textes imposés : fiches/3-ajouter-lister.md.
// Lancer : node app.js
import { demander, fermerSaisie, ouvrirSaisie } from './src/saisie.js';
import { chargerJson, enregistrerJson } from './src/stockage.js';
import { ajouterReleve, formaterReleve, listerReleves, trouverParId } from './src/registre.js';
import { SEUIL_JOUR_PLUVIEUX, joursPluvieux, trierParPluie, trierParTemperature, trouverParDate } from './src/recherche.js';
import { cumulPluie, moyenneTemperature, temperatureMinMax } from './src/synthese.js';
import {
  journeeLaPlusChaude,
  modifierReleve,
  supprimerReleve,
  trierParTemperatureDecroissante,
} from './src/bonus.js';

const FICHIER_DONNEES = 'donnees/releves.json';

function afficherMenu() {
  console.log(`
--------------------- MENU ---------------------
1. Ajouter un relevé
2. Lister les relevés
3. Rechercher (identifiant, date, journées pluvieuses)
4. Trier (température, pluie)
5. Synthèse de la série
6. Supprimer un relevé
7. Modifier un relevé
0. Quitter`);
}

async function ajouter(releves) {
  console.log('--- Ajouter un relevé ---');
  const id = await demander('Identifiant (ex. M11) : ');
  if (id === null) return false;
  const date = await demander('Date du relevé (AAAA-MM-JJ) : ');
  if (date === null) return false;
  const temperatureC = await demander('Température en °C : ');
  if (temperatureC === null) return false;
  const pluieMm = await demander('Pluie en mm : ');
  if (pluieMm === null) return false;
  const humiditeAirPct = await demander("Humidité relative de l'air en % : ");
  if (humiditeAirPct === null) return false;

  const saisie = { id: id.toUpperCase(), date, temperatureC, pluieMm, humiditeAirPct };
  const erreurs = ajouterReleve(releves, saisie);
  if (erreurs.length > 0) {
    console.log('Relevé refusé :');
    erreurs.forEach((erreur) => console.log(`  - ${erreur}`));
    console.log(`Le journal compte toujours ${releves.length} relevé(s).`);
    return true;
  }
  try {
    await enregistrerJson(FICHIER_DONNEES, releves);
  } catch (erreur) {
    releves.pop();
    throw erreur;
  }
  console.log(`Relevé ${saisie.id} ajouté. Le journal compte ${releves.length} relevé(s).`);
  return true;
}

function lister(releves) {
  console.log(`--- Liste des relevés (${releves.length}) ---`);
  console.log(listerReleves(releves));
}

async function rechercher(releves) {
  console.log('--- Rechercher ---');
  console.log('1. Par identifiant');
  console.log('2. Par date');
  console.log(`3. Les journées pluvieuses (au moins ${SEUIL_JOUR_PLUVIEUX} mm)`);
  const choix = await demander('Votre choix : ');
  if (choix === null) return false;

  if (choix === '1') {
    const id = await demander('Identifiant : ');
    if (id === null) return false;
    const identifiant = id.toUpperCase();
    const releve = trouverParId(releves, identifiant);
    console.log(releve ? formaterReleve(releve) : `Relevé ${identifiant} introuvable.`);
  } else if (choix === '2') {
    const date = await demander('Date (AAAA-MM-JJ) : ');
    if (date === null) return false;
    const releve = trouverParDate(releves, date);
    console.log(releve ? formaterReleve(releve) : `Relevé du ${date} introuvable.`);
  } else if (choix === '3') {
    const jours = joursPluvieux(releves, SEUIL_JOUR_PLUVIEUX);
    console.log(`${jours.length} journée(s) avec au moins ${SEUIL_JOUR_PLUVIEUX} mm de pluie :`);
    console.log(listerReleves(jours));
  } else {
    console.log('Choix inconnu : retour au menu.');
  }
  return true;
}

async function trier(releves) {
  console.log('--- Trier ---');
  console.log('1. Par température croissante');
  console.log('2. Par pluie croissante');
  console.log('3. Par température décroissante');
  const choix = await demander('Votre choix : ');
  if (choix === null) return false;

  let resultat;
  if (choix === '1') {
    resultat = trierParTemperature(releves);
  } else if (choix === '2') {
    resultat = trierParPluie(releves);
  } else if (choix === '3') {
    resultat = trierParTemperatureDecroissante(releves);
  } else {
    console.log('Choix inconnu : retour au menu.');
    return true;
  }
  console.log(listerReleves(resultat));
  return true;
}

function afficherSynthese(releves) {
  const moyenne = moyenneTemperature(releves);
  const minMax = temperatureMinMax(releves);
  const jours = joursPluvieux(releves, SEUIL_JOUR_PLUVIEUX);
  console.log('--- Synthèse de la série ---');
  console.log(`Nombre de relevés : ${releves.length}`);
  console.log(`Température moyenne : ${moyenne === null ? 'aucune donnée' : `${moyenne} °C`}`);
  if (minMax === null) {
    console.log('Températures minimale et maximale : aucune donnée');
  } else {
    console.log(`Température minimale : ${minMax.min} °C · maximale : ${minMax.max} °C`);
  }
  console.log(`Cumul de pluie : ${cumulPluie(releves)} mm`);
  console.log(`Journées avec au moins ${SEUIL_JOUR_PLUVIEUX} mm de pluie : ${jours.length}`);
  const plusChaude = journeeLaPlusChaude(releves);
  console.log(`Journée la plus chaude : ${plusChaude ? formaterReleve(plusChaude) : 'aucune donnée'}`);
  console.log('Rappels :');
  console.log('  - Quelques jours de relevés forment une courte série météo : ils ne décrivent pas le climat de la région.');
  console.log('  - Le seuil de 10 mm est une catégorie d’exercice : il ne prévoit ni inondation ni stress hydrique.');
  console.log("  - L'humidité relative de l'air (en %) n'est pas l'humidité du sol.");
}

async function sauvegarderOuAnnuler(releves, avant) {
  try {
    await enregistrerJson(FICHIER_DONNEES, releves);
  } catch (erreur) {
    releves.splice(0, releves.length, ...avant);
    throw erreur;
  }
}

async function supprimer(releves) {
  const id = await demander('Identifiant : ');
  if (id === null) return false;
  const identifiant = id.toUpperCase();
  const avant = releves.map((releve) => ({ ...releve }));
  const supprime = supprimerReleve(releves, identifiant);
  if (!supprime) {
    console.log(`Relevé ${identifiant} introuvable.`);
    return true;
  }
  await sauvegarderOuAnnuler(releves, avant);
  console.log(`Relevé ${identifiant} supprimé. Le journal compte ${releves.length} relevé(s).`);
  return true;
}

async function modifier(releves) {
  const id = await demander('Identifiant : ');
  if (id === null) return false;
  const champ = await demander('Champ à modifier (date, temperatureC, pluieMm, humiditeAirPct) : ');
  if (champ === null) return false;
  const valeur = await demander('Nouvelle valeur : ');
  if (valeur === null) return false;

  const identifiant = id.toUpperCase();
  const avant = releves.map((releve) => ({ ...releve }));
  const erreurs = modifierReleve(releves, identifiant, champ, valeur);
  if (erreurs.length > 0) {
    console.log('Modification refusée :');
    erreurs.forEach((erreur) => console.log(`  - ${erreur}`));
    return true;
  }
  await sauvegarderOuAnnuler(releves, avant);
  console.log(`Relevé ${identifiant} modifié.`);
  return true;
}

async function main() {
  ouvrirSaisie();
  console.log('==================================================');
  console.log('   JOURNAL MÉTÉOROLOGIQUE DE LA FERME');
  console.log('   Suivi agroclimatique de la ferme pédagogique');
  console.log('==================================================');

  let releves;
  try {
    releves = await chargerJson(FICHIER_DONNEES);
    console.log(`${releves.length} relevé(s) chargé(s) depuis ${FICHIER_DONNEES}.`);
  } catch (erreur) {
    console.log(`Impossible de lire ${FICHIER_DONNEES} : ${erreur.message}. Le journal démarre vide.`);
    releves = [];
  }

  try {
    let continuer = true;
    while (continuer) {
      afficherMenu();
      const choix = await demander('Votre choix : ');
      if (choix === null) break;
      if (choix === '0') {
        console.log('Au revoir !');
        break;
      }

      try {
        switch (choix) {
          case '1':
            continuer = await ajouter(releves);
            break;
          case '2':
            lister(releves);
            break;
          case '3':
            continuer = await rechercher(releves);
            break;
          case '4':
            continuer = await trier(releves);
            break;
          case '5':
            afficherSynthese(releves);
            break;
          case '6':
            continuer = await supprimer(releves);
            break;
          case '7':
            continuer = await modifier(releves);
            break;
          default:
            console.log(`Choix inconnu : « ${choix} ». Tapez un chiffre du menu.`);
        }
      } catch (erreur) {
        const message = erreur instanceof Error ? erreur.message : String(erreur);
        console.log(message.startsWith('TODO') ? `À compléter : ${message}` : `Erreur inattendue : ${message}`);
      }
    }
  } finally {
    fermerSaisie();
  }
}

main().catch((erreur) => {
  fermerSaisie();
  console.error(`Erreur inattendue : ${erreur instanceof Error ? erreur.message : String(erreur)}`);
  process.exitCode = 1;
});
