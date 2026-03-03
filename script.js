/**
 * TAMILSELVAN S – PREMIUM CLASSIC PORTFOLIO
 * script.js  –  Vanilla JS, no frameworks
 */

"use strict";

/* =====================================================
   1. THEME TOGGLE (Light / Dark)
   ===================================================== */
(function initTheme() {
    const html = document.documentElement;
    const btn = document.getElementById("theme-toggle");
    const stored = localStorage.getItem("ts-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initThemeVal = stored || (prefersDark ? "dark" : "light");
    html.setAttribute("data-theme", initThemeVal);

    btn.addEventListener("click", () => {
        const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", next);
        localStorage.setItem("ts-theme", next);
    });
})();


/* =====================================================
   2. NAVBAR – Scroll shadow + Active link highlight
   ===================================================== */
(function initNavbar() {
    const navbar = document.getElementById("navbar");
    const links = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("nav-scrolled", window.scrollY > 30);
    }, { passive: true });

    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                links.forEach((l) => l.classList.remove("active"));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add("active");
            }
        });
    }, { rootMargin: "-40% 0px -50% 0px" });

    sections.forEach((s) => observer.observe(s));
})();


/* =====================================================
   3. MOBILE HAMBURGER MENU
   ===================================================== */
(function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburger.addEventListener("click", () => {
        const isOpen = hamburger.classList.toggle("open");
        navMenu.classList.toggle("open", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("open");
            navMenu.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        });
    });
})();


/* =====================================================
   4. INTERACTIVE PROFILE RING (mouse-follow parallax)
   ===================================================== */
(function initProfileRing() {
    const ring = document.getElementById("profile-ring");
    const ring1 = document.getElementById("ring-1");
    const ring2 = document.getElementById("ring-2");
    const frame = document.getElementById("profile-frame");

    if (!ring || !ring1 || !ring2 || !frame) return;

    let rafId = null;
    let targetRx = 0, targetRy = 0;
    let currentRx = 0, currentRy = 0;

    // Mouse move on the hero section (large interactive zone)
    const heroSection = document.getElementById("hero");

    const handleMouseMove = (e) => {
        const rect = ring.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Scale strength by distance (closer = stronger effect)
        const strength = Math.min(1, 200 / Math.max(dist, 80));

        targetRx = (dy / (window.innerHeight / 2)) * 12 * strength;
        targetRy = (dx / (window.innerWidth / 2)) * 12 * strength;

        if (!rafId) animateRing();
    };

    const handleMouseLeave = () => {
        targetRx = 0;
        targetRy = 0;
    };

    const animateRing = () => {
        // Smooth lerp
        currentRx += (targetRx - currentRx) * 0.08;
        currentRy += (targetRy - currentRy) * 0.08;

        // 3D tilt on the photo frame
        frame.style.transform =
            `perspective(600px) rotateX(${-currentRx}deg) rotateY(${currentRy}deg)`;

        // Rings orbit slightly out-of-phase for parallax depth
        ring1.style.transform =
            `translate(-50%, -50%) translate(${currentRy * 1.8}px, ${currentRx * 1.8}px)`;
        ring2.style.transform =
            `translate(-50%, -50%) translate(${currentRy * -1.2}px, ${currentRx * -1.2}px)`;

        const shouldContinue =
            Math.abs(targetRx - currentRx) > 0.01 ||
            Math.abs(targetRy - currentRy) > 0.01;

        if (shouldContinue) {
            rafId = requestAnimationFrame(animateRing);
        } else {
            rafId = null;
        }
    };

    // Listen on whole hero for wide mouse area
    if (heroSection) {
        heroSection.addEventListener("mousemove", handleMouseMove, { passive: true });
        heroSection.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    // Touch support: gentle tilt on touch move
    if (heroSection) {
        heroSection.addEventListener("touchmove", (e) => {
            const t = e.touches[0];
            handleMouseMove({ clientX: t.clientX, clientY: t.clientY });
        }, { passive: true });
        heroSection.addEventListener("touchend", handleMouseLeave, { passive: true });
    }
})();


/* =====================================================
   5. SCROLL REVEAL – IntersectionObserver
   ===================================================== */
function initScrollReveal() {
    const elements = document.querySelectorAll(
        ".reveal-up, .reveal-left, .reveal-right"
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    elements.forEach((el) => observer.observe(el));
}


/* =====================================================
   6. SKILL BARS – Animate on scroll
   ===================================================== */
function initSkillBars() {
    const bars = document.querySelectorAll(".skill-bar-fill");
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute("data-width") || "0";
                setTimeout(() => { bar.style.width = width + "%"; }, 250);
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    bars.forEach((bar) => observer.observe(bar));
}


/* =====================================================
   7. TYPED.JS – Hero roles
   ===================================================== */
function initTyped() {
    if (!window.Typed || !document.getElementById("typed-target")) return;
    new Typed("#typed-target", {
        strings: [
            "Web Developer",
            "AI Engineer",
            "Cyber Warrior",
            "Problem Solver",
            "MERN Stack Dev"
        ],
        typeSpeed: 65,
        backSpeed: 40,
        backDelay: 1800,
        startDelay: 600,
        loop: true,
    });
}


/* =====================================================
   8. FOOTER QUOTE – Typed on scroll-into-view
   ===================================================== */
function initFooterQuote() {
    const el = document.getElementById("quote-typed");
    if (!el || !window.Typed) return;

    const observer = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
            new Typed("#quote-typed", {
                strings: [
                    '"Code is my weapon. Intelligence is my shield. The cyber world is my battlefield."'
                ],
                typeSpeed: 38,
                showCursor: true,
                cursorChar: "|",
                loop: false,
                onComplete: (self) => {
                    setTimeout(() => {
                        if (self.cursor) self.cursor.remove();
                    }, 2500);
                }
            });
            obs.disconnect();
        }
    }, { threshold: 0.4 });

    const target = el.closest("blockquote") || el;
    observer.observe(target);
}


