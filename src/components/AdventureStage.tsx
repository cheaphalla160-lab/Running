import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Volume2, CheckCircle2, Sparkles, Flag, ArrowRight } from 'lucide-react';
import {
  AdventureStep,
  DestinationOption,
  GearId,
  buildAdventureSteps,
} from '../data/gameData';
import {
  ActionVisualSvg,
  AnimalAvatarSvg,
  DoctorBunnyRunnerSvg,
  ImageWithFallback,
} from './Illustrations';
import { soundEngine } from '../audio/soundEngine';

interface AdventureStageProps {
  destination: DestinationOption;
  packedGear: GearId[];
  initialScore: number;
  onComplete: (result: {
    finalScore: number;
    correctAttempts: number;
    totalAttempts: number;
    masteredWords: string[];
  }) => void;
}

// Position & elevation coordinates for the 6 checkpoints along the hill path
const STAGE_POSITIONS: { leftPct: number; bottomPct: number; pose: 'flat' | 'up' | 'down' | 'exercise' | 'finish' }[] = [
  { leftPct: 10, bottomPct: 22, pose: 'flat' },
  { leftPct: 25, bottomPct: 22, pose: 'flat' },
  { leftPct: 43, bottomPct: 42, pose: 'up' },
  { leftPct: 58, bottomPct: 58, pose: 'exercise' },
  { leftPct: 74, bottomPct: 38, pose: 'down' },
  { leftPct: 88, bottomPct: 22, pose: 'finish' },
];

