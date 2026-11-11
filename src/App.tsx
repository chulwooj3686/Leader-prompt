import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DATA, PromptCard } from './data/promptsData';

export default function App() {
  const [filter, setFilter] = useState<string>('전체');
  const [query, setQuery] = useState<string>('');
  const [liked, setLiked] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('liked_prompts');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [activeModal, setActiveModal] = useState<{
    card: PromptCard;
    categoryName: string;
  } | null>(null);

  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Save liked set to localStorage
  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('liked_prompts', JSON.stringify([...next]));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Keyboard shortcuts: '/' to search, 'Escape' to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openModal = (card: PromptCard, categoryName: string) => {
    setActiveModal({ card, categoryName });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleCopy = () => {
    if (!activeModal) return;
    navigator.clipboard.writeText(activeModal.card.prompt).then(() => {
      setShowToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = window.setTimeout(() => {
        setShowToast(false);
      }, 1800);
    });
  };

  // Match search query
  const matchesQuery = (c: PromptCard, q: string) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return (c.title + c.desc + c.prompt + c.source).toLowerCase().includes(lower);
  };

  // Filtered categories and cards
  const filteredCategories = useMemo(() => {
    return DATA.map((cat) => {
      let cards = cat.cards.filter((c) => matchesQuery(c, query));
      if (filter === '❤️ 좋아요') {
        cards = cards.filter((c) => liked.has(c.id));
      } else if (filter !== '전체' && filter !== cat.name) {
        cards = [];
      }
      return {
        ...cat,
        cards,
      };
    }).filter((cat) => cat.cards.length > 0);
  }, [filter, query, liked]);

  const totalFilteredCards = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.cards.length, 0);
  }, [filteredCategories]);

  // Overall stats
  const totalCardsCount = useMemo(() => {
    return DATA.reduce((sum, cat) => sum + cat.cards.length, 0);
  }, []);

  const uniqueSourcesCount = useMemo(() => {
    const sources = new Set<string>();
    DATA.forEach((cat) => {
      cat.cards.forEach((c) => {
        c.source.split(',').forEach((s) => {
          if (s.trim()) sources.add(s.trim());
        });
      });
    });
    return sources.size;
  }, []);

  const chipNames = ['전체', '❤️ 좋아요', ...DATA.map((c) => c.name)];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="deco-circle orange deco1"></div>
        <div className="deco-circle peach deco2"></div>
        <div className="deco-circle outline deco3"></div>
        <div className="hero-inner">
          <div className="hero-cover">
            <img src="/cover.jpg" alt="팀장 프롬프트 표지" />
          </div>
          <div className="hero-text">
            <span className="hero-eyebrow">GAM CONSULTING · 리더십 콘텐츠 라이브러리</span>
            <h1>
              팀장 프롬프트<br />
              <span>— AI시대 리더의 도구</span>
            </h1>
            <p className="hero-sub">
              책에 수록된 프롬프트를 바로 복사해서 사용하세요. 17년간 현장 강의에서 축적한 리더십 상황별로, 팀장이 그 자리에서 바로 AI에게 입력할 수 있는 프롬프트를 모았습니다.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>{DATA.length}</b>카테고리
              </div>
              <div className="hero-stat">
                <b>{totalCardsCount}</b>개 프롬프트
              </div>
              <div className="hero-stat">
                <b>{uniqueSourcesCount}</b>개 원본 교재
              </div>
            </div>
            <p className="hero-meta">
              기업교육 현장에서 사용된 강사 PT·워크북·교재의 프레임워크를 바탕으로 만든 실전 프롬프트 모음집입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FILTER BAR ============ */}
      <div className="filterbar">
        <div className="filterbar-inner" id="filterbar-inner">
          <div className="search-box">
            🔍
            <input
              ref={searchInputRef}
              id="searchInput"
              placeholder="검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="kbd">/</span>
          </div>
          {chipNames.map((name) => (
            <div
              key={name}
              className={`chip ${name === filter ? 'active' : ''}`}
              onClick={() => setFilter(name)}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* ============ MAIN ============ */}
      <main id="main">
        {filteredCategories.map((cat) => (
          <section key={cat.id} className="category-section" id={`cat-${cat.id}`}>
            <div className="category-head">
              <h2>{cat.name}</h2>
              <div className="count">{cat.cards.length}개 콘텐츠</div>
            </div>
            <div className="card-grid">
              {cat.cards.map((c) => {
                const isLiked = liked.has(c.id);
                return (
                  <div
                    key={c.id}
                    className="card"
                    onClick={() => openModal(c, cat.name)}
                  >
                    <div className="card-top">
                      <span className="card-tag">{cat.name}</span>
                      <button
                        className={`like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(c.id);
                        }}
                        aria-label="좋아요"
                      >
                        {isLiked ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <h3>{c.title}</h3>
                    <p className="desc">{c.desc}</p>
                    <div className="prompt-preview">{c.prompt}</div>
                    <div className="source-line">{c.source}</div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {totalFilteredCards === 0 && (
          <p style={{ textAlign: 'center', color: '#999', padding: '60px 0' }}>
            검색 결과가 없습니다.
          </p>
        )}
      </main>

      {/* ============ BOOK OUTRO ============ */}
      <div className="book-outro">
        <img src="/cover.jpg" alt="팀장 프롬프트 표지" />
        <div className="txt">
          <h3>『팀장 프롬프트 — 순간의 판단을 돕는 30가지 질문』</h3>
          <p>장철우 지음 · 콕프레스 · GAM 컨설팅</p>
          <p>이 라이브러리는 저자의 기업교육 현장 자료를 리더십 주제별로 재구성한 콘텐츠입니다.</p>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="footer-kbd">
          <span className="kbd">/</span> 검색 &nbsp; <span className="kbd">Esc</span> 모달 닫기
        </div>
        © 2026 GAM CONSULTING. All rights reserved.
      </footer>

      {/* ============ MODAL ============ */}
      {activeModal && (
        <div
          className="modal-overlay open"
          id="modalOverlay"
          onClick={(e) => {
            if ((e.target as HTMLElement).id === 'modalOverlay') closeModal();
          }}
        >
          <div className="modal-box">
            <button className="modal-close" id="modalClose" onClick={closeModal}>
              ✕
            </button>
            <span className="modal-tag" id="modalTag">
              {activeModal.categoryName}
            </span>
            <h3 id="modalTitle">{activeModal.card.title}</h3>
            <p className="modal-desc" id="modalDesc">
              {activeModal.card.desc}
            </p>
            <div className="modal-block">
              <h4>프롬프트 내용</h4>
              <div className="prompt-box" id="modalPrompt">
                {activeModal.card.prompt}
              </div>
            </div>
            <p className="modal-source" id="modalSource">
              출처: {activeModal.card.source}
            </p>
            <div className="modal-actions">
              <button className="btn btn-primary" id="copyBtn" onClick={handleCopy}>
                📋 프롬프트 복사하기
              </button>
              <button
                className="btn btn-ghost"
                id="likeModalBtn"
                onClick={() => toggleLike(activeModal.card.id)}
              >
                {liked.has(activeModal.card.id) ? '❤️ 좋아요 취소' : '🤍 좋아요'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ COPY TOAST ============ */}
      <div className={`copy-toast ${showToast ? 'show' : ''}`} id="copyToast">
        ✅ 클립보드에 복사되었습니다!
      </div>
    </>
  );
}
