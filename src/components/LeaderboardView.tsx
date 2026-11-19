import React, { useState } from 'react';
import { Trophy, RotateCcw, Star } from 'lucide-react';
import { DestinationId, LeaderboardEntry } from '../data/gameData';
import { AnimalAvatarSvg } from './Illustrations';
import { soundEngine } from '../audio/soundEngine';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  highlightId?: string | null;
  onReset: () => void;
  onPlayNow: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  highlightId,
  onReset,
  onPlayNow,
}) => {
  const [filterDest, setFilterDest] = useState<'all' | DestinationId>('all');
  const [confirmReset, setConfirmReset] = useState(false);

  const filtered = entries.filter((entry) =>
    filterDest === 'all' ? true : entry.destination === filterDest
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold text-amber-700 tracking-wide">
            Class Scoreboard · 课堂积分排行榜
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            Top Young Runners &amp; Word Champions
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {(
              [
                { id: 'all', label: 'All Routes' },
                { id: 'park', label: 'Park' },
                { id: 'hills', label: 'Hills' },
                { id: 'meadow', label: 'Meadow' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setFilterDest(tab.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterDest === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Board</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <span className="text-xs font-semibold text-amber-900">Reset scores?</span>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-700 cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.slice(0, 3).map((entry, idx) => {
            const isHighlighted = highlightId === entry.id;
            const rankLabels = ['1st Place · Gold', '2nd Place · Silver', '3rd Place · Bronze'];
            return (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl border p-5 flex items-center gap-4 ${
                  isHighlighted
                    ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
                    : 'border-slate-200'
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <AnimalAvatarSvg id={entry.avatar} className="w-11 h-11" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-700">
                    {rankLabels[idx]}
                  </p>
                  <p className="text-lg font-bold text-slate-900 truncate mt-0.5">
                    {entry.studentName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {entry.destinationLabel} · {entry.accuracy}% accuracy
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-2xl font-bold text-emerald-700 tabular-nums">
                    {entry.score}
                  </p>
                  <p className="text-xs text-slate-400">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-base font-semibold text-slate-700">No scores recorded for this route yet.</p>
            <button
              type="button"
              onClick={onPlayNow}
              className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Start Playing
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-5">Rank</th>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Route</th>
                  <th className="py-3.5 px-5 text-right">Stars</th>
                  <th className="py-3.5 px-5 text-right">Accuracy</th>
                  <th className="py-3.5 px-5 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((entry, idx) => {
                  const isHighlighted = highlightId === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      className={
                        isHighlighted
                          ? 'bg-emerald-50/70 font-semibold'
                          : 'hover:bg-slate-50/70 transition-colors'
                      }
                    >
                      <td className="py-3.5 px-5 font-mono text-slate-700 tabular-nums">
                        #{idx + 1}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <AnimalAvatarSvg id={entry.avatar} className="w-8 h-8 shrink-0" />
                          <span className="text-slate-900 font-semibold truncate max-w-[160px]">
                            {entry.studentName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {entry.destinationLabel}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex items-center justify-end gap-0.5 text-amber-500">
                          {Array.from({ length: entry.stars }).map((_, sIdx) => (
                            <Star key={sIdx} className="w-4 h-4 fill-amber-400 text-amber-500" />
                          ))}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono text-slate-600 tabular-nums">
                        {entry.accuracy}%
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        {entry.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
