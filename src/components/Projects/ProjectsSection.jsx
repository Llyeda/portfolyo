import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import Scene from './Scene';
import { INITIAL_CAMERA_POSITION, INITIAL_CAMERA_ZOOM } from './projectsData';
import './ProjectsSection.css';

const ProjectsSection = () => {
    const canvasContainerRef = useRef(null);
    const cameraRef = useRef();
    const [scrollY, setScrollY] = useState(0);
    const [canvasSectionTop, setCanvasSectionTop] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        const updateCanvasSectionTop = () => {
            if (canvasContainerRef.current) {
                setCanvasSectionTop(canvasContainerRef.current.offsetTop);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateCanvasSectionTop();
        window.addEventListener('resize', updateCanvasSectionTop);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateCanvasSectionTop);
        };
    }, []);

    const getFadeInStyle = (baseActivationScrollY = 0, animationDistance = window.innerHeight * 0.6, initialTranslateY = 20, intensity = 1) => {
        let opacity = 0;
        let translateY = initialTranslateY;

        if (canvasSectionTop > 0 && scrollY > baseActivationScrollY - window.innerHeight * 0.6) {
            const scrollPastActivation = scrollY - (baseActivationScrollY - window.innerHeight * 0.9);
            const progress = Math.min(1, Math.max(0, scrollPastActivation / animationDistance));
            opacity = progress * intensity * 0.8;
            translateY = (1 - progress) * initialTranslateY;
        } else if (canvasSectionTop === 0) {
            opacity = 0;
            translateY = initialTranslateY;
        }
        opacity = Math.max(0, Math.min(1, opacity));
        return {
            opacity,
            transform: `translateY(${translateY}px)`,
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        };
    };

    return (
        <section
            ref={canvasContainerRef}
            className="projects-section"
            style={getFadeInStyle(canvasSectionTop, window.innerHeight * 0.5, 10)}
        >
            <Canvas shadows gl={{ alpha: true, antialias: true }}>
                <OrthographicCamera
                    ref={cameraRef}
                    makeDefault
                    position={INITIAL_CAMERA_POSITION}
                    zoom={INITIAL_CAMERA_ZOOM}
                    near={1}
                    far={1000}
                />
                <OrbitControls
                    makeDefault
                    enabled={false}
                    camera={cameraRef.current}
                />
                <Scene />
            </Canvas>
        </section>
    );
};

export default ProjectsSection; 