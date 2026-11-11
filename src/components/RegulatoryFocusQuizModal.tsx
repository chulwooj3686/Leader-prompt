import React, { useState } from 'react';
import { X, Check, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromptCategory?: (categoryId: string) => void;
}

interface Question {
  id: number;
  question: string;
  optionA: { text: string; type: 'promotion'; label: '향상초점 지향' };
  optionB: { text: string; type: 'prevention'; label: '예방초점 지향' };
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: '새로운 프로젝트를 맡겼을 때 팀원이 먼저 반응하는 방식은?',
    optionA: {
      text: '"이걸로 우리 팀이 어떤 혁신을 이루고 얼마나 성장할 수 있을까요?"',
      type: 'promotion',
      label: '향상초점 지향',
    },
    optionB: {
      text: '"기한과 요구사항이 무엇이며, 실패할 위험 요소는 어떤 것들이 있나요?"',
      type: 'prevention',
      label: '예방초점 지향',
    },
  },
  {
    id: 2,
    question: '업무 중 실수를 했을 때 팀원의 태도는?',
    optionA: {
      text: '실수에 크게 위축되기보다 "다음엔 이렇게 만회해 보겠습니다"라며 새 아이디어를 냄',
      type: 'promotion',
      label: '향상초점 지향',
    },
    optionB: {
      text: '스스로를 심하게 자책하며, 재발 방지를 위해 프로세스 규칙과 체크리스트를 꼼꼼히 정리함',
      type: 'prevention',
      label: '예방초점 지향',
    },
  },
  {
    id: 3,
    question: '팀원에게 가장 큰 동기부여가 되는 칭찬은?',
    optionA: {
      text: '"정말 도전적이고 창의적인 시도였어! 네 잠재력이 돋보인다."',
      type: 'promotion',
      label: '향상초점 지향',
    },
    optionB: {
      text: '"덕분에 단 하나의 오류도 없이 완벽하게 납기를 지켰어. 든든하고 신뢰가 간다."',
      type: 'prevention',
      label: '예방초점 지향',
    },
  },
  {
    id: 4,
    question: '반복적이거나 정형화된 일상 운영 업무를 대할 때?',
    optionA: {
      text: '지루해하고 집중력이 떨어지며, 자꾸 자동화하거나 새 방식으로 바꾸고 싶어 함',
      type: 'promotion',
      label: '향상초점 지향',
    },
    optionB: {
      text: '안정감을 느끼며, 누락이나 오탈자 없이 묵묵하고 정확하게 처리함',
      type: 'prevention',
      label: '예방초점 지향',
    },
  },
  {
    id: 5,
    question: '의사결정 시 팀원의 기본 직관은?',
    optionA: {
      text: '"시도하지 않아서 좋은 기회를 놓치는 것(실기)이 가장 아깝다."',
      type: 'promotion',
      label: '향상초점 지향',
    },
    optionB: {
      text: '"불확실한 상태에서 섣불리 추진하다 손해를 보는 것(실책)이 가장 위험하다."',
      type: 'prevention',
      label: '예방초점 지향',
    },
  },
];

export const RegulatoryFocusQuizModal: React.FC<Props> = ({ isOpen, onClose, onSelectPromptCategory }) => {
  const [answers, setAnswers] = useState<Record<number, 'promotion' | 'prevention'>>({});
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (qId: number, type: 'promotion' | 'prevention') => {
    setAnswers((prev) => ({ ...prev, [qId]: type }));
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  const promotionCount = Object.values(answers).filter((v) => v === 'promotion').length;
  const preventionCount = Object.values(answers).filter((v) => v === 'prevention').length;
  const totalAnswered = Object.keys(answers).length;
  const isComplete = totalAnswered === QUESTIONS.length;

  const isPromotionDominant = promotionCount > preventionCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Higgins 조절초점 이론 기반
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              팀원 동기부여 성향 진단기 (향상초점 vs 예방초점)
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
        <div className="p-6 overflow-y-auto space-y-6">
          {!showResult ? (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                특정 팀원을 한 명 떠올려 보세요. 다음 5가지 질문에 그 팀원의 실제 평소 행동 양식과 더 가까운 항목을 선택해 주세요.
              </p>

              <div className="space-y-5">
                {QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      Q{idx + 1}. {q.question}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <button
                        onClick={() => handleSelect(q.id, 'promotion')}
                        className={`text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all ${
                          answers[q.id] === 'promotion'
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center border ${
                            answers[q.id] === 'promotion' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {answers[q.id] === 'promotion' && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span>{q.optionA.text}</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelect(q.id, 'prevention')}
                        className={`text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all ${
                          answers[q.id] === 'prevention'
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center border ${
                            answers[q.id] === 'prevention' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {answers[q.id] === 'prevention' && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span>{q.optionB.text}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900">
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">진단 결과 분석</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  이 팀원은 <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{isPromotionDominant ? '향상초점 (Promotion Focus)' : '예방초점 (Prevention Focus)'}</span> 성향이 우세합니다.
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isPromotionDominant
                    ? '성장, 자율성, 이상적인 비전에 반응하는 타입입니다. 세세한 규칙으로 옥죄기보다 큰 방향성을 제시하고 자율권을 부여할 때 최고의 성과를 냅니다.'
                    : '안정감, 무결점, 정확한 약속 이행에 반응하는 타입입니다. 모호한 지시 대신 명확한 가이드라인과 심리적 안전망을 제공할 때 안심하고 몰입합니다.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>향상 지향 응답: {promotionCount}개 ({Math.round((promotionCount / 5) * 100)}%)</span>
                  <span>예방 지향 응답: {preventionCount}개 ({Math.round((preventionCount / 5) * 100)}%)</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">팀장을 위한 실전 행동 권장안:</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-5">
                  {isPromotionDominant ? (
                    <>
                      <li><strong>비전 자극:</strong> "이 프로젝트가 끝나면 당신은 어떤 전문가로 성장해 있을까요?"를 질문하세요.</li>
                      <li><strong>마감 관리:</strong> 규칙을 강요하기보다 "당신의 멋진 아이디어가 완성되려면 일정 체크가 무기"라고 프레이밍하세요.</li>
                      <li><strong>금기어:</strong> "그냥 시키는 대로만 해", "새로운 시도 하지 마"</li>
                    </>
                  ) : (
                    <>
                      <li><strong>안전망 확보:</strong> "최종 책임은 팀장인 내가 지니, 리스크 예방 프로세스에 집중해 주세요"라고 안심시키세요.</li>
                      <li><strong>구체성 부여:</strong> 모호하게 던져주지 말고, 단계별 기대치와 완료 기준(Definition of Done)을 명시하세요.</li>
                      <li><strong>금기어:</strong> "일단 대충 아무렇게나 해서 던져봐", "왜 이렇게 불안해해?"</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onSelectPromptCategory?.('regulatory_focus');
                  }}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <span>해당 성향 맞춤 프롬프트 보러가기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시 테스트하기</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showResult && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              진행 상황: {totalAnswered} / {QUESTIONS.length} 문항 완료
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
              >
                닫기
              </button>
              <button
                disabled={!isComplete}
                onClick={handleCalculate}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isComplete
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                진단 결과 확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
