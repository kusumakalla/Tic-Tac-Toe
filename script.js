// Gameboard() constains all the methods related to the board, ettingboard, innserting a token into the board
// or printing the board

// Cell() is created for every cell present in the board

//GAme controller uses the keyboard, inserts t







function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i<rows;i++){
        board[i] = [];
        for(let j = 0;j<columns; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board.map((row)=> row.map((cell)=>cell.getValue())));
    }
    


    const insertValue = (player, row, column) =>{ 
        if(board[row][column].getValue() === "")  
        board[row][column].putValue(player.symbol);
        else return;
    }

    return {getBoard, printBoard, insertValue};

}


function Cell(){
    let value = "";

    const putValue = (token)=>{
        value = token;
    }
    const getValue = () => value;
    return { getValue, putValue};

}


function GameController(playerOneName = 'Player1', playerTwoName = 'Player2'){

    const gameBoard = Gameboard();
    const b = gameBoard.getBoard();

    const player = [
        {
            name : playerOneName,
            symbol : 'X'
        },
        {
            name : playerTwoName,
            symbol : 'O'
        }
    ]

 
    let activePlayer = player[0];

    const changePlayer = () => {
        activePlayer = (activePlayer === player[0])? player[1]:player[0];
    }

    const getActivePlayer= () => activePlayer;

    const printNewRound = () =>{
        console.log(`${getActivePlayer().name}'s turn`);
        gameBoard.printBoard();
    }

    printNewRound();

    const checkWin = (b) =>{
        for(let i=0;i<3;i++){
            if((b[i][0].getValue() == b[i][1].getValue() && b[i][1].getValue() == b[i][2].getValue()  && b[i][1].getValue() != "")){
                return 1;
            }
            else if((b[0][i].getValue() == b[1][i].getValue() && b[1][i].getValue() == b[2][i].getValue()  && b[1][i].getValue() != "")){
                return 1;
            }
        }
        if (b[0][0].getValue() == b[1][1].getValue() && b[1][1].getValue() == b[2][2].getValue() && b[0][0].getValue() != ""){
            return 1;
        }
        else if(b[2][0].getValue() == b[1][1].getValue() && b[1][1].getValue() == b[0][2].getValue() && b[2][0].getValue() != ""){   
            return 1;
        }
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(b[i][j].getValue() == ""){
                    return 0;
                }
            }
        }
        

        return -1;
    }

    const playRound = (row, column) =>{
        console.log(`inserting ${getActivePlayer().symbol}`);
        gameBoard.insertValue(getActivePlayer(), row, column);

        const win = checkWin(b);
        if(win == 1){
            console.log(`${getActivePlayer().name} wins` )
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    b[i][j].putValue("");
                }
            }
            return 1;

            
        }
        else if(win == -1){
            console.log(`its a draw` )
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    b[i][j].putValue("");
                }
            }
            return -1;
        }
        else{
        changePlayer();
        printNewRound();
        return 0
    }
        
    }
    return {changePlayer, getActivePlayer, playRound, gameBoard}

}


function ScreenController(){
    const player1 = document.querySelector(".player1");
    const player2 = document.querySelector(".player2");
    
    const startGameButton = document.querySelector(".startGameButton");
    const container = document.querySelector(".container");
    let game = null;
    let gameBoard = null;
    let gameOver = false;


    const updateScreen = ()=>{
        console.log(player1.value);
        container.textContent ="";
        
        const board = gameBoard.getBoard();
        const activePlayer = game.getActivePlayer().name;

        const playerTurn = document.createElement("h2");
        playerTurn.classList.add("playerTurn");
        
        playerTurn.textContent = `${activePlayer}'s turn`;
        container.appendChild(playerTurn);

        const boardDiv = document.createElement("div");
        boardDiv.classList.add("boardDiv");

        board.forEach((row,i) => row.forEach((cell,index)=> {
            const button = document.createElement("button");
            button.classList.add('boardButton');

            button.textContent = cell.getValue();
            button.dataset.row = i;
            button.dataset.column = index;
            boardDiv.appendChild(button);
        }))

        container.appendChild(boardDiv);

        
    }

    const startGame = () =>{
        gameOver= false;
        if (player1.value == "") 
            player1.value = "Player1";
        if (player2.value == "") 
            player2.value = "Player2";
        game = GameController(player1.value, player2.value);
        player1.value = "";
        player2.value = "";
        gameBoard = game.gameBoard;
        updateScreen();
    }


    startGameButton.addEventListener("click", startGame);

   

    const handleClick = (e) =>{
        if(gameOver) return;
        const row = parseInt(e.target.dataset.row);
        const column =parseInt(e.target.dataset.column);
        console.log(row, column);
        if(isNaN(row) || isNaN(column))
            return
        else{
            const gameDone = game.playRound(row, column);
            if(gameDone == 1){
                container.textContent="";
                const winText = document.createElement("p");
                winText.classList.add("winText");
                winText.textContent = `${game.getActivePlayer().name} won`
                container.appendChild(winText);
                const resetButton = document.createElement("button");
                resetButton.classList.add("resetButton");
                resetButton.textContent = "Reset";
                container.appendChild(resetButton);
                player1.value = "";
                player2.value = "";
                resetButton.addEventListener("click", ()=>{
                    container.textContent="";
                });
                gameOver= true;
            }
            else if(gameDone == -1){
                console.log(gameDone);
                container.textContent="";
                const winText = document.createElement("p");
                winText.classList.add("winText");
                winText.textContent = "it's a tie";
                container.appendChild(winText);
                const resetButton = document.createElement("button");
                resetButton.classList.add("resetButton");
                resetButton.textContent = "Reset";
                container.appendChild(resetButton);
                player1.value = "";
                player2.value = "";
                resetButton.addEventListener("click", ()=> {
                    container.textContent="";
                });
                gameOver=true;
            }
            else{
            updateScreen();
            }
        }

    }

    container.addEventListener("click", handleClick);




    return {updateScreen};

}


const ui = ScreenController();

