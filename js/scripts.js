$(document).ready(function(){
    var puzzle = new SlidePuzzle(4,4);
    $(document).on("click touchstart", "button#shuffle-btn", function () {
        puzzle.shuffleBoard();
    });
    $(document).on("click touchstart", ".block", function () {
        puzzle.moveTile(this);
    });
    $(document).on("submit", "#puzzle-size", function (event) {
        var puzzleSize = $(this).serializeArray();
        $('#game-timer').html('Time: ');
        puzzle = new SlidePuzzle(puzzleSize[0].value, puzzleSize[1].value);
        return false;
    });
    $(document).on("submit", "#background-form", function (event) {
        var background = $(this).serializeArray();
        $(this).find("span.warning").remove();
        $("#custom-url").removeClass('warning');
        if(background[0].value === 'custom') {
            if (background[1].value !== "" && background[1].value.match(/\.(jpeg|jpg|gif|png)$/) != null) {
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
    $(document).on("click", ".win", function (){
        $winModal = $(this);
        $winModal.addClass('fade');
        setTimeout(function() {
            $winModal.remove();
        }, 1000);
    });
});

