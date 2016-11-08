"use strict";
//Timer Class used to keep track of time
var Timer = function(element, delay) {
    var timer = createTimer(),
    offset,
    clock,
    interval;
//Appends the timer to element specified in function arguments
    element.appendChild(timer);

    reset();
//Creates element to store timer in.
    function createTimer() {
        return document.createElement("span");
    }
//Start the timer
    function start() {
        if (!interval) {
          offset   = Date.now();
          interval = setInterval(update, delay);
        }
    }
//Stop the timer, return timer to the Thousandth of a second
    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        return (clock / 1000).toFixed(3);
    }
//Reset timer
    function reset() {
        clock = 0;
        render();
    }
//Add the Change in time since the clock was last updated to the timer
    function change() {
        var now = Date.now(),
        d = now - offset;
        offset = now;
        return d;
    }
//Update the timer based on the change in time
    function update() {
        clock += change();
        render();
    }
//Render the timer in the HTML to the thousandth of a second.
    function render() {
        timer.innerHTML = (clock / 1000).toFixed(3);
    }

//Create API
    this.start = start;
    this.stop = stop;
    this.reset = reset;
};