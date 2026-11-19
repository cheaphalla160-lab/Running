export type DestinationId = 'park' | 'hills' | 'meadow';
export type AnimalBuddyId = 'rabbit' | 'puppy' | 'fox' | 'panda' | 'duck';
export type GearId =
  | 'shoes'
  | 'water'
  | 'cap'
  | 'towel'
  | 'slippers'
  | 'icecream'
  | 'umbrella'
  | 'pillow';

export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  chinese: string;
  category: 'core' | 'animal' | 'gear';
  example: string;
  visualId: string;
}

export interface DestinationOption {
  id: DestinationId;
  title: string;
  keyword: string;
  chinese: string;
  description: string;
  speechPhrase: string;
  image: string;
  accentHex: string;
}

export interface GearItem {
  id: GearId;
  word: string;
  chinese: string;
  isGood: boolean;
  feedbackGood: string;
  feedbackBad: string;
  speechGood: string;
  speechBad: string;
}

export interface AdventureStep {
  id: string;
  type: 'hill_action' | 'listen_match' | 'rhythm_boost';
  terrain: 'flat' | 'up' | 'top' | 'down' | 'finish';
  animalFriend: AnimalBuddyId;
  animalName: string;
  promptEn: string;
  promptCn: string;
  speechPrompt: string;
  targetWord: string;
  // For hill_action or listen_match
  options?: {
    id: string;
    label: string;
    chinese: string;
    visualType: 'doctor' | 'running' | 'exercise' | 'run_up' | 'run_down' | AnimalBuddyId;
    isCorrect: boolean;
  }[];
  // For rhythm_boost
  boostTargetCount?: number;
  boostActionLabel?: string;
  boostActionCn?: string;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  avatar: AnimalBuddyId;
  destination: DestinationId;
  destinationLabel: string;
  score: number;
  accuracy: number;
  stars: number;
  createdAt: number;
}

export const CORE_VOCABULARY: VocabItem[] = [
  {
    id: 'doctor',
    word: 'doctor',
    phonetic: '/ˈdɒktər/',
    chinese: '医生',
    category: 'core',
    example: 'The bunny is a kind doctor.',
    visualId: 'doctor',
  },
  {
    id: 'running',
    word: 'running',
    phonetic: '/ˈrʌnɪŋ/',
    chinese: '跑步',
    category: 'core',
    example: 'Dr. Bunny likes running in the park!',
    visualId: 'running',
  },
  {
    id: 'exercise',
    word: 'exercise',
    phonetic: '/ˈeksərsaɪz/',
    chinese: '锻炼 / 做运动',
    category: 'core',
    example: 'Let us do morning exercise together!',
    visualId: 'exercise',
  },
  {
    id: 'run_up_hills',
    word: 'run up hills',
    phonetic: '/rʌn ʌp hɪlz/',
    chinese: '跑上山坡',
    category: 'core',
    example: 'We run up hills with strong legs!',
    visualId: 'run_up',
  },
  {
    id: 'run_down_hills',
    word: 'run down hills',
    phonetic: '/rʌn daʊn hɪlz/',
    chinese: '跑下山坡',
    category: 'core',
    example: 'Wheee! We run down hills happily!',
    visualId: 'run_down',
  },
  {
    id: 'rabbit',
    word: 'rabbit',
    phonetic: '/ˈræbɪt/',
    chinese: '兔子',
    category: 'animal',
    example: 'The little rabbit is a fast runner.',
    visualId: 'rabbit',
  },
  {
    id: 'puppy',
    word: 'puppy',
    phonetic: '/ˈpʌpi/',
    chinese: '小狗',
    category: 'animal',
    example: 'Puppy loves running on the grass.',
    visualId: 'puppy',
  },
  {
    id: 'fox',
    word: 'fox',
    phonetic: '/fɒks/',
    chinese: '小狐狸',
    category: 'animal',
    example: 'Fox runs up hills very quickly!',
    visualId: 'fox',
  },
  {
    id: 'panda',
    word: 'panda',
    phonetic: '/ˈpændə/',
    chinese: '熊猫',
    category: 'animal',
    example: 'Panda does exercise every morning.',
    visualId: 'panda',
  },
  {
    id: 'duck',
    word: 'duck',
    phonetic: '/dʌk/',
    chinese: '小鸭子',
    category: 'animal',
    example: 'Duck cheers when we run down hills!',
    visualId: 'duck',
  },
  {
    id: 'running_shoes',
    word: 'running shoes',
    phonetic: '/ˈrʌnɪŋ ʃuːz/',
    chinese: '运动鞋',
    category: 'gear',
    example: 'Put on your running shoes first!',
    visualId: 'shoes',
  },
  {
    id: 'water_bottle',
    word: 'water bottle',
    phonetic: '/ˈwɔːtər ˈbɒtl/',
    chinese: '水壶',
    category: 'gear',
    example: 'Bring a water bottle for exercise.',
    visualId: 'water',
  },
];

