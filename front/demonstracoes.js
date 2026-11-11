// TABULEIROS PREPARADOS — recurso opcional para a apresentação.
// Cada trio representa [linha, coluna, valorDaPeca]. As regras continuam em damas.js.
const cenarios = {
    inicio: {
        instrucao: "Partida inicial: 12 peças para cada jogador. Inspecione a matriz e selecione uma casa.",
    },
    captura: {
        pecas: [[5, 0, 1], [5, 4, 1], [4, 1, 2], [2, 3, 2], [0, 7, 2]],
        instrucao: "Mova 5,0 → 3,2 e depois 3,2 → 1,4. A mesma peça captura duas vezes.",
    },
    capturaTras: {
        pecas: [[4, 3, 1], [5, 4, 2], [0, 7, 2]],
        instrucao: "Selecione a peça comum em (4, 3) e clique em (6, 5). Ela salta a adversária em (5, 4), capturando para trás.",
        explicacao: "O jogador 1 anda para frente diminuindo a linha. Nesta captura, a linha aumenta de 4 para 6: a peça comum pode comer para trás, mas não andar para trás sem capturar.",
        codigo: "// Captura: não exige passoLinha === frente.\nconst destinoLinha = linha + 2 * passoLinha;",
    },
    promocao: {
        pecas: [[1, 2, 1], [5, 6, 2]],
        instrucao: "Mova 1,2 → 0,1. A peça clara vira dama e recebe o valor 3.",
    },
    vitoria: {
        pecas: [[5, 0, 1], [4, 1, 2]],
        instrucao: "Mova 5,0 → 3,2. A última adversária é capturada e o jogador 1 vence.",
    },
    interrupcao: {
        pecas: [[5, 0, 1], [5, 2, 1], [7, 6, 3], [2, 1, 2]],
        instrucao: "Clique em Interromper. O jogador 1 tem três peças, incluindo uma dama, contra uma.",
    },
    dama: {
        pecas: [[5, 2, 3], [3, 4, 2], [6, 7, 2]],
        instrucao: "Selecione a dama em (5, 2). Ela pode capturar (3, 4) e pousar em (2, 5), (1, 6) ou (0, 7).",
    },
    empate: {
        pecas: [[5, 0, 1], [5, 2, 1], [2, 1, 2], [2, 3, 2]],
        instrucao: "Clique em Interromper. Cada jogador tem duas peças e o resultado será empate.",
    },
};

function carregarDemonstracao(nome) {
    const cenario = cenarios[nome];
    const exemplo = criarJogo();

    if (cenario.pecas) {
    for (const linha of exemplo.tabuleiro) {
        for (let coluna = 0; coluna < TAMANHO; coluna++) {
            linha[coluna] = VAZIO;
        }
    }

    for (const posicao of cenario.pecas) {
        const linha = posicao[0];
        const coluna = posicao[1];
        exemplo.tabuleiro[linha][coluna] = posicao[2];
    }
    }

    iniciarPartida(exemplo);
    explicar(
        cenario.instrucao,
        cenario.explicacao ?? "Exemplo preparado para demonstrar uma regra por vez.",
        cenario.codigo ?? "jogo.tabuleiro[linha][coluna]"
    );
}

document.querySelectorAll("[data-cenario]").forEach(botao => {
    botao.addEventListener("click", () => carregarDemonstracao(botao.dataset.cenario));
});
