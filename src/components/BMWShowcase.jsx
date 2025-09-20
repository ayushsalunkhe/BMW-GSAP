import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';
import CinematicHero from './CinematicHero';
import Navigation from './Navigation';
import HorizontalModelShowcase from './HorizontalModelShowcase';
import PerformanceDashboard from './PerformanceDashboard';
import BMWTimeline from './BMWTimeline';
import SoundSection from './SoundSection';
import InteractiveConfigurator from './InteractiveConfigurator';
import AdvancedCursor from './AdvancedCursor';
import LoadingAnimation from './LoadingAnimation';

// Register GSAP plugins (free version)
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const BMWShowcase = () => {
  const containerRef = useRef();
  const smoothWrapperRef = useRef();

  useEffect(() => {
    // Initialize Lenis for ultra-smooth scrolling
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
      normalizeWheel: true,
    });

    // RAF loop for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Global scroll skew effect
    let skewSetter = gsap.quickSetter("[data-skew]", "skewY", "deg");
    let clamp = gsap.utils.clamp(-20, 20);
    
    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(skewSetter.tween?.progress() || 0)) {
          skewSetter(skew);
        }
      }
    });

    // Preloader sequence
    const preloaderTL = gsap.timeline();
    preloaderTL
      .to(".preloader", {
        opacity: 0,
        duration: 1,
        delay: 2,
        ease: "power4.inOut"
      })
      .set(".preloader", { display: "none" });

    return () => {
      lenis.destroy();
      ScrollTrigger.killAll();
      gsap.ticker.remove();
    };
  }, []);

  return (
    <div className="bmw-showcase">
      <LoadingAnimation />
      <AdvancedCursor />
      
      <div ref={smoothWrapperRef} className="smooth-wrapper">
        <div ref={containerRef} className="smooth-content">
          <Navigation />
          <CinematicHero />
          <HorizontalModelShowcase />
          <PerformanceDashboard />
          <BMWTimeline />
          <SoundSection />
          <InteractiveConfigurator />
        </div>
      </div>
    </div>
  );
};

export default BMWShowcase;