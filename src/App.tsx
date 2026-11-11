import React, { useState, useEffect, useMemo } from 'react';
import {
  PROMPTS_DATA,
  CATEGORIES,
  CategoryType,
  PromptItem,
} from './data/prompts';
import { PromptCard } from './components/PromptCard';
import { RegulatoryFocusQuizModal } from './components/RegulatoryFocusQuizModal';
import { MetacognitionChecklistModal } from './components/MetacognitionChecklistModal';
import { AISimulateModal } from './components/AISimulateModal';
import {
  Search,
  Star,
  Compass,
  CheckCircle2,
  Moon,
  Sun,
  Layers,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('leader_prompt_favs');
      return saved ? JSON.parse(saved) : ['reg-promotion-coaching', 'meta-premortem'];
    } catch {
      return ['reg-promotion-coaching', 'meta-premortem'];
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Modals state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [simModalState, setSimModalState] = useState<{
    isOpen: boolean;
    prompt: PromptItem | null;
    finalPrompt: string;
  }>({
    isOpen: false,
    prompt: null,
    finalPrompt: '',
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('leader_prompt_favs', JSON.stringify(updated));
      return updated;
    });
  };

  const showCopyNotice = (title: string) => {
    setToastMessage(`"${title}" 프롬프트가 클립보드에 복사되었습니다.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleOpenSimulation = (prompt: PromptItem, finalPrompt: string) => {
    setSimModalState({
      isOpen: true,
      prompt,
      finalPrompt,
    });
  };

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return PROMPTS_DATA.filter((p) => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(p.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (p.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(query);
        const inSummary = p.summary.toLowerCase().includes(query);
        const inTheory = p.theoryBackground.toLowerCase().includes(query);
        const inTemplate = p.template.toLowerCase().includes(query);
        const inCategory = p.categoryLabel.toLowerCase().includes(query);
        return inTitle || inSummary || inTheory || inTemplate || inCategory;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      {/* 1. Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm tracking-tighter">
              LC
            </span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap text-left"
            >
              리더스코어 프롬프트
            </button>
          </div>

          {/* Zone 2: Navigation Links (concise, single-line text links) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setSelectedCategory('metacognition')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'metacognition' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              메타인지·의사결정
            </button>
            <button
              onClick={() => setSelectedCategory('regulatory_focus')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'regulatory_focus' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              조절초점·동기부여
            </button>
            <button
              onClick={() => setSelectedCategory('trust_relationship')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'trust_relationship' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              신뢰·관계형성
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="테마 전환"
              title={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
              <span>조절초점 진단기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>팀장을 위한 심리학 프레임워크 툴킷</span>
                <span aria-hidden="true">·</span>
                <span>선별된 3대 핵심 카테고리</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                직관을 넘어서는 팀장의 의사결정 & 코칭 프롬프트
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                방대한 양의 일반 프롬프트를 걷어내고, 현업 리더에게 가장 절실한 <strong>메타인지·의사결정</strong>, <strong>조절초점 동기부여</strong>, <strong>신뢰·관계형성</strong> 3가지 영역만 선별하여 즉시 복사하고 AI로 시뮬레이션할 수 있습니다.
              </p>
            </div>

            {/* Quick Diagnostic Shortcuts */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsChecklistOpen(true)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                <span>메타인지 체크리스트</span>
              </button>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>팀원 성향 진단 (향상 vs 예방)</span>
              </button>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {CATEGORIES.map((cat) => {
              const count = PROMPTS_DATA.filter((p) => p.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {cat.label}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                      {count}개 프롬프트
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Bar & Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          {/* Functional Segmented Controls (Interactive Filter buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              전체 ({PROMPTS_DATA.length})
            </button>
            <button
              onClick={() => setSelectedCategory('metacognition')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'metacognition'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              메타인지와 의사결정
            </button>
            <button
              onClick={() => setSelectedCategory('regulatory_focus')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'regulatory_focus'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              동기부여와 조절초점
            </button>
            <button
              onClick={() => setSelectedCategory('trust_relationship')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'trust_relationship'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              신뢰와 관계형성
            </button>
            <button
              onClick={() => setSelectedCategory('favorites')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                selectedCategory === 'favorites'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>저장됨 ({favorites.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상황, 키워드 검색 (예: 1on1, 번아웃, 사전부검)"
              className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Description */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            총 <strong className="text-slate-900 dark:text-white tabular-nums">{filteredPrompts.length}</strong>개의 실전 프롬프트가 표시됩니다.
          </span>
          {searchQuery && (
            <span>
              검색어: <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{searchQuery}"</span>
            </span>
          )}
        </div>

        {/* Prompt Cards Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isFavorite={favorites.includes(prompt.id)}
                onToggleFavorite={toggleFavorite}
                onRunSimulation={handleOpenSimulation}
                onCopyNotice={showCopyNotice}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                검색 조건에 일치하는 프롬프트가 없습니다
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                다른 키워드로 검색하거나 전체 카테고리를 선택해 보세요.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors"
            >
              전체 프롬프트 보기
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">리더스코어 프롬프트</span>
            <span aria-hidden="true">·</span>
            <span>메타인지 · 조절초점 이론 · 신뢰와 심리적 안전감</span>
          </div>
          <div>
            팀장의 1on1, 피드백, 의사결정을 지원하는 실전 프롬프트 툴킷
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <RegulatoryFocusQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectPromptCategory={(cat) => setSelectedCategory(cat as CategoryType)}
      />

      <MetacognitionChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        onOpenPrompt={(promptId) => {
          setSelectedCategory('all');
          setSearchQuery(promptId);
        }}
      />

      {simModalState.prompt && (
        <AISimulateModal
          isOpen={simModalState.isOpen}
          onClose={() => setSimModalState((prev) => ({ ...prev, isOpen: false }))}
          promptTitle={simModalState.prompt.title}
          categoryLabel={simModalState.prompt.categoryLabel}
          finalPrompt={simModalState.finalPrompt}
        />
      )}
    </div>
  );
}
