// Apenas exibição: colore o texto sem interpretar ou executar o código.
const palavrasCodigo = new Set([
    "const", "let", "function", "for", "of", "if", "else", "while",
    "return", "break", "continue", "typeof", "new", "in",
]);

function colorirLinha(texto) {
    const partes = /\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+\b|\b[a-zA-Z_]\w*\b/g;
    const fragmento = document.createDocumentFragment();
    let fim = 0;
    for (const parte of texto.matchAll(partes)) {
        const palavra = parte[0];
        const inicio = parte.index;
        fragmento.append(document.createTextNode(texto.slice(fim, inicio)));
        let classe = "";
        if (palavra.startsWith("//")) classe = "comentario";
        else if (/^["'`]/.test(palavra)) classe = "texto";
        else if (palavrasCodigo.has(palavra)) classe = "palavra";
        else if (["true", "false", "null"].includes(palavra) || /^[A-Z][A-Z_0-9]*$/.test(palavra)) classe = "constante";
        else if (/^\d/.test(palavra)) classe = "numero";
        else if (texto.slice(inicio + palavra.length).trimStart().startsWith("(")) classe = "funcao";
        const trecho = document.createElement("span");
        trecho.textContent = palavra;
        if (classe) trecho.className = `sintaxe-${classe}`;
        fragmento.append(trecho);
        fim = inicio + palavra.length;
    }
    fragmento.append(document.createTextNode(texto.slice(fim)));
    return fragmento;
}

const secaoCodigo = document.getElementById("aula");
const ampliarCodigo = document.getElementById("ampliar-codigo");

function mostrarCodigoAmpliado(ativo) {
    secaoCodigo.classList.toggle("codigo-ampliado", ativo);
    ampliarCodigo.setAttribute("aria-pressed", String(ativo));
    ampliarCodigo.textContent = ativo ? "Voltar à explicação ↙" : "Ampliar código ↗";
}

ampliarCodigo.addEventListener("click", () => {
    mostrarCodigoAmpliado(!secaoCodigo.classList.contains("codigo-ampliado"));
});
document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") mostrarCodigoAmpliado(false);
});
document.getElementById("copiar-codigo").addEventListener("click", async () => {
    const linhas = document.querySelectorAll("#trecho-codigo .texto-codigo");
    const texto = Array.from(linhas, linha => linha.textContent).join("\n").trimEnd();
    const aviso = document.getElementById("aviso-codigo");
    try {
        await navigator.clipboard.writeText(texto);
        aviso.textContent = "Código copiado, sem a numeração das linhas.";
    } catch {
        aviso.textContent = "Não foi possível copiar. Selecione o código e use Ctrl+C.";
    }
});
