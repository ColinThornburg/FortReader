
import React from 'react';

interface NavButtonProps {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, isActive, children }) => {
    const activeClasses = 'bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-md';
    const inactiveClasses = 'bg-transparent text-slate-300 hover:bg-slate-700/50';

    return (
        <button
            onClick={onClick}
            className={`px-4 sm:px-6 py-2 rounded-full font-display text-lg tracking-wider transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};

export default NavButton;
