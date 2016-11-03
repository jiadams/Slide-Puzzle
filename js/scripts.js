$(document).ready(function(){
    var puzzle = new SlidePuzzle(4,4);
    $(document).on("click touchstart", "button#shuffle-btn", function () {
        puzzle.shuffleBoard();
    });
    $(document).on("click touchstart", ".block", function () {
        puzzle.moveTile(this);
    });
});