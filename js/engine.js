// 정보보안기사 필기 랜덤 문제 생성, AI 변형, 맞춤형 요약본 생성 및 기출 텍스트 파서 엔진

window.InfoSecEngine = {
  STORAGE_KEYS: {
    CUSTOM_QUESTIONS: "infosec_custom_questions_v1",
    HISTORY: "infosec_solve_history_v1",
    BOOKMARKS: "infosec_bookmarks_v1",
    CUSTOM_SUMMARIES: "infosec_custom_summaries_v1",
    API_KEY: "infosec_gemini_api_key_v1"
  },

  // 전체 문제 로드 (기본 내장 DB + 사용자 추가/AI 생성 문제)
  getAllQuestions() {
    const customRaw = localStorage.getItem(this.STORAGE_KEYS.CUSTOM_QUESTIONS);
    let customList = [];
    try {
      customList = customRaw ? JSON.parse(customRaw) : [];
    } catch (e) {
      customList = [];
    }
    return [...window.INITIAL_QUESTIONS, ...customList];
  },

  // 사용자 정의/AI 문제 저장
  addCustomQuestions(newQuestions) {
    const customRaw = localStorage.getItem(this.STORAGE_KEYS.CUSTOM_QUESTIONS);
    let customList = [];
    try {
      customList = customRaw ? JSON.parse(customRaw) : [];
    } catch (e) {
      customList = [];
    }
    const updated = [...newQuestions, ...customList];
    localStorage.setItem(this.STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
    return updated;
  },

  // 풀이 이력 로드: { [questionId]: { attempts: number, correct: number, lastWrong: boolean, lastAttemptAt: string, selectedAnswer: number } }
  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.HISTORY) || "{}");
    } catch (e) {
      return {};
    }
  },

  // 풀이 결과 기록
  recordAttempt(questionId, isCorrect, selectedAnswer) {
    const history = this.getHistory();
    const prev = history[questionId] || { attempts: 0, correct: 0, lastWrong: false };
    history[questionId] = {
      attempts: prev.attempts + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      lastWrong: !isCorrect,
      lastSelected: selectedAnswer,
      lastAttemptAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return history;
  },

  // 북마크(중요 문제) 관리
  getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BOOKMARKS) || "[]");
    } catch (e) {
      return [];
    }
  },

  toggleBookmark(questionId) {
    const list = this.getBookmarks();
    const idx = list.indexOf(questionId);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(questionId);
    }
    localStorage.setItem(this.STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    return list;
  },

  // 과목별 성취도 및 취약점 분석
  getSubjectStats() {
    const questions = this.getAllQuestions();
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

  // 배열 셔플 (Fisher-Yates)
  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  // 랜덤 기출 모의고사 생성 (과목 선택, 문항 수, 선지 셔플, 출제 모드)
  generateRandomExam({
    subjectIds = [1, 2, 3, 4, 5],
    count = 10,
    mode = "all", // 'all' | 'wrong_only' | 'unsolved_first' | 'bookmarked'
    shuffleOptions = true,
    includeSmartVariations = false
  }) {
    const allQuestions = this.getAllQuestions();
    const history = this.getHistory();
    const bookmarks = this.getBookmarks();

    let pool = allQuestions.filter((q) => subjectIds.includes(Number(q.subjectId)));

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

    // 1) 스마트 변형 혼합 옵션이 켜져 있으면 기본 문제와 스마트 변형 문제를 혼합
    if (includeSmartVariations && selected.length > 0) {
      const halfCount = Math.max(1, Math.floor(count / 2));
      const baseSlice = selected.slice(0, halfCount);
      const variations = baseSlice.map((q, idx) => this.createLocalSmartVariation(q, idx));
      selected = this.shuffleArray([...selected, ...variations]).slice(0, count);
    }

    // 2) 만약 선택한 과목이나 필터의 원본 문항 수가 요청한 count(예: 50문항, 100문항)보다 적을 경우,
    // 부족한 개수만큼 서로 다른 유형의 스마트 기출변형 문제를 자동 생성하여 요청한 문항 수(count)를 100% 정확히 채움!
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

    // 선지(보기) 순서 랜덤 셔플 처리
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

  // 오프라인 스마트 기출 변형 문제 생성기 (다양한 변형 패턴을 지원하여 50~100문항 출제 시에도 중복 없는 실전 문제 생성)
  createLocalSmartVariation(baseQuestion, variantSeed = 0) {
    const allSameSubj = this.getAllQuestions().filter(
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

    if (patternType === 1 && baseQuestion.keyPoint && peerQuestions.length >= 3) {
      // 패턴 1: 핵심 요점(KeyPoint) 기반 정오 판별 문제 생성
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
      // 패턴 0: 다른 기출의 올바른 명제(keyPoint)들과 원본의 틀린 선지(정답)를 교차 조합한 고난도 통합형 문제
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
      // 패턴 2: 심화 응용 검토형 (선지 재구성)
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
      id: `${baseQuestion.id}_VAR_${variantSeed}_${Math.floor(1000 + Math.random() * 9000)}`,
      subjectId: baseQuestion.subjectId,
      year: `${baseQuestion.year} (스마트 변형)`,
      difficulty: baseQuestion.difficulty === "하" ? "중" : "상",
      tags: [...(baseQuestion.tags || []), "기출변형"],
      question: newQuestionText,
      options: newOptions,
      answer: newAnswer,
      explanation: `[원본 기출(${baseQuestion.id}) 기반 변형 해설]\n${baseQuestion.explanation}`,
      keyPoint: baseQuestion.keyPoint
    };
  },

  // Gemini API를 이용한 AI 실전 기출 변형 문제 생성 (API Key 설정 시 동작, 미설정 시 스마트 변형 폴백)
  async generateQuestionsWithAI({ subjectId, topicKeyword, count = 3, apiKey }) {
    const subj = window.INFOSEC_SUBJECTS.find((s) => s.id === Number(subjectId)) || window.INFOSEC_SUBJECTS[0];
    const sampleQuestions = this.getAllQuestions()
      .filter((q) => q.subjectId === subj.id)
      .slice(0, 3);

    if (!apiKey || !apiKey.trim()) {
      // API 키가 없을 경우 내장 스마트 변형 엔진으로 즉시 생성
      const basePool = this.shuffleArray(
        this.getAllQuestions().filter((q) => q.subjectId === subj.id)
      ).slice(0, count);
      const generated = basePool.map((q) => this.createLocalSmartVariation(q));
      this.addCustomQuestions(generated);
      return {
        mode: "local_smart",
        questions: generated
      };
    }

    const prompt = `당신은 대한민국 국가기술자격 '정보보안기사' 필기시험 출제위원입니다.
과목: ${subj.name} (${subj.description})
집중 주제/키워드: ${topicKeyword || "최근 빈출 핵심 기출 개념"}

기존 기출 참고 예시:
${JSON.stringify(sampleQuestions, null, 2)}

위 과목과 키워드를 바탕으로 실제 정보보안기사 필기시험 수준의 4지선다형 객관식 기출 변형 문제를 정확히 ${count}문제 생성해주세요.
반드시 아래 JSON 배열 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON 배열만 출력):
[
  {
    "subjectId": ${subj.id},
    "year": "AI 실전 기출변형",
    "difficulty": "중",
    "tags": ["키워드1", "키워드2"],
    "question": "문제 지문...",
    "options": ["보기1", "보기2", "보기3", "보기4"],
    "answer": 0,
    "explanation": "정답 및 오답 선지에 대한 상세하고 명확한 해설",
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
      id: `AI_${subj.id}_${Date.now()}_${idx}`,
      subjectId: Number(subj.id)
    }));

    this.addCustomQuestions(formatted);
    return {
      mode: "gemini_ai",
      questions: formatted
    };
  },

  // 맞춤형 핵심 요약본 자동 생성기 (과목별 + 오답/북마크/선택 태그 기반)
  generateCustomSummary({
    subjectIds = [1, 2, 3, 4, 5],
    includeWrongNotes = true,
    includeBookmarks = true,
    searchKeyword = ""
  }) {
    const allQuestions = this.getAllQuestions();
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

    // 과목별 핵심 요약 섹션 조립 (고도화된 DETAILED_SUBJECT_SUMMARIES 우선 활용)
    const summarySource = window.DETAILED_SUBJECT_SUMMARIES || window.SUBJECT_SUMMARIES;
    const kw = searchKeyword.trim().toLowerCase();

    const subjectBlocks = subjectIds.map((sid) => {
      const subjInfo = window.INFOSEC_SUBJECTS.find((s) => s.id === Number(sid));
      const rawSummary = summarySource[sid];
      let baseSummary = rawSummary;

      if (rawSummary && kw) {
        const filteredSections = rawSummary.sections.filter((sec) => {
          const inTopic = sec.topic?.toLowerCase().includes(kw) || sec.summary?.toLowerCase().includes(kw) || sec.trap?.toLowerCase().includes(kw);
          const inBullets = sec.bullets?.some((b) => b.toLowerCase().includes(kw));
          const inTable = sec.table?.rows?.some((r) => r.some((cell) => cell.toLowerCase().includes(kw)));
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

    // 마크다운 내보내기용 텍스트 생성 (비교표 및 기출 함정 포함)
    let markdown = `# 🛡️ 정보보안기사 필기 맞춤형 비주얼 핵심 요약본\n`;
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

  // 텍스트 기출문제 자동 파서 (사용자가 붙여넣은 기출 텍스트를 분석해 구조화된 문제로 변환)
  parseRawQuestionsText(rawText, defaultSubjectId = 1, defaultYear = "사용자 추가 기출") {
    if (!rawText || !rawText.trim()) return [];

    // JSON 배열 형태인지 먼저 확인
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
          options: Array.isArray(item.options) && item.options.length >= 2 ? item.options.slice(0, 4) : ["보기1", "보기2", "보기3", "보기4"],
          answer: typeof item.answer === "number" ? item.answer : 0,
          explanation: item.explanation || "사용자 등록 해설",
          keyPoint: item.keyPoint || item.explanation || ""
        }));
      } catch (e) {
        // JSON이 아니면 일반 텍스트 파싱으로 진행
      }
    }

    // 빈 줄 2개 이상 또는 문제 번호(1. / Q1. / [문제 1]) 기준으로 블록 분리
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
        // 정답 라인 감지: "정답: 3", "답: ③", "정답 : 2번"
        const ansMatch = line.match(/^(?:정답|답|Answer)\s*[:：]?\s*([1-4①②③④])/i);
        if (ansMatch) {
          const token = ansMatch[1];
          const map = { "1": 0, "2": 1, "3": 2, "4": 3, "①": 0, "②": 1, "③": 2, "④": 3 };
          if (map[token] !== undefined) answer = map[token];
          return;
        }

        // 해설 라인 감지: "해설: ...", "요점: ..."
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

        // 보기 라인 감지: ①, ②, ③, ④ 또는 1), 2), 3), 4) 또는 (1), (2), (3), (4)
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
          tags: ["사용자추가", window.INFOSEC_SUBJECTS.find((s) => s.id === Number(defaultSubjectId))?.shortName || "기출"],
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
