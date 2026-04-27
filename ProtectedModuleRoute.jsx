import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Lock, ArrowLeft } from 'lucide-react';

/**
 * ProtectedModuleRoute - Enforces module gating
 * Users can only access modules if they've completed prerequisites
 */
const ProtectedModuleRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const { moduleId, lessonId } = useParams();
    const { canAccessModule, modules, getModulesByTier, getTierCompletionStatus } = useLearning();
    const location = useLocation();

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if module access is allowed
    if (moduleId && !canAccessModule(moduleId)) {
        const module = modules.find(m => m.id === moduleId);
        const prerequisites = module?.prerequisites || [];
        const requiredBadge = module?.badgeRequired;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-md border-white/10 p-8 text-center">
                    <Lock className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Module Locked</h2>
                    <p className="text-slate-300 mb-6">
                        You haven't met the requirements to access <strong>{module?.title}</strong>
                    </p>

                    {prerequisites.length > 0 && (
                        <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                                Complete These First:
                            </p>
                            <ul className="space-y-2">
                                {prerequisites.map(prereqId => {
                                    const prereqModule = modules.find(m => m.id === prereqId);
                                    return (
                                        <li key={prereqId} className="text-sm text-slate-300 flex items-start gap-2">
                                            <span className="text-amber-400 mt-0.5">•</span>
                                            {prereqModule?.title}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {requiredBadge && (
                        <div className="bg-purple-500/10 rounded-lg p-4 mb-6 text-left border border-purple-500/20">
                            <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                                Required Badge:
                            </p>
                            <p className="text-sm text-slate-300">
                                Earn the <strong>{requiredBadge}</strong> badge to unlock this module
                            </p>
                        </div>
                    )}

                    <Button 
                        variant="primary" 
                        onClick={() => window.history.back()}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </Button>
                </Card>
            </div>
        );
    }

    return children;
};

export default ProtectedModuleRoute;
