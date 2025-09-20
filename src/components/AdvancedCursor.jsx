import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AdvancedCursor = () => {
  const cursorRef = useRef();
  const cursorDotRef = useRef();
  const trailRefs = useRef([]);
  const isVisible = useRef(true);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const trails = trailRefs.current;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Mouse position tracking
    let mouse = { x: 0, y: 0 };
    let trail = [];

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Main cursor movement
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out"
      });

      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });

      // Trail effect
      trail.unshift({ x: e.clientX, y: e.clientY });
      if (trail.length > 10) trail.pop();

      trails.forEach((trailEl, index) => {
        if (trail[index]) {
          gsap.set(trailEl, {
            x: trail[index].x,
            y: trail[index].y,
            opacity: (10 - index) / 10,
            scale: (10 - index) / 15
          });
        }
      });
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      
      if (target.matches('button, a, .magnetic-btn, .interactive')) {
        // Magnetic effect
        gsap.to(cursor, {
          scale: 2,
          mixBlendMode: 'difference',
          duration: 0.3,
          ease: "power2.out"
        });

        // Button magnetic pull
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        gsap.to(cursor, {
          x: centerX,
          y: centerY,
          duration: 0.3,
          ease: "power2.out"
        });

        // Ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = mouse.x + 'px';
        ripple.style.top = mouse.y + 'px';
        document.body.appendChild(ripple);

        gsap.fromTo(ripple, {
          scale: 0,
          opacity: 1
        }, {
          scale: 3,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => ripple.remove()
        });
      }

      if (target.matches('img, video')) {
        gsap.to(cursor, {
          scale: 3,
          opacity: 0.8,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = (e) => {
      gsap.to(cursor, {
        scale: 1,
        mixBlendMode: 'normal',
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: "elastic.out(1, 0.3)"
      });
    };

    // Hide cursor when leaving window
    const handleMouseLeaveWindow = () => {
      isVisible.current = false;
      gsap.to([cursor, cursorDot, ...trails], {
        opacity: 0,
        duration: 0.2
      });
    };

    const handleMouseEnterWindow = () => {
      isVisible.current = true;
      gsap.to([cursor, cursorDot, ...trails], {
        opacity: 1,
        duration: 0.2
      });
    };

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Auto-hide after inactivity
    let inactivityTimer;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      if (isVisible.current) {
        gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.2 });
      }
      inactivityTimer = setTimeout(() => {
        gsap.to([cursor, cursorDot], { opacity: 0.3, duration: 0.5 });
      }, 3000);
    };

    document.addEventListener('mousemove', resetInactivityTimer);

    return () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.removeEventListener('mousemove', resetInactivityTimer);
      clearTimeout(inactivityTimer);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="advanced-cursor"></div>
      <div ref={cursorDotRef} className="advanced-cursor-dot"></div>
      
      {/* Cursor trail elements */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          ref={el => trailRefs.current[i] = el}
          className="cursor-trail"
        ></div>
      ))}
    </>
  );
};

export default AdvancedCursor;