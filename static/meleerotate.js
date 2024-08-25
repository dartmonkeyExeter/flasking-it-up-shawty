window.addEventListener('DOMContentLoaded', (event) => {
    const rotateDiv = document.getElementById('rotate-div');
    const rotationAngle = 30; // Define the rotation angle here
    const translateAmount = 45; // Define the amount to move the div to center it

    const style = document.createElement('style');

    style.innerHTML = `
        @keyframes rotateLeft { 
            0% { transform: rotate3d(0, 1, 0, 0deg) translateZ(0); } 
            100% { transform: rotate3d(0, 1, 0, ${rotationAngle}deg) translateZ(${translateAmount}px); } 
        }
        @keyframes rotateRight { 
            0% { transform: rotate3d(0, 1, 0, 0deg) translateZ(0); } 
            100% { transform: rotate3d(0, 1, 0, -${rotationAngle}deg) translateZ(${translateAmount}px); } 
        }
        @keyframes rotateUp { 
            0% { transform: rotate3d(1, 0, 0, 0deg) translateZ(0); } 
            100% { transform: rotate3d(1, 0, 0, ${rotationAngle}deg) translateY(${translateAmount}px); } 
        }
        @keyframes rotateDown { 
            0% { transform: rotate3d(1, 0, 0, 0deg) translateZ(0); } 
            100% { transform: rotate3d(1, 0, 0, -${rotationAngle}deg) translateY(${translateAmount}px); } 
        }
    `;

    document.head.appendChild(style);

    // Enable smooth transitions
    rotateDiv.style.transition = 'transform 0.1s ease';

    document.onkeydown = function (e) {
        if (e.key === 'ArrowLeft') {
            rotateDiv.style.transform = `rotate3d(0, 1, 0, ${rotationAngle}deg) translateZ(${translateAmount}px)`;
        } else if (e.key === 'ArrowRight') {
            rotateDiv.style.transform = `rotate3d(0, 1, 0, -${rotationAngle}deg) translateZ(${translateAmount}px)`;
        } else if (e.key === 'ArrowUp') {
            rotateDiv.style.transform = `rotate3d(1, 0, 0, -${rotationAngle}deg) translateY(${translateAmount}px)`;
        } else if (e.key === 'ArrowDown') {
            rotateDiv.style.transform = `rotate3d(1, 0, 0, ${rotationAngle}deg) translateY(${translateAmount}px)`;
        }
    };

    document.onkeyup = function () {
        // Smoothly reset to the original position
        rotateDiv.style.transform = 'rotate3d(0, 0, 0, 0deg) translateZ(0) translateY(0)';
    };
});
