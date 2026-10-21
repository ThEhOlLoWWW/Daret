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
