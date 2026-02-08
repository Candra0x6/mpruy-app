/**
 * #file:ui
 * NeonButton Component
 * 
 * Custom neon-style button with glow effects.
 * Supports multiple variants and sizes with motion animations.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    variant?: 'cyan' | 'default';
    size?: 'sm' | 'md' | 'lg';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ children, className = '', variant = 'default', size = 'md', onClick, ...props }) => {
    const baseStyle = "relative rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group flex items-center justify-center gap-2";

    const sizeStyles = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2 text-base",
        lg: "px-8 py-3 text-lg"
    };

    const variantStyles = {
        cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:border-cyan-400",
        default: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:border-cyan-400"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            onClick={onClick}
        >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            {children}
        </motion.button>
    );
};
