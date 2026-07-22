import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "acorn";

// Statyczna kontrola bezpieczeństwa kodu klienta: żadnego eval ani dynamicznego
// konstruktora Function, żadnego dzielenia przez zero i żadnego dzielnika, którego
// nie da się policzyć statycznie (mógłby ukryć dzielenie przez zero w czasie pracy).
const root = resolve(import.meta.dirname, "..");
const files = ["src/app.js", "src/main.js", "vite.config.js"];
const errors = [];
const inspectedOperations = [];

function constantNumber(node) {
  if (node?.type === "Literal" && typeof node.value === "number") return node.value;
  if (node?.type === "UnaryExpression" && ["+", "-"].includes(node.operator)) {
    const value = constantNumber(node.argument);
    if (value === null) return null;
    return node.operator === "-" ? -value : value;
  }
  if (node?.type !== "BinaryExpression") return null;

  const left = constantNumber(node.left);
  const right = constantNumber(node.right);
  if (left === null || right === null) return null;

  switch (node.operator) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return left / right;
    case "%": return left % right;
    case "**": return left ** right;
    default: return null;
  }
}

function visit(node, file) {
  if (!node || typeof node !== "object") return;

  if (node.type === "BinaryExpression" && ["/", "%"].includes(node.operator)) {
    const divisor = constantNumber(node.right);
    const location = `${file}:${node.loc.start.line}`;

    if (divisor === 0 || Object.is(divisor, -0)) {
      errors.push(`${location}: stałe dzielenie lub modulo przez zero`);
    } else if (divisor === null) {
      errors.push(`${location}: dynamiczny dzielnik bez rozpoznanej osłony`);
    } else {
      inspectedOperations.push(`${location}: stały, niezerowy dzielnik ${divisor}`);
    }
  }

  if (node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "eval") {
    errors.push(`${file}:${node.loc.start.line}: użycie eval`);
  }

  if (node.type === "NewExpression" && node.callee.type === "Identifier" && node.callee.name === "Function") {
    errors.push(`${file}:${node.loc.start.line}: dynamiczny konstruktor Function`);
  }

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      value.forEach((child) => visit(child, file));
    } else if (value?.type) {
      visit(value, file);
    }
  }
}

for (const file of files) {
  const source = readFileSync(resolve(root, file), "utf8");
  const ast = parse(source, {
    ecmaVersion: "latest",
    sourceType: "module",
    locations: true,
  });
  visit(ast, file);
}

if (errors.length) {
  console.error("Kontrola bezpieczeństwa kodu nieudana:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Kontrola bezpieczeństwa kodu OK.");
console.log(`Sprawdzone operacje / i %: ${inspectedOperations.length}.`);
for (const operation of inspectedOperations) console.log(`- ${operation}`);
