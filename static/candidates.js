



var clicked = false;

window.addEventListener('DOMContentLoaded', function() {
    var chip = document.getElementById('player-chip');
    var cursor = document.getElementById('custom-cursor');
    var characterContainer = document.getElementById('characters-div');

    function overlapping(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    function getVisibleCells(container) {
        const containerRect = container.getBoundingClientRect();
        const visibleCells = [];

        // Get all child elements (grid cells)
        const cells = document.querySelectorAll('.character');

        cells.forEach(cell => {
            const cellRect = cell.getBoundingClientRect();

            // Check if the cell is within the visible area of the container
            const isVisible = overlapping(containerRect, cellRect);

            if (isVisible) {
                visibleCells.push(cell);
            }
        });

    return visibleCells;
    }

    document.addEventListener('mousemove', function(e) {
    
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
    
        if (clicked) {
            chip.style.left = e.pageX + 'px';
            chip.style.top = e.pageY + 'px';
        }
    });

    chip.addEventListener('mousedown', function(e) {
        if (!clicked) {
            clicked = true;
            e.preventDefault();
            cursor.src = "../static/site%20images/grab.png";
            chip.style.left = e.pageX + 'px';
            chip.style.top = e.pageY + 'px';
        }
    });
    

    document.addEventListener('mouseup', function(e) {
        if (clicked) {
            clicked = false;
            cursor.src = "../static/site%20images/point.png";
            var visibleCellsList = getVisibleCells(document.getElementById('characters-overlay-div'));
            var placedCell = null;
            for(let cell of visibleCellsList) {
                if (overlapping(chip.getBoundingClientRect(), cell.getBoundingClientRect())) {
                    placedCell = cell;
                }
            }
            // get candidate id from the placed cell's id, split by '_'
            var candidateId = placedCell.id.split('_')[1];

            
            if (placedCell) {
                window.location.href  = '/candidates/' + candidateId;
            }
        }
    });
});


