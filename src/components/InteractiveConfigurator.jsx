import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RotateCcw, Palette, Settings, Zap } from 'lucide-react';

const InteractiveConfigurator = () => {
  const sectionRef = useRef();
  const carRef = useRef();
  const [selectedColor, setSelectedColor] = useState('#0066B1');
  const [rotation, setRotation] = useState(0);
  const [exploded, setExploded] = useState(false);

  const colors = [
    { name: 'BMW Blue', value: '#0066B1' },
    { name: 'Alpine White', value: '#F8F8FF' },
    { name: 'Jet Black', value: '#0A0A0A' },
    { name: 'Storm Bay', value: '#4A5D6A' },
    { name: 'Mineral Grey', value: '#6C7B7F' },
    { name: 'Sunset Orange', value: '#FF6B35' }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const car = carRef.current;

    // 360° rotation on scroll
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const newRotation = progress * 360;
        setRotation(newRotation);
        
        gsap.set(car, {
          rotationY: newRotation,
          scale: 0.8 + progress * 0.4
        });

        // Reflection and shadow updates
        gsap.set('.car-reflection', {
          opacity: 0.3 + progress * 0.2,
          scaleY: 0.5 + progress * 0.3
        });

        gsap.set('.car-shadow', {
          scale: 0.8 + progress * 0.4,
          opacity: 0.6 - progress * 0.2
        });
      }
    });

    // Exploded view animation
    if (exploded) {
      gsap.to('.car-part', {
        z: (index) => (index + 1) * 100,
        y: (index) => (index % 2 === 0 ? -50 : 50),
        x: (index) => (index % 3 - 1) * 80,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    } else {
      gsap.to('.car-part', {
        z: 0,
        y: 0,
        x: 0,
        duration: 1,
        stagger: 0.05,
        ease: "power3.out"
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [exploded]);

  const handleColorChange = (color) => {
    setSelectedColor(color.value);
    
    // Smooth color transition
    gsap.to('.car-body', {
      filter: `hue-rotate(${color.value === '#0066B1' ? '0deg' : '180deg'})`,
      duration: 0.8,
      ease: "power2.out"
    });

    // Ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'color-ripple';
    ripple.style.backgroundColor = color.value;
    section.appendChild(ripple);
    
    gsap.fromTo(ripple, {
      scale: 0,
      opacity: 1
    }, {
      scale: 5,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => ripple.remove()
    });
  };

  const handleRotateClick = () => {
    gsap.to(carRef.current, {
      rotationY: rotation + 90,
      duration: 1,
      ease: "power3.out"
    });
    setRotation(rotation + 90);
  };

  const toggleExploded = () => {
    setExploded(!exploded);
  };

  return (
    <section ref={sectionRef} className="configurator-3d" data-skew>
      <div className="container">
        <div className="configurator-header">
          <h2>BUILD YOUR BMW</h2>
          <p>Experience every detail in stunning 3D</p>
        </div>

        <div className="configurator-studio">
          {/* 3D Car Display */}
          <div className="car-stage">
            <div ref={carRef} className="car-3d" style={{ '--car-color': selectedColor }}>
              {/* Car parts for exploded view */}
              <div className="car-part car-body">
                <img 
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop" 
                  alt="BMW Body" 
                />
              </div>
              <div className="car-part car-wheels">
                <div className="wheel wheel-front-left"></div>
                <div className="wheel wheel-front-right"></div>
                <div className="wheel wheel-rear-left"></div>
                <div className="wheel wheel-rear-right"></div>
              </div>
              <div className="car-part car-interior">
                <div className="interior-detail"></div>
              </div>
              <div className="car-part car-engine">
                <div className="engine-block"></div>
              </div>
            </div>
            
            {/* Reflection */}
            <div className="car-reflection"></div>
            
            {/* Shadow */}
            <div className="car-shadow"></div>
            
            {/* Stage lighting */}
            <div className="stage-lights">
              <div className="light light-1"></div>
              <div className="light light-2"></div>
              <div className="light light-3"></div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="config-panel">
            {/* Color Selection */}
            <div className="config-section">
              <div className="section-header">
                <Palette size={24} />
                <h3>Exterior Color</h3>
              </div>
              <div className="color-grid">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${selectedColor === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorChange(color)}
                  >
                    <span className="color-name">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="config-section">
              <div className="section-header">
                <Settings size={24} />
                <h3>View Controls</h3>
              </div>
              <div className="control-buttons">
                <button className="control-btn magnetic-btn" onClick={handleRotateClick}>
                  <RotateCcw size={20} />
                  Rotate 90°
                </button>
                <button 
                  className={`control-btn magnetic-btn ${exploded ? 'active' : ''}`}
                  onClick={toggleExploded}
                >
                  <Zap size={20} />
                  {exploded ? 'Assemble' : 'Explode View'}
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="config-section">
              <div className="section-header">
                <Zap size={24} />
                <h3>Specifications</h3>
              </div>
              <div className="spec-list">
                <div className="spec-item">
                  <span className="spec-label">Engine</span>
                  <span className="spec-value">4.4L V8 Twin-Turbo</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Power</span>
                  <span className="spec-value">617 HP</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Torque</span>
                  <span className="spec-value">750 Nm</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">0-100 km/h</span>
                  <span className="spec-value">3.2 seconds</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="config-actions">
              <button className="primary-btn-3d magnetic-btn">
                Build & Price
              </button>
              <button className="secondary-btn-3d magnetic-btn">
                Request Quote
              </button>
            </div>
          </div>
        </div>

        {/* Floating particles around car */}
        <div className="config-particles">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="config-particle"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveConfigurator;