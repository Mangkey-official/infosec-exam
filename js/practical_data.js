// 망키시큐리티 (Mangkey Security) - 정보보안기사 실기(Practical Exam: 단답형·서술형·실무작업형) 기출 및 비주얼 요약 데이터

window.PRACTICAL_QUESTIONS = [
  // ================= 1과목: 시스템 보안 실기 =================
  {
    id: "P101",
    examType: "practical",
    pCategory: "실무/작업형",
    subjectId: 1,
    year: "2026년 1회 실기기출",
    difficulty: "상",
    tags: ["PAM", "계정잠금", "pam_tally2", "리눅스 실무"],
    question: "[실무형] 리눅스 서버에서 SSH 무차별 대입 공격(Brute-Force)에 대응하기 위해 5회 로그인 실패 시 10분(600초) 동안 계정을 잠그려고 한다. 아래 /etc/pam.d/system-auth 설정의 빈칸 ( ㉠ ), ( ㉡ ), ( ㉢ )에 들어갈 알맞은 모듈명과 옵션값을 작성하고, 이에 해당하는 올바른 구성을 고르시오.",
    codeSnippet: `auth  required  /lib/security/(   ㉠   ).so  ( ㉡ )=5  ( ㉢ )=600  no_magic_root
account  required  /lib/security/(   ㉠   ).so`,
    acceptedKeywords: ["pam_tally2", "deny", "unlock_time", "pam_faillock"],
    modelAnswer: "㉠ pam_tally2 (또는 pam_faillock) / ㉡ deny / ㉢ unlock_time",
    options: [
      "㉠ pam_tally2 / ㉡ deny / ㉢ unlock_time",
      "㉠ pam_cracklib / ㉡ retry / ㉢ minlen",
      "㉠ pam_limits / ㉡ maxlogins / ㉢ timeout",
      "㉠ pam_securetty / ㉡ fail_max / ㉢ lock_sec"
    ],
    answer: 0,
    explanation: "리눅스 PAM에서 로그인 실패 임계치 및 잠금 시간을 제어하는 모듈은 `pam_tally2.so`(또는 최신 RHEL의 `pam_faillock.so`)입니다. 실패 허용 횟수 옵션은 `deny=5`, 잠금 유지 시간(초) 옵션은 `unlock_time=600`입니다.",
    keyPoint: "실기 PAM 빈칸 단골: pam_tally2.so deny=실패횟수 unlock_time=잠금초 no_magic_root / 패스워드 복잡도는 pam_pwquality.so(pam_cracklib.so) retry=3 minlen=8 lcredit=-1 ucredit=-1 dcredit=-1 ocredit=-1"
  },
  {
    id: "P102",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 1,
    year: "2025년 2회 실기기출",
    difficulty: "중",
    tags: ["레이스 컨디션", "TOCTOU", "심볼릭 링크"],
    question: "[단답형] 실행 중인 프로세스가 임시 파일을 생성할 때 권한을 검사하는 시점(Time of Check)과 실제로 파일을 사용하는 시점(Time of Use) 사이의 시간차를 이용하여 심볼릭 링크 등으로 중요 시스템 파일을 변조하는 공격 기법의 명칭을 쓰시오.",
    codeSnippet: `$ ln -s /etc/passwd /tmp/temp_work_file`,
    acceptedKeywords: ["레이스 컨디션", "레이스컨디션", "Race Condition", "경쟁 조건", "TOCTOU"],
    modelAnswer: "레이스 컨디션 (Race Condition, 경쟁 조건 공격 / TOCTOU)",
    options: [
      "레이스 컨디션 (Race Condition / TOCTOU)",
      "포맷 스트링 (Format String Attack)",
      "버퍼 오버플로우 (Buffer Overflow)",
      "힙 스프레이 (Heap Spray Attack)"
    ],
    answer: 0,
    explanation: "검사 시점과 사용 시점의 차이(TOCTOU: Time-Of-Check to Time-Of-Use) 및 공유 자원 접근 순서를 악용해 심볼릭 링크로 파일 권한을 탈취하는 공격은 레이스 컨디션(Race Condition)입니다.",
    keyPoint: "실기 단답형: TOCTOU + 임시 파일 + 심볼릭 링크 = 레이스 컨디션(Race Condition)"
  },
  {
    id: "P103",
    examType: "practical",
    pCategory: "실무/작업형",
    subjectId: 1,
    year: "2024년 2회 실기기출",
    difficulty: "중",
    tags: ["SetUID", "find 명령어", "권한상승"],
    question: "[실무형] 침해사고 조사 중 공격자가 루트 권한 백도어를 유지하기 위해 시스템 내에 숨겨둔 'root 소유의 SetUID가 설정된 일반 파일'을 모두 검색하고자 한다. 아래 명령어의 빈칸에 들어갈 정확한 옵션 조합은?",
    codeSnippet: `# find / -user root -type f (       ㉠       ) -exec ls -l {} \\; 2>/dev/null`,
    acceptedKeywords: ["-perm -4000", "-perm +4000", "4000"],
    modelAnswer: "-perm -4000 (또는 -perm /4000)",
    options: [
      "-perm -4000",
      "-perm -2000",
      "-perm -1000",
      "-chmod 4755"
    ],
    answer: 0,
    explanation: "`find` 명령어에서 특정 권한 비트가 포함된 파일을 모두 찾을 때는 `-perm -8진수` 옵션을 사용합니다. SetUID는 4000이므로 `-perm -4000`을 지정하면 SetUID가 부여된 모든 파일(예: 4755 등)을 검색합니다.",
    keyPoint: "실기 명령어 작성: root 소유 SetUID 파일 검색 = find / -user root -perm -4000 -type f -print"
  },
  {
    id: "P104",
    examType: "practical",
    pCategory: "서술형",
    subjectId: 1,
    year: "2023년 3회 실기기출",
    difficulty: "상",
    tags: ["Apache 보안", "httpd.conf", "디렉터리 리스팅", "ServerTokens"],
    question: "[서술형/실무] 다음 Apache 웹 서버 설정(httpd.conf)을 보고 발생할 수 있는 보안 취약점 2가지와 이를 해결하기 위한 설정 변경 방법을 서술하시오.",
    codeSnippet: `ServerTokens Full
ServerSignature On
<Directory "/var/www/html">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>`,
    acceptedKeywords: ["ServerTokens Prod", "ServerSignature Off", "-Indexes", "디렉터리 리스팅", "버전 정보"],
    modelAnswer: "1) 취약점: 웹 서버 상세 버전 및 OS 정보 노출 / 대책: ServerTokens Prod 및 ServerSignature Off 로 변경\n2) 취약점: 디렉터리 리스팅(파일 목록 노출) 및 심볼릭 링크 추적 허용 / 대책: Options 지시자에서 Indexes와 FollowSymLinks를 제거(Options -Indexes -FollowSymLinks)",
    options: [
      "ServerTokens Prod, ServerSignature Off로 변경하여 서버 정보 노출을 차단하고, Options에서 Indexes와 FollowSymLinks를 제거하여 디렉터리 리스팅과 심볼릭 링크 악용을 방지한다.",
      "ServerTokens All로 변경하고 Options에 ExecCGI를 추가하여 모든 스크립트 실행을 허용한다.",
      "AllowOverride All로 변경하고 Require all denied를 제거한다.",
      "포트 번호를 80에서 21로 변경하고 익명 접속을 허용한다."
    ],
    answer: 0,
    explanation: "실기 단골 서술형 문제입니다. ① `ServerTokens Full`과 `ServerSignature On`은 응답 헤더와 에러 페이지에 Apache 버전·모듈·OS 정보를 노출하므로 `ServerTokens Prod`, `ServerSignature Off`로 수정합니다. ② `Options Indexes`는 `index.html`이 없을 때 디렉터리 내 파일 목록을 노출(Directory Listing)하므로 `-Indexes`로 제거해야 합니다.",
    keyPoint: "Apache 실기 서술형 3종 세트: ServerTokens Prod + ServerSignature Off (버전 숨김) / Options -Indexes (디렉터리 리스팅 차단) / LimitRequestBody (업로드 용량 제한)"
  },

  // ================= 2과목: 네트워크 보안 실기 =================
  {
    id: "P201",
    examType: "practical",
    pCategory: "실무/작업형",
    subjectId: 2,
    year: "2026년 1회 실기기출",
    difficulty: "상",
    tags: ["Snort 룰 작성", "SYN Flooding", "threshold"],
    question: "[실무형] 외부 네트워크(any)에서 내부 웹 서버(192.168.10.100)의 80번 포트로 유입되는 SYN Flooding 공격을 탐지하기 위해 '동일 출발지 IP 기준으로 1초 동안 SYN 패킷이 20개 이상 들어올 경우 단 1번만 경고를 발생'시키는 Snort Rule을 작성하고자 한다. 빈칸 ( ㉠ ), ( ㉡ ), ( ㉢ )에 들어갈 올바른 옵션은?",
    codeSnippet: `alert tcp any any -> 192.168.10.100 80 (msg:"SYN Flood Detected"; ( ㉠ ); threshold: type ( ㉡ ), track ( ㉢ ), count 20, seconds 1; sid:100001;)`,
    acceptedKeywords: ["flags:S", "both", "by_src"],
    modelAnswer: "㉠ flags:S / ㉡ both / ㉢ by_src",
    options: [
      "㉠ flags:S / ㉡ both / ㉢ by_src",
      "㉠ flags:A / ㉡ limit / ㉢ by_dst",
      "㉠ flags:F / ㉡ threshold / ㉢ by_src",
      "㉠ sameip / ㉡ both / ㉢ by_dst"
    ],
    answer: 0,
    explanation: "1) SYN 패킷을 검사하는 옵션은 `flags:S;` 입니다. 2) 지정된 시간(1초) 동안 임계치(20개) 이상 발생했을 때 **단 1회만 경고**를 출력하는 threshold 타입은 `type both` 입니다(`limit`는 처음 20번 모두 경고, `threshold`는 20번째마다 반복 경고). 3) 동일 출발지 IP 기준 추적은 `track by_src` 입니다.",
    keyPoint: "Snort 실기 룰 작성: SYN 패킷 = flags:S; / N개 이상 시 1번만 경고 = type both / 출발지 기준 = track by_src / 목적지 기준 = track by_dst"
  },
  {
    id: "P202",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 2,
    year: "2025년 1회 실기기출",
    difficulty: "중",
    tags: ["Slowloris", "Slow HTTP Header DoS", "L7 DDoS"],
    question: "[단답형] 다음 패킷 페이로드 로그와 같이 HTTP 요청 헤더의 끝을 의미하는 빈 줄(CRLF 2번: \\r\\n\\r\\n)을 전송하지 않고 불완전한 헤더를 지속적으로 보내 웹 서버의 연결 자원을 고갈시키는 공격 기법의 명칭을 쓰시오.",
    codeSnippet: `GET /index.html HTTP/1.1\\r\\n
Host: www.mangkey-sec.kr\\r\\n
User-Agent: Mozilla/5.0\\r\\n
X-a: b\\r\\n
(이후 \\r\\n\\r\\n 종료 문자열 없이 대기하며 연결 유지)`,
    acceptedKeywords: ["Slowloris", "슬로우로리스", "Slow HTTP Header", "Slow Header"],
    modelAnswer: "Slowloris (또는 Slow HTTP Header DoS 공격)",
    options: [
      "Slowloris (Slow HTTP Header DoS)",
      "RUDY (Slow HTTP POST DoS)",
      "Slow Read DoS",
      "Smurf Attack"
    ],
    answer: 0,
    explanation: "HTTP 헤더의 끝을 알리는 개행 문자열(`\\r\\n\\r\\n`, 16진수 `|0d 0a 0d 0a|`)을 고의로 보내지 않고 연결을 점유하는 공격은 **Slowloris(Slow HTTP Header DoS)** 공격입니다.",
    keyPoint: "실기 L7 DDoS 패킷 구분: GET + \\r\\n\\r\\n 누락 = Slowloris / POST + Content-Length 크게 설정 후 1바이트씩 분할 전송 = RUDY / Window Size = 0 설정 = Slow Read"
  },
  {
    id: "P203",
    examType: "practical",
    pCategory: "실무/작업형",
    subjectId: 2,
    year: "2024년 1회 실기기출",
    difficulty: "중",
    tags: ["iptables", "방화벽 설정", "IP 차단"],
    question: "[실무형] 리눅스 서버로 들어오는(INPUT) 패킷 중 공격자 IP(203.0.113.55)로부터 출발하여 로컬 웹 서버 포트(TCP 80)로 접근하는 모든 패킷을 응답 없이 폐기(차단)하는 iptables 명령어를 작성하시오.",
    codeSnippet: `# iptables -A (  ㉠  ) -p tcp -s 203.0.113.55 --dport 80 -j (  ㉡  )`,
    acceptedKeywords: ["INPUT", "DROP", "-A INPUT", "-j DROP"],
    modelAnswer: "㉠ INPUT / ㉡ DROP (전체 명령: iptables -A INPUT -p tcp -s 203.0.113.55 --dport 80 -j DROP)",
    options: [
      "㉠ INPUT / ㉡ DROP",
      "㉠ OUTPUT / ㉡ ACCEPT",
      "㉠ FORWARD / ㉡ LOG",
      "㉠ PREROUTING / ㉡ REJECT"
    ],
    answer: 0,
    explanation: "호스트 자신으로 들어오는 패킷을 필터링하는 체인은 `INPUT`이며, 응답 메시지(ICMP/RST) 없이 패킷을 조용히 폐기하는 타겟 액션은 `-j DROP`입니다(응답과 함께 거절할 때는 `-j REJECT`).",
    keyPoint: "iptables 실기 필수 옵션: -A(체인 끝에 규칙 추가: INPUT/OUTPUT/FORWARD), -p(프로토콜: tcp/udp/icmp), -s(출발지 IP), -d(목적지 IP), --dport(목적지 포트), -j(DROP/REJECT/ACCEPT/LOG)"
  },
  {
    id: "P204",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 2,
    year: "2023년 2회 실기기출",
    difficulty: "중",
    tags: ["포트 스캔", "Nmap", "XMAS 스캔"],
    question: "[단답형] 다음 tcpdump 패킷 캡처 로그를 분석하여 공격자가 수행한 포트 스캐닝 기법의 명칭과, 대상 서버의 80번 포트 상태(Open 또는 Closed)를 쓰시오.",
    codeSnippet: `14:22:01.102 IP 192.168.1.50.41234 > 192.168.1.10.80: Flags [FPU], seq 0, win 1024, length 0
14:22:01.103 IP 192.168.1.10.80 > 192.168.1.50.41234: Flags [R.], seq 0, ack 1, win 0, length 0`,
    acceptedKeywords: ["XMAS", "크리스마스", "Closed", "닫힘"],
    modelAnswer: "스캔 기법: XMAS 스캔 (TCP Xmas Scan) / 80번 포트 상태: Closed (닫혀 있음)",
    options: [
      "스캔 기법: XMAS 스캔 (FIN+PSH+URG) / 포트 상태: Closed (닫힘)",
      "스캔 기법: SYN Half-Open 스캔 / 포트 상태: Open (열림)",
      "스캔 기법: NULL 스캔 / 포트 상태: Open (열림)",
      "스캔 기법: ACK 스캔 / 포트 상태: Filtered (필터링됨)"
    ],
    answer: 0,
    explanation: "1) 전송 패킷의 플래그가 `[FPU]`(FIN + PSH + URG)로 켜져 있으므로 **XMAS 스캔**입니다. 2) 스텔스 스캔(FIN/XMAS/NULL)에서 대상 포트로부터 `[R.]`(RST+ACK) 응답이 돌아왔으므로 해당 80번 포트는 **Closed(닫힘)** 상태입니다(열려 있으면 무응답).",
    keyPoint: "tcpdump 플래그 판독: [S]=SYN, [S.]=SYN+ACK, [R.]=RST+ACK, [F]=FIN스캔, [FPU]=XMAS스캔, [none]=NULL스캔 | 스텔스 스캔에서 RST 응답이 오면 포트는 Closed!"
  },

  // ================= 3과목: 애플리케이션 보안 실기 =================
  {
    id: "P301",
    examType: "practical",
    pCategory: "실무/작업형",
    subjectId: 3,
    year: "2026년 1회 실기기출",
    difficulty: "상",
    tags: ["시큐어 코딩", "SQL Injection", "PreparedStatement", "Java"],
    question: "[실무/시큐어코딩] 다음 Java 코드는 사용자 입력(userId)을 문자열 결합(+)으로 쿼리에 직접 연결하여 SQL Injection에 취약하다. 이를 안전하게 수정하기 위해 빈칸 ( ㉠ ), ( ㉡ )에 들어갈 클래스/메서드 명칭을 작성하시오.",
    codeSnippet: `// [취약한 코드]
// Statement stmt = conn.createStatement();
// ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE id = '" + userId + "'");

// [시큐어 코딩 적용]
String sql = "SELECT * FROM users WHERE id = ?";
(        ㉠        ) pstmt = conn.prepareStatement(sql);
pstmt.(     ㉡     )(1, userId);
ResultSet rs = pstmt.executeQuery();`,
    acceptedKeywords: ["PreparedStatement", "setString"],
    modelAnswer: "㉠ PreparedStatement / ㉡ setString",
    options: [
      "㉠ PreparedStatement / ㉡ setString",
      "㉠ CallableStatement / ㉡ getString",
      "㉠ Statement / ㉡ executeUpdate",
      "㉠ SqlConnection / ㉡ bindParam"
    ],
    answer: 0,
    explanation: "Java JDBC에서 SQL Injection을 예방하기 위해서는 `Statement` 대신 바인딩 변수(`?`)를 사용하는 `PreparedStatement` 인터페이스를 사용하고, `pstmt.setString(1, userId)`와 같은 타입별 바인딩 메서드로 값을 매핑해야 합니다.",
    keyPoint: "Java 시큐어코딩 빈칸 1순위: PreparedStatement pstmt = conn.prepareStatement(sql); → pstmt.setString(1, 값); → pstmt.executeQuery();"
  },
  {
    id: "P302",
    examType: "practical",
    pCategory: "서술형",
    subjectId: 3,
    year: "2025년 2회 실기기출",
    difficulty: "중",
    tags: ["CSRF", "웹 로그 분석", "시큐어 코딩"],
    question: "[서술형] 관리자가 게시판의 악성 게시글을 열람하는 순간, 게시글 내부에 숨겨진 아래 HTML 태그로 인해 관리자 권한으로 특정 계정의 비밀번호가 강제 변경되었다. 이 공격의 명칭과 서버 측 방어 대책 3가지를 서술하시오.",
    codeSnippet: `<img src="http://admin.mangkey.kr/member/change_pw.jsp?user=attacker&new_pw=1234" width="0" height="0" />`,
    acceptedKeywords: ["CSRF", "크로스 사이트 요청 위조", "토큰", "Token", "Referer", "재인증", "CAPTCHA", "SameSite"],
    modelAnswer: "1) 공격 명칭: CSRF (Cross-Site Request Forgery, 크로스 사이트 요청 위조)\n2) 방어 대책: ① 세션에 저장된 난수 형태의 CSRF Token 검증 ② 중요 기능 수행 시 현재 비밀번호 입력 또는 CAPTCHA를 통한 재인증 ③ HTTP Referer 헤더를 검증하여 동일 도메인 요청인지 확인 (및 SameSite 쿠키 속성 적용, 상태 변경 요청은 GET이 아닌 POST만 허용)",
    options: [
      "공격명: CSRF / 대책: ① CSRF Token 검증 ② 현재 비밀번호·CAPTCHA 재인증 ③ Referer 헤더 검증 및 SameSite 쿠키 설정",
      "공격명: SQL Injection / 대책: Prepared Statement 적용 및 에러 메시지 차단",
      "공격명: Directory Traversal / 대책: ../ 문자열 필터링 및 chroot 적용",
      "공격명: DNS Spoofing / 대책: DNSSEC 적용 및 hosts 파일 권한 제한"
    ],
    answer: 0,
    explanation: "피해자(관리자)의 브라우저가 스크립트를 실행해 관리자 쿠키를 훔쳐간 것이 아니라, 인증된 관리자의 세션을 이용해 비밀번호 변경 요청(`change_pw.jsp`)을 서버가 처리하도록 유도했으므로 **CSRF(크로스 사이트 요청 위조)** 공격입니다.",
    keyPoint: "실기 서술형 XSS vs CSRF 구분: <script>document.cookie</script>로 쿠키 탈취 = XSS / <img src='.../action.jsp?...'>나 자동제출 <form>으로 비밀변경·권한부여 요청 유도 = CSRF!"
  },
  {
    id: "P303",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 3,
    year: "2024년 1회 실기기출",
    difficulty: "중",
    tags: ["웹 로그 분석", "SQL Injection", "Blind SQLi", "웹셸"],
    question: "[단답형] 웹 서버의 access.log에서 다음과 같은 비정상적인 HTTP 요청이 다수 발견되었다. 공격자가 시도하고 있는 구체적인 웹 공격 기법의 명칭을 쓰시오.",
    codeSnippet: `192.168.10.55 - - [15/May/2026:11:20:01 +0900] "GET /board/view.php?no=10%20AND%20ASCII(SUBSTRING((SELECT%20database()),1,1))>100 HTTP/1.1" 200 4520
192.168.10.55 - - [15/May/2026:11:20:02 +0900] "GET /board/view.php?no=10%20AND%20ASCII(SUBSTRING((SELECT%20database()),1,1))>110 HTTP/1.1" 200 1210`,
    acceptedKeywords: ["Blind SQL Injection", "블라인드 SQL 인젝션", "Blind SQLi", "SQL Injection"],
    modelAnswer: "Blind SQL Injection (블라인드 SQL 인젝션 공격)",
    options: [
      "Blind SQL Injection (블라인드 SQL 인젝션)",
      "Stored XSS (저장형 크로스 사이트 스크립팅)",
      "SSRF (서버 측 요청 위조)",
      "XXE (XML 외부 엔티티 공격)"
    ],
    answer: 0,
    explanation: "`ASCII(SUBSTRING((SELECT ...), 1, 1)) > 100`과 같이 참(True)/거짓(False) 조건에 따른 응답 페이지 크기(4520 vs 1210 바이트) 차이를 이용해 한 글자씩 DB 정보를 알아내는 기법은 **Blind SQL Injection**입니다.",
    keyPoint: "웹 로그 SQLi 유형 판독: SUBSTRING + ASCII 부등호 비교 = Blind SQL Injection(Boolean-based) /SLEEP(5), BENCHMARK, WAITFOR DELAY = Time-based Blind SQLi / UNION SELECT = Union SQLi"
  },
  {
    id: "P304",
    examType: "practical",
    pCategory: "서술형",
    subjectId: 3,
    year: "2023년 1회 실기기출",
    difficulty: "중",
    tags: ["파일 업로드", "웹셸", "시큐어 코딩"],
    question: "[서술형] 게시판의 첨부파일 업로드 기능을 통해 웹셸(cmd.jsp)이 업로드되어 서버 제어권이 탈취되었다. 파일 업로드 취약점을 근본적으로 예방하기 위한 기술적 보안 대책 3가지를 서술하시오.",
    codeSnippet: `POST /upload_proc.jsp HTTP/1.1
Content-Disposition: form-data; name="upfile"; filename="cmd.jsp"
Content-Type: image/jpeg`,
    acceptedKeywords: ["화이트리스트", "확장자", "실행 권한", "실행권한", "난수화", "시그니처"],
    modelAnswer: "1) 업로드 허용 확장자를 화이트리스트(White-list) 방식으로 제한하고 서버 측에서 확장자 및 파일 시그니처(Magic Number)를 검증한다.\n2) 파일이 업로드되는 저장 디렉터리에 스크립트 실행 권한(Execution Permission)을 제거한다.\n3) 업로드된 파일명을 난수화하여 저장하고 웹 루트(DocumentRoot) 외부 경로에 보관한다.",
    options: [
      "① 허용 확장자 화이트리스트 및 시그니처 검증 ② 업로드 폴더의 실행 권한 제거 ③ 저장 파일명 난수화 및 웹 루트 외부 저장",
      "① 블랙리스트로 .exe만 차단 ② 클라이언트 자바스크립트에서만 확장자 검사 ③ Content-Type 헤더만 신뢰",
      "① 업로드 폴더 권한을 777로 설정 ② 원본 파일명 그대로 웹 루트에 저장 ③ 파일 크기 제한 해제",
      "① 쿠키에 HttpOnly 설정 ② Referer 헤더 검증 ③ X-Frame-Options 헤더 추가"
    ],
    answer: 0,
    explanation: "파일 업로드(웹셸) 방어 3대 핵심 키워드인 **① 화이트리스트 확장자/시그니처 검증 ② 업로드 디렉터리 실행 권한 제거 ③ 파일명 난수화 및 웹 루트 외부 저장**은 실기 서술형에서 토씨 하나 안 틀리고 매번 출제되는 1순위 답안입니다.",
    keyPoint: "실기 서술형 만점 답안 공식 (웹셸 방어 3대장): 1) 화이트리스트 확장자 검증 2) 업로드 폴더 실행권한 제거 3) 파일명 난수화 및 웹루트 밖 저장"
  },

  // ================= 4과목: 정보보안 일반 실기 =================
  {
    id: "P401",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 4,
    year: "2026년 1회 실기기출",
    difficulty: "중",
    tags: ["블록암호 운용모드", "CBC", "CTR", "병렬처리"],
    question: "[단답형] 블록 암호 운용 모드 중 ① 이전 암호문 블록을 현재 평문 블록과 XOR 연산한 뒤 암호화하여 '암호화는 직렬이지만 복호화는 병렬 처리가 가능한 모드'와, ② 카운터 값을 암호화한 키 스트림을 평문과 XOR하여 '암호화와 복호화 모두 병렬 처리가 가능하고 패딩이 불필요한 모드'의 명칭을 각각 쓰시오.",
    codeSnippet: `① 암호화: C_i = E_K(P_i ⊕ C_{i-1})  /  복호화: P_i = D_K(C_i) ⊕ C_{i-1}
② 암호화: C_i = P_i ⊕ E_K(Nonce || Counter_i)`,
    acceptedKeywords: ["CBC", "CTR"],
    modelAnswer: "① CBC (Cipher Block Chaining) 모드 / ② CTR (Counter) 모드",
    options: [
      "① CBC 모드 / ② CTR 모드",
      "① ECB 모드 / ② OFB 모드",
      "① CFB 모드 / ② ECB 모드",
      "① OFB 모드 / ② CBC 모드"
    ],
    answer: 0,
    explanation: "수식 `C_i = E_K(P_i ⊕ C_{i-1})`는 이전 암호문 블록을 체이닝하는 **CBC 모드**이며, `E_K(Counter)`와 평문을 XOR하는 것은 **CTR(Counter) 모드**입니다.",
    keyPoint: "실기 수식 판독: P_i ⊕ C_{i-1} 후 E_K = CBC / P_i ⊕ E_K(C_{i-1}) = CFB / P_i ⊕ O_i (O_i = E_K(O_{i-1})) = OFB / P_i ⊕ E_K(Counter) = CTR"
  },
  {
    id: "P402",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 4,
    year: "2025년 1회 실기기출",
    difficulty: "중",
    tags: ["접근통제 모델", "BLP", "Biba"],
    question: "[단답형] 강제적 접근통제(MAC) 모델 중 ① 군사 환경의 '기밀성' 보장을 목적으로 'No Read Up, No Write Down(*-보안 속성)' 규칙을 적용하는 모델과, ② '무결성' 보장을 목적으로 'No Read Down, No Write Up' 규칙을 적용하는 모델의 명칭을 순서대로 쓰시오.",
    codeSnippet: `모델 ①: 기밀성 중심 (Simple Security: No Read Up / *-Property: No Write Down)
모델 ②: 무결성 중심 (Simple Integrity: No Read Down / *-Integrity: No Write Up)`,
    acceptedKeywords: ["BLP", "벨-라파둘라", "Bell-LaPadula", "Biba", "비바"],
    modelAnswer: "① BLP (Bell-LaPadula, 벨-라파둘라) 모델 / ② Biba (비바) 모델",
    options: [
      "① BLP (Bell-LaPadula) 모델 / ② Biba (비바) 모델",
      "① Biba 모델 / ② Clark-Wilson 모델",
      "① Chinese Wall 모델 / ② BLP 모델",
      "① Clark-Wilson 모델 / ② RBAC 모델"
    ],
    answer: 0,
    explanation: "기밀성(No Read Up, No Write Down)은 **BLP(벨-라파둘라)** 모델이고, 무결성(No Read Down, No Write Up)은 **Biba(비바)** 모델입니다.",
    keyPoint: "실기 단답형: 기밀성(No Read Up / No Write Down) = BLP | 무결성(No Read Down / No Write Up) = Biba | 상업용 트랜잭션 무결성(TP/CDI) = Clark-Wilson"
  },
  {
    id: "P403",
    examType: "practical",
    pCategory: "실무/작업형",
    subjectId: 4,
    year: "2024년 2회 실기기출",
    difficulty: "중",
    tags: ["RSA", "계산문제", "암호화", "복호화"],
    question: "[실무/계산형] RSA 암호 시스템에서 두 소수 p = 5, q = 11 이고 공개키 e = 3 일 때, ① 오일러 피 함수 φ(n)의 값과 ② 최소 양의 정수인 개인키 d의 값을 구하는 풀이 과정과 답을 쓰시오.",
    codeSnippet: `n = p × q = 5 × 11 = 55
① φ(n) = (p - 1)(q - 1) = ?
② (e × d) mod φ(n) = 1 을 만족하는 최소 자연수 d = ?`,
    acceptedKeywords: ["40", "27"],
    modelAnswer: "① φ(n) = 40 / ② 개인키 d = 27 (풀이: 3 × 27 = 81 = 40 × 2 + 1 이므로 81 mod 40 = 1)",
    options: [
      "① φ(n) = 40 / ② 개인키 d = 27",
      "① φ(n) = 55 / ② 개인키 d = 13",
      "① φ(n) = 40 / ② 개인키 d = 7",
      "① φ(n) = 44 / ② 개인키 d = 15"
    ],
    answer: 0,
    explanation: "1) $\\phi(n) = (5-1) \\times (11-1) = 4 \\times 10 = 40$. 2) $3 \\times d \\equiv 1 \\pmod{40}$을 만족하는 $d$를 찾으면 $40 \\times 2 + 1 = 81$이 3의 배수이므로 $d = 81 / 3 = 27$입니다.",
    keyPoint: "RSA 실기 계산 팁: d를 구할 때는 φ(n)×k + 1 (즉 41, 81, 121...) 중에서 e(3)로 나누어떨어지는 수를 찾으면 3초 만에 계산 가능! (81 ÷ 3 = 27)"
  },
  {
    id: "P404",
    examType: "practical",
    pCategory: "서술형",
    subjectId: 4,
    year: "2023년 2회 실기기출",
    difficulty: "중",
    tags: ["Diffie-Hellman", "중간자 공격", "MITM", "STS"],
    question: "[서술형] 디피-헬만(Diffie-Hellman) 키 교환 알고리즘이 중간자 공격(MITM: Man-In-The-Middle Attack)에 취약한 근본적인 이유와 이를 보완하기 위한 보안 대책 2가지를 서술하시오.",
    codeSnippet: `Alice ──(g^a mod p)──> [공격자 Mallory] ──(g^m mod p)──> Bob`,
    acceptedKeywords: ["인증", "전자서명", "인증서", "PKI", "STS"],
    modelAnswer: "1) 취약한 이유: 통신 상대방의 신원을 확인하는 '개체 인증(Authentication)' 기능이 내장되어 있지 않기 때문이다.\n2) 보안 대책: ① 공개키 인증서(PKI) 및 전자서명을 결합하여 교환되는 매개변수의 무결성과 상대방 신원을 검증한다. ② STS(Station-to-Station) 프로토콜이나 패스워드 기반 키 교환(EKE/SPEKE)을 적용한다.",
    options: [
      "이유: 통신 주체에 대한 인증(Authentication) 기능이 없음 / 대책: ① 전자서명 및 공개키 인증서(PKI) 적용 ② STS(Station-to-Station) 프로토콜 적용",
      "이유: 키 길이가 56비트로 너무 짧음 / 대책: ① ECB 모드 적용 ② CRC-32 체크섬 추가",
      "이유: 소인수분해 난제가 이미 해독됨 / 대책: ① WEP 프로토콜 적용 ② 평문 전송",
      "이유: 해시 충돌이 발생함 / 대책: ① 솔트(Salt) 제거 ② MD5 알고리즘 사용"
    ],
    answer: 0,
    explanation: "Diffie-Hellman 키 교환은 이산대수 난제에 기반해 도청자(Eavesdropper)는 키를 알 수 없지만, 상대방을 인증하는 메커니즘이 없어 능동적 공격자인 중간자(MITM)가 양쪽과 각각 키를 맺으면 탐지할 수 없습니다. 전자서명/인증서(STS 프로토콜)를 결합해 해결합니다.",
    keyPoint: "실기 서술형: Diffie-Hellman의 취약점 = '상대방 인증 기능 부재로 중간자 공격(MITM)에 취약' → 대책 = '전자서명/공개키 인증서 결합(STS 프로토콜)'"
  },

  // ================= 5과목: 정보보안 관리 및 법규 실기 =================
  {
    id: "P501",
    examType: "practical",
    pCategory: "실무/작업형",
    subjectId: 5,
    year: "2026년 1회 실기기출",
    difficulty: "중",
    tags: ["정량적 위험분석", "SLE", "ALE", "ROI", "계산문제"],
    question: "[실무/계산형] 가치가 5억 원(AV)인 데이터베이스 서버가 랜섬웨어 공격을 받을 경우 자산의 40%(EF = 0.4)가 손실되며, 이 공격은 4년에 1회(ARO = 0.25) 발생한다고 한다. ① 단일예상손실(SLE)과 ② 연간예상손실(ALE)을 계산하시오.",
    codeSnippet: `자산가치(AV) = 500,000,000원 (5억 원)
노출계수(EF) = 40% (0.4)
연간발생률(ARO) = 4년에 1회 (1/4 = 0.25)`,
    acceptedKeywords: ["2억", "5천만", "5,000만", "200,000,000", "50,000,000"],
    modelAnswer: "① 단일예상손실(SLE) = 5억 원 × 0.4 = 2억 원\n② 연간예상손실(ALE) = 2억 원 × 0.25 = 5,000만 원",
    options: [
      "① SLE: 2억 원 / ② ALE: 5,000만 원",
      "① SLE: 1억 원 / ② ALE: 2,500만 원",
      "① SLE: 2억 원 / ② ALE: 8억 원",
      "① SLE: 5,000만 원 / ② ALE: 2억 원"
    ],
    answer: 0,
    explanation: "1) $SLE = AV \\times EF = 5\\text{억 원} \\times 0.4 = 2\\text{억 원}$. 2) $ALE = SLE \\times ARO = 2\\text{억 원} \\times 0.25 = 5,000\\text{만 원}$입니다.",
    keyPoint: "실기 정량적 위험 계산: SLE = AV × EF, ALE = SLE × ARO | 정보보호 대책의 투자가치(효과) = (대책 적용 전 ALE) - (대책 적용 후 ALE) - (보안 대책 연간 유지비용 ACS)"
  },
  {
    id: "P502",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 5,
    year: "2025년 2회 실기기출",
    difficulty: "중",
    tags: ["개인정보 보호법", "유출 통지", "72시간", "침해사고 신고"],
    question: "[단답형] ① 개정 「개인정보 보호법」에 따라 개인정보처리자가 개인정보 유출 사실을 알게 되었을 때 정보주체 통지 및 개인정보보호위원회(또는 KISA)에 신고해야 하는 법정 기한과, ② 「정보통신망법」에 따라 정보통신서비스 제공자가 침해사고 발생을 알게 되었을 때 과기정통부장관(또는 KISA)에 신고해야 하는 법정 기한을 각각 몇 시간 이내인지 쓰시오.",
    codeSnippet: `① 개인정보 보호법상 개인정보 유출 통지·신고 기한: 알게 된 때부터 (   ㉠   )시간 이내
② 정보통신망법상 침해사고 신고 기한: 알게 된 때부터 (   ㉡   )시간 이내`,
    acceptedKeywords: ["72", "24", "72시간", "24시간"],
    modelAnswer: "㉠ 72시간 이내 / ㉡ 24시간 이내",
    options: [
      "㉠ 72시간 이내 / ㉡ 24시간 이내",
      "㉠ 24시간 이내 / ㉡ 72시간 이내",
      "㉠ 5일 이내 / ㉡ 7일 이내",
      "㉠ 48시간 이내 / ㉡ 12시간 이내"
    ],
    answer: 0,
    explanation: "개정 개인정보 보호법상 유출 통지 및 신고 기한은 알게 된 때부터 **72시간 이내**이며, 정보통신망법상 침해사고 신고 기한은 알게 된 때부터 **24시간 이내**입니다. 두 숫자를 함께 묻는 실기 단답형 빈출 문제입니다.",
    keyPoint: "실기 법규 빈칸 1순위: 개인정보 유출 통지·신고 = 72시간 이내 / 정보통신망법 침해사고 신고 = 24시간 이내"
  },
  {
    id: "P503",
    examType: "practical",
    pCategory: "단답형",
    subjectId: 5,
    year: "2024년 1회 실기기출",
    difficulty: "중",
    tags: ["안전성 확보조치", "접속기록 보관", "1년", "2년", "월 1회"],
    question: "[단답형] 「개인정보의 안전성 확보조치 기준」에 따라 개인정보처리자는 개인정보취급자의 접속기록을 최소 ( ㉠ )년 이상 보관해야 하며, 5만 명 이상의 정보주체에 관하여 개인정보를 처리하거나 고유식별정보·민감정보를 처리하는 시스템의 경우에는 최소 ( ㉡ )년 이상 보관해야 한다. 또한 접속기록의 위·변조 및 유출 여부를 ( ㉢ )에 1회 이상 점검하여야 한다.",
    codeSnippet: `일반 접속기록 보관: 최소 ( ㉠ )년 이상
5만명↑ 또는 고유식별·민감정보 처리시스템 접속기록 보관: 최소 ( ㉡ )년 이상
접속기록 점검 주기: ( ㉢ ) 1회 이상`,
    acceptedKeywords: ["1년", "2년", "월"],
    modelAnswer: "㉠ 1(년) / ㉡ 2(년) / ㉢ 월(매월)",
    options: [
      "㉠ 1년 / ㉡ 2년 / ㉢ 월(매월)",
      "㉠ 6개월 / ㉡ 1년 / ㉢ 분기",
      "㉠ 2년 / ㉡ 5년 / ㉢ 반기",
      "㉠ 3년 / ㉡ 5년 / ㉢ 연"
    ],
    answer: 0,
    explanation: "개인정보의 안전성 확보조치 기준 제8조(접속기록의 보관 및 점검)에 따라 일반 보관 기간은 **1년 이상**, 5만 명 이상 또는 고유식별정보·민감정보 처리 시 **2년 이상** 보관해야 하며, **월 1회 이상** 점검해야 합니다.",
    keyPoint: "안전성 확보조치 접속기록 빈칸 공식: 기본 1년 이상 / 5만명↑·고유식별·민감정보는 2년 이상 / 점검 주기는 월 1회 이상"
  },
  {
    id: "P504",
    examType: "practical",
    pCategory: "서술형",
    subjectId: 5,
    year: "2023년 3회 실기기출",
    difficulty: "중",
    tags: ["BCP", "RTO", "RPO", "미러사이트"],
    question: "[서술형] 업무연속성계획(BCP) 수립을 위한 업무영향분석(BIA)에서 산출하는 두 가지 핵심 복구 지표인 'RTO'와 'RPO'의 의미를 각각 구분하여 서술하고, RTO가 거의 0에 가까운 실시간 동기화 재해복구센터의 명칭을 쓰시오.",
    codeSnippet: `지표 1: RTO (Recovery Time Objective)
지표 2: RPO (Recovery Point Objective)
RTO ≈ 0 인 Active-Active 복구센터: (       ?       )`,
    acceptedKeywords: ["복구 목표 시간", "복구 목표 시점", "미러 사이트", "Mirror Site"],
    modelAnswer: "1) RTO(복구 목표 시간): 재해나 장애 발생 시점으로부터 업무 및 시스템이 정상으로 복구될 때까지 걸리는 목표 시간\n2) RPO(복구 목표 시점): 재해 발생 시 데이터 손실을 감수할 수 있는 과거 백업 기준 목표 시점\n3) 재해복구센터 유형: 미러 사이트 (Mirror Site)",
    options: [
      "RTO: 중단 후 정상 복구까지 목표 시간 / RPO: 데이터 손실 허용 기준 목표 시점 / 복구센터: 미러 사이트(Mirror Site)",
      "RTO: 데이터 백업 시점 / RPO: 장애 평균 간격 / 복구센터: 콜드 사이트(Cold Site)",
      "RTO: 연간 예상 손실액 / RPO: 단일 예상 손실액 / 복구센터: 웜 사이트(Warm Site)",
      "RTO: 평균 수리 시간 / RPO: 평균 고장 시간 / 복구센터: 핫 사이트(Hot Site)"
    ],
    answer: 0,
    explanation: "실기 단답형 및 서술형 단골 문제입니다. RTO(Time = 얼마나 빨리 복구할 것인가)와 RPO(Point = 어느 시점의 데이터까지 손실 없이 복구할 것인가), 그리고 Active-Active 실시간 동기화 센터인 미러 사이트(Mirror Site)를 명확히 서술해야 합니다.",
    keyPoint: "BCP 실기 서술 핵심: RTO(복구 목표 시간) vs RPO(복구 목표 시점) / DR센터: 미러 사이트(Active-Active, RTO≈0) > 핫 사이트(Active-Standby, 수시간) > 웜 사이트(수일) > 콜드 사이트(수주)"
  }
];

// 실기 전용 과목별 비주얼 요약본 데이터 (단답형·서술형·실무작업형 공략집)
window.PRACTICAL_SUBJECT_SUMMARIES = {
  1: {
    title: "1과목 [실기]: 시스템 보안 실무·서술형 공략 노트",
    examWeight: "실기 3~4문항 출제 (단답형 3점 · 서술/작업형 6점)",
    overview: "실기 1과목은 리눅스 PAM 설정 빈칸 채우기, find/chmod/umask 명령어 작성, Apache(httpd.conf) 보안 설정 수정 서술형에서 90% 출제됩니다.",
    sections: [
      {
        id: "ps1-1",
        topic: "1. [작업형 1순위] 리눅스 PAM 모듈 & 주요 설정 파일 빈칸 완벽 정리",
        importance: "★★★ 실기 빈칸 채우기 1순위",
        summary: "실기 시험지에는 설정 파일 코드가 주어지고 괄호 ( ㉠ ), ( ㉡ ) 안에 들어갈 모듈명과 옵션 철자를 정확히 적어야 합니다.",
        table: {
          headers: ["보안 목적", "설정 파일 경로", "실기 답안 작성용 핵심 구문 (철자 주의!)", "옵션 세부 설명"],
          rows: [
            ["로그인 실패 시 계정 잠금", "/etc/pam.d/system-auth\n(또는 password-auth)", "auth required pam_tally2.so deny=5 unlock_time=600 no_magic_root", "deny=실패허용횟수, unlock_time=잠금초(600초=10분), RHEL8+는 pam_faillock.so"],
            ["패스워드 복잡도 강제", "/etc/pam.d/system-auth", "password requisite pam_pwquality.so retry=3 minlen=8 lcredit=-1 ucredit=-1 dcredit=-1 ocredit=-1", " 구버전은 pam_cracklib.so / -1은 최소 1자 이상 필수 포함을 의미"],
            ["root 원격 직접 접속 차단", "/etc/pam.d/login\n/etc/ssh/sshd_config", "auth required pam_securetty.so\nPermitRootLogin no", "/etc/securetty에 pts/x 제거 및 sshd_config에서 root 직접 로그인 금지"],
            ["su 명령어 사용 그룹 제한", "/etc/pam.d/su", "auth required pam_wheel.so use_uid", "wheel 그룹에 속한 사용자만 su 명령어로 root 전환 허용"],
            ["root 소유 SetUID 파일 탐색", "리눅스 쉘 명령어", "find / -user root -perm -4000 -type f -exec ls -l {} \\;", "-perm -4000(SetUID), -perm -2000(SetGID), -perm -1000(Sticky Bit)"]
          ]
        },
        bullets: [
          "**Apache `httpd.conf` 실기 서술형 4대 수정 공식**: ① 버전 정보 숨김: `ServerTokens Prod`, `ServerSignature Off` ② 디렉터리 리스팅 차단: `Options -Indexes` ③ 심볼릭 링크 차단: `Options -FollowSymLinks` ④ 불필요한 HTTP 메소드(PUT/DELETE/TRACE) 제한: `<LimitExcept GET POST> Require all denied </LimitExcept>` 및 `TraceEnable Off`"
        ],
        trap: "⚠️ 실기 채점 주의: PAM 패스워드 복잡도에서 크레딧 값을 양수(+1)가 아닌 음수(-1)로 적어야 '최소 1개 이상 필수 강제'가 됩니다(`lcredit=-1 ucredit=-1 dcredit=-1 ocredit=-1`)."
      }
    ]
  },
  2: {
    title: "2과목 [실기]: 네트워크 보안 Snort 룰 · 로그 분석 노트",
    examWeight: "실기 4~5문항 출제 (배점 가장 높음! 6점짜리 작업형 다수)",
    overview: "실기 2과목은 Snort Rule 직접 작성(빈칸 채우기), iptables 방화벽 명령어 작성, tcpdump/Wireshark 패킷 로그를 보고 공격명과 대응책 서술하기가 핵심입니다.",
    sections: [
      {
        id: "ps2-1",
        topic: "1. [실기 6점 보장] Snort IDS/IPS 룰 작성 및 iptables 명령어 치트시트",
        importance: "★★★ 실기 매회 출제",
        summary: "공격 시나리오(SYN Flooding, Land Attack, Ping of Death, Slowloris, SQLi 탐지)에 맞는 Snort 옵션과 iptables 명령어를 그대로 외워두세요.",
        table: {
          headers: ["탐지/차단 시나리오", "실기 답안 작성용 Snort Rule / iptables 구문", "핵심 채점 포인트"],
          rows: [
            ["SYN Flooding 탐지\n(Snort Rule)", "alert tcp any any -> $HOME_NET 80 (msg:\"SYN Flood\"; flags:S; threshold: type both, track by_src, count 10, seconds 1; sid:10001;)", "flags:S (SYN만 켜짐) + type both (임계치 도달 시 1번만 경고) + track by_src"],
            ["Land Attack 탐지\n(Snort Rule)", "alert ip any any -> any any (msg:\"Land Attack\"; sameip; sid:10002;)", "출발지 IP와 목적지 IP가 동일한 패킷 탐지 옵션 = sameip;"],
            ["절대/상대 위치 문자열 매칭\n(Snort Rule)", "content:\"GET\"; offset:0; depth:3; content:\"HTTP/1.1\"; distance:1; within:20;", "절대 위치: offset + depth / 이전 매칭 기준 상대 위치: distance + within"],
            ["특정 IP/포트 차단\n(iptables)", "iptables -A INPUT -p tcp -s 203.0.113.5 --dport 80 -j DROP", "-A INPUT(유입 패킷), -s(출발지), --dport(목적지 포트), -j DROP(무응답 폐기)"],
            ["SYN Cookie 활성화\n(리눅스 커널)", "sysctl -w net.ipv4.tcp_syncookies=1\n(또는 echo 1 > /proc/sys/net/ipv4/tcp_syncookies)", "SYN Backlog 큐 고갈을 막기 위한 리눅스 커널 파라미터 설정"]
          ]
        },
        bullets: [
          "**서술형 공격 대응책 3단 답안 템플릿**: ① **ARP Spoofing 대책**: 중요 서버 정적 ARP 테이블 등록(`arp -s IP MAC`) 및 스위치 DAI(Dynamic ARP Inspection) 적용 ② **Smurf 대책**: 라우터에서 Directed Broadcast 비활성화(`no ip directed-broadcast`) 및 호스트의 브로드캐스트 ICMP 응답 차단 ③ **DRDoS 대책**: 네트워크 경계 라우터에서 출발지 IP 위조 패킷을 차단하는 **Ingress Filtering(BCP 38)** 적용 및 반사 서버의 증폭 기능(NTP monlist, DNS Open Resolver) 비활성화"
        ],
        trap: "⚠️ 실기 채점 주의: Snort threshold 옵션에서 'N개 이상 발생 시 1번만 알림'은 `type both`이고, '처음 N개까지만 알림'은 `type limit`, 'N개마다 알림'은 `type threshold`입니다!"
      }
    ]
  },
  3: {
    title: "3과목 [실기]: 웹 로그 분석 & 시큐어 코딩 서술형 노트",
    examWeight: "실기 4~5문항 출제 (Java/PHP 시큐어코딩 수정 및 웹 공격 서술형)",
    overview: "웹 서버 access.log를 보고 어떤 공격(Blind SQLi, XSS, CSRF, SSRF, Directory Traversal, 웹셸)인지 판별하고, 시큐어 코딩 대책 3가지를 서술하는 문제가 출제됩니다.",
    sections: [
      {
        id: "ps3-1",
        topic: "1. [서술형 만점 템플릿] 5대 웹 취약점별 시큐어 코딩 모범 답안",
        importance: "★★★ 서술형 6점 단골",
        summary: "실기 서술형에서는 아래 표의 '모범 답안 키워드 3가지'를 번호를 매겨 작성하면 만점을 받습니다.",
        table: {
          headers: ["웹 취약점", "웹 로그 / 코드 식별 단서", "실기 서술형 만점 모범 답안 (3가지씩 암기!)"],
          rows: [
            ["SQL Injection\n(Blind / Union)", "SELECT, UNION, SUBSTRING, ASCII(...)>100, SLEEP(5), ' OR '1'='1", "① PreparedStatement(매개변수화된 쿼리, 바인딩 변수 ?) 사용\n② 테이블명·컬럼명·ORDER BY 절 등 바인딩 불가 항목은 화이트리스트 검증\n③ DB 에러 메시지 외부 노출 차단 및 웹 방화벽(WAF) 운영"],
            ["XSS\n(크로스 사이트 스크립팅)", "<script>, onerror=, onload=, javascript:, document.cookie", "① 사용자 입·출력값에 대해 HTML Entity 치환(< → &lt;, > → &gt; 등) 적용\n② 세션 쿠키에 HttpOnly 속성을 설정하여 자바스크립트 접근 차단\n③ CSP(Content-Security-Policy) 헤더를 설정하여 외부 스크립트 실행 제한"],
            ["CSRF\n(크로스 사이트 요청 위조)", "관리자 페이지 URL이 <img src=...> 또는 자동 제출 <form>에 포함됨", "① 세션 기반의 예측 불가능한 난수 CSRF Token 생성 및 서버 측 검증\n② 중요 정보 변경 시 현재 비밀번호 입력 또는 CAPTCHA를 통한 재인증 요구\n③ HTTP Referer 헤더 검증 및 SameSite 쿠키 속성 적용"],
            ["파일 업로드\n(Web Shell)", "Content-Disposition: filename=\"cmd.jsp\" + Content-Type: image/jpeg", "① 업로드 허용 확장자를 화이트리스트 방식으로 제한하고 파일 시그니처 검증\n② 파일이 저장되는 업로드 디렉터리의 스크립트 실행 권한(x) 제거\n③ 저장 파일명을 난수화하고 웹 루트(DocumentRoot) 외부 디렉터리에 저장"],
            ["경로 조작\n(Path Traversal)", "download.jsp?file=../../../../etc/passwd (%2e%2e%2f)", "① 외부 입력 파일명에서 경로 순회 문자(../, ..\\, /, \\, %00) 필터링·제거\n② 실제 파일명 대신 DB에 매핑된 파일 인덱스 번호(ID)를 파라미터로 사용\n③ 다운로드 허용 기준 디렉터리 내부 경로인지 정규화(Canonicalization) 검증"]
          ]
        },
        bullets: [
          "**이메일 보안 DNS TXT 레코드 3종 단답형**: 발송 서버 IP 등록 = **SPF** / 발신 서버 개인키 전자서명 + DNS 공개키 검증 = **DKIM** / SPF+DKIM 실패 시 격리·거부 정책 및 리포팅 = **DMARC**"
        ],
        trap: "⚠️ 실기 채점 주의: 서술형에서 XSS 대책과 CSRF 대책을 섞어 쓰면 감점됩니다! 'HTML 엔티티 치환, HttpOnly'는 XSS 대책이고, 'CSRF 토큰, 재인증(CAPTCHA), Referer 검증'은 CSRF 대책입니다."
      }
    ]
  },
  4: {
    title: "4과목 [실기]: 암호학 수식·계산 및 접근통제 단답형 노트",
    examWeight: "실기 2~3문항 출제 (단답형 및 RSA 계산 문제)",
    overview: "블록암호 운용모드 블록도/수식 판별, RSA 개인키 d 계산, 해시 충돌 저항성, 접근통제 모델(BLP/Biba), PKI(OCSP/CRL)가 단답형으로 출제됩니다.",
    sections: [
      {
        id: "ps4-1",
        topic: "1. [단답형 & 계산형] 암호학·접근통제 실기 핵심 공식 요약",
        importance: "★★★ 단답형 고득점",
        summary: "수식이나 블록 다이어그램을 보고 즉시 알고리즘/모드 명칭을 적을 수 있어야 합니다.",
        table: {
          headers: ["출제 주제", "실기 시험 제시 힌트 / 수식", "작성해야 할 정확한 정답 키워드"],
          rows: [
            ["RSA 키 생성 및 암·복호화 계산", "p, q 주어짐 → n = p×q, φ(n) = (p-1)(q-1)\n(e × d) mod φ(n) = 1", "암호화: C = M^e mod n\n복호화: M = C^d mod n"],
            ["블록암호 운용모드 판독", "CBC: C_i = E_K(P_i ⊕ C_{i-1})\nCFB: C_i = P_i ⊕ E_K(C_{i-1})\nCTR: C_i = P_i ⊕ E_K(Counter)", "병렬 암호화 가능: ECB, CTR\n병렬 복호화 가능: ECB, CBC, CFB, CTR\n복호화 시 암호화(E) 함수 사용: CFB, OFB, CTR"],
            ["메시지 인증 vs 전자서명", "대칭키 공유 기반 무결성+인증(부인방지X) vs 비대칭키 기반 무결성+인증+부인방지O", "MAC (HMAC, CMAC) vs 전자서명 (Digital Signature)"],
            ["특수 전자서명 구분", "내용 모른 채 서명(완전 익명) vs 그룹 관리자만 신원 추적 가능 vs 서명자 협조 시에만 검증", "은닉 서명(Blind) vs 그룹 서명(Group) vs 부인방지 서명(Undeniable)"],
            ["접근통제 보안 모델", "기밀성(No Read Up, No Write Down) vs 무결성(No Read Down, No Write Up)", "BLP (Bell-LaPadula) 모델 vs Biba (비바) 모델"]
          ]
        }
      }
    ]
  },
  5: {
    title: "5과목 [실기]: 법규 빈칸 숫자 · ISMS-P · 위험관리 계산 노트",
    examWeight: "실기 3~4문항 출제 (법조문 빈칸 채우기 및 SLE/ALE 계산)",
    overview: "법조문 원문을 그대로 제시하고 괄호 안에 들어갈 숫자(72시간, 24시간, 1년/2년, 월 1회, 10자리/8자리)를 적는 문제와 SLE/ALE 계산 문제가 매회 출제됩니다.",
    sections: [
      {
        id: "ps5-1",
        topic: "1. [법조문 빈칸 완벽 대비] 실기 시험장 직전 법규·관리 필수 답안표",
        importance: "★★★ 실기 무조건 2~3문제 출제",
        summary: "실기에서 법규는 숫자와 단위를 정확히 적으면 100% 점수를 주는 효자 파트입니다.",
        table: {
          headers: ["관련 법규 / 제도", "실기 빈칸 출제 문장", "정확한 실기 답안"],
          rows: [
            ["개인정보 보호법\n(유출 통지 및 신고)", "개인정보가 유출되었음을 알게 된 때부터 ( ㉠ ) 이내에 정보주체에게 통지하고 개인정보보호위원회 또는 ( ㉡ )에 신고해야 한다.", "㉠ 72시간 / ㉡ 한국인터넷진흥원 (KISA)"],
            ["정보통신망법\n(침해사고 신고)", "정보통신서비스 제공자는 침해사고가 발생한 것을 알게 된 때부터 ( ㉠ ) 이내에 과학기술정보통신부장관 또는 KISA에 신고해야 한다.", "㉠ 24시간"],
            ["개인정보의 안전성 확보조치 기준\n(접속기록 보관 및 점검)", "접속기록은 최소 ( ㉠ ) 이상 보관하며, 5만명 이상 또는 고유식별·민감정보 처리 시 ( ㉡ ) 이상 보관하고, ( ㉢ ) 1회 이상 점검해야 한다.", "㉠ 1년 / ㉡ 2년 / ㉢ 월(매월)"],
            ["개인정보의 안전성 확보조치 기준\n(비밀번호 암호화 및 길이)", "비밀번호는 복호화되지 아니하도록 ( ㉠ ) 암호화하여 저장하며, 2종류 이상 조합 시 최소 ( ㉡ )자리, 3종류 이상 조합 시 최소 ( ㉢ )자리 이상으로 구성한다.", "㉠ 일방향 (해시) / ㉡ 10 / ㉢ 8"],
            ["ISMS-P 인증 고시\n(유효기간 및 심사)", "인증 유효기간은 ( ㉠ )년이며, 매년 ( ㉡ )회 이상 사후심사를 받고, 만료 ( ㉢ )개월 전까지 갱신심사를 신청해야 한다.", "㉠ 3 / ㉡ 1 / ㉢ 3"],
            ["정량적 위험분석 및 투자효과\n(계산 공식)", "단일예상손실(SLE) = 자산가치(AV) × 노출계수(EF)\n연간예상손실(ALE) = SLE × 연간발생률(ARO)", "보안대책 투자가치(ROI) = (적용 전 ALE - 적용 후 ALE) - 연간 대책비용(ACS)"]
          ]
        }
      }
    ]
  }
};
