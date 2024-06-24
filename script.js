/* desenvolvendo jogo da velha com javascript, utilizando closures e factory functions */

/* geralmente nós estamos acostumados em construir a interface visual primeiro pra depois pensar 
nas funcionalidades em si. mas para desenvolver esse projeto vamos usar a lógica do inside out
que é construir a aplicação a partir do javascript. dessa forma nosso código pode ser muito mais 
dinâmico e modular */

/* essa lógica do array bidimensional previamente estabelecido
é um padrão comum pra inicializar estrutura de dados que representam tabuleiros e pode ser 
reutilizado para diversos outros jogos! */

function Gameboard() {
    /* então o primeiro passo, é fazer a representação lógica do tabuleiro
    como se trata de jogo da velha, a dimensão desse tabuleiro é 3x3, formando uma matriz.
    então nós declarar uma constante para as linhas que recebe o valor de 3 e uma para as colunas.

    além disso, vamos declarar um array que vai representar justamente o tabuleiro 
    */
    const rows = 3;
    const columns = 3;
    const board = [];

    /* agora, precisamos percorrer esse array preenchendo cada índice com a estrutura de uma célula,
    que vai representar as casas do tabuleiro*/

    for (let i = 0; i < rows; i++) { // i = linha
        board[i] = []; // pra cada iteração cria se um novo array que representa a linha do tabuleiro 
        for (let j = 0; j < columns; j++) { // j = coluna
            board[i].push(Cell()); 
            // chama a função Cell que preenche uma casa do tabuleiro na linha atual
        }
    }

    /* pula pra explicação da célula */

    const getBoard = () => board;  /* arrow function que retorna o tabuleiro */

    /* função que recebe a linha, a coluna, e o "jogador" (X ou O) para preencher a célula */
    const dropToken = (row, column, player) => {    
        if (board[row][column].getValue() !== 0) return;  
        /* verifica se a célula está vazia, e se sim, adiciona o "jogador" */
        board[row][column].addToken(player);
    };
    
    /* retorna o estado atual do tabuleiro */
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
        /* mapeia o array retornando o estado de cada célula */
    };

    /* limpa o tabuleiro */
    const reset = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = Cell();
            }
        }
    };

    return { getBoard, dropToken, printBoard, reset };
}

/* cria uma célula para o tabuleiro do jogo */

/* para construir essa função vamos usar a técnica de encapsulamento para criar uma célula
 com métodos específicos para manipular e acessar seu valor, através de conceitos
 como closure e factory funcion.*/

function Cell() {
    let value = 0; /* representa o estado da célula (0, X ou O) */

    const addToken = (player) => { /* arrow function que recebe por parâmetro o "player" (O ou X)
        e assim define o estado da célula, atribuindo esse player ao valor */
        value = player; 
    };

    const getValue = () => value; /* ao ser acessado por outros métodos,
    retorna o estado ATUAL da célula */

    /* retorna como objeto, as funções addToken e getValue, de forma que
    é possível que métodos fora do escopo da Cell() possam interagir com a célula,
    com a variável value encapsulada, segura e inacessível */
    return { addToken, getValue };
}

/* implementa a lógica do jogo */

function GameController(playerOneName = "Player X", playerTwoName = "Player O") {
    const board = Gameboard(); /* recebe os métodos getBoard, dropToken, printBoard,
    retornardos pela função subjacente Gameboard() */

    /* objeto que armazena os jogadores e seus respectivos atributos */
    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    /* declara variável que representa o estado (X, O) do objeto "jogador" */
    let activePlayer = players[0];

    /* método para mudar o turno de cada jogador, calculando o próximo: se X então O, se não, X */
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    /* retorna o jogador do turno atual */
    const getActivePlayer = () => activePlayer;

    /* faz a alteração visual para que os jogadores saibam de quem é a vez */
    const printNewRound = () => {
        board.printBoard(); /* chama a função printBoard() que retorna o estado atual do tabuleiro */
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    /* função que coordena uma rodada do jogo */
    const playRound = (row, column) => { /* recebe por parâmetro a linha e a coluna */
        console.log(`Dropping ${getActivePlayer().name}'s token into row ${row}, column ${column}...`);
        board.dropToken(row, column, getActivePlayer().token); /* chama a função que altera o estado da célula selecionada */
        switchPlayerTurn(); /* chama a função que altera o turno (do jogador) */
        printNewRound(); /* chama a função que atualiza o estado do tabuleiro */

        if (activePlayer.token === 'O') { /* se for a vez do computador */
            computerPlay(); /* chama a função para o computador jogar */
        }
    };

    /* função para o computador jogar automaticamente */
    const computerPlay = () => {
        const boardState = board.getBoard();
        for (let i = 0; i < boardState.length; i++) {
            for (let j = 0; j < boardState[i].length; j++) {
                if (boardState[i][j].getValue() === 0) { /* encontra a primeira célula vazia */
                    console.log("Computer plays at row", i, "column", j);
                    playRound(i, j); /* faz a jogada do computador */
                    return;
                }
            }
        }
    };

    /* função para reiniciar o tabuleiro e o jogador ativo */
    const resetBoard = () => {
        board.reset(); // chama a função reset() do tabuleiro
        activePlayer = players[0]; // reseta para o jogador inicial
        printNewRound(); // atualiza o estado do tabuleiro e a vez do jogador
    };

    printNewRound(); /* atualiza o estado do tabuleiro */

    return { playRound, getActivePlayer, getBoard: board.getBoard, resetBoard };
}

/* gerencia a interface do jogo da velha, atualizando o estado visual e tratando as
interações do usuário */

function ScreenController() {
    /* seleciona os elementos DOM */
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    let playerScore = document.querySelector('.right');
    playerScore.value = 0;
    let i = 0;

    /* arrow function que atualiza a tela */
    const updateScreen = () => {
        i++;
        boardDiv.textContent = "";
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
    
        // atualiza o placar visível
        playerScore.textContent = `Score: ${playerScore.value} wins`;
    
        // verifica se há um vencedor
        const winner = checkForWinner();
        if (winner) {
            // atualiza o placar interno
            playerScore.textContent = `Score: ${playerScore.value} wins`;
    
            // exibe mensagem de vitória do jogador correto
            if (winner === 'X') {
                playerScore.value++;
                playerTurnDiv.textContent = `Player X's win!`;
            } else {
                playerTurnDiv.textContent = `Player O's win!`;
            }
    
            // reinicia o jogo após 1 segundo
            setTimeout(restart, 1000);
        } else {
            // exibe o turno do jogador ativo
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        }
    
        // renderiza o tabuleiro atualizado
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    };
    

    const checkForWinner = () => {
        const board = game.getBoard();

        for (let row = 0; row < 3; row++) {
            if (board[row][0].getValue() !== 0 &&
                board[row][0].getValue() === board[row][1].getValue() &&
                board[row][1].getValue() === board[row][2].getValue()) {
                return board[row][0].getValue(); 
            }
        }

        for (let col = 0; col < 3; col++) {
            if (board[0][col].getValue() !== 0 &&
                board[0][col].getValue() === board[1][col].getValue() &&
                board[1][col].getValue() === board[2][col].getValue()) {
                return board[0][col].getValue(); 
            }
        }

        if (board[0][0].getValue() !== 0 &&
            board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue()) {
            return board[0][0].getValue(); 
        }

        if (board[0][2].getValue() !== 0 &&
            board[0][2].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][0].getValue()) {
            return board[0][2].getValue();
        }

        return null;
    };

    const restart = () => {
        playerScore.textContent = `Score: ${playerScore.value} wins`;
        game.resetBoard(); // reseta o tabuleiro no controlador do jogo
        updateScreen();    // atualiza a tela para refletir o estado reiniciado do jogo
        playerTurnDiv.textContent = `New Game! ${game.getActivePlayer().name}'s turn...`;
    };

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

/* inicializa o jogo da velha */

ScreenController();

