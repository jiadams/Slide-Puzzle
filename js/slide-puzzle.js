"use strict"
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
};

SlidePuzzle.prototype.buildBoard = function() {
    if(this.w === undefined || isNaN(this.w)) {
        return false;
    }
    if (this.h === undefined || isNaN(this.h)) {
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
    var i, j, k, tempArray = this.boardLine;
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
    var i, j, array = [];
    for (i = 0; i < this.h; i++) {
        array[i] = [];
        for (j = 0; j < this.w; j++) {
            array[i][j] = '';
        }
    }
    return array;
};

SlidePuzzle.prototype.drawBoard = function() {
    var $tileNode, nodeValue, $gameNode = $("#game-board");
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
                    'data-row' : i,
                    'data-col' : j,
                    'data-value' : nodeValue
                });
                $tileNode.prepend("<div class='overlay'></div>").addClass();
                $tileNode.appendTo($gameNode);
            } else {
                $("<div></div>").addClass("block blank").css({
                    top : 100 * i,
                    left : 100 * j
                }).attr({
                    'data-row' : i,
                    'data-col' : j
                }).appendTo($gameNode);
            }
        }
    }
    $($gameNode).css({
        width : (this.w * 100),
        height : (this.h * 100)
    });
    this.backgroundSetter();
    this.checkMoveable();
};

SlidePuzzle.prototype.backgroundSetter = function() {
    var $tileNode, tileNum, i, j;
    var w = this.w, h = this.h;
    var solveState = this.solveState;
    if (this.gameBackground.includes("wing")) {
        $(".block").css('color', "#a42138");
    } else if (this.gameBackground.includes("planet")) {
        $(".block").css('color', "#fff");
    } else {
        $(".block").css('color', "#000");
    }
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
                    });
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
    if(this.gameStart) {
        this.previousRecords.push({
            "size" : this.w + "x" + this.h,
            "time" : gameTime,
            "moves" : moves
        });
        this.personalRecord();
        this.winAnimation();
    }
    this.gameStart = false;
    return true;
};

SlidePuzzle.prototype.winAnimation = function() {
    var $winModal = $("<div class='win fade'><h1>You Win<br><small>Click Shuffle to Play Again</h1></div>");
    $("body").append($winModal);
    setTimeout(function() {
        $winModal.toggleClass("fade");
    }, 250);

};

SlidePuzzle.prototype.findTile = function(tileValue) {
    var i, j;
    for (i = 0; i <this.board.length; i++){
        for(j = 0; j < this.board[i].length; j++) {
            if(this.board[i][j] === tileValue) {
                return {
                    'row' : i,
                    'col' : j
                };
            }
        }
    }
    return;
};

SlidePuzzle.prototype.checkMoveable = function() {
    var col, row, $tile,
    blankTileLoc = this.findTile(this.arrLen),
    blankTileRow =  blankTileLoc.row,
    blankTileCol = blankTileLoc.col;
    $('.block').each(function() {
        $tile = $(this);
        col = $tile.data('col');
        row = $tile.data('row');
        if(!$tile.hasClass('blank') && (col === blankTileCol || row === blankTileRow)) {
            $tile.addClass('moveable');
        } else {
            $tile.removeClass('moveable');
        }
    });
};

SlidePuzzle.prototype.tileMover = function (element, rowDir, colDir) {
    var $tile = $(element),
    col = Number($tile.data('col')),
    row = Number($tile.data('row')),
    $blankTile = $(".block.blank"),
    temp = this.board[row+rowDir][col+colDir];
    this.board[row+rowDir][col+colDir] = this.board[row][col];
    this.board[row][col] = temp;
    $tile.css({
            top : 100 * (row + rowDir),
            left : 100 * (col + colDir)
        }).data({
            'col' : (col + colDir),
            'row' : (row + rowDir)
        }).attr({
            'data-row' : (row + rowDir),
            'data-col' : (col + colDir)
        });
    $blankTile.css({
            top : 100 *  row,
            left : 100 * col
        }).data({
            'col' : col,
            'row' : row
        }).attr({
            'data-row' : row,
            'data-col' : col
        });
    this.moveCounter();
    this.checkSolve();
    return;
};


SlidePuzzle.prototype.moveTile = function (element) {
    var $tile = $(element),
    temp,
    col = Number($tile.data('col')),
    row = Number($tile.data('row')),
    blankTileLoc = this.findTile(this.arrLen),
    blankTileRow =  blankTileLoc.row,
    blankTileCol = blankTileLoc.col;
    switch (true) {
    case col ===blankTileCol && row === blankTileRow :
    break;
    case col < (this.w - 1) && this.board[row][col+1] === this.arrLen :
        //console.log("Right");
        this.tileMover(element, 0, 1);
        break;
    case col > 0 && this.board[row][col-1] === this.arrLen:
        //console.log("Left");
        this.tileMover(element, 0, -1);
        break;
    case row < (this.h-1) && this.board[row+1][col] === this.arrLen :
        //console.log("Down");
        this.tileMover(element, 1, 0);
    break;
    case row > 0 && this.board[row-1][col] === this.arrLen :
        //console.log("Up");
        this.tileMover(element, -1, 0);
        break;
    case row === blankTileRow :
        if (col < blankTileCol) {
            this.moveTile($("div[data-row='" + row  + "'][data-col=" + (col + 1) + "]").get(0));
            this.moveTile(element);
        } else {
            this.moveTile($("div[data-row='" + row  + "'][data-col=" + (col - 1) + "]").get(0));
            this.moveTile(element);
        }
    break;
    case col === blankTileCol :
        if (row < blankTileRow) {
            this.moveTile($("div[data-row='" + (row + 1)  + "'][data-col=" + col + "]").get(0));
            this.moveTile(element);
        } else if (row > blankTileRow && row > 0) {
            this.moveTile($("div[data-row='" + (row-1)  + "'][data-col=" + col + "]").get(0));
            this.moveTile(element);
        }
        break;
    case $($tile).find(".overlay").length !== 0 :
        $tile.find('div.overlay').css('background-color', 'rgba(255,0,0,.25)');
        setTimeout(function() {
            $tile.find('div.overlay').css('background-color', 'transparent');
        },250);
    break;
    }
    this.checkMoveable();
    return;
};

SlidePuzzle.prototype.moveCounter = function() {
    if (this.gameStart) {
        this.moves ++;
        $("#move-count").find("span").html(this.moves);
    }
    return;
};

SlidePuzzle.prototype.personalRecord = function () {
    var newRecord = this.previousRecords.length - 1,
    $table = $("#personal-records tbody"),
    recordNum =$("#personal-records tbody tr").length + 1;
    var $recordNode = $('<tr></tr>').append("<td>" + recordNum + "</td>").append("<td data-size='" + this.previousRecords[newRecord].size + "'>" + this.previousRecords[newRecord].size + "</td>" ).append("<td data-moves='" + this.previousRecords[newRecord].moves + "'>" + this.previousRecords[newRecord].moves + "</td>" ).append("<td data-size='" + this.previousRecords[newRecord].time + "'>" + this.previousRecords[newRecord].time + " sec </td>");
    $("#personal-records tbody").append($recordNode);
};