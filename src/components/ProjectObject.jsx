// src/components/ProjectObject.jsx
import React, { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/three';
import { Html } from '@react-three/drei';

const OBJECT_SIZE = 3; // Or your preferred size
const LIFT_AMOUNT = 0.75;
const Z_STAGGER_FACTOR = 0.2;

const htmlProjectNameStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -250%)',
    fontFamily: 'Lucida Sans Typewriter, sans-serif',
    fontSize: '18px',
    fontWeight: '600',
    color: '#555555',
    textTransform: 'lowercase',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
};

function ProjectObject({ projectData, position: worldXZPosition, gridZIndex, color }) {
    const [hovered, setHovered] = useState(false);
    const worldX = worldXZPosition[0];
    const worldZ = worldXZPosition[1];
    const baseElevation = OBJECT_SIZE / 2;
    const zStaggerElevation = gridZIndex * Z_STAGGER_FACTOR;
    const initialY = baseElevation + zStaggerElevation;

    const groupSpringProps = useSpring({
        groupScale: hovered ? 1.15 : 1,
        groupPositionY: hovered ? initialY + LIFT_AMOUNT : initialY,
        config: config.default,
    });
    const materialSpringProps = useSpring({
        emissiveIntensity: hovered ? 0.6 : 0,
        config: config.default,
    });

    if (!groupSpringProps || typeof groupSpringProps.groupPositionY === 'undefined' || !materialSpringProps) {
        return null;
    }

    return (
        <animated.group
            position-x={worldX} position-y={groupSpringProps.groupPositionY} position-z={worldZ}
            scale={groupSpringProps.groupScale}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
            onClick={(e) => { e.stopPropagation(); console.log('Clicked:', projectData.name); }}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={[OBJECT_SIZE, OBJECT_SIZE, OBJECT_SIZE]} />
                <animated.meshStandardMaterial color={color} emissive={color}
                    emissiveIntensity={materialSpringProps.emissiveIntensity}
                    roughness={0.5} metalness={0.1} />
            </mesh>
            {hovered && projectData?.name && (
                <Html position={[0, OBJECT_SIZE / 2 + 0.2, 0]}>
                    <div style={htmlProjectNameStyle}>{projectData.name}</div>
                </Html>
            )}
        </animated.group>
    );
}

export default React.memo(ProjectObject);