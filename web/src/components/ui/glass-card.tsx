import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const GlassCard: React.FC<CardProps> = ({ children, className = '', hoverEffect = false, onClick, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative group rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/20 via-primary/5 to-transparent ${className}`}
            onClick={onClick}
        >
            {hoverEffect && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl blur-xl" />
            )}
            <div className="relative h-full w-full bg-slate-950/90 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-xl overflow-hidden group-hover:border-cyan-500/30 transition-colors duration-300">
                {children}
            </div>
        </motion.div>
    );
};
