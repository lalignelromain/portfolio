// Gestionnaire de performance intelligent
class PerformanceManager {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.performanceLevel = 'high';
        this.monitoringActive = false;
        this.resizeTimeout = null;
        this.root = document.documentElement;
        this.init();
    }

    async detectDeviceCapabilities() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*Mobile)/i.test(navigator.userAgent);
        const lowMemory = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
        const lowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
        const slowConnection = navigator.connection ?
            (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g') :
            false;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let batteryLow = false;
        if (navigator.getBattery) {
            try {
                const battery = await navigator.getBattery();
                batteryLow = battery.level < 0.2;
            } catch (e) {
                console.debug('⚠️ Impossible de lire le niveau de batterie:', e);
            }
        }
        return { isMobile, isTablet, lowMemory, lowCores, slowConnection, reducedMotion, batteryLow };
    }

    async setPerformanceLevel() {
        const capabilities = await this.detectDeviceCapabilities();
        if (capabilities.reducedMotion) {
            this.performanceLevel = 'none';
            document.body.classList.add('no-animations');
            this.updateCSSVariables('none');
            console.log('🔇 Animations désactivées (accessibilité)');
            return;
        }
        if (capabilities.isMobile || capabilities.lowMemory || capabilities.lowCores || capabilities.batteryLow) {
            this.performanceLevel = 'low';
            document.body.classList.add('low-performance');
            this.updateCSSVariables('low');
            console.log('📱 Mode performance réduite activé');
        } else if (capabilities.slowConnection) {
            this.performanceLevel = 'medium';
            document.body.classList.add('performance-mode');
            this.updateCSSVariables('medium');
            console.log('🌐 Mode performance moyenne (connexion lente)');
        } else {
            this.performanceLevel = 'high';
            this.updateCSSVariables('high');
            console.log('🚀 Mode haute performance activé');
            this.startPerformanceMonitoring();
        }
    }

    updateCSSVariables(level) {
        const settings = {
            none: { animationDuration: '0s', backgroundOpacity: '0.01', particlesOpacity: '0.02', playState: 'paused' },
            low: { animationDuration: '60s', backgroundOpacity: '0.02', particlesOpacity: '0.05', playState: 'running' },
            medium: { animationDuration: '45s', backgroundOpacity: '0.025', particlesOpacity: '0.08', playState: 'running' },
            high: { animationDuration: '30s', backgroundOpacity: '0.03', particlesOpacity: '0.1', playState: 'running' }
        };
        const config = settings[level];
        this.root.style.setProperty('--animation-duration', config.animationDuration);
        this.root.style.setProperty('--background-opacity', config.backgroundOpacity);
        this.root.style.setProperty('--particles-opacity', config.particlesOpacity);
        this.root.style.setProperty('--animation-play-state', config.playState);
    }

    startPerformanceMonitoring() {
        if (this.monitoringActive || this.performanceLevel !== 'high') return;
        this.monitoringActive = true;
        console.log('📊 Monitoring des performances démarré');
        const checkFrameRate = () => {
            if (!this.monitoringActive) return;
            this.frameCount++;
            const currentTime = performance.now();
            if (currentTime - this.lastTime >= 2000) {
                const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                if (fps < 20) {
                    this.performanceLevel = 'low';
                    this.updateCSSVariables('low');
                    document.body.classList.add('low-performance');
                    console.warn(`⚠️ FPS faible détecté (${fps}) - passage en mode faible performance`);
                } else if (fps < 30 && this.performanceLevel === 'high') {
                    this.performanceLevel = 'medium';
                    this.updateCSSVariables('medium');
                    document.body.classList.add('performance-mode');
                    console.warn(`⚡ FPS modéré (${fps}) - passage en mode performance moyenne`);
                }
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            requestAnimationFrame(checkFrameRate);
        };
        setTimeout(() => {
            if (this.performanceLevel === 'high') {
                requestAnimationFrame(checkFrameRate);
            }
        }, 3000);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.root.style.setProperty('--animation-play-state', 'paused');
            this.monitoringActive = false;
        } else if (this.performanceLevel !== 'none') {
            this.root.style.setProperty('--animation-play-state', 'running');
            if (this.performanceLevel === 'high') {
                this.startPerformanceMonitoring();
            }
        }
    }

    handleResize() {
        this.root.style.setProperty('--animation-play-state', 'paused');
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (this.performanceLevel !== 'none') {
                this.root.style.setProperty('--animation-play-state', 'running');
            }
        }, 300);
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    async setup() {
        await this.setPerformanceLevel();
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('beforeunload', () => {
            this.monitoringActive = false;
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            window.removeEventListener('resize', this.handleResize);
        });
        console.log('✅ Gestionnaire de performance initialisé');
    }

    setMode(mode) {
        if (['none', 'low', 'medium', 'high'].includes(mode)) {
            this.performanceLevel = mode;
            document.body.className = document.body.className.replace(/(?:no-animations|low-performance|performance-mode)/g, '');
            if (mode === 'none') document.body.classList.add('no-animations');
            else if (mode === 'low') document.body.classList.add('low-performance');
            else if (mode === 'medium') document.body.classList.add('performance-mode');
            this.updateCSSVariables(mode);
            console.log('🔧 Mode manuel activé:', mode);
        }
    }
}

// Initialisation du gestionnaire de performance
const performanceManager = new PerformanceManager();
window.performanceManager = performanceManager;

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
function openCV() {
    document.getElementById("cvModal").style.display = "block";
}

function closeCV() {
    document.getElementById("cvModal").style.display = "none";
}

function openMindset() {
    document.getElementById("mindsetModal").style.display = "block";
}

function closeMindset() {
    document.getElementById("mindsetModal").style.display = "none";
}

// Fermeture modale en cliquant à l'extérieur
window.onclick = function(event) {
    const cvModal = document.getElementById("cvModal");
    const mindsetModal = document.getElementById("mindsetModal");
    if (event.target === cvModal) closeCV();
    if (event.target === mindsetModal) closeMindset();
};

// Gestion des onglets Mind-Set
function showMindsetTab(tabName, event) {
    document.querySelectorAll('.mindset-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.mindset-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('mindset-tab-' + tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Force les transitions sur les boutons de l'en-tête
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.style.transition = 'var(--transition)';
        button.addEventListener('mouseenter', () => {
            button.style.setProperty('--transition', 'all 0.3s ease');
        });
    });
});

// Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
if (!window.location.search.includes('exclude=1')) {
  gtag('config', 'G-LV90JK69JB');
}

