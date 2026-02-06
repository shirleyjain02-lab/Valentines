document.addEventListener('DOMContentLoaded', () => {
    // Page elements
    const envelopePage = document.getElementById('envelope-page');
    const letterPage = document.getElementById('letter-page');
    const successPage = document.getElementById('success-page');
    const envelope = document.getElementById('envelope');

    // Letter page elements
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const buttonsContainer = document.getElementById('buttons-container');
    const warningMessage = document.getElementById('warning-message');


    // State
    let noClickCount = 0;
    let yesBtnScale = 1;

    // Navigate between pages
    function showPage(pageToShow) {
        envelopePage.classList.remove('active');
        letterPage.classList.remove('active');
        successPage.classList.remove('active');

        setTimeout(() => {
            pageToShow.classList.add('active');
        }, 100);
    }

    // Envelope click handler
    envelope.addEventListener('click', () => {
        showPage(letterPage);
    });

    // Yes button handler
    yesBtn.addEventListener('click', () => {
        showPage(successPage);
    });

    // No button - run away on hover
    function moveNoButton(e) {
        const containerRect = buttonsContainer.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        // Calculate new random position within container bounds (with some padding)
        const maxX = containerRect.width - btnRect.width - 20;
        const maxY = 150; // Allow some vertical movement

        let newX = Math.random() * maxX - maxX / 2;
        let newY = Math.random() * maxY - maxY / 2;

        // Make sure it moves away from cursor
        const cursorX = e.clientX - containerRect.left - containerRect.width / 2;
        const cursorY = e.clientY - containerRect.top;

        if (Math.sign(newX) === Math.sign(cursorX)) {
            newX = -newX;
        }

        noBtn.style.position = 'absolute';
        noBtn.style.transition = 'transform 0.3s ease';
        noBtn.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('mousemove', moveNoButton);

    // No button click handler (in case they somehow click it)
    noBtn.addEventListener('click', () => {
        noClickCount++;

        // Show warning message
        warningMessage.classList.remove('hidden');
        warningMessage.classList.remove('fade-out');

        // After 2 seconds, fade out the warning message
        setTimeout(() => {
            warningMessage.classList.add('fade-out');

            // After fade completes, make yes bigger, no smaller
            setTimeout(() => {
                // Make yes button bigger
                yesBtnScale += 0.3;
                yesBtn.style.transform = `scale(${yesBtnScale})`;
                yesBtn.style.zIndex = '10';

                // Make no button smaller and more transparent
                const noOpacity = Math.max(0, 1 - (noClickCount * 0.3));
                const noScale = Math.max(0.3, 1 - (noClickCount * 0.2));
                noBtn.style.opacity = noOpacity;
                noBtn.style.transform = `scale(${noScale})`;

                // If no button is almost invisible, hide it completely
                if (noClickCount >= 3) {
                    noBtn.style.visibility = 'hidden';
                }
            }, 1000); // Wait for fade to complete
        }, 2000); // Show for 2 seconds
    });

    // Touch support for mobile devices
    let touchMoveCount = 0;
    noBtn.addEventListener('touchstart', (e) => {
        touchMoveCount++;
        if (touchMoveCount < 5) {
            e.preventDefault();
            moveNoButton({
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
            });
        }
    });
});
