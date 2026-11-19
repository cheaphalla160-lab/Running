import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AnimalBuddyId, GearId } from '../data/gameData';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Storybook Scene',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-emerald-50 to-amber-100 text-slate-700 p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-8 h-8 text-emerald-600 mb-2" />
        <span className="text-sm font-semibold text-center">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export const AnimalAvatarSvg: React.FC<{ id: AnimalBuddyId; className?: string }> = ({
  id,
  className = 'w-12 h-12',
}) => {
  switch (id) {
    case 'rabbit':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="32" cy="36" r="22" fill="#FFF7ED" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="22" cy="14" rx="5.5" ry="13" transform="rotate(-10 22 14)" fill="#FFF7ED" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="22" cy="14" rx="2.8" ry="8" transform="rotate(-10 22 14)" fill="#FDA4AF" />
          <ellipse cx="42" cy="14" rx="5.5" ry="13" transform="rotate(10 42 14)" fill="#FFF7ED" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="42" cy="14" rx="2.8" ry="8" transform="rotate(10 42 14)" fill="#FDA4AF" />
          <circle cx="24" cy="34" r="2.8" fill="#1E293B" />
          <circle cx="40" cy="34" r="2.8" fill="#1E293B" />
          <ellipse cx="32" cy="39" rx="3" ry="2.2" fill="#FB7185" />
          <path d="M27 44 Q32 48 37 44" fill="none" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="19" cy="40" r="3.5" fill="#FECDD3" />
          <circle cx="45" cy="40" r="3.5" fill="#FECDD3" />
        </svg>
      );
    case 'puppy':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <ellipse cx="14" cy="33" rx="7" ry="13" transform="rotate(14 14 33)" fill="#B45309" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="50" cy="33" rx="7" ry="13" transform="rotate(-14 50 33)" fill="#B45309" stroke="#334155" strokeWidth="2.5" />
          <circle cx="32" cy="34" r="21" fill="#FDE68A" stroke="#334155" strokeWidth="2.5" />
          <circle cx="24" cy="32" r="2.8" fill="#1E293B" />
          <circle cx="40" cy="32" r="2.8" fill="#1E293B" />
          <ellipse cx="32" cy="38" rx="4" ry="3" fill="#1E293B" />
          <path d="M27 44 Q32 49 37 44" fill="none" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M30 46 Q32 52 34 46" fill="#FB7185" />
        </svg>
      );
    case 'fox':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <polygon points="12,12 27,22 14,32" fill="#F97316" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="52,12 37,22 50,32" fill="#F97316" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="32" cy="37" rx="22" ry="19" fill="#FB923C" stroke="#334155" strokeWidth="2.5" />
          <path d="M13 40 Q32 34 51 40 Q46 56 32 56 Q18 56 13 40Z" fill="#FFF7ED" />
          <circle cx="24" cy="34" r="2.8" fill="#1E293B" />
          <circle cx="40" cy="34" r="2.8" fill="#1E293B" />
          <circle cx="32" cy="42" r="3" fill="#1E293B" />
          <path d="M27 47 Q32 51 37 47" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'panda':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="16" cy="18" r="8" fill="#1E293B" />
          <circle cx="48" cy="18" r="8" fill="#1E293B" />
          <circle cx="32" cy="35" r="21" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="23" cy="33" rx="5.5" ry="6.5" transform="rotate(-15 23 33)" fill="#1E293B" />
          <ellipse cx="41" cy="33" rx="5.5" ry="6.5" transform="rotate(15 41 33)" fill="#1E293B" />
          <circle cx="23.5" cy="32" r="2" fill="#FFFFFF" />
          <circle cx="40.5" cy="32" r="2" fill="#FFFFFF" />
          <ellipse cx="32" cy="40" rx="3.2" ry="2.2" fill="#1E293B" />
          <path d="M27 45 Q32 49 37 45" fill="none" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'duck':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path d="M28 12 Q32 6 36 13" fill="none" stroke="#EAB308" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="32" cy="35" r="21" fill="#FEF08A" stroke="#334155" strokeWidth="2.5" />
          <circle cx="24" cy="31" r="2.8" fill="#1E293B" />
          <circle cx="40" cy="31" r="2.8" fill="#1E293B" />
          <ellipse cx="32" cy="40" rx="9" ry="5" fill="#F97316" stroke="#334155" strokeWidth="2.2" />
          <circle cx="18" cy="37" r="3.2" fill="#FCA5A5" />
          <circle cx="46" cy="37" r="3.2" fill="#FCA5A5" />
        </svg>
      );
  }
};

