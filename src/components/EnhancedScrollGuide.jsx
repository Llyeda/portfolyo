// src/components/EnhancedScrollGuide.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './EnhancedScrollGuide.css';

// ScrollDownIcon is removed as it's now in LandingSection

function EnhancedScrollGuide({ sections = [] }) { // sections prop is no longer strictly needed if not displaying labels
    const [scrollProgress, setScrollProgress] = useState(0);
    // visibleSectionsData and related logic can be removed

    const scrollYRef = useRef(window.scrollY);
    const animationFrameRef = useRef(null);

    // calculateSectionVisibility and its dependencies are removed as labels are gone
    // isAtPageBottom is not needed for this simplified version

    useEffect(() => {
        const handleScroll = () => {
            scrollYRef.current = window.scrollY;
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = requestAnimationFrame(() => {
                const totalScrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const progress = totalScrollableHeight > 0 ? Math.min(100, (scrollYRef.current / totalScrollableHeight) * 100) : 0;
                setScrollProgress(progress);
                // setVisibleSectionsData call removed
                // setShowScrollDownClue logic removed
            });
        };
        // handleResize no longer needs to update visible sections
        // const handleResize = () => { ... };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // window.addEventListener('resize', handleResize, { passive: true }); // Can remove if handleResize only updated labels

        handleScroll(); // Initial calculation for scrollProgress
        return () => {
            window.removeEventListener('scroll', handleScroll);
            // window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []); // Dependencies array simplified

    return (
        <div className="enhanced-scroll-guide-wrapper">
            {/* Labels container removed */}
            <div className="scroll-guide-container">
                <div className="scroll-guide-track">
                    <div
                        className="scroll-guide-thumb"
                        style={{ height: `${scrollProgress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
export default EnhancedScrollGuide;