var clicked = false;

window.addEventListener('DOMContentLoaded', function() {
    var chip = document.getElementById('player-chip');
    var cursor = document.getElementById('custom-cursor');

    chip.addEventListener('mousedown', function(e) {
        clicked = true;
        e.preventDefault();
        cursor.src = "../static/site%20images/grab.png";
        chip.style.left = e.pageX + 'px';
        chip.style.top = e.pageY + 'px';
        console.log(cursor.style.background);
    });

    document.addEventListener('mouseup', function(e) {
        clicked = false;
        cursor.src = "../static/site%20images/point.png";
    });

    document.addEventListener('mousemove', function(e) {
    
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
    
        if (clicked) {
            chip.style.left = e.pageX + 'px';
            chip.style.top = e.pageY + 'px';
        }
    });

});


