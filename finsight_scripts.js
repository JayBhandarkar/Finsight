// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Get Started button functionality
document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // Scroll to projects section
            document.querySelector('#projects').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Add highlight effect to project cards
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('highlight-card');
                    setTimeout(() => {
                        card.classList.remove('highlight-card');
                    }, 1500);
                }, index * 300);
            });
        });
    }
});

// Enhanced card hover effect with glow
document.querySelectorAll('.feature-card, .project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'all 0.3s ease';
        
        // Enhance glow effect
        const isProjectCard = this.closest('.project-grid') !== null;
        const glowColor = isProjectCard ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.15)';
        this.style.boxShadow = `0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${glowColor}`;
        this.style.borderColor = isProjectCard ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    });
});

// Button hover effects with glow
document.querySelectorAll('.cta-button, .signup-btn, .login-btn, .project-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        // Determine type of button for appropriate glow
        const isPrimaryBtn = this.classList.contains('cta-button') || 
                            this.classList.contains('signup-btn') || 
                            this.classList.contains('login-btn');
        
        const glowColor = isPrimaryBtn ? 'rgba(37, 99, 235, 0.3)' : 'rgba(59, 130, 246, 0.3)';
        const shadowSize = isPrimaryBtn ? '25px' : '20px';
        
        this.style.boxShadow = `0 0 ${shadowSize} ${glowColor}`;
        if (this.classList.contains('login-btn')) {
            this.style.borderColor = 'rgba(37, 99, 235, 0.5)';
        }
    });
    
    button.addEventListener('mouseleave', function() {
        const isPrimaryBtn = this.classList.contains('cta-button') || 
                            this.classList.contains('signup-btn') || 
                            this.classList.contains('login-btn');
        
        const glowColor = isPrimaryBtn ? 'rgba(37, 99, 235, 0.15)' : 'rgba(59, 130, 246, 0.2)';
        const shadowSize = isPrimaryBtn ? '15px' : '10px';
        
        this.style.boxShadow = `0 0 ${shadowSize} ${glowColor}`;
        if (this.classList.contains('login-btn')) {
            this.style.borderColor = 'rgba(37, 99, 235, 0.3)';
        }
    });
});

// Navbar scroll effect
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add enhanced shadow on scroll
    if (currentScroll > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        header.style.backdropFilter = 'blur(12px)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Add additional glow to titles when they appear
            if (entry.target.classList.contains('section-title')) {
                entry.target.style.textShadow = '0 0 15px rgba(37, 99, 235, 0.15)';
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .project-card, .section-title').forEach(item => {
    observer.observe(item);
});

// Interactive text highlighting on scroll
function addTextHighlightOnScroll() {
    const paragraphs = document.querySelectorAll('.feature-card p, .project-card p, .about p');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.textShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
                    entry.target.style.color = 'var(--text-color)';
                }, 300);
                
                setTimeout(() => {
                    entry.target.style.textShadow = '';
                    entry.target.style.color = '';
                }, 2000);
            }
        });
    }, { threshold: 0.7 });
    
    paragraphs.forEach(paragraph => {
        textObserver.observe(paragraph);
    });
}

// Sentence-by-sentence text reveal animation for the about section
function textRevealAnimation() {
    const aboutParagraph = document.querySelector('.about p');
    if (!aboutParagraph) return;
    
    const text = aboutParagraph.textContent;
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    
    aboutParagraph.innerHTML = '';
    
    sentences.forEach((sentence, index) => {
        const sentenceSpan = document.createElement('span');
        sentenceSpan.className = 'reveal-sentence';
        sentenceSpan.textContent = sentence;
        sentenceSpan.style.opacity = '0';
        sentenceSpan.style.display = 'inline';
        aboutParagraph.appendChild(sentenceSpan);
    });
    
    const sentenceSpans = document.querySelectorAll('.reveal-sentence');
    
    const revealObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            sentenceSpans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.textShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
                }, index * 800);
            });
            revealObserver.unobserve(aboutParagraph);
        }
    }, { threshold: 0.5 });
    
    revealObserver.observe(aboutParagraph);
}

