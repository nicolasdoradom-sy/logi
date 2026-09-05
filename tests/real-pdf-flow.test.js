const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "app.js"), "utf8");
const cases = [
  { fixture: "texto-corrido-ingles.pdf", references: 5, complete: 4, incomplete: 1 },
  { fixture: "tabla-bordes-unidades-mixtas.pdf", references: 10, complete: 9, incomplete: 1 },
  { fixture: "tabla-bordes-peso-kg.pdf", references: 10, complete: 9, incomplete: 1 },
  { fixture: "tabla-columnas-orden-distinto.pdf", references: 5, complete: 4, incomplete: 1 }
];

function createContext() {
  const elements = new Map();
  const element = () => ({
    value: "",
    innerHTML: "",
    textContent: "",
    disabled: false,
    checked: false,
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    setAttribute() {},
    focus() {},
    scrollIntoView() {}
  });
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    querySelectorAll() { return []; },
    addEventListener() {}
  };
  pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve("pdfjs-dist/legacy/build/pdf.worker.js");
  const context = {
    console: { log() {}, warn() {}, error() {}, group() {}, groupEnd() {}, table() {} },
    Math, Number, String, Object, Array, RegExp, Set, Map, Infinity, NaN,
    parseFloat, parseInt, isFinite: Number.isFinite,
    document,
    window: { scrollTo() {}, print() {} },
    localStorage: { getItem() { return null; }, setItem() {} },
    alert() {},
    confirm() { return true; },
    setTimeout(callback) { callback(); },
    clearTimeout() {},
    pdfjsLib
  };
  vm.runInNewContext(`${source}\nthis.runImport = importarPDF; this.getPieces = () => pieces; this.getPdfTableRecords = pdfTableRecords;`, context);
  return context;
}

async function runFixture(fixture) {
  const filePath = path.join(__dirname, "fixtures", fixture);
  const data = new Uint8Array(fs.readFileSync(filePath));
  const context = createContext();
  await context.runImport({
    name: fixture,
    arrayBuffer: async () => data.buffer
  });
  return context.getPieces();
}

async function runTableWithFooter(fixture) {
  const filePath = path.join(__dirname, "fixtures", fixture);
  const data = new Uint8Array(fs.readFileSync(filePath));
  const documentPdf = await pdfjsLib.getDocument({ data }).promise;
  const items = [];
  for (let pageNumber = 1; pageNumber <= documentPdf.numPages; pageNumber++) {
    const page = await documentPdf.getPage(pageNumber);
    const content = await page.getTextContent();
    items.push(...(content.items || []).map(item => ({
      str: String(item.str || ""),
      transform: item.transform
    })));
  }
  const footerY = 50;
  ["Peso total: 999 kg", "Volumen total: 999 m3", "Área de piso total: 999 m2", "Referencias: 999"].forEach((str, index) => {
    items.push({ str, transform: [1, 0, 0, 1, 20, footerY - index * 12] });
  });
  return createContext().getPdfTableRecords(items);
}

(async () => {
  for (const testCase of cases) {
    const pieces = await runFixture(testCase.fixture);
    const incomplete = pieces.filter(piece => piece.incomplete).length;
    assert.equal(pieces.length, testCase.references, `${testCase.fixture}: referencias`);
    assert.equal(incomplete, testCase.incomplete, `${testCase.fixture}: incompletas`);
    assert.equal(pieces.length - incomplete, testCase.complete, `${testCase.fixture}: completas`);
  }
  const footerResult = await runTableWithFooter("tabla-bordes-peso-kg.pdf");
  assert.equal(footerResult.records.length, 10, "El footer no debe convertirse en referencias");
  assert.equal(footerResult.records.some(record => /^(?:peso total|volumen total|area de piso total|referencias)\b/i.test(record.desc)), false, "El footer no debe aparecer como descripción");
  console.log(`✅ Flujo PDF end-to-end validado para ${cases.length} fixtures reales.`);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
