import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "acorn";

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

function visit(node, file, source, functionName = null) {
  if (!node || typeof node !== "object") return;

  const activeFunction = node.type === "FunctionDeclaration"
    ? node.id?.name ?? "anonymous"
    : functionName;

  if (node.type === "BinaryExpression" && ["/", "%"].includes(node.operator)) {
    const divisor = constantNumber(node.right);
    const location = `${file}:${node.loc.start.line}`;

    if (divisor === 0 || Object.is(divisor, -0)) {
      errors.push(`${location}: stałe dzielenie lub modulo przez zero`);
    } else if (divisor === null) {
      const isGuardedWrap = activeFunction === "wrapIndex"
        && node.operator === "%"
        && node.right.type === "Identifier"
        && node.right.name === "length";

      if (!isGuardedWrap) {
        errors.push(`${location}: dynamiczny dzielnik bez rozpoznanej osłony`);
      } else {
        const functionSource = source.slice(
          source.lastIndexOf("export function wrapIndex", node.start),
          node.end,
        );
        const hasIndexGuard = functionSource.includes("Number.isSafeInteger(index)");
        const hasIntegerGuard = functionSource.includes("Number.isSafeInteger(length)");
        const hasPositiveGuard = /length\s*<=\s*0/.test(functionSource);
        if (!hasIndexGuard || !hasIntegerGuard || !hasPositiveGuard) {
          errors.push(`${location}: wrapIndex nie ma kompletnej osłony dodatniej liczby całkowitej`);
        } else {
          inspectedOperations.push(`${location}: modulo przez sprawdzone length > 0`);
        }
      }
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
      value.forEach((child) => visit(child, file, source, activeFunction));
    } else if (value?.type) {
      visit(value, file, source, activeFunction);
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
  visit(ast, file, source);
}

if (errors.length) {
  console.error("Kontrola bezpieczeństwa kodu nieudana:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Kontrola bezpieczeństwa kodu OK.");
console.log(`Sprawdzone operacje / i %: ${inspectedOperations.length}.`);
for (const operation of inspectedOperations) console.log(`- ${operation}`);
