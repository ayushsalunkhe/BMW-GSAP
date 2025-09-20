import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gauge, Zap, Wind, Award, Activity, Thermometer } from 'lucide-react';

const PerformanceDashboard = () => {
  const sectionRef = useRef();
  const dashboardRef = useRef();
  const speedometerRef = useRef();
  const rpmRef = useRef();
  const gForceRef = useRef();

  useEffect(() => {
    const section = sectionRef.current;
    const speedometer = speedometerRef.current;
    const rpm = rpmRef.current;
    const gForce = gForceRef.current;

    // Dashboard entrance animation
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Speedometer animation
        const speedNeedle = speedometer?.querySelector('.speed-needle');
        const speedValue = speedometer?.querySelector('.speed-value');
        if (speedNeedle) {
          gsap.set(speedNeedle, {
            rotation: -90 + (progress * 180),
            transformOrigin: "50% 90%"
          });
        }
        
        if (speedValue) {
          const currentSpeed = Math.round(progress * 320);
          speedValue.textContent = currentSpeed;
        }

        // RPM animation with realistic bounce
        const rpmNeedle = rpm?.querySelector('.rpm-needle');
        const rpmValue = rpm?.querySelector('.rpm-value');
        if (rpmNeedle) {
          const rpmRotation = -90 + (progress * 200) + Math.sin(progress * 20) * 5;
          gsap.set(rpmNeedle, {
            rotation: rpmRotation,
            transformOrigin: "50% 90%"
          });
        }
        
        if (rpmValue) {
          const currentRPM = Math.round(progress * 7000);
          rpmValue.textContent = (currentRPM / 1000).toFixed(1);
        }

        // G-Force meter swaying
        const gNeedle = gForce?.querySelector('.g-needle');
        const gValue = gForce?.querySelector('.g-value');
        if (gNeedle) {
          const gRotation = Math.sin(progress * 10) * 30;
          gsap.set(gNeedle, {
            rotation: gRotation,
            transformOrigin: "50% 100%"
          });
        }
        
        if (gValue) {
          const currentG = Math.abs(Math.sin(progress * 5) * 2.5).toFixed(1);
          gValue.textContent = currentG;
        }

        // Screen glitch effect at peak
        const dashboardScreens = section.querySelectorAll('.dashboard-screen');
        if (dashboardScreens.length > 0) {
          if (progress > 0.9) {
            gsap.set(dashboardScreens, {
              filter: `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random()})`
            });
          } else {
            gsap.set(dashboardScreens, {
              filter: "none"
            });
          }
        }
      }
    });

    // Performance metrics with counter animation
    const metrics = section.querySelectorAll('.metric-counter');
    metrics.forEach(metric => {
      if (!metric || !metric.dataset || !metric.dataset.value) return;
      
      const finalValue = parseInt(metric.dataset.value);
      if (isNaN(finalValue)) return;
      
      ScrollTrigger.create({
        trigger: metric,
        start: "top 80%",
        onEnter: () => {
          if (!metric) return;
          
          gsap.fromTo({ value: 0 }, {
            value: finalValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: function() {
              if (metric && typeof metric.textContent !== 'undefined') {
                metric.textContent = Math.round(this.targets()[0].value);
              }
            }
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="performance-dashboard-3d" data-skew>
      <div className="container">
        <div className="dashboard-title">
          <h2>PERFORMANCE COMMAND CENTER</h2>
          <p>Real-time data visualization</p>
        </div>

        <div ref={dashboardRef} className="dashboard-grid">
          {/* Speedometer */}
          <div ref={speedometerRef} className="dashboard-widget speedometer-3d">
            <div className="widget-header">
              <Gauge size={24} />
              <span>Speed</span>
            </div>
            <div className="gauge-container">
              <svg className="gauge-svg" viewBox="0 0 200 120">
                <path
                  className="gauge-track"
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <path
                  className="gauge-fill"
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#speedGradient)"
                  strokeWidth="6"
                />
                <line 
                  className="speed-needle"
                  x1="100" y1="100" x2="100" y2="40"
                  stroke="#ff4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="8" fill="#ff4444" />
                <defs>
                  <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0066B1" />
                    <stop offset="50%" stopColor="#ff6b00" />
                    <stop offset="100%" stopColor="#ff4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="gauge-value">
                <span className="speed-value metric-counter" data-value="320">0</span>
                <span className="gauge-unit">KM/H</span>
              </div>
            </div>
          </div>

          {/* RPM Gauge */}
          <div ref={rpmRef} className="dashboard-widget rpm-3d">
            <div className="widget-header">
              <Activity size={24} />
              <span>RPM</span>
            </div>
            <div className="gauge-container">
              <svg className="gauge-svg" viewBox="0 0 200 120">
                <path
                  className="gauge-track"
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                />
                <path
                  className="gauge-fill"
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="#0066B1"
                  strokeWidth="4"
                />
                <line 
                  className="rpm-needle"
                  x1="100" y1="100" x2="100" y2="45"
                  stroke="#0066B1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="#0066B1" />
              </svg>
              <div className="gauge-value">
                <span className="rpm-value metric-counter" data-value="7">0</span>
                <span className="gauge-unit">K RPM</span>
              </div>
            </div>
          </div>

          {/* G-Force Meter */}
          <div ref={gForceRef} className="dashboard-widget g-force-3d">
            <div className="widget-header">
              <Wind size={24} />
              <span>G-Force</span>
            </div>
            <div className="g-meter">
              <div className="g-scale">
                <div className="g-needle"></div>
              </div>
              <div className="gauge-value">
                <span className="g-value metric-counter" data-value="2.5">0</span>
                <span className="gauge-unit">G</span>
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="dashboard-widget temp-3d">
            <div className="widget-header">
              <Thermometer size={24} />
              <span>Engine Temp</span>
            </div>
            <div className="temp-display">
              <div className="temp-bar">
                <div className="temp-fill"></div>
              </div>
              <div className="gauge-value">
                <span className="metric-counter" data-value="92">0</span>
                <span className="gauge-unit">°C</span>
              </div>
            </div>
          </div>

          {/* Power Output */}
          <div className="dashboard-widget power-3d">
            <div className="widget-header">
              <Zap size={24} />
              <span>Power</span>
            </div>
            <div className="power-bars">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="power-bar" style={{animationDelay: `${i * 0.1}s`}}></div>
              ))}
            </div>
            <div className="gauge-value">
              <span className="metric-counter" data-value="617">0</span>
              <span className="gauge-unit">HP</span>
            </div>
          </div>

          {/* Torque */}
          <div className="dashboard-widget torque-3d">
            <div className="widget-header">
              <Award size={24} />
              <span>Torque</span>
            </div>
            <div className="torque-circle">
              <svg className="torque-svg" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                <circle
                  className="torque-progress"
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset="125.6"
                />
              </svg>
              <div className="gauge-value">
                <span className="metric-counter" data-value="750">0</span>
                <span className="gauge-unit">NM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance visualization */}
        <div className="performance-wave">
          <svg className="wave-svg" viewBox="0 0 1000 200">
            <path
              className="wave-path"
              d="M0,100 Q250,50 500,100 T1000,100"
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0066B1" />
                <stop offset="50%" stopColor="#ff6b00" />
                <stop offset="100%" stopColor="#ff4444" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default PerformanceDashboard;