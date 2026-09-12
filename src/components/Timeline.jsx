import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../styles/Timeline.css';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

export const TimelineItem = ({ heading, subheading, badge, meta, description }) => (
    <motion.div className="timeline-item" variants={itemVariants}>
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
    </motion.div>
);

export const TimelineSection = ({ id, title, children }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id={id} className="py-5" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <h2 className="text-center mb-5 fw-bold">{title}</h2>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <motion.div
                            ref={ref}
                            className="timeline"
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
