const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

// Load app.js parser functions in isolated context with browser mocks
const source = fs.readFileSync("js/app.js", "utf8");
const elements = new Map();
function makeElement() {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    checked: false,
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    setAttribute() {},
    focus() {},
    scrollIntoView() {}
  };
}

const storage = new Map();
const context = {
  console,
  Math,
  Number,
  String,
  Object,
  Array,
  RegExp,
  Set,
  Map,
  Infinity,
  NaN,
  isFinite: Number.isFinite,
  parseFloat,
  parseInt,
  localStorage: {
    getItem: key => storage.get(key) || null,
    setItem: (k, v) => storage.set(k, v),
    removeItem: k => storage.delete(k)
  },
  document: {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeElement());
      return elements.get(id);
    },
    querySelectorAll() { return []; },
    addEventListener() {}
  },
  window: { scrollTo() {}, print() {} },
  alert() {},
  confirm: () => true,
  setTimeout: cb => cb(),
  clearTimeout() {}
};

vm.runInNewContext(source, context);

// Test 1: Combined dimensions parsing
console.log("--- Test 1: findPdfDimensions variations ---");
const dimsCases = [
  { input: "40x30x20", expected: { L: 0.40, W: 0.30, H: 0.20 } },
  { input: "40*30*20 cm", expected: { L: 0.40, W: 0.30, H: 0.20 } },
  { input: "0.40 x 0.30 x 0.20 m", expected: { L: 0.40, W: 0.30, H: 0.20 } },
  { input: "400 x 300 x 200 mm", expected: { L: 0.40, W: 0.30, H: 0.20 } },
  { input: "38*28*19cm/外箱", expected: { L: 0.38, W: 0.28, H: 0.19 } },
  { input: "00042x17x17", expected: { L: 0.42, W: 0.17, H: 0.17 } },
  { input: "27X27X22", expected: { L: 0.27, W: 0.27, H: 0.22 } }
];

dimsCases.forEach(({ input, expected }) => {
  const d = context.findPdfDimensions(input);
  assert.ok(d, `Debe parsear dimensiones para: ${input}`);
  const unit = d.unit || (input.includes("m") && !input.includes("cm") && !input.includes("mm") ? "m" : "cm");
  const L = context.convertPdfMeasurement({ value: d.L, unit }, "cm");
  const W = context.convertPdfMeasurement({ value: d.W, unit }, "cm");
  const H = context.convertPdfMeasurement({ value: d.H, unit }, "cm");
  assert.ok(Math.abs(L - expected.L) < 0.001, `L mismatch en ${input}: ${L} vs ${expected.L}`);
  assert.ok(Math.abs(W - expected.W) < 0.001, `W mismatch en ${input}: ${W} vs ${expected.W}`);
  assert.ok(Math.abs(H - expected.H) < 0.001, `H mismatch en ${input}: ${H} vs ${expected.H}`);
});
console.log("✅ findPdfDimensions pasó todas las pruebas!");

console.log("--- Test 2: Multi-page Table Extraction ---");
// Simulate multi-page items
const columns = [
  ["CODIGO", 10], ["Ctn No", 50], ["REFERENCIA N°", 100], ["Description", 180], ["Qty (Pcs)", 340],
  ["Pcs/Ctn", 380], ["Ctns", 420], ["NW (Kgs)", 460], ["Total NW (Kgs)", 500],
  ["GW (Kgs)", 540], ["Total GW (Kgs)", 580], ["Size/CBM", 640]
];

const items = [];
columns.forEach(([str, x]) => items.push({ str, transform: [1, 0, 0, 1, x, 750] }));

// Page 1: 10 items
for (let i = 0; i < 10; i++) {
  const y = 700 - i * 20;
  const values = ["", `Ctn-${i+1}`, `REF-00${i+1}`, `Repuesto ${i+1}`, "100", "10", "10", "5,0", "50,0", "5,5", "55,0", "30x20x10 cm"];
  values.forEach((str, idx) => items.push({ str, transform: [1, 0, 0, 1, columns[idx][1], y] }));
}

// Page 2: 10 items with -2000 offset
for (let i = 10; i < 20; i++) {
  const y = 700 - (i - 10) * 20 - 2000;
  const values = ["", `Ctn-${i+1}`, `REF-00${i+1}`, `Repuesto ${i+1}`, "100", "10", "10", "5,0", "50,0", "5,5", "55,0", "30x20x10 cm"];
  values.forEach((str, idx) => items.push({ str, transform: [1, 0, 0, 1, columns[idx][1], y] }));
}

// Total line on page 2
[["TOTAL", 100], ["2000", 340], ["200", 420], ["1000,0", 500], ["1100,0", 580], ["1,20", 640]].forEach(([str, x]) => {
  items.push({ str, transform: [1, 0, 0, 1, x, 100 - 2000] });
});

const res = context.pdfTableRecords(items);
assert.equal(res.records.length, 20, "Debe extraer exactamente 20 referencias");

const totalCalc = res.records.reduce((acc, r) => {
  acc.q += r.q;
  acc.boxes += r.boxes;
  acc.gwTotalKg += r.gw * r.q * 1000;
  acc.volM3 += r.volume;
  return acc;
}, { q: 0, boxes: 0, gwTotalKg: 0, volM3: 0 });

assert.equal(totalCalc.q, 2000);
assert.equal(totalCalc.boxes, 200);
assert.equal(totalCalc.gwTotalKg, 1100);
assert.equal(totalCalc.volM3.toFixed(2), "1.20");

console.log("✅ Multi-page Table Extraction pasó todas las pruebas!");