export const GearItemSvg: React.FC<{ id: GearId; className?: string }> = ({
  id,
  className = 'w-16 h-16',
}) => {
  switch (id) {
    case 'shoes':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path
            d="M10 38 L16 22 L28 24 L36 33 L53 36 C56 37 56 44 53 45 L11 45 C8 45 8 40 10 38 Z"
            fill="#EF4444"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="9" y="43" width="46" height="5" rx="2.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
          <path d="M26 27 L31 25 M29 31 L34 29" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 39 L27 33" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'water':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect x="25" y="9" width="14" height="7" rx="2" fill="#0284C7" stroke="#1E293B" strokeWidth="2.3" />
          <rect x="20" y="16" width="24" height="39" rx="7" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="22" y="27" width="20" height="14" fill="#E0F2FE" />
          <path d="M32 29 C32 29 28 34 28 36.5 A4 4 0 0 0 36 36.5 C36 34 32 29 32 29 Z" fill="#0284C7" />
        </svg>
      );
    case 'cap':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path d="M14 38 C14 23 22 17 33 17 C44 17 50 24 50 38 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M33 17 L33 38" stroke="#FEF3C7" strokeWidth="2" />
          <path d="M12 38 L56 38 C56 42 46 44 33 43 C20 42 12 41 12 38 Z" fill="#D97706" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="33" cy="15" r="2.5" fill="#1E293B" />
        </svg>
      );
    case 'towel':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect x="16" y="13" width="32" height="38" rx="5" fill="#34D399" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="16" y="38" width="32" height="6" fill="#FFFFFF" opacity="0.85" />
          <path d="M22 20 L42 20" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M19 51 L22 55 M26 51 L29 55 M33 51 L36 55 M40 51 L43 55" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'slippers':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <ellipse cx="22" cy="34" rx="9" ry="19" transform="rotate(-10 22 34)" fill="#F9A8D4" stroke="#1E293B" strokeWidth="2.4" />
          <path d="M14 28 Q22 22 30 28" fill="#EC4899" stroke="#1E293B" strokeWidth="2.2" />
          <ellipse cx="43" cy="34" rx="9" ry="19" transform="rotate(10 43 34)" fill="#F9A8D4" stroke="#1E293B" strokeWidth="2.4" />
          <path d="M35 28 Q43 22 51 28" fill="#EC4899" stroke="#1E293B" strokeWidth="2.2" />
        </svg>
      );
    case 'icecream':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <polygon points="24,31 40,31 32,56" fill="#FBBF24" stroke="#1E293B" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="26" cy="25" r="8" fill="#F472B6" stroke="#1E293B" strokeWidth="2.3" />
          <circle cx="38" cy="25" r="8" fill="#FFFBEB" stroke="#1E293B" strokeWidth="2.3" />
          <circle cx="32" cy="17" r="8" fill="#60A5FA" stroke="#1E293B" strokeWidth="2.3" />
          <circle cx="32" cy="9" r="3" fill="#EF4444" />
        </svg>
      );
    case 'umbrella':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path d="M11 31 C11 16 21 10 32 10 C43 10 53 16 53 31 Z" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M32 31 L32 49 C32 53 37 54 39 50" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="9" r="2" fill="#1E293B" />
        </svg>
      );
    case 'pillow':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path
            d="M12 20 Q32 24 52 20 Q49 32 52 44 Q32 40 12 44 Q15 32 12 20 Z"
            fill="#C7D2FE"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text x="27" y="36" fontSize="13" fontWeight="700" fill="#4338CA">
            Z
          </text>
        </svg>
      );
  }
};

export const ActionVisualSvg: React.FC<{
  type: 'doctor' | 'running' | 'exercise' | 'run_up' | 'run_down' | AnimalBuddyId;
  className?: string;
}> = ({ type, className = 'w-14 h-14' }) => {
  if (type === 'rabbit' || type === 'puppy' || type === 'fox' || type === 'panda' || type === 'duck') {
    return <AnimalAvatarSvg id={type} className={className} />;
  }

  switch (type) {
    case 'doctor':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect x="14" y="18" width="36" height="36" rx="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="28" y="25" width="8" height="22" rx="2" fill="#EF4444" />
          <rect x="21" y="32" width="22" height="8" rx="2" fill="#EF4444" />
          <path d="M23 18 C23 11 41 11 41 18" fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'running':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="38" cy="15" r="6" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.4" />
          <path d="M35 23 L29 36 L41 42 L44 54" fill="none" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 36 L19 46 L12 45" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 28 L34 25 L46 31" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 54 L55 54" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'exercise':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="32" cy="14" r="6" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.4" />
          <path d="M32 22 L32 39" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          <path d="M16 18 L25 27 L39 27 L48 18" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 53 L32 39 L41 53" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'run_up':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path d="M8 52 L56 20 L56 52 Z" fill="#86EFAC" stroke="#1E293B" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M16 38 L44 19" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
          <polygon points="48,16 36,17 42,26" fill="#059669" />
        </svg>
      );
    case 'run_down':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path d="M8 20 L56 52 L8 52 Z" fill="#93C5FD" stroke="#1E293B" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M20 19 L48 38" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <polygon points="52,41 46,31 40,40" fill="#0284C7" />
        </svg>
      );
  }
};

