// INTERFACE — transforma cliques em chamadas da lógica e desenha o resultado.
let jogo;
let selecionada = null;
let ultimaJogada = null;
let numeroDaJogada = 0;

function buscar(id) {
    return document.getElementById(id);
}

function mesmaCasa(posicao, linha, coluna) {
    return posicao !== null && posicao.linha === linha && posicao.coluna === coluna;
}

// 1. DESENHAR O ESTADO ATUAL
function atualizarTela() {
    desenharTabuleiro();
    atualizarPlacar();
    desenharMatriz();
}

function desenharMatriz() {
    const tabela = buscar("matriz-viva");
    const cabecalho = document.createElement("thead");
    const indices = document.createElement("tr");
    for (const indice of ["L / C", 0, 1, 2, 3, 4, 5, 6, 7]) {
        const celula = document.createElement("th");
        celula.scope = "col";
        celula.textContent = indice;
        indices.append(celula);
    }
    cabecalho.append(indices);
    const corpo = document.createElement("tbody");
    jogo.tabuleiro.forEach((valores, linha) => {
        const registro = document.createElement("tr");
        const indice = document.createElement("th");
        indice.scope = "row";
        indice.textContent = linha;
        registro.append(indice);
        valores.forEach((valor, coluna) => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            celula.dataset.valor = valor;
            if (mesmaCasa(selecionada, linha, coluna)) celula.classList.add("matriz-selecionada");
            celula.title = `tabuleiro[${linha}][${coluna}] = ${valor}`;
            registro.append(celula);
        });
        corpo.append(registro);
    });
    tabela.querySelector("thead")?.remove();
    tabela.querySelector("tbody")?.remove();
    tabela.append(cabecalho, corpo);
    buscar("estado-vivo").textContent = JSON.stringify({
        jogadorAtual: jogo.jogadorAtual,
        continuacao: jogo.continuacao,
        encerrado: jogo.encerrado,
        vencedor: jogo.vencedor
    }, null, 2);
}

function desenharTabuleiro() {
    const tabuleiroNaTela = buscar("tabuleiro");
    const focoAnterior = document.activeElement?.dataset?.posicao;
    const destinos = movimentosPermitidos(jogo).filter(movimento =>
        mesmaCasa(selecionada, movimento.linha, movimento.coluna)
    );

    tabuleiroNaTela.replaceChildren();
    for (let linha = 0; linha < TAMANHO; linha++) {
        for (let coluna = 0; coluna < TAMANHO; coluna++) {
            tabuleiroNaTela.append(criarCasa(linha, coluna, destinos));
        }
    }

    // Recupera o foco para quem joga usando o teclado.
    if (focoAnterior) {
        const casaAnterior = tabuleiroNaTela.querySelector(`[data-posicao="${focoAnterior}"]`);
        casaAnterior?.focus({ preventScroll: true });
    }
}

function criarCasa(linha, coluna, destinos) {
    const valor = jogo.tabuleiro[linha][coluna];
    const jogador = donoDaPeca(valor);
    const casa = document.createElement("button");
    const destinoPermitido = destinos.some(movimento =>
        movimento.destinoLinha === linha && movimento.destinoColuna === coluna
    );

    casa.type = "button";
    casa.className = "casa";
    casa.dataset.posicao = `${linha},${coluna}`;
    if ((linha + coluna) % 2 === 1) casa.classList.add("escura");
    if (destinoPermitido) casa.classList.add("possivel");
    if (mesmaCasa(selecionada, linha, coluna)) casa.classList.add("selecionada");
    if (mesmaCasa(ultimaJogada, linha, coluna)) casa.classList.add("ultima");

    let descricao = "vazia";
    if (valor !== VAZIO) {
        let tipo = "peça";
        if (ehDama(valor)) tipo = "dama";
        descricao = `${tipo} do jogador ${jogador}`;
    }
    if (destinoPermitido) descricao += ", destino permitido";
    casa.setAttribute("aria-label", `Linha ${linha}, coluna ${coluna}: ${descricao}`);
    casa.setAttribute("aria-pressed", String(mesmaCasa(selecionada, linha, coluna)));

    const coordenada = document.createElement("span");
    coordenada.className = "coordenada";
    coordenada.textContent = `${linha},${coluna}`;
    casa.append(coordenada);

    if (valor !== VAZIO) {
        const peca = document.createElement("span");
        peca.className = `peca jogador-${jogador}`;
        if (ehDama(valor)) peca.textContent = "♛";
        peca.setAttribute("aria-hidden", "true");
        casa.append(peca);
    }

    casa.addEventListener("click", () => clicarNaCasa(linha, coluna));
    return casa;
}