export const DESTINATIONS: DestinationOption[] = [
  {
    id: 'park',
    title: 'Sunny Park Track',
    keyword: 'running',
    chinese: '阳光公园跑道 · 练习 running',
    description: 'Go running along the bright red track and meet animal friends!',
    speechPhrase: 'Let us go running in the sunny park!',
    image: '/src/assets/images/scene_sunny_park_1795084115572.jpg',
    accentHex: '#10B981',
  },
  {
    id: 'hills',
    title: 'Green Hills Trail',
    keyword: 'run up & down hills',
    chinese: '青青小山坡 · 练习 run up / down hills',
    description: 'Run up hills and run down hills with fresh morning wind!',
    speechPhrase: 'Let us run up hills and run down hills!',
    image: '/src/assets/images/scene_green_hills_1795084115708.jpg',
    accentHex: '#0284C7',
  },
  {
    id: 'meadow',
    title: 'Forest Gym Meadow',
    keyword: 'exercise',
    chinese: '森林草地操场 · 练习 exercise',
    description: 'Do fun stretching and jumping exercise with forest buddies!',
    speechPhrase: 'Let us do exercise in the forest meadow!',
    image: '/src/assets/images/scene_forest_gym_1795084115770.jpg',
    accentHex: '#F59E0B',
  },
];

export const GEAR_ITEMS: GearItem[] = [
  {
    id: 'shoes',
    word: 'running shoes',
    chinese: '运动鞋',
    isGood: true,
    feedbackGood: 'Great! Running shoes protect our feet!',
    feedbackBad: '',
    speechGood: 'Running shoes! Great choice!',
    speechBad: '',
  },
  {
    id: 'water',
    word: 'water bottle',
    chinese: '水壶',
    isGood: true,
    feedbackGood: 'Smart! Drink water after exercise!',
    feedbackBad: '',
    speechGood: 'Water bottle! Very smart!',
    speechBad: '',
  },
  {
    id: 'cap',
    word: 'sports cap',
    chinese: '运动帽',
    isGood: true,
    feedbackGood: 'Awesome! A sports cap keeps the sun away!',
    feedbackBad: '',
    speechGood: 'Sports cap! Ready for the sun!',
    speechBad: '',
  },
  {
    id: 'towel',
    word: 'soft towel',
    chinese: '毛巾',
    isGood: true,
    feedbackGood: 'Nice! A towel helps wipe away sweat!',
    feedbackBad: '',
    speechGood: 'Soft towel! Good helper!',
    speechBad: '',
  },
  {
    id: 'slippers',
    word: 'slippers',
    chinese: '拖鞋',
    isGood: false,
    feedbackGood: '',
    feedbackBad: 'Oops! Slippers are for home, not for running!',
    speechGood: '',
    speechBad: 'Oops! Slippers are not good for running!',
  },
  {
    id: 'icecream',
    word: 'ice cream',
    chinese: '冰淇淋',
    isGood: false,
    feedbackGood: '',
    feedbackBad: 'Haha! Ice cream will melt while running!',
    speechGood: '',
    speechBad: 'Oops! Ice cream will melt when running!',
  },
  {
    id: 'umbrella',
    word: 'big umbrella',
    chinese: '大雨伞',
    isGood: false,
    feedbackGood: '',
    feedbackBad: 'Too heavy! It is sunny today, no umbrella needed.',
    speechGood: '',
    speechBad: 'Oops! An umbrella is too heavy for exercise!',
  },
  {
    id: 'pillow',
    word: 'sleepy pillow',
    chinese: '枕头',
    isGood: false,
    feedbackGood: '',
    feedbackBad: 'Not a pillow! We are going to exercise, not sleep!',
    speechGood: '',
    speechBad: 'Oops! We are going to exercise, not sleep!',
  },
];

