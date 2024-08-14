// script.js


document.addEventListener('DOMContentLoaded', function () {

    const buttons = document.querySelectorAll('.MenuButtons');
    const svg1 = document.querySelector('.selector1');
    const svg2 = document.querySelector('.selector2');

    // Select the actual polygon elements inside your SVG containers
    const polygon1 = svg1.querySelector('polygon'); // or .getElementById('polygon1')
    const polygon2 = svg2.querySelector('polygon'); // or .getElementById('polygon2')

    const pointsInfoPerButton = [
        { left: "47%", top: "32%", whitePoints: "120,10 115,145 30,150", redPoints: "125,0 115,150 30,140" },
        { left: "49%", top: "38%", whitePoints: "125,0 117,145 30,150", redPoints: "125,20 120,130 20,140" },
        { left: "49%", top: "46%", whitePoints: "110,0 117,145 20,150", redPoints: "90,10 125,120 25,137" },
        { left: "50%", top: "52%", whitePoints: "120,0 105,140 20,145", redPoints: "90,80 125,150 25,100" },
        { left: "49%", top: "59%", whitePoints: "120,20 110,150 20,115", redPoints: "125,10 115,150 10,115"}
    ];

    buttons.forEach(function (button, index) {
        button.addEventListener('mouseover', (event) => {
            // Position SVGs based on button position
            svg1.style.position = 'absolute';
            svg1.style.left = `${pointsInfoPerButton[index].left}`;
            svg1.style.top = `${pointsInfoPerButton[index].top}`;
            // Update the points attribute for the polygon
            polygon1.setAttribute('points', pointsInfoPerButton[index].whitePoints);

            svg2.style.position = 'absolute';
            svg2.style.left = `${pointsInfoPerButton[index].left}`;
            svg2.style.top = `${pointsInfoPerButton[index].top}`;
            // Update the points attribute for the polygon
            polygon2.setAttribute('points', pointsInfoPerButton[index].redPoints);
        });

        button.addEventListener('mouseleave', () => {
            svg1.style.left = `-100px`;  // Hide offscreen
            svg1.style.top = `-100px`;   // Hide offscreen

            svg2.style.left = `-100px`;  // Hide offscreen
            svg2.style.top = `-100px`;   // Hide offscreen
        });
    });

    const openingVideo = document.getElementById('openingVideo');
    const loopingVideo = document.getElementById('loopingVideo');
    const bgm = document.getElementById('bgm');

    bgm.volume = 0.5; // Set the volume of the background music to 10%

    openingVideo.onended = function () {
        openingVideo.style.display = 'none'; // Hide the opening video
        loopingVideo.style.display = 'block'; // Show the looping video
        loopingVideo.play(); // Start playing the looping video
    };
});

