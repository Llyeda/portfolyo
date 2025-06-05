import React from 'react';
import { Grid } from '@react-three/drei';
import ProjectObject from '../ProjectObject';
import { projectsData, CELL_SIZE } from './projectsData';

function Scene() {
    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
            <Grid 
                args={[100, 100]} 
                cellSize={CELL_SIZE} 
                cellColor={'#6f6f6f'} 
                sectionSize={CELL_SIZE * 5} 
                sectionColor={'#9d4b4b'} 
                rotation-x={-Math.PI / 2} 
                infiniteGrid 
                fadeDistance={60} 
            />
            {projectsData.map((project) => (
                <ProjectObject
                    key={project.id}
                    projectData={project}
                    position={[project.gridPosition[0] * CELL_SIZE, project.gridPosition[1] * CELL_SIZE]}
                    gridZIndex={project.gridPosition[1]}
                    color={project.color}
                />
            ))}
        </>
    );
}

export default Scene; 