// src/components/LandingSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import './LandingSection.css';

// Define ScrollDownIcon for use in this component
const ScrollDownPromptIcon = () => ( // Renamed to avoid conflict if imported elsewhere
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="scroll-prompt-arrow-svg">
        <path d="M12 16.5L6 10.5L7.41 9.09L12 13.67L16.59 9.09L18 10.5L12 16.5Z" />
    </svg>
);

const LandingSection = React.forwardRef(({ canvasRef, cvRef }, ref) => {
    const [scrollY, setScrollY] = useState(0);
    const [showScrollPrompt, setShowScrollPrompt] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            if (currentScrollY > 100) { // Hide prompt after 100px of scroll
                setShowScrollPrompt(false);
            } else {
                setShowScrollPrompt(true);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Check initial scroll position
        if (window.scrollY > 100) {
            setShowScrollPrompt(false);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getElementStyle = (baseActivationOffset = 0, animationDistance = window.innerHeight * 0.3, intensity = 1) => {
        let opacity = 1;
        let translateY = 0;
        if (scrollY > baseActivationOffset) {
            const scrollPastActivation = scrollY - baseActivationOffset;
            const progress = Math.min(1, scrollPastActivation / animationDistance);
            opacity = 1 - (progress * intensity * 0.8); // Apply intensity multiplier here
            translateY = -progress * 50 * intensity;
        }
        opacity = Math.max(0, opacity);
        return {
            opacity,
            transform: `translateY(${translateY}px)`,
            transition: 'opacity 0.1s linear, transform 0.1s linear',
        };
    };

    const handleLinkClick = (e, targetRef) => {
        e.preventDefault();
        if (targetRef && targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn("Target ref not available for scrolling:", targetRef);
        }
    };

    const portfolioImageUrl = 'images/portfolio.png';

    return (
        <section className="landing-section" ref={ref}>
            <header className="landing-header" style={getElementStyle(0, window.innerHeight * 0.2, 1.1)}>
                <nav className="landing-nav">
                    <a href="#cv-target" onClick={(e) => handleLinkClick(e, cvRef)}>cv</a>
                    <a href="#projects-target" onClick={(e) => handleLinkClick(e, canvasRef)}>projects</a>
                    <a href="#contacts">CONTACTS</a>
                </nav>
            </header>

            <div className="main-focus-container">
                <div className="center-text-content">
                    <img
                        src={portfolioImageUrl}
                        alt="Portfolio highlight"
                        className="landing-center-image" // Styles for size are in CSS
                        style={getElementStyle(window.innerHeight * 0.05, window.innerHeight * 0.3, 1.25)}
                    />
                    <h1 className="main-name" style={getElementStyle(window.innerHeight * 0.1, window.innerHeight * 0.3, 1.2)}>
                        mustafa çakır {/* Size is in CSS */}
                    </h1>
                    <p className="subtitle" style={getElementStyle(window.innerHeight * 0.2, window.innerHeight * 0.3, 1)}>
                        architect
                    </p>
                    <a
                        href="#canvas-section-target"
                        className="projects-link"
                        style={getElementStyle(window.innerHeight * 0.3, window.innerHeight * 0.3, 1)}
                        onClick={(e) => handleLinkClick(e, canvasRef)}
                    >
                        PROJECTS
                    </a>
                </div>
            </div>

            {showScrollPrompt && (
                <div className="landing-scroll-prompt"
                    style={getElementStyle(window.innerHeight * 0.4, window.innerHeight * 0.3, 0.9)} // Parallax for prompt
                >
                    <ScrollDownPromptIcon />
                    <span>scroll</span>
                </div>
            )}
        </section>
    );
});

export default LandingSection;