export const AdventureStage: React.FC<AdventureStageProps> = ({
  destination,
  packedGear,
  initialScore,
  onComplete,
}) => {
  const [steps] = useState<AdventureStep[]>(() => buildAdventureSteps(destination.id));
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(initialScore);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [boostCount, setBoostCount] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'retry';
    message: string;
  } | null>(null);
  const [stepCleared, setStepCleared] = useState(false);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [wrongOptionIds, setWrongOptionIds] = useState<string[]>([]);

  const advanceTimerRef = useRef<number | null>(null);
  const currentStep = steps[stepIndex];
  const currentPos = STAGE_POSITIONS[stepIndex] || STAGE_POSITIONS[0];

  const hasShoes = packedGear.includes('shoes');
  const hasCap = packedGear.includes('cap');

  // Auto-speak each stage's English prompt when entering
  useEffect(() => {
    if (!currentStep) return;
    const t = window.setTimeout(() => {
      soundEngine.speakWord(currentStep.speechPrompt, 0.88);
    }, 250);
    return () => window.clearTimeout(t);
  }, [stepIndex, currentStep]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const advanceToNext = useCallback(
    (nextScore: number, nextCorrect: number, nextTotal: number, nextMastered: string[]) => {
      if (stepIndex + 1 >= steps.length) {
        soundEngine.playVictory();
        soundEngine.speakWord('Congratulations! Great running and exercise!', 0.9);
        advanceTimerRef.current = window.setTimeout(() => {
          onComplete({
            finalScore: nextScore,
            correctAttempts: nextCorrect,
            totalAttempts: nextTotal,
            masteredWords: nextMastered,
          });
        }, 1250);
      } else {
        advanceTimerRef.current = window.setTimeout(() => {
          setStepIndex((prev) => prev + 1);
          setBoostCount(0);
          setFeedback(null);
          setStepCleared(false);
          setWrongOptionIds([]);
        }, 1050);
      }
    },
    [stepIndex, steps.length, onComplete]
  );

  const handleOptionSelect = (option: NonNullable<AdventureStep['options']>[number]) => {
    if (stepCleared) return;
    soundEngine.unlockAudio();

    const nextTotal = totalAttempts + 1;
    setTotalAttempts(nextTotal);

    if (option.isCorrect) {
      soundEngine.playCorrect();
      soundEngine.speakWord(`Great job! ${option.label}!`, 0.9);
      const bonus = wrongOptionIds.length === 0 ? 30 : 20;
      const nextScore = score + bonus;
      const nextCorrect = correctAttempts + 1;
      const nextMastered = masteredWords.includes(currentStep.targetWord)
        ? masteredWords
        : [...masteredWords, currentStep.targetWord];

      setScore(nextScore);
      setCorrectAttempts(nextCorrect);
      setMasteredWords(nextMastered);
      setStepCleared(true);
      setFeedback({
        type: 'success',
        message: `Awesome! "${option.label}" (${option.chinese}) +${bonus} pts!`,
      });

      advanceToNext(nextScore, nextCorrect, nextTotal, nextMastered);
    } else {
      soundEngine.playWrong();
      soundEngine.speakWord(`Oops, that is ${option.label}. Listen again: ${currentStep.targetWord}`, 0.88);
      if (!wrongOptionIds.includes(option.id)) {
        setWrongOptionIds((prev) => [...prev, option.id]);
      }
      setFeedback({
        type: 'retry',
        message: `That is "${option.label}" (${option.chinese}). Try listening again!`,
      });
    }
  };

  const handleBoostTap = useCallback(() => {
    if (!currentStep || currentStep.type !== 'rhythm_boost' || stepCleared) return;
    soundEngine.unlockAudio();

    const target = currentStep.boostTargetCount || 5;
    const nextCount = boostCount + 1;
    setBoostCount(nextCount);
    soundEngine.playHop();

    if (nextCount === 1 || nextCount === 3) {
      soundEngine.speakWord(currentStep.boostActionLabel || currentStep.targetWord, 0.95);
    }

    if (nextCount >= target) {
      soundEngine.playCorrect();
      soundEngine.speakWord(`Super ${currentStep.targetWord}!`, 0.9);
      const nextScore = score + 35;
      const nextCorrect = correctAttempts + 1;
      const nextTotal = totalAttempts + 1;
      const nextMastered = masteredWords.includes(currentStep.targetWord)
        ? masteredWords
        : [...masteredWords, currentStep.targetWord];

      setScore(nextScore);
      setCorrectAttempts(nextCorrect);
      setTotalAttempts(nextTotal);
      setMasteredWords(nextMastered);
      setStepCleared(true);
      setFeedback({
        type: 'success',
        message: `Woohoo! "${currentStep.targetWord}" boost complete! +35 pts!`,
      });

      advanceToNext(nextScore, nextCorrect, nextTotal, nextMastered);
    }
  }, [
    currentStep,
    stepCleared,
    boostCount,
    score,
    correctAttempts,
    totalAttempts,
    masteredWords,
    advanceToNext,
  ]);

  // Keyboard support for rhythm boost (Space) and quick replay (R)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentStep?.type === 'rhythm_boost' && !stepCleared) {
        e.preventDefault();
        handleBoostTap();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentStep, stepCleared, handleBoostTap]);

  return (
    <div className="space-y-5">
      {/* Compact Live HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 px-5 py-3.5">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-slate-900">{destination.title}</span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-slate-600">
            Stage {stepIndex + 1} of {steps.length}
          </span>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-emerald-700 font-semibold hidden sm:inline">
            Target: {currentStep.targetWord}
          </span>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Progress</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {Math.round(((stepIndex + (stepCleared ? 1 : 0)) / steps.length) * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Score</span>
            <span className="font-mono text-lg font-bold text-emerald-700 tabular-nums">
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Storybook Hill & Track Stage */}
      <div className="relative w-full h-[300px] sm:h-[340px] rounded-2xl border border-slate-200 overflow-hidden bg-sky-100 shadow-sm">
        <ImageWithFallback
          src={destination.image}
          alt={destination.title}
          fallbackTitle={destination.title}
          className="w-full h-full object-cover opacity-80"
        />

        {/* Soft bottom contrast gradient for clean hill readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-sky-900/10 to-transparent" />

        {/* Rolling Hills SVG Terrain Path */}
        <svg
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-[190px] pointer-events-none"
          aria-hidden="true"
        >
          {/* Back grassy hill */}
          <path
            d="M0 190 L290 190 C380 190 460 72 580 72 C690 72 760 190 860 190 L1000 190 L1000 260 L0 260 Z"
            fill="#22C55E"
            opacity="0.92"
          />
          {/* Track surface following the hill */}
          <path
            d="M0 206 L290 206 C385 206 465 92 580 92 C695 92 765 206 860 206 L1000 206"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M0 206 L290 206 C385 206 465 92 580 92 C695 92 765 206 860 206 L1000 206"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeDasharray="14 14"
            strokeLinecap="round"
          />
        </svg>

        {/* Checkpoint Signs along the hill */}
        <div className="hidden sm:flex items-center gap-1.5 absolute left-[41%] bottom-[52%] bg-white/95 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-800 shadow-sm pointer-events-none">
          <span>run up hills</span>
          <ArrowRight className="w-3.5 h-3.5 -rotate-45 text-emerald-600" />
        </div>
        <div className="hidden sm:flex items-center gap-1.5 absolute left-[69%] bottom-[49%] bg-white/95 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-sky-800 shadow-sm pointer-events-none">
          <span>run down hills</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-45 text-sky-600" />
        </div>

        {/* Finish Arch */}
        <div className="absolute right-[4%] bottom-[19%] flex flex-col items-center pointer-events-none">
          <Flag className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow" />
          <span className="text-[11px] font-bold text-white bg-slate-900/75 px-2 py-0.5 rounded mt-0.5">
            Finish
          </span>
        </div>

        {/* Animal Friend waiting at current stage */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            soundEngine.speakWord(`${currentStep.animalName} says go doctor!`, 0.9);
          }}
          title={`Hear ${currentStep.animalName}`}
          className="absolute right-[14%] sm:left-[calc(var(--friend-x))] bottom-[20%] flex flex-col items-center cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
          style={
            {
              '--friend-x': `${Math.min(currentPos.leftPct + 8, 86)}%`,
              bottom: `${Math.max(currentPos.bottomPct - 2, 18)}%`,
            } as React.CSSProperties
          }
        >
          <div className="bg-white/95 rounded-lg px-2 py-0.5 text-[11px] font-bold text-slate-800 shadow-sm mb-1">
            {currentStep.animalName}
          </div>
          <AnimalAvatarSvg id={currentStep.animalFriend} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow" />
        </button>

        {/* Animated Doctor Bunny Character */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playHop();
            soundEngine.speakWord('I am a doctor! Let us keep running!', 0.9);
          }}
          title="Tap Dr. Bunny to hear voice"
          className="absolute -translate-x-1/2 transition-all duration-700 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
          style={{
            left: `${currentPos.leftPct}%`,
            bottom: `${currentPos.bottomPct}%`,
          }}
        >
          <DoctorBunnyRunnerSvg
            pose={currentPos.pose}
            hasShoes={hasShoes}
            hasCap={hasCap}
          />
        </button>
      </div>

      {/* Audio Prompt & Interaction Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentStep.promptEn}
            </h3>
            <p className="text-sm text-slate-600">
              {currentStep.promptCn}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.unlockAudio();
              soundEngine.playClick();
              soundEngine.speakWord(currentStep.speechPrompt, 0.85);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-semibold text-sm hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>Listen Again · 再听一遍</span>
          </button>
        </div>

        {/* Challenge Body */}
        {currentStep.type === 'rhythm_boost' ? (
          <div className="space-y-4">
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-150"
                style={{
                  width: `${Math.min(100, (boostCount / (currentStep.boostTargetCount || 5)) * 100)}%`,
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-700 font-mono tabular-nums">
                Energy Taps: {boostCount} / {currentStep.boostTargetCount || 5}
              </p>

              <button
                type="button"
                disabled={stepCleared}
                onClick={handleBoostTap}
                className="w-full sm:w-auto min-w-[260px] px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 text-white font-display font-bold text-xl shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-6 h-6" />
                <span>
                  Tap &ldquo;{currentStep.boostActionLabel}&rdquo; ({currentStep.boostActionCn})
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentStep.options?.map((option) => {
              const isWrong = wrongOptionIds.includes(option.id);
              const isChosenCorrect = stepCleared && option.isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={stepCleared}
                  onClick={() => handleOptionSelect(option)}
                  className={`flex items-center sm:flex-col sm:justify-center gap-4 sm:gap-2.5 p-4 sm:p-5 rounded-2xl border text-left sm:text-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isChosenCorrect
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                      : isWrong
                        ? 'bg-rose-50/60 border-rose-200 opacity-70'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-emerald-400 hover:shadow-sm'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <ActionVisualSvg type={option.visualType} className="w-12 h-12" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-900">{option.label}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{option.chinese}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Instant Audio/Visual Feedback Banner */}
        {feedback && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <CheckCircle2
              className={`w-5 h-5 shrink-0 ${
                feedback.type === 'success' ? 'text-emerald-600' : 'text-amber-600'
              }`}
            />
            <span>{feedback.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