export const ANIMAL_AVATARS: { id: AnimalBuddyId; label: string; chinese: string }[] = [
  { id: 'rabbit', label: 'Rabbit', chinese: '小兔子' },
  { id: 'puppy', label: 'Puppy', chinese: '小狗狗' },
  { id: 'fox', label: 'Fox', chinese: '小狐狸' },
  { id: 'panda', label: 'Panda', chinese: '小熊猫' },
  { id: 'duck', label: 'Duck', chinese: '小鸭子' },
];

export function buildAdventureSteps(destination: DestinationId): AdventureStep[] {
  const introLabel =
    destination === 'park'
      ? 'Sunny Park'
      : destination === 'hills'
        ? 'Green Hills'
        : 'Forest Meadow';

  return [
    {
      id: 'step-doctor',
      type: 'listen_match',
      terrain: 'flat',
      animalFriend: 'puppy',
      animalName: 'Puppy',
      promptEn: `Puppy waves at the ${introLabel}! Who is coming to run today?`,
      promptCn: '听一听，小狗正在欢迎谁来跑步呢？点击正确的单词！',
      speechPrompt: 'Look! The bunny is a doctor!',
      targetWord: 'doctor',
      options: [
        { id: 'opt-doc', label: 'doctor', chinese: '医生', visualType: 'doctor', isCorrect: true },
        { id: 'opt-pil', label: 'puppy', chinese: '小狗', visualType: 'puppy', isCorrect: false },
        { id: 'opt-duck', label: 'duck', chinese: '小鸭子', visualType: 'duck', isCorrect: false },
      ],
    },
    {
      id: 'step-running-boost',
      type: 'rhythm_boost',
      terrain: 'flat',
      animalFriend: 'rabbit',
      animalName: 'Rabbit',
      promptEn: 'Let us warm up! Tap "running" 5 times to run with Rabbit!',
      promptCn: '热身开始！快速点击 5 次 "running" 和小兔子一起跑起来！',
      speechPrompt: 'Time for running! Tap running five times!',
      targetWord: 'running',
      boostTargetCount: 5,
      boostActionLabel: 'running',
      boostActionCn: '跑步加速',
    },
    {
      id: 'step-run-up',
      type: 'hill_action',
      terrain: 'up',
      animalFriend: 'fox',
      animalName: 'Fox',
      promptEn: 'A green hill is ahead! Help Dr. Bunny go UP the hill!',
      promptCn: '前方出现高高的山坡！帮医生小兔选择正确的上坡动作！',
      speechPrompt: 'Run up hills! Run up hills!',
      targetWord: 'run up hills',
      options: [
        { id: 'opt-up', label: 'run up hills', chinese: '跑上山坡', visualType: 'run_up', isCorrect: true },
        { id: 'opt-down', label: 'run down hills', chinese: '跑下山坡', visualType: 'run_down', isCorrect: false },
        { id: 'opt-ex', label: 'exercise', chinese: '做运动', visualType: 'exercise', isCorrect: false },
      ],
    },
    {
      id: 'step-exercise-match',
      type: 'listen_match',
      terrain: 'top',
      animalFriend: 'panda',
      animalName: 'Panda',
      promptEn: 'At the hilltop, Panda is stretching! Listen and pick the word!',
      promptCn: '到达山顶啦！熊猫正在邀请大家做什么呢？听发音选单词！',
      speechPrompt: 'Let us do exercise together! Exercise!',
      targetWord: 'exercise',
      options: [
        { id: 'opt-run', label: 'running', chinese: '跑步', visualType: 'running', isCorrect: false },
        { id: 'opt-ex2', label: 'exercise', chinese: '锻炼 / 做运动', visualType: 'exercise', isCorrect: true },
        { id: 'opt-doc2', label: 'doctor', chinese: '医生', visualType: 'doctor', isCorrect: false },
      ],
    },
    {
      id: 'step-run-down',
      type: 'hill_action',
      terrain: 'down',
      animalFriend: 'duck',
      animalName: 'Duck',
      promptEn: 'Time to go down the sunny slope! Which way should Dr. Bunny go?',
      promptCn: '准备滑下阳光山坡啦！请选择正确的下坡英语短语！',
      speechPrompt: 'Wheee! Run down hills! Run down hills!',
      targetWord: 'run down hills',
      options: [
        { id: 'opt-up2', label: 'run up hills', chinese: '跑上山坡', visualType: 'run_up', isCorrect: false },
        { id: 'opt-down2', label: 'run down hills', chinese: '跑下山坡', visualType: 'run_down', isCorrect: true },
        { id: 'opt-doc3', label: 'doctor', chinese: '医生', visualType: 'doctor', isCorrect: false },
      ],
    },
    {
      id: 'step-finish-boost',
      type: 'rhythm_boost',
      terrain: 'finish',
      animalFriend: 'puppy',
      animalName: 'All Friends',
      promptEn: 'The finish line is right there! Tap "exercise" 5 times to cheer!',
      promptCn: '终点线就在前面！点击 5 次 "exercise" 欢呼冲刺吧！',
      speechPrompt: 'Almost at the finish line! Tap exercise!',
      targetWord: 'exercise',
      boostTargetCount: 5,
      boostActionLabel: 'exercise',
      boostActionCn: '活力冲刺',
    },
  ];
}

