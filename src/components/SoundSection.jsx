import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';

const SoundSection = () => {
  const sectionRef = useRef();
  const waveformRef = useRef();
  const visualizerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const waveform = waveformRef.current;
    const visualizer = visualizerRef.current;

    // Create frequency bars
    const bars = visualizer.querySelectorAll('.freq-bar');
    
    // Waveform animation tied to scroll
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Animate waveform path
        const waveformPath = waveform.querySelector('.waveform-path');
        gsap.set(waveformPath, {
          strokeDashoffset: -progress * 1000
        });

        // Animate frequency bars based on scroll
        bars.forEach((bar, index) => {
          const frequency = Math.sin((progress * 10) + (index * 0.5)) * 0.5 + 0.5;
          gsap.set(bar, {
            scaleY: 0.1 + frequency * 0.9,
            backgroundColor: `hsl(${progress * 360 + index * 30}, 70%, 60%)`
          });
        });
      }
    });

    // Audio visualization when playing
    let animationId;
    if (isPlaying) {
      const animate = () => {
        bars.forEach((bar, index) => {
          const frequency = Math.random();
          gsap.to(bar, {
            scaleY: 0.1 + frequency * 0.9,
            duration: 0.1,
            ease: "power2.out"
          });
        });
        animationId = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section ref={sectionRef} className="sound-section-3d" data-skew>
      <div className="container">
        <div className="sound-header">
          <h2>THE SOUND OF POWER</h2>
          <p>Experience the symphony of BMW engineering</p>
        </div>

        <div className="sound-studio">
          {/* Waveform Display */}
          <div ref={waveformRef} className="waveform-container">
            <svg className="waveform-svg" viewBox="0 0 800 200">
              <path
                className="waveform-path"
                d="M0,100 Q50,50 100,100 T200,100 Q250,150 300,100 T400,100 Q450,50 500,100 T600,100 Q650,150 700,100 T800,100"
                fill="none"
                stroke="url(#soundGradient)"
                strokeWidth="3"
                strokeDasharray="10,5"
              />
              <defs>
                <linearGradient id="soundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff4444" />
                  <stop offset="50%" stopColor="#0066B1" />
                  <stop offset="100%" stopColor="#00ff88" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Play Controls */}
            <div className="sound-controls">
              <button className="play-btn magnetic-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button className="reset-btn magnetic-btn">
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* Audio Visualizer */}
          <div ref={visualizerRef} className="audio-visualizer">
            <div className="visualizer-title">
              <Volume2 size={24} />
              <span>Engine Symphony</span>
            </div>
            
            <div className="frequency-bars">
              {[...Array(32)].map((_, index) => (
                <div key={index} className="freq-bar"></div>
              ))}
            </div>
            
            <div className="frequency-labels">
              <span>20Hz</span>
              <span>200Hz</span>
              <span>2kHz</span>
              <span>20kHz</span>
            </div>
          </div>

          {/* Sound Mixer */}
          <div className="sound-mixer">
            <h3>BMW M Sound Profile</h3>
            <div className="mixer-channels">
              <div className="channel">
                <label>V8 Rumble</label>
                <div className="slider-container">
                  <input type="range" min="0" max="100" defaultValue="85" className="sound-slider" />
                  <div className="slider-fill"></div>
                </div>
              </div>
              <div className="channel">
                <label>Turbo Whistle</label>
                <div className="slider-container">
                  <input type="range" min="0" max="100" defaultValue="70" className="sound-slider" />
                  <div className="slider-fill"></div>
                </div>
              </div>
              <div className="channel">
                <label>Exhaust Pop</label>
                <div className="slider-container">
                  <input type="range" min="0" max="100" defaultValue="60" className="sound-slider" />
                  <div className="slider-fill"></div>
                </div>
              </div>
              <div className="channel">
                <label>Intake Growl</label>
                <div className="slider-container">
                  <input type="range" min="0" max="100" defaultValue="90" className="sound-slider" />
                  <div className="slider-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sound waves animation */}
        <div className="sound-waves">
          {[...Array(5)].map((_, index) => (
            <div key={index} className={`sound-wave wave-${index + 1}`}></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoundSection;