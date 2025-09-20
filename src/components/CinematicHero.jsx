import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { ChevronDown, Play } from 'lucide-react';

const CinematicHero = () => {
  const heroRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const secondTitleRef = useRef();
  const ctaRef = useRef();
  const bgRef = useRef();
  const overlayRef = useRef();
  const particlesRef = useRef();

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const secondTitle = secondTitleRef.current;
    const cta = ctaRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;

    // Custom split text function (since SplitText is premium)
    const splitText = (element) => {
      if (!element || !element.textContent) return [];
      const text = element.textContent;
      const chars = text.split('').map(char => 
        char === ' ' ? '<span class="char space"> </span>' : `<span class="char">${char}</span>`
      ).join('');
      element.innerHTML = chars;
      return element.querySelectorAll('.char');
    };

    const titleChars = splitText(title);
    if (subtitle && subtitle.textContent) {
      const subtitleWords = subtitle.textContent.split(' ').map(word => 
        `<span class="word">${word}</span>`
      ).join(' ');
      subtitle.innerHTML = subtitleWords;
    }

    // Set up 3D perspective
    gsap.set(title, { perspective: 1000 });
    gsap.set(titleChars, { 
      transformOrigin: "50% 50% -50px",
      rotationX: 90,
      rotationY: 45,
      z: -100,
      opacity: 0,
      filter: "blur(10px)"
    });

    // Master timeline for hero entrance
    const masterTL = gsap.timeline({ delay: 1 });

    // Background entrance with multiple layers
    masterTL
      .fromTo(bg, 
        { scale: 1.3, opacity: 0, rotationZ: 2 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationZ: 0,
          duration: 3, 
          ease: "power4.out" 
        }
      )
      .fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: "power2.inOut" }, "-=2"
      );

    // Cinema-quality text animation
    masterTL
      .to(titleChars, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: {
          amount: 2,
          from: "center",
          grid: "auto",
          ease: "back.out(2)"
        },
        ease: "elastic.out(1, 0.5)"
      }, "-=1")
      
      // Scramble text effect for second title using TextPlugin
      .set(secondTitle, { text: "████████████████" })
      .to(secondTitle, {
        duration: 2,
        text: "SHEER DRIVING PLEASURE",
        ease: "none"
      }, "-=0.5")

      // Subtitle reveal with wave effect
      .fromTo(subtitle.querySelectorAll('.word'), {
        y: 100,
        rotationX: -45,
        opacity: 0,
        transformOrigin: "50% 100%"
      }, {
        y: 0,
        rotationX: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=1")

      // CTA buttons with particle explosion effect
      .fromTo(cta.children, {
        scale: 0,
        rotation: 180,
        opacity: 0,
        y: 50
      }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(2)"
      }, "-=0.5");

    // Advanced scroll-triggered animations
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      pin: true,
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Multi-layer parallax
        if (bg) {
          gsap.set(bg, {
            scale: 1 + progress * 0.5,
            y: progress * 200,
            rotationZ: progress * 5
          });
        }

        if (titleChars && titleChars.length > 0) {
          gsap.set(titleChars, {
            y: -progress * 300,
            rotationX: progress * 180,
            opacity: 1 - progress * 1.5,
            z: progress * 100
          });
        }

        if (overlay) {
          gsap.set(overlay, {
            opacity: 0.6 + progress * 0.4
          });
        }

        // Skew effect based on scroll velocity
        const velocity = self.getVelocity();
        const skewElements = document.querySelectorAll("[data-skew]");
        if (skewElements.length > 0) {
          gsap.set(skewElements, {
            skewY: gsap.utils.clamp(-15, 15, velocity / -200)
          });
        }
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
        rotationY: moveX * 0.1,
        rotationX: -moveY * 0.1,
        duration: 2,
        ease: "power2.out"
      });

      // Particles follow mouse
      gsap.to(".particle", {
        x: moveX * 2,
        y: moveY * 2,
        duration: 2,
        stagger: 0.05,
        ease: "power2.out"
      });
    };

    // Magnetic button effect
    const magneticButtons = cta?.querySelectorAll('.magnetic-btn') || [];
    magneticButtons.forEach(btn => {
      if (!btn) return;
      
      btn.addEventListener('mouseenter', (e) => {
        gsap.to(btn, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        const btnChildren = btn.children;
        if (btnChildren && btnChildren.length > 0) {
          gsap.to(btnChildren, {
            x: gsap.utils.random(-5, 5),
            y: gsap.utils.random(-5, 5),
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out"
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
        
        const btnChildren = btn.children;
        if (btnChildren && btnChildren.length > 0) {
          gsap.to(btnChildren, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          });
        }
      });
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section ref={heroRef} className="cinematic-hero" data-skew>
      <div 
        ref={bgRef}
        className="hero-background-3d"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop)',
        }}
      >
        <div ref={overlayRef} className="hero-overlay-3d"></div>
      </div>

      <div className="hero-content-3d">
        <div className="hero-text-3d">
          <h1 ref={titleRef} className="hero-title-3d">
            THE ULTIMATE DRIVING MACHINE
          </h1>
          <h2 ref={secondTitleRef} className="hero-second-title">
          </h2>
          <p ref={subtitleRef} className="hero-subtitle-3d">
            Experience the perfect fusion of luxury, performance, and innovation. 
            Discover the BMW that moves you beyond limits.
          </p>
          <div ref={ctaRef} className="hero-cta-3d">
            <button className="primary-btn-3d magnetic-btn">
              <span>E</span><span>x</span><span>p</span><span>l</span><span>o</span><span>r</span><span>e</span><span> </span><span>M</span><span>o</span><span>d</span><span>e</span><span>l</span><span>s</span>
              <Play size={20} />
            </button>
            <button className="secondary-btn-3d magnetic-btn">
              <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span> </span><span>&</span><span> </span><span>P</span><span>r</span><span>i</span><span>c</span><span>e</span>
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-indicator-3d">
        <ChevronDown size={24} />
        <span>Scroll to explore</span>
      </div>

      {/* Advanced particle system */}
      <div ref={particlesRef} className="particles-3d">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className={`particle particle-${i + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
    </section>
  );
};

export default CinematicHero;