export const projectsData = [
    { 
        id: 'proj1', 
        name: 'modern villa', 
        gridPosition: [0, 0], 
        color: '#ff6347',
        description: 'A contemporary villa design featuring sustainable materials and modern architecture.',
        technologies: ['Architecture', '3D Modeling', 'Sustainable Design'],
        imageUrl: '/images/projects/modern-villa.jpg'
    },
    { 
        id: 'proj2', 
        name: 'eco tower', 
        gridPosition: [2, 0], 
        color: '#4682b4',
        description: 'An eco-friendly skyscraper incorporating green technologies and vertical gardens.',
        technologies: ['Green Building', 'Urban Design', 'Sustainability'],
        imageUrl: '/images/projects/eco-tower.jpg'
    },
    { 
        id: 'proj3', 
        name: 'urban park', 
        gridPosition: [0, 2], 
        color: '#3cb371',
        description: 'A modern urban park design promoting community interaction and environmental awareness.',
        technologies: ['Landscape Design', 'Urban Planning', 'Public Space'],
        imageUrl: '/images/projects/urban-park.jpg'
    },
    { 
        id: 'proj4', 
        name: 'skyport hub', 
        gridPosition: [-2, 2], 
        color: '#ffa500',
        description: 'A futuristic transportation hub integrating multiple modes of transport.',
        technologies: ['Transportation', 'Urban Infrastructure', 'Future Design'],
        imageUrl: '/images/projects/skyport-hub.jpg'
    },
    { 
        id: 'proj5', 
        name: 'art museum', 
        gridPosition: [2, -2], 
        color: '#9370db',
        description: 'A contemporary art museum with innovative exhibition spaces.',
        technologies: ['Cultural Architecture', 'Exhibition Design', 'Public Space'],
        imageUrl: '/images/projects/art-museum.jpg'
    },
    { 
        id: 'proj6', 
        name: 'bridge design', 
        gridPosition: [-2, -1], 
        color: '#dda0dd',
        description: 'An architectural bridge design combining functionality with aesthetic appeal.',
        technologies: ['Structural Design', 'Architecture', 'Engineering'],
        imageUrl: '/images/projects/bridge-design.jpg'
    },
];

export const CELL_SIZE = 8;
export const INITIAL_CAMERA_POSITION = [35, 35, 35];
export const INITIAL_CAMERA_ZOOM = 20; 