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
