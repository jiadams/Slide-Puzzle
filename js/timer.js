var Timer = function(element, delay) {
    var timer = createTimer(),
    offset,
    clock,
    interval;

    element.appendChild(timer);

    reset();

    function createTimer() {
        return document.createElement("span");
    }

    function start() {
        if (!interval) {
          offset   = Date.now();
          interval = setInterval(update, delay);
        }
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        return (clock/1000).toFixed(3);
    }

    function reset() {
        clock = 0;
        render();
    }

    function change() {
        var now = Date.now(),
        d = now - offset;
        offset = now;
        return d;
    }

    function update() {
        clock += change();
        render();
    }

    function render() {
        timer.innerHTML = (clock/1000).toFixed(3);
    }

    this.start = start;
    this.stop = stop;
    this.reset = reset;

}