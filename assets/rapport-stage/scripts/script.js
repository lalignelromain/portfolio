   // Animations au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        // Gestion du bouton retour en haut
        window.addEventListener('scroll', function() {
            const floatingBtn = document.getElementById('floatingPortfolioBtn');
            if (window.scrollY > 300) {
                floatingBtn.classList.add('visible');
            } else {
                floatingBtn.classList.remove('visible');
            }
        });

        // Navigation vers les sections
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
            // Mise à jour du bouton actif dans la navigation flottante
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.onclick.toString().includes(sectionId));
            if (activeBtn) activeBtn.classList.add('active');
        }

        // Gestion de l'apparition/disparition du menu flottant et du bouton "Retour en haut"
window.addEventListener('scroll', function() {
    const floatingNav = document.querySelector('.floating-nav');
    const floatingBtn = document.getElementById('floatingPortfolioBtn');

    if (window.scrollY > 300) { // Apparait après 300px de scroll
        floatingNav.classList.add('visible');
        floatingBtn.classList.add('visible');
    } else {
        floatingNav.classList.remove('visible');
        floatingBtn.classList.remove('visible');
    }

    // Mise à jour du bouton actif dans la navigation flottante
    const sections = ['remerciements', 'sommaire', 'introduction', 'entreprise', 'missions', 'apports', 'conclusion', 'annexes'];
    let currentSection = '';
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= 150 && element.getBoundingClientRect().bottom >= 150) {
            currentSection = section;
        }
    });
  
            if (currentSection) {
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.onclick.toString().includes(currentSection));
                if (activeBtn) activeBtn.classList.add('active');
            }
        });