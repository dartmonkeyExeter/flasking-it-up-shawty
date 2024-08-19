
var clicked = false;

window.addEventListener('DOMContentLoaded', function() {
    var chip = document.getElementById('player-chip');
    var cursor = document.getElementById('custom-cursor');
    var characterContainer = document.getElementById('characters-div');
    var playerPortrait = document.getElementById('player-portrait');
    var characterNameAudioElement = document.getElementById('melee-select');
    characterNameAudioElement.volume = 0.5;
    
    var voiceClips = [];
    var portraits = [];

    var characterNames = ['Dr. Mario', 'Mario', 'Luigi', 'Bowser', 'Peach', 'Yoshi', 'DK', 'Captain Falcon', 'Ganondorf', 'Falco', 'Fox', 'Ness', 'Ice Climbers', 'Kirby', 'Samus', 'Zelda', 'Link', 'Young Link', 'Pichu', 'Pikachu', 'Jigglypuff', 'Mewtwo', 'Mr. Game&Watch', 'Marth', 'Roy'];
    
    characterNames.forEach((characterName, index) => {
        voiceClips.push('../static/site sounds/MeleeAnnouncer/' + (index + 1) + '_' + characterName + '.wav');
        portraits.push('../static/site images/MeleePortraits/' + characterName + '.png');
    });

    console.log(voiceClips);

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
            var visibleCellsList = getVisibleCells(document.getElementById('characters-overlay-div'));
            var placedCell = null;
            for(let cell of visibleCellsList) {
                if (overlapping(chip.getBoundingClientRect(), cell.getBoundingClientRect())) {
                    placedCell = cell;
                }
            }
            if (placedCell) {
                playerPortrait.src = portraits[(placedCell.id.split('_')[1] - 1) % portraits.length];
           }
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
                characterNameAudioElement.src = voiceClips[(candidateId - 1) % voiceClips.length];
                characterNameAudioElement.play();
                setTimeout(function() {
                    window.location.href  = '/candidates/' + candidateId;
                }, 1500);
            }
        }
    });
});