/* =====================================================
   9. PROJECT CARDS – 3D Tilt on hover
   ===================================================== */
function initTilt() {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -9;
            const rotY = ((x - cx) / cx) * 9;
            card.style.transform =
                `translateY(-10px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            card.style.transition = "transform 0.1s ease";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.transition = "transform 0.6s cubic-bezier(.16,1,.3,1)";
        });
    });
}


/* =====================================================
   10. SMOOTH ANCHOR SCROLL (offset for sticky nav)
   ===================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (href === "#") return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const navH = document.getElementById("navbar")?.offsetHeight || 70;
            const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}


/* =====================================================
   11. CONTACT FORM – Validation & Simulate submit
   ===================================================== */
function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameEl = document.getElementById("cf-name");
    const emailEl = document.getElementById("cf-email");
    const subjectEl = document.getElementById("cf-subject");
    const msgEl = document.getElementById("cf-message");
    const submitBtn = document.getElementById("submit-btn");
    const successEl = document.getElementById("form-success");

    const errName = document.getElementById("err-name");
    const errEmail = document.getElementById("err-email");
    const errSubject = document.getElementById("err-subject");
    const errMsg = document.getElementById("err-message");

    const setError = (field, errEl, msg) => {
        field.classList.add("invalid");
        errEl.textContent = msg;
    };
    const clearError = (field, errEl) => {
        field.classList.remove("invalid");
        errEl.textContent = "";
    };

    [nameEl, emailEl, subjectEl, msgEl].forEach((el) => {
        el.addEventListener("input", () => {
            el.classList.remove("invalid");
            const errSpan = el.parentElement.querySelector(".form-error");
            if (errSpan) errSpan.textContent = "";
        });
    });

    const validate = () => {
        let valid = true;
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameEl.value.trim()) {
            setError(nameEl, errName, "Name is required."); valid = false;
        } else { clearError(nameEl, errName); }

        if (!emailEl.value.trim()) {
            setError(emailEl, errEmail, "Email is required."); valid = false;
        } else if (!emailRx.test(emailEl.value.trim())) {
            setError(emailEl, errEmail, "Please enter a valid email."); valid = false;
        } else { clearError(emailEl, errEmail); }

        if (!subjectEl.value.trim()) {
            setError(subjectEl, errSubject, "Subject is required."); valid = false;
        } else { clearError(subjectEl, errSubject); }

        if (!msgEl.value.trim() || msgEl.value.trim().length < 10) {
            setError(msgEl, errMsg, "Message must be at least 10 characters."); valid = false;
        } else { clearError(msgEl, errMsg); }

        return valid;
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validate()) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending…`;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Send Message <i class="fa-solid fa-paper-plane"></i>`;
            successEl.style.display = "flex";
            form.reset();
            setTimeout(() => { successEl.style.display = "none"; }, 5000);
        }, 1800);
    });
}


/* =====================================================
   11. BIT CLOUD – Floating cyber particles around photo
   ===================================================== */
function initBitCloud() {
    const cloud = document.getElementById("bit-cloud");
    if (!cloud) return;

    // Cyber-themed characters and strings
    const TOKENS = [
        "0", "1", "0", "1", "0", "1",          // binary heavy
        "0x3F", "0xA4", "0xFF", "0x1B",       // hex
        "SYN", "ACK", "RST", "ENC",           // network
        "AES", "PKT", "SSH", "TLS"            // cyber terms
    ];

    let active = true;

    // Pause particle generation when section is off-screen
    const obs = new IntersectionObserver(
        (entries) => { active = entries[0].isIntersecting; },
        { threshold: 0.1 }
    );
    obs.observe(cloud);

    const spawn = () => {
        if (!active) { setTimeout(spawn, 400); return; }

        const el = document.createElement("span");
        el.className = "bit-char";
        el.textContent = TOKENS[Math.floor(Math.random() * TOKENS.length)];

        // Random point on ring-1 circumference (~163px radius)
        const angle = Math.random() * Math.PI * 2;
        const r = 150 + Math.random() * 18;
        const sx = Math.cos(angle) * r;
        const sy = Math.sin(angle) * r;

        // Float outward from the ring
        const drift = 28 + Math.random() * 22;
        const fx = sx + Math.cos(angle) * drift;
        const fy = sy + Math.sin(angle) * drift;

        el.style.setProperty("--sx", sx + "px");
        el.style.setProperty("--sy", sy + "px");
        el.style.setProperty("--fx", fx + "px");
        el.style.setProperty("--fy", fy + "px");
        el.style.animationDuration = (1.4 + Math.random() * 1.2) + "s";
        // Tint colour: blue/green/cyan variants
        const tints = ["var(--accent)", "#10b981", "#38bdf8", "#8b5cf6"];
        el.style.color = tints[Math.floor(Math.random() * tints.length)];

        cloud.appendChild(el);
        setTimeout(() => el.remove(), 2700);

        // Randomised interval so it feels organic
        setTimeout(spawn, 220 + Math.random() * 250);
    };

    spawn();
}

/* =====================================================
   12. CURSOR SPOTLIGHT
   ===================================================== */
function initCursorSpotlight() {
    const el = document.getElementById("cursor-spotlight");
    if (!el) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let rafId = null;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        el.style.opacity = "1";
        if (!rafId) animate();
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
        el.style.opacity = "0";
    }, { passive: true });

    function animate() {
        curX += (mouseX - curX) * 0.1;
        curY += (mouseY - curY) * 0.1;
        el.style.left = curX + "px";
        el.style.top = curY + "px";
        const diff = Math.abs(mouseX - curX) + Math.abs(mouseY - curY);
        if (diff > 0.5) {
            rafId = requestAnimationFrame(animate);
        } else {
            rafId = null;
        }
    }
}


/* =====================================================
   13. FLOATING BACKGROUND PARTICLES
   ===================================================== */
function initFloatingParticles() {
    const bg = document.getElementById("particles-bg");
    if (!bg) return;

    const count = 22;
    for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.className = "fp";
        const size = 2 + Math.random() * 4;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${60 + Math.random() * 40}%;
            animation-duration: ${12 + Math.random() * 18}s;
            animation-delay: ${-Math.random() * 20}s;
            opacity: 0;
        `;
        bg.appendChild(p);
    }
}


/* =====================================================
   14. STATS COUNTER – Animate numbers on scroll-in
   ===================================================== */
function initStatsCounter() {
    const nums = document.querySelectorAll(".stat-num[data-target]");
    if (!nums.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"), 10);
            const duration = 1400;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            };
            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    nums.forEach((el) => observer.observe(el));
}


/* =====================================================
   INIT – Orchestrate everything on DOMContentLoaded
   ===================================================== */
function waitForTyped(cb, retries = 25) {
    if (window.Typed) { cb(); }
    else if (retries > 0) { setTimeout(() => waitForTyped(cb, retries - 1), 150); }
    else { cb(); }
}

document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initSkillBars();
    initContactForm();
    initTilt();
    initSmoothScroll();
    initBitCloud();
    initCursorSpotlight();
    initFloatingParticles();
    initStatsCounter();

    waitForTyped(() => {
        initTyped();
        initFooterQuote();
    });
});
