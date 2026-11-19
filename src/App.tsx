import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Trophy,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Backpack,
} from 'lucide-react';
import {
  ANIMAL_AVATARS,
  AnimalBuddyId,
  CORE_VOCABULARY,
  DESTINATIONS,
  DestinationOption,
  GEAR_ITEMS,
  GearId,
  GearItem,
  LeaderboardEntry,
  loadLeaderboard,
  resetLeaderboard,
  saveLeaderboardEntry,
} from './data/gameData';
import {
  AnimalAvatarSvg,
  GearItemSvg,
  ImageWithFallback,
} from './components/Illustrations';
import { WordCardsView } from './components/WordCardsView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdventureStage } from './components/AdventureStage';
import { soundEngine } from './audio/soundEngine';

type AppTab = 'game' | 'cards' | 'leaderboard';
type GameStep =
  | 'TITLE_MENU'
  | 'CHOOSE_DESTINATION'
  | 'PREPARE_GEAR'
  | 'ACTIVE_PLAY'
  | 'ROUND_SUMMARY';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('game');
  const [gameStep, setGameStep] = useState<GameStep>('TITLE_MENU');

  // Audio controls
  const [musicOn, setMusicOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  // Player session state
  const [studentName, setStudentName] = useState('');
  const [avatar, setAvatar] = useState<AnimalBuddyId>('rabbit');
  const [selectedDest, setSelectedDest] = useState<DestinationOption | null>(null);
  const [packedGear, setPackedGear] = useState<GearId[]>([]);
  const [gearFeedback, setGearFeedback] = useState<{
    isGood: boolean;
    text: string;
  } | null>(null);
  const [gearWrongAttempts, setGearWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);

  // Summary & Leaderboard
  const [summaryData, setSummaryData] = useState<{
    finalScore: number;
    accuracy: number;
    stars: number;
    masteredWords: string[];
    entryId: string;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    loadLeaderboard()
  );

  // Keep soundEngine flags synced
  useEffect(() => {
    soundEngine.setMusicEnabled(musicOn);
  }, [musicOn]);

  useEffect(() => {
    soundEngine.setVoiceEnabled(voiceOn);
  }, [voiceOn]);

  // Clean up background audio on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopMusic();
      soundEngine.stopSpeech();
    };
  }, []);

  const handleToggleMusic = () => {
    soundEngine.unlockAudio();
    const next = !musicOn;
    setMusicOn(next);
    soundEngine.setMusicEnabled(next);
  };

  const handleToggleVoice = () => {
    soundEngine.unlockAudio();
    const next = !voiceOn;
    setVoiceOn(next);
    soundEngine.setVoiceEnabled(next);
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.unlockAudio();
    soundEngine.playCorrect();
    const finalName = studentName.trim() || 'Happy Runner';
    setStudentName(finalName);
    setScore(0);
    setSelectedDest(null);
    setPackedGear([]);
    setGearFeedback(null);
    setGearWrongAttempts(0);
    setSummaryData(null);
    setGameStep('CHOOSE_DESTINATION');
    soundEngine.speakWord(
      `Hello ${finalName}! I am a doctor! Where should we go for running and exercise?`,
      0.9
    );
  };

  const handleSelectDestination = (dest: DestinationOption) => {
    soundEngine.unlockAudio();
    soundEngine.playCorrect();
    setSelectedDest(dest);
    setScore((prev) => prev + 20);
    setGameStep('PREPARE_GEAR');
    soundEngine.speakWord(
      `${dest.speechPhrase} Now let us pack three good things!`,
      0.9
    );
  };

  const handleSelectGear = (item: GearItem) => {
    soundEngine.unlockAudio();

    if (packedGear.includes(item.id)) {
      soundEngine.playClick();
      soundEngine.speakWord(item.word, 0.9);
      return;
    }

    if (item.isGood) {
      if (packedGear.length >= 3) {
        soundEngine.playClick();
        setGearFeedback({
          isGood: true,
          text: 'Your sports bag is full with 3 great items! Click "Go Running!" to start!',
        });
        return;
      }
      const nextPacked = [...packedGear, item.id];
      setPackedGear(nextPacked);
      setScore((prev) => prev + 20);
      soundEngine.playCorrect();
      soundEngine.speakWord(item.speechGood, 0.9);
      setGearFeedback({
        isGood: true,
        text: `${item.feedbackGood} (+20 pts)`,
      });
    } else {
      setGearWrongAttempts((prev) => prev + 1);
      soundEngine.playWrong();
      soundEngine.speakWord(item.speechBad, 0.88);
      setGearFeedback({
        isGood: false,
        text: item.feedbackBad,
      });
    }
  };

  const handleStartAdventure = () => {
    if (packedGear.length < 3 || !selectedDest) return;
    soundEngine.unlockAudio();
    soundEngine.playHop();
    setGameStep('ACTIVE_PLAY');
  };

  const handleAdventureComplete = (result: {
    finalScore: number;
    correctAttempts: number;
    totalAttempts: number;
    masteredWords: string[];
  }) => {
    if (!selectedDest) return;
    const totalTries = result.totalAttempts + gearWrongAttempts + 3;
    const totalCorrect = result.correctAttempts + 3;
    const accuracy = Math.min(100, Math.round((totalCorrect / Math.max(1, totalTries)) * 100));
    const stars = accuracy >= 85 ? 3 : accuracy >= 65 ? 2 : 1;

    const entry: LeaderboardEntry = {
      id: `run-${Date.now()}`,
      studentName: studentName.trim() || 'Happy Runner',
      avatar,
      destination: selectedDest.id,
      destinationLabel: selectedDest.title,
      score: result.finalScore,
      accuracy,
      stars,
      createdAt: Date.now(),
    };

    const updated = saveLeaderboardEntry(entry);
    setLeaderboard(updated);
    setSummaryData({
      finalScore: result.finalScore,
      accuracy,
      stars,
      masteredWords: result.masteredWords,
      entryId: entry.id,
    });
    setGameStep('ROUND_SUMMARY');
  };

  const handlePlayAgain = () => {
    soundEngine.playClick();
    setStudentName('');
    setSelectedDest(null);
    setPackedGear([]);
    setGearFeedback(null);
    setGearWrongAttempts(0);
    setScore(0);
    setSummaryData(null);
    setGameStep('TITLE_MENU');
    setActiveTab('game');
  };

  const handleResetBoard = () => {
    soundEngine.playClick();
    setLeaderboard(resetLeaderboard());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] text-slate-900">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('game');
            }}
            className="text-lg sm:text-xl font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dr. Bunny Run &amp; Learn
          </button>

          {/* Zone 2: Concise single-line Nav Links */}
          <nav className="flex items-center gap-5 sm:gap-7 text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('game');
              }}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'game'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Play Game
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('cards');
              }}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'cards'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Word Cards
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('leaderboard');
              }}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Leaderboard
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleToggleMusic}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                musicOn
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>{musicOn ? 'Music On' : 'Music Off'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Sub-toolbar for Voice / Step Context when playing */}
        {activeTab === 'game' && gameStep !== 'TITLE_MENU' && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <AnimalAvatarSvg id={avatar} className="w-8 h-8 shrink-0" />
              <span className="font-semibold text-slate-900">{studentName}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span>
                {gameStep === 'CHOOSE_DESTINATION' && 'Step 1: Choose Where to Go'}
                {gameStep === 'PREPARE_GEAR' && 'Step 2: Pack Running Gear'}
                {gameStep === 'ACTIVE_PLAY' && 'Step 3: Run & Exercise Adventure'}
                {gameStep === 'ROUND_SUMMARY' && 'Finished! Word Review & Rank'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {voiceOn ? (
                  <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{voiceOn ? 'Voice On' : 'Voice Off'}</span>
              </button>

              {gameStep !== 'ROUND_SUMMARY' && (
                <button
                  type="button"
                  onClick={handlePlayAgain}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: GAME FLOW */}
        {activeTab === 'game' && (
          <>
            {/* STEP 0: TITLE MENU */}
            {gameStep === 'TITLE_MENU' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left: Hero Intro & Student Setup */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-emerald-700 tracking-wide">
                        Elementary English Vocabulary Game · 小学英语趣味互动课堂
                      </p>
                      <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 leading-tight text-balance">
                        Help Dr. Bunny Go Running &amp; Do Exercise!
                      </h1>
                      <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                        Choose a sunny place, pack the right running shoes and gear, and help our cute animal doctor learn{' '}
                        <strong className="text-slate-900">doctor</strong>,{' '}
                        <strong className="text-slate-900">running</strong>,{' '}
                        <strong className="text-slate-900">exercise</strong>,{' '}
                        <strong className="text-slate-900">run up hills</strong>, and{' '}
                        <strong className="text-slate-900">run down hills</strong>!
                      </p>
                    </div>

                    <form onSubmit={handleStartGame} className="mt-7 space-y-5">
                      <div>
                        <label
                          htmlFor="student-name"
                          className="block text-sm font-semibold text-slate-800 mb-2"
                        >
                          Student Name · 输入你的英文名字
                        </label>
                        <input
                          id="student-name"
                          type="text"
                          maxLength={18}
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Amy, Tom, Lucy..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <span className="block text-sm font-semibold text-slate-800 mb-2">
                          Pick Your Animal Buddy · 选择你的动物伙伴
                        </span>
                        <div className="grid grid-cols-5 gap-2.5">
                          {ANIMAL_AVATARS.map((item) => {
                            const selected = avatar === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  soundEngine.unlockAudio();
                                  soundEngine.playClick();
                                  soundEngine.speakWord(item.label, 0.9);
                                  setAvatar(item.id);
                                }}
                                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                                  selected
                                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <AnimalAvatarSvg id={item.id} className="w-10 h-10" />
                                <span className="text-xs font-bold text-slate-800 mt-1">
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <Play className="w-5 h-5 fill-white" />
                          <span>Start Adventure · 开始游戏</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.unlockAudio();
                            soundEngine.playClick();
                            setActiveTab('cards');
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                        >
                          <span>Preview Word Cards</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right: Storybook Character Portrait */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col">
                    <div className="relative flex-1 min-h-[300px] rounded-xl overflow-hidden bg-sky-50">
                      <ImageWithFallback
                        src="/src/assets/images/hero_doctor_bunny_1795084114324.jpg"
                        alt="Dr. Bunny wearing a white doctor coat, stethoscope, and red running shoes"
                        fallbackTitle="Dr. Bunny"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="pt-4 px-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          Meet Dr. Bunny!
                        </p>
                        <p className="text-xs text-slate-500">
                          doctor · running shoes · ready to exercise
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.unlockAudio();
                          soundEngine.playHop();
                          soundEngine.speakWord(
                            'Hello kids! I am Dr. Bunny! Let us learn doctor, running, exercise, and run up and down hills!',
                            0.9
                          );
                        }}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4 text-sky-600" />
                        <span>Hear Greeting</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Preview Strip of Target Words */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900">
                      Today&apos;s Key English Words · 本课核心单词（点击听发音）
                    </h2>
                    <span className="text-xs text-slate-500">Click any word to listen</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {CORE_VOCABULARY.filter((v) => v.category === 'core').map((word) => (
                      <button
                        key={word.id}
                        type="button"
                        onClick={() => {
                          soundEngine.unlockAudio();
                          soundEngine.playClick();
                          soundEngine.speakWord(word.word, 0.85);
                        }}
                        className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {word.word}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{word.chinese}</p>
                        </div>
                        <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: CHOOSE DESTINATION */}
            {gameStep === 'CHOOSE_DESTINATION' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Step 1 · Choose Where to Go
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      Where should Dr. Bunny go today?
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      帮小兔医生选一个要去跑步（running）或锻炼（exercise）的好地方吧！
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.unlockAudio();
                      soundEngine.speakWord(
                        'I am a doctor! Where should we go for running and exercise?',
                        0.88
                      );
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-sm font-semibold hover:bg-sky-100 shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Listen Question</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {DESTINATIONS.map((dest) => (
                    <div
                      key={dest.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-emerald-400 hover:shadow-md transition-all"
                    >
                      <div className="relative h-48 bg-sky-50 overflow-hidden">
                        <ImageWithFallback
                          src={dest.image}
                          alt={dest.title}
                          fallbackTitle={dest.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-emerald-700">
                              Focus: {dest.keyword}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.unlockAudio();
                                soundEngine.playClick();
                                soundEngine.speakWord(dest.speechPhrase, 0.88);
                              }}
                              aria-label={`Hear ${dest.title}`}
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mt-1">
                            {dest.title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            {dest.chinese}
                          </p>
                          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                            {dest.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectDestination(dest)}
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>Go Here! (+20 pts)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: PREPARE GEAR */}
            {gameStep === 'PREPARE_GEAR' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Step 2 · Pack Your Bag for {selectedDest?.title}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      What should Dr. Bunny wear and bring?
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      请选出 3 样适合跑步和锻炼（running &amp; exercise）的物品装进运动包！
                    </p>
                  </div>

                  {/* Sports Bag Status & Go Button */}
                  <div className="flex flex-wrap items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <Backpack className="w-6 h-6 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Sports Bag</p>
                        <p className="font-mono text-base font-bold text-slate-900 tabular-nums">
                          {packedGear.length} / 3 Packed
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={packedGear.length < 3}
                      onClick={handleStartAdventure}
                      className={`px-5 py-2.5 rounded-xl font-display font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                        packedGear.length >= 3
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>Let&apos;s Go Running!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {gearFeedback && (
                  <div
                    className={`px-5 py-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2.5 ${
                      gearFeedback.isGood
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <Sparkles
                      className={`w-4 h-4 shrink-0 ${
                        gearFeedback.isGood ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    />
                    <span>{gearFeedback.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {GEAR_ITEMS.map((item) => {
                    const isPacked = packedGear.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                          isPacked
                            ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
                            : 'border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-medium text-slate-400">
                            {isPacked ? 'Packed' : 'Tap to choose'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.unlockAudio();
                              soundEngine.playClick();
                              soundEngine.speakWord(item.word, 0.88);
                            }}
                            aria-label={`Listen ${item.word}`}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 flex items-center justify-center cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectGear(item)}
                          className="flex flex-col items-center text-center py-3 cursor-pointer focus-visible:outline-none"
                        >
                          <div className="w-20 h-20 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-center mb-3">
                            <GearItemSvg id={item.id} className="w-14 h-14" />
                          </div>
                          <p className="text-base font-bold text-slate-900">{item.word}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.chinese}</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectGear(item)}
                          className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            isPacked
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
                          }`}
                        >
                          {isPacked ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>In Bag</span>
                            </>
                          ) : (
                            <span>Pack Item</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: ACTIVE RUNNING & EXERCISE ADVENTURE */}
            {gameStep === 'ACTIVE_PLAY' && selectedDest && (
              <AdventureStage
                destination={selectedDest}
                packedGear={packedGear}
                initialScore={score}
                onComplete={handleAdventureComplete}
              />
            )}

            {/* STEP 4: SUMMARY & LEADERBOARD */}
            {gameStep === 'ROUND_SUMMARY' && summaryData && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 text-amber-500">
                      {Array.from({ length: summaryData.stars }).map((_, idx) => (
                        <Star key={idx} className="w-7 h-7 fill-amber-400 text-amber-500" />
                      ))}
                      <span className="text-sm font-bold text-amber-700 ml-1">
                        Mission Complete!
                      </span>
                    </div>

                    <h2 className="text-3xl font-display font-extrabold text-slate-900">
                      Great job, {studentName}!
                    </h2>
                    <p className="text-slate-600">
                      You helped Dr. Bunny finish{' '}
                      <strong className="text-slate-900">{selectedDest?.title}</strong> and practiced all the English action words!
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">Final Score</p>
                        <p className="font-mono text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                          {summaryData.finalScore}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">Accuracy</p>
                        <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums mt-1">
                          {summaryData.accuracy}%
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">Words</p>
                        <p className="font-mono text-2xl font-bold text-sky-700 tabular-nums mt-1">
                          {summaryData.masteredWords.length} / 5
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Tap a word to review pronunciation · 点击复习今日单词：
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['doctor', 'running', 'exercise', 'run up hills', 'run down hills'].map(
                          (word) => (
                            <button
                              key={word}
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                soundEngine.speakWord(word, 0.85);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-sm font-semibold hover:bg-sky-100 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                              <span>{word}</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handlePlayAgain}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-base shadow-sm cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Play Again (Next Student)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setActiveTab('leaderboard');
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>Full Leaderboard</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 h-64 lg:h-80 rounded-xl overflow-hidden bg-sky-50 border border-slate-200">
                    <ImageWithFallback
                      src="/src/assets/images/hero_doctor_bunny_1795084114324.jpg"
                      alt="Dr. Bunny celebrating finish"
                      fallbackTitle="Great Job!"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Live Leaderboard right below summary */}
                <LeaderboardView
                  entries={leaderboard}
                  highlightId={summaryData.entryId}
                  onReset={handleResetBoard}
                  onPlayNow={handlePlayAgain}
                />
              </div>
            )}
          </>
        )}

        {/* TAB 2: CLASSROOM WORD CARDS */}
        {activeTab === 'cards' && <WordCardsView />}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            entries={leaderboard}
            highlightId={summaryData?.entryId}
            onReset={handleResetBoard}
            onPlayNow={handlePlayAgain}
          />
        )}
      </main>
    </div>
  );
}
