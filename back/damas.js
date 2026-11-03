// REGRAS DO JOGO — este arquivo não acessa o HTML.
// Matriz: 0 = vazio; 1 e 2 = peças; 3 e 4 = damas. Índices: de 0 a 7.
const TAMANHO = 8;
const VAZIO = 0;
const DIAGONAIS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

// 1. CRIAR A PARTIDA
function criarJogo() {
    const tabuleiro = [];

    for (let linha = 0; linha < TAMANHO; linha++) {
        tabuleiro[linha] = [];

        for (let coluna = 0; coluna < TAMANHO; coluna++) {
            tabuleiro[linha][coluna] = VAZIO;
            const casaEscura = (linha + coluna) % 2 === 1;

            if (casaEscura && linha < 3) tabuleiro[linha][coluna] = 2;
            if (casaEscura && linha > 4) tabuleiro[linha][coluna] = 1;
        }
    }

    return {
        tabuleiro,
        jogadorAtual: 1,
        continuacao: null,
        encerrado: false,
        vencedor: null,
    };
}

// 2. CONSULTAR AS PEÇAS E AS POSIÇÕES
function donoDaPeca(peca) {
    if (peca === 1 || peca === 3) return 1;
    if (peca === 2 || peca === 4) return 2;
    return 0;
}

function ehDama(peca) {
    return peca === 3 || peca === 4;
}

function outroJogador(jogador) {
    if (jogador === 1) return 2;
    return 1;
}

function dentroDoTabuleiro(linha, coluna) {
    return Number.isInteger(linha) && Number.isInteger(coluna) &&
        linha >= 0 && linha < TAMANHO && coluna >= 0 && coluna < TAMANHO;
}

// 3. CALCULAR DESTINOS — sem alterar a matriz
// Cada movimento guarda origem, destino e a adversária capturada (ou null).
function movimentosDaPecaComum(jogo, linha, coluna) {
    const movimentos = [];
    const jogador = donoDaPeca(jogo.tabuleiro[linha][coluna]);
    let frente = -1;
    if (jogador === 2) frente = 1;

    for (const diagonal of DIAGONAIS) {
        const passoLinha = diagonal[0];
        const passoColuna = diagonal[1];
        const vizinhaLinha = linha + passoLinha;
        const vizinhaColuna = coluna + passoColuna;
        if (!dentroDoTabuleiro(vizinhaLinha, vizinhaColuna)) continue;

        const vizinha = jogo.tabuleiro[vizinhaLinha][vizinhaColuna];

        // Andar: uma casa vazia, apenas para frente.
        if (vizinha === VAZIO && passoLinha === frente) {
            movimentos.push({
                linha, coluna,
                destinoLinha: vizinhaLinha, destinoColuna: vizinhaColuna,
                capturada: null,
            });
        }

        // Capturar: saltar uma adversária, para frente ou para trás.
        if (donoDaPeca(vizinha) !== outroJogador(jogador)) continue;
        const destinoLinha = linha + 2 * passoLinha;
        const destinoColuna = coluna + 2 * passoColuna;
        if (!dentroDoTabuleiro(destinoLinha, destinoColuna)) continue;
        if (jogo.tabuleiro[destinoLinha][destinoColuna] !== VAZIO) continue;

        movimentos.push({
            linha, coluna, destinoLinha, destinoColuna,
            capturada: { linha: vizinhaLinha, coluna: vizinhaColuna },
        });
    }
    return movimentos;
}

function movimentosDaDama(jogo, linha, coluna) {
    const movimentos = [];
    const jogador = donoDaPeca(jogo.tabuleiro[linha][coluna]);

    for (const diagonal of DIAGONAIS) {
        const passoLinha = diagonal[0];
        const passoColuna = diagonal[1];
        let destinoLinha = linha + passoLinha;
        let destinoColuna = coluna + passoColuna;
        let capturada = null;

        // A dama percorre a diagonal até a borda ou um obstáculo.
        while (dentroDoTabuleiro(destinoLinha, destinoColuna)) {
            const encontrada = jogo.tabuleiro[destinoLinha][destinoColuna];

            if (encontrada === VAZIO) {
                movimentos.push({ linha, coluna, destinoLinha, destinoColuna, capturada });
            } else {
                if (donoDaPeca(encontrada) === jogador) break;
                if (capturada !== null) break;
                capturada = { linha: destinoLinha, coluna: destinoColuna };
            }

            destinoLinha += passoLinha;
            destinoColuna += passoColuna;
        }
    }
    return movimentos;
}

function movimentosDaPeca(jogo, linha, coluna) {
    const peca = jogo.tabuleiro[linha][coluna];
    if (peca === VAZIO) return [];
    if (ehDama(peca)) return movimentosDaDama(jogo, linha, coluna);
    return movimentosDaPecaComum(jogo, linha, coluna);
}

