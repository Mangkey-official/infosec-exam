const { useState, useEffect, useMemo } = React;

function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | exam | summary | wrongnote | manager
  const [examType, setExamType] = useState("written"); // written | practical

  const [questions, setQuestions] = useState(() => window.InfoSecEngine.getAllQuestions("written"));
  const [history, setHistory] = useState(() => window.InfoSecEngine.getHistory());
  const [bookmarks, setBookmarks] = useState(() => window.InfoSecEngine.getBookmarks());
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(window.InfoSecEngine.STORAGE_KEYS.API_KEY) || "");
  const [toast, setToast] = useState(null);

  // 1. 라이트모드 / 다크모드 상태
  const [theme, setTheme] = useState(() => localStorage.getItem(window.InfoSecEngine.STORAGE_KEYS.THEME) || "dark");

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem(window.InfoSecEngine.STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // 필기/실기 모드 전환
  const handleSwitchExamType = (newType) => {
    setExamType(newType);
    setQuestions(window.InfoSecEngine.getAllQuestions(newType));
    setExamSession(null);
    setExamConfig((prev) => ({
      ...prev,
      yearFilter: "all",
      count: newType === "practical" ? 18 : 20
    }));
    if (newType === "practical" && selectedScheduleId.endsWith("_written")) {
      const nextId = selectedScheduleId.replace("_written", "_practical");
      setSelectedScheduleId(nextId);
      localStorage.setItem(window.InfoSecEngine.STORAGE_KEYS.DDAY_TARGET, nextId);
    } else if (newType === "written" && selectedScheduleId.endsWith("_practical")) {
      const nextId = selectedScheduleId.replace("_practical", "_written");
      setSelectedScheduleId(nextId);
      localStorage.setItem(window.InfoSecEngine.STORAGE_KEYS.DDAY_TARGET, nextId);
    }
  };

  // 2. 2027년 시험 일정 D-DAY 및 일정표 모달 상태
  const [selectedScheduleId, setSelectedScheduleId] = useState(
    () => localStorage.getItem(window.InfoSecEngine.STORAGE_KEYS.DDAY_TARGET) || "2027_1_written"
  );
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const currentDdayInfo = useMemo(() => {
    const schedules = window.EXAM_SCHEDULE_2027?.targets || [];
    const target = schedules.find((t) => t.id === selectedScheduleId) || schedules[0];
    if (!target) return { label: "2027 필기", shortRound: "27년 1회", ddayText: "D-DAY", diffDays: 0, target: null };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(target.date + "T00:00:00");
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const ddayText = diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-DAY" : `D+${Math.abs(diffDays)}`;
    const shortRound = target.title.replace("2027년 정기 기사 ", "");
    return {
      label: target.title,
      shortRound,
      ddayText,
      diffDays,
      target
    };
  }, [selectedScheduleId]);

  const handleSelectDdayTarget = (targetId) => {
    setSelectedScheduleId(targetId);
    localStorage.setItem(window.InfoSecEngine.STORAGE_KEYS.DDAY_TARGET, targetId);
    showToast("목표 시험일 D-DAY가 변경되었습니다!", "success");
  };

  // 3. 회원가입 & 로그인 상태
  const [currentUser, setCurrentUser] = useState(() => window.InfoSecEngine.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    nickname: "",
    cloudSyncId: "",
    backupCodeInput: "",
    loading: false
  });

  // 모의고사 설정 및 진행 상태
  const [examConfig, setExamConfig] = useState({
    subjectIds: [1, 2, 3, 4, 5],
    yearFilter: "all",
    count: 20,
    mode: "all",
    solveStyle: "study",
    shuffleOptions: true,
    includeSmartVariations: false
  });
  const [examSession, setExamSession] = useState(null);

  // 요약본 설정 상태
  const [summaryConfig, setSummaryConfig] = useState({
    subjectIds: [1],
    viewMode: "visual",
    mobileTableAsCards: true,
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

  const isPractical = examType === "practical";

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const refreshData = () => {
    setCurrentUser(window.InfoSecEngine.getCurrentUser());
    setQuestions(window.InfoSecEngine.getAllQuestions(examType));
    setHistory(window.InfoSecEngine.getHistory());
    setBookmarks(window.InfoSecEngine.getBookmarks());
  };

  const availableYears = useMemo(
    () => window.InfoSecEngine.getAvailableYears(examType),
    [questions, examType]
  );

  useEffect(() => {
    if (!examSession || examSession.finished) return;
    const timer = setInterval(() => {
      setExamSession((prev) => (prev ? { ...prev, elapsedSec: prev.elapsedSec + 1 } : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [examSession && !examSession.finished]);

  const subjectStats = useMemo(
    () => window.InfoSecEngine.getSubjectStats(examType),
    [questions, history, examType]
  );

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

  // 회원가입 / 로그인 / 동기화 핸들러
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthForm((prev) => ({ ...prev, loading: true }));
    try {
      const user = await window.InfoSecEngine.registerUser({
        username: authForm.username,
        password: authForm.password,
        nickname: authForm.nickname
      });
      refreshData();
      setShowAuthModal(false);
      showToast(`🎉 환영합니다, ${user.nickname}님! 아이디별로 이력이 자동 저장됩니다.`, "success");
    } catch (err) {
      showToast(err.message, "warn");
    } finally {
      setAuthForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthForm((prev) => ({ ...prev, loading: true }));
    try {
      const res = await window.InfoSecEngine.loginUser({
        username: authForm.username,
        password: authForm.password,
        cloudSyncId: authForm.cloudSyncId
      });
      refreshData();
      setShowAuthModal(false);
      showToast(
        res.syncedFromCloud
          ? `☁️ ${res.user.nickname}님의 클라우드 학습 이력을 불러왔습니다!`
          : `👋 반갑습니다, ${res.user.nickname}님!`,
        "success"
      );
    } catch (err) {
      showToast(err.message, "warn");
    } finally {
      setAuthForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleLogout = () => {
    window.InfoSecEngine.logoutUser();
    refreshData();
    setShowAuthModal(false);
    showToast("로그아웃되었습니다.", "info");
  };

  const handleCloudPush = async () => {
    setAuthForm((prev) => ({ ...prev, loading: true }));
    try {
      const updated = await window.InfoSecEngine.syncToCloud();
      refreshData();
      if (updated && updated.cloudId) {
        showToast(`☁️ 클라우드 동기화 완료!`, "success");
      } else {
        showToast("로컬 저장소에 저장되었습니다.", "info");
      }
    } finally {
      setAuthForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCloudPull = async () => {
    setAuthForm((prev) => ({ ...prev, loading: true }));
    try {
      await window.InfoSecEngine.pullFromCloud();
      refreshData();
      showToast("☁️ 클라우드에서 최신 학습 이력을 불러왔습니다!", "success");
    } catch (err) {
      showToast(err.message, "warn");
    } finally {
      setAuthForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleClearWrongNotes = (subjectId = null) => {
    if (totalStats.wrong === 0) {
      showToast("초기화할 오답 내역이 없습니다.", "warn");
      return;
    }
    window.InfoSecEngine.clearWrongNotes(subjectId, examType);
    refreshData();
    showToast(`🗑️ ${isPractical ? "실기" : "필기"} 오답 목록이 초기화되었습니다!`, "success");
  };

  const handleClearSingleWrong = (qId) => {
    window.InfoSecEngine.clearSingleWrong(qId);
    refreshData();
    showToast("✅ 오답노트에서 해제되었습니다!", "success");
  };

  const handleResetAllHistory = () => {
    window.InfoSecEngine.resetAllHistory();
    refreshData();
    showToast("🔄 전체 풀이 기록이 초기화되었습니다.", "info");
  };

  // 모의고사 시작
  const startRandomExam = (customCfg = null) => {
    const cfg = { ...(customCfg || examConfig), examType };
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
      textInputs: {},
      textGrades: {},
      revealed: {},
      finished: false,
      solveStyle: cfg.solveStyle,
      yearFilter: cfg.yearFilter || "all",
      elapsedSec: 0
    });
    setActiveTab("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const handleGradePracticalText = (qIndex) => {
    if (!examSession) return;
    const currentQ = examSession.list[qIndex];
    const userText = (examSession.textInputs?.[qIndex] || "").trim();
    if (!userText) {
      showToast("답안을 입력하거나 아래 객관식 가이드 보기를 선택해주세요.", "warn");
      return;
    }
    const gradeRes = window.InfoSecEngine.gradePracticalInput(currentQ, userText);
    const mappedAnswer = gradeRes.isCorrect ? currentQ.answer : -1;
    window.InfoSecEngine.recordAttempt(currentQ.id, gradeRes.isCorrect, mappedAnswer);
    refreshData();

    setExamSession((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qIndex]: mappedAnswer },
      textGrades: { ...prev.textGrades, [qIndex]: gradeRes },
      revealed: { ...prev.revealed, [qIndex]: true }
    }));
  };

  const finishExamSession = () => {
    if (!examSession) return;
    if (examSession.solveStyle === "real") {
      examSession.list.forEach((q, idx) => {
        const userAns = examSession.answers[idx];
        const userText = examSession.textInputs?.[idx];
        if (userAns !== undefined) {
          window.InfoSecEngine.recordAttempt(q.id, userAns === q.answer, userAns);
        } else if (userText && userText.trim()) {
          const g = window.InfoSecEngine.gradePracticalInput(q, userText);
          window.InfoSecEngine.recordAttempt(q.id, g.isCorrect, g.isCorrect ? q.answer : -1);
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
      showToast("다음 문항에 기출 변형 문제가 추가되었습니다!", "success");
    } else {
      showToast("기출 변형 문제가 문제 은행에 추가되었습니다!", "success");
    }
  };

  const handleToggleBookmark = (qId) => {
    window.InfoSecEngine.toggleBookmark(qId);
    refreshData();
  };

  const handleGenerateAIQuestions = async () => {
    setAiForm((prev) => ({ ...prev, loading: true }));
    try {
      if (apiKey) {
        localStorage.setItem(window.InfoSecEngine.STORAGE_KEYS.API_KEY, apiKey);
      }
      const res = await window.InfoSecEngine.generateQuestionsWithAI({
        examType,
        subjectId: aiForm.subjectId,
        topicKeyword: aiForm.topicKeyword,
        count: aiForm.count,
        apiKey
      });
      refreshData();
      showToast(
        res.mode === "gemini_ai"
          ? `Gemini AI가 새로운 ${isPractical ? "실기" : "필기"} 변형 ${res.questions.length}문항을 생성했습니다!`
          : `스마트 변형 엔진이 ${isPractical ? "실기" : "필기"} 변형 ${res.questions.length}문항을 생성했습니다!`,
        "success"
      );
    } catch (err) {
      showToast(`생성 중 오류: ${err.message}`, "warn");
    } finally {
      setAiForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleImportText = () => {
    const parsed = window.InfoSecEngine.parseRawQuestionsText(rawImportText, importSubjectId).map(
      (q) => ({ ...q, examType })
    );
    if (parsed.length === 0) {
      showToast("인식된 문제가 없습니다. 예시 양식에 맞춰 입력해주세요.", "warn");
      return;
    }
    window.InfoSecEngine.addCustomQuestions(parsed);
    refreshData();
    setRawImportText("");
    showToast(`총 ${parsed.length}개의 기출문제가 등록되었습니다!`, "success");
  };

  const customSummary = useMemo(
    () => window.InfoSecEngine.generateCustomSummary({ ...summaryConfig, examType }),
    [summaryConfig, questions, history, bookmarks, examType]
  );

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
    { id: "dashboard", icon: "📊", shortLabel: "홈", label: `📊 ${isPractical ? "실기" : "필기"} 대시보드` },
    { id: "exam", icon: isPractical ? "💻" : "🎲", shortLabel: "모의고사", label: `${isPractical ? "💻 실기" : "🎲 필기"} 모의고사` },
    { id: "summary", icon: "📝", shortLabel: "요약집", label: `📝 ${isPractical ? "실기" : "필기"} 핵심요약` },
    { id: "wrongnote", icon: "❌", shortLabel: "오답노트", badge: totalStats.wrong, label: `❌ 오답노트 (${totalStats.wrong})` },
    { id: "manager", icon: "➕", shortLabel: "문제추가", label: "➕ 기출추가·AI" }
  ];

  const accentBtnClass = isPractical
    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25";

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col safe-main-bottom">
      {/* ================= 상단 헤더 (모바일 & 데스크톱 밀림/잘림 제로 설계) ================= */}
      <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 no-print">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* 1열: 좌측 로고 + 우측 액션(D-DAY · 다크/라이트 · 계정) — 한 줄에 여유롭게 배치 */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* 좌측 브랜드 로고 */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2 min-w-0 cursor-pointer"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm sm:text-base shadow-md ${
                    isPractical
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                      : "bg-gradient-to-br from-indigo-500 to-cyan-500"
                  }`}
                >
                  🛡️
                </div>
                <span className="text-[15px] sm:text-lg md:text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                  망키시큐리티
                </span>
              </div>

              {/* 데스크톱용 필기/실기 스위치 */}
              <div className="hidden md:inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 ml-2 shrink-0">
                <button
                  onClick={() => handleSwitchExamType("written")}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1 ${
                    !isPractical
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📘 필기 과정
                </button>
                <button
                  onClick={() => handleSwitchExamType("practical")}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1 ${
                    isPractical
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  💻 실기 과정
                </button>
              </div>
            </div>

            {/* 우측: 2027 D-DAY 알약 배지 + 라이트/다크 아이콘 + 계정 버튼 */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 flex items-center gap-1 transition"
                title="2027년 시험일정표 보기"
              >
                <span className="text-[11px] leading-none">📅</span>
                <span className="hidden sm:inline text-xs font-semibold text-slate-200">
                  {currentDdayInfo.shortRound}
                </span>
                <span className="text-xs font-black text-amber-300 whitespace-nowrap">
                  {currentDdayInfo.ddayText}
                </span>
              </button>

              <button
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className="h-8 w-8 sm:w-auto sm:h-9 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1 transition shrink-0"
                title="라이트 / 다크 모드 전환"
              >
                <span className="text-sm leading-none">{theme === "dark" ? "☀️" : "🌙"}</span>
                <span className="hidden sm:inline">
                  {theme === "dark" ? "라이트" : "다크"}
                </span>
              </button>

              <button
                onClick={() => {
                  setAuthTab(currentUser ? "sync" : "login");
                  setShowAuthModal(true);
                }}
                className={`h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 shrink-0 ${
                  currentUser
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white"
                }`}
              >
                <span className="text-xs leading-none">👤</span>
                <span className="max-w-[64px] sm:max-w-[110px] truncate">
                  {currentUser ? currentUser.nickname : "로그인"}
                </span>
              </button>
            </div>
          </div>

          {/* 모바일 전용 2열: 세련된 iOS 세그먼트 스타일 [필기 / 실기] 풀-위드 전환 바 */}
          <div className="md:hidden grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => handleSwitchExamType("written")}
              className={`py-1.5 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                !isPractical
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <span>📘</span>
              <span>필기 (객관식)</span>
            </button>
            <button
              onClick={() => handleSwitchExamType("practical")}
              className={`py-1.5 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                isPractical
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <span>💻</span>
              <span>실기 (단답·서술)</span>
            </button>
          </div>

          {/* 데스크톱 2열: 메인 네비게이션 탭 */}
          <nav className="hidden md:flex items-center gap-1.5 pt-1.5 border-t border-slate-800/70">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? isPractical
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ================= 모바일 전용 하단 고정 네이티브 탭 바 (Safe Area 완벽 대응) ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 pt-1.5 safe-bottom-nav grid grid-cols-5 gap-1 no-print shadow-2xl">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                isActive
                  ? isPractical
                    ? "bg-emerald-600/20 text-emerald-300 font-extrabold"
                    : "bg-indigo-600/20 text-indigo-300 font-extrabold"
                  : "text-slate-400"
              }`}
            >
              <span className="text-[17px] leading-none mb-1">{tab.icon}</span>
              <span className="text-[10px] leading-none tracking-tight whitespace-nowrap">
                {tab.shortLabel}
              </span>
              {tab.badge > 0 && (
                <span className="absolute top-0.5 right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ================= [모달 1] 2027년 시험 일정표 팝업 (모바일 카드뷰 & PC 테이블 자동 전환!) ================= */}
      {showScheduleModal && (
        <div
          onClick={() => setShowScheduleModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[88vh] rounded-t-3xl sm:rounded-2xl bg-slate-900 border-t sm:border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* 모달 헤더 */}
            <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                    2027년 정기 기사 일정
                  </span>
                  <span className="text-[11px] font-bold text-indigo-400">
                    현재 목표: {currentDdayInfo.label} ({currentDdayInfo.ddayText})
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-extrabold text-white mt-1.5">
                  📅 2027년 정보처리기사 · 정보보안기사 시험일정표
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* 모달 스크롤 본문 */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* 목표 회차 D-DAY 원클릭 선택 */}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-indigo-300 mb-2.5">
                  🎯 목표 시험 회차 선택 (터치하면 상단 D-DAY가 변경됩니다)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(window.EXAM_SCHEDULE_2027?.targets || []).map((t) => {
                    const isSelected = t.id === selectedScheduleId;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const diff = Math.ceil(
                      (new Date(t.date + "T00:00:00").getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const dStr = diff > 0 ? `D-${diff}` : diff === 0 ? "D-DAY" : `D+${Math.abs(diff)}`;

                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelectDdayTarget(t.id)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 ${
                          isSelected
                            ? "bg-indigo-600/25 border-indigo-400 ring-2 ring-indigo-500/40"
                            : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] sm:text-xs font-extrabold text-white truncate">
                            {t.title.replace("2027년 정기 기사 ", "27년 ")}
                          </span>
                          <span
                            className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded shrink-0 ${
                              isSelected
                                ? "bg-amber-500 text-slate-950"
                                : "bg-slate-800 text-amber-300"
                            }`}
                          >
                            {dStr}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-semibold">{t.date}</div>
                        <div className="text-[10px] text-slate-400">접수: {t.applyPeriod}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2027년 전체 시험 일정: 모바일에서는 안 잘리는 회차별 2단 카드 / PC에서는 7열 표 */}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-indigo-300 mb-2.5">
                  📋 2027년 회차별 상세 일정 (정보처리기사 · 정보보안기사)
                </h4>

                {/* 모바일 전용 회차별 카드 뷰 (잘림 0%) */}
                <div className="md:hidden space-y-3">
                  {(window.EXAM_SCHEDULE_2027?.fullTable || []).map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-extrabold text-indigo-300">{row.round}</span>
                        <span className="text-[10px] text-slate-400">{row.certTypes}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="font-extrabold text-amber-300">📘 필기 시험</div>
                          <div className="text-slate-400">접수: {row.writtenApply}</div>
                          <div className="text-slate-100 font-semibold">시험: {row.writtenExam}</div>
                          <div className="text-slate-400">발표: {row.writtenResult}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="font-extrabold text-emerald-300">💻 실기 시험</div>
                          <div className="text-slate-400">접수: {row.practicalApply}</div>
                          <div className="text-slate-100 font-semibold">시험: {row.practicalExam}</div>
                          <div className="text-slate-400">발표: {row.finalResult}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 데스크톱 7열 비교표 */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-indigo-950/60 border-b border-slate-800 text-indigo-200 font-bold">
                        <th className="py-3 px-3 border-r border-slate-800">구분 (회차)</th>
                        <th className="py-3 px-3 border-r border-slate-800">필기 원서접수</th>
                        <th className="py-3 px-3 border-r border-slate-800">필기 시험기간</th>
                        <th className="py-3 px-3 border-r border-slate-800">필기 합격발표</th>
                        <th className="py-3 px-3 border-r border-slate-800">실기 원서접수</th>
                        <th className="py-3 px-3 border-r border-slate-800">실기 시험기간</th>
                        <th className="py-3 px-3">최종 합격발표</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {(window.EXAM_SCHEDULE_2027?.fullTable || []).map((row, idx) => (
                        <tr key={idx} className="bg-slate-950/90 hover:bg-slate-900/90">
                          <td className="py-3 px-3 border-r border-slate-800 font-extrabold text-indigo-300">
                            <div>{row.round}</div>
                            <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                              {row.certTypes}
                            </div>
                          </td>
                          <td className="py-3 px-3 border-r border-slate-800 text-slate-200">
                            {row.writtenApply}
                          </td>
                          <td className="py-3 px-3 border-r border-slate-800 font-bold text-amber-300">
                            {row.writtenExam}
                          </td>
                          <td className="py-3 px-3 border-r border-slate-800 text-slate-300">
                            {row.writtenResult}
                          </td>
                          <td className="py-3 px-3 border-r border-slate-800 text-slate-200">
                            {row.practicalApply}
                          </td>
                          <td className="py-3 px-3 border-r border-slate-800 font-bold text-emerald-300">
                            {row.practicalExam}
                          </td>
                          <td className="py-3 px-3 text-slate-300">{row.finalResult}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= [모달 2] 회원가입 / 로그인 / 클라우드 동기화 팝업 (모바일 바텀시트 대응) ================= */}
      {showAuthModal && (
        <div
          onClick={() => setShowAuthModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[88vh] rounded-t-3xl sm:rounded-2xl bg-slate-900 border-t sm:border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  👤 망키시큐리티 계정 & 이력 연동
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  아이디별로 풀이 이력과 오답노트를 어디서든 이어갑니다.
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/60 text-xs font-bold shrink-0">
              <button
                onClick={() => setAuthTab("login")}
                className={`py-3 border-b-2 transition ${
                  authTab === "login"
                    ? "border-indigo-500 text-indigo-300 bg-slate-900"
                    : "border-transparent text-slate-400"
                }`}
              >
                🔑 로그인
              </button>
              <button
                onClick={() => setAuthTab("register")}
                className={`py-3 border-b-2 transition ${
                  authTab === "register"
                    ? "border-indigo-500 text-indigo-300 bg-slate-900"
                    : "border-transparent text-slate-400"
                }`}
              >
                ✨ 회원가입
              </button>
              <button
                onClick={() => setAuthTab("sync")}
                className={`py-3 border-b-2 transition ${
                  authTab === "sync"
                    ? "border-indigo-500 text-indigo-300 bg-slate-900"
                    : "border-transparent text-slate-400"
                }`}
              >
                ☁️ 기기 연동
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              {authTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      아이디 (ID)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="가입한 아이디 입력"
                      value={authForm.username}
                      onChange={(e) =>
                        setAuthForm((prev) => ({ ...prev, username: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      비밀번호
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="비밀번호 입력"
                      value={authForm.password}
                      onChange={(e) =>
                        setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      클라우드 동기화 코드 (다른 기기에서 첫 접속 시 선택 입력)
                    </label>
                    <input
                      type="text"
                      placeholder="선택사항: 동기화 코드 입력 시 원격 이력 복원"
                      value={authForm.cloudSyncId}
                      onChange={(e) =>
                        setAuthForm((prev) => ({ ...prev, cloudSyncId: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authForm.loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30"
                  >
                    {authForm.loading ? "⏳ 확인 중..." : "🔑 로그인하고 내 이력 불러오기"}
                  </button>
                </form>
              )}

              {authTab === "register" && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      사용할 아이디 (3자 이상)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: mangkey01"
                      value={authForm.username}
                      onChange={(e) =>
                        setAuthForm((prev) => ({ ...prev, username: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      닉네임 (표시 이름)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 보안합격생"
                      value={authForm.nickname}
                      onChange={(e) =>
                        setAuthForm((prev) => ({ ...prev, nickname: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      비밀번호 (4자 이상)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="비밀번호 4자리 이상"
                      value={authForm.password}
                      onChange={(e) =>
                        setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authForm.loading}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30"
                  >
                    {authForm.loading ? "⏳ 계정 생성 중..." : "✨ 회원가입 완료하기"}
                  </button>
                </form>
              )}

              {authTab === "sync" && (
                <div className="space-y-4">
                  {currentUser ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs text-slate-400">로그인 계정</div>
                          <div className="text-sm font-extrabold text-white truncate">
                            {currentUser.nickname}{" "}
                            <span className="text-xs font-normal text-indigo-400">
                              (@{currentUser.username})
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold shrink-0"
                        >
                          로그아웃
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                        <div className="text-slate-400 font-semibold">
                          ☁️ 내 클라우드 동기화 코드:
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-amber-300 font-mono text-[11px] break-all">
                            {currentUser.cloudId || "아래 [클라우드 저장] 버튼을 눌러 발급"}
                          </code>
                          {currentUser.cloudId && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(currentUser.cloudId);
                                showToast("동기화 코드가 복사되었습니다!", "success");
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-[11px] font-bold shrink-0"
                            >
                              복사
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={authForm.loading}
                          onClick={handleCloudPush}
                          className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                        >
                          ☁️ 클라우드 저장
                        </button>
                        <button
                          disabled={authForm.loading}
                          onClick={handleCloudPull}
                          className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          📥 이력 불러오기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2.5">
                      <p className="text-xs text-slate-300">
                        현재 게스트 상태입니다. 회원가입을 하시면 아이디별로 이력이 관리됩니다.
                      </p>
                      <button
                        onClick={() => setAuthTab("register")}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                      >
                        ✨ 10초 회원가입 하기
                      </button>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-300">
                        📦 휴대용 백업 코드
                      </span>
                      <button
                        onClick={() => {
                          const code = window.InfoSecEngine.exportBackupCode();
                          navigator.clipboard.writeText(code);
                          showToast("백업 코드가 클립보드에 복사되었습니다!", "success");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold shrink-0"
                      >
                        📋 코드 복사
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="백업 코드 붙여넣기..."
                        value={authForm.backupCodeInput}
                        onChange={(e) =>
                          setAuthForm((prev) => ({ ...prev, backupCodeInput: e.target.value }))
                        }
                        className="flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                      <button
                        onClick={() => {
                          try {
                            window.InfoSecEngine.importBackupCode(authForm.backupCodeInput);
                            refreshData();
                            setAuthForm((prev) => ({ ...prev, backupCodeInput: "" }));
                            showToast("학습 이력이 복원되었습니다!", "success");
                          } catch (e) {
                            showToast("유효하지 않은 백업 코드입니다.", "warn");
                          }
                        }}
                        className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 shrink-0"
                      >
                        복원
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 알림 토스트 (모바일 하단 네비게이션 바 위쪽에 깔끔하게 정렬) */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-3.5 right-3.5 md:left-auto md:right-6 z-50 md:max-w-md px-4 py-3 rounded-2xl shadow-2xl border bg-slate-900/95 backdrop-blur border-indigo-500/50 text-xs sm:text-sm flex items-center gap-2.5 no-print">
          <span className="shrink-0">{toast.type === "warn" ? "⚠️" : "✅"}</span>
          <span className="font-semibold text-slate-100 break-words leading-snug">{toast.msg}</span>
        </div>
      )}

      {/* ================= 메인 콘텐츠 영역 ================= */}
      <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ================= 1. 대시보드 탭 ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 sm:space-y-6">
            {/* 데스크톱용 필기/실기 대형 선택 배너 (모바일은 상단 헤더 세그먼트 바와 통합되어 깔끔함 유지!) */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSwitchExamType("written")}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  !isPractical
                    ? "bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📘</span>
                    <span className="text-base font-extrabold text-white">
                      필기 과정 (4지선다 객관식)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    100문항 · 과목당 40점 이상, 전 과목 평균 60점 이상 합격
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    !isPractical ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {!isPractical ? "현재 선택됨" : "전환하기"}
                </span>
              </button>

              <button
                onClick={() => handleSwitchExamType("practical")}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  isPractical
                    ? "bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/30"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💻</span>
                    <span className="text-base font-extrabold text-white">
                      실기 과정 (단답·서술·실무작업형)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    단답형(3점)·서술형(6점)·작업형(Snort/로그/설정 6점) · 60점 이상 합격
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isPractical ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isPractical ? "현재 선택됨" : "전환하기"}
                </span>
              </button>
            </div>

            {/* 상단 히어로 & 학습 통계 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* 좌측 메인 히어로 카드 */}
              <div
                className={`lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-gradient-to-br border flex flex-col justify-between shadow-lg ${
                  isPractical
                    ? "from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/40"
                    : "from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-500/40"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                        isPractical
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      }`}
                    >
                      {isPractical
                        ? "💻 실기: 단답·서술·작업형"
                        : "📘 필기: 과락 40점 · 평균 60점 합격"}
                    </span>
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    >
                      📅 {currentDdayInfo.shortRound} {currentDdayInfo.ddayText} · 일정표 →
                    </button>
                  </div>

                  <h2 className="text-[17px] sm:text-xl md:text-2xl font-extrabold text-white leading-snug">
                    {currentUser
                      ? `${currentUser.nickname}님, [${isPractical ? "실기" : "필기"}] 합격을 향해 달려볼까요?`
                      : `망키시큐리티 [${isPractical ? "실기 단답·서술" : "필기 객관식"}] 스마트 학습 시스템`}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isPractical
                      ? "실제 시험과 동일한 콘솔 로그·Snort·시큐어코딩 분석 문제와 서술형 만점 답안 요약집으로 실기를 완벽 대비하세요."
                      : "2022~2026년 연도별 기출과 스마트 변형 100제 모의고사, 한눈에 들어오는 비교표 요약본으로 단기간에 합격하세요."}
                  </p>
                </div>

                {/* 메인 액션 버튼 (모바일에서는 반듯한 풀위드 + 2열 구성으로 균형감 극대화!) */}
                <div className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  <button
                    onClick={() =>
                      startRandomExam({
                        ...examConfig,
                        subjectIds: [1, 2, 3, 4, 5],
                        yearFilter: "all",
                        count: 100,
                        mode: "all",
                        solveStyle: "study"
                      })
                    }
                    className={`col-span-2 sm:col-span-1 px-4 py-3 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg transition text-center ${accentBtnClass}`}
                  >
                    🎲 전 과목 랜덤 100제 바로 풀기
                  </button>
                  <button
                    onClick={() => setActiveTab("exam")}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition text-center"
                  >
                    📅 연도별 기출
                  </button>
                  <button
                    onClick={() => setActiveTab("summary")}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition text-center"
                  >
                    📝 핵심 요약본
                  </button>
                </div>
              </div>

              {/* 우측 누적 학습 현황 카드 */}
              <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-300">
                    📈 나의 [{isPractical ? "실기" : "필기"}] 학습 리포트
                  </h3>
                  {totalStats.attempts > 0 && (
                    <button
                      onClick={handleResetAllHistory}
                      className="text-[11px] text-slate-400 hover:text-rose-400 underline shrink-0"
                    >
                      기록 초기화
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 my-3.5">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">평균 정답률</div>
                    <div className="text-xl sm:text-2xl font-black text-indigo-400 mt-0.5">
                      {totalStats.attempts > 0 ? `${totalStats.accuracy}%` : "-"}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {totalStats.accuracy >= 60 ? "합격 안정권" : "목표 60%+"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">누적 풀이</div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                      {totalStats.attempts}회
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      완료 {totalStats.solved}문항
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveTab("wrongnote")}
                    className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 hover:border-rose-500 cursor-pointer transition"
                  >
                    <div className="text-[11px] text-rose-300 flex items-center justify-between">
                      <span>오답노트</span>
                      <span>보기 →</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5">
                      {totalStats.wrong}개
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveTab("wrongnote")}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition"
                  >
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>북마크</span>
                      <span>보기 →</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
                      {bookmarks.length}개
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab("wrongnote")}
                    className="py-2.5 px-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition"
                  >
                    ❌ 오답 복습 ({totalStats.wrong})
                  </button>
                  <button
                    onClick={() => handleClearWrongNotes()}
                    className="py-2.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition"
                  >
                    🗑️ 오답 초기화
                  </button>
                </div>
              </div>
            </div>

            {/* 5과목별 집중 공략 카드 */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  📚 5대 과목별 [{isPractical ? "실기" : "필기"}] 집중 공략
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {subjectStats.map((subj) => (
                  <div
                    key={subj.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${subj.bgLight} ${subj.textColor} border ${subj.borderColor}`}
                        >
                          {subj.id}과목 · {subj.shortName}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          {subj.accuracy !== null ? `${subj.accuracy}%` : "미풀이"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {subj.description}
                      </p>
                    </div>

                    <div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-3">
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

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            startRandomExam({
                              ...examConfig,
                              subjectIds: [subj.id],
                              count: isPractical ? 10 : 20,
                              mode: "all",
                              solveStyle: "study"
                            })
                          }
                          className={`py-2 px-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition ${
                            isPractical ? "hover:bg-emerald-600" : "hover:bg-indigo-600"
                          }`}
                        >
                          {isPractical ? "💻 실기 풀기" : "🎲 문제 풀기"}
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
                          className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
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

        {/* ================= 2. 연도별·랜덤 기출 & 모의고사 탭 (모바일 버튼 그리드 반듯하게 정렬) ================= */}
        {activeTab === "exam" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isPractical
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      }`}
                    >
                      {isPractical ? "💻 실기 모드" : "📘 필기 모드"}
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-white">
                      연도별 · 과목별 모의고사 설정
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => startRandomExam()}
                  className={`w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg transition shrink-0 ${accentBtnClass}`}
                >
                  🔄 선택한 조건으로 시험지 생성
                </button>
              </div>

              {/* 1단계: 기출 연도 선택 (모바일 3열 균등 그리드 / PC 플렉스, 문항 수 미표시!) */}
              <div className="pt-3 border-t border-slate-800">
                <label className="block text-xs font-bold text-indigo-300 mb-2">
                  📅 기출 출제 연도 선택
                </label>
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5">
                  <button
                    onClick={() => setExamConfig((prev) => ({ ...prev, yearFilter: "all" }))}
                    className={`py-2 px-2.5 sm:px-3.5 rounded-xl text-xs font-bold border transition text-center ${
                      examConfig.yearFilter === "all"
                        ? isPractical
                          ? "bg-emerald-600 text-white border-emerald-400 shadow-sm"
                          : "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    전체 연도
                  </button>
                  {availableYears.map((yr) => {
                    const active = examConfig.yearFilter === yr;
                    return (
                      <button
                        key={yr}
                        onClick={() => setExamConfig((prev) => ({ ...prev, yearFilter: yr }))}
                        className={`py-2 px-2.5 sm:px-3.5 rounded-xl text-xs font-bold border transition text-center ${
                          active
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                            : "bg-slate-950 text-slate-300 border-slate-800"
                        }`}
                      >
                        {yr}년 기출
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2단계: 과목, 문항 수, 풀이 방식 (모바일에서도 반듯한 2열/3열 그리드) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-3 border-t border-slate-800">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    출제 과목 선택 (다중 선택 가능)
                  </label>
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5">
                    <button
                      onClick={() =>
                        setExamConfig((prev) => ({
                          ...prev,
                          subjectIds: prev.subjectIds.length === 5 ? [1] : [1, 2, 3, 4, 5]
                        }))
                      }
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition text-center ${
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
                          className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold border transition text-center truncate ${
                            selected
                              ? isPractical
                                ? "bg-emerald-600 text-white border-emerald-500"
                                : "bg-indigo-600 text-white border-indigo-500"
                              : "bg-slate-950 text-slate-400 border-slate-800"
                          }`}
                        >
                          {s.id}과목 {s.shortName.replace("보안", "")}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-200 w-full outline-none"
                    >
                      <option value={5}>5문항 (미니)</option>
                      <option value={10}>10문항 (빠른)</option>
                      <option value={18}>18문항 (실기실전)</option>
                      <option value={20}>20문항 (1과목)</option>
                      <option value={30}>30문항 (종합)</option>
                      <option value={50}>50문항 (하프)</option>
                      <option value={100}>100문항 (전체)</option>
                    </select>
                    <select
                      value={examConfig.mode}
                      onChange={(e) =>
                        setExamConfig((prev) => ({ ...prev, mode: e.target.value }))
                      }
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-200 w-full outline-none"
                    >
                      <option value="all">전체 랜덤</option>
                      <option value="unsolved_first">미풀이 우선</option>
                      <option value="wrong_only">틀린 오답만</option>
                      <option value="bookmarked">북마크만</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    풀이 방식 & 옵션
                  </label>
                  <div className="grid grid-cols-2 sm:block sm:space-y-2 gap-2 text-xs">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="solveStyle"
                          checked={examConfig.solveStyle === "study"}
                          onChange={() =>
                            setExamConfig((prev) => ({ ...prev, solveStyle: "study" }))
                          }
                        />
                        <span>학습모드</span>
                      </label>
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="solveStyle"
                          checked={examConfig.solveStyle === "real"}
                          onChange={() =>
                            setExamConfig((prev) => ({ ...prev, solveStyle: "real" }))
                          }
                        />
                        <span>실전모드</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <label className="inline-flex items-center gap-1 cursor-pointer text-slate-300">
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
                        <span>선지셔플</span>
                      </label>
                      <label className="inline-flex items-center gap-1 cursor-pointer text-amber-300">
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
                        <span>⚡변형혼합</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!examSession && (
              <div className="p-6 sm:p-10 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-4">
                <div className="text-3xl sm:text-4xl">{isPractical ? "💻" : "🎲"}</div>
                <div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-white mb-1">
                    {isPractical
                      ? "실기(단답 · 서술 · 작업형) 모의고사를 시작해보세요!"
                      : "필기 연도별 기출 또는 랜덤 모의고사를 시작해보세요!"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    선택 연도:{" "}
                    <strong className="text-amber-300">
                      {examConfig.yearFilter === "all" ? "전체 연도" : `${examConfig.yearFilter}년 기출`}
                    </strong>{" "}
                    · <strong className="text-indigo-300">{examConfig.count}문항</strong>
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                  <button
                    onClick={() => startRandomExam()}
                    className={`col-span-2 sm:col-span-1 px-5 py-3 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg ${accentBtnClass}`}
                  >
                    🚀 현재 설정으로 바로 시작
                  </button>
                  {availableYears.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        const nextCfg = { ...examConfig, yearFilter: yr };
                        setExamConfig(nextCfg);
                        startRandomExam(nextCfg);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                    >
                      📅 {yr}년 기출
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 시험 진행 중 또는 결과 화면 */}
            {examSession && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-3 space-y-4 min-w-0">
                  {examSession.finished && (
                    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40">
                      {(() => {
                        const total = examSession.list.length;
                        let correctCnt = 0;
                        examSession.list.forEach((q, idx) => {
                          if (examSession.answers[idx] === q.answer) correctCnt++;
                        });
                        const wrongCnt = total - correctCnt;
                        const score = Math.round((correctCnt / total) * 100);
                        return (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                {isPractical ? "실기" : "필기"} 채점 결과 ({examSession.yearFilter === "all" ? "전체 연도" : `${examSession.yearFilter}년 기출`})
                              </span>
                              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                                {score}점{" "}
                                <span className="text-xs sm:text-base font-normal text-slate-300">
                                  ({correctCnt}/{total}정답 · 오답 {wrongCnt}개 · {formatTime(examSession.elapsedSec)})
                                </span>
                              </h3>
                            </div>
                            <div className="grid grid-cols-3 sm:flex gap-2">
                              <button
                                onClick={() => setActiveTab("wrongnote")}
                                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold text-center"
                              >
                                ❌ 오답노트
                              </button>
                              <button
                                onClick={() => setActiveTab("summary")}
                                className="py-2.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold text-center"
                              >
                                📝 요약본
                              </button>
                              <button
                                onClick={() => startRandomExam()}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center ${accentBtnClass}`}
                              >
                                🔄 재시작
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 현재 문제 카드 (모바일 상단 메타 2단 깔끔 정렬 + 하단 3분할 터치 버튼) */}
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
                    const isPracQuestion = currentQ.examType === "practical" || isPractical;

                    return (
                      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        {/* 깔끔한 2열 상단 메타 헤더 (절대 안 밀림!) */}
                        <div className="pb-3 border-b border-slate-800 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-white font-extrabold text-xs shrink-0 ${
                                  isPracQuestion ? "bg-emerald-600" : "bg-indigo-600"
                                }`}
                              >
                                Q.{qIdx + 1} / {examSession.list.length}
                              </span>
                              {subj && (
                                <span
                                  className={`px-2 py-1 rounded-lg text-xs font-bold truncate ${subj.bgLight} ${subj.textColor} border ${subj.borderColor}`}
                                >
                                  {subj.shortName}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleInstantVariation(currentQ)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] sm:text-xs font-bold"
                              >
                                ⚡ 변형
                              </button>
                              <button
                                onClick={() => handleToggleBookmark(currentQ.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold border ${
                                  isBookmarked
                                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                                    : "bg-slate-800 border-slate-700 text-slate-400"
                                }`}
                              >
                                {isBookmarked ? "⭐ 저장됨" : "☆ 북마크"}
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold">
                              📅 {currentQ.year}
                            </span>
                            {isPracQuestion && currentQ.pCategory && (
                              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold">
                                💻 {currentQ.pCategory} ({currentQ.pCategory === "단답형" ? "3점" : "6점"})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 문제 지문 */}
                        <h3 className="text-[14px] sm:text-base md:text-lg font-bold text-white leading-relaxed break-words">
                          {currentQ.question}
                        </h3>

                        {/* 실기 전용 코드/로그 터미널 박스 */}
                        {currentQ.codeSnippet && (
                          <div className="w-full max-w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
                            <div className="px-3 py-1.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 font-mono">
                              <span>💻 제시 로그 / 설정 코드</span>
                              <span className="text-emerald-400">Console</span>
                            </div>
                            <pre className="p-3 sm:p-3.5 text-[11px] sm:text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all sm:break-normal leading-relaxed">
                              {currentQ.codeSnippet}
                            </pre>
                          </div>
                        )}

                        {/* 실기 전용 주관식 직접 답안 입력창 */}
                        {isPracQuestion && (
                          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
                            <label className="block text-xs font-extrabold text-emerald-300">
                              ✍️ 실전 주관식 답안 입력 (또는 아래 보기 선택)
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="정답 키워드 입력..."
                                value={examSession.textInputs?.[qIdx] || ""}
                                onChange={(e) =>
                                  setExamSession((prev) => ({
                                    ...prev,
                                    textInputs: { ...prev.textInputs, [qIdx]: e.target.value }
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleGradePracticalText(qIdx);
                                }}
                                className="w-full flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 outline-none"
                              />
                              <button
                                onClick={() => handleGradePracticalText(qIdx)}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shrink-0"
                              >
                                ✅ 주관식 채점
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 4지선다 보기 */}
                        <div className="space-y-2">
                          {isPracQuestion && (
                            <div className="text-[11px] font-semibold text-slate-400">
                              👇 빠른 확인용 4지선다 가이드 보기
                            </div>
                          )}
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
                                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition flex items-start gap-2.5 ${btnStyle}`}
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
                                <span className="text-xs sm:text-sm leading-relaxed flex-1 min-w-0 break-words">
                                  {opt}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* 정답 및 해설 박스 */}
                        {showAnswer && (
                          <div className="p-3.5 sm:p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-xs font-extrabold ${
                                    userSelected === currentQ.answer
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : "bg-rose-500/20 text-rose-300"
                                  }`}
                                >
                                  {userSelected === currentQ.answer ? "⭕ 정답!" : "❌ 오답"}
                                </span>
                                <span className="text-xs font-bold text-indigo-300">
                                  정답: {currentQ.answer + 1}번
                                </span>
                              </div>
                              {userSelected !== undefined && userSelected !== currentQ.answer && (
                                <button
                                  onClick={() => setActiveTab("wrongnote")}
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold"
                                >
                                  ❌ 오답노트 이동 →
                                </button>
                              )}
                            </div>

                            {currentQ.modelAnswer && (
                              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
                                <div className="text-xs font-extrabold text-emerald-300">
                                  🎯 [실기 모범 답안]
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-white whitespace-pre-line break-words leading-relaxed">
                                  {currentQ.modelAnswer}
                                </div>
                              </div>
                            )}

                            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line break-words">
                              <strong className="text-indigo-400">[해설]</strong>{" "}
                              {currentQ.explanation}
                            </div>

                            {currentQ.keyPoint && (
                              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 break-words leading-relaxed">
                                <strong className="text-amber-400">💡 핵심 암기 요점: </strong>
                                {currentQ.keyPoint}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 하단 이전 / 정답보기 / 다음 네비게이션 버튼 (모바일 3열 균등 높이 h-11 정렬!) */}
                        <div className="pt-3 border-t border-slate-800 grid grid-cols-3 sm:flex sm:items-center sm:justify-between gap-2">
                          <button
                            disabled={qIdx === 0}
                            onClick={() =>
                              setExamSession((prev) => ({
                                ...prev,
                                currentIndex: Math.max(0, prev.currentIndex - 1)
                              }))
                            }
                            className="h-11 sm:h-10 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold flex items-center justify-center"
                          >
                            ← 이전
                          </button>

                          {examSession.solveStyle === "study" && !examSession.revealed[qIdx] ? (
                            <button
                              onClick={() =>
                                setExamSession((prev) => ({
                                  ...prev,
                                  revealed: { ...prev.revealed, [qIdx]: true }
                                }))
                              }
                              className="h-11 sm:h-10 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold flex items-center justify-center"
                            >
                              👀 정답보기
                            </button>
                          ) : (
                            <div className="sm:hidden" />
                          )}

                          {qIdx < examSession.list.length - 1 ? (
                            <button
                              onClick={() =>
                                setExamSession((prev) => ({
                                  ...prev,
                                  currentIndex: prev.currentIndex + 1
                                }))
                              }
                              className={`h-11 sm:h-10 sm:px-5 rounded-xl text-xs font-extrabold flex items-center justify-center ${accentBtnClass}`}
                            >
                              다음 →
                            </button>
                          ) : !examSession.finished ? (
                            <button
                              onClick={finishExamSession}
                              className="h-11 sm:h-10 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center shadow-lg"
                            >
                              ✅ 채점하기
                            </button>
                          ) : (
                            <div />
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 우측(모바일 하단): OMR 답안지 & 타이머 */}
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
                        {Object.keys(examSession.answers).length} / {examSession.list.length} 완료
                      </span>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-5 gap-1.5 max-h-60 overflow-y-auto pr-1">
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
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition"
                    >
                      ✅ 시험 종료 및 전체 채점
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. 핵심 요약본 생성기 탭 (모바일 정렬 및 카드 디자인 고도화) ================= */}
        {activeTab === "summary" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 no-print shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isPractical
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      }`}
                    >
                      {isPractical ? "💻 실기 요약집" : "📘 필기 요약집"}
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-white">
                      망키시큐리티 비주얼 핵심 요약본
                    </h2>
                  </div>
                </div>

                {/* 모바일에서도 균등한 3분할 액션 바 */}
                <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      setSummaryConfig((prev) => ({ ...prev, blindMode: !prev.blindMode }));
                      setRevealedKeywords({});
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition text-center ${
                      summaryConfig.blindMode
                        ? "bg-amber-500 text-slate-950 border-amber-400"
                        : "bg-slate-800 text-amber-300 border-slate-700"
                    }`}
                  >
                    {summaryConfig.blindMode ? "🙈 가림ON" : "🧠 암기모드"}
                  </button>
                  <button
                    onClick={() =>
                      setSummaryConfig((prev) => ({
                        ...prev,
                        mobileTableAsCards: !prev.mobileTableAsCards
                      }))
                    }
                    className="md:hidden py-2 px-2.5 rounded-xl bg-slate-800 text-indigo-300 border border-slate-700 text-xs font-bold text-center"
                  >
                    {summaryConfig.mobileTableAsCards ? "📊 표로 보기" : "📱 카드뷰"}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(customSummary.markdown);
                      showToast("요약본 마크다운이 복사되었습니다!", "success");
                    }}
                    className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 text-center"
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
                      a.download = `망키시큐리티_${isPractical ? "실기" : "필기"}요약본_${new Date().toISOString().slice(0, 10)}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast("마크다운(.md) 파일이 저장되었습니다!", "success");
                    }}
                    className="hidden sm:inline-block py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    💾 .MD 저장
                  </button>
                </div>
              </div>

              {/* 요약 뷰 모드 전환 */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "visual", label: "📊 과목별 요약" },
                    { id: "cheatsheet", label: "⚡ 직전 족보" },
                    {
                      id: "mynotes",
                      label: `🚨 오답(${customSummary.wrongQuestions.length})`
                    }
                  ].map((vm) => (
                    <button
                      key={vm.id}
                      onClick={() => setSummaryConfig((prev) => ({ ...prev, viewMode: vm.id }))}
                      className={`py-2.5 px-2 sm:px-3.5 rounded-xl text-xs font-extrabold border transition text-center truncate ${
                        summaryConfig.viewMode === vm.id
                          ? isPractical
                            ? "bg-emerald-600 text-white border-emerald-400 shadow-sm"
                            : "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                          : "bg-slate-950 text-slate-300 border-slate-800"
                      }`}
                    >
                      {vm.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <input
                    type="text"
                    placeholder="🔍 표/개념 검색 (예: 72시간, utmp, Snort)..."
                    value={summaryConfig.searchKeyword}
                    onChange={(e) =>
                      setSummaryConfig((prev) => ({ ...prev, searchKeyword: e.target.value }))
                    }
                    className="bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 w-full lg:w-64 outline-none"
                  />
                </div>
              </div>

              {/* 과목 선택 3열 그리드 */}
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
                          className={`py-2 px-2 sm:px-3.5 rounded-xl text-xs font-bold border transition text-center truncate ${
                            isSingleSelected
                              ? isPractical
                                ? "bg-emerald-600 text-white border-emerald-400 shadow-sm"
                                : "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                              : isIncluded && summaryConfig.subjectIds.length > 1
                              ? "bg-indigo-950/60 text-indigo-200 border-indigo-500/40"
                              : "bg-slate-950 text-slate-400 border-slate-800"
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
                      className={`py-2 px-2 sm:px-3.5 rounded-xl text-xs font-bold border transition text-center sm:ml-auto ${
                        summaryConfig.subjectIds.length === 5
                          ? "bg-amber-500 text-slate-950 border-amber-400"
                          : "bg-slate-950 text-slate-300 border-slate-800"
                      }`}
                    >
                      📚 전 과목
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* [VIEW 1] 시험 직전 필수 숫자·명령어·공식 초압축 족보 */}
            {summaryConfig.viewMode === "cheatsheet" && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">
                    ⚡ 시험장 10분 전 필수 체크
                  </span>
                  <h3 className="text-sm sm:text-lg font-extrabold text-white mt-0.5">
                    가장 많이 헷갈리는 숫자 · 포트 · 법규 기한 · 암호학 공식 족보
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {(window.QUICK_CHEATSHEET || []).map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg"
                    >
                      <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
                        <h4 className="font-bold text-xs sm:text-base text-white truncate">
                          {group.category}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold shrink-0">
                          필수
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
                                className="p-3.5 sm:p-4 flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-2 sm:items-center"
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
                                  className={`sm:col-span-7 text-xs sm:text-sm leading-relaxed rounded-xl px-3 py-2 border break-words ${
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

            {/* [VIEW 2] 내 오답 & 북마크 전용 요약 뷰 */}
            {summaryConfig.viewMode === "mynotes" && (
              <div className="space-y-4">
                <div className="p-4 sm:p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-rose-300">
                      🚨 내가 틀린 문제 핵심 요점 ({customSummary.wrongQuestions.length}건)
                    </h3>
                    {customSummary.wrongQuestions.length > 0 && (
                      <div className="flex gap-1.5">
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
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                        >
                          🎲 재시험
                        </button>
                        <button
                          onClick={() => handleClearWrongNotes()}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
                        >
                          🗑️ 초기화
                        </button>
                      </div>
                    )}
                  </div>
                  {customSummary.wrongQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      아직 틀린 오답 문제가 없습니다.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {customSummary.wrongQuestions.map((wq, idx) => (
                        <div
                          key={wq.id}
                          className="p-3.5 rounded-xl bg-slate-900/95 border border-rose-500/30 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 truncate">
                              {wq.tags ? wq.tags.join(" · ") : wq.id}
                            </span>
                            <button
                              onClick={() => handleClearSingleWrong(wq.id)}
                              className="text-[11px] text-emerald-400 font-bold shrink-0"
                            >
                              ✅ 해제
                            </button>
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

                <div className="p-4 sm:p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-amber-300">
                    ⭐ 북마크 중요 기출 포인트 ({customSummary.bookmarkedQuestions.length}건)
                  </h3>
                  {customSummary.bookmarkedQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      북마크한 문제가 없습니다.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {customSummary.bookmarkedQuestions.map((bq, idx) => (
                        <div
                          key={bq.id}
                          className="p-3.5 rounded-xl bg-slate-900/95 border border-amber-500/30 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 truncate">
                              {bq.tags ? bq.tags.join(" · ") : bq.id}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0">{bq.year}</span>
                          </div>
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

            {/* [VIEW 3] 과목별 비주얼 비교표 & 기출함정 상세 요약집 */}
            {summaryConfig.viewMode === "visual" && (
              <div className="space-y-5">
                {customSummary.subjectBlocks.map((block) => {
                  if (!block.subject || !block.baseSummary) return null;
                  return (
                    <div
                      key={block.subject.id}
                      className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl"
                    >
                      <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold ${block.subject.bgLight} ${block.subject.textColor} border ${block.subject.borderColor}`}
                            >
                              {block.subject.shortName}
                            </span>
                            <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white">
                              {block.baseSummary.title}
                            </h3>
                          </div>
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
                            className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-extrabold no-print ${accentBtnClass}`}
                          >
                            🎲 이 과목 문제 바로 풀기
                          </button>
                        </div>

                        {block.baseSummary.overview && (
                          <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed">
                            📌 <strong className="text-indigo-300">출제 경향:</strong>{" "}
                            {block.baseSummary.overview}
                          </p>
                        )}
                      </div>

                      <div className="p-3.5 sm:p-6 space-y-5 sm:space-y-7">
                        {block.baseSummary.sections.map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            id={sec.id || `sec_${block.subject.id}_${sIdx}`}
                            className="rounded-2xl bg-slate-950/70 border border-slate-800/90 overflow-hidden"
                          >
                            <div className="px-4 py-3 sm:py-4 bg-slate-900/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                              <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-white flex items-center gap-2">
                                <span
                                  className={`w-1.5 h-4 rounded-full inline-block shrink-0 ${
                                    isPractical ? "bg-emerald-500" : "bg-indigo-500"
                                  }`}
                                />
                                <span>{sec.topic}</span>
                              </h4>
                              {sec.importance && (
                                <span className="text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  {sec.importance}
                                </span>
                              )}
                            </div>

                            <div className="p-3.5 sm:p-5 space-y-3.5">
                              {sec.summary && (
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                  {sec.summary}
                                </p>
                              )}

                              {/* 모바일 전용 카드형 비교 뷰 */}
                              {sec.table && summaryConfig.mobileTableAsCards && (
                                <div className="md:hidden space-y-2.5">
                                  {sec.table.rows.map((row, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-2"
                                    >
                                      <div className="pb-2 border-b border-slate-800 flex items-start justify-between gap-2">
                                        <span className="font-extrabold text-[13px] text-indigo-300 whitespace-pre-line">
                                          {row[0]}
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                                          {sec.table.headers[0]}
                                        </span>
                                      </div>

                                      <div className="space-y-1.5 text-xs">
                                        {row.slice(1).map((cell, cIdx) => {
                                          const realColIdx = cIdx + 1;
                                          const cellKey = `tbl_${block.subject.id}_${sIdx}_${rIdx}_${realColIdx}`;
                                          const isBlindTarget =
                                            summaryConfig.blindMode && !revealedKeywords[cellKey];
                                          return (
                                            <div
                                              key={realColIdx}
                                              className="flex flex-col gap-0.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/70"
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

                              {/* 데스크톱 비교 테이블 */}
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

                              {sec.bullets && sec.bullets.length > 0 && (
                                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
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

                              {sec.trap && (
                                <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-950 border border-rose-500/40 text-xs sm:text-sm text-rose-100 leading-relaxed flex items-start gap-2.5 break-words">
                                  <span className="text-base shrink-0">🚨</span>
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

                        {block.keyPoints.length > 0 && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                            <h4 className="text-sm sm:text-base font-extrabold text-amber-300">
                              💡 기출 직결 한 줄 암기 카드 ({block.keyPoints.length}개)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
                                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {kp.isWrong && (
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500 text-white font-bold">
                                          🚨 오답
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
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  ❌ [{isPractical ? "실기" : "필기"}] 오답노트 ({totalStats.wrong}개) & ⭐ 북마크
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  복습이 끝난 오답은 개별 해제하거나 [오답 전체 초기화]로 비울 수 있습니다.
                </p>
              </div>
              <div className="grid grid-cols-3 sm:flex gap-2">
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
                  className="py-2.5 px-2.5 sm:px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold text-center"
                >
                  🚨 오답 재시험
                </button>
                <button
                  onClick={() => handleClearWrongNotes()}
                  className="py-2.5 px-2.5 sm:px-3.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold text-center"
                >
                  🗑️ 오답 초기화
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
                  className="py-2.5 px-2.5 sm:px-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold text-center"
                >
                  ⭐ 북마크 풀기
                </button>
              </div>
            </div>

            {(() => {
              const targetList = questions.filter(
                (q) => (history[q.id] && history[q.id].lastWrong) || bookmarks.includes(q.id)
              );
              if (targetList.length === 0) {
                return (
                  <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-3">
                    <div className="text-3xl">✨</div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      등록된 [{isPractical ? "실기" : "필기"}] 오답이나 북마크가 없습니다
                    </h3>
                    <button
                      onClick={() => setActiveTab("exam")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold ${accentBtnClass}`}
                    >
                      🎲 모의고사 풀러 가기
                    </button>
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
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {isWrong && (
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                                🚨 오답
                              </span>
                            )}
                            {isBm && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                                ⭐ 북마크
                              </span>
                            )}
                            {subj && (
                              <span className={`text-xs font-bold ${subj.textColor}`}>
                                {subj.shortName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {isWrong && (
                              <button
                                onClick={() => handleClearSingleWrong(q.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                              >
                                ✅ 해제
                              </button>
                            )}
                            <button
                              onClick={() => handleInstantVariation(q)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 text-xs font-bold"
                            >
                              ⚡ 변형
                            </button>
                            <button
                              onClick={() => handleToggleBookmark(q.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                            >
                              {isBm ? "별표해제" : "별표"}
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-white break-words leading-relaxed">
                          {q.question}
                        </h4>

                        {q.codeSnippet && (
                          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all sm:break-normal">
                            {q.codeSnippet}
                          </pre>
                        )}

                        {q.modelAnswer && (
                          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs sm:text-sm font-bold text-emerald-200 whitespace-pre-line break-words">
                            🎯 [실기 모범 답안] {q.modelAnswer}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border break-words ${
                                idx === q.answer
                                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold"
                                  : "bg-slate-950/60 border-slate-800 text-slate-400"
                              }`}
                            >
                              {idx + 1}. {opt}
                            </div>
                          ))}
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 break-words leading-relaxed">
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
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                  AI & 스마트 변형 ({isPractical ? "실기 과정" : "필기 과정"})
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-white mt-2">
                  🤖 [{isPractical ? "실기" : "필기"}] 변형 문제 자동 생성
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    대상 과목 선택
                  </label>
                  <select
                    value={aiForm.subjectId}
                    onChange={(e) =>
                      setAiForm((prev) => ({ ...prev, subjectId: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 outline-none"
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
                    placeholder="예: 리눅스 PAM, Snort 룰, SQL Injection..."
                    value={aiForm.topicKeyword}
                    onChange={(e) =>
                      setAiForm((prev) => ({ ...prev, topicKeyword: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      생성 문항 수
                    </label>
                    <select
                      value={aiForm.count}
                      onChange={(e) =>
                        setAiForm((prev) => ({ ...prev, count: Number(e.target.value) }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 outline-none"
                    >
                      <option value={2}>2문항</option>
                      <option value={3}>3문항</option>
                      <option value={5}>5문항</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Gemini API Key
                    </label>
                    <input
                      type="password"
                      placeholder="선택 (미입력시 내장엔진)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <button
                  disabled={aiForm.loading}
                  onClick={handleGenerateAIQuestions}
                  className={`w-full py-3 rounded-xl disabled:opacity-50 font-extrabold text-xs sm:text-sm shadow-lg transition ${accentBtnClass}`}
                >
                  {aiForm.loading
                    ? "⏳ 생성 중..."
                    : `⚡ [${isPractical ? "실기" : "필기"}] 변형 문제 자동 생성`}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                  기출 지문 자동 파서
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-white mt-2">
                  📥 내 [{isPractical ? "실기" : "필기"}] 기출 텍스트 등록
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    저장할 과목 분류
                  </label>
                  <select
                    value={importSubjectId}
                    onChange={(e) => setImportSubjectId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 outline-none"
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
                      className="text-xs text-indigo-400 font-bold hover:underline"
                    >
                      예시 채우기
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={rawImportText}
                    onChange={(e) => setRawImportText(e.target.value)}
                    placeholder={`예시:\n1. 문제 지문?\n① 보기 1\n② 보기 2\n③ 보기 3\n④ 보기 4\n정답: 2\n해설: 해설 내용...`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed outline-none"
                  />
                </div>

                <button
                  onClick={handleImportText}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg transition"
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
        🛡️ 망키시큐리티 · 필기 & 실기 기출 생성 및 비주얼 요약 시스템
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
