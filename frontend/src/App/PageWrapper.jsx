import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageWrapper = ({ children }) => {
	const location = useLocation();
	
	return (
		<motion.div
			key={location.pathname}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 20,
			}}
			className="w-full"
		>
			{children}
		</motion.div>
	);
};

export default PageWrapper;