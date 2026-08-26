/* ============================================================
   CALCULATOR LOGIC
   Organized into clear sections:
   1. State variables
   2. DOM references
   3. Core calculator functions
   4. Display update
   5. Event listeners (buttons)
   6. Keyboard support
============================================================ */

/* ---------------- 1. STATE VARIABLES ---------------- */
let currentValue = "0";     // number currently being typed / shown as result
let previousValue = "";     // the first operand, stored once an operator is chosen
let operator = null;        // current operator: + - * /
let shouldResetScreen = false; // true right after "=" or picking an operator

/* ---------------- 2. DOM REFERENCES ---------------- */
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

/* ---------------- 3. CORE CALCULATOR FUNCTIONS ---------------- */

// Append a digit or decimal point to the current value
function inputNumber(num) {
  // Prevent multiple leading zeros
  if (currentValue === "0" && num !== ".") {
    currentValue = num;
  } else if (shouldResetScreen) {
    // Start fresh number after an operator/equals was pressed
    currentValue = num === "." ? "0." : num;
    shouldResetScreen = false;
  } else if (num === "." && currentValue.includes(".")) {
    // Prevent multiple decimal points
    return;
  } else {
    currentValue += num;
  }
}

// Store the chosen operator and move current value into previousValue
function chooseOperator(op) {
  if (operator !== null && !shouldResetScreen) {
    // Chain calculations: if an operator was already picked, calculate first
    calculate();
  }
  previousValue = currentValue;
  operator = op;
  shouldResetScreen = true;
  highlightActiveOperator(op);
}

// Perform the actual arithmetic
function calculate() {
  if (operator === null || shouldResetScreen) return;

  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operator) {
    case "add":
      result = prev + curr;
      break;
    case "subtract":
      result = prev - curr;
      break;
    case "multiply":
      result = prev * curr;
      break;
    case "divide":
      result = curr === 0 ? "Error" : prev / curr;
      break;
    default:
      return;
  }

  // Round to avoid ugly floating point results (e.g. 0.1 + 0.2)
  if (typeof result === "number") {
    result = Math.round(result * 1e10) / 1e10;
  }

  currentValue = result.toString();
  operator = null;
  previousValue = "";
  shouldResetScreen = true;
  clearActiveOperator();
}

// Clear everything back to the initial state
function clearAll() {
  currentValue = "0";
  previousValue = "";
  operator = null;
  shouldResetScreen = false;
  clearActiveOperator();
}

// Delete the last character typed (backspace)
function deleteLast() {
  if (shouldResetScreen) return; // nothing to delete from a just-computed result
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
}

// Convert current value to a percentage (divide by 100)
function applyPercent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
}

/* ---------------- 4. DISPLAY UPDATE ---------------- */

// Map internal operator names to display symbols
const operatorSymbols = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷"
};

function updateDisplay() {
  resultEl.textContent = currentValue;

  // Show the running expression above the result, e.g. "12 +"
  if (operator && previousValue !== "") {
    expressionEl.textContent = `${previousValue} ${operatorSymbols[operator]}`;
  } else {
    expressionEl.textContent = "";
  }
}

// Visually highlight whichever operator button is active
function highlightActiveOperator(op) {
  clearActiveOperator();
  const btn = document.querySelector(`[data-action="${op}"]`);
  if (btn) btn.classList.add("active");
}

function clearActiveOperator() {
  document.querySelectorAll(".btn.operator").forEach(b => b.classList.remove("active"));
}

/* ---------------- 5. EVENT LISTENERS (BUTTON CLICKS) ---------------- */

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
      inputNumber(value);
    } else if (action === "add" || action === "subtract" || action === "multiply" || action === "divide") {
      chooseOperator(action);
    } else if (action === "equals") {
      calculate();
    } else if (action === "clear") {
      clearAll();
    } else if (action === "delete") {
      deleteLast();
    } else if (action === "percent") {
      applyPercent();
    }

    updateDisplay();
  });
});

/* ---------------- 6. KEYBOARD SUPPORT ---------------- */

document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Numbers 0-9
  if (key >= "0" && key <= "9") {
    inputNumber(key);
  }
  // Decimal point
  else if (key === ".") {
    inputNumber(".");
  }
  // Operators
  else if (key === "+") {
    chooseOperator("add");
  } else if (key === "-") {
    chooseOperator("subtract");
  } else if (key === "*") {
    chooseOperator("multiply");
  } else if (key === "/") {
    e.preventDefault(); // stop browser's quick-find from opening
    chooseOperator("divide");
  }
  // Equals: Enter or =
  else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  }
  // Clear: Escape
  else if (key === "Escape") {
    clearAll();
  }
  // Delete: Backspace
  else if (key === "Backspace") {
    deleteLast();
  }
  // Percent
  else if (key === "%") {
    applyPercent();
  } else {
    return; // key not handled, skip display update
  }

  updateDisplay();
});

/* Initialize display on page load */
updateDisplay();