function atualizarPlacar() {
    const quantidades = contarPecas(jogo);
    buscar("quantidade-1").textContent = quantidades.jogador1;
    buscar("quantidade-2").textContent = quantidades.jogador2;

    let titulo = `Vez do jogador ${jogo.jogadorAtual}`;
    let situacao = "EM ANDAMENTO";
    if (jogo.continuacao !== null) situacao = "CAPTURA EM SEQUÊNCIA";

    if (jogo.encerrado) {
        situacao = "ENCERRADA";
        titulo = "Partida empatada";
        if (jogo.vencedor !== null) titulo = `Jogador ${jogo.vencedor} venceu!`;
    }

    buscar("vez").textContent = titulo;
    buscar("situacao").textContent = situacao;
    buscar("situacao").dataset.encerrado = String(jogo.encerrado);
    buscar("interromper").disabled = jogo.encerrado;

    let indicador = jogo.jogadorAtual;
    if (jogo.encerrado) indicador = jogo.vencedor ?? 0;
    buscar("indicador-vez").dataset.jogador = indicador;

    for (const jogador of [1, 2]) {
        const cartao = buscar(`jogador-${jogador}`);
        const ativo = !jogo.encerrado && jogo.jogadorAtual === jogador;
        cartao.dataset.ativo = String(ativo);
        let estado = "Aguardando";
        if (ativo) estado = "Sua vez";
        if (jogo.encerrado) {
            estado = "Partida encerrada";
            if (jogo.vencedor === null) estado = "Empate";
            if (jogo.vencedor === jogador) estado = "Vencedor";
        }
        cartao.querySelector(".estado-jogador").textContent = estado;
    }
}

function mostrarMensagem(texto, tipo = "informacao") {
    buscar("mensagem").textContent = texto;
    buscar("mensagem").dataset.tipo = tipo;
}

function explicar(mensagem, explicacao, codigo, tipo = "informacao") {
    mostrarMensagem(mensagem, tipo);
    buscar("explicacao-viva").textContent = explicacao;
    buscar("codigo-vivo").textContent = codigo;
}

// 2. SELECIONAR UMA PEÇA OU TENTAR UMA JOGADA
function clicarNaCasa(linha, coluna) {
    if (jogo.encerrado) return;

    const peca = jogo.tabuleiro[linha][coluna];
    if (donoDaPeca(peca) === jogo.jogadorAtual) {
        selecionarPeca(linha, coluna);
    } else if (selecionada === null) {
        mostrarMensagem(`Selecione primeiro uma peça do jogador ${jogo.jogadorAtual}.`);
    } else {
        tentarMover(linha, coluna);
    }
}

function selecionarPeca(linha, coluna) {
    if (jogo.continuacao !== null && !mesmaCasa(jogo.continuacao, linha, coluna)) {
        mostrarMensagem("Continue a captura com a mesma peça marcada.");
        return;
    }

    selecionada = { linha, coluna };
    const opcoes = movimentosPermitidos(jogo).filter(movimento =>
        movimento.linha === linha && movimento.coluna === coluna
    );
    let mensagem = "Agora escolha uma das casas marcadas.";
    if (opcoes.length === 0) {
        mensagem = "Esta peça não pode se mover agora. Pode haver captura obrigatória com outra peça.";
    }

    explicar(
        mensagem,
        `Consultamos tabuleiro[${linha}][${coluna}] e os destinos permitidos. Nenhuma peça foi movida ainda.`,
        `jogo.tabuleiro[${linha}][${coluna}] // valor: ${jogo.tabuleiro[linha][coluna]}`
    );
    atualizarTela();
}

function tentarMover(linha, coluna) {
    const origem = selecionada;
    const movimento = movimentosPermitidos(jogo).find(opcao =>
        opcao.linha === origem.linha && opcao.coluna === origem.coluna &&
        opcao.destinoLinha === linha && opcao.destinoColuna === coluna
    );
    const valorAntes = jogo.tabuleiro[origem.linha][origem.coluna];
    const jogadorAntes = jogo.jogadorAtual;
    const resultado = moverPeca(jogo, origem.linha, origem.coluna, linha, coluna);

    if (!resultado.sucesso) {
        explicar(
            "Movimento proibido. Escolha uma casa marcada.",
            "A validação rejeitou o destino. A matriz e a vez continuam iguais.",
            "if (!movimento) return { sucesso: false, ... };",
            "erro"
        );
        return;
    }

    const promoveu = !ehDama(valorAntes) && ehDama(jogo.tabuleiro[linha][coluna]);
    const frente = jogadorAntes === 1 ? -1 : 1;
    const capturouParaTras = !ehDama(valorAntes) && movimento.capturada !== null &&
        (linha - origem.linha) * frente < 0;
    let registro = `Jogador ${jogadorAntes}: ${origem.linha},${origem.coluna} → ${linha},${coluna}`;
    if (movimento.capturada !== null) registro += capturouParaTras ? " · captura para trás" : " · captura";
    if (promoveu) registro += " · virou dama";
    registrar(registro);
    explicarJogada(movimento, promoveu, capturouParaTras);

    ultimaJogada = { linha, coluna };
    selecionada = jogo.continuacao;
    atualizarTela();
}

