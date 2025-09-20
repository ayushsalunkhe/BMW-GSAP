import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Settings } from 'lucide-react';

const ModelShowcase = () => {
  const sectionRef = useRef();
  const titleRef = useRef();
  const modelsRef = useRef();

  const models = [
    {
      name: 'BMW M4 Competition',
      type: 'Coupe',
      power: '510 HP',
      acceleration: '3.9s 0-100km/h',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop',
      price: 'From $74,700'
    },
    {
      name: 'BMW M8 Gran Coupe',
      type: 'Grand Coupe',
      power: '617 HP',
      acceleration: '3.2s 0-100km/h',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop',
      price: 'From $133,000'
    },
    {
      name: 'BMW iX xDrive50',
      type: 'Electric SUV',
      power: '516 HP',
      acceleration: '4.6s 0-100km/h',
      image: 'https://images.unsplash.com/photo-1606016159991-bdbe2cdf3d80?q=80&w=2070&auto=format&fit=crop',
      price: 'From $84,195'
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const modelCards = modelsRef.current.children;

    // Title animation
    gsap.fromTo(title,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        }
      }
    );

    // Model cards stagger animation
    gsap.fromTo(modelCards,
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1
        }
      }
    );

    // Hover effects for model cards
    Array.from(modelCards).forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} id="models" className="model-showcase">
      <div className="container">
        <h2 ref={titleRef} className="section-title">
          The Fleet
        </h2>
        
        <div ref={modelsRef} className="models-grid">
          {models.map((model, index) => (
            <div key={index} className="model-card">
              <div className="model-image">
                <img src={model.image} alt={model.name} />
                <div className="model-overlay">
                  <button className="explore-btn">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
              
              <div className="model-info">
                <h3 className="model-name">{model.name}</h3>
                <p className="model-type">{model.type}</p>
                
                <div className="model-specs">
                  <div className="spec">
                    <Zap size={16} />
                    <span>{model.power}</span>
                  </div>
                  <div className="spec">
                    <Settings size={16} />
                    <span>{model.acceleration}</span>
                  </div>
                </div>
                
                <div className="model-footer">
                  <span className="model-price">{model.price}</span>
                  <button className="config-btn magnetic-btn">Configure</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelShowcase;