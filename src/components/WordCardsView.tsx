import React, { useState } from 'react';
import { Volume2, Eye, EyeOff } from 'lucide-react';
import { CORE_VOCABULARY, VocabItem } from '../data/gameData';
import { ActionVisualSvg, GearItemSvg } from './Illustrations';
import { soundEngine } from '../audio/soundEngine';

export const WordCardsView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'core' | 'animal' | 'gear'>('all');
  const [showChinese, setShowChinese] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const items = CORE_VOCABULARY.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

  const handleSpeak = (item: VocabItem) => {
    soundEngine.unlockAudio();
    soundEngine.playClick();
    setActiveId(item.id);
    soundEngine.speakWord(`${item.word}. ${item.example}`);
    window.setTimeout(() => setActiveId(null), 1400);
  };

  const renderVisual = (item: VocabItem) => {
    if (item.visualId === 'shoes' || item.visualId === 'water') {
      return <GearItemSvg id={item.visualId} className="w-16 h-16" />;
    }
    return (
      <ActionVisualSvg
        type={item.visualId as 'doctor' | 'running' | 'exercise' | 'run_up' | 'run_down' | 'rabbit' | 'puppy' | 'fox' | 'panda' | 'duck'}
        className="w-16 h-16"
      />
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold text-emerald-700 tracking-wide">
            Classroom Word Deck · 课堂词汇预习与听读
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            Tap any card to hear the English word
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {(
              [
                { id: 'all', label: 'All Words' },
                { id: 'core', label: 'Core Actions' },
                { id: 'animal', label: 'Animals' },
                { id: 'gear', label: 'Gear' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setFilter(tab.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowChinese((prev) => !prev);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {showChinese ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>{showChinese ? 'Hide Chinese' : 'Show Chinese'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const isSpeaking = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSpeak(item)}
              className={`group text-left bg-white rounded-2xl border p-5 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isSpeaking
                  ? 'border-emerald-500 shadow-md -translate-y-0.5'
                  : 'border-slate-200 hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-20 h-20 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-center shrink-0">
                  {renderVisual(item)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 font-medium capitalize">
                      {item.category === 'core' ? 'Key Word' : item.category} · {item.phonetic}
                    </span>
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isSpeaking
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mt-1 truncate">
                    {item.word}
                  </h3>

                  {showChinese ? (
                    <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                      {item.chinese}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic mt-0.5">Quiz mode hidden</p>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
                “{item.example}”
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
