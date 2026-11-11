export type CategoryType = 'metacognition' | 'regulatory_focus' | 'trust_relationship';

export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}

export interface PromptItem {
  id: string;
  category: CategoryType;
  categoryLabel: string;
  title: string;
  summary: string;
  theoryBackground: string;
  whenToUse: string;
  template: string;
  variables: PromptVariable[];
  actionTips: string[];
  sampleOutputSnippet?: string;
}

export const CATEGORIES: { id: CategoryType; label: string; desc: string; icon: string }[] = [
  {
    id: 'metacognition',
    label: '메타인지와 의사결정 판단력',
    desc: '자신의 생각과 인지적 편향을 객관화하고, 확증 편향과 사각지대를 예방하는 의사결정 프롬프트',
    icon: 'Brain',
  },
  {
    id: 'regulatory_focus',
    label: '동기부여와 조절초점 이론',
    desc: '팀원의 성향(성장 지향의 향상초점 vs 안정 지향의 예방초점)에 맞춘 맞춤형 코칭 및 피드백 프롬프트',
    icon: 'Target',
  },
  {
    id: 'trust_relationship',
    label: '신뢰와 관계형성',
    desc: '심리적 안전감을 조성하고, 비난 없는 피드백과 취약성 공유를 통해 견고한 신뢰를 다지는 대화 프롬프트',
    icon: 'HeartHandshake',
  },
];

