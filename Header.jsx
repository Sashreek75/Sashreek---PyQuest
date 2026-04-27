import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, User, LogOut, Menu, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
    const { user: gamifiedUser } = useUser();
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const NavLinks = ({ mobile = false }) => (
        <>
            <Link to="/modules" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-all ${mobile ? 'block py-4 text-white border-b border-white/5' : 'text-slate-400 hover:scale-105'}`}>
                Lessons
            </Link>
            <Link to="/challenges" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-all ${mobile ? 'block py-4 text-white border-b border-white/5' : 'text-slate-400 hover:scale-105'}`}>
                Practice
            </Link>
            <Link to="/leaderboard" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-all ${mobile ? 'block py-4 text-white border-b border-white/5' : 'text-slate-400 hover:scale-105'}`}>
                Leaderboard
            </Link>
            <Link to="/roadmap" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-all ${mobile ? 'block py-4 text-white border-b border-white/5' : 'text-slate-400 hover:scale-105'}`}>
                My Path
            </Link>
            <Link to="/circuit" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest text-primary hover:text-white transition-all flex items-center gap-2 ${mobile ? 'py-4 border-b border-white/5' : 'hover:scale-105'}`}>
                <span className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                AI Challenge
            </Link>
        </>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#000814]/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <button 
                        className="md:hidden text-white p-1 hover:bg-white/10 rounded-md"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-white group">
                        <div className="size-8 rounded bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                            P
                        </div>
                        <span className="text-white group-hover:text-primary transition-colors hidden sm:inline-block">PyQuest</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <NavLinks />
                </nav>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-500">
                            <Trophy size={14} />
                            <span className="hidden sm:inline-block">{gamifiedUser.xp} XP</span>
                        </span>
                        <span className="w-px h-3 bg-white/10" />
                        <span className="flex items-center gap-1.5 text-xs font-medium text-orange-500">
                            <span role="img" aria-label="fire">🔥</span>
                            <span className="hidden sm:inline-block">{gamifiedUser.streak}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/profile">
                            <Button variant="ghost" size="sm" className="rounded-full size-10 overflow-hidden p-0 border border-white/10 hover:border-primary/50 transition-all">
                                {gamifiedUser.avatarUrl ? (
                                    <img src={gamifiedUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-slate-300" />
                                )}
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex rounded-full size-9 p-0 hover:bg-red-500/10 text-slate-300 hover:text-red-400"
                        >
                            <LogOut size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-[#000814] w-[80%] max-w-sm border-r border-white/10 h-screen overflow-y-auto flex flex-col md:hidden"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <div className="size-8 rounded bg-primary flex items-center justify-center text-black">P</div>
                                PyQuest
                            </h2>
                            <button className="p-2 text-slate-400 hover:bg-white/10 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 p-6 flex flex-col">
                            <NavLinks mobile={true} />
                        </div>
                        <div className="p-6 border-t border-white/10">
                            <Button variant="outline" className="w-full gap-2 text-rose-400 hover:text-rose-300 border-rose-500/20 hover:bg-rose-500/10" onClick={handleLogout}>
                                <LogOut size={18} /> Sign Out
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;
