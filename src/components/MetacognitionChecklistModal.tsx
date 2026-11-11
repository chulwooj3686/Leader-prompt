import React, { useState } from 'react';
import { X, CheckSquare, Square, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrompt?: (promptId: string) => void;
}

interface CheckItem {
  id: string;
  title: string;
  question: string;
  biasPrevented: string;
  promptIdToOpen: string;
}

const CHECK_ITEMS: CheckItem[] = [
  {
    id: 'bias-confirmation',
    title: '확증 편향(Confirmation Bias) 점검',
    question: '내 마음에 드는 데이터나 찬성하는 팀원의 의견에만 무게를 두고, 불편한 반대 정황을 "예외"로 치부하고 있지 않은가?',
    biasPrevented: '보고 싶은 것만 보는 확증 편향 방지',
    promptIdToOpen: 'meta-premortem',
  },
  {
    id: 'bias-type1-type2',
    title: '결정 가역성(Type 1 vs Type 2) 분리',
    question: '이 결정은 돌이킬 수 없는 중대한 결정(Type 1)인가, 아니면 실행 후 빠르게 궤도를 수정할 수 있는 가역적 결정(Type 2)인가?',
    biasPrevented: '사소한 결정에 시간 낭비하거나, 중대한 결정을 즉흥적으로 내리는 오류 방지',
    promptIdToOpen: 'meta-delegation-triage',
  },
  {
    id: 'bias-second-order',
    title: '2차·3차 파급효과(Second-Order Thinking)',
    question: '당장의 긴급 불을 끄는 조치가 3개월 뒤 팀원들의 번아웃, 기술 부채, 또는 조직 문화의 왜곡으로 이어지지 않는가?',
    biasPrevented: '단기 처방에 매몰되어 장기적 치명상을 입는 근시안적 사고 방지',
    promptIdToOpen: 'meta-second-order',
  },
  {
    id: 'bias-fatigue',
    title: '결정 피로도(Decision Fatigue) 의식',
    question: '오늘 내가 연속된 회의와 피로로 인해 "그냥 대충 빨리 끝내자"는 무의식적 타협을 하고 있지는 않은가?',
    biasPrevented: '체력 고갈 상태에서 발생하는 비합리적 의사결정 방지',
    promptIdToOpen: 'meta-intellectual-humility',
  },
  {
    id: 'bias-humility',
    title: '지적 겸손과 사각지대(Unknown Unknowns)',
    question: '"어떤 새로운 증거가 나타나면 내 결정을 기꺼이 번복할 것인가?"에 대한 기준을 사전에 세워두었는가?',
    biasPrevented: '권위주의적 고집과 사후 과잉 확신 편향 방지',
    promptIdToOpen: 'meta-intellectual-humility',
  },
];

export const MetacognitionChecklistModal: React.FC<Props> = ({ isOpen, onClose, onOpenPrompt }) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progress = Math.round((checkedIds.length / CHECK_ITEMS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              인지심리학 기반 의사결정 안전망
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              리더의 메타인지 의사결정 5대 체크리스트
            </h2>
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
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-sky-900 dark:text-sky-200 leading-relaxed">
              메타인지(Metacognition)란 <strong>'나 자신의 생각을 제3자의 시선에서 객관적으로 관찰하는 힘'</strong>입니다. 중대한 결정을 서명하거나 팀에 공표하기 전, 5가지 항목을 스스로 점검해 보세요.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>점검 완료율</span>
              <span className="tabular-nums">{checkedIds.length} / {CHECK_ITEMS.length} ({progress}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 dark:bg-sky-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {CHECK_ITEMS.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-sky-300 dark:border-sky-700 bg-sky-50/30 dark:bg-sky-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 text-sky-600 dark:text-sky-400 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(item.id);
                      }}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${isChecked ? 'text-sky-900 dark:text-sky-200' : 'text-slate-900 dark:text-slate-100'}`}>
                          {item.title}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                          {item.biasPrevented}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.question}
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenPrompt?.(item.promptIdToOpen);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>관련 프롬프트로 이동하여 AI와 점검하기</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {progress === 100 ? '모든 메타인지 점검을 완료했습니다!' : '각 항목을 솔직하게 점검해 보세요.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg transition-colors"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};
