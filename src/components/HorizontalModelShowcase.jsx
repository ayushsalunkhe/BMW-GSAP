import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Settings, Eye } from 'lucide-react';

const HorizontalModelShowcase = () => {
  const sectionRef = useRef();
  const containerRef = useRef();
  const modelsRef = useRef();

  const models = [
    {
      name: 'BMW M4 Competition',
      type: 'Track Beast',
      power: '510 HP',
      acceleration: '3.9s 0-100km/h',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop',
      price: 'From $74,700',
      description: 'Pure racing DNA meets everyday luxury',
      color: '#ff4444'
    },
    {
      name: 'BMW M8 Gran Coupe',
      type: 'Ultimate Performance',
      power: '617 HP',
      acceleration: '3.2s 0-100km/h',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop',
      price: 'From $133,000',
      description: 'The pinnacle of M performance',
      color: '#0066B1'
    },
    {
      name: 'BMW iX xDrive50',
      type: 'Electric Future',
      power: '516 HP',
      acceleration: '4.6s 0-100km/h',
      image: 'https://images.unsplash.com/photo-1606016159991-bdbe2cdf3d80?q=80&w=2070&auto=format&fit=crop',
      price: 'From $84,195',
      description: 'Sustainable luxury redefined',
      color: '#00ff88'
    },
    {
      name: 'BMW M5 CS',
      type: 'Track Legend',
      power: '635 HP',
      acceleration: '3.0s 0-100km/h',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop',
      price: 'From $142,000',
      description: 'The most powerful M5 ever',
      color: '#ff6b00'
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const modelCards = modelsRef.current.children;

    // Horizontal scroll setup
    const scrollTween = gsap.to(modelCards, {
      xPercent: -100 * (modelCards.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 2,
        snap: 1 / (modelCards.length - 1),
        start: "top top",
        end: () => "+=" + (section.offsetWidth * 2)
      }
    });

    // Individual card animations during scroll
    Array.from(modelCards).forEach((card, index) => {
      const image = card.querySelector('.model-image-3d img');
      const content = card.querySelector('.model-content-3d');
      const specs = card.querySelectorAll('.spec-3d');
      
      // 3D rotation and scaling effects
      ScrollTrigger.create({
        trigger: card,
        start: "left center",
        end: "right center",
        containerAnimation: scrollTween,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const rotation = (progress - 0.5) * 30;
          const scale = 1 - Math.abs(progress - 0.5) * 0.3;
          
          gsap.set(card, {
            rotationY: rotation,
            scale: scale,
            z: progress * 50
          });

          // Image distortion effect
          gsap.set(image, {
            rotationX: progress * 10,
            scale: 1 + progress * 0.1,
            filter: `blur(${Math.abs(progress - 0.5) * 2}px) brightness(${1 + progress * 0.2})`
          });

          // Content reveal with stagger
          gsap.set(content, {
            y: (1 - progress) * 50,
            opacity: progress > 0.3 ? 1 : 0.3
          });
        }
      });

      // Spotlight effect
      ScrollTrigger.create({
        trigger: card,
        start: "left 60%",
        end: "right 40%",
        containerAnimation: scrollTween,
        onEnter: () => {
          gsap.to(card, {
            boxShadow: `0 0 100px ${models[index].color}66`,
            duration: 1,
            ease: "power2.out"
          });
          
          // Counter animation for specs
          specs.forEach(spec => {
            const number = spec.querySelector('.spec-number');
            const targetValue = parseInt(number.textContent);
            gsap.fromTo({ value: 0 }, {
              value: targetValue,
              duration: 2,
              ease: "power2.out",
              onUpdate: function() {
                number.textContent = Math.round(this.targets()[0].value);
              }
            });
          });
        },
        onLeave: () => {
          gsap.to(card, {
            boxShadow: "0 0 0px rgba(0,0,0,0)",
            duration: 0.5
          });
        }
      });

      // Interactive hover effects
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -20,
          rotationX: 5,
          scale: 1.02,
          duration: 0.5,
          ease: "power2.out"
        });

        gsap.to(image, {
          scale: 1.1,
          rotationY: 5,
          duration: 0.5,
          ease: "power2.out"
        });

        // Magnetic button effect
        const btn = card.querySelector('.explore-btn-3d');
        gsap.to(btn, {
          scale: 1.2,
          rotation: 90,
          duration: 0.3,
          ease: "back.out(2)"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });

        gsap.to(image, {
          scale: 1,
          rotationY: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });

        const btn = card.querySelector('.explore-btn-3d');
        gsap.to(btn, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });

    // Progress indicator
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + (section.offsetWidth * 2),
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set('.progress-bar-3d', {
          scaleX: progress,
          transformOrigin: "left center"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-showcase-3d" data-skew>
      <div className="progress-indicator-3d">
        <div className="progress-bar-3d"></div>
      </div>
      
      <div ref={containerRef} className="horizontal-container-3d">
        <div ref={modelsRef} className="models-row-3d">
          {models.map((model, index) => (
            <div key={index} className="model-card-3d">
              <div className="model-image-3d">
                <img src={model.image} alt={model.name} />
                <div className="model-overlay-3d">
                  <button className="explore-btn-3d">
                    <Eye size={24} />
                  </button>
                </div>
                <div className="glitch-effect"></div>
              </div>
              
              <div className="model-content-3d">
                <div className="model-header-3d">
                  <h3 className="model-name-3d">{model.name}</h3>
                  <span className="model-type-3d">{model.type}</span>
                </div>
                
                <p className="model-description-3d">{model.description}</p>
                
                <div className="model-specs-3d">
                  <div className="spec-3d">
                    <Zap size={20} color={model.color} />
                    <span className="spec-number">{model.power.split(' ')[0]}</span>
                    <span className="spec-unit">HP</span>
                  </div>
                  <div className="spec-3d">
                    <Settings size={20} color={model.color} />
                    <span className="spec-number">{model.acceleration.split('s')[0]}</span>
                    <span className="spec-unit">s 0-100km/h</span>
                  </div>
                </div>
                
                <div className="model-footer-3d">
                  <span className="model-price-3d" style={{ color: model.color }}>
                    {model.price}
                  </span>
                  <button className="config-btn-3d magnetic-btn">
                    Configure
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Particle trail effect */}
              <div className="card-particles">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`card-particle card-particle-${i}`}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section title with reveal effect */}
      <div className="section-title-3d">
        <h2>THE FLEET</h2>
        <div className="title-underline" style={{ background: `linear-gradient(90deg, #0066B1, #ff4444, #00ff88, #ff6b00)` }}></div>
      </div>
    </section>
  );
};

export default HorizontalModelShowcase;