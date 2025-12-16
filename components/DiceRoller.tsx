import React, { useState, useEffect } from 'react';
import type { DieItem, DiceResult, DiceCategory } from '../types';
import { EDUCATIONS, SEMESTERS } from '../constants';
import Card from './ui/Card';
import Dice from './ui/Dice';

interface DiceRollerProps {
    onRoll: () => void;
    onSingleRoll: (category: DiceCategory) => void;
    result: DiceResult | null;
    selectedEducation: string;
    onEducationChange: (education: string) => void;
    selectedSemester: string;
    onSemesterChange: (semester: string) => void;
    duration: string;
    onDurationChange: (duration: string) => void;
    groupSize: string;
    onGroupSizeChange: (size: string) => void;
    keywords: string;
    onKeywordsChange: (keywords: string) => void;
}

const ResultCard: React.FC<{ 
    title: string; 
    item: DieItem; 
    color: string; 
    category: DiceCategory;
    isRolling: boolean;
    onReroll: (category: DiceCategory) => void;
}> = ({ title, item, color, category, isRolling, onReroll }) => (
    <div className={`relative border-l-4 ${color} pl-4 pr-10 py-4`}>
        <h3 className="text-lg font-semibold text-[#464646]">{title}</h3>
        <div className="mt-2">
            <p className="text-2xl font-bold text-gray-900">{item.emoji} {item.title}</p>
            <p className="text-[#464646] mt-1">{item.description}</p>
            <p className="text-sm text-gray-500 mt-2 italic">👉🏼 {item.example}</p>
        </div>
        <button 
            onClick={() => onReroll(category)}
            disabled={isRolling}
            className="absolute top-3 right-2 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            aria-label={`Slå terning for ${title} om`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
);

