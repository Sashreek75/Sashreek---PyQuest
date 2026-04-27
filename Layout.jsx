import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import TheOracle from '../ui/TheOracle';
import { UserProvider } from '../../context/UserContext';
import { LearningProvider } from '../../context/LearningContext';

const Layout = () => {
    return (
        <UserProvider>
            <LearningProvider>
                <div className="min-h-screen flex flex-col relative">
                    <Header />
                    <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
                        <Outlet />
                    </main>
                    <TheOracle />
                    <footer className="border-t border-white/5 py-12 text-center text-sm text-muted-foreground bg-black/20">
                        <p>© {new Date().getFullYear()} PyQuest. Level up your Python skills.</p>
                    </footer>
                </div>
            </LearningProvider>
        </UserProvider>
    );
};

export default Layout;