export const PROMPTS_DATA: PromptItem[] = [
  // ---------------------------------------------------------
  // 1. 메타인지와 의사결정 판단력
  // ---------------------------------------------------------
  {
    id: 'meta-premortem',
    category: 'metacognition',
    categoryLabel: '메타인지와 의사결정 판단력',
    title: '의사결정 사전 부검(Pre-Mortem) 및 인지 편향 점검',
    summary: '결정을 확정하기 전, 이미 1년 뒤 프로젝트가 완벽히 실패했다고 가정하여 리더의 낙관 편향을 제거합니다.',
    theoryBackground: '심리학자 개리 클라인(Gary Klein)의 사전 부검 기법 및 대니얼 카너먼의 확증 편향(Confirmation Bias) 억제 프레임워크 기반.',
    whenToUse: '신규 전략, 대규모 프로젝트 론칭, 조직 개편 등 중대한 의사결정을 최종 승인하기 직전',
    variables: [
      { key: 'decision_topic', label: '결정 과제명', placeholder: '예: 2분기 신규 B2B 기능 출시', defaultValue: '신규 전략 프로젝트 추진' },
      { key: 'core_assumption', label: '주요 전제 조건', placeholder: '예: 고객 전환율 15% 달성 가능할 것이라는 전제', defaultValue: '기존 인력만으로 3개월 내 개발 완료 가능하다는 전제' },
      { key: 'leader_feeling', label: '현재 리더의 직관/우려', placeholder: '예: 일정은 맞출 수 있을 것 같으나 QA가 촉박함', defaultValue: '일정은 맞출 수 있을 것 같으나 팀 피로도가 걱정됨' },
    ],
    template: `[역할 부여]
너는 최고 경영진의 전략적 의사결정을 검증하는 '악마의 변호인(Devil's Advocate)'이자 인지심리학 기반의 수석 코치야.

[상황 맥락]
- 검토 중인 의사결정 과제: {{decision_topic}}
- 현재 우리가 깔고 있는 핵심 전제: {{core_assumption}}
- 리더인 나의 현재 느낌/우려: {{leader_feeling}}

[요청 사항: 사전 부검(Pre-Mortem) 프로세스]
지금은 이 의사결정을 실행한 지 1년 후 시점이야. 결과적으로 이 프로젝트는 '완벽한 실패'로 끝났어. 

다음 4가지 관점에서 나의 결정을 냉정하게 비판하고 점검해 줘:
1. [인지적 맹점(Blind Spot) 분석]: 내가 '확증 편향'이나 '낙관적 계획 오류(Planning Fallacy)'로 인해 간과했을 법한 치명적 변수 3가지
2. [전제 조건의 붕괴 시나리오]: 우리가 믿고 있는 '{{core_assumption}}'이 완전히 빗나가는 구체적인 현실적 이유
3. [메타인지 자가 질문 5가지]: 내가 독단이나 결정 피로에 빠져 놓치고 있는 것을 깨닫게 해 줄 날카로운 질문 5선
4. [선제적 완화 조치]: 실패를 방지하기 위해 지금 당장 이 결정에 추가해야 할 안전장치(Guardrail)`,
    actionTips: [
      '회의에서 "이 아이디어의 단점이 뭘까?"라고 묻지 마세요. "이미 망했다고 치고 원인을 찾아보자"고 해야 팀원들이 솔직해집니다.',
      '리더 본인의 직관을 맹신하지 않고 전제 조건을 포스트잇에 적어 가시화해 보세요.',
    ],
  },
  {
    id: 'meta-second-order',
    category: 'metacognition',
    categoryLabel: '메타인지와 의사결정 판단력',
    title: '2차적 사고(Second-Order Thinking) 파급효과 시뮬레이터',
    summary: '당장의 편리함이나 단기 해결책 뒤에 숨은 2차·3차 나비효과와 의도치 않은 부작용을 사전에 파악합니다.',
    theoryBackground: '하워드 막스(Howard Marks)의 2차적 사고 및 시스템 다이내믹스(System Dynamics) 이론 기반.',
    whenToUse: '단기 성과를 위해 긴급 조치를 취하려 할 때, 규칙을 변경하거나 인력을 재배치할 때',
    variables: [
      { key: 'immediate_action', label: '취하려는 1차 조치', placeholder: '예: 마감 기한을 맞추기 위해 주말 특근 승인', defaultValue: '일정을 맞추기 위해 코드 리뷰 절차를 간소화함' },
      { key: 'intended_benefit', label: '기대하는 즉각적 효과', placeholder: '예: 이번 주 스프린트 목표 100% 달성', defaultValue: '출시일을 2주 앞당겨 시장 선점' },
      { key: 'affected_groups', label: '영향을 받는 대상', placeholder: '예: 개발팀 주니어, CS 운영팀, 기존 고객', defaultValue: '개발팀원, QA 엔지니어, 최종 사용자' },
    ],
    template: `[역할 부여]
너는 복잡계 조직 관리 및 장기 전략을 평가하는 시스템 사고 전문가야.

[결정 상황]
- 검토 중인 1차 조치: {{immediate_action}}
- 기대하는 1차 효과: {{intended_benefit}}
- 이해관계자: {{affected_groups}}

[요청 사항]
단기적 성과(1차적 사고)에 매몰되지 않고, 다음 단계의 파급효과(2차·3차 사고)를 메타인지적으로 조망할 수 있도록 분석해 줘:

1. [1차 효과 (And then what?)]: '{{immediate_action}}'을 실행했을 때 당장 나타나는 긍정적/부정적 즉각 결과
2. [2차 파급효과 (3~6개월 후)]: {{affected_groups}}에게 나타날 태도 변화, 기술 부채, 사기 저하 등 의도치 않은 부작용
3. [3차 시스템적 결과 (1년 후)]: 조직 문화나 시스템 전반에 미칠 만성적 왜곡 현상
4. [리더의 메타인지 체크리스트]: "내가 지금 문제를 해결하고 있는가, 아니면 단지 문제의 발생 시점을 미래로 미루고 있는가?"를 스스로 평가할 기준 3가지`,
    actionTips: [
      '결정 직전 "그리고 나면 무슨 일이 일어나는가?(And then what?)"를 최소 3번 반복 질문하세요.',
      '즉각적 보상이 큰 결정일수록 2차적 비용이 높다는 점을 인지해야 합니다.',
    ],
  },
  {
    id: 'meta-intellectual-humility',
    category: 'metacognition',
    categoryLabel: '메타인지와 의사결정 판단력',
    title: '모르는 것을 아는 지적 겸손(Intellectual Humility) 질문지',
    summary: '리더가 자신의 지식과 경험에 갇혀 오판하지 않도록, 사각지대(Unknown Unknowns)를 수면 위로 끌어올립니다.',
    theoryBackground: '더닝-크루거 효과 극복 및 소크라테스식 메타인지 산파술(Socratic Metacognition) 기반.',
    whenToUse: '자신이 가장 잘 안다고 확신하는 분야의 프로젝트를 주도할 때, 혹은 팀원의 다른 의견에 방어적으로 반응할 때',
    variables: [
      { key: 'topic', label: '다루고 있는 영역/주제', placeholder: '예: 마케팅 퍼널 개편 및 광고비 집행', defaultValue: '제품 포지셔닝 및 가격 정책 변경' },
      { key: 'leader_belief', label: '리더가 확신하는 명제', placeholder: '예: 가격을 20% 낮추면 유입이 2배로 뛸 것이다', defaultValue: '기능을 더 추가해야 고객 이탈을 막을 수 있다' },
    ],
    template: `[역할 부여]
너는 리더의 지적 겸손(Intellectual Humility)을 훈련시키는 시니어 코치야.

[상황]
- 주제: {{topic}}
- 내가 강하게 확신하고 있는 생각: {{leader_belief}}

[요청 사항]
내가 '사후 과잉 확신 편향(Hindsight Bias)'이나 '권위 편향'에 빠지지 않도록 메타인지 점검 질문을 설계해 줘:
1. [반증 가능성 질문]: "어떤 데이터나 증거가 나오면 나의 확신('{{leader_belief}}')을 철회할 것인가?"
2. [정보 불완전성 진단]: 내가 현재 '안다고 착각하는 것(Knowns)'과 '실제로는 검증되지 않은 가정(Unknowns)'을 구분하는 질문 3가지
3. [팀원 관점 역지사지]: 현업 실무자 관점에서 내 생각이 비현실적으로 보일 수 있는 가장 그럴듯한 이유
4. [실전 미팅 화법]: 회의 때 내 권위를 내려놓고 팀원들로부터 숨겨진 반대 의견을 끌어내는 질문 스크립트 3문장`,
    actionTips: [
      '"내 생각엔 이래" 대신 "내가 놓치고 있는 정보가 무엇일까?"를 회의 서두에 선언해 보세요.',
      '반대 의견을 낸 팀원에게 "그 관점을 지적해줘서 고맙다"고 공개적으로 인정하면 메타인지적 안전망이 강화됩니다.',
    ],
  },
  {
    id: 'meta-delegation-triage',
    category: 'metacognition',
    categoryLabel: '메타인지와 의사결정 판단력',
    title: '의사결정 피로도 진단 및 위임(Delegation) 매트릭스',
    summary: '리더가 모든 병목이 되는 마이크로매니징을 탈피하고, 가역적 결정과 비가역적 결정을 분리하여 권한을 위임합니다.',
    theoryBackground: '제프 베조스의 Type 1(비가역적 일방통행 문) vs Type 2(가역적 양방통행 문) 의사결정 모델.',
    whenToUse: '결재와 승인이 밀려 매일 야근하고 팀원들이 사소한 결정도 리더에게 가져올 때',
    variables: [
      { key: 'pending_tasks', label: '현재 리더가 붙잡고 있는 결정들', placeholder: '예: UI 디자인 시안 승인, 협력업체 미팅 일정, 보고서 문구 수정', defaultValue: '랜딩페이지 문구 승인, 주간 업무 분장, 예산 소액 집행 승인' },
      { key: 'team_seniority', label: '팀원들의 평균 숙련도', placeholder: '예: 2~3년 차 주니어 중심', defaultValue: '3~5년 차 미드레벨 실무진' },
    ],
    template: `[역할 부여]
너는 구글/아마존 스타일의 민첩한 조직 운영 전문가이자 리더십 코치야.

[현안]
- 내가 현재 결정을 내리지 못해 지체되고 있는 과제들: {{pending_tasks}}
- 팀원 구성: {{team_seniority}}

[요청 사항]
1. [Type 1 vs Type 2 판별]: 위 결정들을 '되돌릴 수 없는 결정(Type 1: 신중히 검토)'과 '언제든 되돌릴 수 있는 결정(Type 2: 즉시 위임)'으로 분류해 줘.
2. [위임 기준 정의서]: 팀원들이 스스로 판단하고 실행할 수 있도록 하는 '결정 가이드라인(Guardrail) 3원칙'을 수립해 줘.
3. [위임 선언 스크립트]: "이제부터 이 영역은 여러분이 직접 결정하고, 결과만 사후 공유해 주세요"를 불안감 없이 팀원에게 전달하는 1on1 화법.
4. [리더의 자기검열]: "내가 왜 이 권한을 놓지 못하고 있었는가?"에 대한 심리적 원인(통제 욕구, 불신 등) 메타인지 피드백.`,
    actionTips: [
      '되돌릴 수 있는 결정(Type 2)은 70%의 정보만 모였을 때 바로 실행하고 수정하는 것이 최선입니다.',
      '위임은 방임이 아닙니다. 실패했을 때 책임은 리더가 진다는 안전장치를 명확히 말로 표현하세요.',
    ],
  },

  // ---------------------------------------------------------
  // 2. 동기부여와 조절초점 이론
  // ---------------------------------------------------------
  {
    id: 'reg-promotion-coaching',
    category: 'regulatory_focus',
    categoryLabel: '동기부여와 조절초점 이론',
    title: '향상초점(Promotion Focus) 팀원 맞춤 성장·비전 코칭',
    summary: '도전, 성장, 보상, 혁신에 심장이 뛰는 팀원에게 날개를 달아주고 실행 디테일을 보완하도록 이끕니다.',
    theoryBackground: 'E. Tory Higgins의 조절초점 이론 (Regulatory Focus Theory) - 이상적 자아(Ideal Self) 자극.',
    whenToUse: '새로운 시도를 좋아하지만 마무리가 약하거나, 반복적 일상 업무에 지루해하는 팀원과 면담할 때',
    variables: [
      { key: 'member_name', label: '팀원 이름/호칭', placeholder: '예: 민수 님', defaultValue: '김 팀원' },
      { key: 'assigned_project', label: '부여할 프로젝트/과제', placeholder: '예: 신규 시장 개척 및 전략 제안서 작성', defaultValue: '신규 고객사 온보딩 자동화 기획' },
      { key: 'current_bottleneck', label: '보완이 필요한 약점', placeholder: '예: 아이디어는 화려하나 일정 관리가 미흡함', defaultValue: '아이디어는 좋으나 세부 마감일 준수와 오탈자 검수가 약함' },
    ],
    template: `[역할 부여]
너는 E. Tory Higgins의 조절초점 이론(Regulatory Focus Theory)을 깊이 이해한 조직 리더십 컨설턴트야.

[팀원 프로필]
- 대상: {{member_name}} (성향: 강한 '향상초점' - 성취, 비전, 인정, 새로움에 강하게 동기부여됨)
- 프로젝트: {{assigned_project}}
- 보완점: {{current_bottleneck}}

[요청 사항]
향상초점 팀원의 동기 에너지를 꺾지 않으면서도 디테일과 마감을 챙기게 하는 맞춤 코칭 스크립트를 작성해 줘:
1. [오프닝 & 비전 제안]: 이 프로젝트가 {{member_name}}의 커리어와 조직에 가져올 '성장과 기회의 크기'를 가시화하는 대화 문장
2. [자율성 부여]: 규칙으로 옥죄지 않고 실험할 수 있는 여지를 주는 권한 위임 화법
3. [약점(디테일) 보완 요청법]: "안전/일정 관리도 성취를 완성하는 프로의 무기"라는 관점으로 {{current_bottleneck}}을 개선하도록 유도하는 프레임워크
4. [피해야 할 금기어 vs 추천 표현]: 향상초점 팀원의 의욕을 꺾는 말(예: "그냥 시키는 대로만 해")과 불을 지피는 말 대조표`,
    actionTips: [
      '향상초점 팀원에게 "실수하지 마"라고 하면 에너지가 급감합니다. "네 멋진 아이디어를 현실로 완성해보자"고 말하세요.',
      '중간 체크인은 마이크로매니징이 아니라 "추가로 필요한 지원이나 리소스가 있는지" 확인하는 형태로 접근하세요.',
    ],
  },
  {
    id: 'reg-prevention-coaching',
    category: 'regulatory_focus',
    categoryLabel: '동기부여와 조절초점 이론',
    title: '예방초점(Prevention Focus) 팀원 맞춤 안정·품질 피드백',
    summary: '정확성, 안전, 책임감, 손실 방지에 민감한 팀원에게 확고한 가이드라인과 심리적 안전망을 제공합니다.',
    theoryBackground: 'E. Tory Higgins의 조절초점 이론 (Regulatory Focus Theory) - 당위적 자아(Ought Self) 및 심리적 안전감.',
    whenToUse: '꼼꼼하지만 새로운 시도를 두려워하거나, 실패에 대한 불안으로 시작을 망설이는 팀원과 대화할 때',
    variables: [
      { key: 'member_name', label: '팀원 이름/호칭', placeholder: '예: 지은 님', defaultValue: '이지은 님' },
      { key: 'assigned_project', label: '부여할 프로젝트/과제', placeholder: '예: 핵심 결제 시스템 마이그레이션 QA', defaultValue: '고객 데이터 이전 및 규정 준수 검증' },
      { key: 'anxiety_point', label: '팀원이 불안해하는 요소', placeholder: '예: 만에 하나 데이터 유실 사고가 날까 봐 걱정함', defaultValue: '일정 내에 완벽하게 무오류 검증을 끝내지 못할까 봐 위축됨' },
    ],
    template: `[역할 부여]
너는 조절초점 이론(Regulatory Focus Theory) 전문 리더십 코치야.

[팀원 프로필]
- 대상: {{member_name}} (성향: 강한 '예방초점' - 신중함, 정확성, 약속 이행, 리스크 방지에 가치를 둠)
- 프로젝트: {{assigned_project}}
- 주된 불안/부담: {{anxiety_point}}

[요청 사항]
예방초점 팀원이 불안에 압도당하지 않고 탁월한 신중함을 발휘할 수 있도록 맞춤 지원 스크립트를 작성해 줘:
1. [심리적 안전망 확인]: "최종 책임은 팀장인 내가 진다"는 명확한 백스톱(Backstop) 선언 문구
2. [구체적 프로세스 및 체크리스트 제공]: 모호한 자율성 대신 명확한 절차와 기준을 명시하는 방법
3. [불안 완화 대화법]: {{anxiety_point}}에 대해 리스크를 단계별로 나누어 통제 가능하게 만드는 코칭 질문 3가지
4. [기여도 인정 화법]: 겉으로 드러나지 않는 '문제를 사전에 막아낸 공로'를 깊이 치하하는 맞춤형 피드백 예시`,
    actionTips: [
      '예방초점 팀원에게 "일단 대충 해보고 수정하자"는 극심한 스트레스를 줍니다. "최악의 시나리오를 대비할 시간을 줄게"라고 하세요.',
      '이들이 짚어내는 리스크를 "부정적인 태도"로 치부하지 말고 팀의 가장 강력한 방패로 인정해 주세요.',
    ],
  },
  {
    id: 'reg-fit-alignment',
    category: 'regulatory_focus',
    categoryLabel: '동기부여와 조절초점 이론',
    title: '동일 목표의 조절 적합성(Regulatory Fit) 맞춤형 변환기',
    summary: '하나의 팀 목표를 향상초점 팀원용 언어(기회/도약)와 예방초점 팀원용 언어(신뢰/무결점)로 각각 다르게 전달합니다.',
    theoryBackground: 'Higgins & Cesario의 조절 적합성 이론 (Regulatory Fit: 성향과 메시지 프레임이 일치할 때 가치와 몰입이 극대화됨).',
    whenToUse: '전체 팀 미팅에서 새로운 KPI를 공표하거나, 서로 다른 성향의 두 팀원에게 역할을 분담할 때',
    variables: [
      { key: 'team_goal', label: '팀의 전체 목표/KPI', placeholder: '예: 3분기 서비스 응답속도 50% 개선', defaultValue: '분기별 고객 문의 응답 시간 30분 이내로 단축' },
      { key: 'member_promotion', label: '향상초점 팀원 이름', placeholder: '예: 박 대리', defaultValue: '박 대리' },
      { key: 'member_prevention', label: '예방초점 팀원 이름', placeholder: '예: 최 과장', defaultValue: '최 과장' },
    ],
    template: `[역할 부여]
너는 행동경제학 및 조절초점 메시지 디자인 전문가야.

[목표 맥락]
- 전체 팀의 공동 목표: {{team_goal}}
- 향상초점(Promotion) 팀원: {{member_promotion}}
- 예방초점(Prevention) 팀원: {{member_prevention}}

[요청 사항]
동일한 목표({{team_goal}})를 두 팀원에게 전달할 때 각자의 심리적 모터가 켜지도록 메시지를 두 가지 버전으로 재작성해 줘:

버전 A: [{{member_promotion}}을 위한 향상초점 메시지]
- 키워드: 비전, 시장 리딩, 새로운 성취, 역량의 확장
- 전달 스크립트: 왜 이 목표가 가슴 뛰는 도전이며 본인의 커리어에 하이라이트가 될 수 있는지 강조하는 화법

버전 B: [{{member_prevention}}을 위한 예방초점 메시지]
- 키워드: 고객 신뢰 보호, 시스템 안정성, 누수 방지, 철저한 기준 준수
- 전달 스크립트: 왜 이 목표가 조직의 치명적 고객 이탈을 막아주는 안전벨트인지 명확히 짚어주는 화법

[비교 요약표]: 두 팀원에게 업무 피드백을 줄 때 사용할 칭찬/독려 표현 대조`,
    actionTips: [
      '향상형에게는 "달성 시 얻게 될 이득(Gain)"을, 예방형에게는 "미달성 시 겪게 될 손실 방지(Non-Loss)"를 강조하세요.',
      '둘을 한 팀으로 짝지어줄 때 향상형에게 초안/도전을, 예방형에게 검증/안전 점검을 맡기면 완벽한 시너지가 납니다.',
    ],
  },
  {
    id: 'reg-slump-recovery',
    category: 'regulatory_focus',
    categoryLabel: '동기부여와 조절초점 이론',
    title: '동기 정체기 팀원을 위한 성향별 리셋 프롬프트',
    summary: '슬럼프에 빠진 팀원이 향상초점인지 예방초점인지에 따라 전혀 다른 접근으로 동기 스위치를 다시 켭니다.',
    theoryBackground: '심리적 탈진(Burnout)의 원인별(성장 정체 vs 과도한 불안) 분해 및 조절초점 복원 모델.',
    whenToUse: '최근 업무 집중도가 떨어지고, 회의에서 침묵이 길어지며, 성과가 주춤한 팀원과 1on1 면담 전',
    variables: [
      { key: 'member_name', label: '팀원 이름', placeholder: '예: 정 선임', defaultValue: '정 선임' },
      { key: 'member_type', label: '팀원 성향', placeholder: '예: 향상초점 (도전/성장) 또는 예방초점 (안정/책임)', defaultValue: '예방초점 (실수에 대한 두려움으로 경직됨)' },
      { key: 'symptom', label: '관찰된 슬럼프 증상', placeholder: '예: 메신저 답장이 늦고 의견 제안을 전혀 안 함', defaultValue: '사소한 검토에도 과도하게 시간을 끌고 결정을 미룸' },
    ],
    template: `[역할 부여]
너는 번아웃 및 모티베이션 전문 심리 코치이자 리더십 고문이야.

[대상 정보]
- 팀원: {{member_name}}
- 추정 성향: {{member_type}}
- 관찰된 양상: {{symptom}}

[요청 사항]
상투적인 "요즘 힘들지? 힘내"라는 위로를 넘어, 팀원의 성향에 맞게 마음을 열고 회복하도록 돕는 1on1 가이드를 만들어 줘:
1. [슬럼프의 본질 진단]: {{member_type}} 관점에서 왜 {{symptom}} 같은 증상이 일어나는지 심리적 기제 설명
2. [면담 도입부 스크립트]: 평가받는다는 두려움을 즉각 해제하고 방어기제를 낮추는 3단계 질문
3. [부담 덜어주기 솔루션]: 향상초점일 경우(새로운 작은 실험 부여) vs 예방초점일 경우(우선순위 덜어내기 및 안전 확인)
4. [팀장이 절대 하지 말아야 할 말 3가지]`,
    actionTips: [
      '슬럼프에 빠진 예방형에게 "더 도전해봐"라고 하면 절망합니다. 업무의 30%를 덜어내어 숨통을 틔워주세요.',
      '향상형이 지쳐 있다면 일의 양 때문이 아니라 "내가 성장하지 못하고 쳇바퀴를 돈다"는 느낌 때문일 확률이 높습니다.',
    ],
  },

  // ---------------------------------------------------------
  // 3. 신뢰와 관계형성
  // ---------------------------------------------------------
  {
    id: 'trust-psychological-safety',
    category: 'trust_relationship',
    categoryLabel: '신뢰와 관계형성',
    title: '심리적 안전감(Psychological Safety)을 여는 1on1 오프닝',
    summary: '상태 점검(Status Check) 회의가 아닌, 팀원이 속마음과 진짜 병목을 털어놓게 만드는 정서적 앵커링 프롬프트.',
    theoryBackground: '에이미 에드먼드슨(Amy Edmondson)의 심리적 안전감 이론 및 앤디 그로브의 1on1 미팅 철학.',
    whenToUse: '주간 정기 1on1 면담 시작 시, 팀원이 업무 보고만 나열하려 할 때 분위기 전환용',
    variables: [
      { key: 'member_name', label: '팀원 이름', placeholder: '예: 영희 님', defaultValue: '박영희 님' },
      { key: 'recent_context', label: '팀원의 최근 상황', placeholder: '예: 최근 빡빡한 배포 일정을 막 끝냄', defaultValue: '어려운 고객 클레임 이슈를 수습한 직후' },
      { key: 'leader_intent', label: '팀장이 전하고 싶은 메시지', placeholder: '예: 업무 진행보다 너의 컨디션과 고충이 먼저다', defaultValue: '업무 성과 점검이 아니라 영희 님의 고민을 돕기 위한 시간이다' },
    ],
    template: `[역할 부여]
너는 에이미 에드먼드슨 교수의 '심리적 안전감' 연구를 기업 현장에 이식해 온 최고 코칭 전문가야.

[미팅 맥락]
- 대상: {{member_name}}
- 최근 배경: {{recent_context}}
- 리더의 핵심 의도: {{leader_intent}}

[요청 사항]
이번 1on1이 단순한 업무 진척 보고(Check-in)로 끝나지 않고, 진정한 신뢰를 쌓는 자리가 되도록 오프닝 스크립트와 질문을 구성해 줘:
1. [오프닝 30초 멘트]: 미팅의 주도권이 팀원에게 있음을 선언하고({{leader_intent}}), 긴장을 푸는 진정성 있는 멘트
2. [심리적 안전감을 여는 황금 질문 4선]:
   - 컨디션 및 에너지 레벨 점검 질문 (점수나 은유 활용)
   - "팀장인 내가 치워줘야 할 돌멩이(Obstacle)"를 묻는 질문
   - "최근 팀에서 말하기 조심스러웠던 부분"을 편하게 꺼내게 하는 질문
   - 커리어 지원에 관한 개방형 질문
3. [경청 태도 가이드]: 팀원이 말하는 동안 리더가 침묵(Wait time)을 유지하고 반응해야 할 비언어적 팁`,
    actionTips: [
      '1on1의 90%는 팀원이 말해야 합니다. 리더가 훈계하기 시작하면 그것은 1on1이 아니라 잔소리입니다.',
      '"어려운 거 없어요?"라고 묻지 마세요. 100% "네 없어요"라고 답합니다. "내가 도울 수 있는 한 가지만 꼽는다면?"으로 물으세요.',
    ],
  },
  {
    id: 'trust-blameless-postmortem',
    category: 'trust_relationship',
    categoryLabel: '신뢰와 관계형성',
    title: '비난 없는 사후 회고(Blameless Post-Mortem) 문제 해결 대화',
    summary: '실수가 발생했을 때 사람을 문책하지 않고 시스템과 프로세스를 개선하여, 다음에는 더 솔직하게 보고하도록 만듭니다.',
    theoryBackground: '구글의 SRE(사이트 신뢰성 엔지니어링) 무비난 회고 문화 및 존 듀이의 반성적 사고.',
    whenToUse: '배포 사고, 납기 지연, 고객 컴플레인 등 치명적인 실수가 터진 직후 수습 회의를 진행할 때',
    variables: [
      { key: 'incident_summary', label: '발생한 실수/장애 내용', placeholder: '예: 데이터베이스 마이그레이션 중 2시간 다운타임 발생', defaultValue: '중요 고객 보고서에 누락된 통계 데이터가 발송됨' },
      { key: 'involved_member', label: '해당 실무자/팀원', placeholder: '예: 정 대리', defaultValue: '정 대리' },
      { key: 'emotional_state', label: '실무자의 감정 상태', placeholder: '예: 심하게 자책하며 잔뜩 얼어붙어 있음', defaultValue: '자책감에 위축되어 눈치를 보고 있음' },
    ],
    template: `[역할 부여]
너는 구글 SRE 조직 문화 및 고성과 팀 신뢰 구축 전문가야.

[사고 정황]
- 발생한 사고: {{incident_summary}}
- 담당 팀원: {{involved_member}}
- 현재 팀원 상태: {{emotional_state}}

[요청 사항]
사고는 엄중히 해결하되, {{involved_member}}의 사기를 꺾지 않고 조직의 신뢰 자산을 지키는 '비난 없는 회고(Blameless Post-Mortem)' 대화 가이드를 작성해 줘:
1. [리더의 첫마디]: 실무자의 자책감을 덜어주고 "사람이 실수를 유발하게 만든 시스템의 구멍을 찾자"는 톤앤매너 설정 문장
2. [5 Whys 시스템 탐색 질문]: "누가 그랬어?"(Who)가 아니라 "어떤 환경/절차가 그 오판을 유도했는가?"(Why/What)를 규명하는 질문 4가지
3. [심리적 회복을 돕는 피드백]: "이번 일로 인해 너에 대한 나의 신뢰가 흔들리지 않았다"는 점을 명확히 전달하는 화법
4. [액션 아이템 도출 프레임]: 재발 방지 체크리스트를 팀원 스스로 만들도록 격려하는 마무리 멘트`,
    actionTips: [
      '실수를 혼내면 다음부터 팀원은 실수를 숨기거나 축소 보고합니다. 그것이 진짜 회사의 파멸을 부릅니다.',
      '"왜 그랬어?" 대신 "그 시점에 어떤 정보가 더 필요했을까?"라고 질문의 주어를 바꾸세요.',
    ],
  },
  {
    id: 'trust-vulnerability-sharing',
    category: 'trust_relationship',
    categoryLabel: '신뢰와 관계형성',
    title: '리더의 취약성(Vulnerability) 노출을 통한 상호 신뢰 구축',
    summary: '완벽한 척하는 리더의 가면을 벗고, 솔직한 고민과 한계를 정중히 털어놓아 팀원과의 심리적 거리를 좁힙니다.',
    theoryBackground: '브레네 브라운(Brené Brown)의 취약성의 힘(Daring Greatly) 및 패트릭 렌치오니의 팀 5가지 기능장애(기반: 신뢰의 결여).',
    whenToUse: '새 팀에 부임했거나, 조직에 큰 불확실성이 닥쳤을 때, 팀원들이 리더를 어려워하고 벽을 느낄 때',
    variables: [
      { key: 'current_challenge', label: '현재 리더가 겪는 고민/한계', placeholder: '예: 신규 시장의 규제 변화에 대해 나도 아직 확실한 답이 없음', defaultValue: '상반기 조직 목표 달성 전략에 대해 나 역시 아직 100% 확신이 없음' },
      { key: 'team_vibe', label: '현재 팀 분위기', placeholder: '예: 리더의 눈치만 보며 조용히 기다리는 중', defaultValue: '리더의 결정만 수동적으로 기다리며 조심스러워함' },
    ],
    template: `[역할 부여]
너는 글로벌 리더십 코칭 분야의 권위자이자 팀 역동(Team Dynamics) 전문가야.

[상황]
- 리더인 나의 현재 고민/한계: {{current_challenge}}
- 팀의 반응: {{team_vibe}}

[요청 사항]
무능해 보이지 않으면서도 인간적인 솔직함(Vulnerability)으로 팀의 집단 지성과 신뢰를 깨우는 대화 스크립트를 작성해 줘:
1. [취약성 오픈 스크립트]: "모든 답을 내가 갖고 있지 않다"는 점을 당당하면서도 겸손하게 밝히는 팀 미팅 화법
2. [도움 요청(Asking for help)]: 팀원들에게 수동적 관전자가 아니라 '함께 길을 찾는 파트너'로서의 역할을 부여하는 전환 질문 3가지
3. [경계선 설정(Boundaries)]: 무책임한 징징거림(Whining)과 진정한 취약성(Healthy Vulnerability)의 결정적 차이 및 주의점
4. [후속 조치]: 팀원들이 아이디어를 냈을 때 리더가 보여야 할 감사의 리액션 예시`,
    actionTips: [
      '취약성 고백은 "나 어떡하지?"가 아닙니다. "목표는 분명하지만 그 방법에 있어 여러분의 지혜가 절실하다"는 파트너십 요청입니다.',
      '리더가 먼저 실수를 인정하면, 팀원들도 문제를 숨기지 않는 정직한 팀 문화가 형성됩니다.',
    ],
  },
  {
    id: 'trust-sbi-feedback',
    category: 'trust_relationship',
    categoryLabel: '신뢰와 관계형성',
    title: '관계 손상 없는 비폭력 SBI 피드백 모델 (상황-행동-영향)',
    summary: '인격 모독이나 추측성 비난 없이, 구체적 팩트와 영향만을 전달하여 팀원이 방어기제 없이 수용하게 합니다.',
    theoryBackground: 'CCL(Center for Creative Leadership)의 Situation-Behavior-Impact 모델 및 마셜 로젠버그의 비폭력대화(NVC).',
    whenToUse: '지각, 회의 태도, 거친 커뮤니케이션, 업무 누락 등 팀원의 부정적 행동을 교정해야 할 때',
    variables: [
      { key: 'target_member', label: '피드백 대상 팀원', placeholder: '예: 한 매니저', defaultValue: '한 대리' },
      { key: 'situation_fact', label: '구체적 상황 (Situation)', placeholder: '예: 어제 오후 2시 클라이언트와의 정기 싱크 회의에서', defaultValue: '지난주 화요일 부서 합동 스프린트 회의에서' },
      { key: 'observed_behavior', label: '관찰된 구체적 행동 (Behavior)', placeholder: '예: 타 부서 발표 도중 말을 끊고 한숨을 쉼', defaultValue: '동료의 기획안 제안에 대해 대안 없이 "그건 비현실적이다"라며 일축함' },
      { key: 'business_impact', label: '미친 영향 (Impact)', placeholder: '예: 타 부서와의 협업 신뢰가 떨어지고 팀 분위기가 경직됨', defaultValue: '회의 분위기가 위축되어 다른 동료들이 더 이상 아이디어를 내지 못함' },
    ],
    template: `[역할 부여]
너는 글로벌 기업의 시니어 피드백 코칭 디렉터야.

[상황 데이터]
- 대상: {{target_member}}
- Situation (언제, 어디서): {{situation_fact}}
- Behavior (눈에 보인 구체적 행동): {{observed_behavior}}
- Impact (그로 인해 발생한 파급효과): {{business_impact}}

[요청 사항]
{{target_member}}의 인격을 공격하지 않고, 오직 객관적 사실과 영향력에 초점을 맞추어 행동 변화를 이끌어내는 SBI 1on1 대화 시나리오를 설계해 줘:
1. [SBI 전달 스크립트]: 감정을 배제하고 상황-행동-영향을 담백하고 명확하게 전달하는 3문장 화법
2. [상대방의 의도 묻기]: "너 그때 왜 그랬어?" 대신 행동의 배경을 경청하는 개방형 탐색 질문
3. [대안 행동 함께 설계하기]: 앞으로 유사한 상황에서 어떻게 표현하는 것이 좋을지 합의하는 질문 프레임
4. [마무리 격려]: 팀원에 대한 기대와 지지를 재확인하며 회의를 긍정적으로 맺는 멘트`,
    actionTips: [
      '"항상", "절대로", "원래"라는 일반화 단어를 절대 쓰지 마세요. "지난 화요일 그 회의에서"처럼 핀포인트로 특정하세요.',
      '피드백은 전달 후 침묵하고 상대방의 반응을 기다려야 합니다. 말을 덧붙이며 변명하지 마세요.',
    ],
  },
  {
    id: 'trust-meaningful-recognition',
    category: 'trust_relationship',
    categoryLabel: '신뢰와 관계형성',
    title: '동기부여를 극대화하는 기여·과정 중심의 깊은 인정(Recognition)',
    summary: '"잘했어", "수고했어" 같은 영혼 없는 칭찬을 탈피하고, 팀원의 숨은 노력과 고유한 강점을 짚어주는 칭찬 프로토콜.',
    theoryBackground: '캐럴 드웩(Carol Dweck)의 성장 마인드셋(Growth Mindset) 및 아담 그랜트의 기버(Giver) 인정 모델.',
    whenToUse: '프로젝트를 성공적으로 마쳤을 때, 보이지 않는 곳에서 묵묵히 헌신한 팀원을 격려할 때',
    variables: [
      { key: 'member_name', label: '인정할 팀원 이름', placeholder: '예: 유진 님', defaultValue: '최유진 님' },
      { key: 'specific_effort', label: '팀원이 쏟은 구체적 노력', placeholder: '예: 주말까지 반납하며 QA 누락 건을 밤새 전수 조사함', defaultValue: '까다로운 고객사의 반복된 요청을 끝까지 경청하며 매뉴얼을 재정비함' },
      { key: 'team_value', label: '그 노력이 팀에 미친 가치', placeholder: '예: 대형 론칭 참사를 막고 신뢰도를 2배 높임', defaultValue: '팀 전체의 고객 응대 스트레스를 줄이고 표준화의 기반을 닦음' },
    ],
    template: `[역할 부여]
너는 긍정심리학 및 고성과 팀 인정(Recognition) 문화 전문가야.

[팀원 및 공로]
- 대상: {{member_name}}
- 관찰된 노력/과정: {{specific_effort}}
- 조직적 기여: {{team_value}}

[요청 사항]
단순한 "수고 많았어요"라는 판에 박힌 말을 넘어, {{member_name}}의 자긍심을 극대화하고 동기부여를 영구화하는 깊은 인정 메시지를 작성해 줘:
1. [1:1 대화용 인정 멘트]: 결과뿐 아니라 {{specific_effort}}의 과정을 집요하게 조명해 감동을 주는 대화문
2. [전체 팀 공개 치하 멘트]: 슬랙(Slack)이나 주간 팀 미팅에서 동료들의 귀감이 되도록 멋지게 소개해 주는 문장
3. [성장 마인드셋 포인트]: 타고난 능력이 아니라 '태도와 끈기'를 칭찬하여 지속적 성장을 유도하는 팁
4. [강점 네이밍]: 이 행동에서 드러난 {{member_name}}의 고유한 수퍼파워(예: '보이지 않는 곳의 디테일 수호자')를 명명해 주기`,
    actionTips: [
      '결과만 칭찬하면 실패를 두려워하게 됩니다. 과정에서 보여준 태도와 헌신을 칭찬해야 성장 마인드셋이 자리 잡습니다.',
      '다른 팀원들과 비교하지 마세요. 오직 그 팀원 자신의 이전 모습과 비교하여 얼마나 발전했는지를 짚어주세요.',
    ],
  },
];
