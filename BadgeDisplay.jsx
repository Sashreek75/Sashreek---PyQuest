import React from 'react';
import badgesData from '../../data/badges.json';
import { Lock, Award } from 'lucide-react';
import Card from '../ui/Card';
import { clsx } from 'clsx';

const BadgeDisplay = ({ earnedBadges }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgesData.map((badge) => {
                const isUnlocked = earnedBadges.includes(badge.id);

                return (
                    <Card
                        key={badge.id}
                        className={clsx("flex flex-col items-center justify-center p-4 text-center transition-all duration-300",
                            !isUnlocked && "opacity-50 grayscale bg-black/20"
                        )}
                    >
                        <div className={clsx("w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                            isUnlocked ? "bg-gradient-to-br from-yellow-400 to-orange-500 scale-100 ring-2 ring-yellow-500/50" : "bg-white/5 scale-90"
                        )}>
                            {isUnlocked ? (
                                <Award className="text-white drop-shadow-md" size={32} />
                            ) : (
                                <Lock className="text-white/20" size={24} />
                            )}
                        </div>

                        <h4 className={clsx("font-bold mb-1", isUnlocked ? "text-white" : "text-muted-foreground")}>
                            {badge.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </Card>
                );
            })}
        </div>
    );
};

export default BadgeDisplay;
