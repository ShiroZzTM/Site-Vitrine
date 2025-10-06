// ===================================
// PORTFOLIO CYBERSÉCURITÉ - VERSION CORRIGÉE
// Animations GSAP avancées avec Three.js
// ===================================

// ===== CONFIGURATION =====
gsap.registerPlugin(ScrollTrigger);

// ===== THREE.JS BACKGROUND =====
function initThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Création des particules
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lignes connectées
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    const linesCount = 200;
    const linesPos = new Float32Array(linesCount * 6);

    for (let i = 0; i < linesCount * 6; i++) {
        linesPos[i] = (Math.random() - 0.5) * 15;
    }

    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPos, 3));
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Animation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0003;

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;
        particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;

        linesMesh.rotation.y -= 0.0003;
        linesMesh.rotation.x -= 0.0002;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursorOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';

        requestAnimationFrame(animateCursorOutline);
    }

    animateCursorOutline();

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-card, .tab-btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Mettre à jour la navigation active pendant le scroll
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    });

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                burger.classList.remove('active');
                navMenu.classList.remove('active');

                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollBar() {
    const scrollBar = document.querySelector('.scroll-bar-indicator');

    if (!scrollBar) return;

    // Animation au clic pour scroll vers la section suivante
    scrollBar.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: aboutSection, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    });

    // Masquer la barre lors du scroll avec animation smooth
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            gsap.to(scrollBar, {
                duration: 0.4,
                opacity: 0,
                y: 20,
                ease: 'power2.out'
            });
        } else {
            gsap.to(scrollBar, {
                duration: 0.4,
                opacity: 1,
                y: 0,
                ease: 'power2.out'
            });
        }
    });
}


// ===== TABS PARCOURS PROFESSIONNEL/ACADÉMIQUE =====
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const timelineContainers = document.querySelectorAll('.timeline-container');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            timelineContainers.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const targetContainer = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetContainer) {
                targetContainer.classList.add('active');

                // Réanimer les éléments
                gsap.from(targetContainer.querySelectorAll('.timeline-item'), {
                    duration: 0.8,
                    opacity: 0,
                    x: -50,
                    stagger: 0.2,
                    ease: 'power3.out'
                });
            }
        });
    });
}

// ===== HERO ANIMATIONS =====
function initHeroAnimations() {
    // Typing effect
    const typedTextSpan = document.querySelector('.typing-text');
    const cursorSpan = document.querySelector('.typing-cursor');
    const textArray = [
        'Cybersecurity Junior',
        'Développeur Passionné',
        'Network Enthusiast',
        'Soif d\'apprendre',
        'Pentester Junior',
        'Curieux de Nature'
    ];
    const typingDelay = 80;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    setTimeout(type, 1000);

    // Hero title animation
    gsap.from('.hero-title', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.3
    });

    gsap.from('.hero-badge', {
        duration: 1,
        opacity: 0,
        scale: 0.8,
        ease: 'back.out(1.7)'
    });

    gsap.from('.hero-subtitle', {
        duration: 1,
        opacity: 0,
        y: 30,
        delay: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.hero-buttons .btn-primary', {
        duration: 1,
        opacity: 0,
        x: -50,
        delay: 1,
        ease: 'power3.out'
    });

    gsap.from('.hero-buttons .btn-secondary', {
        duration: 1,
        opacity: 0,
        x: 50,
        delay: 1,
        ease: 'power3.out'
    });

    gsap.from('.social-links .social-icon', {
        duration: 1,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        delay: 1.3,
        ease: 'power3.out'
    });

    gsap.from('.scroll-indicator', {
        duration: 1,
        opacity: 0,
        delay: 1.8,
        ease: 'power3.out'
    });
}

