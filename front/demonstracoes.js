// TABULEIROS PREPARADOS — recurso opcional para a apresentação.
// Cada trio representa [linha, coluna, valorDaPeca]. As regras continuam em damas.js.
const cenarios = {
    captura: {
        pecas: [[5, 0, 1], [4, 1, 2], [2, 3, 2], [0, 7, 2]],
        instrucao: "Mova 5,0 → 3,2 e depois 3,2 → 1,4. A mesma peça captura duas vezes.",
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
};

function carregarDemonstracao(nome) {
    const cenario = cenarios[nome];
    const exemplo = criarJogo();

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

    iniciarPartida(exemplo);
    explicar(cenario.instrucao, "Exemplo preparado para demonstrar uma regra por vez.", "jogo.tabuleiro[linha][coluna]");
}

document.querySelectorAll("[data-cenario]").forEach(botao => {
    botao.addEventListener("click", () => carregarDemonstracao(botao.dataset.cenario));
});
