import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Award, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

/**
 * Quiz Component - Validates answers properly and provides feedback
 * This is the REAL quiz system - answers must be correct to pass
 */
const QuizComponent = ({ quiz, onComplete, module, lesson }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <Card className="p-6 border-white/10 bg-yellow-500/5">
                <p className="text-yellow-300">No quiz available for this lesson</p>
            </Card>
        );
    }

    const questions = quiz.questions;
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
    const selectedAnswerIndex = selectedAnswers[currentQuestionIndex];
    const isCorrect = selectedAnswerIndex === currentQuestion.correct;

    // Calculate score (only correct answers count)
    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct) {
                correctCount++;
            }
        });
        const percentage = Math.round((correctCount / questions.length) * 100);
        return { correctCount, percentage };
    };

    const handleSelectAnswer = (answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: answerIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        // Check if all questions are answered
        const allAnswered = Object.keys(selectedAnswers).length === questions.length;
        
        if (!allAnswered) {
            alert('Please answer all questions before submitting');
            return;
        }

        const { correctCount, percentage } = calculateScore();
        setScore(percentage);
        setShowResults(true);
    };

    const handleRetake = () => {
        setSelectedAnswers({});
        setShowResults(false);
        setCurrentQuestionIndex(0);
        setScore(0);
    };

    const handleComplete = () => {
        const { percentage } = calculateScore();
        // Only allow completion with 75%+ (enforced mastery learning)
        if (percentage >= 75) {
            onComplete(percentage);
        } else {
            alert(`Score: ${percentage}%. You need 75% to pass. Keep studying!`);
        }
    };

    // Results Screen
    if (showResults) {
        const { correctCount, percentage } = calculateScore();
        const passed = percentage >= 75;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                {/* Score Display */}
                <Card className="p-8 border-white/10 text-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                    >
                        {passed ? (
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                        ) : (
                            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                        )}
                    </motion.div>

                    <h3 className="text-3xl font-bold mb-2">
                        {correctCount}/{questions.length} Correct
                    </h3>
                    <p className="text-5xl font-black text-primary mb-4">
                        {percentage}%
                    </p>

                    {passed ? (
                        <p className="text-emerald-300 text-lg font-semibold mb-4">
                            ✓ Mastery achieved! You understand this topic.
                        </p>
                    ) : (
                        <p className="text-amber-300 text-lg font-semibold mb-4">
                            Review the material and try again. You need 75% to pass.
                        </p>
                    )}
                </Card>

                {/* Answer Review */}
                <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg">Answer Review</h4>
                    {questions.map((q, idx) => {
                        const userAnswer = selectedAnswers[idx];
                        const userCorrect = userAnswer === q.correct;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-4 rounded-lg border ${
                                    userCorrect
                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {userCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white mb-2">
                                            Q{idx + 1}: {q.question}
                                        </p>
                                        <p className={`text-sm mb-2 ${
                                            userCorrect ? 'text-emerald-300' : 'text-red-300'
                                        }`}>
                                            Your answer: <strong>{q.options[userAnswer]}</strong>
                                        </p>
                                        {!userCorrect && (
                                            <p className="text-sm text-emerald-300">
                                                Correct answer: <strong>{q.options[q.correct]}</strong>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={handleRetake}
                        variant="outline"
                        className="px-6"
                    >
                        <RotateCcw size={16} className="mr-2" />
                        Try Again
                    </Button>
                    {passed && (
                        <Button
                            onClick={handleComplete}
                            variant="primary"
                            className="px-6"
                        >
                            <Award size={16} className="mr-2" />
                            Complete Lesson
                        </Button>
                    )}
                </div>
            </motion.div>
        );
    }

    // Quiz Screen
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                        {Object.keys(selectedAnswers).length}/{questions.length} answered
                    </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-primary to-amber-500"
                    />
                </div>
            </div>

            {/* Question */}
            <Card className="p-6 border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                <h3 className="text-xl font-bold text-white mb-6">
                    {currentQuestion.question}
                </h3>

                {/* Answer Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSelectAnswer(idx)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium
                                ${selectedAnswerIndex === idx
                                    ? 'border-primary/50 bg-primary/10 text-primary'
                                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-primary/30 hover:bg-primary/5'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                    ${selectedAnswerIndex === idx
                                        ? 'border-primary/50 bg-primary/20'
                                        : 'border-white/20'
                                    }
                                `}>
                                    {selectedAnswerIndex === idx && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    )}
                                </div>
                                <span>{option}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="px-6"
                >
                    ← Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!isAnswered}
                        variant="primary"
                        className="px-8"
                    >
                        Submit Quiz
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={!isAnswered}
                        variant="primary"
                        className="px-6"
                    >
                        Next →
                    </Button>
                )}
            </div>

            {/* Question Indicator */}
            <div className="flex gap-1 justify-center">
                {questions.map((_, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                            idx === currentQuestionIndex
                                ? 'bg-primary w-8'
                                : idx in selectedAnswers
                                ? 'bg-primary/50 w-2'
                                : 'bg-white/10 w-2'
                        }`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default QuizComponent;
