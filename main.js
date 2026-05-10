/**
 * Capital City Solar - SPA Router and Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SPA Routing Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.spa-view');

    function navigateTo(hash) {
        // Default to home if no hash or invalid hash
        let targetId = hash.replace('#', 'view-');
        let targetView = document.getElementById(targetId);

        if (!targetView) {
            targetId = 'view-home';
            targetView = document.getElementById('view-home');
        }

        // Hide all views
        views.forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        targetView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update active state in nav
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + targetId.replace('view-', '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Re-trigger scroll animations in the new view
        setTimeout(initScrollAnimations, 100);
    }

    // Intercept clicks on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                history.pushState(null, null, href);
                navigateTo(href);
            }
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        navigateTo(window.location.hash);
    });

    // Initial load
    navigateTo(window.location.hash || '#home');


    // --- 2. Modal Logic ---
    const modal = document.getElementById('quote-modal');
    const openBtns = document.querySelectorAll('.open-quote');
    const closeBtn = document.querySelector('.close-modal');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });


    // --- 3. Scroll Reveal Animations ---
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.spa-view.active .reveal-up');
        
        const revealOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Trigger for the initial load
    setTimeout(initScrollAnimations, 100);

    // --- 4. Calculator Logic ---
    const inputBill = document.getElementById('input-bill');
    const inputOffset = document.getElementById('input-offset');
    const valBill = document.getElementById('val-bill');
    const valOffset = document.getElementById('val-offset');
    const calcTotal = document.getElementById('calc-total');

    function calculateSavings() {
        if (!inputBill || !inputOffset || !calcTotal) return;

        const bill = parseFloat(inputBill.value);
        const offset = parseFloat(inputOffset.value) / 100;
        
        // Update labels
        valBill.textContent = '$' + bill;
        valOffset.textContent = Math.round(offset * 100) + '%';

        // Calculate 25-year utility cost with 5% annual increase
        let totalUtilityCost = 0;
        let currentYearlyCost = bill * 12;
        
        for (let i = 0; i < 25; i++) {
            totalUtilityCost += currentYearlyCost;
            currentYearlyCost *= 1.05; // 5% increase
        }

        // Calculate offset cost (Gross Savings)
        const grossSavings = totalUtilityCost * offset;
        
        // Subtract estimated solar cost (rough estimate: $100 per $1 of monthly bill + $5000 base)
        const estimatedSystemCost = 5000 + (bill * 100);
        
        let netSavings = grossSavings - estimatedSystemCost;
        if (netSavings < 0) netSavings = 0;

        // Format to currency string
        calcTotal.textContent = '$' + Math.round(netSavings).toLocaleString();
    }

    if (inputBill) {
        inputBill.addEventListener('input', calculateSavings);
        inputOffset.addEventListener('input', calculateSavings);
        calculateSavings(); // Initial calc
    }

});
