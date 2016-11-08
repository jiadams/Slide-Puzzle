"use strict";
jQuery(document).ready(function($){
    //Handles default puzzle size as a 4x4, creates board
    var puzzle = new SlidePuzzle(4,4);
    //Creates on click/touch even to shuffle the board when user clicks shuffle
    $(document).on("click touchstart", "button#shuffle-btn", function () {
        puzzle.shuffleBoard();
    });
    //Calls move tile function when a tile is clicked/Touched
    $(document).on("click touchstart", ".block", function () {
        puzzle.moveTile(this);
    });
    //Changes the size of the puzzle
    $(document).on("submit", "#puzzle-size", function (event) {
        var puzzleSize = $(this).serializeArray();
        $('#game-timer').html('Time: ');
        puzzle = new SlidePuzzle(puzzleSize[0].value, puzzleSize[1].value);
        return false;
    });
    //Changes the background of the puzzle, limited form validation on url submission
    $(document).on("submit", "#background-form", function (event) {
        var background = $(this).serializeArray();
        $(this).find("span.warning").remove();
        $("#custom-url").removeClass('warning');
        if(background[0].value === 'custom') {
            if (background[1].value !== "" && background[1].value.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
                puzzle.gameBackground = background[1].value;
            } else {
                $("#custom-url").addClass('warning').before("<span class='warning'>Please Enter Valid URL for custom images</span>");
            }
        } else {
            puzzle.gameBackground = background[0].value;
        }
        puzzle.backgroundSetter();
        return false;
    });
    //Dismisses win animation div on click.
    $(document).on("click touchstart", ".win", function (){
        var $winModal = $(this);
        $winModal.addClass("fade");
        setTimeout(function() {
            $winModal.remove();
        }, 1000);
    });
});

function localStorageIsSup(){
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}