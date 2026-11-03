// Na raiz do projeto: node front/scripts/atualizar-aula.cjs
const fs = require("node:fs");
const path = require("node:path");

const pastaFront = path.join(__dirname, "..");
const arquivoLogica = path.join(pastaFront, "..", "back", "damas.js");
const codigo = fs.readFileSync(arquivoLogica, "utf8");
const copia = "// Gerado por front/scripts/atualizar-aula.cjs. Edite back/damas.js.\n" +
    "const CODIGO_DAMAS = " + JSON.stringify(codigo) + ";\n";

fs.writeFileSync(path.join(pastaFront, "codigo-fonte.js"), copia);
console.log("A aula agora exibe o conteúdo atual de damas.js.");
