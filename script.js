const form = document.getElementById("letterForm");
const letterDateInput = document.getElementById("letterDate");
const paymentCountInput = document.getElementById("paymentCount");
const payment1Input = document.getElementById("payment1");
const payment2Input = document.getElementById("payment2");
const payment2Field = document.getElementById("payment2Field");
const printButton = document.getElementById("printButton");

const previewDate = document.getElementById("previewDate");
const previewPayment1 = document.getElementById("previewPayment1");
const previewPayment1Words = document.getElementById("previewPayment1Words");
const previewPayment2 = document.getElementById("previewPayment2");
const previewPayment2Words = document.getElementById("previewPayment2Words");
const previewTotal = document.getElementById("previewTotal");
const previewTotalWords = document.getElementById("previewTotalWords");

const signatureImage = document.getElementById("signatureImage");
const signatureFallback = document.getElementById("signatureFallback");

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

const monthNames = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

const simpleNumbers = {
  0: "CERO",
  1: "UN",
  2: "DOS",
  3: "TRES",
  4: "CUATRO",
  5: "CINCO",
  6: "SEIS",
  7: "SIETE",
  8: "OCHO",
  9: "NUEVE",
  10: "DIEZ",
  11: "ONCE",
  12: "DOCE",
  13: "TRECE",
  14: "CATORCE",
  15: "QUINCE",
  16: "DIECISEIS",
  17: "DIECISIETE",
  18: "DIECIOCHO",
  19: "DIECINUEVE",
  20: "VEINTE",
  21: "VEINTIUN",
  22: "VEINTIDOS",
  23: "VEINTITRES",
  24: "VEINTICUATRO",
  25: "VEINTICINCO",
  26: "VEINTISEIS",
  27: "VEINTISIETE",
  28: "VEINTIOCHO",
  29: "VEINTINUEVE",
};

const tensNames = {
  30: "TREINTA",
  40: "CUARENTA",
  50: "CINCUENTA",
  60: "SESENTA",
  70: "SETENTA",
  80: "OCHENTA",
  90: "NOVENTA",
};

const hundredsNames = {
  100: "CIENTO",
  200: "DOSCIENTOS",
  300: "TRESCIENTOS",
  400: "CUATROCIENTOS",
  500: "QUINIENTOS",
  600: "SEISCIENTOS",
  700: "SETECIENTOS",
  800: "OCHOCIENTOS",
  900: "NOVECIENTOS",
};

function formatLetterDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const dayName = dayNames[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${day} de ${month} del ${year}`;
}

function parseAmount(input) {
  const rawValue = input.value.trim();
  if (rawValue === "") {
    return null;
  }

  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100) / 100;
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function convertTens(number) {
  if (number <= 29) {
    return simpleNumbers[number];
  }

  const tens = Math.floor(number / 10) * 10;
  const units = number % 10;

  if (units === 0) {
    return tensNames[tens];
  }

  return `${tensNames[tens]} Y ${simpleNumbers[units]}`;
}

function convertHundreds(number) {
  if (number < 100) {
    return convertTens(number);
  }

  if (number === 100) {
    return "CIEN";
  }

  const hundreds = Math.floor(number / 100) * 100;
  const rest = number % 100;
  const prefix = hundredsNames[hundreds];

  if (rest === 0) {
    return prefix;
  }

  return `${prefix} ${convertTens(rest)}`;
}

function convertIntegerToWords(number) {
  if (number < 1000) {
    return convertHundreds(number);
  }

  if (number < 1000000) {
    const thousands = Math.floor(number / 1000);
    const rest = number % 1000;
    const thousandsWords = thousands === 1 ? "MIL" : `${convertIntegerToWords(thousands)} MIL`;

    if (rest === 0) {
      return thousandsWords;
    }

    return `${thousandsWords} ${convertIntegerToWords(rest)}`;
  }

  if (number < 1000000000000) {
    const millions = Math.floor(number / 1000000);
    const rest = number % 1000000;
    const millionsWords = millions === 1
      ? "UN MILLON"
      : `${convertIntegerToWords(millions)} MILLONES`;

    if (rest === 0) {
      return millionsWords;
    }

    return `${millionsWords} ${convertIntegerToWords(rest)}`;
  }

  return String(number);
}

function amountToWords(amount, includeCurrencyLabel = true) {
  if (amount == null) {
    return "";
  }

  let integerPart = Math.floor(amount);
  let cents = Math.round((amount - integerPart) * 100);

  if (cents === 100) {
    integerPart += 1;
    cents = 0;
  }

  const integerWords = convertIntegerToWords(integerPart);
  const centsText = String(cents).padStart(2, "0");

  if (!includeCurrencyLabel) {
    return `${integerWords} CON ${centsText}/100`;
  }

  return `${integerWords} PESOS DOMINICANOS CON ${centsText}/100`;
}

function setSlotValue(element, value) {
  element.textContent = value || "";
}

function updatePaymentVisibility() {
  const paymentCount = paymentCountInput.value;
  payment2Field.hidden = paymentCount !== "2";
  payment1Input.required = true;
  payment2Input.required = paymentCount === "2";

  if (paymentCount !== "2") {
    payment2Input.value = "";
  }
}

function renderLetter() {
  updatePaymentVisibility();

  const paymentCount = paymentCountInput.value;
  const payment1 = parseAmount(payment1Input);
  const payment2 = paymentCount === "2" ? parseAmount(payment2Input) : null;

  setSlotValue(previewDate, formatLetterDate(letterDateInput.value));
  setSlotValue(previewPayment1, payment1 == null ? "" : formatCurrency(payment1));
  setSlotValue(previewPayment1Words, amountToWords(payment1));
  setSlotValue(previewPayment2, payment2 == null ? "" : formatCurrency(payment2));
  setSlotValue(previewPayment2Words, amountToWords(payment2));

  const activeAmounts = [payment1, payment2].filter((amount) => amount != null);
  const total = activeAmounts.length
    ? Math.round(activeAmounts.reduce((sum, amount) => sum + amount, 0) * 100) / 100
    : null;

  setSlotValue(previewTotal, total == null ? "" : formatCurrency(total));
  setSlotValue(previewTotalWords, amountToWords(total));
}

function showSignatureFallback() {
  signatureImage.hidden = true;
  signatureFallback.style.display = "block";
}

function hideSignatureFallback() {
  signatureImage.hidden = false;
  signatureFallback.style.display = "none";
}

function canPrint() {
  updatePaymentVisibility();

  const fieldsAreValid = form.reportValidity();
  const payment1 = parseAmount(payment1Input);
  const payment2 = paymentCountInput.value === "2" ? parseAmount(payment2Input) : 0;
  const amountsAreValid = payment1 != null && payment2 != null;

  return fieldsAreValid && amountsAreValid;
}

signatureImage.addEventListener("error", showSignatureFallback);
signatureImage.addEventListener("load", hideSignatureFallback);

form.addEventListener("input", renderLetter);
paymentCountInput.addEventListener("change", renderLetter);
printButton.addEventListener("click", () => {
  if (!canPrint()) {
    return;
  }

  window.print();
});

renderLetter();

if (!signatureImage.complete || !signatureImage.naturalWidth) {
  showSignatureFallback();
}
