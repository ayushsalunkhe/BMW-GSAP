import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoadingAnimation = () => {
  const preloaderRef = useRef();
  const logoRef = useRef();
  const progressRef = useRef();
  const barsRef = useRef();

  useEffect(() => {
    const preloader = preloaderRef.current;
    const logo = logoRef.current;
    const progress = progressRef.current;
    const bars = barsRef.current.children;

    // Set initial states
    gsap.set(".bmw-letter", { 
      opacity: 0,
      scale: 0.8,
      rotation: 45
    });

    gsap.set(progress, { scaleX: 0 });
    gsap.set(bars, { scaleY: 0, opacity: 0 });

    // Main loading timeline
    const loadingTL = gsap.timeline();

    // BMW logo animation
    loadingTL
      .to(".bmw-letter", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 2,
        stagger: 0.3,
        ease: "power3.out"
      })
      .to(bars, {
        scaleY: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=1")
      .to(progress, {
        scaleX: 1,
        duration: 2.5,
        ease: "power2.inOut"
      }, "-=2")
      .to(logo, {
        scale: 1.2,
        duration: 0.5,
        ease: "power2.out"
      })
      .to(logo, {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      })
      
      // Explosion effect
      .to(".bmw-letter", {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.in"
      }, "+=0.5")
      .to(preloader, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          preloader.style.display = 'none';
        }
      }, "-=0.3");

    // Cinematic bars animation
    gsap.to(bars, {
      scaleY: () => gsap.utils.random(0.3, 1),
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "none",
      stagger: 0.05
    });

    return () => {
      loadingTL.kill();
    };
  }, []);

  return (
    <div ref={preloaderRef} className="preloader">
      <div className="loading-content">
        {/* BMW Logo */}
        <div ref={logoRef} className="bmw-logo-loading">
          <div className="bmw-letter-circle">
            <div className="bmw-letter bmw-b">B</div>
            <div className="bmw-letter bmw-m">M</div>
            <div className="bmw-letter bmw-w">W</div>
          </div>
        </div>

        {/* Loading text */}
        <div className="loading-text">
          <h2>THE ULTIMATE DRIVING MACHINE</h2>
          <p>Loading Experience...</p>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div ref={progressRef} className="progress-fill"></div>
        </div>

        {/* Audio visualizer bars */}
        <div ref={barsRef} className="audio-bars">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bar"></div>
          ))}
        </div>
      </div>

      {/* Particle explosion */}
      <div className="loading-particles">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="loading-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;