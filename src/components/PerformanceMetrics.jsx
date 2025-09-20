import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gauge, Zap, Wind, Award } from 'lucide-react';

const PerformanceMetrics = () => {
  const sectionRef = useRef();
  const titleRef = useRef();
  const metricsRef = useRef();
  const speedometerRef = useRef();

  const metrics = [
    {
      icon: <Zap size={32} />,
      value: '617',
      unit: 'HP',
      label: 'Maximum Power',
      description: 'Twin-turbocharged V8 engine'
    },
    {
      icon: <Wind size={32} />,
      value: '3.2',
      unit: 'SEC',
      label: '0-100 km/h',
      description: 'Lightning-fast acceleration'
    },
    {
      icon: <Gauge size={32} />,
      value: '305',
      unit: 'KM/H',
      label: 'Top Speed',
      description: 'Electronically limited'
    },
    {
      icon: <Award size={32} />,
      value: '750',
      unit: 'NM',
      label: 'Peak Torque',
      description: 'Instant power delivery'
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const metricCards = metricsRef.current.children;
    const speedometer = speedometerRef.current;

    // Title animation
    gsap.fromTo(title,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        }
      }
    );

    // Speedometer animation
    gsap.fromTo(speedometer.querySelector('.speedometer-needle'),
      { rotation: -90 },
      {
        rotation: 45,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 1
        }
      }
    );

    // Metric cards animation with counter
    Array.from(metricCards).forEach((card, index) => {
      const valueElement = card.querySelector('.metric-value');
      const targetValue = parseInt(metrics[index].value);

      gsap.fromTo(card,
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: index * 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
            onStart: () => {
              // Counter animation
              gsap.fromTo({ value: 0 },
                { value: targetValue },
                {
                  duration: 2,
                  ease: 'power2.out',
                  onUpdate: function() {
                    valueElement.textContent = Math.round(this.targets()[0].value);
                  }
                }
              );
            }
          }
        }
      );

      // Hover effects
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} id="performance" className="performance-metrics">
      <div className="container">
        <h2 ref={titleRef} className="section-title">
          Pure Power
        </h2>

        <div className="performance-content">
          <div ref={speedometerRef} className="speedometer">
            <div className="speedometer-circle">
              <div className="speedometer-needle"></div>
              <div className="speedometer-center">
                <span className="speed-value">305</span>
                <span className="speed-unit">KM/H</span>
              </div>
            </div>
            <p className="speedometer-label">Maximum Velocity</p>
          </div>

          <div ref={metricsRef} className="metrics-grid">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon">
                  {metric.icon}
                </div>
                <div className="metric-content">
                  <div className="metric-number">
                    <span className="metric-value">0</span>
                    <span className="metric-unit">{metric.unit}</span>
                  </div>
                  <h4 className="metric-label">{metric.label}</h4>
                  <p className="metric-description">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceMetrics;