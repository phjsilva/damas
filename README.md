# Damas — Estrutura de Dados

Jogo para dois jogadores no mesmo navegador, com uma matriz 8×8 e JavaScript puro.
A lógica fica em `back/damas.js`; os arquivos de `front/` desenham o tabuleiro e
mostram as explicações. Não há bibliotecas de terceiros.

## Executar

Na pasta do projeto:

```powershell
python -m http.server 5500 --bind 127.0.0.1
```

Abra http://127.0.0.1:5500/front/index.html. Para encerrar, pressione Ctrl+C.
A página do código fica em http://127.0.0.1:5500/front/codigo.html.
Também é possível abrir os arquivos HTML diretamente no navegador.

## Estruturas para apresentar

| Estrutura | Onde aparece | Para que serve |
| --- | --- | --- |
| Array bidimensional | `jogo.tabuleiro[linha][coluna]` | Representa as 64 casas |
| Array de pares | `DIAGONAIS` | Guarda os quatro deslocamentos possíveis |
| Array de objetos | `movimentos` | Guarda origem, destino e possível captura |
| Objeto | `jogo` | Registra a matriz, o jogador atual e o fim da partida |

Valores da matriz: `0` é vazio; `1` e `2` são peças comuns; `3` e `4` são damas.

## Ordem para estudar o código

1. `criarJogo`: dois laços `for` montam a matriz e distribuem as peças.
2. `movimentosDaPeca`: um `for` escolhe a diagonal e um `while` percorre suas casas.
3. `movimentosPermitidos`: reúne as opções do jogador e usa `filter` para priorizar capturas.
4. `moverPeca`: usa `find` para validar as coordenadas; depois atualiza a matriz.
5. `atualizarVez` e `promoverPeca`: controlam a sequência de capturas, a promoção e a vez.
6. `contarPecas` e `interromperPartida`: percorrem a matriz e comparam os totais.

Peças comuns e damas usam o mesmo percurso diagonal. A peça comum para na
primeira casa vazia; a dama continua. Encontrar uma peça própria ou uma segunda
adversária bloqueia o percurso.

Uma jogada simples como `(5, 0) → (4, 1)` troca a origem por `0` e coloca `1` no
destino. Uma captura também zera a casa da adversária. Nenhuma posição é alterada
quando as coordenadas não correspondem a um movimento permitido.

A criação e a contagem percorrem todas as casas: para um tabuleiro N×N, custam
O(N²). O acesso a uma casa por seus índices custa O(1). O `find` faz busca linear
no array de opções. O jogo usa iteração, sem recursão.

## Regras mantidas

- Peças comuns andam uma casa para frente e capturam nos dois sentidos.
- A captura é obrigatória; capturas em sequência usam a mesma peça.
- A promoção acontece ao terminar a jogada na última linha.
- A dama percorre diagonais livres e captura uma adversária por salto.
- Vence quem elimina as adversárias ou deixa o outro jogador sem movimentos.
- A interrupção compara quantidades; damas contam como uma peça e a igualdade é empate.

O PDF não define uma variante completa. Esta implementação não aplica a lei da
maioria nem empate automático por repetição, como já era informado na página.

## Apresentação do código

Na página separada **Código do projeto**, cada etapa mostra os trechos reais em cartões no estilo
CodeSnap, com cores de sintaxe e números das linhas do arquivo original.
**Copiar código** copia o trecho sem esses números. **Ampliar código** aumenta a
área de leitura; **Voltar à explicação** ou **Esc** restaura a divisão da tela.
As abas e os botões de anterior/próximo continuam disponíveis durante a ampliação.
**Testar no tabuleiro** abre o cenário relacionado à etapa em outra aba.
A página principal fica dedicada ao jogo, às informações da partida e às regras.

## Atualizar a explicação

```powershell
node front/scripts/atualizar-aula.cjs
```

O comando atualiza a cópia do código
mostrada na página **Código do projeto**. Execute-o após editar `back/damas.js`.
