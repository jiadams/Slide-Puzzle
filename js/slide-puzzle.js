var SlidePuzzle = function (width,height) {
    this.w = width;
    this.h = height;
    this.arrLen = this.w * this.h;
    this.gameBackground = './images/planet-bg.jpg';
    this.moves = 0;
    this.solveState = this.buildBoard();
    this.board = this.buildBoard();
    this.drawBoard();
    this.boardLine;
    this.gameStart = false;
    this.gameTimer = new Timer(document.getElementById('game-timer'), 25);
    this.previousRecords = [];
};

SlidePuzzle.prototype.startGame = function() {
    this.gameTimer.reset();
    this.moves = 0;
    this.gameStart = true;
    $("#move-count").find("span").html(this.moves);
    this.gameTimer.start();
}

SlidePuzzle.prototype.buildBoard = function() {
    if(this.w === undefined || isNaN(this.w)) {
        console.log("Please define width as a Number.");
        return false;
    }
    if (this.h === undefined || isNaN(this.h)) {
        console.log("Please define height as a Number");
        return false;
    }
    var i, j, k, tempArray = [], arrLen = this.w * this.h, boardArray;

    for (i = 0; i <arrLen; i++) {
        tempArray[i] = i + 1;
    }
    boardArray = this.createMDArray();
    k = 0;
    for (i = 0; i < this.h; i++) {
        for (j = 0; j < this.w; j++) {
            boardArray[i][j] = tempArray[k];
            k++;
        }
    }
    this.boardLine = tempArray;
    return boardArray;
};

SlidePuzzle.prototype.shuffleBoard = function() {
    var tempArray = this.boardLine;
    do {
        tempArray = this.shuffle(tempArray);
    } while (!this.solvable(tempArray));

    var boardArray = this.createMDArray();
    k = 0;
    for (i = 0; i < this.h; i++) {
        for (j = 0; j < this.w; j++) {
            boardArray[i][j] = this.boardLine[k];
            k++;
        }
    }
    console.log(this.solvable(tempArray));
    this.boardLine = tempArray;
    this.board = boardArray;
    this.drawBoard();
    this.startGame();
};

SlidePuzzle.prototype.solvable = function(boardArray) {
    var i, j, blank, inv = 0, arrLen = boardArray.length ;
    for(i = 0; i <arrLen; i++) {
        if (boardArray[i] < arrLen) {
            for (j = i +1; j < arrLen; j++) {
                if(boardArray[i] > boardArray[j]){
                    inv ++;
                }
            }
        } else {
            blank = i + 1;
        }
    }
    if (this.w % 2) {
        if (inv%2) {
            return false;
        }
    } else {
        var blankRow = -((Math.ceil(blank / this.h )) - (this.h +1));
        if (inv%2 && blankRow%2) {
            return false;
        } else if(inv%2 === 0 && blankRow%2 === 0) {
            return false;
        }
    }
    return true;
};

SlidePuzzle.prototype.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

SlidePuzzle.prototype.createMDArray = function() {
    var array = [];
    for (var i = 0; i < this.h; i++) {
        array[i] = [];
        for (var j = 0; j < this.w; j++) {
            array[i][j] = '';
        }
    }
    return array;
};

SlidePuzzle.prototype.drawBoard = function() {
    var $tileNode, $gameNode = $("#game-board");
    $gameNode.empty();
    var i, j;
    for(i = 0; i < this.board.length; i++) {
        for( j = 0; j < this.board[i].length; j++) {
            nodeValue = this.board[i][j];
            if (nodeValue < this.arrLen) {
                $tileNode = $("<div></div>").addClass("block").html(nodeValue).css({
                    top : 100 * i,
                    left : 100 * j,
                    
                }).attr({
                    'data-col' : i,
                    'data-row' : j,
                    'data-value' : nodeValue
                });
                $tileNode.prepend("<div class='overlay'></div>").addClass();
                $tileNode.appendTo($gameNode);
            } else {
                $("<div></div>").addClass("block blank").css({
                    top : 100 * i,
                    left : 100 * j
                }).attr({
                    'data-col' : i,
                    'data-row' : j
                }).appendTo($gameNode);
            }
            
        }
    }
    $($gameNode).css({
        width : (this.w * 100),
        height : (this.h * 100)
    });
    this.backgroundSetter();
};

