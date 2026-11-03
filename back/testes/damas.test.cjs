const { test } = require("node:test");
const assert = require("node:assert/strict");
const { criarJogo, movimentosPermitidos, moverPeca, contarPecas, interromperPartida } = require("../damas.js");

function preparar(pecas, jogador = 1) {
    const jogo = criarJogo();
    for (const linha of jogo.tabuleiro) linha.fill(0);
    for (const [linha, coluna, valor] of pecas) jogo.tabuleiro[linha][coluna] = valor;
    jogo.jogadorAtual = jogador;
    return jogo;
}

test("inicia com matriz 8 × 8, linhas independentes e 12 peças por jogador", () => {
    const jogo = criarJogo();
    assert.equal(jogo.tabuleiro.length, 8);
    assert.equal(new Set(jogo.tabuleiro).size, 8);
    assert.ok(jogo.tabuleiro.every(linha => linha.length === 8));
    assert.deepEqual(contarPecas(jogo), { jogador1: 12, jogador2: 12 });
    for (let l = 0; l < 8; l++) {
        for (let c = 0; c < 8; c++) {
            if ((l + c) % 2 === 0) assert.equal(jogo.tabuleiro[l][c], 0);
        }
    }
});

test("movimento inicial transfere a peça e troca a vez", () => {
    const jogo = criarJogo();
    assert.equal(moverPeca(jogo, 5, 0, 4, 1).sucesso, true);
    assert.equal(jogo.tabuleiro[5][0], 0);
    assert.equal(jogo.tabuleiro[4][1], 1);
    assert.equal(jogo.jogadorAtual, 2);
});

test("tentativas inválidas preservam todo o estado", () => {
    const jogo = criarJogo();
    const antes = structuredClone(jogo);
    for (const coordenadas of [[5, 0, 4, 0], [2, 1, 3, 0], [-1, 0, 4, 1], [5, 0, 9, 1]]) {
        assert.equal(moverPeca(jogo, ...coordenadas).sucesso, false);
        assert.deepEqual(jogo, antes);
    }
});

test("peça comum não anda para trás", () => {
    const jogo = preparar([[3, 2, 1], [0, 7, 2]]);
    assert.equal(moverPeca(jogo, 3, 2, 4, 3).sucesso, false);
});

test("captura obrigatória impede andar com outra peça e remove a adversária", () => {
    const jogo = preparar([[5, 0, 1], [5, 4, 1], [4, 1, 2], [0, 7, 2]]);
    assert.ok(movimentosPermitidos(jogo).every(m => m.capturada !== null));
    assert.equal(moverPeca(jogo, 5, 4, 4, 3).sucesso, false);
    assert.equal(moverPeca(jogo, 5, 0, 3, 2).sucesso, true);
    assert.equal(jogo.tabuleiro[4][1], 0);
    assert.deepEqual(contarPecas(jogo), { jogador1: 2, jogador2: 1 });
});

test("peça comum pode capturar para trás", () => {
    const jogo = preparar([[3, 2, 1], [4, 3, 2], [0, 7, 2]]);
    assert.equal(moverPeca(jogo, 3, 2, 5, 4).sucesso, true);
    assert.equal(jogo.tabuleiro[4][3], 0);
});

test("captura em sequência mantém a vez e obriga a usar a mesma peça", () => {
    const jogo = preparar([[5, 0, 1], [5, 6, 1], [4, 1, 2], [2, 3, 2], [0, 7, 2]]);
    moverPeca(jogo, 5, 0, 3, 2);
    assert.deepEqual(jogo.continuacao, { linha: 3, coluna: 2 });
    assert.equal(jogo.jogadorAtual, 1);
    assert.equal(moverPeca(jogo, 5, 6, 4, 5).sucesso, false);
    assert.equal(moverPeca(jogo, 3, 2, 1, 4).sucesso, true);
    assert.equal(jogo.continuacao, null);
    assert.equal(jogo.jogadorAtual, 2);
});

