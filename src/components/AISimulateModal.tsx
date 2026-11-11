import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, RefreshCw, AlertCircle, Bot } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promptTitle: string;
  categoryLabel: string;
  finalPrompt: string;
}

export const AISimulateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  promptTitle,
  categoryLabel,
  finalPrompt,
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResponse('');
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          category: categoryLabel,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `서버 응답 오류 (${res.status})`);
      }

      const data = await res.json();
      setResponse(data.text || '응답을 받지 못했습니다.');
    } catch (err: any) {
      setError(err?.message || '시뮬레이션 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && finalPrompt) {
      runSimulation();
    }
  }, [isOpen, finalPrompt]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Gemini 3.8 Flash AI 코칭</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-md sm:max-w-xl">
                {promptTitle} 시뮬레이션
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Prompt Preview Accordion */}
          <details className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <summary className="px-4 py-3 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center justify-between hover:text-slate-900 dark:hover:text-white">
              <span>입력된 커스텀 프롬프트 보기 (클릭하여 펼치기)</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 pt-1">
              <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
                {finalPrompt}
              </pre>
            </div>
          </details>

          {/* AI Response Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI 리더십 솔루션 & 실전 대화 스크립트</span>
              </div>
              {response && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>답변 전체 복사</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {loading && (
              <div className="p-12 text-center space-y-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="inline-block animate-spin text-indigo-600 dark:text-indigo-400">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  조직심리학 및 리더십 코칭 관점에서 최적의 솔루션을 생성하고 있습니다...
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Gemini 3.8 Flash 엔진이 편향 점검과 맞춤 대화 스크립트를 작성 중입니다.
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>시뮬레이션 생성 실패</span>
                </div>
                <p className="text-xs text-rose-600 dark:text-rose-300">{error}</p>
                <button
                  onClick={runSimulation}
                  className="mt-2 text-xs font-medium px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors"
                >
                  다시 시도
                </button>
              </div>
            )}

            {response && !loading && (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap space-y-4">
                {response}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            생성된 대화 스크립트를 복사하여 1on1 면담 전 시뮬레이션용으로 활용하세요.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={runSimulation}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>재생성</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
