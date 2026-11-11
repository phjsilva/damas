// ROTEIRO DA APRESENTAÇÃO — trechos da lógica real e demonstrações por requisito.
const etapas = [
    {
        "nome": "Matriz",
        "requisito": "Tabuleiro em array bidimensional",
        "titulo": "O tabuleiro começa nos dados.",
        "texto": "O tabuleiro é um array de arrays: cada array interno representa uma linha. Os índices de linha e coluna dão acesso a uma das 64 casas.",
        "detalhe": "Em <code>tabuleiro[5][0]</code>, 5 é a linha e 0 é a coluna. A expressão <code>(linha + coluna) % 2</code> identifica a paridade e distribui as peças nas casas escuras.",
        "trechos": [
            [
                "function criarJogo()",
                "// 2. CONSULTAR"
            ]
        ],
        "destaques": [
            "for (let",
            "tabuleiro[linha]",
            "% 2"
        ],
        "legenda": "Valores: 0 = vazio · 1 e 2 = peças comuns · 3 e 4 = damas.",
        "termos": [
            [
                "Matriz",
                "Estrutura bidimensional acessada por dois índices."
            ],
            [
                "Laços aninhados",
                "O laço externo percorre linhas; o interno, colunas."
            ]
        ],
        "cenario": "inicio",
        "instrucao": "Prepare a partida inicial. Abra o inspetor da matriz e selecione a peça em (5, 0): a casa correspondente será destacada na tabela."
    },
    {
        "nome": "Diagonais",
        "requisito": "Respeitar os movimentos permitidos das peças",
        "titulo": "Quatro direções, uma de cada vez.",
        "texto": "A peça comum examina as quatro diagonais. Pode andar uma casa para frente ou saltar uma adversária nos dois sentidos, desde que exista uma casa vazia depois dela.",
        "detalhe": "<code>diagonal[0]</code> pega o primeiro valor do par atual, não o número zero. O par muda em cada iteração: <code>[-1,-1], [-1,1], [1,-1], [1,1]</code>.",
        "trechos": [
            [
                "function movimentosDaPecaComum(",
                "function movimentosDaDama("
            ]
        ],
        "destaques": [
            "passoLinha",
            "passoColuna",
            "dentroDoTabuleiro",
            "passoLinha === frente"
        ],
        "legenda": "O cálculo gera opções sem modificar a matriz. Andar e capturar têm verificações diferentes.",
        "termos": [
            [
                "Deslocamento",
                "Variação somada aos índices para obter outra posição."
            ],
            [
                "Validação de limites",
                "Impede acessar uma posição fora das linhas e colunas válidas."
            ]
        ],
        "cenario": "captura",
        "instrucao": "Selecione (5, 0). A adversária está em (4, 1), e a casa de chegada é (3, 2): a captura usa duas vezes o deslocamento."
    },
    {
        "nome": "Captura obrigatória",
        "requisito": "Bloquear movimentos proibidos",
        "titulo": "Pode capturar? Então deve capturar.",
        "texto": "Reunimos as opções das peças do jogador atual. Depois, separamos as capturas. Se existir alguma, os movimentos simples deixam de ser retornados.",
        "detalhe": "Durante uma sequência, <code>jogo.continuacao</code> guarda a posição da única peça que pode jogar. O <code>filter</code> cria outra lista e mantém apenas os movimentos cujo campo <code>capturada</code> não é null.",
        "trechos": [
            [
                "function movimentosPermitidos(",
                "// 4. VALIDAR"
            ]
        ],
        "destaques": [
            "jogo.jogadorAtual",
            "jogo.continuacao",
            ".filter",
            "return capturas"
        ],
        "legenda": "A captura obrigatória vale para o jogador inteiro, mesmo que outra peça pudesse andar.",
        "termos": [
            [
                "Filtragem",
                "Seleção dos elementos de um array que atendem a uma condição."
            ],
            [
                "Predicado",
                "A condição usada pelo filtro: movimento.capturada !== null."
            ]
        ],
        "cenario": "captura",
        "instrucao": "Selecione (5, 4): essa peça fica sem destinos porque outra pode capturar. Depois selecione (5, 0), que possui a captura obrigatória."
    },
    {
        "nome": "Validação",
        "requisito": "Validar antes de alterar o tabuleiro",
        "titulo": "A jogada precisa estar na lista.",
        "texto": "A origem e o destino escolhidos são comparados com a lista de jogadas permitidas. Só uma correspondência completa autoriza a atualização do tabuleiro.",
        "detalhe": "<code>find</code> procura uma opção com as quatro coordenadas iguais às solicitadas. Se não encontrar, ocorre um retorno antecipado. Se encontrar, a origem recebe 0 e o destino recebe a peça.",
        "trechos": [
            [
                "function moverPeca(",
                "function atualizarVez("
            ]
        ],
        "destaques": [
            ".find",
            "return { sucesso: false",
            "executarMovimento(jogo, movimento);",
            "= VAZIO",
            "= peca"
        ],
        "legenda": "moverPeca valida e coordena; executarMovimento altera as posições necessárias na mesma matriz.",
        "termos": [
            [
                "Busca linear",
                "find examina as opções até encontrar uma correspondência ou chegar ao fim."
            ],
            [
                "Retorno antecipado",
                "Encerra a função imediatamente quando uma condição impede a jogada."
            ]
        ],
        "cenario": "captura",
        "instrucao": "Selecione (5, 0) e tente (4, 3), uma casa não marcada: a jogada será rejeitada. Depois clique em (3, 2) para executar uma captura válida."
    },
    {
        "nome": "Turnos",
        "requisito": "Partida entre dois jogadores",
        "titulo": "Continuar comendo ou passar a vez?",
        "texto": "Depois de uma captura, consultamos os movimentos da mesma peça na nova posição. Se ela puder capturar novamente, mantém a vez. Caso contrário, verifica a promoção e alterna o jogador.",
        "detalhe": "<code>some</code> responde true se pelo menos uma opção atender à condição. O <code>return</code> mantém o jogador atual e adia a promoção até terminar a sequência.",
        "trechos": [
            [
                "function atualizarVez(",
                "function promoverPeca("
            ]
        ],
        "destaques": [
            ".some",
            "jogo.continuacao",
            "return;",
            "outroJogador"
        ],
        "legenda": "A continuação armazena coordenadas. Somente a peça indicada pode fazer o próximo salto.",
        "termos": [
            [
                "Teste de existência",
                "some informa se existe pelo menos um elemento que satisfaz o predicado."
            ],
            [
                "Estado da partida",
                "Dados que registram de quem é a vez e se uma sequência deve continuar."
            ]
        ],
        "cenario": "captura",
        "instrucao": "Faça (5, 0) → (3, 2). O jogador 1 mantém a vez. Faça (3, 2) → (1, 4): a sequência acaba e a vez passa ao jogador 2."
    },
    {
        "nome": "Dama",
        "requisito": "Permitir a obtenção de uma dama",
        "titulo": "Um novo valor, novos movimentos.",
        "texto": "Ao terminar a jogada na extremidade adversária, a peça 1 vira 3 e a peça 2 vira 4. A dama percorre várias casas na mesma diagonal até encontrar um bloqueio ou a borda.",
        "detalhe": "<code>promoverPeca</code> atualiza o valor da casa. Em <code>movimentosDaDama</code>, o for escolhe a direção, o while percorre a diagonal e o break encerra o percurso quando encontra um bloqueio.",
        "trechos": [
            [
                "function promoverPeca(",
                "// 5. CONTAR"
            ],
            [
                "function movimentosDaDama(",
                "function movimentosDaPeca("
            ]
        ],
        "destaques": [
            "= 3",
            "= 4",
            "while (",
            "break",
            "capturada ="
        ],
        "legenda": "A promoção acontece após a sequência. A dama também conta como uma peça no placar.",
        "termos": [
            [
                "Percurso sequencial",
                "Examina uma casa após outra ao longo da diagonal."
            ],
            [
                "Condição de parada",
                "A borda ou um obstáculo encerra o percurso daquela direção."
            ]
        ],
        "cenario": "promocao",
        "instrucao": "Faça (1, 2) → (0, 1). Veja a coroa e o valor 3 na matriz. Jogue (5, 6) → (6, 5) com o jogador 2 e selecione a nova dama para mostrar seus destinos."
    },
    {
        "nome": "Vitória",
        "requisito": "Vencer ao eliminar as peças adversárias",
        "titulo": "Contar as peças e detectar o fim.",
        "texto": "Percorremos o tabuleiro e contamos as peças de cada jogador. Se um contador chegar a zero, o adversário vence. O resultado fica registrado no estado da partida.",
        "detalhe": "Peças comuns e damas incrementam o contador do seu dono. Como regra adicional desta versão, o jogador que ainda tem peças, mas não possui movimentos, também perde.",
        "trechos": [
            [
                "function contarPecas(",
                "function interromperPartida("
            ]
        ],
        "destaques": [
            "for (const",
            "jogador1++",
            "jogador2++",
            "=== 0",
            "encerrarJogo"
        ],
        "legenda": "O enunciado exige vitória por eliminação; a falta de movimentos é uma regra adicional da implementação.",
        "termos": [
            [
                "Acumulador",
                "Variável que reúne a contagem das peças durante o percurso."
            ],
            [
                "Varredura da matriz",
                "Visita todas as casas para calcular as quantidades."
            ]
        ],
        "cenario": "vitoria",
        "instrucao": "Faça (5, 0) → (3, 2). A última peça do jogador 2 é removida, o contador chega a zero e o jogo registra a vitória do jogador 1."
    },
    {
        "nome": "Interrupção",
        "requisito": "Interromper e comparar o número de peças",
        "titulo": "Quem tem mais peças vence.",
        "texto": "A partida pode ser interrompida. Os contadores são comparados e o jogador com mais peças é declarado vencedor. Quantidades iguais são tratadas como empate nesta versão.",
        "detalhe": "O vencedor começa com <code>null</code>. Se uma quantidade for maior, recebe 1 ou 2. Na igualdade, continua null. Uma dama vale uma peça, sem pontuação extra.",
        "trechos": [
            [
                "function contarPecas(",
                "function encerrarJogo("
            ],
            [
                "function interromperPartida(",
                "// No navegador"
            ]
        ],
        "destaques": [
            "for (const",
            "quantidades.jogador",
            "vencedor =",
            "encerrarJogo",
            "empate:"
        ],
        "legenda": "A interrupção compara quantidades. Se a partida já terminou, seu resultado é preservado.",
        "termos": [
            [
                "Comparação de contadores",
                "Define o vencedor a partir dos totais calculados."
            ],
            [
                "Valor sentinela",
                "null indica a ausência de um vencedor, representando empate."
            ]
        ],
        "cenario": "interrupcao",
        "instrucao": "Clique em Interromper: o jogador 1 vence por três peças contra uma. Para demonstrar a igualdade, use o exemplo Empate e interrompa novamente."
    }
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
    buscar("requisito-aula").textContent = `Requisito: ${etapa.requisito}`;
    buscar("instrucao-aula").textContent = etapa.instrucao;
    buscar("termos-aula").replaceChildren();
    for (const [termo, significado] of etapa.termos) {
        const item = document.createElement("div");
        const titulo = document.createElement("dt");
        const descricao = document.createElement("dd");
        titulo.textContent = termo;
        descricao.textContent = significado;
        item.append(titulo, descricao);
        buscar("termos-aula").append(item);
    }
    buscar("texto-aula").textContent = etapa.texto;
    buscar("detalhe-aula").innerHTML = etapa.detalhe;
    buscar("legenda-codigo").textContent = etapa.legenda;
    const fonte = CODIGO_DAMAS.split("\n");
    const codigo = buscar("trecho-codigo");
    codigo.replaceChildren();
    etapa.trechos.forEach(([marcadorInicio, marcadorFim], trecho) => {
        const inicio = fonte.findIndex((linha) => linha.includes(marcadorInicio));
        const fim = fonte.findIndex(
            (linha, posicao) => posicao > inicio && linha.includes(marcadorFim),
        );
        if (inicio < 0 || fim < 0) {
            throw new Error(`Trecho da aula não encontrado: ${etapa.nome}`);
        }
        if (trecho > 0) {
            const separador = document.createElement("span");
            separador.className = "linha-codigo";
            separador.textContent = "    // … linhas omitidas";
            codigo.append(separador);
        }
        fonte.slice(inicio, fim).forEach((linha, posicao) => {
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
            codigo.append(elemento);
        });
    });
    codigo.scrollTop = 0;
    codigo.scrollLeft = 0;
    document.querySelectorAll("[role=tab]").forEach((aba, posicao) => {
        aba.setAttribute("aria-selected", String(posicao === indice));
        aba.tabIndex = posicao === indice ? 0 : -1;
    });
    buscar("proxima-aula").textContent =
        indice === etapas.length - 1
            ? "Voltar à primeira etapa ↻"
            : "Próxima etapa →";
    buscar("anterior-aula").disabled = indice === 0;
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
buscar("anterior-aula").addEventListener("click", () => mostrarEtapa(Math.max(0, etapaAtual - 1)));
buscar("preparar-aula").addEventListener("click", () => {
    const etapa = etapas[etapaAtual];
    carregarDemonstracao(etapa.cenario);
    if (etapaAtual === 0) document.querySelector(".inspecao-matriz").open = true;
    buscar("jogo").scrollIntoView({ block: "start" });
});
mostrarEtapa(0);
