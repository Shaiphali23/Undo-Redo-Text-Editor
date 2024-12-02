const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const addTextBtn = document.getElementById("add-text");
const textInput = document.getElementById("text-input");
const fontSizeInput = document.getElementById("font-size");
const fontStyleInput = document.getElementById("font-style");
const colorInput = document.getElementById("color");
const boldBtn = document.getElementById("bold");
const italicBtn = document.getElementById("italic");
const underlineBtn = document.getElementById("underline");
const canvas = document.getElementById("canvas");

let selectedText = null;
let history = [];
let redoStack = [];

// Add text to the canvas
addTextBtn.addEventListener("click", () => {
  const text = textInput.value.trim();
  if (text === "") return;

  const textElement = document.createElement("div");
  textElement.textContent = text;
  textElement.style.position = "absolute";
  textElement.style.left = "50px";
  textElement.style.top = "50px";
  textElement.style.fontSize = `${fontSizeInput.value}px`;
  textElement.style.fontFamily = fontStyleInput.value;
  textElement.style.color = colorInput.value;

  textElement.addEventListener("mouseover", moveWithMouse);
  textElement.addEventListener("click", () => selectText(textElement));

  canvas.appendChild(textElement);
  textInput.value = "";
  saveState();
});

// Enable text movement with mouse
function moveWithMouse() {
  if (!selectedText) return;

  const onMouseMove = (event) => {
    selectedText.style.left = `${event.pageX - canvas.offsetLeft}px`;
    selectedText.style.top = `${event.pageY - canvas.offsetTop}px`;
  };

  const onMouseUp = () => {
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
    saveState(); // Save the new position
  };

  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
}

// Select a text element
function selectText(element) {
  if (selectedText) selectedText.style.border = "";
  selectedText = element;
  selectedText.style.border = "1px dashed #000";
}

// Apply font size, style, and color changes
fontSizeInput.addEventListener("input", () => {
  if (selectedText) {
    selectedText.style.fontSize = `${fontSizeInput.value}px`;
    saveState();
  }
});

fontStyleInput.addEventListener("change", () => {
  if (selectedText) {
    selectedText.style.fontFamily = fontStyleInput.value;
    saveState();
  }
});

colorInput.addEventListener("input", () => {
  if (selectedText) {
    selectedText.style.color = colorInput.value;
    saveState();
  }
});

// Bold, italic, and underline styles
boldBtn.addEventListener("click", () => {
  if (selectedText) {
    selectedText.style.fontWeight =
      selectedText.style.fontWeight === "bold" ? "normal" : "bold";
    saveState();
  }
});

italicBtn.addEventListener("click", () => {
  if (selectedText) {
    selectedText.style.fontStyle =
      selectedText.style.fontStyle === "italic" ? "normal" : "italic";
    saveState();
  }
});

underlineBtn.addEventListener("click", () => {
  if (selectedText) {
    selectedText.style.textDecoration =
      selectedText.style.textDecoration === "underline" ? "none" : "underline";
    saveState();
  }
});

// Undo and redo logic
function saveState() {
  const state = Array.from(canvas.children).map((child) => ({
    text: child.textContent,
    style: {
      left: child.style.left,
      top: child.style.top,
      fontSize: child.style.fontSize,
      fontFamily: child.style.fontFamily,
      color: child.style.color,
      fontWeight: child.style.fontWeight,
      fontStyle: child.style.fontStyle,
      textDecoration: child.style.textDecoration,
    },
  }));
  history.push(state);
  redoStack = [];
  updateUndoRedoButtons();
}

function restoreState(state) {
  canvas.innerHTML = ""; // Clear canvas
  state.forEach((item) => {
    const textElement = document.createElement("div");
    textElement.textContent = item.text;
    Object.assign(textElement.style, item.style);
    textElement.addEventListener("mouseover", moveWithMouse);
    textElement.addEventListener("click", () => selectText(textElement));
    canvas.appendChild(textElement);
  });
}

function undo() {
  if (history.length > 1) {
    redoStack.push(history.pop());
    restoreState(history[history.length - 1]);
  }
  updateUndoRedoButtons();
}

function redo() {
  if (redoStack.length > 0) {
    const state = redoStack.pop();
    history.push(state);
    restoreState(state);
  }
  updateUndoRedoButtons();
}

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

function updateUndoRedoButtons() {
  undoBtn.disabled = history.length <= 1;
  redoBtn.disabled = redoStack.length === 0;
}

// Initialize state
saveState();
