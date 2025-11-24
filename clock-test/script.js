document.addEventListener("DOMContentLoaded", () => {
    const curtain = document.querySelector('.rnOuter');
    const button = document.getElementById('openCurtainBtn');

    button.addEventListener('click', () => {
        curtain.classList.add('open');   // Open curtain
        button.remove();                 // Completely remove button
    });
});

