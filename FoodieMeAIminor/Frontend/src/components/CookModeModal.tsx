import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flame,
  Timer,
  Sparkles,
  Utensils,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types';

interface CookModeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({ recipe, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<any>(null);

  if (!recipe) return null;

  const instructions = recipe.instructions || [];
  const totalSteps = instructions.length;
  const currentStep = instructions[currentStepIndex] || {
    stepNumber: 1,
    title: 'Preparation',
    instruction: 'Review all measured ingredients and cookware before starting.',
  };

  // Initialize or update timer when step changes
  useEffect(() => {
    if (currentStep?.timerMinutes) {
      setTimerSecondsLeft(currentStep.timerMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimerSecondsLeft(null);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Handle countdown timer tick
  useEffect(() => {
    if (isTimerRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            playTimerAlarm();
            return 0;
          }
          return prev !== null ? prev - 1 : 0;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextStep();
      } else if (e.key === 'ArrowLeft') {
        goToPrevStep();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && timerSecondsLeft !== null) {
        e.preventDefault();
        setIsTimerRunning(!isTimerRunning);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, isTimerRunning, timerSecondsLeft]);

  const playTimerAlarm = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio Context error', e);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsFinished(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        id="interactive-cook-mode-modal"
        className="bg-[#3d3a35] text-[#fcfaf7] rounded-3xl max-w-3xl w-full border border-white/15 shadow-2xl overflow-hidden flex flex-col min-h-[550px] max-h-[92vh]"
      >
        {/* Top Cook Mode Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#d68c6a] flex items-center justify-center text-white font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#d68c6a] uppercase tracking-wider">
                Interactive Kitchen Cook Companion
              </div>
              <h3 className="text-sm font-bold text-[#fcfaf7] truncate max-w-xs sm:max-w-md">
                {recipe.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] transition-colors"
              title={soundEnabled ? 'Timer Sound On' : 'Timer Sound Off'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              id="exit-cook-mode-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="h-1.5 w-full bg-black/30">
          <div
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            className="h-full bg-[#d68c6a] transition-all duration-300"
          />
        </div>

        {/* Main Cooking Stage */}
        <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between overflow-y-auto">
          {!isFinished ? (
            <div className="space-y-6">
              {/* Step Counter Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d68c6a]/20 text-[#f6e3d9] border border-[#d68c6a]/40">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>

                {currentStep.equipment && (
                  <span className="text-xs font-medium bg-white/10 text-[#d8d2c7] px-3 py-1 rounded-full border border-white/10">
                    Tool: {currentStep.equipment}
                  </span>
                )}
              </div>

              {/* Step Title & Instruction */}
              <div>
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#fcfaf7] tracking-tight mb-4">
                  {currentStep.title}
                </h2>
                <p className="text-base sm:text-xl text-[#f2eee9] leading-relaxed font-light">
                  {currentStep.instruction}
                </p>
              </div>

              {/* Chef Tip Callout */}
              {currentStep.chefTip && (
                <div className="p-4 rounded-2xl bg-[#d68c6a]/15 border border-[#d68c6a]/30 text-[#f6e3d9] text-sm flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-[#d68c6a] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#f6e3d9] block text-xs uppercase tracking-wider mb-0.5">
                      Chef's Technique Tip
                    </span>
                    <span className="text-[#f2eee9] text-xs sm:text-sm">{currentStep.chefTip}</span>
                  </div>
                </div>
              )}

              {/* Step Countdown Timer (if present) */}
              {timerSecondsLeft !== null && (
                <div className="p-4 rounded-2xl bg-black/25 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${
                        timerSecondsLeft === 0
                          ? 'bg-rose-600 text-white animate-pulse'
                          : isTimerRunning
                          ? 'bg-[#d68c6a] text-white'
                          : 'bg-white/10 text-[#d8d2c7]'
                      }`}
                    >
                      <Timer className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-[#d8d2c7] uppercase font-semibold">Active Step Timer</div>
                      <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                        {formatTimer(timerSecondsLeft)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs ${
                        isTimerRunning
                          ? 'bg-[#d68c6a] hover:bg-[#b46039] text-white'
                          : 'bg-[#889e81] hover:bg-[#6b8265] text-white'
                      }`}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" /> Pause Timer
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" /> Start Timer
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTimerSecondsLeft((currentStep.timerMinutes || 5) * 60);
                        setIsTimerRunning(false);
                      }}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] transition-colors"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Finished Celebration View */
            <div className="text-center py-10 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-[#889e81] text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#fcfaf7]">
                Bon Appétit! Recipe Complete
              </h2>
              <p className="text-[#d8d2c7] text-sm sm:text-base max-w-md mx-auto">
                You've successfully created <strong className="text-[#f6e3d9]">{recipe.title}</strong> using
                your leftover ingredients.
              </p>
              {recipe.chefSecret && (
                <div className="max-w-lg mx-auto p-4 rounded-2xl bg-[#d68c6a]/15 border border-[#d68c6a]/30 text-[#f6e3d9] text-xs text-left">
                  <span className="font-bold text-[#f6e3d9] block mb-1">Final Chef Plating Secret:</span>
                  <span>{recipe.chefSecret}</span>
                </div>
              )}
              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentStepIndex(0);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f2eee9] text-xs font-semibold"
                >
                  Restart Recipe
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#d68c6a] hover:bg-[#b46039] text-white text-xs font-bold shadow-lg"
                >
                  Finish & Return to Recipe Card
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span>Previous Step</span>
            </button>

            <span className="text-xs text-[#d8d2c7]/60 hidden sm:inline">
              Tip: Use Left/Right Arrow keys to navigate
            </span>

            {!isFinished && (
              <button
                onClick={goToNextStep}
                className="px-6 py-2.5 rounded-xl bg-[#d68c6a] hover:bg-[#b46039] text-white text-xs font-bold flex items-center transition-all shadow-md"
              >
                <span>{currentStepIndex === totalSteps - 1 ? 'Complete Cooking' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
