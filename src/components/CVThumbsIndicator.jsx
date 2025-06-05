// src/components/CVThumbsIndicator.jsx
import React from 'react';
import './CVThumbsIndicator.css'; // We'll create this CSS file next

const CVThumbsIndicator = ({ totalSlides, currentSlide, isVisible }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="cv-thumbs-indicator-container">
            {[...Array(totalSlides)].map((_, index) => (
                <div
                    key={index}
                    className={`cv-thumb ${index === currentSlide ? 'active' : ''}`}
                ></div>
            ))}
        </div>
    );
};

export default CVThumbsIndicator;