// Interactive typing effect for project titles
function addTypingEffect() {
    const projectTitles = document.querySelectorAll('.project-card h3');
    
    projectTitles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            const text = this.textContent;
            this.textContent = '';
            this.style.borderRight = '2px solid var(--accent-color)';
            
            let i = 0;
            const typing = setInterval(() => {
                if (i >= text.length) {
                    clearInterval(typing);
                    setTimeout(() => {
                        this.style.borderRight = 'none';
                    }, 500);
                    return;
                }
                
                this.textContent += text.charAt(i);
                i++;
            }, 50);
        });
        
        title.addEventListener('mouseleave', function() {
            // Only reset if we're not in the middle of typing
            if (!this.style.borderRight || this.style.borderRight === 'none') {
                const originalText = this.getAttribute('data-original');
                if (originalText) {
                    this.textContent = originalText;
                }
            }
        });
        
        // Store original text
        title.setAttribute('data-original', title.textContent);
    });
}

// Add magnetic effect to headings
function addMagneticEffect() {
    const headings = document.querySelectorAll('h2, h3');
    
    headings.forEach(heading => {
        heading.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            this.style.textShadow = `
                ${deltaX * 5}px ${deltaY * 5}px 15px var(--primary-glow),
                ${deltaX * -2}px ${deltaY * -2}px 5px var(--primary-glow)
            `;
        });
        
        heading.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
        });
    });
}

// Word-by-word highlight effect for feature descriptions
function addWordHighlightEffect() {
    const featureDescriptions = document.querySelectorAll('.feature-card p');
    
    featureDescriptions.forEach(description => {
        const text = description.textContent;
        const words = text.split(' ');
        
        description.innerHTML = '';
        
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'highlight-word';
            wordSpan.textContent = word + ' ';
            description.appendChild(wordSpan);
        });
        
        const wordSpans = description.querySelectorAll('.highlight-word');
        
        wordSpans.forEach(span => {
            span.addEventListener('mouseenter', function() {
                this.style.color = 'var(--primary-color)';
                this.style.textShadow = '0 0 10px var(--primary-glow)';
            });
            
            span.addEventListener('mouseleave', function() {
                this.style.color = '';
                this.style.textShadow = '';
            });
        });
    });
}

// Create subtle floating glow backgrounds
function createGlowElements() {
    const sections = document.querySelectorAll('.features, .projects, .about, .contact');
    
    sections.forEach(section => {
        // Create a subtle floating glow element
        const glow = document.createElement('div');
        glow.className = 'glow-element';
        
        // Set different colors based on the section
        let color = 'rgba(37, 99, 235, 0.03)';
        if (section.classList.contains('projects') || section.classList.contains('contact')) {
            color = 'rgba(59, 130, 246, 0.03)';
        }
        
        // Randomize position
        const xPos = Math.random() * 80 + 10; // Between 10% and 90%
        const yPos = Math.random() * 80 + 10;
        
        glow.style.cssText = `
            position: absolute;
            width: 300px;
            height: 300px;
            background: ${color};
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            left: ${xPos}%;
            top: ${yPos}%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 0;
            animation: floatGlow 20s ease-in-out infinite;
        `;
        
        section.appendChild(glow);
    });
}

// Mobile menu toggle
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.className = 'mobile-menu-btn';
mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('nav').appendChild(mobileMenuBtn);

