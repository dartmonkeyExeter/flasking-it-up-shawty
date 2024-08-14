document.addEventListener('DOMContentLoaded', function () {

    const buttons = document.querySelectorAll('.MenuButtons');
    const svg1 = document.querySelector('.selector1');
    const svg2 = document.querySelector('.selector2');

    // Select the actual polygon elements inside your SVG containers
    const polygon1 = svg1.querySelector('polygon'); 
    const polygon2 = svg2.querySelector('polygon'); 

    // Apply CSS class for smooth transitions
    svg1.classList.add('svg-element');
    svg2.classList.add('svg-element');

    const pointsInfoPerButton = [
        { left: "47%", top: "32%", whitePoints: "120,10 115,145 30,150", redPoints: "125,0 115,150 30,140" },
        { left: "49%", top: "38%", whitePoints: "125,0 117,145 30,150", redPoints: "125,20 120,130 20,140" },
        { left: "49%", top: "46%", whitePoints: "110,0 117,145 20,150", redPoints: "90,10 125,120 25,137" },
        { left: "50%", top: "52%", whitePoints: "120,0 105,140 20,145", redPoints: "90,80 125,150 25,100" },
        { left: "49%", top: "59%", whitePoints: "120,20 110,150 20,115", redPoints: "125,10 115,150 10,115" }
    ];

    const animatePoints = (polygon, newPoints, duration = 300) => {
        const oldPoints = polygon.getAttribute('points').split(' ').map(point => point.split(',').map(parseFloat));
        const targetPoints = newPoints.split(' ').map(point => point.split(',').map(parseFloat));
        
        const frameCount = duration / (1000 / 60);
        let currentFrame = 0;

        const animate = () => {
            currentFrame++;
            const progress = Math.min(currentFrame / frameCount, 1);

            const interpolatedPoints = oldPoints.map((oldPoint, i) => {
                const [oldX, oldY] = oldPoint;
                const [newX, newY] = targetPoints[i];

                const x = oldX + (newX - oldX) * progress;
                const y = oldY + (newY - oldY) * progress;

                return `${x},${y}`;
            });

            polygon.setAttribute('points', interpolatedPoints.join(' '));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    buttons.forEach(function (button, index) {
        button.addEventListener('mouseover', () => {
            // Position SVGs based on button position with transition
            svg1.style.left = `${pointsInfoPerButton[index].left}`;
            svg1.style.top = `${pointsInfoPerButton[index].top}`;
            svg2.style.left = `${pointsInfoPerButton[index].left}`;
            svg2.style.top = `${pointsInfoPerButton[index].top}`;

            // Animate the points attribute for the polygons
            animatePoints(polygon1, pointsInfoPerButton[index].whitePoints);
            animatePoints(polygon2, pointsInfoPerButton[index].redPoints);
        });

        button.addEventListener('mouseleave', () => {
            svg1.style.left = `-100px`;  // Hide offscreen
            svg1.style.top = `-100px`;   // Hide offscreen
            svg2.style.left = `-100px`;  // Hide offscreen
            svg2.style.top = `-100px`;   // Hide offscreen
        });
    });

    const svgWidth = 150;
    const svgHeight = 125;

    const radius = 5; // radius of maximum randomness from start pos
    const speed = 0.5; // speed of movement

    const animate = () => {
        const points = polygon1.getAttribute('points').split(' ');
        const points2 = polygon2.getAttribute('points').split(' ');

        points.forEach((point, index) => {
            const [x, y] = point.split(',').map(parseFloat);

            const dx = (Math.random() - 0.5) * (radius / 4);
            const dy = (Math.random() - 0.5) * (radius / 4);

            const newX = x + dx * speed;
            const newY = y + dy * speed;

            points[index] = `${newX},${newY}`;
        });

        points2.forEach((point, index) => {
            const [x, y] = point.split(',').map(parseFloat);

            const dx = (Math.random() - 0.5) * radius;
            const dy = (Math.random() - 0.5) * radius;

            const newX = x + dx * speed;
            const newY = y + dy * speed;

            points2[index] = `${newX},${newY}`;
        });

        polygon1.setAttribute('points', points.join(' '));
        polygon2.setAttribute('points', points2.join(' '));

    };

    setInterval(animate, 1000 / 60); // 60 frames per second
});