export const DoctorBunnyRunnerSvg: React.FC<{
  pose: 'flat' | 'up' | 'down' | 'exercise' | 'finish';
  hasShoes?: boolean;
  hasCap?: boolean;
}> = ({ pose, hasShoes = true, hasCap = false }) => {
  const rotation =
    pose === 'up' ? '-16deg' : pose === 'down' ? '16deg' : '0deg';
  const animClass =
    pose === 'exercise' || pose === 'finish' ? 'animate-bunny-exercise' : 'animate-bunny-hop';

  return (
    <div
      className={`transition-transform duration-300 ${animClass}`}
      style={{ transform: `rotate(${rotation})` }}
    >
      <svg viewBox="0 0 96 108" className="w-24 h-28 drop-shadow-md" aria-label="Doctor Bunny">
        {/* Ears */}
        <ellipse cx="38" cy="18" rx="6" ry="15" transform="rotate(-12 38 18)" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
        <ellipse cx="38" cy="18" rx="3" ry="10" transform="rotate(-12 38 18)" fill="#FDA4AF" />
        <ellipse cx="58" cy="18" rx="6" ry="15" transform="rotate(14 58 18)" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
        <ellipse cx="58" cy="18" rx="3" ry="10" transform="rotate(14 58 18)" fill="#FDA4AF" />

        {/* Optional Sports Cap */}
        {hasCap && (
          <g>
            <path d="M32 29 C32 20 64 20 64 29 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.2" />
            <path d="M46 28 L72 29" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {/* Head */}
        <circle cx="48" cy="39" r="17" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
        <circle cx="42" cy="37" r="2.5" fill="#1E293B" />
        <circle cx="55" cy="37" r="2.5" fill="#1E293B" />
        <ellipse cx="49" cy="42" rx="2.6" ry="1.8" fill="#FB7185" />
        <path d="M44 46 Q49 50 54 46" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="37" cy="42" r="3" fill="#FECDD3" />
        <circle cx="60" cy="42" r="3" fill="#FECDD3" />

        {/* Doctor Coat Body */}
        <path
          d="M32 54 L64 54 L68 82 L28 82 Z"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Stethoscope */}
        <path d="M40 54 C40 66 56 66 56 54" fill="none" stroke="#0D9488" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="48" cy="69" r="3.5" fill="#14B8A6" stroke="#1E293B" strokeWidth="1.8" />
        {/* Red Cross badge */}
        <rect x="55" y="61" width="7" height="7" rx="1.5" fill="#FEE2E2" />
        <path d="M58.5 62.5 V66.5 M56.5 64.5 H60.5" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />

        {/* Arms */}
        <path
          d={pose === 'exercise' || pose === 'finish' ? 'M31 58 L19 46' : 'M31 58 L22 68'}
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={pose === 'exercise' || pose === 'finish' ? 'M31 58 L19 46' : 'M31 58 L22 68'}
          stroke="#1E293B"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={pose === 'exercise' || pose === 'finish' ? 'M65 58 L77 46' : 'M65 58 L75 66'}
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={pose === 'exercise' || pose === 'finish' ? 'M65 58 L77 46' : 'M65 58 L75 66'}
          stroke="#1E293B"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Legs & Running Shoes */}
        <line x1="40" y1="82" x2="36" y2="95" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="56" y1="82" x2="62" y2="95" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />
        <ellipse
          cx="35"
          cy="97"
          rx="8"
          ry="4.5"
          fill={hasShoes ? '#EF4444' : '#E2E8F0'}
          stroke="#1E293B"
          strokeWidth="2.2"
        />
        <ellipse
          cx="64"
          cy="97"
          rx="8"
          ry="4.5"
          fill={hasShoes ? '#EF4444' : '#E2E8F0'}
          stroke="#1E293B"
          strokeWidth="2.2"
        />
      </svg>
    </div>
  );
};