SlidePuzzle.prototype.backgroundSetter = function() {
    var $tileNode, tileNum, i, j;
    var w = this.w, h = this.h;
    var solveState = this.solveState;
    var bgUrl = this.gameBackground;
    $('div.block').each(function(){
        $tileNode = $(this);
        tileNum = Number($tileNode.data('value'));
        for(i = 0; i < solveState.length; i++) {
            for(j = 0; j < solveState[i].length; j++) {
                if (tileNum === solveState[i][j]) {
                    $tileNode.css({
                        "background-image" : "url(" + bgUrl + ")",
                        "background-size"  : w*100 + "px " + h*100 + "px",
                        "background-position" :  -100*j + "px " + -100*i + "px"
                    })
                }
            }
        }
    });
};

SlidePuzzle.prototype.checkSolve = function () {
    var i, j, gameTime, moves;
    for(i = 0; i < this.board.length; i++) {
        for(j = 0; j < this.board[i].length; j++) {
            if (this.board[i][j] !== this.solveState[i][j]) {
                return false;
            }
        }
    }
    gameTime = this.gameTimer.stop();
    moves = this.moves;
    this.previousRecords.push({
        "Time" : gameTime,
        "Moves" : moves
    })
    console.log(this.previousRecords);
    this.gameStart = false;
    return true;
};

SlidePuzzle.prototype.findTile = function(tileValue) {
    var i, j;
    for (i = 0; i <this.board.length; i++){
        for(j = 0; j < this.board[i].length; j++) {
            if(this.board[i][j] === tileValue) {
                return [i,j];
            }
        }
    } 
}


SlidePuzzle.prototype.moveTile = function (element) {
    var temp;
    var $tile = $(element);
    var $blankTile = $(".block.blank");
    var col = Number($tile.data('col')), row = Number($tile.data('row'));
    var blankTileCol, blankTileRow, blankTileLoc = this.findTile(this.arrLen);
    blankTileCol = blankTileLoc[0]
    blankTileRow = blankTileLoc[1];
    switch (true) {
    case col > 0 && this.board[col-1][row] === this.arrLen: 
        temp = this.board[col-1][row];
        this.board[col-1][row] = this.board[col][row];
        this.board[col][row] = temp;
        //console.log("up");
        $tile.css({
                top : 100 * (col-1),
                left : 100 * row
            }).data({
                'col' : (col-1),
                'row' : row
            });
        $blankTile.css({
                top : 100 *  col,
                left : 100 * row
            }).data({
                'col' : col,
                'row' : row
            });
        this.moveCounter();
        if(this.checkSolve()) {
            console.log("win");
        }
        break;
    case row > 0 && this.board[col][row-1] === this.arrLen :
        temp = this.board[col][row-1];
        this.board[col][row-1] = this.board[col][row];
        this.board[col][row] = temp;
        //console.log("left");
        $tile.css({
                top : 100 * col,
                left : 100 * (row-1)
            }).data({
                'col' : col,
                'row' : (row-1)
            });
        $blankTile.css({
                top : 100 *  col,
                left : 100 * row
            }).data({
                'col' : col,
                'row' : row
            });
        this.moveCounter();
        if(this.checkSolve()) {
            console.log("win");
        }
        break;
    case col < this.h -1 && this.board[col+1][row] === this.arrLen :
        temp = this.board[col+1][row];
        this.board[col+1][row]= this.board[col][row];
        this.board[col][row] = temp;
        //console.log("down");
        $blankTile.css({
                top : 100 *  col,
                left : 100 * row
            }).data({
                'col' : col,
                'row' : row
            });
        $tile.css({
                top : 100 * (col+1),
                left : 100 * row
            }).data({
                'col' : (col+1),
                'row' : row
            });
        this.moveCounter();
        if(this.checkSolve()) {
            console.log("win");
        }
        break;
    case row < this.w -1 && this.board[col][row+1] === this.arrLen :
        temp = this.board[col][row+1];
        this.board[col][row+1] = this.board[col][row];
        this.board[col][row] = temp;
        //console.log("right");
        $tile.css({
                top : 100 * col,
                left : 100 * (row+1)
            }).data({
                'col' : col,
                'row' : (row+1)
            });
        $blankTile.css({
                top : 100 *  col,
                left : 100 * row
            }).data({
                'col' : col,
                'row' : row
            });
        this.moveCounter();
        if(this.checkSolve()) {
            console.log("win");
        }
    break;
    case col === blankTileCol :
        console.log("sameCol")
    break;
    case row === blankTileRow :
        console.log("same row")
    break;
    case $($tile).find(".overlay").length !== 0 :
        $tile.find('div.overlay').css('background-color', 'rgba(255,0,0,.25)');
        setTimeout(function() {
            $tile.find('div.overlay').css('background-color', 'transparent');
        },250);
    break;
    }
};

SlidePuzzle.prototype.moveCounter = function() {
    if (this.gameStart) {
        this.moves ++;
        $("#move-count").find("span").html(this.moves);
    }
}