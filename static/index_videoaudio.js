document.addEventListener('DOMContentLoaded', function () {
    const openingVideo = document.getElementById('openingVideo');
    const loopingVideo = document.getElementById('loopingVideo');
    const bgm = document.getElementById('bgm');
    const sfx2 = document.getElementById('openingsound');

    bgm.volume = 0.25; // Set the volume of the background music to 10%
    sfx2.volume = 0.25; // Set the volume of the opening sound to 50%

    function animateElements() {
        const elements = document.querySelectorAll('.MenuButtons');

        const elementsStartPos = []

        elements.forEach((element) => {
            element.style.opacity = 0; // Start with opacity 0
            elementsStartPos.push(element.style.top); // Store the original top position
            element.style.top = '150px'; // Start above the screen
        });

        setTimeout(() => {
            elements.forEach((element, index) => {
                // Set a delay before starting the animation for each element
                setTimeout(() => {
                    element.style.opacity = 1; // Start the fade-in
                    element.style.transition = 'top 1.4s ease-out, opacity 4s cubic-bezier(.45,0,.65,1)'; // Add transition for the fall effect

                    // Use requestAnimationFrame for smooth animation
                    requestAnimationFrame(() => {
                        element.style.top = elementsStartPos[index]; // Fall to the original position
                    });
                }, 20 * (index + 1)); // Delay in milliseconds (1000ms = 1s) for each element with staggered effect
            });
        }, 450); // Delay in milliseconds before starting the animation
    }

    bgm.play(); // Start playing the background music
    openingVideo.play(); // Start playing the opening video
    animateElements(); // Start the animation for the menu buttons

    setTimeout(() => {
        sfx2.play(); // Start playing the opening sound
    }, 750); // Delay in milliseconds before starting the background music
    

    openingVideo.onended = function () {
        openingVideo.style.display = 'none'; // Hide the opening video
        loopingVideo.style.display = 'block'; // Show the looping video
        loopingVideo.play(); // Start playing the looping video
    };
});