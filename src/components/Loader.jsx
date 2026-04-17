import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'var(--bg)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <motion.div
                animate={{
                    rotate: 360
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: 'linear'
                }}
                style={{
                    width: 48,
                    height: 48,
                    border: '6px solid var(--border)',
                    borderTop: '6px solid #0d6efd',
                    borderRadius: '50%'
                }}
            />
        </motion.div>
    );
};

export default Loader;
