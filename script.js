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
                return true;
            }
            else if((b[0][i].getValue() == b[1][i].getValue() && b[1][i].getValue() == b[2][i].getValue()  && b[1][i].getValue() != "")){
                return true;
            }
        }
        if (b[0][0].getValue() == b[1][1].getValue() && b[1][1].getValue() == b[2][2].getValue() && b[0][0].getValue() != ""){
            return true;
        }
        else if(b[2][0].getValue() == b[1][1].getValue() && b[1][1].getValue() == b[0][2].getValue() && b[2][0].getValue() != ""){   
            return true;
        }
    }

    const playRound = (row, column) =>{
        console.log(`inserting ${getActivePlayer().symbol}`);
        gameBoard.insertValue(getActivePlayer(), row, column);

        const win = checkWin(b);
        if(win){
            console.log(`${getActivePlayer().name} wins` )
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    b[i][j].putValue("");
                }
            }
            return

        }
        else{
        changePlayer();
        printNewRound();
    }
        
    }
    return {changePlayer, getActivePlayer, playRound, gameBoard}

}


function ScreenController(){
    const game = GameController();
    const gameBoard = game.gameBoard;
    
    
    const boardDiv = document.querySelector(".board");
    const playerTurn = document.querySelector(".playerTurn");

    const updateScreen = ()=>{
        
        boardDiv.textContent ="";
        
        const board = gameBoard.getBoard();
        const activePlayer = game.getActivePlayer().name;

        playerTurn.innerHTML = `${activePlayer}'s turn`;

        board.forEach((row,i) => row.forEach((cell,index)=> {
            const button = document.createElement("button");
            button.classList.add('boardButton');

            button.textContent = cell.getValue();
            button.dataset.row = i;
            button.dataset.column = index;
            boardDiv.appendChild(button);
        }))


        
    }
    updateScreen();

    

    const handleClick = (e) =>{
        const row = e.target.dataset.row;
        const column =e.target.dataset.column;
        console.log(row, column);
        if(!row )
            return
        else{
            game.playRound(row, column)
            updateScreen();
        }

    }

    boardDiv.addEventListener("click", handleClick);




    return {updateScreen};

}


const ui = ScreenController();

