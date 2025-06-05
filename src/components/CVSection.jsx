// src/components/CVSection.jsx
import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CVSection.css';
import CVThumbsIndicator from './CVThumbsIndicator';

gsap.registerPlugin(ScrollTrigger);

const profilePicUrl = 'images/profile-pic.jpg';

const DotRating = ({ label, level, max = 5 }) => {
    return (
        <div className="dot-rating-item">
            <span>{label}</span>
            <span className="dots">
                {[...Array(max)].map((_, i) => (
                    <span key={i} className={`dot ${i < level ? 'filled' : ''}`}></span>
                ))}
            </span>
        </div>
    );
};

const CVSection = React.forwardRef((props, ref) => {
    const horizontalSectionRef = useRef(null);
    const scrollerRef = useRef(null);

    const slide1Ref = useRef(null);
    const slide2Ref = useRef(null);
    const slideRefs = [slide1Ref, slide2Ref]; // Now only two slides
    const numSlides = slideRefs.length; // This will be 2

    // Refs for content
    const aboutMeContentRef = useRef(null);
    // contactContentRef is part of Slide 1's Hero layout (implicitly)
    const educationContentRef = useRef(null);
    const experiencesContentRef = useRef(null);
    const toolsContentRef = useRef(null);
    const skillsContentRef = useRef(null);
    const hobbiesContentRef = useRef(null);
    const languagesContentRef = useRef(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isCVSectionVisible, setIsCVSectionVisible] = useState(false);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        const slidesDOMElements = slideRefs.map(r => r.current).filter(Boolean);
        const currentHorizontalSectionDOM = horizontalSectionRef.current;

        if (!scroller || slidesDOMElements.length !== numSlides || !currentHorizontalSectionDOM) {
            console.warn("CVSection: Missing crucial DOM elements or slide count mismatch for GSAP.");
            return;
        }

        const finalXPercent = -(numSlides - 1) * 100; // Will be -100 for 2 slides

        // --- Define SCROLL DISTANCES (USER SCROLL) ---
        const scrollDistancePerPauseOnSlide = window.innerHeight * 0.3; // Pause on Slide 1
        const scrollDistanceForS1ToS2Transition = window.innerHeight * 0.7; // Transition S1 -> S2
        const scrollDistanceForLingerOnLastSlide = window.innerHeight * 0.4; // Linger on Slide 2

        let calculatedTotalPinDurationPx = 0;
        // Pause on Slide 1
        calculatedTotalPinDurationPx += scrollDistancePerPauseOnSlide;
        // Transition S1 -> S2
        calculatedTotalPinDurationPx += scrollDistanceForS1ToS2Transition;
        // Linger on Slide 2 (which also acts as its "pause")
        calculatedTotalPinDurationPx += scrollDistanceForLingerOnLastSlide;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: currentHorizontalSectionDOM,
                pin: true,
                scrub: 1,
                start: "top top",
                end: `+=${calculatedTotalPinDurationPx}`,
                // markers: true, // Uncomment for debugging
                invalidateOnRefresh: true,
                onEnter: () => setIsCVSectionVisible(true),
                onLeave: () => setIsCVSectionVisible(false),
                onEnterBack: () => setIsCVSectionVisible(true),
                onLeaveBack: () => setIsCVSectionVisible(false),
                onUpdate: self => {
                    const currentXPercent = gsap.getProperty(scroller, "xPercent");
                    let activeSlide = 0;
                    // For 2 slides, xPercent goes 0 (Slide 1) -> -100 (Slide 2)
                    if (currentXPercent <= -50) { // More than halfway to slide 2
                        activeSlide = 1;
                    } else {
                        activeSlide = 0;
                    }
                    setCurrentSlide(activeSlide);
                }
            }
        });

        // Build the timeline for 2 slides: Pause S1 -> Scroll S1->S2 -> Linger/Pause S2
        // 1. Initial pause on Slide 1
        tl.to(scroller, { xPercent: 0, duration: scrollDistancePerPauseOnSlide });

        // 2. Scroll from Slide 1 to Slide 2
        tl.to(scroller, {
            xPercent: -100, // Target for Slide 2 to be centered
            ease: "none",
            duration: scrollDistanceForS1ToS2Transition
        });

        // 3. Linger/Pause on Slide 2 (last slide)
        tl.to(scroller, { xPercent: -100, duration: scrollDistanceForLingerOnLastSlide });

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === currentHorizontalSectionDOM) st.kill();
            });
            tl.kill();
        };
    }, [numSlides]); // numSlides is effectively constant here (2)

    return (
        <>
            <section
                className="cv-section-horizontal"
                ref={horizontalSectionRef}
                id="vita"
            >
                <div className="cv-horizontal-scroller" ref={scrollerRef}>
                    {/* Slide 1: Hero Layout + Tools, Skills, Hobbies, Languages */}
                   <div className="cv-slide cv-slide-1" ref={slide1Ref}> {/* or slideRefs[0] */}
                        <div className="slide1-two-column-wrapper">
                            {/* Left Column */}
                            <div className="slide1-left-column">
                                <div className="slide1-name-title-block"> {/* Renamed from -above-image */}
                                    <h2 className="slide1-name">mustafa çakır</h2>
                                    <p className="slide1-title-text">architect</p>
                                </div>
                                <div className="slide1-profile-pic-block"> {/* Renamed from -centered-container */}
                                    <div className="slide1-profile-pic-wrapper">
                                        <img src={profilePicUrl} alt="Mustafa Çakır" className="slide1-profile-pic" />
                                    </div>
                                </div>
                                <div className="slide1-about-me-block" ref={aboutMeContentRef}> {/* Renamed from -below-image */}
                                    <p>
                                        architecture graduate from Istanbul Technical University. i enjoy exchanging ideas and creating healthy negotiation environments with people. i have always been passionate about designing and crafting functional objects, particularly within the scope of industrial design. i find software development and technological deviced pretty interesting. delighted by being close to nature and experience its beauties by taking care of plants.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="slide1-right-column">
                                <div className="cv-block" ref={toolsContentRef}>
                                    <h3>tools</h3>
                                    <DotRating label="adobe illustrator" level={4} /><DotRating label="photoshop" level={4} /><DotRating label="indesign" level={3} /><DotRating label="rhinoceros" level={4} /><DotRating label="blender" level={3} /><DotRating label="autocad" level={4} /><DotRating label="sketchup" level={3} /><DotRating label="revit" level={3} /><DotRating label="microsoft office" level={4} />
                                </div>
                                <div className="cv-block skills-block" ref={skillsContentRef}>
                                    <h3>skills</h3>
                                    <span>architectural design</span><span>graphic design</span><span>3d modelling</span><span>photography</span>
                                </div>
                                <div className="cv-block hobbies-block" ref={hobbiesContentRef}>
                                    <h3>hobbies</h3>
                                    <span>team sports and outdoor activities</span><span>crafting</span><span>botanics</span>
                                </div>
                                <div className="cv-block" ref={languagesContentRef}>
                                    <h3>languages</h3>
                                    <div className="language-item"><span>turkish</span> <span className="language-level native">native</span></div>
                                    <DotRating label="english" level={4} /><DotRating label="german" level={2} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Slide 2: Education + Experiences */}
                    <div className="cv-slide cv-slide-2" ref={slide2Ref}>
                        <div className="cv-slide-content-wrapper slide2-columns-wrapper"> {/* Using two-column layout */}
                            <div className="slide2-column slide2-education-column">
                                <div className="cv-block" ref={educationContentRef}>
                                    <h3>education</h3>
                                    <div className="cv-item"><h4>Istanbul Technical University</h4><p>B.Sc. Architecture</p><p>Türkiye</p><p className="cv-item-dates">2019 - 2025 <span className="cv-item-gpa">2.76/4.00</span></p></div>
                                    <div className="cv-item"><h4>Balıkesir Science High-school</h4><p>Highschool Education</p><p>Türkiye</p><p className="cv-item-dates">2015 - 2019</p></div>
                                </div>
                            </div>
                            <div className="slide2-column slide2-experiences-column">
                                <div className="cv-block" ref={experiencesContentRef}>
                                    <h3>experiences</h3>
                                    <div className="cv-item"><h4>Arkitera</h4><p>participated in news writing and translation in the editorial office</p><p>Istanbul</p><p className="cv-item-dates">April 2025 (as intern)</p></div>
                                    <div className="cv-item"><h4>BSM Teknik Proje</h4><p>participated and directed the construction works of various health centers on site</p><p>Istanbul</p><p className="cv-item-dates">July 2024 (as intern) August 2024 - January 2025 (as architect)</p></div>
                                    <div className="cv-item"><h4>Consera</h4><p>was part of the architectural design office as a long term intern</p><p>Istanbul</p><p className="cv-item-dates">June - August 2023 (as long term architect intern)</p></div>
                                    <div className="cv-item"><h4>Artölye</h4><p>as a team of three, fabricated and printed 3d models of artworks with silicone molding</p><p>Balıkesir</p><p className="cv-item-dates">Dec 2019 - May 2021</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* No original Slide 3 div */}
                </div>
            </section>
            <CVThumbsIndicator
                totalSlides={numSlides} // Will be 2
                currentSlide={currentSlide}
                isVisible={isCVSectionVisible}
            />
        </>
    );
});

export default CVSection;