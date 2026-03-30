'use client';

import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BottomSheetProps {
    children: React.ReactNode;
}

export default function BottomSheet({ children }: BottomSheetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const controls = useAnimation();

    // Snap points (represented as translate Y values)
    // 0 = Expanded (top of screen relative to container)
    // We will use height-based approach instead.
    
    const collapseHeight = 160; // Just enough for grabber, title, and top of cards
    const expandHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;

    useEffect(() => {
        controls.start({ height: isExpanded ? expandHeight : collapseHeight });
    }, [isExpanded, controls, expandHeight]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // If swiped up fast or dragged up past a threshold -> expand
        if (info.velocity.y < -200 || info.offset.y < -50) {
            setIsExpanded(true);
        } 
        // If swiped down fast or dragged down past a threshold -> collapse
        else if (info.velocity.y > 200 || info.offset.y > 50) {
            setIsExpanded(false);
        } else {
            // Snap back to current state
            controls.start({ height: isExpanded ? expandHeight : collapseHeight });
        }
    };

    return (
        <motion.div
            className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto z-[20]"
            initial={{ height: collapseHeight }}
            animate={controls}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'none' }}
        >
            {/* Grabber Area */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            <div className="px-4 pb-4 h-full overflow-y-auto no-scrollbar" style={{ overscrollBehavior: 'contain' }}>
                {children}
            </div>
        </motion.div>
    );
}
