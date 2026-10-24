// Daret — simulateur. Ton code commence ici.
// Le HTML (index.html) est déjà intégré : lis-le, repère les id et les data-*, puis fais-le vivre.

const form = document.getElementById("daret-form");
const inputName = document.getElementById("nom-cercle");
const nameRegex = /^[\p{L}0-9 -]+$/u;
const inputAmount = document.getElementById("cotisation");
const inputPeriodicite = document.getElementById("periodicite");
const inputDate = document.getElementById("date-debut");
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const today = `${year}-${month}-${day}`;
const errorName = document.getElementById("nom-cercle-erreur");
const errorAmount = document.getElementById("cotisation-erreur");
const errorPeriodicite = document.getElementById("periodicite-erreur");
const errorDate = document.getElementById("date-debut-erreur");

const participantsListe = document.getElementById("participants-liste");
const participantAjouter = document.getElementById("ajouter-participant");
const participantsCompteur = document.getElementById("participants-compteur");
const participantsErreur = document.getElementById("participants-erreur");

const resumeCagnotte = document.getElementById("resume-cagnotte");
const resumeTotalCycle = document.getElementById("resume-total-cycle");
const resumeNbTours = document.getElementById("resume-nb-tours");
const resumeDates = document.getElementById("resume-dates");
const contenuResultat = document.getElementById("contenu-resultat");
const etatVide = document.getElementById("etat-vide");

const calendrierCorps = document.getElementById("calendrier-corps");

const randButton = document.getElementById("tirage-au-sort");
const originalButton = document.getElementById("ordre-saisie");

let ordreSaisie = [];
let montantParTour = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  inputName.value = inputName.value.trim();

  if (inputName.value.length < 3) {
    errorName.classList.remove("hidden");
    errorName.textContent =
      "Le nom du cercle est trop court (minimum 3 caractères).";
    return;
  } else if (inputName.value.length > 40) {
    errorName.classList.remove("hidden");
    errorName.textContent =
      "Le nom du cercle est trop long (maximum 40 caractères).";
    return;
  } else if (!nameRegex.test(inputName.value)) {
    errorName.classList.remove("hidden");
    errorName.textContent = "Le nom du cercle est invalide.";
    return;
  } else {
    errorName.textContent = "";
    errorName.classList.add("hidden");
  }

  const numAmount = Number(inputAmount.value);
  if (numAmount >= 100 && numAmount <= 50000 && Number.isInteger(numAmount)) {
    errorAmount.textContent = "";
    errorAmount.classList.add("hidden");
  } else {
    errorAmount.textContent = "La cotisation est invalide.";
    errorAmount.classList.remove("hidden");
    return;
  }

  if (
    inputPeriodicite.value === "hebdomadaire" ||
    inputPeriodicite.value === "quinzaine" ||
    inputPeriodicite.value === "mensuelle"
  ) {
    errorPeriodicite.textContent = "";
    errorPeriodicite.classList.add("hidden");
  } else {
    errorPeriodicite.textContent = "Le choix est invalide";
    errorPeriodicite.classList.remove("hidden");
    return;
  }

  if (inputDate.value >= today) {
    errorDate.textContent = "";
    errorDate.classList.add("hidden");
  } else {
    errorDate.textContent = "Le choix est invalide";
    errorDate.classList.remove("hidden");
    return;
  }

  const turns = participantsListe.querySelectorAll(".participant-nom").length;
  const montantRecue = multiplication(Number(inputAmount.value), turns);
  const participantTotal = multiplication(Number(inputAmount.value), turns);

  ordreSaisie = [];
  for (let participantInput of participantsListe.querySelectorAll(
    ".participant-nom",
  )) {
    ordreSaisie.push(participantInput.value.trim());
  }
  montantParTour = montantRecue;

  const derniereDate = calculerDerniereDate(
    turns,
    inputDate.value,
    inputPeriodicite.value,
  );

  resumeCagnotte.textContent = `${montantRecue} MAD`;
  resumeTotalCycle.textContent = `${participantTotal} MAD`;
  resumeNbTours.textContent = turns;

  const premiereDate = new Date(`${inputDate.value}T00:00:00`);

  resumeDates.textContent =
    `${premiereDate.toLocaleDateString("fr-FR")} - ` +
    `${derniereDate.toLocaleDateString("fr-FR")}`;

  contenuResultat.classList.remove("hidden");
  etatVide.classList.add("hidden");

  genererCalendrier(ordreSaisie, montantParTour);

  console.log("Original:", ordreSaisie);
  console.log("Shuffled:", melangerParticipants(ordreSaisie));
  console.log("Still original:", ordreSaisie);
});

