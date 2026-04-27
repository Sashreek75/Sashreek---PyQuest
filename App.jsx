import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedModuleRoute from './components/auth/ProtectedModuleRoute';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ModuleCatalog from './pages/ModuleCatalog';
import LessonViewer from './pages/LessonViewer';
import ProfilePage from './pages/ProfilePage';
import ChallengesPage from './pages/ChallengesPage';
import Codespace from './pages/Codespace';
import OnboardingPage from './pages/OnboardingPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CareerRoadmap from './pages/CareerRoadmap';
import NeuralCircuit from './pages/NeuralCircuit';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/onboarding" element={<OnboardingPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/modules" element={<ModuleCatalog />} />
                            <Route 
                                path="/modules/:moduleId/lesson/:lessonId" 
                                element={
                                    <ProtectedModuleRoute>
                                        <LessonViewer />
                                    </ProtectedModuleRoute>
                                } 
                            />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/challenges" element={<ChallengesPage />} />
                            <Route path="/codespace/:challengeId" element={<Codespace />} />
                            <Route path="/leaderboard" element={<LeaderboardPage />} />
                            <Route path="/roadmap" element={<CareerRoadmap />} />
                            <Route path="/circuit" element={<NeuralCircuit />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
