import React, { useState } from 'react';
import { PromptItem } from '../data/prompts';
import { Copy, Check, Sparkles, Star, ChevronDown, ChevronUp, BookOpen, Clock, Sliders } from 'lucide-react';

interface Props {
  prompt: PromptItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onRunSimulation: (prompt: PromptItem, finalPrompt: string) => void;
  onCopyNotice: (title: string) => void;
}

export const PromptCard: React.FC<Props> = ({
  prompt,
  isFavorite,
  onToggleFavorite,
  onRunSimulation,
  onCopyNotice,
}) => {
  // Local state for variable values
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompt.variables.forEach((v) => {
      initial[v.key] = v.defaultValue;
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  // Compute final prompt by replacing {{key}}
  const getRenderedPrompt = () => {
    let result = prompt.template;
    prompt.variables.forEach((v) => {
      const val = variableValues[v.key]?.trim() || v.defaultValue;
      result = result.split(`{{${v.key}}}`).join(val);
    });
    return result;
  };

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const textToCopy = getRenderedPrompt();
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopyNotice(prompt.title);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderedPrompt = getRenderedPrompt();

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between">
      {/* Top Header & Metadata */}
      <div className="p-6 pb-4 space-y-4">
        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {prompt.categoryLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>실전 템플릿</span>
          </div>

          <button
            onClick={() => onToggleFavorite(prompt.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFavorite ? '저장 해제' : '자주 쓰는 프롬프트로 저장'}
            aria-label="즐겨찾기 토글"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Title & Summary */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {prompt.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {prompt.summary}
          </p>
        </div>

        {/* Theoretical Grounding & Usage Timing */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-700 dark:text-slate-300">이론 배경:</strong> {prompt.theoryBackground}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-700 dark:text-slate-300">추천 타이밍:</strong> {prompt.whenToUse}
            </span>
          </div>
        </div>

        {/* Variable Customizer Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowVariables(!showVariables)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {showVariables ? '내 상황 맞춤 변수 닫기' : '내 상황 맞춤 변수 입력하기 (팀원 이름, 상황 등)'}
            </span>
            {showVariables ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Variables Input Panel */}
          {showVariables && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                실제 팀원 이름이나 프로젝트명을 입력하면 프롬프트에 실시간 반영됩니다:
              </div>
              <div className="space-y-2.5">
                {prompt.variables.map((v) => (
                  <div key={v.key} className="space-y-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                      {v.label}
                    </label>
                    <input
                      type="text"
                      value={variableValues[v.key] ?? v.defaultValue}
                      onChange={(e) => handleVariableChange(v.key, e.target.value)}
                      placeholder={v.placeholder}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prompt Preview Snippet */}
        <div className="relative">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
            <span>프롬프트 본문 미리보기</span>
            <span className="font-mono text-[11px] text-slate-400">
              {renderedPrompt.length} 자
            </span>
          </div>
          <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-50/70 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/90 whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto selection:bg-indigo-100">
            {renderedPrompt}
          </pre>
        </div>
      </div>

      {/* Action Footer & Practical Tips */}
      <div className="p-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* 1-Click Copy */}
          <button
            onClick={handleCopyPrompt}
            className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>프롬프트 복사</span>
              </>
            )}
          </button>

          {/* AI Simulation Test */}
          <button
            onClick={() => onRunSimulation(prompt, renderedPrompt)}
            className="py-2 px-3.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-950 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI 시뮬레이션 실행</span>
          </button>
        </div>

        {/* Action Tips Toggle */}
        <div>
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full text-left py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-between transition-colors"
          >
            <span className="font-medium">팀장을 위한 실전 행동 팁 & 말실수 방지 가이드</span>
            {showTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTips && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 animate-in fade-in duration-150">
              <ul className="list-disc pl-4 space-y-1">
                {prompt.actionTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