mobileMenuBtn.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Add style elements
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-color);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
        
        .nav-links {
            display: none;
        }
        
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
            padding: 1rem;
            z-index: 100;
            border-bottom: 1px solid var(--border-color);
        }
    }
    
    @keyframes floatGlow {
        0% {
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    .feature-card, .project-card {
        overflow: hidden;
    }
    
    .feature-card::after, .project-card::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
    }
    
    .feature-card:hover::after, .project-card:hover::after {
        opacity: 0.3;
    }
    
    .reveal-sentence {
        transition: opacity 0.8s ease, text-shadow 0.8s ease;
    }
    
    .highlight-word {
        transition: color 0.3s ease, text-shadow 0.3s ease;
        display: inline-block;
    }
    
    h2, h3 {
        transition: text-shadow 0.3s ease;
    }
`;

document.head.appendChild(style); 

// Add glowing effect to important phrases
function enhanceKeyPhrases() {
    const allTextElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, span');
    const keyPhrases = [
        'Revolutionizing Financial Management',
        'Financial Management',
        'Revolutionizing',
        'Financial',
        'Management',
        'Fintech',
        'Investment',
        'Portfolio',
        'Analytics'
    ];
    
    allTextElements.forEach(element => {
        let content = element.innerHTML;
        
        // For each key phrase, check if it exists in the content
        keyPhrases.forEach(phrase => {
            if (content.includes(phrase)) {
                // Replace the phrase with a wrapped version that has special styling
                const wrappedPhrase = `<span class="key-phrase">${phrase}</span>`;
                content = content.replace(new RegExp(phrase, 'g'), wrappedPhrase);
            }
        });
        
        element.innerHTML = content;
    });
    
    // Add CSS for the glowing key phrases
    const style = document.createElement('style');
    style.textContent = `
        .key-phrase {
            color: #ffffff;
            text-shadow: 0 0 15px rgba(37, 99, 235, 0.3), 0 0 5px rgba(255, 255, 255, 0.3);
            font-weight: 500;
            position: relative;
            animation: phraseGlow 3s infinite alternate;
            display: inline-block;
        }
        
        @keyframes phraseGlow {
            0% {
                text-shadow: 0 0 15px rgba(37, 99, 235, 0.3), 0 0 5px rgba(255, 255, 255, 0.3);
            }
            50% {
                text-shadow: 0 0 25px rgba(37, 99, 235, 0.5), 0 0 15px rgba(255, 255, 255, 0.5);
            }
            100% {
                text-shadow: 0 0 15px rgba(37, 99, 235, 0.3), 0 0 5px rgba(255, 255, 255, 0.3);
            }
        }
        
        /* Add a subtle floating background glow that follows key phrases on hover */
        .key-phrase:hover::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0) 70%);
            pointer-events: none;
            border-radius: 20px;
            filter: blur(8px);
            z-index: -1;
            animation: pulseBackground 2s infinite alternate;
        }
        
        @keyframes pulseBackground {
            0% {
                opacity: 0.5;
                transform: scale(1);
            }
            100% {
                opacity: 0.8;
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Add dynamic backlit glow effect to text backgrounds
function addBacklitTextEffect() {
    // Target all paragraphs in the hero, about, and feature sections
    const targetParagraphs = document.querySelectorAll('.hero-content p, .about p, .feature-card p');
    
    targetParagraphs.forEach(paragraph => {
        // Add a relative position to the paragraph for the pseudo-element positioning
        paragraph.style.position = 'relative';
        paragraph.style.zIndex = '1';
        
        // Create a backlight div element
        const backlight = document.createElement('div');
        backlight.className = 'text-backlight';
        
        // Set the backlight's position and styling
        backlight.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 70%);
            filter: blur(15px);
            opacity: 0.5;
            z-index: -1;
            transform: scale(1.2);
            pointer-events: none;
            animation: backlightPulse 4s infinite alternate;
        `;
        
        // Insert the backlight before the paragraph's content
        paragraph.parentNode.insertBefore(backlight, paragraph);
        
        // Add animation for the backlight
        const style = document.createElement('style');
        style.textContent = `
            @keyframes backlightPulse {
                0% {
                    opacity: 0.3;
                    transform: scale(1.1);
                }
                100% {
                    opacity: 0.6;
                    transform: scale(1.3);
                }
            }
        `;
        document.head.appendChild(style);
    });
}

// Enhanced About section animations
function enhanceAboutSection() {
    const aboutSection = document.querySelector('.about');
    const highlightTexts = document.querySelectorAll('.highlight-text');
    const statBoxes = document.querySelectorAll('.stat-box');
    const aboutFeatureList = document.querySelectorAll('.about-feature-list li');
    
    // Add interactive glow to highlight texts
    highlightTexts.forEach(text => {
        text.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 30px var(--primary-glow), 0 0 15px rgba(255, 255, 255, 0.5)';
            this.style.color = '#ffffff';
            
            // Create a floating glow element
            const glow = document.createElement('div');
            glow.className = 'floating-glow';
            glow.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0) 70%);
                filter: blur(10px);
                z-index: -1;
                opacity: 0;
                transition: opacity 0.5s ease;
            `;
            
            this.style.position = 'relative';
            this.appendChild(glow);
            
            setTimeout(() => {
                glow.style.opacity = '1';
            }, 10);
        });
        
        text.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
            this.style.color = '';
            
            const glow = this.querySelector('.floating-glow');
            if (glow) {
                glow.style.opacity = '0';
                setTimeout(() => {
                    glow.remove();
                }, 500);
            }
        });
    });
    
    // Add ripple effect to stat boxes
    statBoxes.forEach(box => {
        box.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%);
                top: ${y}px;
                left: ${x}px;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                border-radius: 50%;
                animation: rippleEffect 1s linear forwards;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
    
    // Add CSS for the ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            0% {
                width: 0;
                height: 0;
                opacity: 0.5;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
        
        .about-feature-list li {
            position: relative;
            overflow: hidden;
        }
        
        .about-feature-list li::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: var(--primary-color);
            transition: width 0.3s ease;
            box-shadow: 0 0 10px var(--primary-glow);
        }
        
        .about-feature-list li:hover::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Add glow pulse to about section on scroll
    const aboutObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Add pulsing background glow
            const backgroundGlow = document.createElement('div');
            backgroundGlow.className = 'about-background-glow';
            backgroundGlow.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                height: 80%;
                background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 70%);
                filter: blur(50px);
                opacity: 0;
                z-index: 0;
                animation: aboutBackgroundGlow 8s infinite alternate;
            `;
            
            aboutSection.appendChild(backgroundGlow);
            
            // Add the animation
            const glowAnimation = document.createElement('style');
            glowAnimation.textContent = `
                @keyframes aboutBackgroundGlow {
                    0% {
                        opacity: 0.3;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    50% {
                        opacity: 0.5;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        opacity: 0.3;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(glowAnimation);
            
            setTimeout(() => {
                backgroundGlow.style.opacity = '0.3';
            }, 300);
            
            aboutObserver.unobserve(aboutSection);
        }
    }, { threshold: 0.2 });
    
    aboutObserver.observe(aboutSection);
}

// Check login status and update UI accordingly
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('finsight_logged_in') === 'true';
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');

    if (isLoggedIn) {
        // User is logged in, show the profile view
        loggedOutView.style.display = 'none';
        loggedInView.style.display = 'flex';
        
        // Display the username
        const username = localStorage.getItem('finsight_username') || 'User';
        usernameDisplay.textContent = `Welcome, ${username}!`;
        
        // Handle logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                // Clear login status but keep remember me settings if enabled
                localStorage.removeItem('finsight_logged_in');
                localStorage.removeItem('finsight_username');
                
                // Redirect to home page
                window.location.href = 'finsight_home.html';
            });
        }
    } else {
        // User is not logged in, show login/signup buttons
        if (loggedOutView) loggedOutView.style.display = 'flex';
        if (loggedInView) loggedInView.style.display = 'none';
    }
});

// Initialize all effects on page load
document.addEventListener('DOMContentLoaded', function() {
    createGlowElements();
    addTextHighlightOnScroll();
    textRevealAnimation();
    addTypingEffect();
    addMagneticEffect();
    addWordHighlightEffect();
    enhanceKeyPhrases();
    addBacklitTextEffect();
    enhanceAboutSection();
}); 