const STORAGE_KEY = 'dr_bunny_english_leaderboard_v1';

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    studentName: 'Mia',
    avatar: 'rabbit',
    destination: 'hills',
    destinationLabel: 'Green Hills Trail',
    score: 260,
    accuracy: 100,
    stars: 3,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'seed-2',
    studentName: 'Leo',
    avatar: 'puppy',
    destination: 'park',
    destinationLabel: 'Sunny Park Track',
    score: 240,
    accuracy: 92,
    stars: 3,
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'seed-3',
    studentName: 'Emma',
    avatar: 'panda',
    destination: 'meadow',
    destinationLabel: 'Forest Gym Meadow',
    score: 220,
    accuracy: 88,
    stars: 3,
    createdAt: Date.now() - 21600000,
  },
  {
    id: 'seed-4',
    studentName: 'Lucas',
    avatar: 'fox',
    destination: 'hills',
    destinationLabel: 'Green Hills Trail',
    score: 195,
    accuracy: 83,
    stars: 2,
    createdAt: Date.now() - 7200000,
  },
];

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return DEFAULT_LEADERBOARD;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
      return DEFAULT_LEADERBOARD;
    }
    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LEADERBOARD;
  } catch {
    return DEFAULT_LEADERBOARD;
  }
}

export function saveLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const current = loadLeaderboard();
  const updated = [...current, entry]
    .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy || b.createdAt - a.createdAt)
    .slice(0, 30);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota issues
    }
  }
  return updated;
}

export function resetLeaderboard(): LeaderboardEntry[] {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
    } catch {
      // Ignore storage errors
    }
  }
  return DEFAULT_LEADERBOARD;
}
