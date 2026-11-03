# Roteiro de apresentação — cerca de 5 a 7 minutos

## 1. Objetivo — 30 segundos

“Este projeto permite uma partida de damas entre duas pessoas no mesmo dispositivo. O foco de Estrutura de Dados é representar o tabuleiro com um array bidimensional e usar essa matriz para validar e executar as jogadas.”

Abra `front/index.html`. Mostre as peças, a vez, o placar e os destinos marcados ao selecionar uma peça.

## 2. Estrutura de dados — 1 minuto

No VS Code, abra `back/damas.js` e procure `function criarJogo`.

“Cada posição da matriz guarda um número. Zero significa vazio. Um e dois representam os jogadores; três e quatro representam as respectivas damas. O primeiro índice é a linha e o segundo é a coluna.”

Mostre `tabuleiro[linha] = []` e os dois laços `for`. Explique que `% 2` identifica as casas escuras pela soma dos índices.

“O objeto jogo reúne a matriz e o estado da partida: de quem é a vez, se há continuação de captura, se terminou e quem venceu.”

## 3. Validação antes de alterar — 1 minuto

Procure `function moverPeca`.

“Primeiro verificamos se a partida acabou. Depois procuramos a origem e o destino na lista de movimentos permitidos. Se a jogada não estiver nessa lista, retornamos sucesso falso, sem alterar a matriz.”

Mostre a chamada de `movimentosPermitidos` e o `if (!movimento)`.

“A lista já considera de quem é a vez e se existe captura obrigatória. A peça comum e a dama têm funções separadas porque seus movimentos são diferentes.”

Na página, tente mover uma peça para uma casa sem marcação. A peça deve continuar no mesmo lugar.

## 4. Mover e capturar — 1 minuto

Procure `function executarMovimento`.

“A origem recebe zero e o destino recebe o valor da peça. Se houver captura, a posição da adversária também recebe zero. A tela é redesenhada a partir da matriz.”

Abra **Exemplos de funcionalidades → Captura**. Esse botão substitui a partida atual por um tabuleiro preparado.

1. Selecione a peça clara em **5,0** e clique em **3,2**.
2. Mostre que a vez continua com o jogador 1.
3. Clique em **1,4** para concluir a segunda captura.

“A função atualizarVez só troca o jogador quando não houver outra captura com a mesma peça.”

## 5. Promoção e vitória — 1 minuto

Procure `function promoverPeca`.

“Quando a peça termina a jogada na última linha, seu valor muda. A peça um vira três, e a peça dois vira quatro. A função ehDama reconhece esses valores e permite percorrer as diagonais.”

Na página:

- **Virar dama:** mova **1,2 → 0,1** e mostre a coroa.
- **Vitória:** mova **5,0 → 3,2** e mostre o placar com zero peças adversárias.

Procure `function verificarVitoria` e relacione a contagem com o resultado.

## 6. Interrupção e conclusão — 1 minuto

Procure `function interromperPartida` e `function contarPecas`.

“Percorremos a matriz, contamos as peças de cada jogador e comparamos. Quem tiver mais vence. Se empatar, vencedor fica null e a partida fica encerrada. Uma dama conta como uma peça.”

Na página, escolha **Interrupção** e clique em **Interromper**. Mostre a vitória do jogador 1 por três peças contra uma.

Clique em **Nova partida** e depois em **Interromper** para mostrar o empate por 12 a 12.

“Separei as regras em back/damas.js e os cliques e desenhos em front/interface.js. Assim, consigo verificar as regras sem depender da página.”

## Perguntas para estudar

**Por que um array bidimensional?** Porque o tabuleiro tem linhas e colunas. A matriz representa diretamente essa organização e permite acessar uma casa com dois índices.

**O que significa `continue`?** Pula o restante da repetição atual e passa para a próxima. Usamos para ignorar casas ou peças que não podem participar da jogada.

**O que significa `break`?** Encerra o laço atual. Na diagonal da dama, ele impede atravessar uma peça própria ou uma segunda adversária na mesma etapa.

**O que fazem `filter`, `find` e `some`?** `filter` reúne todas as opções que atendem à condição; `find` procura uma opção; `some` verifica se existe alguma opção. São métodos nativos do JavaScript, sem bibliotecas externas.

**Por que validar antes de mover?** Para que uma tentativa proibida não altere o estado da partida.

**O que é um movimento?** Um objeto com linha e coluna de origem, linha e coluna de destino e a posição capturada, quando houver.

**Por que guardar `continuacao`?** Para obrigar a sequência de capturas com a mesma peça e manter a vez do jogador.

**Quanto custa contar as peças?** São 64 consultas neste tabuleiro. Generalizando para um tabuleiro N × N, o custo é O(N²). A memória da matriz também é O(N²). A geração de movimentos da dama pode examinar até O(N) casas por peça; não confunda esse custo com o da simples contagem.

**Por que a partida pode acabar com peças dos dois lados?** Porque esta versão também declara derrota de quem fica sem movimentos. É uma regra complementar à eliminação pedida no projeto.

**Implementa todas as regras de torneio?** Não. Esta versão não aplica lei da maioria nem empate por repetição. Explique as convenções que o próprio projeto documenta.

**Está em TypeScript?** Não. A versão atual está em JavaScript, HTML e CSS. O enunciado geral lista outras tecnologias; não apresente recursos que esta versão não implementa.

## Preparação antes de apresentar

- Abra o navegador e o VS Code lado a lado.
- Deixe `back/damas.js` aberto e use Ctrl+F para localizar os nomes das funções.
- Use **Focar no jogo** para destacar a partida durante a demonstração. **Esc** restaura a aula.
- Treine os quatro exemplos e a interrupção empatada.
- Se editar a lógica, execute `node front/scripts/atualizar-aula.cjs` e recarregue a página.
- Para verificar as regras, execute `node --test back/testes/damas.test.cjs`.
- Se não conseguir explicar uma função, execute um exemplo e acompanhe os valores de origem, destino e peça.
