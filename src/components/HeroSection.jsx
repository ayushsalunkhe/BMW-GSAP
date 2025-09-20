import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Play } from 'lucide-react';

const HeroSection = () => {
  const heroRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const ctaRef = useRef();
  const scrollIndicatorRef = useRef();
  const bgRef = useRef();

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const bg = bgRef.current;

    // Create main timeline
    const tl = gsap.timeline({ delay: 0.5 });

    // Split title into characters for stagger animation
    const titleChars = title.textContent.split('').map(char => 
      char === ' ' ? '<span class="space"> </span>' : `<span class="char">${char}</span>`
    ).join('');
    title.innerHTML = titleChars;

    // Hero entrance animations
    tl.fromTo(bg, 
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
    )
    .fromTo('.char', 
      { y: 100, opacity: 0, rotationX: 90 },
      { 
        y: 0, 
        opacity: 1, 
        rotationX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.7)'
      }, '-=1.5'
    )
    .fromTo(subtitle, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.5'
    )
    .fromTo(cta, 
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.3'
    );

    // Scroll indicator pulse animation
    gsap.to(scrollIndicator, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });

    // Parallax effect on scroll
    gsap.to(bg, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Hero content fade out on scroll
    gsap.to([title, subtitle, cta], {
      y: -100,
      opacity: 0,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Mouse parallax effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (clientX - centerX) * 0.02;
      const moveY = (clientY - centerY) * 0.02;

      gsap.to(bg, {
        x: moveX,
        y: moveY,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div 
        ref={bgRef}
        className="hero-background"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop)',
        }}
      >
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 ref={titleRef} className="hero-title">
            THE ULTIMATE DRIVING MACHINE
          </h1>
          <p ref={subtitleRef} className="hero-subtitle">
            Experience the perfect fusion of luxury, performance, and innovation. 
            Discover the BMW that moves you.
          </p>
          <div ref={ctaRef} className="hero-cta">
            <button className="primary-btn magnetic-btn">
              <Play size={20} />
              Explore Models
            </button>
            <button className="secondary-btn magnetic-btn">
              Build & Price
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="scroll-indicator">
        <ChevronDown size={24} />
        <span>Scroll to explore</span>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;