const DiceRoller: React.FC<DiceRollerProps> = ({ 
    onRoll, 
    onSingleRoll, 
    result, 
    selectedEducation, 
    onEducationChange,
    selectedSemester,
    onSemesterChange,
    duration,
    onDurationChange,
    groupSize,
    onGroupSizeChange,
    keywords,
    onKeywordsChange
}) => {
    const [rollingCategory, setRollingCategory] = useState<DiceCategory | 'all' | null>(null);
    const [showResults, setShowResults] = useState(false);

    // Timer State
    const [timerInput, setTimerInput] = useState<string>('10');
    const [timeLeft, setTimeLeft] = useState<number>(600); // Default 10 min in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    // Visibility State
    const [hasTimerStarted, setHasTimerStarted] = useState(false);

    useEffect(() => {
      if (result) {
        setShowResults(true);
      }
    }, [result]);

    // Timer Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const handleRollClick = () => {
        if (rollingCategory) return;

        setShowResults(false);
        setRollingCategory('all');
        onRoll();

        setTimeout(() => {
            setRollingCategory(null);
        }, 1500); // Animation duration
    };

    const handleSingleRoll = (category: DiceCategory) => {
        if(rollingCategory) return;
        setRollingCategory(category);
        onSingleRoll(category);

        setTimeout(() => {
            setRollingCategory(null);
        }, 1500); // Animation duration
    }

    // Timer Handlers
    const handleTimerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        
        // Remove non-numeric characters
        val = val.replace(/[^0-9]/g, '');
        
        // Handle max limit (60)
        if (val !== '') {
            const num = parseInt(val, 10);
            if (num > 60) val = '60';
        }

        setTimerInput(val);
        
        // Update countdown preview if not running
        if (!isTimerRunning && val !== '') {
            setTimeLeft(parseInt(val, 10) * 60);
        } else if (!isTimerRunning && val === '') {
            setTimeLeft(0);
        }
    };

    const toggleTimer = () => {
        if (!isTimerRunning) {
            setHasTimerStarted(true);
        }
        setIsTimerRunning(!isTimerRunning);
    };
    
    const resetTimer = () => {
        setIsTimerRunning(false);
        setHasTimerStarted(false);
        const mins = parseInt(timerInput, 10) || 0;
        setTimeLeft(mins * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Check if required fields in Step 2 are filled
    const isStep2Complete = selectedEducation && selectedSemester && duration && groupSize;

    return (
        <Card>
            <h2 className="text-2xl font-bold text-[#464646] mb-4">Lad eksperimentet begynde!</h2>
            
            <p className="text-[#1F7A75] mb-4 font-bold text-xl">Step 1: Vælg tid og start</p>

            {/* Countdown Timer Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
                
                {/* Timer Display/Input Container */}
                <div className="relative mb-2">
                    <div className="flex items-center justify-center text-5xl sm:text-6xl font-mono font-bold text-[#1F7A75] tracking-widest bg-white px-12 py-6 rounded-xl border border-gray-200 shadow-inner min-w-[300px]">
                        {!hasTimerStarted ? (
                            <div className="flex items-center justify-center">
                                <input
                                    type="number"
                                    value={timerInput}
                                    onChange={handleTimerInputChange}
                                    min="1"
                                    max="60"
                                    className="w-[3ch] text-center bg-transparent border-none focus:ring-0 p-0 text-[#1F7A75] placeholder-[#1F7A75]/50 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="10"
                                    aria-label="Sæt minutter"
                                />
                                <span>:00</span>
                            </div>
                        ) : (
                            <span>{formatTime(timeLeft)}</span>
                        )}
                    </div>
                </div>

                {/* Helper text for max time - only shown when editing */}
                {!hasTimerStarted ? (
                     <p className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-wider">(max 60 min)</p>
                ) : (
                    // Spacer to keep layout relatively stable or just margin
                    <div className="mb-6"></div>
                )}

                {/* Control Buttons */}
                <div className="flex gap-4">
                     <button
                        onClick={toggleTimer}
                        disabled={timeLeft === 0 && !isTimerRunning}
                        className={`px-8 py-3 rounded-full text-white font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 min-w-[120px] flex justify-center items-center ${
                            isTimerRunning 
                                ? 'bg-yellow-500 hover:bg-yellow-600' 
                                : 'bg-[#1F7A75] hover:bg-[#165955] disabled:bg-gray-300 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed'
                        }`}
                    >
                        {isTimerRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="px-8 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-600 font-bold text-lg hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-all shadow-sm hover:shadow-md"
                    >
                        Nulstil
                    </button>
                </div>
            </div>

            {/* Step 2 Section */}
            {hasTimerStarted && (
                <div className="animate-fade-in">
                    <p className="text-[#1F7A75] mb-4 font-bold text-xl">Step 2: Udfyld felterne</p>

                    {/* Education Selection Dropdown and Details */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="education-select" className="block text-lg font-bold text-gray-700 mb-2">
                                    Professionshøjskole- og erhvervsakademi
                                </label>
                                <select
                                    id="education-select"
                                    value={selectedEducation}
                                    onChange={(e) => onEducationChange(e.target.value)}
                                    className="block w-full pl-3 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-[#1F7A75] focus:border-[#1F7A75] rounded-md bg-white border shadow-sm text-[#464646]"
                                >
                                    <option value="" disabled>Vælg uddannelse...</option>
                                    {EDUCATIONS.map((edu) => (
                                        <option key={edu} value={edu}>
                                            {edu}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="semester-select" className="block text-lg font-bold text-gray-700 mb-2">
                                    Semester
                                </label>
                                <select
                                    id="semester-select"
                                    value={selectedSemester}
                                    onChange={(e) => onSemesterChange(e.target.value)}
                                    className="block w-full pl-3 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-[#1F7A75] focus:border-[#1F7A75] rounded-md bg-white border shadow-sm text-[#464646]"
                                >
                                    <option value="" disabled>Vælg semester...</option>
                                    {SEMESTERS.map((sem) => (
                                        <option key={sem} value={sem}>
                                            {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="keywords" className="block text-lg font-bold text-gray-700 mb-2">
                                Nøgleord / Tema (valgfri)
                            </label>
                            <input
                                type="text"
                                id="keywords"
                                value={keywords}
                                onChange={(e) => onKeywordsChange(e.target.value)}
                                placeholder="Fx anatomi, konfliktløsning eller bæredygtighed"
                                className="block w-full px-3 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1F7A75] focus:border-[#1F7A75] bg-white text-[#464646]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label htmlFor="duration" className="block text-lg font-bold text-gray-700 mb-2">
                                    Varighed (min)
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => onDurationChange(e.target.value)}
                                    placeholder="Fx 45"
                                    className="block w-full px-3 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1F7A75] focus:border-[#1F7A75] bg-white text-[#464646]"
                                />
                            </div>
                            <div>
                                <label htmlFor="groupSize" className="block text-lg font-bold text-gray-700 mb-2">
                                    Antal studerende
                                </label>
                                <input
                                    type="number"
                                    id="groupSize"
                                    value={groupSize}
                                    onChange={(e) => onGroupSizeChange(e.target.value)}
                                    placeholder="Fx 25"
                                    className="block w-full px-3 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1F7A75] focus:border-[#1F7A75] bg-white text-[#464646]"
                                />
                            </div>
                        </div>

                        <p className="text-base text-gray-500 mt-6">
                            Når du vælger en uddannelse og angiver rammerne, genereres scenarier med udgangspunkt i den pågældende studieordning.
                        </p>
                    </div>
                </div>
            )}

            {/* Step 3 Section */}
            {hasTimerStarted && isStep2Complete && (
                <div className="animate-fade-in">
                    <p className="text-[#1F7A75] mb-4 font-bold text-xl">Step 3: Slå med terningerne</p>

                    {!result && (
                        <p className="text-[#464646] mb-6">Slå med terningerne for at få en kombination af en didaktisk metode, en digital teknologi og en analog teknologi til dit næste undervisningsforløb.</p>
                    )}

                    <div className="flex justify-center items-center gap-4 sm:gap-6 my-8">
                        <Dice 
                            isRolling={rollingCategory === 'all' || rollingCategory === 'didactic'} 
                            emoji={result?.didactic.emoji} 
                            color="bg-blue-100 text-[#009FDA]"
                        />
                        <Dice 
                            isRolling={rollingCategory === 'all' || rollingCategory === 'digital'} 
                            emoji={result?.digital.emoji}
                            color="bg-yellow-50 text-[#FFBC3D]"
                        />
                        <Dice 
                            isRolling={rollingCategory === 'all' || rollingCategory === 'analog'} 
                            emoji={result?.analog.emoji}
                            color="bg-green-50 text-[#009640]"
                        />
                    </div>

                    <button
                        onClick={handleRollClick}
                        disabled={!!rollingCategory}
                        className="w-full bg-[#1F7A75] text-white font-semibold py-3 px-4 rounded-md hover:bg-[#165955] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F7A75] transition-colors duration-200 disabled:bg-[#7BBFB9] disabled:cursor-not-allowed"
                    >
                        {rollingCategory === 'all' ? 'Ruller...' : (result ? 'Slå alle igen' : 'Slå med terningerne')}
                    </button>

                    {showResults && result && (
                        <div className="mt-8 space-y-6 animate-fade-in">
                            <ResultCard title="Didaktisk Metode" item={result.didactic} color="border-[#009FDA]" category="didactic" onReroll={handleSingleRoll} isRolling={!!rollingCategory} />
                            <ResultCard title="Digital Teknologi" item={result.digital} color="border-[#FFBC3D]" category="digital" onReroll={handleSingleRoll} isRolling={!!rollingCategory} />
                            <ResultCard title="Analog Teknologi" item={result.analog} color="border-[#009640]" category="analog" onReroll={handleSingleRoll} isRolling={!!rollingCategory} />
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </Card>
    );
};

export default DiceRoller;