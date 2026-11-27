const { useState, useEffect, useMemo } = React;

function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | exam | summary | wrongnote | manager
  const [questions, setQuestions] = useState(() => window.InfoSecEngine.getAllQuestions());
  const [history, setHistory] = useState(() => window.InfoSecEngine.getHistory());
  const [bookmarks, setBookmarks] = useState(() => window.InfoSecEngine.getBookmarks());
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(window.InfoSecEngine.STORAGE_KEYS.API_KEY) || "");
  const [toast, setToast] = useState(null);

  // 모의고사 설정 및 진행 상태
  const [examConfig, setExamConfig] = useState({
    subjectIds: [1, 2, 3, 4, 5],
    count: 10,
    mode: "all", // all | unsolved_first | wrong_only | bookmarked
    solveStyle: "study", // study (즉시 정답/해설) | real (실전 채점)
    shuffleOptions: true,
    includeSmartVariations: false
  });
  const [examSession, setExamSession] = useState(null);

  // 요약본 설정 상태
  const [summaryConfig, setSummaryConfig] = useState({
    subjectIds: [1], // 한 과목씩 집중 보기 기본값
    viewMode: "visual", // visual | cheatsheet | mynotes
    mobileTableAsCards: true, // 모바일에서 표가 잘리지 않도록 카드 리스트로 자동 변환
    includeWrongNotes: true,
    includeBookmarks: true,
    searchKeyword: "",
    blindMode: false
  });
  const [revealedKeywords, setRevealedKeywords] = useState({});

  // 기출 추가 & AI 생성 상태
  const [aiForm, setAiForm] = useState({
    subjectId: 1,
    topicKeyword: "",
    count: 3,
    loading: false
  });
  const [rawImportText, setRawImportText] = useState("");
  const [importSubjectId, setImportSubjectId] = useState(1);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshData = () => {
    setQuestions(window.InfoSecEngine.getAllQuestions());
    setHistory(window.InfoSecEngine.getHistory());
    setBookmarks(window.InfoSecEngine.getBookmarks());
  };

  // 타이머 작동
  useEffect(() => {
    if (!examSession || examSession.finished) return;
    const timer = setInterval(() => {
      setExamSession((prev) => (prev ? { ...prev, elapsedSec: prev.elapsedSec + 1 } : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [examSession && !examSession.finished]);

  const subjectStats = useMemo(() => window.InfoSecEngine.getSubjectStats(), [questions, history]);

  const totalStats = useMemo(() => {
    let solved = 0;
    let attempts = 0;
    let correct = 0;
    let wrong = 0;
    subjectStats.forEach((s) => {
      solved += s.solvedCount;
      attempts += s.totalAttempts;
      correct += s.totalCorrect;
      wrong += s.wrongCount;
    });
    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    return { total: questions.length, solved, attempts, correct, wrong, accuracy };
  }, [subjectStats, questions]);

  // 모의고사 시작
  const startRandomExam = (customCfg = null) => {
    const cfg = customCfg || examConfig;
    if (cfg.subjectIds.length === 0) {
      showToast("최소 1개 이상의 과목을 선택해주세요.", "warn");
      return;
    }
    const generated = window.InfoSecEngine.generateRandomExam(cfg);
    if (generated.length === 0) {
      showToast("조건에 맞는 문제가 없습니다. 출제 옵션을 변경해보세요.", "warn");
      return;
    }
    setExamSession({
      list: generated,
      currentIndex: 0,
      answers: {},
      revealed: {},
      finished: false,
      solveStyle: cfg.solveStyle,
      elapsedSec: 0
    });
    setActiveTab("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 보기 선택 처리
  const handleSelectOption = (qIndex, optIndex) => {
    if (!examSession || examSession.finished) return;
    const currentQ = examSession.list[qIndex];

    if (examSession.solveStyle === "study" && examSession.revealed[qIndex]) return;

    const newAnswers = { ...examSession.answers, [qIndex]: optIndex };
    const newRevealed = { ...examSession.revealed };

    if (examSession.solveStyle === "study") {
      newRevealed[qIndex] = true;
      const isCorrect = optIndex === currentQ.answer;
      window.InfoSecEngine.recordAttempt(currentQ.id, isCorrect, optIndex);
      refreshData();
    }

    setExamSession({
      ...examSession,
      answers: newAnswers,
      revealed: newRevealed
    });
  };

  // 모의고사 종료 및 일괄 채점
  const finishExamSession = () => {
    if (!examSession) return;
    if (examSession.solveStyle === "real") {
      examSession.list.forEach((q, idx) => {
        const userAns = examSession.answers[idx];
        if (userAns !== undefined) {
          window.InfoSecEngine.recordAttempt(q.id, userAns === q.answer, userAns);
        }
      });
      refreshData();
    }
    setExamSession({
      ...examSession,
      finished: true
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 현재 문제에서 즉시 스마트 변형 문제 추가 출제
  const handleInstantVariation = (baseQ) => {
    const varied = window.InfoSecEngine.createLocalSmartVariation(baseQ);
    window.InfoSecEngine.addCustomQuestions([varied]);
    refreshData();
    if (examSession && !examSession.finished) {
      const newList = [...examSession.list];
      newList.splice(examSession.currentIndex + 1, 0, varied);
      setExamSession({
        ...examSession,
        list: newList
      });
      showToast("바로 다음 문항에 기출 변형 문제가 추가되었습니다!", "success");
    } else {
      showToast("기출 변형 문제가 문제 은행에 추가되었습니다!", "success");
    }
  };

  const handleToggleBookmark = (qId) => {
    window.InfoSecEngine.toggleBookmark(qId);
    refreshData();
  };

  // AI 또는 스마트 기출변형 생성 핸들러
  const handleGenerateAIQuestions = async () => {
    setAiForm((prev) => ({ ...prev, loading: true }));
    try {
      if (apiKey) {
        localStorage.setItem(window.InfoSecEngine.STORAGE_KEYS.API_KEY, apiKey);
      }
      const res = await window.InfoSecEngine.generateQuestionsWithAI({
        subjectId: aiForm.subjectId,
        topicKeyword: aiForm.topicKeyword,
        count: aiForm.count,
        apiKey
      });
      refreshData();
      showToast(
        res.mode === "gemini_ai"
          ? `Gemini AI가 새로운 실전 기출변형 ${res.questions.length}문항을 생성했습니다!`
          : `스마트 변형 엔진이 기출변형 ${res.questions.length}문항을 생성했습니다!`,
        "success"
      );
    } catch (err) {
      showToast(`생성 중 오류: ${err.message}`, "warn");
    } finally {
      setAiForm((prev) => ({ ...prev, loading: false }));
    }
  };

  // 기출 텍스트 파싱 및 추가
  const handleImportText = () => {
    const parsed = window.InfoSecEngine.parseRawQuestionsText(rawImportText, importSubjectId);
    if (parsed.length === 0) {
      showToast("인식된 문제가 없습니다. 예시 형식에 맞춰 문제와 보기(①~④ 또는 1)~4))를 입력해주세요.", "warn");
      return;
    }
    window.InfoSecEngine.addCustomQuestions(parsed);
    refreshData();
    setRawImportText("");
    showToast(`총 ${parsed.length}개의 기출문제가 성공적으로 파싱되어 문제 은행에 추가되었습니다!`, "success");
  };

  // 요약본 데이터 계산
  const customSummary = useMemo(
    () => window.InfoSecEngine.generateCustomSummary(summaryConfig),
    [summaryConfig, questions, history, bookmarks]
  );

  // 암기 모드용 볼드체(**텍스트**) 가림막 렌더링 헬퍼
  const renderFormattedText = (text, blockKey) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const clean = part.slice(2, -2);
        const kId = `${blockKey}_${i}`;
        const isHidden = summaryConfig.blindMode && !revealedKeywords[kId];
        return (
          <span
            key={i}
            onClick={() => {
              if (summaryConfig.blindMode) {
                setRevealedKeywords((prev) => ({ ...prev, [kId]: !prev[kId] }));
              }
            }}
            title={summaryConfig.blindMode ? "클릭하여 정답 확인" : ""}
            className={
              isHidden
                ? "inline-block mx-0.5 px-1.5 py-0.5 rounded bg-indigo-500/30 text-transparent border border-indigo-400/50 cursor-pointer select-none transition hover:bg-indigo-500/40"
                : "font-bold text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded cursor-pointer"
            }
          >
            {clean}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const navTabs = [
    { id: "dashboard", icon: "📊", shortLabel: "홈/분석", label: "📊 대시보드" },
    { id: "exam", icon: "🎲", shortLabel: "모의고사", label: "🎲 랜덤 기출·모의고사" },
    { id: "summary", icon: "📝", shortLabel: "핵심요약", label: "📝 핵심 요약본" },
    { id: "wrongnote", icon: "❌", shortLabel: `오답(${totalStats.wrong})`, label: `❌ 오답·북마크 (${totalStats.wrong})` },
    { id: "manager", icon: "➕", shortLabel: "문제추가", label: "➕ 기출추가·AI생성" }
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-6">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-black text-base sm:text-lg shadow-lg shadow-indigo-500/20">
              🛡️
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white truncate">
                  SecuMaster <span className="text-indigo-400">정보보안기사</span>
                </h1>
                <span className="hidden xs:inline-block text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium whitespace-nowrap">
                  필기 기출 & 요약
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                5대 과목 기출 기반 랜덤 모의고사 · 스마트 변형 출제 · 비주얼 핵심 요약본
              </p>
            </div>
          </div>

          {/* 데스크톱/태블릿 상단 네비게이션 탭 */}
          <nav className="hidden md:flex items-center gap-1.5 py-1">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3.5 py-2 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* 모바일 우측 빠른 암기가림막/요약 버튼 */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {activeTab === "summary" && (
              <button
                onClick={() => {
                  setSummaryConfig((prev) => ({ ...prev, blindMode: !prev.blindMode }));
                  setRevealedKeywords({});
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border ${
                  summaryConfig.blindMode
                    ? "bg-amber-500 text-slate-950 border-amber-400"
                    : "bg-slate-800 text-amber-300 border-slate-700"
                }`}
              >
                {summaryConfig.blindMode ? "🙈 가림ON" : "🧠 암기모드"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 모바일 전용 하단 고정 앱 탭 바 (스마트폰에서 한 손으로 조작 가능, 절대 잘리지 않음) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-1 py-1.5 grid grid-cols-5 gap-1 no-print">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                isActive
                  ? "bg-indigo-600/25 text-indigo-300 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-base leading-none mb-1">{tab.icon}</span>
              <span className="text-[10px] leading-tight tracking-tight truncate max-w-full px-0.5">
                {tab.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 알림 토스트 */}
      {toast && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 md:max-w-md px-4 py-3 rounded-xl shadow-2xl border bg-slate-900 border-indigo-500/50 text-xs sm:text-sm flex items-center gap-2.5 no-print">
          <span>{toast.type === "warn" ? "⚠️" : "✅"}</span>
          <span className="font-medium text-slate-100 break-words">{toast.msg}</span>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ================= 1. 대시보드 탭 ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-5 sm:space-y-6">
            {/* 상단 히어로 & 원클릭 실행 카드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 mb-2.5">
                    🎯 합격 기준: 과목당 40점 이상, 평균 60점 이상
                  </span>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                    정보보안기사 필기 합격을 향해 달려볼까요?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    현재 문제 은행에 총 <strong className="text-indigo-400">{totalStats.total}문항</strong>의 핵심 기출 및 변형 문제가 준비되어 있습니다.
                    랜덤 모의고사를 풀거나 비주얼 요약본으로 핵심을 정리해보세요.
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:flex sm:flex-wrap gap-2.5">
                  <button
                    onClick={() =>
                      startRandomExam({
                        ...examConfig,
                        subjectIds: [1, 2, 3, 4, 5],
                        count: 10,
                        mode: "all",
                        solveStyle: "study"
                      })
                    }
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition text-center"
                  >
                    🎲 전 과목 랜덤 10제 풀기 (학습모드)
                  </button>
                  <button
                    onClick={() =>
                      startRandomExam({
                        ...examConfig,
                        subjectIds: [1, 2, 3, 4, 5],
                        count: 20,
                        mode: "all",
                        solveStyle: "real",
                        includeSmartVariations: true
                      })
                    }
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition text-center"
                  >
                    ⏱️ 실전 기출+변형 모의고사 20제
                  </button>
                  <button
                    onClick={() => setActiveTab("summary")}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition text-center"
                  >
                    📝 5과목 비주얼 요약본 보기
                  </button>
                </div>
              </div>

              {/* 전체 학습 통계 요약 */}
              <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  나의 누적 학습 현황
                </h3>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 my-3 sm:my-4">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] sm:text-xs text-slate-400">평균 정답률</div>
                    <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 mt-1">
                      {totalStats.attempts > 0 ? `${totalStats.accuracy}%` : "-"}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                      {totalStats.accuracy >= 60 ? "합격 안정권 (60점+)" : "60% 이상 달성 목표"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] sm:text-xs text-slate-400">누적 풀이 수</div>
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">
                      {totalStats.attempts}회
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                      고유 {totalStats.solved} / {totalStats.total}문항
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] sm:text-xs text-slate-400">복습할 오답</div>
                    <div className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-1">
                      {totalStats.wrong}문항
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">오답노트 자동 연동</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] sm:text-xs text-slate-400">중요 북마크</div>
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1">
                      {bookmarks.length}문항
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">시험 직전 필수 체크</div>
                  </div>
                </div>
                {totalStats.wrong > 0 && (
                  <button
                    onClick={() =>
                      startRandomExam({
                        ...examConfig,
                        subjectIds: [1, 2, 3, 4, 5],
                        count: totalStats.wrong,
                        mode: "wrong_only",
                        solveStyle: "study"
                      })
                    }
                    className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                  >
                    🚨 틀린 오답 문제({totalStats.wrong}문항)만 다시 풀기
                  </button>
                )}
              </div>
            </div>

            {/* 5과목별 성취도 및 원클릭 집중 학습 */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  📚 5대 과목별 분석 및 집중 공략
                </h3>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  과목별 기출 풀기 또는 요약 노트로 바로 이동하세요
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {subjectStats.map((subj) => (
                  <div
                    key={subj.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${subj.bgLight} ${subj.textColor} border ${subj.borderColor}`}>
                          {subj.shortName}
                        </span>
                        <span className="text-xs text-slate-400">{subj.totalQuestions}문항</span>
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1">{subj.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">{subj.description}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">정답률</span>
                        <span className="font-bold text-slate-200">
                          {subj.accuracy !== null ? `${subj.accuracy}%` : "미풀이"}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${subj.accuracy !== null ? subj.accuracy : 0}%`,
                            backgroundColor:
                              subj.accuracy !== null && subj.accuracy < 40
                                ? "#f43f5e"
                                : subj.color
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() =>
                            startRandomExam({
                              ...examConfig,
                              subjectIds: [subj.id],
                              count: 10,
                              mode: "all",
                              solveStyle: "study"
                            })
                          }
                          className="py-2 px-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-xs font-semibold text-slate-200 hover:text-white transition"
                        >
                          🎲 기출 풀기
                        </button>
                        <button
                          onClick={() => {
                            setSummaryConfig((prev) => ({
                              ...prev,
                              viewMode: "visual",
                              subjectIds: [subj.id]
                            }));
                            setActiveTab("summary");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                        >
                          📝 요약 노트
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. 랜덤 기출 & 모의고사 탭 ================= */}
        {activeTab === "exam" && (
          <div className="space-y-4 sm:space-y-6">
            {/* 상단 출제 설정 패널 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">🎲 랜덤 기출문제 생성기 설정</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    과목, 문항 수, 선지 셔플 및 스마트 변형 옵션을 조합하여 새로운 시험지를 생성합니다.
                  </p>
                </div>
                <button
                  onClick={() => startRandomExam()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition shrink-0"
                >
                  🔄 새 랜덤 기출 생성 및 시작
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-3 border-t border-slate-800">
                {/* 과목 필터 */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    출제 과목 선택 (다중 선택 가능)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() =>
                        setExamConfig((prev) => ({
                          ...prev,
                          subjectIds: prev.subjectIds.length === 5 ? [1] : [1, 2, 3, 4, 5]
                        }))
                      }
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        examConfig.subjectIds.length === 5
                          ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      전체 과목
                    </button>
                    {window.INFOSEC_SUBJECTS.map((s) => {
                      const selected = examConfig.subjectIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setExamConfig((prev) => {
                              const exists = prev.subjectIds.includes(s.id);
                              const next = exists
                                ? prev.subjectIds.filter((id) => id !== s.id)
                                : [...prev.subjectIds, s.id];
                              return { ...prev, subjectIds: next };
                            });
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                            selected
                              ? "bg-indigo-600 text-white border-indigo-500"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {s.id}과목: {s.shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 문항 수 및 출제 기준 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    문항 수 & 출제 범위
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={examConfig.count}
                      onChange={(e) =>
                        setExamConfig((prev) => ({ ...prev, count: Number(e.target.value) }))
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 w-full"
                    >
                      <option value={5}>5문항 (미니)</option>
                      <option value={10}>10문항 (빠른)</option>
                      <option value={15}>15문항 (집중)</option>
                      <option value={20}>20문항 (1과목)</option>
                      <option value={30}>30문항 (종합)</option>
                      <option value={50}>50문항 (하프 모의)</option>
                      <option value={100}>100문항 (실전 전체)</option>
                    </select>
                    <select
                      value={examConfig.mode}
                      onChange={(e) =>
                        setExamConfig((prev) => ({ ...prev, mode: e.target.value }))
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 w-full"
                    >
                      <option value="all">전체 랜덤</option>
                      <option value="unsolved_first">미풀이 우선</option>
                      <option value="wrong_only">틀린 오답만</option>
                      <option value="bookmarked">북마크만</option>
                    </select>
                  </div>
                </div>

                {/* 풀이 방식 & 변형 옵션 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    풀이 모드 & 변형 옵션
                  </label>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="solveStyle"
                          checked={examConfig.solveStyle === "study"}
                          onChange={() =>
                            setExamConfig((prev) => ({ ...prev, solveStyle: "study" }))
                          }
                        />
                        <span>즉시 해설(학습)</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="solveStyle"
                          checked={examConfig.solveStyle === "real"}
                          onChange={() =>
                            setExamConfig((prev) => ({ ...prev, solveStyle: "real" }))
                          }
                        />
                        <span>종료 후 채점(실전)</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={examConfig.shuffleOptions}
                          onChange={(e) =>
                            setExamConfig((prev) => ({
                              ...prev,
                              shuffleOptions: e.target.checked
                            }))
                          }
                        />
                        <span>선지 셔플</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-amber-300">
                        <input
                          type="checkbox"
                          checked={examConfig.includeSmartVariations}
                          onChange={(e) =>
                            setExamConfig((prev) => ({
                              ...prev,
                              includeSmartVariations: e.target.checked
                            }))
                          }
                        />
                        <span>⚡기출변형 혼합</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 시험지가 아직 없을 때 안내 */}
            {!examSession && (
              <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
                <div className="text-3xl sm:text-4xl mb-3">🎲</div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  [새 랜덤 기출 생성 및 시작] 버튼을 눌러 모의고사를 시작하세요
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  매번 문제 순서와 4지선다 보기가 랜덤으로 섞여 단순 번호 암기를 방지합니다.
                </p>
                <button
                  onClick={() => startRandomExam()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm"
                >
                  지금 바로 10문항 시작하기
                </button>
              </div>
            )}

            {/* 시험 진행 중 또는 결과 화면 */}
            {examSession && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* 좌측/중앙: 현재 문제 풀이 영역 */}
                <div className="lg:col-span-3 space-y-4 min-w-0">
                  {/* 결과 요약 배너 (시험 종료 시) */}
                  {examSession.finished && (
                    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40">
                      {(() => {
                        const total = examSession.list.length;
                        let correctCnt = 0;
                        examSession.list.forEach((q, idx) => {
                          if (examSession.answers[idx] === q.answer) correctCnt++;
                        });
                        const score = Math.round((correctCnt / total) * 100);
                        return (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                모의고사 채점 결과
                              </span>
                              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                                {score}점{" "}
                                <span className="text-sm sm:text-base font-normal text-slate-300">
                                  ({correctCnt}/{total}정답 · {formatTime(examSession.elapsedSec)})
                                </span>
                              </h3>
                              <p className="text-xs text-slate-300 mt-1">
                                {score >= 60
                                  ? "🎉 합격 기준(60점)을 통과했습니다!"
                                  : "💪 오답 문제는 자동으로 오답노트와 맞춤 요약본에 반영되었습니다."}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setActiveTab("summary")}
                                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
                              >
                                📝 요약본 보기
                              </button>
                              <button
                                onClick={() => startRandomExam()}
                                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                              >
                                🔄 새 시험지
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 현재 선택된 문제 카드 */}
                  {(() => {
                    const qIdx = examSession.currentIndex;
                    const currentQ = examSession.list[qIdx];
                    const subj = window.INFOSEC_SUBJECTS.find(
                      (s) => s.id === Number(currentQ.subjectId)
                    );
                    const userSelected = examSession.answers[qIdx];
                    const showAnswer =
                      examSession.finished ||
                      (examSession.solveStyle === "study" && examSession.revealed[qIdx]);
                    const isBookmarked = bookmarks.includes(currentQ.id);

                    return (
                      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                        {/* 문제 상단 메타 바 */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-800">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                              문제 {qIdx + 1} / {examSession.list.length}
                            </span>
                            {subj && (
                              <span
                                className={`px-2 py-1 rounded-lg text-xs font-semibold ${subj.bgLight} ${subj.textColor} border ${subj.borderColor}`}
                              >
                                {subj.shortName}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                              {currentQ.year}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleInstantVariation(currentQ)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                            >
                              ⚡ 변형출제
                            </button>
                            <button
                              onClick={() => handleToggleBookmark(currentQ.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                                isBookmarked
                                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                              }`}
                            >
                              {isBookmarked ? "⭐ 북마크됨" : "☆ 북마크"}
                            </button>
                          </div>
                        </div>

                        {/* 문제 지문 */}
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-relaxed mb-4 sm:mb-5 break-words">
                          {currentQ.question}
                        </h3>

                        {/* 4지선다 보기 */}
                        <div className="space-y-2">
                          {currentQ.options.map((opt, oIdx) => {
                            const isSelected = userSelected === oIdx;
                            const isCorrectOpt = currentQ.answer === oIdx;

                            let btnStyle =
                              "bg-slate-950/80 border-slate-800 hover:border-indigo-500/60 text-slate-200";
                            if (showAnswer) {
                              if (isCorrectOpt) {
                                btnStyle =
                                  "bg-emerald-500/15 border-emerald-500 text-emerald-200 font-semibold";
                              } else if (isSelected && !isCorrectOpt) {
                                btnStyle =
                                  "bg-rose-500/15 border-rose-500 text-rose-200 line-through";
                              } else {
                                btnStyle = "bg-slate-950/40 border-slate-800/60 text-slate-400";
                              }
                            } else if (isSelected) {
                              btnStyle =
                                "bg-indigo-600/25 border-indigo-500 text-white font-semibold";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition flex items-start gap-2.5 sm:gap-3 ${btnStyle}`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                    showAnswer && isCorrectOpt
                                      ? "bg-emerald-500 text-slate-950"
                                      : showAnswer && isSelected && !isCorrectOpt
                                      ? "bg-rose-500 text-white"
                                      : isSelected
                                      ? "bg-indigo-500 text-white"
                                      : "bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  {oIdx + 1}
                                </span>
                                <span className="text-xs sm:text-sm leading-relaxed flex-1 break-words">
                                  {opt}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* 정답 및 해설 & 한 줄 요약 박스 */}
                        {showAnswer && (
                          <div className="mt-5 p-4 sm:p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                    userSelected === currentQ.answer
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : "bg-rose-500/20 text-rose-300"
                                  }`}
                                >
                                  {userSelected === currentQ.answer ? "⭕ 정답입니다!" : "❌ 오답입니다"}
                                </span>
                                <span className="text-xs font-bold text-indigo-300">
                                  정답: {currentQ.answer + 1}번
                                </span>
                              </div>
                              {currentQ.tags && (
                                <div className="flex flex-wrap gap-1">
                                  {currentQ.tags.map((t, i) => (
                                    <span
                                      key={i}
                                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                                    >
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line break-words">
                              <strong className="text-indigo-400">[상세 해설]</strong>{" "}
                              {currentQ.explanation}
                            </div>

                            {currentQ.keyPoint && (
                              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 break-words">
                                <strong className="text-amber-400">💡 시험장 한 줄 암기 요점: </strong>
                                {currentQ.keyPoint}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 하단 이전/다음 이동 버튼 */}
                        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                          <button
                            disabled={qIdx === 0}
                            onClick={() =>
                              setExamSession((prev) => ({
                                ...prev,
                                currentIndex: Math.max(0, prev.currentIndex - 1)
                              }))
                            }
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold"
                          >
                            ← 이전
                          </button>

                          <div className="flex items-center gap-2">
                            {examSession.solveStyle === "study" && !examSession.revealed[qIdx] && (
                              <button
                                onClick={() =>
                                  setExamSession((prev) => ({
                                    ...prev,
                                    revealed: { ...prev.revealed, [qIdx]: true }
                                  }))
                                }
                                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold"
                              >
                                👀 정답보기
                              </button>
                            )}

                            {qIdx < examSession.list.length - 1 ? (
                              <button
                                onClick={() =>
                                  setExamSession((prev) => ({
                                    ...prev,
                                    currentIndex: prev.currentIndex + 1
                                  }))
                                }
                                className="px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                              >
                                다음 문제 →
                              </button>
                            ) : (
                              !examSession.finished && (
                                <button
                                  onClick={finishExamSession}
                                  className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
                                >
                                  ✅ 제출 및 채점
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 우측: OMR 답안지 & 타이머 사이드바 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 h-fit space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-400">⏱️ 경과 시간</span>
                    <span className="text-lg font-mono font-bold text-indigo-400">
                      {formatTime(examSession.elapsedSec)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>OMR 문항 번호판</span>
                      <span>
                        {Object.keys(examSession.answers).length} / {examSession.list.length} 체크
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {examSession.list.map((q, idx) => {
                        const ans = examSession.answers[idx];
                        const isCurr = examSession.currentIndex === idx;
                        const isRevealed =
                          examSession.finished ||
                          (examSession.solveStyle === "study" && examSession.revealed[idx]);
                        let cellColor = "bg-slate-950 text-slate-400 border-slate-800";
                        if (isRevealed && ans !== undefined) {
                          cellColor =
                            ans === q.answer
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/40";
                        } else if (ans !== undefined) {
                          cellColor = "bg-indigo-600/30 text-indigo-200 border-indigo-500/50";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              setExamSession((prev) => ({ ...prev, currentIndex: idx }))
                            }
                            className={`py-2 rounded-lg text-xs font-bold border transition ${cellColor} ${
                              isCurr ? "ring-2 ring-indigo-400" : ""
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {!examSession.finished && (
                    <button
                      onClick={finishExamSession}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition"
                    >
                      ✅ 시험 종료 및 전체 채점
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. 핵심 요약본 생성기 탭 (모바일 & 데스크톱 완벽 대응) ================= */}
        {activeTab === "summary" && (
          <div className="space-y-4 sm:space-y-6">
            {/* 상단 컨트롤 & 뷰 모드 선택 바 */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">
                      📝 한눈에 들어오는 비주얼 핵심 요약집
                    </h2>
                    <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      비교표 · 기출함정 · 단답족보
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    시험에 그대로 나오는 비교표, ⚠️기출 함정 주의보, 시험 직전 필수 숫자·명령어 족보입니다.
                  </p>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      setSummaryConfig((prev) => ({ ...prev, blindMode: !prev.blindMode }));
                      setRevealedKeywords({});
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                      summaryConfig.blindMode
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                        : "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {summaryConfig.blindMode ? "🙈 암기가림막 ON" : "🧠 암기 가림막"}
                  </button>
                  {/* 모바일 전용: 표 보기 방식 토글 (카드뷰 vs 표 가로스크롤) */}
                  <button
                    onClick={() =>
                      setSummaryConfig((prev) => ({
                        ...prev,
                        mobileTableAsCards: !prev.mobileTableAsCards
                      }))
                    }
                    className="md:hidden px-3 py-2 rounded-xl bg-slate-800 text-indigo-300 border border-slate-700 text-xs font-bold"
                  >
                    {summaryConfig.mobileTableAsCards ? "📊 표 형태로 보기" : "📱 모바일 카드뷰"}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(customSummary.markdown);
                      showToast("비교표가 포함된 요약본 마크다운이 복사되었습니다!", "success");
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                  >
                    📋 복사
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([customSummary.markdown], {
                        type: "text/markdown;charset=utf-8"
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `정보보안기사_비주얼핵심요약본_${new Date().toISOString().slice(0, 10)}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast("마크다운(.md) 파일이 다운로드되었습니다!", "success");
                    }}
                    className="hidden sm:inline-block px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    💾 .MD 저장
                  </button>
                </div>
              </div>

              {/* 뷰 모드 전환 탭 (모바일에서는 세로/가로 꽉 차게 배치) */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {[
                    {
                      id: "visual",
                      label: "📊 과목별 비교표 & 함정 노트"
                    },
                    {
                      id: "cheatsheet",
                      label: "⚡ 시험직전 숫자·명령어 족보"
                    },
                    {
                      id: "mynotes",
                      label: `🚨 내 오답(${customSummary.wrongQuestions.length})·북마크(${customSummary.bookmarkedQuestions.length})`
                    }
                  ].map((vm) => (
                    <button
                      key={vm.id}
                      onClick={() => setSummaryConfig((prev) => ({ ...prev, viewMode: vm.id }))}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        summaryConfig.viewMode === vm.id
                          ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20"
                          : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {vm.label}
                    </button>
                  ))}
                </div>

                {/* 키워드 즉시 검색 (모바일 w-full, 데스크톱 w-64) */}
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <input
                    type="text"
                    placeholder="🔍 표/개념 검색 (예: 72시간, utmp, CBC)..."
                    value={summaryConfig.searchKeyword}
                    onChange={(e) =>
                      setSummaryConfig((prev) => ({ ...prev, searchKeyword: e.target.value }))
                    }
                    className="bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 w-full lg:w-64 outline-none"
                  />
                  {summaryConfig.searchKeyword && (
                    <button
                      onClick={() => setSummaryConfig((prev) => ({ ...prev, searchKeyword: "" }))}
                      className="text-xs text-slate-400 hover:text-white px-2 shrink-0"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>

              {/* 과목 빠른 선택 탭 (모바일에서도 한눈에 눌리는 그리드/칩) */}
              {summaryConfig.viewMode === "visual" && (
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5">
                    {window.INFOSEC_SUBJECTS.map((s) => {
                      const isSingleSelected =
                        summaryConfig.subjectIds.length === 1 &&
                        summaryConfig.subjectIds[0] === s.id;
                      const isIncluded = summaryConfig.subjectIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() =>
                            setSummaryConfig((prev) => ({
                              ...prev,
                              subjectIds: [s.id]
                            }))
                          }
                          className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold border transition text-center truncate ${
                            isSingleSelected
                              ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                              : isIncluded && summaryConfig.subjectIds.length > 1
                              ? "bg-indigo-950/60 text-indigo-200 border-indigo-500/40"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          {s.id}과목 {s.shortName.replace("보안", "")}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setSummaryConfig((prev) => ({
                          ...prev,
                          subjectIds: [1, 2, 3, 4, 5]
                        }))
                      }
                      className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold border transition text-center sm:ml-auto ${
                        summaryConfig.subjectIds.length === 5
                          ? "bg-emerald-600 text-white border-emerald-400"
                          : "bg-slate-950 text-slate-300 border-slate-800"
                      }`}
                    >
                      📚 전 과목 보기
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ================= [VIEW 1] 시험 직전 필수 숫자·명령어·공식 초압축 족보 ================= */}
            {summaryConfig.viewMode === "cheatsheet" && (
              <div className="space-y-4 sm:space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase">
                      ⚡ 시험장 들어가기 10분 전 필수 체크
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                      가장 많이 헷갈리는 숫자 · 포트 · 법규 기한 · 암호학 공식 족보
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                  {(window.QUICK_CHEATSHEET || []).map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg"
                    >
                      <div className="px-4 sm:px-5 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          {group.category}
                        </h4>
                        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold shrink-0">
                          필수 암기
                        </span>
                      </div>
                      <div className="divide-y divide-slate-800/80">
                        {group.items
                          .filter((it) => {
                            if (!summaryConfig.searchKeyword.trim()) return true;
                            const kw = summaryConfig.searchKeyword.trim().toLowerCase();
                            return (
                              it.key.toLowerCase().includes(kw) ||
                              it.val.toLowerCase().includes(kw)
                            );
                          })
                          .map((item, iIdx) => {
                            const blindKey = `cs_${gIdx}_${iIdx}`;
                            const isHidden =
                              summaryConfig.blindMode && !revealedKeywords[blindKey];
                            return (
                              <div
                                key={iIdx}
                                className="p-3.5 sm:p-4 hover:bg-slate-800/30 transition flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-2 sm:items-center"
                              >
                                <div className="sm:col-span-5 font-bold text-xs sm:text-sm text-indigo-300">
                                  {item.key}
                                </div>
                                <div
                                  onClick={() => {
                                    if (summaryConfig.blindMode) {
                                      setRevealedKeywords((prev) => ({
                                        ...prev,
                                        [blindKey]: !prev[blindKey]
                                      }));
                                    }
                                  }}
                                  className={`sm:col-span-7 text-xs sm:text-sm leading-relaxed rounded-lg px-3 py-2 border break-words ${
                                    isHidden
                                      ? "bg-indigo-500/20 text-transparent border-indigo-400/40 cursor-pointer select-none"
                                      : "bg-slate-950/80 text-amber-200 border-slate-800 font-medium"
                                  }`}
                                >
                                  {item.val}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= [VIEW 2] 내 오답 & 북마크 전용 요약 뷰 ================= */}
            {summaryConfig.viewMode === "mynotes" && (
              <div className="space-y-5">
                <div className="p-4 sm:p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-rose-300">
                      🚨 최우선 암기! 내가 틀린 문제 핵심 요점 ({customSummary.wrongQuestions.length}건)
                    </h3>
                    {customSummary.wrongQuestions.length > 0 && (
                      <button
                        onClick={() =>
                          startRandomExam({
                            ...examConfig,
                            subjectIds: [1, 2, 3, 4, 5],
                            count: customSummary.wrongQuestions.length,
                            mode: "wrong_only",
                            solveStyle: "study"
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                      >
                        🎲 오답만 재시험 보기
                      </button>
                    )}
                  </div>
                  {customSummary.wrongQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      아직 틀린 오답 문제가 없습니다. 모의고사를 풀고 틀린 문제가 생기면 이곳에 핵심 요점이 자동 정리됩니다.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {customSummary.wrongQuestions.map((wq, idx) => (
                        <div
                          key={wq.id}
                          className="p-3.5 sm:p-4 rounded-xl bg-slate-900/95 border border-rose-500/30 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 truncate">
                              {wq.tags ? wq.tags.join(" · ") : wq.id}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0">{wq.year}</span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">{wq.question}</div>
                          <div className="text-xs sm:text-sm font-semibold text-amber-200 bg-slate-950 p-3 rounded-lg border border-slate-800 break-words">
                            💡 {renderFormattedText(wq.keyPoint || wq.explanation, `wrong_only_${idx}`)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-amber-300">
                    ⭐ 내가 북마크한 중요 기출 포인트 ({customSummary.bookmarkedQuestions.length}건)
                  </h3>
                  {customSummary.bookmarkedQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      문제 풀이 중 [☆ 북마크] 버튼을 누르면 이곳에 중요 요점이 자동 수집됩니다.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {customSummary.bookmarkedQuestions.map((bq, idx) => (
                        <div
                          key={bq.id}
                          className="p-3.5 sm:p-4 rounded-xl bg-slate-900/95 border border-amber-500/30 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 truncate">
                              {bq.tags ? bq.tags.join(" · ") : bq.id}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0">{bq.year}</span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">{bq.question}</div>
                          <div className="text-xs sm:text-sm font-semibold text-amber-200 bg-slate-950 p-3 rounded-lg border border-slate-800 break-words">
                            ⭐ {renderFormattedText(bq.keyPoint || bq.explanation, `bm_only_${idx}`)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= [VIEW 3] 과목별 비주얼 비교표 & 기출함정 상세 요약집 ================= */}
            {summaryConfig.viewMode === "visual" && (
              <div className="space-y-6">
                {customSummary.subjectBlocks.map((block) => {
                  if (!block.subject || !block.baseSummary) return null;
                  return (
                    <div
                      key={block.subject.id}
                      className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl"
                    >
                      {/* 과목 헤더 배너 */}
                      <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span
                              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${block.subject.bgLight} ${block.subject.textColor} border ${block.subject.borderColor}`}
                            >
                              {block.subject.shortName}
                            </span>
                            <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white">
                              {block.baseSummary.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold">
                              🎯 {block.baseSummary.examWeight}
                            </span>
                            <button
                              onClick={() =>
                                startRandomExam({
                                  ...examConfig,
                                  subjectIds: [block.subject.id],
                                  count: 10,
                                  mode: "all",
                                  solveStyle: "study"
                                })
                              }
                              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold no-print"
                            >
                              🎲 이 과목 문제 풀기
                            </button>
                          </div>
                        </div>

                        {block.baseSummary.overview && (
                          <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/90 px-3.5 py-2.5 rounded-xl border border-slate-800 leading-relaxed">
                            📌 <strong className="text-indigo-300">출제 경향:</strong>{" "}
                            {block.baseSummary.overview}
                          </p>
                        )}

                        {/* 단원 빠른 이동 목차 */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 no-print">
                          {block.baseSummary.sections.map((sec, idx) => (
                            <a
                              key={idx}
                              href={`#${sec.id || `sec_${block.subject.id}_${idx}`}`}
                              className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-800 transition"
                            >
                              {sec.topic}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* 단원별 상세 비주얼 카드 & 비교 테이블 */}
                      <div className="p-3 sm:p-6 space-y-5 sm:space-y-8">
                        {block.baseSummary.sections.map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            id={sec.id || `sec_${block.subject.id}_${sIdx}`}
                            className="rounded-2xl bg-slate-950/70 border border-slate-800/90 overflow-hidden"
                          >
                            {/* 단원 타이틀 & 출제 중요도 배지 */}
                            <div className="px-3.5 sm:px-5 py-3 sm:py-4 bg-slate-900/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                              <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-white flex items-center gap-2">
                                <span className="w-1.5 h-4 sm:w-2 sm:h-5 rounded-full bg-indigo-500 inline-block shrink-0" />
                                <span>{sec.topic}</span>
                              </h4>
                              {sec.importance && (
                                <span className="text-[11px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  {sec.importance}
                                </span>
                              )}
                            </div>

                            <div className="p-3 sm:p-5 space-y-3.5 sm:space-y-4">
                              {sec.summary && (
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                  {sec.summary}
                                </p>
                              )}

                              {/* ★ 모바일 전용 카드형 비교 뷰 (화면에 100% 딱 맞게 들어가며 절대 잘리지 않음!) ★ */}
                              {sec.table && summaryConfig.mobileTableAsCards && (
                                <div className="md:hidden space-y-2.5">
                                  {sec.table.rows.map((row, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-2"
                                    >
                                      {/* 첫 번째 컬럼을 카드의 헤더 타이틀로 표시 */}
                                      <div className="pb-2 border-b border-slate-800 flex items-start justify-between gap-2">
                                        <span className="font-extrabold text-sm text-indigo-300 whitespace-pre-line">
                                          {row[0]}
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                                          {sec.table.headers[0]}
                                        </span>
                                      </div>

                                      {/* 나머지 컬럼들을 라벨: 값 형태로 깔끔하게 정렬 */}
                                      <div className="space-y-1.5 text-xs">
                                        {row.slice(1).map((cell, cIdx) => {
                                          const realColIdx = cIdx + 1;
                                          const cellKey = `tbl_${block.subject.id}_${sIdx}_${rIdx}_${realColIdx}`;
                                          const isBlindTarget =
                                            summaryConfig.blindMode && !revealedKeywords[cellKey];
                                          return (
                                            <div
                                              key={realColIdx}
                                              className="flex flex-col gap-0.5 bg-slate-950/70 p-2 rounded-lg border border-slate-800/60"
                                            >
                                              <span className="text-[10px] font-bold text-slate-400">
                                                {sec.table.headers[realColIdx]}
                                              </span>
                                              <div
                                                onClick={() => {
                                                  if (summaryConfig.blindMode) {
                                                    setRevealedKeywords((prev) => ({
                                                      ...prev,
                                                      [cellKey]: !prev[cellKey]
                                                    }));
                                                  }
                                                }}
                                                className={`whitespace-pre-line leading-relaxed break-words ${
                                                  isBlindTarget
                                                    ? "bg-indigo-500/20 text-transparent rounded px-2 py-0.5 cursor-pointer select-none"
                                                    : realColIdx === 1
                                                    ? "font-semibold text-amber-200"
                                                    : "text-slate-200"
                                                }`}
                                              >
                                                {cell}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ★ 데스크톱 비교 테이블 (또는 모바일에서 표 형태 보기 선택 시) ★ */}
                              {sec.table && (
                                <div
                                  className={`${
                                    summaryConfig.mobileTableAsCards ? "hidden md:block" : "block"
                                  } overflow-x-auto rounded-xl border border-slate-800 shadow-inner`}
                                >
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-indigo-950/60 border-b border-slate-800 text-indigo-200 text-xs font-extrabold uppercase">
                                        {sec.table.headers.map((h, hIdx) => (
                                          <th
                                            key={hIdx}
                                            className="py-3 px-3.5 border-r border-slate-800/80 last:border-r-0"
                                          >
                                            {h}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm">
                                      {sec.table.rows.map((row, rIdx) => (
                                        <tr
                                          key={rIdx}
                                          className={
                                            rIdx % 2 === 0
                                              ? "bg-slate-950/90 hover:bg-slate-900/90 transition"
                                              : "bg-slate-900/40 hover:bg-slate-900/90 transition"
                                          }
                                        >
                                          {row.map((cell, cIdx) => {
                                            const cellKey = `tbl_${block.subject.id}_${sIdx}_${rIdx}_${cIdx}`;
                                            const isBlindTarget =
                                              summaryConfig.blindMode &&
                                              cIdx > 0 &&
                                              !revealedKeywords[cellKey];
                                            return (
                                              <td
                                                key={cIdx}
                                                onClick={() => {
                                                  if (summaryConfig.blindMode && cIdx > 0) {
                                                    setRevealedKeywords((prev) => ({
                                                      ...prev,
                                                      [cellKey]: !prev[cellKey]
                                                    }));
                                                  }
                                                }}
                                                className={`py-3 px-3.5 border-r border-slate-800/60 last:border-r-0 whitespace-pre-line leading-relaxed align-top ${
                                                  cIdx === 0
                                                    ? "font-extrabold text-indigo-300 bg-slate-900/60 min-w-[130px]"
                                                    : isBlindTarget
                                                    ? "bg-indigo-500/15 text-transparent cursor-pointer select-none"
                                                    : cIdx === 1
                                                    ? "font-semibold text-amber-200/95"
                                                    : "text-slate-200"
                                                }`}
                                              >
                                                {cell}
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* 추가 핵심 요약 불릿 */}
                              {sec.bullets && sec.bullets.length > 0 && (
                                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                  <div className="text-xs font-bold text-indigo-400">
                                    📌 필수 추가 암기 포인트
                                  </div>
                                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 list-disc list-inside leading-relaxed break-words">
                                    {sec.bullets.map((bullet, bIdx) => (
                                      <li key={bIdx} className="leading-relaxed">
                                        {renderFormattedText(
                                          bullet,
                                          `subj_${block.subject.id}_${sIdx}_${bIdx}`
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* ⚠️ 기출 함정 주의보 */}
                              {sec.trap && (
                                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-950 border border-rose-500/40 text-xs sm:text-sm text-rose-100 leading-relaxed flex items-start gap-2.5 break-words">
                                  <span className="text-base sm:text-lg shrink-0">🚨</span>
                                  <div className="min-w-0 flex-1">
                                    {renderFormattedText(
                                      sec.trap,
                                      `trap_${block.subject.id}_${sIdx}`
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* 해당 과목 기출문제에서 추출된 한 줄 암기 요점 2열 카드 그리드 */}
                        {block.keyPoints.length > 0 && (
                          <div className="p-3.5 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <h4 className="text-sm sm:text-base font-extrabold text-amber-300">
                                💡 기출문제 직결 한 줄 암기 카드 ({block.keyPoints.length}개)
                              </h4>
                              <span className="text-[11px] sm:text-xs text-slate-400">
                                기출 빈출 핵심 한 줄 정리
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                              {block.keyPoints.map((kp, kIdx) => (
                                <div
                                  key={kp.id}
                                  className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed flex flex-col justify-between gap-2 break-words ${
                                    kp.isWrong
                                      ? "bg-rose-950/30 border-rose-500/50 text-slate-100"
                                      : kp.isBookmarked
                                      ? "bg-amber-950/25 border-amber-500/40 text-slate-100"
                                      : "bg-slate-950/90 border-slate-800 text-slate-200"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-1">
                                    <div className="flex flex-wrap items-center gap-1">
                                      {kp.tags.slice(0, 3).map((tag, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {kp.isWrong && (
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500 text-white font-bold">
                                          🚨 오답주의
                                        </span>
                                      )}
                                      {kp.isBookmarked && (
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                                          ⭐ 북마크
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-slate-200 font-medium">
                                    {renderFormattedText(
                                      kp.keyPoint,
                                      `kp_${block.subject.id}_${kIdx}`
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= 4. 오답노트 & 북마크 탭 ================= */}
        {activeTab === "wrongnote" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">❌ 오답노트 & ⭐ 북마크 집중 복습</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  틀렸거나 별표한 문제들을 한눈에 복습하고 오답만 모아 재시험을 볼 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    startRandomExam({
                      ...examConfig,
                      subjectIds: [1, 2, 3, 4, 5],
                      count: Math.max(5, totalStats.wrong),
                      mode: "wrong_only",
                      solveStyle: "study"
                    })
                  }
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  🚨 오답만 다시 풀기
                </button>
                <button
                  onClick={() =>
                    startRandomExam({
                      ...examConfig,
                      subjectIds: [1, 2, 3, 4, 5],
                      count: Math.max(5, bookmarks.length),
                      mode: "bookmarked",
                      solveStyle: "study"
                    })
                  }
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  ⭐ 북마크만 풀기
                </button>
              </div>
            </div>

            {(() => {
              const targetList = questions.filter(
                (q) => (history[q.id] && history[q.id].lastWrong) || bookmarks.includes(q.id)
              );
              if (targetList.length === 0) {
                return (
                  <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
                    <div className="text-3xl mb-2">✨</div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                      현재 등록된 오답이나 북마크 문제가 없습니다
                    </h3>
                    <p className="text-xs text-slate-400">
                      랜덤 기출 모의고사를 풀면서 틀린 문제나 별표한 문제가 이곳에 자동으로 기록됩니다.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {targetList.map((q) => {
                    const isWrong = history[q.id] && history[q.id].lastWrong;
                    const isBm = bookmarks.includes(q.id);
                    const subj = window.INFOSEC_SUBJECTS.find((s) => s.id === Number(q.subjectId));
                    return (
                      <div
                        key={q.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {isWrong && (
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                                🚨 최근 오답
                              </span>
                            )}
                            {isBm && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                                ⭐ 북마크
                              </span>
                            )}
                            {subj && (
                              <span className={`text-xs font-semibold ${subj.textColor}`}>
                                {subj.shortName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleInstantVariation(q)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold"
                            >
                              ⚡ 변형생성
                            </button>
                            <button
                              onClick={() => handleToggleBookmark(q.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                            >
                              {isBm ? "해제" : "북마크"}
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-white break-words">
                          {q.question}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-lg border break-words ${
                                idx === q.answer
                                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold"
                                  : "bg-slate-950/60 border-slate-800 text-slate-400"
                              }`}
                            >
                              {idx + 1}. {opt}
                            </div>
                          ))}
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 break-words">
                          <div>
                            <strong className="text-indigo-400">[해설]</strong> {q.explanation}
                          </div>
                          {q.keyPoint && (
                            <div className="text-amber-300">
                              <strong>💡 핵심 요점:</strong> {q.keyPoint}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ================= 5. 기출 추가 & AI 변형 생성 탭 ================= */}
        {activeTab === "manager" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 좌측: AI / 스마트 기출 변형 문제 생성기 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                  AI & 스마트 변형 엔진
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-2">
                  🤖 기출 기반 예상/변형 문제 자동 생성
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  과목과 취약 주제를 지정하면 새로운 4지선다 문제와 요약 포인트를 생성합니다.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    대상 과목 선택
                  </label>
                  <select
                    value={aiForm.subjectId}
                    onChange={(e) =>
                      setAiForm((prev) => ({ ...prev, subjectId: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200"
                  >
                    {window.INFOSEC_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    집중 출제 키워드 (선택)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 리눅스 PAM, IPSec, SQL Injection..."
                    value={aiForm.topicKeyword}
                    onChange={(e) =>
                      setAiForm((prev) => ({ ...prev, topicKeyword: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      생성 문항 수
                    </label>
                    <select
                      value={aiForm.count}
                      onChange={(e) =>
                        setAiForm((prev) => ({ ...prev, count: Number(e.target.value) }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200"
                    >
                      <option value={2}>2문항</option>
                      <option value={3}>3문항</option>
                      <option value={5}>5문항</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Gemini API Key (선택)
                    </label>
                    <input
                      type="password"
                      placeholder="미입력 시 내장 스마트변형"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200"
                    />
                  </div>
                </div>

                <button
                  disabled={aiForm.loading}
                  onClick={handleGenerateAIQuestions}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition"
                >
                  {aiForm.loading
                    ? "⏳ 기출 분석 및 변형 문제 생성 중..."
                    : "⚡ 기출 변형 문제 자동 생성하여 DB에 추가"}
                </button>
              </div>
            </div>

            {/* 우측: 기출 지문 텍스트 / JSON 일괄 파싱 업로드 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                  기출 지문 자동 파서
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-2">
                  📥 내 기출문제 텍스트 붙여넣기
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  기출 텍스트를 붙여넣으면 문제, 보기(①~④), 정답, 해설을 자동으로 분리해 등록합니다.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    저장할 과목 분류
                  </label>
                  <select
                    value={importSubjectId}
                    onChange={(e) => setImportSubjectId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200"
                  >
                    {window.INFOSEC_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-400">
                      기출 텍스트 입력
                    </label>
                    <button
                      onClick={() =>
                        setRawImportText(
                          `1. 다음 중 리눅스에서 파일의 기본 접근 권한을 설정하는 명령어는?\n① chmod\n② chown\n③ umask\n④ chgrp\n정답: 3\n해설: umask는 파일(666)이나 디렉터리(777) 생성 시 차감할 기본 권한 마스크를 설정합니다.\n핵심: umask 022 설정 시 일반 파일은 644, 디렉터리는 755 권한으로 생성됨`
                        )
                      }
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      예시 채우기
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={rawImportText}
                    onChange={(e) => setRawImportText(e.target.value)}
                    placeholder={`예시:\n1. 문제 지문을 입력하세요?\n① 보기 1\n② 보기 2\n③ 보기 3\n④ 보기 4\n정답: 2\n해설: 해설 내용...\n핵심: 한 줄 핵심 요점...`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleImportText}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition"
                >
                  📥 텍스트 자동 파싱하여 등록
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-slate-900 py-4 px-4 text-center text-[11px] sm:text-xs text-slate-500 no-print">
        SecuMaster 정보보안기사 필기 학습 시스템
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
