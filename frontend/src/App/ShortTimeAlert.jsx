import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const ShortTimeAlert = ({ isVisible, onClose }) => {
	React.useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(onClose, 3000);
			return () => clearTimeout(timer);
		}
	}, [isVisible, onClose]);
	
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 50 }}
					className="fixed bottom-4 right-4 z-50"
				>
					<div className="bg-white rounded-lg shadow-lg min-w-[320px] p-4 border-l-4 border-red-500">
						<button
							onClick={onClose}
							className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={18} />
						</button>
						
						<div className="flex items-start space-x-3">
							<div className="text-red-500">
								<AlertCircle size={24} />
							</div>
							<div>
								<h3 className="font-medium text-gray-900 mb-1">Session Too Short</h3>
								<p className="text-sm text-gray-600">
									Timer stopped before 10 seconds. Session not recorded.
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ShortTimeAlert;