import useInViewOnce from '../hooks/useInViewOnce';
import '../styles/Timeline.css';

export const TimelineItem = ({ heading, subheading, badge, meta, description }) => (
    <div className="timeline-item reveal-item reveal-item--from-left">
        <div className="timeline-dot"></div>
        <div className="timeline-content">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                <div>
                    <h5 className="fw-bold mb-0">{heading}</h5>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>{subheading}</span>
                </div>
                <span className="badge rounded-pill badge-pill-custom">
                    {badge}
                </span>
            </div>
            {meta && (
                <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.82rem' }}>{meta}</p>
            )}
            {Array.isArray(description) ? (
                description.length > 0 && (
                    <ul className="mt-2 mb-0 ps-3" style={{ fontSize: '0.875rem', color: 'var(--detail-color)' }}>
                        {description.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                )
            ) : (
                description && (
                    <p className="mb-0 mt-2" style={{ fontSize: '0.875rem', color: 'var(--detail-color)' }}>{description}</p>
                )
            )}
        </div>
    </div>
);

export const TimelineSection = ({ id, title, children }) => {
    const [ref, inView] = useInViewOnce();

    return (
        <section id={id} className="py-5" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <h2 className="text-center mb-5 fw-bold">{title}</h2>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div
                            ref={ref}
                            className={`timeline${inView ? ' is-visible' : ''}`}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