// ===== SECTION ANIMATIONS =====
function initSectionAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.querySelector('.section-label'), {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%'
            },
            duration: 1,
            opacity: 0,
            y: 30,
            ease: 'power3.out'
        });

        gsap.from(header.querySelector('.section-title'), {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%'
            },
            duration: 1,
            opacity: 0,
            y: 50,
            ease: 'power3.out',
            delay: 0.2
        });
    });

    // About section
    gsap.from('.about-content .lead-text', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%'
        },
        duration: 1,
        opacity: 0,
        y: 50,
        ease: 'power3.out'
    });

    gsap.from('.about-content .body-text', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%'
        },
        duration: 1,
        opacity: 0,
        y: 30,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.info-card', {
        scrollTrigger: {
            trigger: '.info-grid',
            start: 'top 80%'
        },
        duration: 1,
        opacity: 0,
        y: 50,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.profile-card', {
        scrollTrigger: {
            trigger: '.profile-card',
            start: 'top 80%'
        },
        duration: 1.5,
        opacity: 0,
        scale: 0.8,
        rotationY: -20,
        ease: 'power4.out'
    });

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            duration: 1,
            opacity: 0,
            x: -100,
            ease: 'power3.out'
        });

        gsap.from(item.querySelector('.timeline-marker'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            duration: 1,
            scale: 0,
            rotation: 360,
            ease: 'back.out(1.7)'
        });
    });

    // Skills bars
    gsap.utils.toArray('.skill-progress').forEach(bar => {
        const progress = bar.getAttribute('data-progress');

        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%'
            },
            duration: 1.5,
            width: progress + '%',
            ease: 'power3.out'
        });
    });

    // Language dots
    gsap.utils.toArray('.language-dots').forEach(dots => {
        gsap.from(dots.querySelectorAll('.dot'), {
            scrollTrigger: {
                trigger: dots,
                start: 'top 85%'
            },
            duration: 0.8,
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    });

    // Quality cards
    gsap.utils.toArray('.quality-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            duration: 1,
            opacity: 0,
            y: 50,
            rotation: -5,
            ease: 'power3.out',
            delay: index * 0.1
        });
    });

    // Hobby cards
    gsap.utils.toArray('.hobby-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            duration: 1,
            opacity: 0,
            rotationY: 90,
            ease: 'power3.out',
            delay: index * 0.1
        });
    });

    // Project cards
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            duration: 1,
            opacity: 0,
            y: 80,
            rotation: -3,
            ease: 'power3.out',
            delay: index * 0.15
        });

        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            ease: 'none'
        });
    });

    // Contact cards
    gsap.utils.toArray('.contact-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            duration: 1.2,
            opacity: 0,
            scale: 0.8,
            rotation: 10,
            ease: 'back.out(1.7)',
            delay: index * 0.15
        });
    });
}

// ===== MOUSE EFFECTS =====
function initMouseEffects() {
    const cards = document.querySelectorAll('.project-card, .quality-card, .contact-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
                duration: 0.3,
                rotationX: rotateX,
                rotationY: rotateY,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotationX: 0,
                rotationY: 0,
                ease: 'power2.out'
            });
        });
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizePerformance() {
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 200px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

// ===== PRELOADER =====
function initPreloader() {
    window.addEventListener('load', () => {
        gsap.to('body', {
            duration: 0.5,
            opacity: 1,
            ease: 'power2.inOut'
        });
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initCustomCursor();
    initNavigation();
    initTabs();
    initHeroAnimations();
    initSectionAnimations();
    initMouseEffects();
    optimizePerformance();
    initPreloader();

    console.log('%c✨ Portfolio Loaded Successfully! ✨', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
    console.log('%cDesigned with 💜 by ShiroZzTM', 'color: #ff00ff; font-size: 14px;');
});

// ===== EASTER EGG =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        console.log('%c🎮 KONAMI CODE ACTIVATED! 🎮', 'color: #ff00ff; font-size: 24px; font-weight: bold;');

        gsap.to('.hero-title', {
            duration: 2,
            rotation: 360,
            scale: 1.2,
            ease: 'elastic.out(1, 0.3)',
            onComplete: () => {
                gsap.to('.hero-title', {
                    duration: 1,
                    rotation: 0,
                    scale: 1
                });
            }
        });
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);