// Hero Shrink on Scroll
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (window.scrollY > 50) {
        hero.classList.add('scrolled');
    } else {
        hero.classList.remove('scrolled');
    }
});