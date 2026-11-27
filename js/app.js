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
  const [examSession, setExamSession] = useState(null); // { list, currentIndex, answers: {}, revealed: {}, finished: false, elapsedSec: 0 }

  // 요약본 설정 상태
  const [summaryConfig, setSummaryConfig] = useState({
    subjectIds: [1], // 기본으로 1과목부터 한눈에 집중해서 볼 수 있도록 설정 (전체 과목 버튼으로 전환 가능)
    viewMode: "visual", // visual (과목별 비주얼 비교표·노트) | cheatsheet (시험직전 숫자·명령어 족보) | mynotes (오답·북마크 요점)
    includeWrongNotes: true,
    includeBookmarks: true,
    searchKeyword: "",
    blindMode: false // 암기 가림막(플래시카드) 모드
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
  };

  // 보기 선택 처리
  const handleSelectOption = (qIndex, optIndex) => {
    if (!examSession || examSession.finished) return;
    const currentQ = examSession.list[qIndex];

    // 학습 모드에서 이미 정답을 확인한 경우 재선택 방지
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
                ? "inline-block mx-1 px-2 py-0.5 rounded bg-indigo-500/30 text-transparent border border-indigo-400/50 cursor-pointer select-none transition hover:bg-indigo-500/40"
                : "font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded cursor-pointer"
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 lg:px-8 py-3.5 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                  SecuMaster <span className="text-indigo-400">정보보안기사</span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  필기 기출생성 & 요약 시스템
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                5대 과목 기출 기반 랜덤 모의고사 · 스마트 변형 출제 · 오답 연동 핵심 요약본 생성기
              </p>
            </div>
          </div>

          {/* 네비게이션 탭 */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: "dashboard", label: "📊 대시보드" },
              { id: "exam", label: "🎲 랜덤 기출·모의고사" },
              { id: "summary", label: "📝 핵심 요약본" },
              { id: "wrongnote", label: `❌ 오답·북마크 (${totalStats.wrong})` },
              { id: "manager", label: "➕ 기출추가·AI생성" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 알림 토스트 */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md px-4 py-3 rounded-xl shadow-2xl border bg-slate-900 border-indigo-500/50 text-sm flex items-center gap-3 animate-bounce no-print">
          <span>{toast.type === "warn" ? "⚠️" : "✅"}</span>
          <span className="font-medium text-slate-100">{toast.msg}</span>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* ================= 1. 대시보드 탭 ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* 상단 히어로 & 원클릭 실행 카드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 mb-3">
                    🎯 합격 기준: 과목당 40점 이상, 전 과목 평균 60점 이상
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    오늘도 정보보안기사 필기 합격을 향해 달려볼까요?
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    현재 문제 은행에 총 <strong className="text-indigo-400">{totalStats.total}문항</strong>의 핵심 기출 및 변형 문제가 준비되어 있습니다.
                    버튼 하나로 랜덤 모의고사를 생성하거나 취약 과목 요약본을 즉시 만들어보세요.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
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
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition"
                  >
                    🎲 전 과목 랜덤 10제 바로 풀기 (학습모드)
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
                    className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition"
                  >
                    ⏱️ 실전 기출+변형 모의고사 20제
                  </button>
                  <button
                    onClick={() => setActiveTab("summary")}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
                  >
                    📝 5과목 핵심 요약본 보기
                  </button>
                </div>
              </div>

              {/* 전체 학습 통계 요약 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  나의 누적 학습 현황
                </h3>
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-xs text-slate-400">평균 정답률</div>
                    <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                      {totalStats.attempts > 0 ? `${totalStats.accuracy}%` : "-"}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {totalStats.accuracy >= 60 ? "합격 안정권 (60점+)" : "60% 이상 달성 목표"}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-xs text-slate-400">누적 풀이 수</div>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                      {totalStats.attempts}회
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      고유 문제 {totalStats.solved} / {totalStats.total}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-xs text-slate-400">복습 필요한 오답</div>
                    <div className="text-2xl font-extrabold text-rose-400 mt-1">
                      {totalStats.wrong}문항
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">오답노트 자동 연동</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-xs text-slate-400">중요 북마크</div>
                    <div className="text-2xl font-extrabold text-amber-400 mt-1">
                      {bookmarks.length}문항
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">시험 직전 필수 체크</div>
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">
                  📚 5대 과목별 분석 및 집중 공략
                </h3>
                <span className="text-xs text-slate-400">
                  각 과목의 기출 풀기 또는 핵심 요약본으로 바로 이동할 수 있습니다
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{subj.description}</p>
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
                          className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-xs font-semibold text-slate-200 hover:text-white transition"
                        >
                          🎲 기출 풀기
                        </button>
                        <button
                          onClick={() => {
                            setSummaryConfig((prev) => ({ ...prev, subjectIds: [subj.id] }));
                            setActiveTab("summary");
                          }}
                          className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
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
          <div className="space-y-6">
            {/* 상단 출제 설정 패널 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">🎲 랜덤 기출문제 생성기 설정</h2>
                  <p className="text-xs text-slate-400">
                    원하는 과목과 문항 수, 선지 셔플 및 스마트 변형 옵션을 조합하여 매번 새로운 시험지를 생성합니다.
                  </p>
                </div>
                <button
                  onClick={() => startRandomExam()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
                >
                  🔄 새 랜덤 기출 생성 및 시작
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3 border-t border-slate-800">
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
                  <div className="flex gap-2">
                    <select
                      value={examConfig.count}
                      onChange={(e) =>
                        setExamConfig((prev) => ({ ...prev, count: Number(e.target.value) }))
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 flex-1"
                    >
                      <option value={5}>5문항 (미니)</option>
                      <option value={10}>10문항 (빠른학습)</option>
                      <option value={15}>15문항 (집중)</option>
                      <option value={20}>20문항 (1과목 분량)</option>
                      <option value={30}>30문항 (종합 모의)</option>
                      <option value={50}>50문항 (마라톤)</option>
                    </select>
                    <select
                      value={examConfig.mode}
                      onChange={(e) =>
                        setExamConfig((prev) => ({ ...prev, mode: e.target.value }))
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 flex-1"
                    >
                      <option value="all">전체 랜덤 추출</option>
                      <option value="unsolved_first">안 푼 문제 우선</option>
                      <option value="wrong_only">틀린 오답만 추출</option>
                      <option value="bookmarked">북마크 문제만</option>
                    </select>
                  </div>
                </div>

                {/* 풀이 방식 & 변형 옵션 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    풀이 모드 & 변형 옵션
                  </label>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-3">
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
                        <span>선지 순서 셔플</span>
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
              <div className="p-12 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
                <div className="text-4xl mb-3">🎲</div>
                <h3 className="text-lg font-bold text-white mb-1">
                  위에서 조건을 선택하고 [새 랜덤 기출 생성 및 시작]을 눌러주세요
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  매번 문제 순서와 4지선다 보기가 랜덤으로 섞여 단순 번호 암기를 방지하고 진짜 실력을 키워줍니다.
                </p>
                <button
                  onClick={() => startRandomExam()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm"
                >
                  지금 바로 10문항 시작하기
                </button>
              </div>
            )}

            {/* 시험 진행 중 또는 결과 화면 */}
            {examSession && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 좌측/중앙: 현재 문제 풀이 영역 */}
                <div className="lg:col-span-3 space-y-4">
                  {/* 결과 요약 배너 (시험 종료 시) */}
                  {examSession.finished && (
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40">
                      {(() => {
                        const total = examSession.list.length;
                        let correctCnt = 0;
                        examSession.list.forEach((q, idx) => {
                          if (examSession.answers[idx] === q.answer) correctCnt++;
                        });
                        const score = Math.round((correctCnt / total) * 100);
                        return (
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                모의고사 채점 결과
                              </span>
                              <h3 className="text-2xl font-black text-white mt-1">
                                {score}점{" "}
                                <span className="text-base font-normal text-slate-300">
                                  ({correctCnt} / {total}문항 정답 · 소요시간 {formatTime(examSession.elapsedSec)})
                                </span>
                              </h3>
                              <p className="text-xs text-slate-300 mt-1">
                                {score >= 60
                                  ? "🎉 합격 기준(60점)을 통과했습니다! 틀린 문제의 핵심 요점을 요약본에서 복습해보세요."
                                  : "💪 조금만 더 보완하면 합격입니다! 오답 문제는 자동으로 오답노트와 맞춤 요약본에 반영되었습니다."}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setActiveTab("summary")}
                                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
                              >
                                📝 오답 반영 요약본 바로 보기
                              </button>
                              <button
                                onClick={() => startRandomExam()}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                              >
                                🔄 새 랜덤 시험지 생성
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
                      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                        {/* 문제 상단 메타 바 */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                              문제 {qIdx + 1} / {examSession.list.length}
                            </span>
                            {subj && (
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${subj.bgLight} ${subj.textColor} border ${subj.borderColor}`}
                              >
                                {subj.name}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                              {currentQ.year}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">
                              난이도: {currentQ.difficulty || "중"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleInstantVariation(currentQ)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                              title="이 문제의 개념을 변형한 문제를 즉시 생성하여 다음 문제로 추가합니다"
                            >
                              ⚡ 이 문제 변형 출제
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
                        <h3 className="text-base md:text-lg font-bold text-white leading-relaxed mb-5">
                          {currentQ.question}
                        </h3>

                        {/* 4지선다 보기 */}
                        <div className="space-y-2.5">
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
                                className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 ${btnStyle}`}
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
                                <span className="text-sm leading-relaxed flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* 정답 및 해설 & 한 줄 요약 박스 */}
                        {showAnswer && (
                          <div className="mt-6 p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                            <div className="flex items-center justify-between">
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

                            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                              <strong className="text-indigo-400">[상세 해설]</strong>{" "}
                              {currentQ.explanation}
                            </div>

                            {currentQ.keyPoint && (
                              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs md:text-sm text-amber-200">
                                <strong className="text-amber-400">💡 시험장 한 줄 암기 요점: </strong>
                                {currentQ.keyPoint}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 하단 이전/다음 이동 버튼 */}
                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                          <button
                            disabled={qIdx === 0}
                            onClick={() =>
                              setExamSession((prev) => ({
                                ...prev,
                                currentIndex: Math.max(0, prev.currentIndex - 1)
                              }))
                            }
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold"
                          >
                            ← 이전 문제
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
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold"
                              >
                                👀 정답·해설 바로 보기
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
                                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                              >
                                다음 문제 →
                              </button>
                            ) : (
                              !examSession.finished && (
                                <button
                                  onClick={finishExamSession}
                                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
                                >
                                  ✅ 제출 및 결과 확인
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
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 h-fit space-y-4">
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

        {/* ================= 3. 핵심 요약본 생성기 탭 (비주얼 비교표 & 족보 업그레이드) ================= */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            {/* 상단 컨트롤 & 뷰 모드 선택 바 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 no-print">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg md:text-xl font-bold text-white">
                      📝 한눈에 들어오는 비주얼 핵심 요약집 & 시험장 족보
                    </h2>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      비교표 · 기출함정 · 단답족보
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    줄글 대신 시험에 그대로 나오는 비교 테이블, ⚠️기출 함정 주의보, 그리고 시험 직전 필수 숫자·명령어 족보로 구조화했습니다.
                  </p>
                </div>

                {/* 우측 액션 버튼 */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSummaryConfig((prev) => ({ ...prev, blindMode: !prev.blindMode }));
                      setRevealedKeywords({});
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                      summaryConfig.blindMode
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                        : "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {summaryConfig.blindMode ? "🙈 암기 가림막 ON (클릭해 정답확인)" : "🧠 핵심키워드 암기 가림막"}
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
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    💾 .MD 저장
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    🖨️ 인쇄/PDF
                  </button>
                </div>
              </div>

              {/* 뷰 모드 전환 탭 (비주얼 과목별 비교표 vs 시험직전 숫자/명령어 족보 vs 내 오답·북마크 요점) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    {
                      id: "visual",
                      label: "📊 과목별 비주얼 비교표 & 기출함정 노트",
                      desc: "표와 경고 박스로 한눈에 정리"
                    },
                    {
                      id: "cheatsheet",
                      label: "⚡ 시험 직전 필수 숫자·명령어·공식 족보",
                      desc: "헷갈리는 숫자·포트·법규 기한 총정리"
                    },
                    {
                      id: "mynotes",
                      label: `🚨 내 오답(${customSummary.wrongQuestions.length}) & ⭐ 북마크(${customSummary.bookmarkedQuestions.length}) 요점`,
                      desc: "내가 틀린 문제 핵심만 모아보기"
                    }
                  ].map((vm) => (
                    <button
                      key={vm.id}
                      onClick={() => setSummaryConfig((prev) => ({ ...prev, viewMode: vm.id }))}
                      className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold border transition flex items-center gap-2 ${
                        summaryConfig.viewMode === vm.id
                          ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/20"
                          : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span>{vm.label}</span>
                    </button>
                  ))}
                </div>

                {/* 키워드 즉시 검색 */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="🔍 표/개념 검색 (예: 72시간, utmp, CBC, Snort)..."
                    value={summaryConfig.searchKeyword}
                    onChange={(e) =>
                      setSummaryConfig((prev) => ({ ...prev, searchKeyword: e.target.value }))
                    }
                    className="bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 w-64 outline-none"
                  />
                  {summaryConfig.searchKeyword && (
                    <button
                      onClick={() => setSummaryConfig((prev) => ({ ...prev, searchKeyword: "" }))}
                      className="text-xs text-slate-400 hover:text-white px-2"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>

              {/* 과목 빠른 선택 탭 (visual 모드일 때 한 과목씩 집중해서 보거나 전체 보기 전환) */}
              {summaryConfig.viewMode === "visual" && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 mr-1">과목 선택:</span>
                  {window.INFOSEC_SUBJECTS.map((s) => {
                    const isSingleSelected =
                      summaryConfig.subjectIds.length === 1 && summaryConfig.subjectIds[0] === s.id;
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
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                          isSingleSelected
                            ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                            : isIncluded && summaryConfig.subjectIds.length > 1
                            ? "bg-indigo-950/60 text-indigo-200 border-indigo-500/40"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        {s.id}과목: {s.shortName}
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ml-auto ${
                      summaryConfig.subjectIds.length === 5
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    📚 5과목 전체 한 번에 보기
                  </button>
                </div>
              )}
            </div>

            {/* ================= [VIEW 1] 시험 직전 필수 숫자·명령어·공식 초압축 족보 ================= */}
            {summaryConfig.viewMode === "cheatsheet" && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      ⚡ 시험장 들어가기 10분 전 필수 체크
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-0.5">
                      가장 많이 헷갈리는 숫자 · 포트 · 법규 기한 · 암호학 공식 초압축 족보
                    </h3>
                  </div>
                  <span className="text-xs text-slate-300">
                    총 {(window.QUICK_CHEATSHEET || []).reduce((acc, c) => acc + c.items.length, 0)}개 핵심 단답 포인트
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {(window.QUICK_CHEATSHEET || []).map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg"
                    >
                      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                        <h4 className="font-bold text-sm md:text-base text-white">
                          {group.category}
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
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
                                className="p-4 hover:bg-slate-800/30 transition grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                              >
                                <div className="sm:col-span-5 font-bold text-xs md:text-sm text-indigo-300">
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
                                  className={`sm:col-span-7 text-xs md:text-sm leading-relaxed rounded-lg px-3 py-2 border ${
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
              <div className="space-y-6">
                {/* 오답 요약 */}
                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base md:text-lg font-bold text-rose-300">
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
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                      >
                        🎲 이 오답들만 바로 재시험 보기
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
                          className="p-4 rounded-xl bg-slate-900/95 border border-rose-500/30 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                              {wq.tags ? wq.tags.join(" · ") : wq.id}
                            </span>
                            <span className="text-[11px] text-slate-400">{wq.year}</span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">{wq.question}</div>
                          <div className="text-xs md:text-sm font-semibold text-amber-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                            💡 {renderFormattedText(wq.keyPoint || wq.explanation, `wrong_only_${idx}`)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 북마크 요약 */}
                <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-amber-300">
                    ⭐ 내가 별표(북마크)한 중요 기출 포인트 ({customSummary.bookmarkedQuestions.length}건)
                  </h3>
                  {customSummary.bookmarkedQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      문제 풀이 중 우측 상단의 [☆ 북마크] 버튼을 누르면 이곳에 중요 요점이 자동 수집됩니다.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {customSummary.bookmarkedQuestions.map((bq, idx) => (
                        <div
                          key={bq.id}
                          className="p-4 rounded-xl bg-slate-900/95 border border-amber-500/30 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              {bq.tags ? bq.tags.join(" · ") : bq.id}
                            </span>
                            <span className="text-[11px] text-slate-400">{bq.year}</span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">{bq.question}</div>
                          <div className="text-xs md:text-sm font-semibold text-amber-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
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
              <div className="space-y-8">
                {/* 오답이 있을 경우 상단 미니 알림 배너 */}
                {customSummary.wrongQuestions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🚨</span>
                      <div>
                        <span className="text-xs md:text-sm font-bold text-rose-200">
                          현재 과목에서 내가 틀린 오답 요점 {customSummary.wrongQuestions.length}건이 있습니다!
                        </span>
                        <p className="text-xs text-rose-300/80">
                          아래 기출 한 줄 요점 카드에 빨간색 [오답주의] 배지로 강조 표시되어 있습니다.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSummaryConfig((prev) => ({ ...prev, viewMode: "mynotes" }))}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold"
                    >
                      오답 요점만 모아보기 →
                    </button>
                  </div>
                )}

                {customSummary.subjectBlocks.map((block) => {
                  if (!block.subject || !block.baseSummary) return null;
                  return (
                    <div
                      key={block.subject.id}
                      className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl"
                    >
                      {/* 과목 헤더 배너 */}
                      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-xl text-xs font-extrabold ${block.subject.bgLight} ${block.subject.textColor} border ${block.subject.borderColor}`}
                            >
                              {block.subject.shortName}
                            </span>
                            <h3 className="text-lg md:text-xl font-extrabold text-white">
                              {block.baseSummary.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold">
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
                              🎲 이 과목 문제 바로 풀기
                            </button>
                          </div>
                        </div>

                        {block.baseSummary.overview && (
                          <p className="text-xs md:text-sm text-slate-300 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
                            📌 <strong className="text-indigo-300">출제 경향 핵심:</strong>{" "}
                            {block.baseSummary.overview}
                          </p>
                        )}

                        {/* 단원 빠른 이동 목차 (Quick Jump Chips) */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 no-print">
                          <span className="text-[11px] font-bold text-slate-400 mr-1">
                            단원 바로가기:
                          </span>
                          {block.baseSummary.sections.map((sec, idx) => (
                            <a
                              key={idx}
                              href={`#${sec.id || `sec_${block.subject.id}_${idx}`}`}
                              className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-800 transition"
                            >
                              {sec.topic}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* 단원별 상세 비주얼 카드 & 비교 테이블 */}
                      <div className="p-6 space-y-8">
                        {block.baseSummary.sections.map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            id={sec.id || `sec_${block.subject.id}_${sIdx}`}
                            className="rounded-2xl bg-slate-950/70 border border-slate-800/90 overflow-hidden"
                          >
                            {/* 단원 타이틀 & 출제 중요도 배지 */}
                            <div className="px-5 py-4 bg-slate-900/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                              <h4 className="text-base md:text-lg font-extrabold text-white flex items-center gap-2">
                                <span className="w-2 h-5 rounded-full bg-indigo-500 inline-block" />
                                {sec.topic}
                              </h4>
                              {sec.importance && (
                                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  {sec.importance}
                                </span>
                              )}
                            </div>

                            <div className="p-5 space-y-4">
                              {/* 단원 한 줄 가이드 */}
                              {sec.summary && (
                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                  {sec.summary}
                                </p>
                              )}

                              {/* ★ 핵심 비주얼 비교 테이블 (Table) ★ */}
                              {sec.table && (
                                <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-inner">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-indigo-950/60 border-b border-slate-800 text-indigo-200 text-xs font-extrabold uppercase">
                                        {sec.table.headers.map((h, hIdx) => (
                                          <th
                                            key={hIdx}
                                            className="py-3 px-4 border-r border-slate-800/80 last:border-r-0 whitespace-nowrap"
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
                                                className={`py-3 px-4 border-r border-slate-800/60 last:border-r-0 whitespace-pre-line leading-relaxed align-top ${
                                                  cIdx === 0
                                                    ? "font-extrabold text-indigo-300 bg-slate-900/60 min-w-[140px]"
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
                                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                  <div className="text-xs font-bold text-indigo-400">
                                    📌 필수 추가 암기 포인트
                                  </div>
                                  <ul className="space-y-1.5 text-xs md:text-sm text-slate-200 list-disc list-inside leading-relaxed">
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

                              {/* ⚠️ 기출 함정 주의보 (Exam Trap Callout) */}
                              {sec.trap && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-950 border border-rose-500/40 text-xs md:text-sm text-rose-100 leading-relaxed flex items-start gap-3">
                                  <span className="text-lg shrink-0">🚨</span>
                                  <div>
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
                          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm md:text-base font-extrabold text-amber-300">
                                💡 기출문제 직결 한 줄 암기 카드 ({block.keyPoints.length}개)
                              </h4>
                              <span className="text-xs text-slate-400">
                                각 기출문제에서 가장 자주 나오는 핵심 한 줄 정리
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {block.keyPoints.map((kp, kIdx) => (
                                <div
                                  key={kp.id}
                                  className={`p-3.5 rounded-xl border text-xs md:text-sm leading-relaxed flex flex-col justify-between gap-2 ${
                                    kp.isWrong
                                      ? "bg-rose-950/30 border-rose-500/50 text-slate-100"
                                      : kp.isBookmarked
                                      ? "bg-amber-950/25 border-amber-500/40 text-slate-100"
                                      : "bg-slate-950/90 border-slate-800 text-slate-200"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {kp.tags.slice(0, 3).map((tag, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {kp.isWrong && (
                                        <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500 text-white font-bold">
                                          🚨 오답주의
                                        </span>
                                      )}
                                      {kp.isBookmarked && (
                                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
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
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">❌ 오답노트 & ⭐ 북마크 집중 복습</h2>
                <p className="text-xs text-slate-400">
                  최근 풀이에서 틀렸거나 별표(북마크)한 문제들을 한눈에 복습하고 오답만 모아 재시험을 볼 수 있습니다.
                </p>
              </div>
              <div className="flex gap-2">
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  🚨 오답 문제만 모아서 다시 풀기
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  ⭐ 북마크 문제만 모아서 풀기
                </button>
              </div>
            </div>

            {(() => {
              const targetList = questions.filter(
                (q) => (history[q.id] && history[q.id].lastWrong) || bookmarks.includes(q.id)
              );
              if (targetList.length === 0) {
                return (
                  <div className="p-12 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
                    <div className="text-3xl mb-2">✨</div>
                    <h3 className="text-base font-bold text-white mb-1">
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
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
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
                                {subj.name}
                              </span>
                            )}
                            <span className="text-xs text-slate-500">({q.year})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleInstantVariation(q)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold"
                            >
                              ⚡ 유사 변형문제 생성
                            </button>
                            <button
                              onClick={() => handleToggleBookmark(q.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                            >
                              {isBm ? "북마크 해제" : "북마크 추가"}
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm md:text-base font-bold text-white">{q.question}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-lg border ${
                                idx === q.answer
                                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold"
                                  : "bg-slate-950/60 border-slate-800 text-slate-400"
                              }`}
                            >
                              {idx + 1}. {opt}
                            </div>
                          ))}
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 좌측: AI / 스마트 기출 변형 문제 생성기 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                  AI & 스마트 변형 엔진
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  🤖 기출 기반 새로운 예상/변형 문제 자동 생성
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  과목과 취약 주제를 지정하면 기존 기출 패턴을 분석하여 새로운 4지선다 문제와 요약 포인트를 생성합니다.
                  (Gemini API 키를 입력하면 LLM 실시간 생성, 비워두면 내장 스마트 변형 엔진으로 즉시 생성됩니다.)
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    대상 과목 선택
                  </label>
                  <select
                    value={aiForm.subjectId}
                    onChange={(e) =>
                      setAiForm((prev) => ({ ...prev, subjectId: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
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
                    집중 출제 키워드 (선택 사항)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 리눅스 PAM 모듈, IPSec AH/ESP, SQL Injection, ISMS-P..."
                    value={aiForm.topicKeyword}
                    onChange={(e) =>
                      setAiForm((prev) => ({ ...prev, topicKeyword: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      생성 문항 수
                    </label>
                    <select
                      value={aiForm.count}
                      onChange={(e) =>
                        setAiForm((prev) => ({ ...prev, count: Number(e.target.value) }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
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
                      placeholder="미입력 시 내장 스마트변형 작동"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                    />
                  </div>
                </div>

                <button
                  disabled={aiForm.loading}
                  onClick={handleGenerateAIQuestions}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
                >
                  {aiForm.loading
                    ? "⏳ 기출 분석 및 변형 문제 생성 중..."
                    : "⚡ 기출 변형 문제 자동 생성하여 DB에 추가"}
                </button>
              </div>
            </div>

            {/* 우측: 기출 지문 텍스트 / JSON 일괄 파싱 업로드 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                  기출 지문 자동 파서
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  📥 내 기출문제 텍스트 / 복원 문제 붙여넣기
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  PDF 기출문제나 카페 복원 문제 텍스트를 아래에 붙여넣으면 문제, 보기(①~④ 또는 1)~4)), 정답, 해설을 자동으로 분리해 문제 은행과 요약본에 추가합니다.
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
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
                      기출 텍스트 또는 JSON 입력
                    </label>
                    <button
                      onClick={() =>
                        setRawImportText(
                          `1. 다음 중 리눅스에서 파일의 기본 접근 권한을 설정하는 명령어는?\n① chmod\n② chown\n③ umask\n④ chgrp\n정답: 3\n해설: umask는 파일(666)이나 디렉터리(777) 생성 시 차감할 기본 권한 마스크를 설정합니다.\n핵심: umask 022 설정 시 일반 파일은 644, 디렉터리는 755 권한으로 생성됨`
                        )
                      }
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      예시 양식 채우기
                    </button>
                  </div>
                  <textarea
                    rows={7}
                    value={rawImportText}
                    onChange={(e) => setRawImportText(e.target.value)}
                    placeholder={`예시:\n1. 문제 지문을 입력하세요?\n① 보기 1\n② 보기 2\n③ 보기 3\n④ 보기 4\n정답: 2\n해설: 해설 내용...\n핵심: 요약본에 들어갈 한 줄 핵심 요점...`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleImportText}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition"
                >
                  📥 텍스트 자동 파싱하여 문제 은행 & 요약본에 등록
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-slate-900 py-4 px-4 lg:px-8 text-center text-xs text-slate-500 no-print">
        SecuMaster 정보보안기사 필기 학습 시스템 · 기출 기반 랜덤 모의고사 및 맞춤형 요약본 생성기
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
