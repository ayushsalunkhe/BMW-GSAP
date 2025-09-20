import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Car, Zap, Award } from 'lucide-react';

const BMWTimeline = () => {
  const sectionRef = useRef();
  const timelineRef = useRef();
  const yearCounterRef = useRef();
  const logoRef = useRef();

  const timelineData = [
    {
      year: 1916,
      title: "The Beginning",
      description: "Bayerische Motoren Werke founded in Munich",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=2070&auto=format&fit=crop",
      color: "#8B4513",
      icon: <Calendar size={24} />
    },
    {
      year: 1936,
      title: "Racing Heritage",
      description: "BMW 328 dominates international racing",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=2070&auto=format&fit=crop",
      color: "#4169E1",
      icon: <Award size={24} />
    },
    {
      year: 1972,
      title: "M Division Born",
      description: "BMW Motorsport GmbH established",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop",
      color: "#FF4444",
      icon: <Car size={24} />
    },
    {
      year: 2013,
      title: "Electric Future",
      description: "BMW i3 launches sustainable mobility",
      image: "https://images.unsplash.com/photo-1606016159991-bdbe2cdf3d80?q=80&w=2070&auto=format&fit=crop",
      color: "#00FF88",
      icon: <Zap size={24} />
    },
    {
      year: 2024,
      title: "Ultimate Innovation",
      description: "The future of autonomous driving arrives",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2069&auto=format&fit=crop",
      color: "#0066B1",
      icon: <Zap size={24} />
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    const yearCounter = yearCounterRef.current;
    const logo = logoRef.current;

    // Year counter animation tied to scroll
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentYear = Math.round(1916 + (progress * (2024 - 1916)));
        yearCounter.textContent = currentYear;

        // Logo morph effect
        const logoScale = 0.8 + Math.sin(progress * Math.PI * 4) * 0.2;
        const logoRotation = progress * 360;
        gsap.set(logo, {
          scale: logoScale,
          rotation: logoRotation,
          filter: `hue-rotate(${progress * 360}deg)`
        });

        // Film grain effect for older years
        const grainIntensity = progress < 0.5 ? (0.5 - progress) * 2 : 0;
        gsap.set(section, {
          filter: `grayscale(${grainIntensity}) sepia(${grainIntensity * 0.3})`
        });
      }
    });

    // Timeline items animation
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      const image = item.querySelector('.timeline-image img');
      const content = item.querySelector('.timeline-content');
      
      ScrollTrigger.create({
        trigger: item,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Ken Burns effect on images
          gsap.set(image, {
            scale: 1 + progress * 0.2,
            x: progress * 20,
            y: -progress * 10
          });

          // Content reveal
          gsap.set(content, {
            y: (1 - progress) * 50,
            opacity: progress > 0.2 ? 1 : 0.3
          });
        }
      });

      // Hover effects
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          y: -10,
          duration: 0.5,
          ease: "power2.out"
        });

        gsap.to(image, {
          scale: 1.1,
          duration: 0.5,
          ease: "power2.out"
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });

        gsap.to(image, {
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="bmw-timeline-3d" data-skew>
      <div className="container">
        <div className="timeline-header">
          <div ref={logoRef} className="timeline-logo">
            <div className="logo-circle">
              <span>BMW</span>
            </div>
          </div>
          <h2>BMW THROUGH TIME</h2>
          <div className="year-counter">
            <span ref={yearCounterRef}>1916</span>
          </div>
        </div>

        <div ref={timelineRef} className="timeline-container">
          {/* Timeline Items */}
          {timelineData.map((item, index) => (
            <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-marker" style={{ backgroundColor: item.color }}>
                {item.icon}
              </div>
              
              <div className="timeline-card">
                <div className="timeline-image">
                  <img src={item.image} alt={item.title} />
                  <div className="image-overlay" style={{ background: `linear-gradient(45deg, ${item.color}66, transparent)` }}></div>
                </div>
                
                <div className="timeline-content">
                  <div className="timeline-year" style={{ color: item.color }}>
                    {item.year}
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                </div>
              </div>

              {/* Particle trail */}
              <div className="timeline-particles">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="timeline-particle" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Film grain overlay for vintage effect */}
        <div className="film-grain"></div>
        
        {/* Vignette effect */}
        <div className="vignette"></div>
      </div>
    </section>
  );
};

export default BMWTimeline;