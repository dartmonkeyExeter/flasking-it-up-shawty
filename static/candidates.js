
var clicked = false;

window.addEventListener('DOMContentLoaded', function () {
    var chip = document.getElementById('player-chip');
    var cursor = document.getElementById('custom-cursor');
    var charactersOverlay = document.getElementById('characters-overlay-div');
    var playerPortrait = document.getElementById('player-portrait');
    var characterNameAudioElement = document.getElementById('melee-select');
    var chipRect = document.getElementById('chip-hbox').getBoundingClientRect();
    var safeZone = document.getElementById('safe-place-zone');
    var lastHoveredCell = null;
    var playerNameElement = document.getElementById('player-name');

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

    document.addEventListener('mousemove', function (e) {

        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';

        if (clicked) {
            cursor.src = "../static/site%20images/grab.png";
        }
        else if (overlapping(cursor.getBoundingClientRect(), charactersOverlay.getBoundingClientRect())) {
            cursor.src = "../static/site%20images/neutral.png";
        } else {
            cursor.src = "../static/site%20images/point.png";
        }

        if (clicked) {
            chip.style.left = e.pageX + 'px';
            chip.style.top = e.pageY + 'px';

            var visibleCellsList = getVisibleCells(charactersOverlay);
            var chipRect = document.getElementById('chip-hbox').getBoundingClientRect();

            if (!overlapping(chipRect, charactersOverlay.getBoundingClientRect())) {
                playerPortrait.style.opacity = 0;
                playerNameElement.innerHTML = "";
            } else {
                playerPortrait.style.opacity = 0.5;
                playerNameElement.style.opacity = 0.8;
            }

            if (!lastHoveredCell || !overlapping(chipRect, lastHoveredCell.getBoundingClientRect())) {
                var hoveredCell = null;
                for (let cell of visibleCellsList) {
                    if (overlapping(chipRect, cell.getBoundingClientRect())) {
                        hoveredCell = cell;
                    }
                }
                if (hoveredCell) {
                    playerPortrait.src = portraits[(hoveredCell.id.split('_')[1] - 1) % portraits.length];
                    playerNameElement.style.opacity = 0.8;
                    playerNameElement.innerHTML = characterNames[(hoveredCell.id.split('_')[1] - 1) % characterNames.length];
                }
            }
            lastHoveredCell = hoveredCell;
        }
    });

    chip.addEventListener('mousedown', function (e) {
        if (!clicked) {
            clicked = true;
            e.preventDefault();
            if (clicked) {
                cursor.src = "../static/site%20images/grab.png";
            }
            else if (overlapping(cursor.getBoundingClientRect(), charactersOverlay.getBoundingClientRect())) {
                cursor.src = "../static/site%20images/neutral.png";
            } else {
                cursor.src = "../static/site%20images/point.png";
            }
            chip.style.left = e.pageX + 'px';
            chip.style.top = e.pageY + 'px';
        }
    });


    document.addEventListener('mouseup', function (e) {
        if (clicked) {
            clicked = false;
            if (clicked) {
                cursor.src = "../static/site%20images/grab.png";
            }
            else if (overlapping(cursor.getBoundingClientRect(), charactersOverlay.getBoundingClientRect())) {
                cursor.src = "../static/site%20images/neutral.png";
            } else {
                cursor.src = "../static/site%20images/point.png";
            }
            var chipRect = document.getElementById('chip-hbox').getBoundingClientRect();

            if (overlapping(chipRect, charactersOverlay.getBoundingClientRect())) {
                var visibleCellsList = getVisibleCells(charactersOverlay);

                var placedCell = null;

                for (let cell of visibleCellsList) {
                    if (overlapping(chipRect, cell.getBoundingClientRect())) {
                        placedCell = cell;
                        break;
                    }
                }

                if (placedCell) {
                    var candidateId = placedCell.id.split('_')[1];
                    playerPortrait.style.opacity = 1;
                    playerNameElement.style.opacity = 1;
                    characterNameAudioElement.src = voiceClips[(candidateId - 1) % voiceClips.length];
                    characterNameAudioElement.play();
                    setTimeout(function () {
                        window.location.href = '/candidates/' + candidateId;
                    }, 1500);
                }
            }
            else if (overlapping(chipRect, safeZone.getBoundingClientRect())) {
                console.log('Safe Zone');
            }
            else {
                var visibleCellsList = getVisibleCells(charactersOverlay);
                // pick a random cell, and place the chip there
                var randomCell = visibleCellsList[Math.floor(Math.random() * visibleCellsList.length)];
                chip.style.transition = 'left 0.2s, top 0.2s'
                chip.style.left = randomCell.getBoundingClientRect().left + 62 + 'px';
                chip.style.top = randomCell.getBoundingClientRect().top + 62 + 'px';

                var candidateId = randomCell.id.split('_')[1];
                playerPortrait.style.opacity = 1;
                playerNameElement.style.opacity = 1;
                playerNameElement.innerHTML = characterNames[(candidateId - 1) % characterNames.length];
                playerPortrait.src = portraits[(candidateId - 1) % portraits.length];
                characterNameAudioElement.src = voiceClips[(candidateId - 1) % voiceClips.length];
                characterNameAudioElement.play();
                setTimeout(function () {
                    window.location.href = '/candidates/' + candidateId;
                }, 1500);
            }
        }
    });
});


