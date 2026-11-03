# Damas — projeto organizado para apresentar

Abra `front/index.html` no navegador. Não precisa instalar dependências nem executar comandos para jogar. São duas pessoas no mesmo dispositivo.

## Separação para a avaliação

O professor pode começar por **`back/damas.js`**: todas as regras e a matriz estão nesse arquivo, sem acesso a HTML, CSS ou elementos da tela. Os testes também ficam no `back` e verificam as regras sem carregar a interface.

A pasta **`front`** contém a interface e os recursos visuais da apresentação. Ela chama as funções do `back`; a regra do jogo é definida em um único arquivo.

```text
damas-codigo/
├── back/
│   ├── damas.js              # Lógica para o professor avaliar
│   └── testes/
│       └── damas.test.cjs    # Verificação das regras
├── front/
│   ├── index.html           # Abra este arquivo para jogar
│   ├── estilo.css
│   ├── interface.js
│   ├── aula.js
│   ├── demonstracoes.js
│   ├── codigo-fonte.js       # Texto exibido na aula; não executa regras
│   └── scripts/
│       └── atualizar-aula.cjs
├── LEIA-ME.md
├── APRESENTACAO.md
└── COMO-ABRIR.txt
```

A página carrega `../back/damas.js` antes dos scripts de interface. Mantenha as duas pastas juntas para que esse caminho funcione.

## Onde está cada parte

| Arquivo | Responsabilidade |
| --- | --- |
| `back/damas.js` | Matriz, movimentos, capturas, promoção, vez e resultado. Comece a estudar aqui. |
| `front/interface.js` | Desenhar o tabuleiro e responder aos cliques. |
| `front/aula.js` | As cinco etapas da explicação exibida na página. |
| `front/demonstracoes.js` | Tabuleiros preparados para demonstrar cada regra rapidamente. |
| `front/index.html` | Estrutura da página e ordem de carregamento dos scripts. |
| `front/estilo.css` | Aparência e adaptação ao tamanho da tela. |
| `front/codigo-fonte.js` | Cópia gerada da lógica para a aula funcionar sem servidor. Não editar manualmente. |
| `front/scripts/atualizar-aula.cjs` | Atualizar a cópia depois de editar a lógica. |
| `back/testes/damas.test.cjs` | Verificação das regras com o testador nativo do Node.js. |
| `APRESENTACAO.md` | Roteiro, sequência de demonstração e perguntas para estudar. |

## Ordem para ler a lógica

1. `criarJogo`: cria um array de linhas; cada linha é outro array.
2. `donoDaPeca`, `ehDama`, `outroJogador`, `dentroDoTabuleiro`: consultas simples.
3. `movimentosDaPecaComum` e `movimentosDaDama`: calculam destinos separadamente.
4. `movimentosPermitidos`: considera o jogador da vez e prioriza capturas.
5. `moverPeca`: valida e chama três passos: executar, atualizar a vez e verificar vitória.
6. `executarMovimento`: altera origem, destino e, se houver, a casa capturada.
7. `atualizarVez` e `promoverPeca`: controlam continuação, promoção e troca de jogador.
8. `contarPecas`, `verificarVitoria` e `interromperPartida`: decidem o resultado.

O código tem mais funções pequenas para que cada regra possa ser explicada isoladamente. A função principal não concentra todas as condições.

## Representação dos dados

`jogo.tabuleiro[linha][coluna]` contém um número:

| Valor | Significado |
| --- | --- |
| 0 | Casa vazia |
| 1 | Peça comum do jogador 1 |
| 2 | Peça comum do jogador 2 |
| 3 | Dama do jogador 1 |
| 4 | Dama do jogador 2 |

Os índices vão de 0 a 7. O jogador 1 começa embaixo e anda para linhas menores. O jogador 2 anda para linhas maiores. `continuacao` guarda a posição da peça que precisa continuar capturando. `vencedor: null` representa empate somente quando `encerrado` é verdadeiro.

## Controles da interface

- **Focar no jogo** oculta o material de estudo e destaca a partida. Use **Sair do foco** ou **Esc** para restaurar a página.
- O cartão destacado indica o jogador da vez; o placar informa o vencedor ou o empate quando a partida termina.
- **Coordenadas** mostra ou oculta tanto os índices das casas quanto os eixos da moldura.
- **Exemplos de funcionalidades** carrega situações prontas de captura, promoção, vitória e interrupção.
- A interface se adapta ao celular e usa fontes do sistema, sem downloads externos.

## Executar as verificações

Na pasta do projeto, com Node.js instalado:

```sh
node --test back/testes/damas.test.cjs
```

Depois de alterar `back/damas.js`, atualize o código exibido na aula:

```sh
node front/scripts/atualizar-aula.cjs
```

Recarregue a página depois de salvar os arquivos. O Node.js é necessário apenas para esses comandos; o jogo continua abrindo diretamente no navegador.

## Regras adotadas

- Tabuleiro 8 × 8, com 12 peças por jogador.
- Peça comum anda uma casa na diagonal para frente e captura nas duas direções.
- Dama percorre diagonais e captura uma adversária por etapa, sem atravessar peças próprias ou duas adversárias.
- Captura obrigatória e continuação com a mesma peça quando houver nova captura.
- Promoção ao terminar a jogada na última linha, depois da sequência de capturas.
- Vitória por eliminação e, como regra complementar, por bloqueio do adversário.
- Interrupção: maior quantidade de peças vence; dama vale uma peça; igualdade gera empate.
- Sem lei da maioria nem empate automático por repetição.

## Enunciado e escopo

O projeto 7 pede sistema web para dois jogadores, array bidimensional, validação, promoção, vitória por eliminação e interrupção com comparação de peças.

A página 1 do enunciado também lista TypeScript, JavaScript, HTML5, CSS3, PostgreSQL, Express e Leaflet. Esta organização mantém a implementação existente em JavaScript, HTML e CSS. Ela não converte o projeto para TypeScript nem implementa banco de dados, Express ou Leaflet; a aceitação dessa stack parcial deve ser alinhada com o professor.