test("promove os dois jogadores na última linha", () => {
    const primeiro = preparar([[1, 2, 1], [5, 6, 2]]);
    moverPeca(primeiro, 1, 2, 0, 1);
    assert.equal(primeiro.tabuleiro[0][1], 3);
    const segundo = preparar([[2, 1, 1], [6, 5, 2]], 2);
    moverPeca(segundo, 6, 5, 7, 6);
    assert.equal(segundo.tabuleiro[7][6], 4);
});

test("passar pela última linha durante uma sequência não promove antes da hora", () => {
    const jogo = preparar([[2, 1, 1], [1, 2, 2], [1, 4, 2], [7, 6, 2]]);
    moverPeca(jogo, 2, 1, 0, 3);
    assert.equal(jogo.tabuleiro[0][3], 1);
    assert.deepEqual(jogo.continuacao, { linha: 0, coluna: 3 });
    moverPeca(jogo, 0, 3, 2, 5);
    assert.equal(jogo.tabuleiro[2][5], 1);
});

test("dama percorre uma diagonal longa", () => {
    const jogo = preparar([[6, 1, 3], [0, 7, 2]]);
    assert.equal(moverPeca(jogo, 6, 1, 1, 6).sucesso, true);
});

test("dama não atravessa peças próprias nem duas adversárias em uma etapa", () => {
    const propria = preparar([[7, 0, 3], [5, 2, 1], [0, 7, 2]]);
    assert.equal(moverPeca(propria, 7, 0, 4, 3).sucesso, false);
    const duas = preparar([[7, 0, 3], [5, 2, 2], [3, 4, 2]]);
    assert.equal(moverPeca(duas, 7, 0, 2, 5).sucesso, false);
    assert.equal(moverPeca(duas, 7, 0, 4, 3).sucesso, true);
    assert.equal(duas.tabuleiro[5][2], 0);
    assert.deepEqual(duas.continuacao, { linha: 4, coluna: 3 });
});

test("capturar a última adversária encerra a partida para ambos os jogadores", () => {
    for (const jogador of [1, 2]) {
        const adversario = jogador === 1 ? 2 : 1;
        const jogo = preparar([[5, 0, jogador], [4, 1, adversario]], jogador);
        moverPeca(jogo, 5, 0, 3, 2);
        assert.equal(jogo.encerrado, true);
        assert.equal(jogo.vencedor, jogador);
    }
});

test("jogador sem movimentos perde pela regra complementar", () => {
    const jogo = preparar([[5, 0, 1], [7, 6, 2]]);
    moverPeca(jogo, 5, 0, 4, 1);
    assert.equal(jogo.encerrado, true);
    assert.equal(jogo.vencedor, 1);
});

test("interrupção compara quantidades e conta dama como uma peça", () => {
    const primeiro = preparar([[5, 0, 1], [7, 6, 3], [2, 1, 2]]);
    assert.deepEqual(interromperPartida(primeiro), { vencedor: 1, empate: false });
    const segundo = preparar([[5, 0, 1], [2, 1, 2], [0, 7, 4]]);
    assert.deepEqual(interromperPartida(segundo), { vencedor: 2, empate: false });
    const empate = preparar([[5, 0, 3], [2, 1, 2]]);
    assert.deepEqual(interromperPartida(empate), { vencedor: null, empate: true });
});

test("partida encerrada rejeita movimentos e preserva o vencedor ao interromper", () => {
    const jogo = preparar([[5, 0, 1], [4, 1, 2]]);
    moverPeca(jogo, 5, 0, 3, 2);
    const antes = structuredClone(jogo);
    assert.equal(moverPeca(jogo, 3, 2, 2, 1).sucesso, false);
    assert.deepEqual(interromperPartida(jogo), { vencedor: 1, empate: false });
    assert.deepEqual(jogo, antes);
    assert.deepEqual(movimentosPermitidos(jogo), []);
});
