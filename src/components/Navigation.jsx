import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const navRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    const nav = navRef.current;
    
    // Nav fade in animation
    gsap.fromTo(nav, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power4.out' }
    );

    // Scroll-based nav background
    gsap.to(nav, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top+=100 top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > 0.1) {
            nav.classList.add('nav-scrolled');
          } else {
            nav.classList.remove('nav-scrolled');
          }
        }
      }
    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav ref={navRef} className="bmw-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="bmw-logo">BMW</span>
        </div>
        
        <div className="nav-links desktop-only">
          <a href="#models" className="nav-link">Models</a>
          <a href="#technology" className="nav-link">Technology</a>
          <a href="#performance" className="nav-link">Performance</a>
          <a href="#experience" className="nav-link">Experience</a>
        </div>

        <div className="nav-cta desktop-only">
          <button className="cta-button">Configure</button>
        </div>

        <button className="mobile-menu-toggle mobile-only" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <a href="#models" className="mobile-nav-link">Models</a>
          <a href="#technology" className="mobile-nav-link">Technology</a>
          <a href="#performance" className="mobile-nav-link">Performance</a>
          <a href="#experience" className="mobile-nav-link">Experience</a>
          <button className="cta-button mobile-cta">Configure</button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;