function explicarJogada(movimento, promoveu, capturouParaTras = false) {
    const { linha, coluna, destinoLinha, destinoColuna, capturada } = movimento;
    let texto = `A origem [${linha}][${coluna}] recebeu 0 e o destino [${destinoLinha}][${destinoColuna}] recebeu a peça.`;
    if (capturada !== null) texto += ` A adversária em [${capturada.linha}][${capturada.coluna}] foi removida.`;
    if (capturouParaTras) texto += " A peça comum capturou para trás! A direção de frente restringe apenas os movimentos sem captura.";
    if (promoveu) texto += " A peça chegou à última linha e virou dama.";

    let mensagem = `Jogada concluída. Agora é a vez do jogador ${jogo.jogadorAtual}.`;
    if (jogo.continuacao !== null) {
        mensagem = "Você deve continuar capturando com a mesma peça.";
        texto += " Há outra captura: a vez continua com o mesmo jogador.";
    } else if (jogo.encerrado) {
        mensagem = `Fim da partida: jogador ${jogo.vencedor} venceu.`;
        texto += " A condição de vitória foi alcançada.";
    } else {
        texto += " A vez passou para o outro jogador.";
    }
    if (capturouParaTras) mensagem = `Captura para trás realizada! ${mensagem}`;
    explicar(mensagem, texto, `moverPeca(jogo, ${linha}, ${coluna}, ${destinoLinha}, ${destinoColuna});`);
}

// 3. HISTÓRICO, NOVA PARTIDA E INTERRUPÇÃO
function registrar(texto) {
    const historico = buscar("historico");
    if (numeroDaJogada === 0) historico.replaceChildren();
    numeroDaJogada++;
    let unidade = "registros";
    if (numeroDaJogada === 1) unidade = "registro";
    buscar("contador-historico").textContent = `${numeroDaJogada} ${unidade}`;
    const item = document.createElement("li");
    item.textContent = texto;
    historico.append(item);
    historico.scrollTop = historico.scrollHeight;
}

function iniciarPartida(novoJogo = criarJogo()) {
    jogo = novoJogo;
    selecionada = null;
    ultimaJogada = null;
    numeroDaJogada = 0;
    buscar("contador-historico").textContent = "0 registros";
    const item = document.createElement("li");
    item.className = "vazio";
    item.textContent = "A primeira jogada começa com você.";
    buscar("historico").replaceChildren(item);
    explicar(
        "Nova partida! Selecione uma peça clara para começar.",
        "Criamos uma matriz de 8 linhas e 8 colunas, com 12 peças para cada jogador.",
        "const jogo = criarJogo();"
    );
    atualizarTela();
}

function interromperJogoNaTela() {
    const resultado = interromperPartida(jogo);
    selecionada = null;
    let mensagem = `Partida interrompida: jogador ${resultado.vencedor} venceu pela quantidade de peças.`;
    if (resultado.empate) mensagem = "Partida interrompida: empate na quantidade de peças.";
    explicar(
        mensagem,
        "Percorremos a matriz, contamos e comparamos as peças. Damas também contam como uma peça.",
        "interromperPartida(jogo);"
    );
    registrar("Partida interrompida por comparação de peças.");
    atualizarTela();
}

buscar("reiniciar").addEventListener("click", () => iniciarPartida());
buscar("interromper").addEventListener("click", interromperJogoNaTela);
buscar("mostrar-coordenadas").addEventListener("change", evento => {
    buscar("tabuleiro").classList.toggle("sem-coordenadas", !evento.target.checked);
    document.querySelector(".moldura").classList.toggle("sem-eixos", !evento.target.checked);
});

function alternarFoco(ativar) {
    document.body.classList.toggle("modo-foco", ativar);
    const botao = buscar("alternar-foco");
    botao.setAttribute("aria-pressed", String(ativar));
    botao.textContent = ativar ? "Sair do foco" : "Focar no jogo";
}

buscar("alternar-foco").addEventListener("click", () => {
    alternarFoco(!document.body.classList.contains("modo-foco"));
});
document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") alternarFoco(false);
});
iniciarPartida();
