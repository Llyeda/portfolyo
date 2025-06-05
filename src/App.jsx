// src/App.jsx
import React, { useRef } from 'react';
import LandingSection from './components/LandingSection';
import CVSection from './components/CVSection';
import ProjectsSection from './components/Projects/ProjectsSection';
import EnhancedScrollGuide from './components/EnhancedScrollGuide';

export default function App() {
    const landingSectionRef = useRef(null);
    const cvSectionRef = useRef(null);
    const projectsSectionRef = useRef(null);

    return (
        <div className="app-container">
            <LandingSection
                ref={landingSectionRef}
                cvRef={cvSectionRef}
                projectsRef={projectsSectionRef}
            />

            <div style={{ height: '25vh', backgroundColor: '#F8F4E9' }}></div>

            <CVSection ref={cvSectionRef} />

            <div style={{ height: '25vh', backgroundColor: '#F8F4E9' }}></div>

            <ProjectsSection ref={projectsSectionRef} />

            <EnhancedScrollGuide
                sections={[
                    { ref: landingSectionRef, name: 'Intro' },
                    { ref: cvSectionRef, name: 'CV' },
                    { ref: projectsSectionRef, name: 'Projects' }
                ]}
            />
        </div>
    );
}