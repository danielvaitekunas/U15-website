const headerHTML = `
<header>
    <div class="logo-container">
        <a href="index.html" style="display:flex; align-items:center; gap: 1rem; color:inherit; text-decoration:none;">
            <img src="assets/logo.png" alt="Hot Beans Web Logo" onerror="this.src='https://placehold.co/200x50/d30000/FFF?text=HBW'">
        </a>
    </div>
    <nav>
        <ul id="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="trainees.html">Trainees</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="jobspec.html">Jobs</a></li>
            <li><a href="apply.html">Apply for Jobs</a></li>
        </ul>
    </nav>
    <button class="hamburger" id="hamburger-btn">
        &#9776;
    </button>
</header>
`;

const footerHTML = `
<footer>
    <div class="footer-section">
        <div class="logo-container">
            <img src="assets/logo.png" alt="Hot Beans Web Logo" onerror="this.style.display='none'">
        </div>
    </div>
    <div class="footer-section socials">
        <a href="https://x.com/"><i class="fa-brands fa-square-twitter"></i> Twitter</a>
        <a href="https://linkedin.com"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>
        <a href="https://github.com"><i class="fa-brands fa-github"></i> GitHub</a>
    </div>
    <div class="footer-section">
        <p>&copy; 2026 Hot Beans Web. All rights reserved.</p>
    </div>
</footer>
`;

// Inject Header and Footer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Insert header at the top
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    // Insert footer at the bottom
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Set active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navUl = document.getElementById('nav-links');

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

    // Hide header on scroll down, show on scroll up
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (!header) return;

        // Don't hide at the very top of the page (give it a 50px buffer)
        if (window.scrollY > 50) {
            // Require a scroll distance of at least 10px to hide/show 
            // (prevents header from jumping when opening accordions)
            if (window.scrollY > lastScrollY + 10) {
                // Scrolling down
                header.classList.add('header--hidden');
                // Auto-close mobile menu if it's open when scrolling down
                if (navUl && navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                }
            } else if (window.scrollY < lastScrollY - 10) {
                // Scrolling up
                header.classList.remove('header--hidden');
            }
        } else {
            // At top of page, always show
            header.classList.remove('header--hidden');
        }
        
        // Update last scroll position only if moved significantly
        if (Math.abs(window.scrollY - lastScrollY) > 10) {
            lastScrollY = window.scrollY;
        }
    });
});

// Page Loader
window.addEventListener('load', () => {
    // Add a slight delay to ensure the loader is visible briefly and transition is smooth
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 400);
});
