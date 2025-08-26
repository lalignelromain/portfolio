// Animations au scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Gestion des modales
function openCV() { document.getElementById("cvModal").style.display = "block"; }
function closeCV() { document.getElementById("cvModal").style.display = "none"; }
function openMindset() { document.getElementById("mindsetModal").style.display = "block"; }
function closeMindset() { document.getElementById("mindsetModal").style.display = "none"; }

// Fermeture modale en cliquant à l'extérieur
window.onclick = function(event) {
    const cvModal = document.getElementById("cvModal");
    const mindsetModal = document.getElementById("mindsetModal");
    if (event.target === cvModal) closeCV();
    if (event.target === mindsetModal) closeMindset();
};

// Gestion des onglets Mind-Set
function showMindsetTab(tabName) {
    document.querySelectorAll('.mindset-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.mindset-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('mindset-tab-' + tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}
