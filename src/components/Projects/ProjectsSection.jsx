import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectsSection.css';
import { projectsData } from './projectsData';

gsap.registerPlugin(ScrollTrigger);

const extendedProjects = [...projectsData, ...projectsData];

const ProjectsSection = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const hasScrolledRef = useRef(false);
    const progressBarRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const grid = gridRef.current;
        if (!section || !grid) return;

        // Using gsap.context ensures proper cleanup in React 18+ strict mode
        let ctx = gsap.context(() => {
            const getScrollAmount = () => {
                const cards = grid.children;
                if (cards.length === 0) return 0;
                
                const lastOriginalCard = cards[projectsData.length - 1];
                const currentX = gsap.getProperty(grid, "x") || 0;
                
                // Safely calculate global position of the card if x was natively 0
                const cardLeftGlobal = lastOriginalCard.getBoundingClientRect().left - currentX;
                const unadjustedCardCenter = cardLeftGlobal + (lastOriginalCard.offsetWidth / 2);
                const targetCenter = window.innerWidth / 2;
                
                const amount = targetCenter - unadjustedCardCenter;
                return amount < 0 ? amount : 0;
            };

            const allCards = gsap.utils.toArray('.project-card', grid);
            const firstCard = allCards[0];

            const easeInOut = gsap.parseEase("sine.inOut");
            
            // Track the initial vertical scroll fade
            const state = { introProgress: 0 };
            
            const updateOpacities = () => {
                const W = window.innerWidth;
                const currentX = gsap.getProperty(grid, "x") || 0;
                const firstCardRect = firstCard.getBoundingClientRect();
                // Re-calculate native starting position cleanly on each frame
                const firstCardCenterNative = (firstCardRect.left - currentX) + (firstCardRect.width / 2);
                
                allCards.forEach((card, index) => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;
                    
                    let targetOpacity = 0.2;
                    
                    if (cardCenter < firstCardCenterNative) {
                        // Exiting to the left
                        let progress = Math.max(0, cardCenter / firstCardCenterNative);
                        targetOpacity = 0.2 + 0.8 * easeInOut(progress);
                    } else if (cardCenter <= W / 2) {
                        // Plateau of full visibility (between left start position and center of screen)
                        targetOpacity = 1.0;
                    } else {
                        // Entering from the right
                        let progress = Math.max(0, (W - cardCenter) / (W / 2));
                        targetOpacity = 0.2 + 0.8 * easeInOut(progress);
                    }

                    // Apply intro vertical scroll progress
                    let currentOpacity = targetOpacity;
                    if (index > 0) {
                        currentOpacity = 0.2 + (targetOpacity - 0.2) * easeInOut(state.introProgress);
                    }

                    gsap.set(card, { opacity: currentOpacity });
                });
            };

            // Set initial opacities accurately before scroll
            updateOpacities();

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    pin: true,
                    scrub: 1.5, // Increased scrub smoothing
                    start: "top top",
                    end: () => `+=${Math.abs(getScrollAmount()) + window.innerHeight * 2}`, // Expanded scroll distance
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        updateOpacities();
                        if (self.progress > 0.01 && !hasScrolledRef.current) {
                            hasScrolledRef.current = true;
                            setHasScrolled(true);
                        }
                        if (progressBarRef.current) {
                            gsap.set(progressBarRef.current, { scaleX: self.progress });
                        }
                    }
                }
            });

            // 1. Intro fade phase before horizontal scroll begins
            tl.to(state, {
                introProgress: 1,
                duration: 2,
                ease: "none" // Linear tracking mapping prevents "dead zones" in mouse scrubbing
            });

            // 2. Horizontal scrolling phase
            tl.to(grid, {
                x: getScrollAmount,
                ease: "power1.inOut", // Gentle horizontal start/stop
                duration: 6
            });

            // Little scroll threshold at the end before unpinning
            tl.to({}, { duration: 0.1 });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section className="projects-section" id="projects" ref={sectionRef}>
            <div className="projects-container">
                <header className="projects-header">
                    <h2>
                        selected projects
                    </h2>
                    <div className="scroll-progress-bar">
                        <div className="scroll-progress-fill" ref={progressBarRef} />
                    </div>
                </header>
            </div>

            <div className="projects-grid" ref={gridRef}>
                {extendedProjects.map((project, index) => (
                        <article key={`${project.id}-${index}`} className="project-card">
                            <div className="project-image-wrapper">
                                <img 
                                    src={project.imageUrl} 
                                    alt={project.name} 
                                    className="project-image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="project-content">
                                <div className="project-title-row">
                                    <h3 className="project-title">project{index + 1}</h3>
                                    <span className="project-year">{project.year}</span>
                                </div>
                                <div className="project-meta">
                                    <span className="project-type">{project.type}</span>
                                </div>
                                <p className="project-description">{project.description}</p>
                                <ul className="project-tech-list">
                                    {project.technologies.map((tech, index) => (
                                        <li key={index} className="project-tech-item">
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>
            <span className={`scroll-hint ${hasScrolled ? 'hidden' : ''}`}>
                <span className="desktop-hint">scroll &rarr;</span>
                <span className="mobile-hint">swipe &rarr;</span>
            </span>
        </section>
    );
};

export default ProjectsSection;
