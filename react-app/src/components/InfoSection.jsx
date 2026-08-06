import { useEffect, useRef } from 'react';

/**
 * A glassmorphism info section with IntersectionObserver-based scroll reveal.
 *
 * @param {Object} props
 * @param {string} props.id - Section ID for anchor navigation
 * @param {string} [props.align] - 'right' to align content to the right
 * @param {string} props.tag - Section tag label (e.g. "ABOUT US")
 * @param {string} props.title - Section heading
 * @param {string} [props.subtitle] - Italic serif subtitle
 * @param {string} [props.description] - Body text paragraph
 * @param {Array} [props.features] - Feature list items with { title, text }
 * @param {React.ReactNode} [props.children] - Custom content inside the card
 */
export default function InfoSection({
  id,
  align,
  tag,
  title,
  subtitle,
  description,
  features,
  children,
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      className={`info-section${align === 'right' ? ' align-right' : ''}`}
    >
      <div ref={cardRef} className="glass-card">
        <span className="section-tag">{tag}</span>
        <h2>{title}</h2>
        {subtitle && <p className="serif-sub">{subtitle}</p>}
        {description && <p className="description">{description}</p>}
        {features && features.length > 0 && (
          <div className="feature-list">
            {features.map((feature, index) => (
              <div className="feature-item" key={index}>
                <span className="check-icon">✓</span>
                <p>
                  <strong>{feature.title}:</strong> {feature.text}
                </p>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
