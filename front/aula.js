// AULA INTERATIVA — apenas explicações e navegação entre etapas.
const etapas = [
    {
        nome: "A matriz",
        titulo: "Um tabuleiro é uma matriz.",
        texto: "Um array guarda uma sequência de valores. Um array bidimensional guarda linhas, e cada linha guarda suas colunas. Com dois índices, encontramos qualquer uma das 64 casas.",
        detalhe:
            "Leia <code>tabuleiro[5][0]</code> como “linha 5, coluna 0”. Os índices vão de 0 a 7. Os dois laços percorrem todas as casas.",
        inicio: "function criarJogo()",
        fim: "// 2. CONSULTAR",
        destaques: ["tabuleiro[linha] = []", "tabuleiro[linha][coluna] ="],
        legenda: "Valores: 0 = vazio · 1 e 2 = peças comuns · 3 e 4 = damas.",
    },
    {
        nome: "A validação",
        titulo: "Primeiro validar. Depois mover.",
        texto: "Antes de alterar a matriz, procuramos a jogada na lista de movimentos permitidos. Essa lista já considera a vez, as diagonais, os obstáculos e a obrigação de capturar.",
        detalhe:
            "O método <code>find</code> procura uma jogada que tenha exatamente a origem e o destino escolhidos. Se não encontrar, a função retorna e não modifica o tabuleiro.",
        inicio: "function moverPeca",
        fim: "    executarMovimento(jogo, movimento);",
        destaques: ["movimentosPermitidos", "if (!movimento)"],
        legenda:
            "Uma tentativa inválida retorna sucesso: false. O estado da partida é preservado.",
    },
    {
        nome: "A captura",
        titulo: "Mover é atualizar posições.",
        texto: "Uma jogada válida transfere o valor da peça para a casa de destino. A casa de origem fica vazia. Se houve captura, a posição da adversária também fica vazia.",
        detalhe:
            "Não criamos um novo tabuleiro a cada clique. Atualizamos as posições necessárias na matriz que está dentro do objeto <code>jogo</code>.",
        inicio: "function executarMovimento(",
        fim: "function atualizarVez(",
        destaques: ["= VAZIO", "= peca"],
        legenda:
            "A interface redesenha o tabuleiro a partir desses valores; ela não decide as regras.",
    },
    {
        nome: "A dama",
        titulo: "Uma peça ganha novos movimentos.",
        texto: "Ao terminar sua jogada na última linha do adversário, a peça é promovida. A peça 1 vira 3; a peça 2 vira 4. A função ehDama reconhece esses valores e escolhe os movimentos da dama.",
        detalhe:
            "A promoção acontece depois da sequência de capturas. Se a peça apenas passar pela última linha e continuar capturando, ainda não vira dama.",
        inicio: "function promoverPeca(",
        fim: "// 5. CONTAR",
        destaques: ["= 3", "= 4"],
        legenda:
            "promoverPeca altera o valor na matriz. atualizarVez chama essa função ao terminar a jogada.",
    },
    {
        nome: "O resultado",
        titulo: "Contar, comparar e encerrar.",
        texto: "Na interrupção, contamos as peças dos dois jogadores. Quem tem mais vence. Se as quantidades forem iguais, registramos null como vencedor e informamos o empate.",
        detalhe:
            "A flag <code>encerrado</code> bloqueia novas jogadas. Durante o jogo normal, a vitória também é verificada após cada movimento, por eliminação ou falta de movimentos do adversário.",
        inicio: "function interromperPartida",
        fim: "// No navegador",
        destaques: ["vencedor =", "encerrarJogo", "empate:"],
        legenda:
            "O PDF pede a comparação de peças na interrupção. A igualdade foi tratada como empate.",
    },
];
let etapaAtual = 0;
function mostrarEtapa(indice) {
    etapaAtual = indice;
    document
        .querySelector(".conteudo-aula")
        .setAttribute("aria-labelledby", `aba-${indice}`);
    const etapa = etapas[indice];
    buscar("numero-aula").textContent = `0${indice + 1} / 0${etapas.length}`;
    buscar("titulo-aula").textContent = etapa.titulo;
    buscar("texto-aula").textContent = etapa.texto;
    buscar("detalhe-aula").innerHTML = etapa.detalhe;
    buscar("legenda-codigo").textContent = etapa.legenda;
    const fonte = CODIGO_DAMAS.split("\n");
    const contexto = etapa.contexto
        ? fonte.findIndex((linha) => linha.includes(etapa.contexto))
        : 0;
    const inicio = fonte.findIndex(
        (linha, posicao) => posicao >= contexto && linha.includes(etapa.inicio),
    );
    const fim = fonte.findIndex(
        (linha, posicao) => posicao > inicio && linha.includes(etapa.fim),
    );
    if (inicio < 0 || fim < 0) {
        throw new Error(`Trecho da aula não encontrado: ${etapa.nome}`);
    }
    buscar("trecho-codigo").replaceChildren();
    fonte
        .slice(inicio, fim < 0 ? fonte.length : fim)
        .forEach((linha, posicao) => {
            const elemento = document.createElement("span");
            elemento.className =
                "linha-codigo" +
                (etapa.destaques.some((trecho) => linha.includes(trecho))
                    ? " destaque"
                    : "");
            const numero = document.createElement("span");
            numero.className = "numero-linha";
            numero.textContent = inicio + posicao + 1;
            elemento.append(numero, document.createTextNode(linha || " "));
            buscar("trecho-codigo").append(elemento);
        });
    document.querySelectorAll("[role=tab]").forEach((aba, posicao) => {
        aba.setAttribute("aria-selected", String(posicao === indice));
        aba.tabIndex = posicao === indice ? 0 : -1;
    });
    buscar("proxima-aula").textContent =
        indice === etapas.length - 1
            ? "Voltar à primeira etapa ↻"
            : "Próxima etapa →";
}
const abas = document.querySelector(".abas");
etapas.forEach((etapa, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = `0${indice + 1}  ${etapa.nome}`;
    botao.id = `aba-${indice}`;
    botao.setAttribute("role", "tab");
    botao.setAttribute("aria-controls", "painel-aula");
    botao.addEventListener("click", () => mostrarEtapa(indice));
    botao.addEventListener("keydown", (evento) => {
        let destino;
        if (evento.key === "ArrowRight") destino = (indice + 1) % etapas.length;
        if (evento.key === "ArrowLeft")
            destino = (indice + etapas.length - 1) % etapas.length;
        if (evento.key === "Home") destino = 0;
        if (evento.key === "End") destino = etapas.length - 1;
        if (destino !== undefined) {
            evento.preventDefault();
            mostrarEtapa(destino);
            abas.children[destino].focus();
        }
    });
    abas.append(botao);
});
const painelAula = document.querySelector(".conteudo-aula");
painelAula.id = "painel-aula";
painelAula.setAttribute("role", "tabpanel");
buscar("proxima-aula").addEventListener("click", () =>
    mostrarEtapa((etapaAtual + 1) % etapas.length),
);
mostrarEtapa(0);
