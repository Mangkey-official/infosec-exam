// 망키시큐리티 (Mangkey Security) - 랜덤 문제 생성, 연도별 필터, 회원가입/클라우드 이력 연동, 오답 초기화 및 요약 엔진

window.InfoSecEngine = {
  STORAGE_KEYS: {
    CUSTOM_QUESTIONS: "infosec_custom_questions_v1",
    HISTORY: "infosec_solve_history_v1",
    BOOKMARKS: "infosec_bookmarks_v1",
    CUSTOM_SUMMARIES: "infosec_custom_summaries_v1",
    API_KEY: "infosec_gemini_api_key_v1",
    THEME: "mangkey_theme_v1",
    DDAY_TARGET: "mangkey_dday_target_v1",
    CURRENT_USER: "mangkey_current_user_v1",
    USERS_DB: "mangkey_users_db_v1"
  },

  // ================= 1. 회원가입 및 아이디별 이력 / 클라우드 동기화 =================
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  getUsersDB() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS_DB) || "{}");
    } catch (e) {
      return {};
    }
  },

  saveUsersDB(db) {
    localStorage.setItem(this.STORAGE_KEYS.USERS_DB, JSON.stringify(db));
  },

  // 현재 로그인한 사용자의 스토리지 키 prefix 반환
  getUserKey(baseKey) {
    const user = this.getCurrentUser();
    if (!user || !user.username) return baseKey;
    return `${baseKey}_user_${user.username.toLowerCase()}`;
  },

  // 회원가입 (로컬 DB 등록 + 클라우드 동기화 ID 자동 생성)
  async registerUser({ username, password, nickname }) {
    const cleanId = (username || "").trim().toLowerCase();
    if (!cleanId || cleanId.length < 3) {
      throw new Error("아이디는 3글자 이상 입력해주세요.");
    }
    if (!password || password.length < 4) {
      throw new Error("비밀번호는 4자리 이상 입력해주세요.");
    }

    const db = this.getUsersDB();
    if (db[cleanId]) {
      throw new Error("이미 존재하는 아이디입니다. 로그인 탭을 이용해주세요.");
    }

    // 현재 비로그인 상태에서 풀었던 이력이 있다면 가입 계정의 초기 이력으로 승계
    const guestHistory = this.getHistory();
    const guestBookmarks = this.getBookmarks();
    const guestCustomQ = this.getCustomQuestions();

    let cloudId = null;
    try {
      const payload = {
        name: `mangkey_user_${cleanId}`,
        data: {
          username: cleanId,
          nickname: nickname || cleanId,
          pwHash: btoa(encodeURIComponent(password)),
          history: guestHistory,
          bookmarks: guestBookmarks,
          customQuestions: guestCustomQ,
          updatedAt: new Date().toISOString()
        }
      };
      const resp = await fetch("https://api.restful-api.dev/objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const created = await resp.json();
        cloudId = created.id || null;
      }
    } catch (e) {
      // 오프라인이거나 네트워크 제한 시에도 로컬 가입 및 동기화 코드 방식으로 정상 동작
    }

    const userRecord = {
      username: cleanId,
      nickname: (nickname || cleanId).trim(),
      pwHash: btoa(encodeURIComponent(password)),
      cloudId,
      createdAt: new Date().toISOString(),
      lastSyncAt: cloudId ? new Date().toISOString() : null
    };

    db[cleanId] = userRecord;
    this.saveUsersDB(db);
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(userRecord));

    // 사용자 전용 스토리지에 초기 데이터 저장
    localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.HISTORY), JSON.stringify(guestHistory));
    localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.BOOKMARKS), JSON.stringify(guestBookmarks));
    localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.CUSTOM_QUESTIONS), JSON.stringify(guestCustomQ));

    return userRecord;
  },

  // 로그인 (로컬 계정 또는 다른 기기에서 클라우드 ID/동기화 코드로 접속)
  async loginUser({ username, password, cloudSyncId = "" }) {
    const cleanId = (username || "").trim().toLowerCase();
    if (!cleanId) throw new Error("아이디를 입력해주세요.");

    const db = this.getUsersDB();
    const inputPwHash = btoa(encodeURIComponent(password || ""));

    // 1) 다른 기기에서 클라우드 동기화 ID를 함께 입력했거나 기존 계정에 cloudId가 있는 경우 클라우드에서 최신 데이터 조회
    const targetCloudId = (cloudSyncId || "").trim() || (db[cleanId] && db[cleanId].cloudId);

    if (targetCloudId) {
      try {
        const resp = await fetch(`https://api.restful-api.dev/objects/${encodeURIComponent(targetCloudId)}`);
        if (resp.ok) {
          const remoteObj = await resp.json();
          const rData = remoteObj.data || {};
          if (rData.username && rData.username !== cleanId) {
            throw new Error("클라우드 동기화 코드의 아이디와 입력한 아이디가 일치하지 않습니다.");
          }
          if (rData.pwHash && rData.pwHash !== inputPwHash) {
            throw new Error("비밀번호가 일치하지 않습니다.");
          }

          const userRecord = {
            username: cleanId,
            nickname: rData.nickname || cleanId,
            pwHash: rData.pwHash || inputPwHash,
            cloudId: targetCloudId,
            lastSyncAt: new Date().toISOString()
          };
          db[cleanId] = userRecord;
          this.saveUsersDB(db);
          localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(userRecord));

          if (rData.history) {
            localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.HISTORY), JSON.stringify(rData.history));
          }
          if (rData.bookmarks) {
            localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.BOOKMARKS), JSON.stringify(rData.bookmarks));
          }
          if (rData.customQuestions) {
            localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.CUSTOM_QUESTIONS), JSON.stringify(rData.customQuestions));
          }
          return { user: userRecord, syncedFromCloud: true };
        }
      } catch (err) {
        if (err.message.includes("비밀번호") || err.message.includes("일치하지")) {
          throw err;
        }
      }
    }

    // 2) 로컬 DB 확인
    const localUser = db[cleanId];
    if (!localUser) {
      throw new Error(
        "해당 기기에 등록되지 않은 아이디입니다. 회원가입을 하시거나, 다른 기기에서 가입하셨다면 [클라우드 동기화 코드]를 함께 입력해주세요."
      );
    }
    if (localUser.pwHash !== inputPwHash) {
      throw new Error("비밀번호가 올바르지 않습니다.");
    }

    localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(localUser));
    return { user: localUser, syncedFromCloud: false };
  },

  logoutUser() {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  },

  // 현재 사용자의 이력을 클라우드에 업로드 동기화
  async syncToCloud() {
    const user = this.getCurrentUser();
    if (!user) return null;

    const payloadData = {
      username: user.username,
      nickname: user.nickname,
      pwHash: user.pwHash,
      history: this.getHistory(),
      bookmarks: this.getBookmarks(),
      customQuestions: this.getCustomQuestions(),
      updatedAt: new Date().toISOString()
    };

    try {
      let cloudId = user.cloudId;
      if (cloudId) {
        const resp = await fetch(`https://api.restful-api.dev/objects/${encodeURIComponent(cloudId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `mangkey_user_${user.username}`,
            data: payloadData
          })
        });
        if (!resp.ok) cloudId = null;
      }

      if (!cloudId) {
        const resp = await fetch("https://api.restful-api.dev/objects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `mangkey_user_${user.username}`,
            data: payloadData
          })
        });
        if (resp.ok) {
          const created = await resp.json();
          cloudId = created.id;
        }
      }

      if (cloudId) {
        const updatedUser = { ...user, cloudId, lastSyncAt: new Date().toISOString() };
        const db = this.getUsersDB();
        db[user.username] = updatedUser;
        this.saveUsersDB(db);
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  // 클라우드에서 최신 이력 불러오기
  async pullFromCloud() {
    const user = this.getCurrentUser();
    if (!user || !user.cloudId) {
      throw new Error("연결된 클라우드 동기화 ID가 없습니다. 먼저 [클라우드 저장]을 눌러주세요.");
    }
    const resp = await fetch(`https://api.restful-api.dev/objects/${encodeURIComponent(user.cloudId)}`);
    if (!resp.ok) throw new Error("클라우드 서버에서 데이터를 불러오지 못했습니다.");
    const remoteObj = await resp.json();
    const rData = remoteObj.data || {};
    if (rData.history) {
      localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.HISTORY), JSON.stringify(rData.history));
    }
    if (rData.bookmarks) {
      localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.BOOKMARKS), JSON.stringify(rData.bookmarks));
    }
    if (rData.customQuestions) {
      localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.CUSTOM_QUESTIONS), JSON.stringify(rData.customQuestions));
    }
    const updatedUser = { ...user, lastSyncAt: new Date().toISOString() };
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // 어디서든 텍스트 코드 하나로 백업/복원 가능한 휴대용 이력 코드 생성
  exportBackupCode() {
    const data = {
      user: this.getCurrentUser(),
      history: this.getHistory(),
      bookmarks: this.getBookmarks(),
      customQuestions: this.getCustomQuestions()
    };
    return btoa(encodeURIComponent(JSON.stringify(data)));
  },

  importBackupCode(codeStr) {
    const decoded = JSON.parse(decodeURIComponent(atob(codeStr.trim())));
    if (decoded.user && decoded.user.username) {
      const db = this.getUsersDB();
      db[decoded.user.username] = decoded.user;
      this.saveUsersDB(db);
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(decoded.user));
    }
    if (decoded.history) {
      localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.HISTORY), JSON.stringify(decoded.history));
    }
    if (decoded.bookmarks) {
      localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.BOOKMARKS), JSON.stringify(decoded.bookmarks));
    }
    if (decoded.customQuestions) {
      localStorage.setItem(this.getUserKey(this.STORAGE_KEYS.CUSTOM_QUESTIONS), JSON.stringify(decoded.customQuestions));
    }
    return true;
  },

  // ================= 2. 문제 은행 (필기 / 실기 완벽 구분) & 연도 추출 =================
  getCustomQuestions(examType = null) {
    const key = this.getUserKey(this.STORAGE_KEYS.CUSTOM_QUESTIONS);
    const customRaw = localStorage.getItem(key) || localStorage.getItem(this.STORAGE_KEYS.CUSTOM_QUESTIONS);
    let list = [];
    try {
      list = customRaw ? JSON.parse(customRaw) : [];
    } catch (e) {
      list = [];
    }
    if (!examType) return list;
    return list.filter((q) => (q.examType || "written") === examType);
  },

  getAllQuestions(examType = "written") {
    if (examType === "practical") {
      return [...(window.PRACTICAL_QUESTIONS || []), ...this.getCustomQuestions("practical")];
    }
    return [...(window.INITIAL_QUESTIONS || []), ...this.getCustomQuestions("written")];
  },

  // 문제의 연도(2022, 2023, 2024, 2025, 2026 등) 추출 헬퍼
  extractYearNumber(yearStr) {
    if (!yearStr) return "기타";
    const m = String(yearStr).match(/(20\d{2})/);
    return m ? m[1] : "기타";
  },

  // 선택 가능한 기출 연도 목록 반환 (예: ["2026", "2025", "2024", "2023", "2022"])
  getAvailableYears(examType = "written") {
    const all = this.getAllQuestions(examType);
    const yearSet = new Set();
    all.forEach((q) => {
      const y = this.extractYearNumber(q.year);
      if (y !== "기타") yearSet.add(y);
    });
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  },

  addCustomQuestions(newQuestions) {
    const key = this.getUserKey(this.STORAGE_KEYS.CUSTOM_QUESTIONS);
    const customList = this.getCustomQuestions(null);
    const updated = [...newQuestions, ...customList];
    localStorage.setItem(key, JSON.stringify(updated));
    this.syncToCloud();
    return updated;
  },

  // 실기 주관식(단답형/서술형/작업형) 텍스트 답안 키워드 자동 채점기
  gradePracticalInput(questionObj, userInputText) {
    const cleanInput = (userInputText || "").trim().toLowerCase();
    if (!cleanInput) return { isCorrect: false, matchedCount: 0 };
    const keywords = questionObj.acceptedKeywords || [];
    if (keywords.length === 0) {
      const ansOpt = (questionObj.options?.[questionObj.answer] || "").toLowerCase();
      return { isCorrect: ansOpt.includes(cleanInput) || cleanInput.includes(ansOpt), matchedCount: 1 };
    }
    let matchedCount = 0;
    keywords.forEach((kw) => {
      if (cleanInput.includes(kw.toLowerCase())) {
        matchedCount++;
      }
    });
    // 핵심 키워드 중 1개 이상 정확히 포함하면 정답 인정 (복수 빈칸의 경우 절반 이상 포함 시 정답)
    const threshold = keywords.length >= 3 ? 2 : 1;
    return {
      isCorrect: matchedCount >= threshold,
      matchedCount,
      totalKeywords: keywords.length
    };
  },

  // ================= 3. 풀이 이력 & 오답 초기화 =================
  getHistory() {
    const key = this.getUserKey(this.STORAGE_KEYS.HISTORY);
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch (e) {
      return {};
    }
  },

  recordAttempt(questionId, isCorrect, selectedAnswer) {
    const key = this.getUserKey(this.STORAGE_KEYS.HISTORY);
    const history = this.getHistory();
    const prev = history[questionId] || { attempts: 0, correct: 0, lastWrong: false };
    history[questionId] = {
      attempts: prev.attempts + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      lastWrong: !isCorrect,
      lastSelected: selectedAnswer,
      lastAttemptAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(history));
    this.syncToCloud();
    return history;
  },

  // 오답노트 초기화 (현재 선택된 시험 유형(필기/실기) 또는 과목의 오답 상태를 초기화)
  clearWrongNotes(subjectId = null, examType = null) {
    const key = this.getUserKey(this.STORAGE_KEYS.HISTORY);
    const history = this.getHistory();
    const targetQuestions = examType ? this.getAllQuestions(examType) : [...this.getAllQuestions("written"), ...this.getAllQuestions("practical")];
    const targetIdSet = new Set(targetQuestions.map((q) => q.id));

    Object.keys(history).forEach((qId) => {
      if (history[qId] && history[qId].lastWrong && targetIdSet.has(qId)) {
        if (subjectId) {
          const qObj = targetQuestions.find((q) => q.id === qId);
          if (qObj && Number(qObj.subjectId) === Number(subjectId)) {
            history[qId].lastWrong = false;
          }
        } else {
          history[qId].lastWrong = false;
        }
      }
    });

    localStorage.setItem(key, JSON.stringify(history));
    this.syncToCloud();
    return history;
  },

  // 단일 문제 오답 해제
  clearSingleWrong(questionId) {
    const key = this.getUserKey(this.STORAGE_KEYS.HISTORY);
    const history = this.getHistory();
    if (history[questionId]) {
      history[questionId].lastWrong = false;
      localStorage.setItem(key, JSON.stringify(history));
      this.syncToCloud();
    }
    return history;
  },

  // 전체 풀이 기록 완전 초기화
  resetAllHistory() {
    const key = this.getUserKey(this.STORAGE_KEYS.HISTORY);
    localStorage.setItem(key, "{}");
    this.syncToCloud();
    return {};
  },

  getBookmarks() {
    const key = this.getUserKey(this.STORAGE_KEYS.BOOKMARKS);
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      return [];
    }
  },

  toggleBookmark(questionId) {
    const key = this.getUserKey(this.STORAGE_KEYS.BOOKMARKS);
    const list = this.getBookmarks();
    const idx = list.indexOf(questionId);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(questionId);
    }
    localStorage.setItem(key, JSON.stringify(list));
    this.syncToCloud();
    return list;
  },

  getSubjectStats(examType = "written") {
    const questions = this.getAllQuestions(examType);
    const history = this.getHistory();

    return window.INFOSEC_SUBJECTS.map((subj) => {
      const subjQuestions = questions.filter((q) => q.subjectId === subj.id);
      let totalAttempts = 0;
      let totalCorrect = 0;
      let solvedCount = 0;
      let wrongQuestions = [];

      subjQuestions.forEach((q) => {
        const h = history[q.id];
        if (h && h.attempts > 0) {
          solvedCount++;
          totalAttempts += h.attempts;
          totalCorrect += h.correct;
          if (h.lastWrong) {
            wrongQuestions.push(q);
          }
        }
      });

      const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;
      return {
        ...subj,
        totalQuestions: subjQuestions.length,
        solvedCount,
        totalAttempts,
        totalCorrect,
        accuracy,
        wrongCount: wrongQuestions.length,
        wrongQuestions
      };
    });
  },

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  // ================= 4. 랜덤 기출 모의고사 생성 (필기/실기 구분 및 연도별 필터 포함) =================
  generateRandomExam({
    examType = "written",
    subjectIds = [1, 2, 3, 4, 5],
    yearFilter = "all",
    count = 10,
    mode = "all",
    shuffleOptions = true,
    includeSmartVariations = false
  }) {
    const allQuestions = this.getAllQuestions(examType);
    const history = this.getHistory();
    const bookmarks = this.getBookmarks();

    let pool = allQuestions.filter((q) => subjectIds.includes(Number(q.subjectId)));

    // 연도별 필터 적용
    if (yearFilter && yearFilter !== "all") {
      const yearMatched = pool.filter((q) => this.extractYearNumber(q.year) === String(yearFilter));
      if (yearMatched.length > 0) {
        pool = yearMatched;
      }
    }

    if (mode === "wrong_only") {
      const wrongPool = pool.filter((q) => history[q.id] && history[q.id].lastWrong);
      if (wrongPool.length > 0) pool = wrongPool;
    } else if (mode === "bookmarked") {
      const bmPool = pool.filter((q) => bookmarks.includes(q.id));
      if (bmPool.length > 0) pool = bmPool;
    }

    let shuffledPool = this.shuffleArray(pool);

    if (mode === "unsolved_first") {
      shuffledPool.sort((a, b) => {
        const aSolved = history[a.id] ? 1 : 0;
        const bSolved = history[b.id] ? 1 : 0;
        return aSolved - bSolved;
      });
    }

    let selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

    // 스마트 변형 혼합 옵션이 켜져 있으면 기본 문제와 스마트 변형 문제를 혼합
    if (includeSmartVariations && selected.length > 0) {
      const halfCount = Math.max(1, Math.floor(count / 2));
      const baseSlice = selected.slice(0, halfCount);
      const variations = baseSlice.map((q, idx) => this.createLocalSmartVariation(q, idx));
      selected = this.shuffleArray([...selected, ...variations]).slice(0, count);
    }

    // 요청한 문항 수(예: 50문항, 100문항)보다 현재 필터 풀이 적을 경우 부족한 개수만큼 자동 변형 생성하여 100% 채움
    if (selected.length < count && shuffledPool.length > 0) {
      let fillIndex = 0;
      const needed = count - selected.length;
      const extraVariations = [];
      while (extraVariations.length < needed) {
        const baseQ = shuffledPool[fillIndex % shuffledPool.length];
        const variantMode = Math.floor(fillIndex / shuffledPool.length) + 1;
        extraVariations.push(this.createLocalSmartVariation(baseQ, variantMode + fillIndex));
        fillIndex++;
      }
      selected = [...selected, ...extraVariations];
    }

    return selected.slice(0, count).map((q) => {
      if (!shuffleOptions) return { ...q };
      const indexedOptions = q.options.map((optText, idx) => ({
        text: optText,
        isCorrect: idx === q.answer
      }));
      const shuffledOpts = this.shuffleArray(indexedOptions);
      const newAnswerIndex = shuffledOpts.findIndex((o) => o.isCorrect);
      return {
        ...q,
        options: shuffledOpts.map((o) => o.text),
        answer: newAnswerIndex
      };
    });
  },

  createLocalSmartVariation(baseQuestion, variantSeed = 0) {
    const qExamType = baseQuestion.examType || "written";
    const allSameSubj = this.getAllQuestions(qExamType).filter(
      (q) => q.subjectId === baseQuestion.subjectId && q.id !== baseQuestion.id
    );
    const correctOptionText = baseQuestion.options[baseQuestion.answer];
    const wrongOptionsFromBase = baseQuestion.options.filter((_, idx) => idx !== baseQuestion.answer);

    const peerQuestions = this.shuffleArray(allSameSubj).slice(0, 3);
    const isAskingForWrong =
      baseQuestion.question.includes("옳지 않은") ||
      baseQuestion.question.includes("틀린") ||
      baseQuestion.question.includes("부적절한") ||
      baseQuestion.question.includes("거리가 먼") ||
      baseQuestion.question.includes("바르지 않은");

    let newQuestionText = "";
    let newOptions = [];
    let newAnswer = 0;
    const patternType = variantSeed % 3;

    if (qExamType === "practical") {
      // 실기 문제 변형 시 코드 스니펫, 모범답안, 채점 키워드를 유지하면서 실전 응용 시나리오로 변형
      const tagLabel = (baseQuestion.tags && baseQuestion.tags.slice(0, 2).join("·")) || "실기응용";
      newQuestionText = baseQuestion.question.replace(/^\[([^\]]+)\]/, `[$1·실전변형(${tagLabel})]`);
      const indexed = baseQuestion.options.map((t, idx) => ({
        text: t,
        isAns: idx === baseQuestion.answer
      }));
      const shuffled = this.shuffleArray(indexed);
      newOptions = shuffled.map((s) => s.text);
      newAnswer = shuffled.findIndex((s) => s.isAns);
    } else if (patternType === 1 && baseQuestion.keyPoint && peerQuestions.length >= 3) {
      const tagTitle = (baseQuestion.tags && baseQuestion.tags[0]) || "핵심 보안 기술";
      newQuestionText = `[기출변형·핵심요점] 다음 중 '${tagTitle}' 및 관련 과목의 핵심 보안 개념에 대한 설명으로 가장 올바른 것은?`;
      const peerFalseCandidates = [];
      peerQuestions.forEach((pq) => {
        const pqAskWrong =
          pq.question.includes("옳지 않은") ||
          pq.question.includes("틀린") ||
          pq.question.includes("부적절한") ||
          pq.question.includes("거리가 먼") ||
          pq.question.includes("바르지 않은");
        if (pqAskWrong) {
          peerFalseCandidates.push(pq.options[pq.answer]);
        } else {
          const wrongOpt = pq.options.find((_, i) => i !== pq.answer);
          if (wrongOpt) peerFalseCandidates.push(wrongOpt);
        }
      });
      while (peerFalseCandidates.length < 3) {
        peerFalseCandidates.push(
          wrongOptionsFromBase[peerFalseCandidates.length % wrongOptionsFromBase.length]
        );
      }
      const combined = [
        { text: baseQuestion.keyPoint, isAns: true },
        ...peerFalseCandidates.slice(0, 3).map((t) => ({ text: t, isAns: false }))
      ];
      const shuffled = this.shuffleArray(combined);
      newOptions = shuffled.map((s) => s.text);
      newAnswer = shuffled.findIndex((s) => s.isAns);
    } else if (isAskingForWrong && peerQuestions.length >= 2 && patternType === 0) {
      const tagTitle = (baseQuestion.tags && baseQuestion.tags[0]) || "정보보안 핵심 개념";
      newQuestionText = `[기출변형·통합형] 다음 중 '${tagTitle}' 및 관련 보안 기술에 대한 설명으로 옳지 않은 것은?`;
      const trueStatements = [...wrongOptionsFromBase];
      peerQuestions.forEach((pq) => {
        if (pq.keyPoint) {
          trueStatements.push(pq.keyPoint);
        }
      });
      const pickedTrue = this.shuffleArray(trueStatements).slice(0, 3);
      const combined = [
        { text: correctOptionText, isAns: true },
        ...pickedTrue.map((t) => ({ text: t, isAns: false }))
      ];
      const shuffled = this.shuffleArray(combined);
      newOptions = shuffled.map((s) => s.text);
      newAnswer = shuffled.findIndex((s) => s.isAns);
    } else {
      const tagLabel = (baseQuestion.tags && baseQuestion.tags.slice(0, 2).join("·")) || "실전응용";
      newQuestionText = `[기출변형·${tagLabel}] ${baseQuestion.question}`;
      const indexed = baseQuestion.options.map((t, idx) => ({
        text: t,
        isAns: idx === baseQuestion.answer
      }));
      const shuffled = this.shuffleArray(indexed);
      newOptions = shuffled.map((s) => s.text);
      newAnswer = shuffled.findIndex((s) => s.isAns);
    }

    return {
      ...baseQuestion,
      id: `${baseQuestion.id}_VAR_${variantSeed}_${Math.floor(1000 + Math.random() * 9000)}`,
      examType: qExamType,
      subjectId: baseQuestion.subjectId,
      year: `${baseQuestion.year} (변형)`,
      difficulty: baseQuestion.difficulty === "하" ? "중" : "상",
      tags: [...(baseQuestion.tags || []), "기출변형"],
      question: newQuestionText,
      options: newOptions,
      answer: newAnswer,
      explanation: `[원본 기출(${baseQuestion.id}) 기반 변형 해설]\n${baseQuestion.explanation}`,
      keyPoint: baseQuestion.keyPoint
    };
  },

  async generateQuestionsWithAI({ examType = "written", subjectId, topicKeyword, count = 3, apiKey }) {
    const subj = window.INFOSEC_SUBJECTS.find((s) => s.id === Number(subjectId)) || window.INFOSEC_SUBJECTS[0];
    const sampleQuestions = this.getAllQuestions(examType)
      .filter((q) => q.subjectId === subj.id)
      .slice(0, 3);

    if (!apiKey || !apiKey.trim()) {
      const basePool = this.shuffleArray(
        this.getAllQuestions(examType).filter((q) => q.subjectId === subj.id)
      ).slice(0, count);
      const generated = basePool.map((q, idx) => this.createLocalSmartVariation(q, idx));
      this.addCustomQuestions(generated);
      return {
        mode: "local_smart",
        questions: generated
      };
    }

    const isPractical = examType === "practical";
    const prompt = `당신은 대한민국 국가기술자격 '정보보안기사' ${isPractical ? "실기(단답형·서술형·실무작업형)" : "필기(4지선다 객관식)"} 시험 출제위원입니다.
과목: ${subj.name} (${subj.description})
집중 주제/키워드: ${topicKeyword || "최근 빈출 핵심 기출 개념"}

기존 기출 참고 예시:
${JSON.stringify(sampleQuestions, null, 2)}

위 과목과 키워드를 바탕으로 실제 정보보안기사 ${isPractical ? "실기시험(로그/설정 코드 스니펫, 모범답안, 채점키워드 포함)" : "필기시험"} 수준의 기출 변형 문제를 정확히 ${count}문제 생성해주세요.
반드시 아래 JSON 배열 형식으로만 응답하세요:
[
  {
    "examType": "${examType}",
    "pCategory": "${isPractical ? "실무/작업형" : "객관식"}",
    "subjectId": ${subj.id},
    "year": "2026년 AI ${isPractical ? "실기" : "필기"}변형",
    "difficulty": "중",
    "tags": ["키워드1", "키워드2"],
    "question": "문제 지문...",
    "codeSnippet": "${isPractical ? "설정 파일이나 패킷 로그 예시..." : ""}",
    "acceptedKeywords": ["핵심정답키워드"],
    "modelAnswer": "실기 모범 답안",
    "options": ["보기1", "보기2", "보기3", "보기4"],
    "answer": 0,
    "explanation": "상세하고 명확한 해설",
    "keyPoint": "수험생이 한 줄로 암기할 핵심 요약 포인트"
  }
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API 호출 실패 (HTTP ${response.status})`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    const formatted = parsed.map((item, idx) => ({
      ...item,
      id: `AI_${isPractical ? "P" : "Q"}_${subj.id}_${Date.now()}_${idx}`,
      examType,
      subjectId: Number(subj.id)
    }));

    this.addCustomQuestions(formatted);
    return {
      mode: "gemini_ai",
      questions: formatted
    };
  },

  generateCustomSummary({
    examType = "written",
    subjectIds = [1, 2, 3, 4, 5],
    includeWrongNotes = true,
    includeBookmarks = true,
    searchKeyword = ""
  }) {
    const allQuestions = this.getAllQuestions(examType);
    const history = this.getHistory();
    const bookmarks = this.getBookmarks();

    const filteredQuestions = allQuestions.filter((q) => {
      if (!subjectIds.includes(Number(q.subjectId))) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const inText =
          q.question.toLowerCase().includes(kw) ||
          (q.keyPoint && q.keyPoint.toLowerCase().includes(kw)) ||
          (q.explanation && q.explanation.toLowerCase().includes(kw)) ||
          (q.tags && q.tags.some((t) => t.toLowerCase().includes(kw)));
        if (!inText) return false;
      }
      return true;
    });

    const wrongQuestions = filteredQuestions.filter((q) => history[q.id] && history[q.id].lastWrong);
    const bookmarkedQuestions = filteredQuestions.filter((q) => bookmarks.includes(q.id));

    const summarySource =
      examType === "practical"
        ? window.PRACTICAL_SUBJECT_SUMMARIES || window.DETAILED_SUBJECT_SUMMARIES
        : window.DETAILED_SUBJECT_SUMMARIES || window.SUBJECT_SUMMARIES;
    const kw = searchKeyword.trim().toLowerCase();

    const subjectBlocks = subjectIds.map((sid) => {
      const subjInfo = window.INFOSEC_SUBJECTS.find((s) => s.id === Number(sid));
      const rawSummary = summarySource[sid];
      let baseSummary = rawSummary;

      if (rawSummary && kw) {
        const filteredSections = rawSummary.sections.filter((sec) => {
          const inTopic =
            sec.topic?.toLowerCase().includes(kw) ||
            sec.summary?.toLowerCase().includes(kw) ||
            sec.trap?.toLowerCase().includes(kw);
          const inBullets = sec.bullets?.some((b) => b.toLowerCase().includes(kw));
          const inTable = sec.table?.rows?.some((r) =>
            r.some((cell) => cell.toLowerCase().includes(kw))
          );
          return inTopic || inBullets || inTable;
        });
        baseSummary = { ...rawSummary, sections: filteredSections };
      }

      const subjQuestions = filteredQuestions.filter((q) => q.subjectId === Number(sid));
      const keyPoints = subjQuestions
        .filter((q) => q.keyPoint)
        .map((q) => ({
          id: q.id,
          tags: q.tags || [],
          keyPoint: q.keyPoint,
          isWrong: Boolean(history[q.id] && history[q.id].lastWrong),
          isBookmarked: bookmarks.includes(q.id)
        }));

      return {
        subject: subjInfo,
        baseSummary,
        keyPoints
      };
    });

    let markdown = `# 🛡️ 망키시큐리티 정보보안기사 필기 맞춤형 비주얼 핵심 요약본\n`;
    markdown += `> 생성 일시: ${new Date().toLocaleString("ko-KR")}\n\n`;

    if (includeWrongNotes && wrongQuestions.length > 0) {
      markdown += `## 🚨 최우선 암기: 내가 틀린 오답 핵심 요점 (${wrongQuestions.length}건)\n`;
      wrongQuestions.forEach((wq, i) => {
        markdown += `${i + 1}. **[${wq.tags ? wq.tags.join("/") : wq.id}]** ${wq.keyPoint || wq.explanation}\n`;
      });
      markdown += `\n---\n\n`;
    }

    if (includeBookmarks && bookmarkedQuestions.length > 0) {
      markdown += `## ⭐ 북마크 중요 기출 포인트 (${bookmarkedQuestions.length}건)\n`;
      bookmarkedQuestions.forEach((bq, i) => {
        markdown += `${i + 1}. **[${bq.tags ? bq.tags.join("/") : bq.id}]** ${bq.keyPoint || bq.explanation}\n`;
      });
      markdown += `\n---\n\n`;
    }

    subjectBlocks.forEach((block) => {
      if (!block.subject) return;
      markdown += `## 📌 ${block.subject.name}\n`;
      if (block.baseSummary?.overview) {
        markdown += `> ${block.baseSummary.overview}\n\n`;
      }
      if (block.baseSummary) {
        block.baseSummary.sections.forEach((sec) => {
          markdown += `### ${sec.topic} ${sec.importance ? `[${sec.importance}]` : ""}\n`;
          if (sec.summary) markdown += `${sec.summary}\n\n`;
          if (sec.table) {
            markdown += `| ${sec.table.headers.join(" | ")} |\n`;
            markdown += `| ${sec.table.headers.map(() => "---").join(" | ")} |\n`;
            sec.table.rows.forEach((row) => {
              markdown += `| ${row.map((c) => c.replace(/\n/g, "<br>")).join(" | ")} |\n`;
            });
            markdown += `\n`;
          }
          if (sec.bullets) {
            sec.bullets.forEach((b) => {
              markdown += `- ${b}\n`;
            });
            markdown += `\n`;
          }
          if (sec.trap) {
            markdown += `> ${sec.trap}\n\n`;
          }
        });
      }
      if (block.keyPoints.length > 0) {
        markdown += `### 💡 기출 빈출 한 줄 암기 포인트\n`;
        block.keyPoints.forEach((kp) => {
          const badge = kp.isWrong ? "🚨[오답주의] " : kp.isBookmarked ? "⭐[중요] " : "";
          markdown += `- ${badge}**[${kp.tags.join(", ")}]**: ${kp.keyPoint}\n`;
        });
        markdown += `\n`;
      }
    });

    return {
      wrongQuestions,
      bookmarkedQuestions,
      subjectBlocks,
      markdown
    };
  },

  parseRawQuestionsText(rawText, defaultSubjectId = 1, defaultYear = "2026년 사용자 추가 기출") {
    if (!rawText || !rawText.trim()) return [];

    const trimmed = rawText.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        return arr.map((item, idx) => ({
          id: item.id || `USR_${Date.now()}_${idx}`,
          subjectId: Number(item.subjectId || defaultSubjectId),
          year: item.year || defaultYear,
          difficulty: item.difficulty || "중",
          tags: item.tags || ["사용자추가"],
          question: item.question || "문제 지문 없음",
          options:
            Array.isArray(item.options) && item.options.length >= 2
              ? item.options.slice(0, 4)
              : ["보기1", "보기2", "보기3", "보기4"],
          answer: typeof item.answer === "number" ? item.answer : 0,
          explanation: item.explanation || "사용자 등록 해설",
          keyPoint: item.keyPoint || item.explanation || ""
        }));
      } catch (e) {
        // 일반 텍스트 파싱으로 진행
      }
    }

    const blocks = trimmed
      .split(/\n\s*\n+|(?=\n(?:Q?\d+[\.\)]|\[문제\s*\d+\]))/g)
      .map((b) => b.trim())
      .filter((b) => b.length > 10);

    const parsedQuestions = [];

    blocks.forEach((block, idx) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      let questionLines = [];
      let options = [];
      let answer = 0;
      let explanation = "";
      let keyPoint = "";

      lines.forEach((line) => {
        const ansMatch = line.match(/^(?:정답|답|Answer)\s*[:：]?\s*([1-4①②③④])/i);
        if (ansMatch) {
          const token = ansMatch[1];
          const map = { "1": 0, "2": 1, "3": 2, "4": 3, "①": 0, "②": 1, "③": 2, "④": 3 };
          if (map[token] !== undefined) answer = map[token];
          return;
        }

        const expMatch = line.match(/^(?:해설|풀이|Explanation)\s*[:：]\s*(.+)/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
          return;
        }

        const kpMatch = line.match(/^(?:핵심|요약|요점|KeyPoint)\s*[:：]\s*(.+)/i);
        if (kpMatch) {
          keyPoint = kpMatch[1].trim();
          return;
        }

        const optMatch = line.match(/^(?:[①②③④]|\(?[1-4]\)|[1-4]\.)\s*(.+)/);
        if (optMatch && questionLines.length > 0 && options.length < 4) {
          options.push(optMatch[1].trim());
          return;
        }

        if (options.length === 0) {
          questionLines.push(line.replace(/^(?:Q?\d+[\.\)]|\[문제\s*\d+\])\s*/, ""));
        } else if (explanation) {
          explanation += " " + line;
        }
      });

      if (questionLines.length > 0 && options.length >= 2) {
        while (options.length < 4) {
          options.push(`선택지 ${options.length + 1}`);
        }
        const qText = questionLines.join(" ");
        parsedQuestions.push({
          id: `USR_${Date.now()}_${idx}`,
          subjectId: Number(defaultSubjectId),
          year: defaultYear,
          difficulty: "중",
          tags: [
            "사용자추가",
            window.INFOSEC_SUBJECTS.find((s) => s.id === Number(defaultSubjectId))?.shortName || "기출"
          ],
          question: qText,
          options,
          answer,
          explanation: explanation || "사용자가 직접 추가한 기출문제입니다.",
          keyPoint: keyPoint || explanation || qText
        });
      }
    });

    return parsedQuestions;
  }
};
