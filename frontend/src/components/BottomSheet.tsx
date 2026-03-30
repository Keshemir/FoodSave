'use client';

import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BottomSheetProps {
    children: React.ReactNode;
    state: 'collapsed' | 'peek' | 'expanded';
    onStateChange: (state: 'collapsed' | 'peek' | 'expanded') => void;
}

export default function BottomSheet({ children, state, onStateChange }: BottomSheetProps) {
    const controls = useAnimation();

    const heights = {
        collapsed: 40, // Just the grabber area
        peek: 160,     // Grabber + one row of content
        expanded: typeof window !== 'undefined' ? window.innerHeight * 0.7 : 500
    };

    useEffect(() => {
        controls.start({ height: heights[state], opacity: 1 });
    }, [state, controls, heights.expanded]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // Drag up
        if (info.velocity.y < -200 || info.offset.y < -50) {
            if (state === 'collapsed') onStateChange('peek');
            else onStateChange('expanded');
        } 
        // Drag down
        else if (info.velocity.y > 200 || info.offset.y > 50) {
            if (state === 'expanded') onStateChange('peek');
            else onStateChange('collapsed');
        } else {
            // Snap back
            controls.start({ height: heights[state], opacity: 1 });
        }
    };

    return (
        <motion.div
            className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto z-[20]"
            initial={{ height: heights[state] }}
            animate={controls}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'none', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {/* Grabber Area */}
            <div className="w-full h-[40px] flex items-center justify-center cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            <div className="px-4 pb-4 h-full overflow-y-auto no-scrollbar" style={{ overscrollBehavior: 'contain' }}>
                {children}
            </div>
        </motion.div>
    );
}