function creerParticipant() {
  const participantItem = document.createElement("li");
  const participantInput = document.createElement("input");
  const participantRemove = document.createElement("button");
  const errorNom = document.createElement("p");

  participantInput.classList.add("participant-nom");
  participantInput.classList.add(
    "mt-1",
    "w-full",
    "rounded",
    "border",
    "border-daret-bordure",
    "px-3",
    "py-2",
    "focus:outline-2",
    "focus:outline-offset-2",
    "focus:outline-daret-vert",
  );

  participantInput.type = "text";
  participantInput.placeholder = "Prénom du participant";
  participantRemove.type = "button";
  participantRemove.textContent = "Supprimer";
  errorNom.classList.add(
    "mt-1",
    "hidden",
    "text-sm",
    "font-medium",
    "text-daret-erreur",
  );

  participantInput.addEventListener("input", (e) => {
    const nom = participantInput.value.trim();
    const nomRegex = /^[\p{L}'-]+$/u;

    if (nom.length < 2) {
      errorNom.classList.remove("hidden");
      errorNom.textContent = "Le prénom doit contenir au moins 2 caractères.";
      return;
    } else if (nom.length > 30) {
      errorNom.classList.remove("hidden");
      errorNom.textContent = "Le prénom ne doit pas dépasser 30 caractères.";
      return;
    } else if (!nomRegex.test(nom)) {
      errorNom.classList.remove("hidden");
      errorNom.textContent = "Le prénom contient des caractères non autorisés.";
      return;
    } else {
      errorNom.textContent = "";
      errorNom.classList.add("hidden");
    }
  });

  participantItem.appendChild(participantInput);
  participantItem.appendChild(participantRemove);
  participantItem.appendChild(errorNom);
  participantsListe.appendChild(participantItem);
}

creerParticipant();
creerParticipant();
creerParticipant();
mettreAJourCompteur();

function mettreAJourCompteur() {
  const num = participantsListe.children.length;
  if (num === 1) participantsCompteur.textContent = `${num} participant`;
  else participantsCompteur.textContent = `${num} participants`;
}

participantAjouter.addEventListener("click", () => {
  if (participantsListe.children.length < 20) {
    creerParticipant();
  } else {
    return;
  }
  mettreAJourCompteur();
});

participantsListe.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") {
    return;
  }
  if (participantsListe.children.length <= 2) {
    return;
  }

  const participantItem = event.target.parentElement;
  participantItem.remove();

  mettreAJourCompteur();
});

function multiplication(a, b) {
  return a * b;
}

function calculerDerniereDate(turns, dateDebut, periodicite) {
  const derniereDate = new Date(dateDebut);

  const intervalles = turns - 1;

  if (periodicite === "hebdomadaire") {
    derniereDate.setDate(derniereDate.getDate() + intervalles * 7);
  } else if (periodicite === "quinzaine") {
    derniereDate.setDate(derniereDate.getDate() + intervalles * 15);
  } else if (periodicite === "mensuelle") {
    derniereDate.setMonth(derniereDate.getMonth() + intervalles);
  }

  return derniereDate;
}

function creerLigneCalendrier(valeurs) {
  const ligne = document.createElement("tr");

  for (const valeur of valeurs) {
    const cell = document.createElement("td");
    cell.textContent = valeur;
    ligne.appendChild(cell);
  }

  calendrierCorps.appendChild(ligne);
}

function genererCalendrier(participants, montantRecue) {
  calendrierCorps.textContent = "";

  let numeroTour = 1;

  for (const nom of participants) {
    const valeur = [
      String(numeroTour),
      "Date à calculer",
      nom,
      `${montantRecue}`,
      "	À venir",
    ];

    creerLigneCalendrier(valeur);
    numeroTour++;
  }
}

function melangerParticipants(participants) {
  const melange = participants.slice();

  for (let i = melange.length - 1; i > 0; i--) {
    const indexAleatoire = Math.floor(Math.random() * (i + 1));

    const temporaire = melange[i];
    melange[i] = melange[indexAleatoire];
    melange[indexAleatoire] = temporaire;
  }

  return melange;
}

randButton.addEventListener("click", () => {
  if (ordreSaisie.length === 0) {
    return;
  }

  const ordreAleatoire = melangerParticipants(ordreSaisie);
  genererCalendrier(ordreAleatoire, montantParTour);
});

originalButton.addEventListener("click", () => {
  if (ordreSaisie.length === 0) {
    return;
  }

  genererCalendrier(ordreSaisie, montantParTour);
});
