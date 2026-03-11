const form = document.getElementById("letterForm");
const formMessage = document.getElementById("formMessage");
const letterDateInput = document.getElementById("letterDate");
const paymentCountInput = document.getElementById("paymentCount");
const printButton = document.getElementById("printButton");

const previewDate = document.getElementById("previewDate");
const previewWeekRange = document.getElementById("previewWeekRange");
const previewTotal = document.getElementById("previewTotal");
const previewTotalWords = document.getElementById("previewTotalWords");

const fullDayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

const monthNamesUpper = [
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

const monthNamesTitle = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
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

const paymentRows = [
  {
    group: null,
    programInput: document.getElementById("program1"),
    raceDateInput: document.getElementById("raceDate1"),
    amountInput: document.getElementById("payment1"),
    previewProgram: document.getElementById("previewProgram1"),
    previewRaceDate: document.getElementById("previewRaceDate1"),
    previewAmount: document.getElementById("previewPayment1"),
    previewWords: document.getElementById("previewPayment1Words"),
  },
  {
    group: document.getElementById("payment2Group"),
    programInput: document.getElementById("program2"),
    raceDateInput: document.getElementById("raceDate2"),
    amountInput: document.getElementById("payment2"),
    previewProgram: document.getElementById("previewProgram2"),
    previewRaceDate: document.getElementById("previewRaceDate2"),
    previewAmount: document.getElementById("previewPayment2"),
    previewWords: document.getElementById("previewPayment2Words"),
  },
];

function setTodayIfEmpty() {
  if (!letterDateInput.value) {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    letterDateInput.value = local.toISOString().slice(0, 10);
  }
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date, days) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatLetterDate(value) {
  const date = parseDateValue(value);

  if (!date) {
    return "";
  }

  const dayName = fullDayNames[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = monthNamesUpper[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${day} de ${month} del ${year}`;
}

function formatRaceDate(date) {
  if (!date) {
    return "";
  }

  const dayName = fullDayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNamesTitle[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${day} de ${month} ${year}`;
}

function getRaceWeek(date) {
  const day = date.getDay();

  if (day < 2 || day > 6) {
    return null;
  }

  const start = addDays(date, -(day - 2));
  const end = addDays(start, 4);

  return { start, end };
}

function formatWeekRange(week) {
  if (!week) {
    return "";
  }

  const { start, end } = week;
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth && sameYear) {
    return `${start.getDate()} al ${end.getDate()} de ${monthNamesUpper[start.getMonth()]} del ${start.getFullYear()}`;
  }

  if (sameYear) {
    return `${start.getDate()} de ${monthNamesUpper[start.getMonth()]} al ${end.getDate()} de ${monthNamesUpper[end.getMonth()]} del ${start.getFullYear()}`;
  }

  return `${start.getDate()} de ${monthNamesUpper[start.getMonth()]} del ${start.getFullYear()} al ${end.getDate()} de ${monthNamesUpper[end.getMonth()]} del ${end.getFullYear()}`;
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

function parseProgramNumber(input) {
  const rawValue = input.value.trim();

  if (rawValue === "") {
    return null;
  }

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
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

function amountToWords(amount) {
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

  return `${integerWords} PESOS DOMINICANOS CON ${centsText}/100`;
}

function setSlotValue(element, value) {
  element.textContent = value || "";
}

function setFormMessage(message) {
  formMessage.textContent = message || "";
  formMessage.hidden = !message;
}

function setDateInputValue(input, date) {
  input.value = date ? dateKey(date) : "";
}

function syncSecondPaymentDate() {
  const paymentCount = Number(paymentCountInput.value);
  const firstDate = parseDateValue(paymentRows[0].raceDateInput.value);
  const secondRow = paymentRows[1];

  if (paymentCount !== 2) {
    secondRow.raceDateInput.readOnly = false;
    return;
  }

  secondRow.raceDateInput.readOnly = true;

  if (!firstDate) {
    secondRow.raceDateInput.value = "";
    return;
  }

  const firstWeek = getRaceWeek(firstDate);

  if (!firstWeek) {
    secondRow.raceDateInput.value = "";
    return;
  }

  setDateInputValue(secondRow.raceDateInput, firstWeek.end);
}

function updatePaymentVisibility() {
  const paymentCount = Number(paymentCountInput.value);
  const secondActive = paymentCount === 2;
  const secondRow = paymentRows[1];

  secondRow.group.hidden = !secondActive;
  secondRow.programInput.required = secondActive;
  secondRow.raceDateInput.required = false;
  secondRow.amountInput.required = secondActive;

  if (!secondActive) {
    secondRow.programInput.value = "";
    secondRow.raceDateInput.value = "";
    secondRow.amountInput.value = "";
  }

  syncSecondPaymentDate();
}

function getActiveRows() {
  const paymentCount = Number(paymentCountInput.value);
  return paymentRows.slice(0, paymentCount);
}

function clearRowDateValidity() {
  paymentRows.forEach((row) => {
    row.raceDateInput.setCustomValidity("");
  });
}

function validateRaceWeeks(activeRows) {
  clearRowDateValidity();

  const paymentCount = Number(paymentCountInput.value);
  const firstDate = parseDateValue(paymentRows[0].raceDateInput.value);

  if (paymentCount === 2 && firstDate && firstDate.getDay() !== 2) {
    const message = "Si hay 2 pagos, la primera fecha debe ser martes y la segunda sera el sabado de esa semana.";
    paymentRows[0].raceDateInput.setCustomValidity(message);
    setFormMessage(message);
    return { valid: false, sourceWeek: null };
  }

  const rowsWithDates = activeRows
    .map((row) => ({
      row,
      date: parseDateValue(row.raceDateInput.value),
    }))
    .filter((entry) => entry.date);

  if (!rowsWithDates.length) {
    setFormMessage("");
    return { valid: true, sourceWeek: null };
  }

  const invalidWeekdayEntry = rowsWithDates.find((entry) => !getRaceWeek(entry.date));
  if (invalidWeekdayEntry) {
    const message = "Las fechas de carrera deben ser entre martes y sabado.";
    invalidWeekdayEntry.row.raceDateInput.setCustomValidity(message);
    setFormMessage(message);
    return { valid: false, sourceWeek: null };
  }

  const weekKeys = rowsWithDates.map((entry) => ({
    row: entry.row,
    week: getRaceWeek(entry.date),
  }));

  const firstWeekKey = dateKey(weekKeys[0].week.start);
  const mixedWeek = weekKeys.find((entry) => dateKey(entry.week.start) !== firstWeekKey);

  if (mixedWeek) {
    const message = "Las fechas de pago activas deben pertenecer a la misma semana de carreras.";
    weekKeys.forEach((entry) => {
      entry.row.raceDateInput.setCustomValidity(message);
    });
    setFormMessage(message);
    return { valid: false, sourceWeek: null };
  }

  const earliestDate = rowsWithDates
    .map((entry) => entry.date)
    .sort((left, right) => left.getTime() - right.getTime())[0];

  setFormMessage("");
  return { valid: true, sourceWeek: getRaceWeek(earliestDate) };
}

function renderRows() {
  paymentRows.forEach((row) => {
    const programNumber = parseProgramNumber(row.programInput);
    const raceDate = parseDateValue(row.raceDateInput.value);
    const amount = parseAmount(row.amountInput);

    setSlotValue(row.previewProgram, programNumber == null ? "" : String(programNumber));
    setSlotValue(row.previewRaceDate, formatRaceDate(raceDate));
    setSlotValue(row.previewAmount, amount == null ? "" : formatCurrency(amount));
    setSlotValue(row.previewWords, amountToWords(amount));
  });
}

function renderTotals(activeRows) {
  const amounts = activeRows
    .map((row) => parseAmount(row.amountInput))
    .filter((amount) => amount != null);

  const total = amounts.length
    ? Math.round(amounts.reduce((sum, amount) => sum + amount, 0) * 100) / 100
    : null;

  setSlotValue(previewTotal, total == null ? "" : formatCurrency(total));
  setSlotValue(previewTotalWords, amountToWords(total));
}

function renderLetter() {
  updatePaymentVisibility();

  const activeRows = getActiveRows();
  const validation = validateRaceWeeks(activeRows);

  setSlotValue(previewDate, formatLetterDate(letterDateInput.value));
  setSlotValue(previewWeekRange, formatWeekRange(validation.sourceWeek));

  renderRows();
  renderTotals(activeRows);
}

function canPrint() {
  renderLetter();
  return form.reportValidity();
}

function openPrintPreview() {
  const printArea = document.getElementById("printArea");
  const printWindow = window.open("", "_blank");

  if (!printWindow || !printArea) {
    window.print();
    return;
  }

  const baseHref = document.baseURI;

  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="${baseHref}">
  <title>Imprimir carta</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    .print-fit-frame {
      width: 7.75in;
      margin: 0 auto;
      overflow: hidden;
    }

    .print-fit-target {
      transform-origin: top center;
    }

    @media print {
      .preview-panel {
        overflow: visible !important;
      }

      .print-fit-frame {
        width: 7.75in;
        margin: 0 auto;
      }
    }
  </style>
</head>
<body>
  <main class="preview-panel">
    <div class="print-fit-frame">
      ${printArea.outerHTML.replace('class="letter-sheet"', 'class="letter-sheet print-fit-target"')}
    </div>
  </main>
  <script>
    function fitToSinglePage() {
      const frame = document.querySelector(".print-fit-frame");
      const target = document.querySelector(".print-fit-target");

      if (!frame || !target) {
        return;
      }

      target.style.transform = "";
      target.style.width = "";

      const pageWidth = 7.75 * 96;
      const pageHeight = 10.6 * 96;
      const widthScale = pageWidth / target.scrollWidth;
      const heightScale = pageHeight / target.scrollHeight;
      const scale = Math.min(1, widthScale, heightScale);

      if (scale < 1) {
        target.style.transform = "scale(" + scale + ")";
        target.style.width = "calc(100% / " + scale + ")";
        frame.style.height = (target.scrollHeight * scale) + "px";
      } else {
        frame.style.height = "auto";
      }
    }

    window.addEventListener("load", () => {
      setTimeout(() => {
        fitToSinglePage();
        if (window.print) {
          window.print();
        }
      }, 300);
    });
  <\/script>
</body>
</html>`);
  printWindow.document.close();
}

function bindLivePreviewEvents() {
  const controls = form.querySelectorAll("input, select");

  controls.forEach((control) => {
    ["input", "change", "keyup", "blur"].forEach((eventName) => {
      control.addEventListener(eventName, () => {
        // Some mobile browsers delay updates on date/number controls until blur/change.
        renderLetter();
      });
    });
  });
}

printButton.addEventListener("click", () => {
  if (!canPrint()) {
    return;
  }

  openPrintPreview();
});

bindLivePreviewEvents();
setTodayIfEmpty();
renderLetter();
