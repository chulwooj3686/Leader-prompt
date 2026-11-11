import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by guidelines
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint to simulate or preview prompt responses for team leaders
app.post('/api/simulate', async (req, res) => {
  try {
    const { prompt, category, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '프롬프트 내용이 필요합니다.' });
    }

    if (!aiClient) {
      // Graceful realistic fallback if API key is not yet set in environment
      return res.json({
        simulated: true,
        text: `[오프라인 시뮬레이션 모드]\n\n실전 리더십 코칭 관점의 피드백 결과입니다:\n\n1. 핵심 의도 분석:\n제시해주신 프롬프트는 ${category || '리더십'} 관점에서 팀원의 심리적 상태와 상황적 맥락을 면밀히 짚어내고 있습니다.\n\n2. 실전 대화 적용 가이드:\n- 먼저 리더의 판단을 단정적으로 전달하지 마시고, 팀원이 상황을 스스로 설명할 수 있는 개방형 질문으로 시작하세요.\n- 조절초점 및 메타인지 관점에서 상대방이 불안감(예방)이나 무력감(향상 저하)을 느끼지 않도록 심리적 안전망을 확인해 주는 것이 핵심입니다.\n\n(참고: Settings > Secrets 패널에 GEMINI_API_KEY를 등록하시면 실시간 Gemini 3.8 Flash AI 코칭 분석을 바로 받아보실 수 있습니다.)`,
      });
    }

    const systemInstruction = `당신은 대한민국 최고 수준의 조직심리학 및 경영 리더십 수석 코치입니다.
팀장(Leader)이 현업에서 직면하는 의사결정, 팀원 동기부여(조절초점 이론: 향상초점 vs 예방초점), 신뢰 구축 및 심리적 안전감 형성을 돕습니다.
사용자가 팀원과의 상황이나 의사결정 고민에 대해 작성한 프롬프트를 바탕으로:
1. [핵심 진단 및 편향/주의점 점검]
2. [실전 대화 스크립트 및 화법 권장안]
3. [팀장의 다음 액션 체크리스트]
를 명확하고 정중하며 바로 실전에 쓸 수 있는 한국어 비즈니스 어조로 작성해 주세요. 불필요한 서론은 줄이고 즉시 실행 가능한 솔루션 위주로 제시하세요.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      simulated: false,
      text: response.text || '답변을 생성하지 못했습니다. 다시 시도해 주세요.',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'AI 응답 생성 중 오류가 발생했습니다.',
      details: error?.message || String(error),
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