function movimentosPermitidos(jogo) {
    if (jogo.encerrado) return [];
    const movimentos = [];

    for (let linha = 0; linha < TAMANHO; linha++) {
        for (let coluna = 0; coluna < TAMANHO; coluna++) {
            const peca = jogo.tabuleiro[linha][coluna];
            if (donoDaPeca(peca) !== jogo.jogadorAtual) continue;

            // Em uma sequência, somente a peça que capturou pode jogar.
            if (jogo.continuacao !== null) {
                if (linha !== jogo.continuacao.linha || coluna !== jogo.continuacao.coluna) continue;
            }

            for (const movimento of movimentosDaPeca(jogo, linha, coluna)) {
                movimentos.push(movimento);
            }
        }
    }

    const capturas = movimentos.filter(movimento => movimento.capturada !== null);
    if (jogo.continuacao !== null || capturas.length > 0) return capturas;
    return movimentos;
}

// 4. VALIDAR E EXECUTAR UMA JOGADA
function moverPeca(jogo, linha, coluna, destinoLinha, destinoColuna) {
    if (jogo.encerrado) {
        return { sucesso: false, mensagem: "A partida já terminou." };
    }

    const movimento = movimentosPermitidos(jogo).find(opcao =>
        opcao.linha === linha && opcao.coluna === coluna &&
        opcao.destinoLinha === destinoLinha && opcao.destinoColuna === destinoColuna
    );

    if (!movimento) {
        return { sucesso: false, mensagem: "Movimento proibido." };
    }

    executarMovimento(jogo, movimento);
    atualizarVez(jogo, movimento);
    verificarVitoria(jogo);

    let mensagem = "Peça movida.";
    if (jogo.encerrado) mensagem = "Partida encerrada.";
    return { sucesso: true, mensagem };
}

function executarMovimento(jogo, movimento) {
    const peca = jogo.tabuleiro[movimento.linha][movimento.coluna];
    jogo.tabuleiro[movimento.linha][movimento.coluna] = VAZIO;
    jogo.tabuleiro[movimento.destinoLinha][movimento.destinoColuna] = peca;

    if (movimento.capturada !== null) {
        const capturada = movimento.capturada;
        jogo.tabuleiro[capturada.linha][capturada.coluna] = VAZIO;
    }
}

function atualizarVez(jogo, movimento) {
    const linha = movimento.destinoLinha;
    const coluna = movimento.destinoColuna;
    jogo.continuacao = null;

    if (movimento.capturada !== null) {
        const proximos = movimentosDaPeca(jogo, linha, coluna);
        const podeCapturarDeNovo = proximos.some(opcao => opcao.capturada !== null);

        if (podeCapturarDeNovo) {
            jogo.continuacao = { linha, coluna };
            return; // Mantém a vez e adia a promoção até terminar a sequência.
        }
    }

    promoverPeca(jogo, linha, coluna);
    jogo.jogadorAtual = outroJogador(jogo.jogadorAtual);
}

function promoverPeca(jogo, linha, coluna) {
    const peca = jogo.tabuleiro[linha][coluna];
    if (peca === 1 && linha === 0) jogo.tabuleiro[linha][coluna] = 3;
    if (peca === 2 && linha === TAMANHO - 1) jogo.tabuleiro[linha][coluna] = 4;
}

// 5. CONTAR E ENCERRAR
function contarPecas(jogo) {
    const quantidades = { jogador1: 0, jogador2: 0 };

    for (const linha of jogo.tabuleiro) {
        for (const peca of linha) {
            const jogador = donoDaPeca(peca);
            if (jogador === 1) quantidades.jogador1++;
            if (jogador === 2) quantidades.jogador2++;
        }
    }
    return quantidades;
}

function encerrarJogo(jogo, vencedor) {
    jogo.encerrado = true;
    jogo.vencedor = vencedor; // null representa empate.
    jogo.continuacao = null;
}

function verificarVitoria(jogo) {
    const quantidades = contarPecas(jogo);
    if (quantidades.jogador1 === 0) {
        encerrarJogo(jogo, 2);
    } else if (quantidades.jogador2 === 0) {
        encerrarJogo(jogo, 1);
    } else if (jogo.continuacao === null && movimentosPermitidos(jogo).length === 0) {
        encerrarJogo(jogo, outroJogador(jogo.jogadorAtual));
    }
}

function interromperPartida(jogo) {
    if (!jogo.encerrado) {
        const quantidades = contarPecas(jogo);
        let vencedor = null;

        if (quantidades.jogador1 > quantidades.jogador2) vencedor = 1;
        if (quantidades.jogador2 > quantidades.jogador1) vencedor = 2;

        encerrarJogo(jogo, vencedor);
    }
    return { vencedor: jogo.vencedor, empate: jogo.vencedor === null };
}

// No navegador, front/index.html carrega este arquivo com ../back/damas.js.
// No Node.js, esta exportação permite verificar as regras sem abrir a página.
if (typeof module !== "undefined") {
    module.exports = { criarJogo, movimentosPermitidos, moverPeca, contarPecas, interromperPartida };
}
