"use client"

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Flashcard, FlashcardReview } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface FlashcardReviewerProps {
    flashcards: Flashcard[];
    reviews: FlashcardReview[];
    onReviewComplete: (flashcardId: string, easeRating: 'again' | 'hard' | 'good' | 'easy') => void;
    onClose: () => void;
}

export function FlashcardReviewer({ flashcards, reviews, onReviewComplete, onClose }: FlashcardReviewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (flashcards.length === 0) {
        return (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-sm">
                <Icons.CheckSquare className="mx-auto text-green-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-500 mb-6">You have no flashcards due for review right now.</p>
                <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Back to Vault
                </button>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];
    const isFinished = currentIndex >= flashcards.length;

    if (isFinished) {
        return (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckSquare size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Session Complete!</h3>
                <p className="text-gray-500 mb-6 font-medium">You've reviewed {flashcards.length} cards.</p>
                <button onClick={onClose} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    Finish
                </button>
            </div>
        );
    }

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full flex items-center justify-between mb-6 px-4">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <Icons.X size={24} />
                </button>
                <div className="flex-1 mx-6 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${(currentIndex / flashcards.length) * 100}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-gray-500">
                    {currentIndex + 1} / {flashcards.length}
                </span>
            </div>

            {/* Flashcard 3D Container */}
            <div 
                className="w-full h-[200px] perspective-1000 mb-8 cursor-pointer group"
                onClick={() => !isFlipped && setIsFlipped(true)}
            >
                <div className={cn(
                    "w-full h-full transition-all duration-500 transform-style-3d relative",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    
                    {/* FRONT */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-[32px] border-2 border-gray-100 shadow-sm p-6 md:p-8 flex flex-col items-center justify-center text-center group-hover:border-blue-100 transition-colors overflow-y-auto custom-scrollbar">
                        <span className="absolute top-6 left-6 text-[10px] font-black tracking-widest text-blue-500 uppercase">Front</span>
                        <div className="prose prose-sm md:prose-base prose-blue max-w-none w-full">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {currentCard.frontContent}
                            </ReactMarkdown>
                        </div>
                        {!isFlipped && (
                            <div className="absolute bottom-6 text-sm font-bold text-gray-400 flex items-center gap-2 animate-bounce">
                                Click to flip <Icons.Repeat size={16} />
                            </div>
                        )}
                    </div>

                    {/* BACK */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-50 rounded-[32px] border-2 border-blue-100 shadow-sm p-6 md:p-8 flex flex-col items-center justify-center text-center overflow-y-auto custom-scrollbar">
                        <span className="absolute top-6 left-6 text-[10px] font-black tracking-widest text-blue-500 uppercase">Back</span>
                        <div className="prose prose-sm md:prose-base prose-blue max-w-none w-full">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {currentCard.backContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center w-full mt-6">
                <button 
                    onClick={handlePrevious} 
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Icons.ArrowLeft size={18} />
                    Previous
                </button>
                
                <button 
                    onClick={() => setIsFlipped(!isFlipped)} 
                    className="px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                    <Icons.Repeat size={18} />
                    Flip Card
                </button>

                <button 
                    onClick={handleNext} 
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-200"
                >
                    {currentIndex === flashcards.length - 1 ? "Finish" : "Next"}
                    {currentIndex === flashcards.length - 1 ? <Icons.Check size={18} /> : <Icons.ArrowRight size={18} />}
                </button>
            </div>
        </div>
    );
}
