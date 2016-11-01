var SlidePuzzle = function (width,height) {
    this.w = width;
    this.h = height;
    this.moves = 0;
    this.board = this.buildBoard();
    console.log(this.board);
};

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
    do {
        tempArray = this.shuffle(tempArray);
    } while (!this.solvable(tempArray));
    boardArray = this.createMDArray();
    k = 0;
    for (i = 0; i < this.h; i++) {
        for (j = 0; j < this.w; j++) {
            boardArray[i][j] = tempArray[k];
            k++;
        }
    }
    return boardArray;
};

SlidePuzzle.prototype.solvable = function(boardArray) {
    var i, j, blank, inv = 0, arrLen = boardArray.length 
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
        var blankRow = -((Math.ceil(blank / this.h )) - (this.h +1))
        if (!inv%2 && blankRow%2) {
            return false;
        } else if(!blankRow%2) {
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

SlidePuzzle.prototype.drawBoard {
    
}