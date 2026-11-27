// 망키시큐리티 (Mangkey Security) - 정보보안기사 & 정보처리기사 2027년 시험 일정 및 5과목 기출 데이터베이스

window.EXAM_SCHEDULE_2027 = {
  defaultTargetId: "2027_1_written",
  notice: "※ 한국산업인력공단(Q-Net) 국가기술자격 정기 기사 시험 일정 기준 (원하는 목표 회차를 클릭하면 상단 D-DAY가 자동 변경됩니다)",
  targets: [
    {
      id: "2027_1_written",
      title: "2027년 정기 기사 1회 필기",
      examName: "정보처리기사 / 정보보안기사 1회 필기",
      date: "2027-02-13",
      applyPeriod: "2027.01.18 ~ 01.21",
      examPeriod: "2027.02.13 ~ 03.05",
      resultDate: "2027.03.10"
    },
    {
      id: "2027_1_practical",
      title: "2027년 정기 기사 1회 실기",
      examName: "정보처리기사 / 정보보안기사 1회 실기",
      date: "2027-04-17",
      applyPeriod: "2027.03.22 ~ 03.25",
      examPeriod: "2027.04.17 ~ 05.05",
      resultDate: "2027.06.04"
    },
    {
      id: "2027_2_written",
      title: "2027년 정기 기사 2회 필기",
      examName: "정보처리기사 / 정보보안기사 2회 필기",
      date: "2027-05-09",
      applyPeriod: "2027.04.12 ~ 04.15",
      examPeriod: "2027.05.09 ~ 05.29",
      resultDate: "2027.06.09"
    },
    {
      id: "2027_2_practical",
      title: "2027년 정기 기사 2회 실기",
      examName: "정보처리기사 / 정보보안기사 2회 실기",
      date: "2027-07-17",
      applyPeriod: "2027.06.21 ~ 06.24",
      examPeriod: "2027.07.17 ~ 08.04",
      resultDate: "2027.09.03"
    },
    {
      id: "2027_3_written",
      title: "2027년 정기 기사 3회 필기",
      examName: "정보처리기사 / 정보보안기사 3회 필기",
      date: "2027-08-08",
      applyPeriod: "2027.07.05 ~ 07.08",
      examPeriod: "2027.08.08 ~ 08.28",
      resultDate: "2027.09.08"
    },
    {
      id: "2027_3_practical",
      title: "2027년 정기 기사 3회 실기",
      examName: "정보처리기사 / 정보보안기사 3회 실기",
      date: "2027-10-16",
      applyPeriod: "2027.09.13 ~ 09.16",
      examPeriod: "2027.10.16 ~ 11.03",
      resultDate: "2027.12.03"
    }
  ],
  fullTable: [
    {
      round: "2027년 정기 기사 제1회",
      certTypes: "정보처리기사 · 정보보안기사 공통",
      writtenApply: "2027.01.18(월) ~ 01.21(목)",
      writtenExam: "2027.02.13(토) ~ 03.05(금)",
      writtenResult: "2027.03.10(수)",
      practicalApply: "2027.03.22(월) ~ 03.25(목)",
      practicalExam: "2027.04.17(토) ~ 05.05(수)",
      finalResult: "2027.06.04(금)"
    },
    {
      round: "2027년 정기 기사 제2회",
      certTypes: "정보처리기사 · 정보보안기사 공통",
      writtenApply: "2027.04.12(월) ~ 04.15(목)",
      writtenExam: "2027.05.09(일) ~ 05.29(토)",
      writtenResult: "2027.06.09(수)",
      practicalApply: "2027.06.21(월) ~ 06.24(목)",
      practicalExam: "2027.07.17(토) ~ 08.04(수)",
      finalResult: "2027.09.03(금)"
    },
    {
      round: "2027년 정기 기사 제3회",
      certTypes: "정보처리기사 · 정보보안기사 공통",
      writtenApply: "2027.07.05(월) ~ 07.08(목)",
      writtenExam: "2027.08.08(일) ~ 08.28(토)",
      writtenResult: "2027.09.08(수)",
      practicalApply: "2027.09.13(월) ~ 09.16(목)",
      practicalExam: "2027.10.16(토) ~ 11.03(수)",
      finalResult: "2027.12.03(금)"
    }
  ]
};

window.INFOSEC_SUBJECTS = [
  {
    id: 1,
    name: "1과목: 시스템 보안",
    shortName: "시스템 보안",
    color: "#3b82f6",
    bgLight: "bg-blue-500/10",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    description: "운영체제(Linux/Windows), 메모리 보호기법, 버퍼 오버플로우, 접근통제, 로그 분석, 가상화 및 클라우드 시스템 보안"
  },
  {
    id: 2,
    name: "2과목: 네트워크 보안",
    shortName: "네트워크 보안",
    color: "#10b981",
    bgLight: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    description: "TCP/IP 프로토콜 취약점, DoS/DDoS 공격, 스니핑/스푸핑, 방화벽/IDS/IPS/VPN, 무선랜 보안(WPA2/WPA3)"
  },
  {
    id: 3,
    name: "3과목: 애플리케이션 보안",
    shortName: "애플리케이션 보안",
    color: "#f59e0b",
    bgLight: "bg-amber-500/10",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    description: "OWASP Top 10, 웹 취약점(XSS, CSRF, SQL Injection, SSRF), 데이터베이스 보안, 전자상거래·메일 보안, 시큐어 코딩"
  },
  {
    id: 4,
    name: "4과목: 정보보안 일반",
    shortName: "정보보안 일반",
    color: "#8b5cf6",
    bgLight: "bg-purple-500/10",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    description: "대칭키/비대칭키 암호알고리즘, 해시함수, 전자서명, PKI, 키 교환(Diffie-Hellman), 접근통제 모델(BLP, Biba, Clark-Wilson)"
  },
  {
    id: 5,
    name: "5과목: 정보보안 관리 및 법규",
    shortName: "보안 관리 및 법규",
    color: "#ec4899",
    bgLight: "bg-pink-500/10",
    textColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    description: "ISMS-P 인증제도, 위험관리(Risk Management), 업무연속성계획(BCP/DRP), 개인정보 보호법, 정보통신망법, 주요정보통신기반시설 보호법"
  }
];

window.INITIAL_QUESTIONS = [
  // ================= 1과목: 시스템 보안 =================
  {
    id: "Q101",
    subjectId: 1,
    year: "2026년 1회 기출유형",
    difficulty: "중",
    tags: ["리눅스 로그", "utmp", "wtmp", "btmp", "lastlog"],
    question: "리눅스(Linux) 시스템의 로그 파일과 이를 확인하는 명령어의 연결로 옳지 않은 것은?",
    options: [
      "/var/log/wtmp - last 명령어를 통해 성공한 로그인/로그아웃 및 시스템 재부팅 이력을 확인한다.",
      "/var/log/utmp - w, who, users 명령어를 통해 현재 로그인한 사용자 상태 정보를 확인한다.",
      "/var/log/btmp - lastb 명령어를 통해 실패한 로그인 시도 이력을 바이너리 형태로 기록·확인한다.",
      "/var/log/lastlog - 텍스트 형식의 파일로 cat이나 vi 명령어로 직접 열어 최근 접속 성공 시간을 확인한다."
    ],
    answer: 3,
    explanation: "/var/log/lastlog는 텍스트 파일이 아니라 바이너리(Binary) 파일이므로 cat이나 vi로 직접 읽을 수 없으며, `lastlog` 명령어를 사용하여 확인해야 합니다. wtmp, utmp, btmp, lastlog는 모두 바이너리 로그 파일입니다.",
    keyPoint: "리눅스 4대 바이너리 로그인 로그: utmp(현재 접속: who/w), wtmp(접속 및 재부팅 이력: last), btmp(실패한 로그인: lastb), lastlog(최근 로그인 시각: lastlog)"
  },
  {
    id: "Q102",
    subjectId: 1,
    year: "2023년 3회 기출유형",
    difficulty: "상",
    tags: ["메모리 보호기법", "ASLR", "DEP", "NX", "Stack Canary"],
    question: "버퍼 오버플로우(Buffer Overflow) 공격을 방어하기 위한 최신 운영체제의 메모리 보호 기법에 대한 설명으로 가장 적절하지 않은 것은?",
    options: [
      "Stack Guard(Canary)는 복귀 주소(RET) 앞에 특정 값을 삽입하여, 함수 반환 시 해당 값의 변조 여부를 검사한다.",
      "ASLR(Address Space Layout Randomization)은 실행 시마다 스택, 힙, 라이브러리의 메모리 주소를 난수화하여 공격자가 주소를 예측하기 어렵게 한다.",
      "DEP(Data Execution Prevention) / NX(No-eXecute)는 스택이나 힙 같은 데이터 영역에서 실행 코드가 실행되는 것을 차단한다.",
      "DEP/NX가 적용된 시스템에서는 RTL(Return-to-Libc)이나 ROP(Return Oriented Programming) 공격이 원천적으로 불가능하다."
    ],
    answer: 3,
    explanation: "DEP/NX는 스택이나 힙에 주입된 쉘코드가 직접 실행되는 것을 막아주지만, 이미 실행 권한이 있는 공유 라이브러리(libc)나 코드 영역의 가젯(Gadget)을 재활용하는 RTL(Return-to-Libc) 및 ROP(Return Oriented Programming) 공격은 우회가 가능합니다. 이를 방어하기 위해 ASLR 등을 함께 적용합니다.",
    keyPoint: "Stack Canary(RET 변조 탐지) → RTL로 우회 / DEP·NX(스택·힙 실행권한 제거) → RTL·ROP로 우회 / ASLR(메모리 주소 랜덤화)"
  },
  {
    id: "Q103",
    subjectId: 1,
    year: "2025년 1회 기출유형",
    difficulty: "중",
    tags: ["SetUID", "특수권한", "Sticky Bit", "umask"],
    question: "리눅스 파일 시스템에서 특수 권한(SetUID, SetGID, Sticky Bit)에 대한 설명으로 옳은 것은?",
    options: [
      "SetUID가 설정된 실행 파일은 실행되는 동안 파일을 실행한 사용자의 권한이 아니라 파일 소유자의 권한으로 동작한다.",
      "Sticky Bit가 설정된 디렉터리(/tmp 등)에서는 디렉터리 내의 모든 파일을 아무나 삭제할 수 있다.",
      "chmod 2755 file 명령은 file에 SetUID 권한을 부여하는 명령이다.",
      "SetUID가 설정되었으나 소유자에게 실행 권한(x)이 없는 경우 소문자 's'로 표시된다."
    ],
    answer: 0,
    explanation: "1) 옳음: SetUID(4000)는 실행 시 파일 소유자(주로 root) 권한으로 프로세스 유효 사용자 ID(EUID)가 변경됩니다. 2) Sticky Bit(1000)가 설정된 디렉터리는 파일 생성자(소유자)와 root만 삭제 가능합니다. 3) 2755는 SetGID 부여입니다(SetUID는 4755). 4) 실행 권한이 없을 때 특수 권한이 설정되면 대문자 'S' 또는 'T'로 표시됩니다.",
    keyPoint: "특수권한 8진수: SetUID=4, SetGID=2, Sticky Bit=1. 기존 실행권한(x)이 있으면 소문자(s, t), 없으면 대문자(S, T) 표시"
  },
  {
    id: "Q104",
    subjectId: 1,
    year: "2023년 2회 기출유형",
    difficulty: "중",
    tags: ["Windows 보안", "SAM", "SID", "레지스트리"],
    question: "Windows 운영체제 보안에서 사용자 및 그룹 계정의 패스워드 해시 정보를 저장하고 관리하는 데이터베이스 파일과 로컬 관리자(Administrator)의 RID(Relative ID) 값으로 올바르게 짝지어진 것은?",
    options: [
      "SAM (Security Accounts Manager) - RID 500",
      "NTDS.dit - RID 501",
      "LSA (Local Security Authority) - RID 1000",
      "SRM (Security Reference Monitor) - RID 0"
    ],
    answer: 0,
    explanation: "Windows 로컬 계정 및 해시(LM/NTLM)는 `%SystemRoot%\\System32\\config\\SAM` 파일에 저장됩니다. 또한 Windows SID 구조에서 끝자리 RID가 500번은 내장 Administrator, 501번은 Guest, 1000번 이상은 일반 사용자 계정입니다.",
    keyPoint: "Windows SAM 파일: 로컬 계정 패스워드 해시(NTLM) 저장. 주요 RID: Administrator(500), Guest(501), 일반계정(1000~)"
  },
  {
    id: "Q105",
    subjectId: 1,
    year: "2024년 1회 기출유형",
    difficulty: "하",
    tags: ["레이스 컨디션", "TOCTOU", "심볼릭 링크"],
    question: "검사 시점과 사용 시점의 차이(TOCTOU: Time-Of-Check to Time-Of-Use)를 악용하여 임시 파일이나 심볼릭 링크를 통해 권한을 상승시키는 시스템 공격 기법은?",
    options: [
      "포맷 스트링 공격 (Format String Attack)",
      "레이스 컨디션 공격 (Race Condition Attack)",
      "힙 스프레이 공격 (Heap Spray Attack)",
      "리버스 텔넷 공격 (Reverse Telnet Attack)"
    ],
    answer: 1,
    explanation: "레이스 컨디션(경쟁 조건, Race Condition)은 둘 이상의 프로세스가 공유 자원에 동시에 접근하거나, 자원의 상태를 확인하는 시점(Check)과 실제로 사용하는 시점(Use) 사이의 간격(TOCTOU)에 심볼릭 링크 등을 걸어 중요 파일을 변조하는 공격입니다.",
    keyPoint: "Race Condition 핵심 키워드: TOCTOU(Time-Of-Check to Time-Of-Use), 임시 파일, 심볼릭 링크(Symlink)"
  },
  {
    id: "Q106",
    subjectId: 1,
    year: "2022년 3회 기출유형",
    difficulty: "중",
    tags: ["PAM", "리눅스 계정잠금", "pam_tally2", "pam_faillock"],
    question: "리눅스 PAM(Pluggable Authentication Modules)에서 로그인 실패 횟수에 따라 계정을 일정 시간 잠금 처리할 때 사용하는 모듈과 거리가 먼 것은?",
    options: [
      "pam_tally.so",
      "pam_tally2.so",
      "pam_faillock.so",
      "pam_limits.so"
    ],
    answer: 3,
    explanation: "pam_tally.so, pam_tally2.so, pam_faillock.so(RHEL 8 이상)는 로그인 실패 임계치 설정 및 계정 잠금에 사용되는 PAM 모듈입니다. 반면 pam_limits.so는 사용자/그룹별 시스템 자원(프로세스 수, 메모리, 오픈 파일 수 등)의 한계를 제어하는 모듈입니다.",
    keyPoint: "로그인 실패 잠금: pam_tally2.so / pam_faillock.so (deny=N unlock_time=초) | 패스워드 복잡도: pam_cracklib.so / pam_pwquality.so"
  },

  // ================= 2과목: 네트워크 보안 =================
  {
    id: "Q201",
    subjectId: 2,
    year: "2026년 1회 기출유형",
    difficulty: "중",
    tags: ["DDoS", "Slowloris", "RUDY", "HTTP GET Flooding"],
    question: "다음 중 웹 서버의 가용성을 침해하는 애플리케이션 계층(L7) DDoS 공격 기법과 그 특징의 연결로 옳지 않은 것은?",
    options: [
      "Slowloris (Slow HTTP Header DoS) - HTTP 헤더의 끝을 알리는 개행문자(\\r\\n\\r\\n)를 보내지 않고 연결을 장시간 유지하여 웹 서버의 연결 자원을 고갈시킨다.",
      "RUDY (R-U-Dead-Yet) - HTTP POST 요청의 Content-Length를 매우 크게 설정한 뒤 데이터를 극소량씩 분할 전송하여 세션을 유지시킨다.",
      "Slow Read Attack - TCP Window Size를 0 또는 매우 작게 설정하여 웹 서버가 응답 데이터를 다 보내지 못하고 연결을 유지하게 만든다.",
      "SYN Flooding - 정상적인 3-Way Handshaking을 완료한 뒤 대량의 HTTP GET 요청을 보내 캐시 서버의 DB 조회를 유발한다."
    ],
    answer: 3,
    explanation: "SYN Flooding은 L4(전송 계층) 공격으로, 클라이언트가 SYN 패킷만 대량 전송하고 ACK를 보내지 않아 서버의 SYN Backlog Queue를 고갈시키는 공격입니다(3-Way Handshaking을 완료하지 않음). 3-Way Handshaking 완료 후 캐시 우회 GET 요청을 대량 전송하는 것은 HTTP GET Flooding with Cache-Control(CC Attack)입니다.",
    keyPoint: "L7 Slow DDoS 3총사: Slowloris(Header 미완성, \\r\\n\\r\\n 누락), RUDY(POST Body 지연 전송), Slow Read(TCP Window Size 축소)"
  },
  {
    id: "Q202",
    subjectId: 2,
    year: "2025년 1회 기출유형",
    difficulty: "중",
    tags: ["IPSec", "AH", "ESP", "전송모드", "터널모드"],
    question: "네트워크 계층(L3) 보안 프로토콜인 IPSec(IP Security)에 대한 설명으로 옳지 않은 것은?",
    options: [
      "AH(Authentication Header) 프로토콜은 데이터 무결성과 발신지 인증, 재전송 공격 방지 기능을 제공하지만 기밀성(암호화)은 제공하지 않는다.",
      "ESP(Encapsulating Security Payload) 프로토콜은 암호화를 통한 기밀성뿐만 아니라 인증과 무결성 기능도 함께 제공할 수 있다.",
      "전송 모드(Transport Mode)는 IP 헤더를 포함한 전체 IP 패킷을 암호화하고 새로운 외부 IP 헤더를 캡슐화하므로 VPN 구간 게이트웨이 간 통신에 주로 쓰인다.",
      "IKE(Internet Key Exchange)는 보안 연관(SA: Security Association)을 협상하고 암호화 키를 안전하게 교환하기 위해 UDP 500번 포트를 사용한다."
    ],
    answer: 2,
    explanation: "전체 IP 패킷을 암호화하고 새로운 IP 헤더를 붙이는 방식은 '터널 모드(Tunnel Mode)'입니다. '전송 모드(Transport Mode)'는 원래의 IP 헤더는 그대로 두고 IP 페이로드(데이터 영역)만 보호하며, 종단 간(Host-to-Host) 보호에 주로 사용됩니다.",
    keyPoint: "IPSec 비교: AH(무결성+인증, 암호화X) vs ESP(암호화+무결성+인증) / 전송모드(페이로드만 보호, Host간) vs 터널모드(전체 IP 패킷 캡슐화, Gateway/VPN간)"
  },
  {
    id: "Q203",
    subjectId: 2,
    year: "2023년 3회 기출유형",
    difficulty: "중",
    tags: ["포트 스캐닝", "nmap", "TCP Half-Open", "FIN 스캔"],
    question: "Nmap을 이용한 포트 스캐닝 기법 중 스텔스 스캔(Stealth Scan)에 해당하는 'FIN 스캔, XMAS 스캔, NULL 스캔'의 공통적인 특징으로 옳은 것은?",
    options: [
      "포트가 열려(Open) 있으면 대상 서버로부터 RST+ACK 패킷이 반환된다.",
      "포트가 닫혀(Closed) 있으면 대상 서버로부터 RST(또는 RST+ACK) 패킷이 반환되고, 열려 있으면 응답이 없다.",
      "3-Way Handshaking을 끝까지 완료하므로 대상 시스템에 세션 로그가 남는다.",
      "Windows 운영체제에서 열린 포트와 닫힌 포트를 가장 정확하게 구분할 수 있다."
    ],
    answer: 1,
    explanation: "RFC 793 표준에 따라 FIN, XMAS(FIN+PSH+URG), NULL(플래그 없음) 스캔 시 포트가 열려 있으면 패킷을 무시(무응답)하고, 포트가 닫혀 있으면 RST(+ACK) 패킷을 응답합니다. 단, Windows 시스템은 RFC 793을 따르지 않고 열려 있든 닫혀 있든 모두 RST를 응답하므로 이 스캔 기법이 통하지 않습니다.",
    keyPoint: "스텔스 스캔(FIN/XMAS/NULL): Open → 무응답, Closed → RST 응답 (Windows에서는 구분 불가) | TCP Open/SYN(Half-open) 스캔: Open → SYN+ACK, Closed → RST+ACK"
  },
  {
    id: "Q204",
    subjectId: 2,
    year: "2023년 2회 기출유형",
    difficulty: "하",
    tags: ["ARP Spoofing", "스니핑", "DAI", "보안대책"],
    question: "로컬 네트워크(LAN) 환경에서 공격자가 자신의 MAC 주소를 게이트웨이의 IP 주소에 매핑하는 위조된 ARP Reply 패킷을 지속적으로 브로드캐스트하여 중간자 공격(MITM)을 수행하는 기법과 그 근본적인 예방 대책은?",
    options: [
      "ARP Spoofing - 정적(Static) ARP 테이블 설정(`arp -s`) 및 스위치의 DAI(Dynamic ARP Inspection) 기능 활성화",
      "DNS Spoofing - hosts 파일 읽기 전용 설정 및 DNSSEC 적용",
      "ICMP Redirect - 라우터에서 ICMP Redirect 메시지 수신 차단",
      "MAC Flooding - 스위치 포트 보안(Port Security) 설정으로 학습 가능한 MAC 주소 개수 제한"
    ],
    answer: 0,
    explanation: "ARP 요청 없이도 ARP 응답(Reply)을 보내면 캐시 테이블이 갱신되는 ARP 프로토콜의 무상태성(Stateless) 취약점을 이용한 공격은 ARP Spoofing(ARP Poisoning)입니다. 대책으로는 중요 서버의 Static ARP 등록(`arp -s IP MAC`) 및 L2 스위치의 DAI(Dynamic ARP Inspection) 적용이 있습니다.",
    keyPoint: "L2 공격 구분: MAC Flooding(CAM 테이블 가득 채워 더미허브화 → Port Security로 방어) vs ARP Spoofing(ARP 캐시 변조 MITM → Static ARP, DAI로 방어)"
  },
  {
    id: "Q205",
    subjectId: 2,
    year: "2024년 1회 기출유형",
    difficulty: "중",
    tags: ["무선랜 보안", "WPA2", "WPA3", "SAE", "CCMP"],
    question: "무선랜(Wi-Fi) 보안 표준의 발전 과정과 암호화 기술에 대한 설명으로 틀린 것은?",
    options: [
      "WEP는 RC4 스트림 암호와 24비트 IV(초기화 벡터)를 사용하여 IV 재사용에 따른 키 복구 취약점이 존재한다.",
      "WPA는 WEP의 취약점을 보완하기 위해 임시로 TKIP(Temporal Key Integrity Protocol)과 MIC(Message Integrity Check)를 도입하였다.",
      "WPA2(IEEE 802.11i)는 블록 암호 AES 기반의 CCMP(Counter Mode with CBC-MAC Protocol)를 필수 암호화 방식으로 채택하였다.",
      "WPA3는 사전 공격(Dictionary Attack)에 취약한 기존 PSK(4-Way Handshake) 방식을 그대로 유지하면서 암호 알고리즘만 3DES로 변경하였다."
    ],
    answer: 3,
    explanation: "WPA3는 WPA2-PSK의 오프라인 사전 공격 및 KRACK 취약점을 해결하기 위해 PSK 대신 Dragonfly 키 교환 기반의 SAE(Simultaneous Authentication of Equals)를 도입하여 전방향 안전성(Forward Secrecy)을 제공합니다. 또한 엔터프라이즈 모드에서는 192비트 보안(CNSA Suite)과 GCMP-256을 지원합니다.",
    keyPoint: "무선랜 보안 진화: WEP(RC4, CRC-32) → WPA(TKIP+RC4, Michael MIC) → WPA2(AES 기반 CCMP) → WPA3(SAE/Dragonfly 키교환, 전방향 안전성, OWE)"
  },
  {
    id: "Q206",
    subjectId: 2,
    year: "2023년 1회 기출유형",
    difficulty: "중",
    tags: ["Snort", "IDS", "룰 옵션", "offset", "depth", "distance", "within"],
    question: "네트워크 침입탐지시스템(IDS)인 Snort Rule의 페이로드 탐지 옵션에 대한 설명으로 옳은 것은?",
    options: [
      "offset: 이전 매칭된 패턴이 끝난 위치로부터 몇 바이트를 건너뛰고 다음 패턴을 검사할지 지정한다.",
      "depth: 패킷 페이로드의 맨 처음(또는 offset 지정 위치)부터 몇 바이트 범위 내에서만 패턴을 검색할지 제한한다.",
      "distance: 패킷 페이로드의 시작점(0 바이트)으로부터 몇 바이트 떨어진 위치부터 검색을 시작할지 지정한다.",
      "nocase: 대소문자를 엄격하게 구분하여 패턴 매칭을 수행하도록 지정한다."
    ],
    answer: 1,
    explanation: "Snort 룰 페이로드 위치 옵션에서 절대 위치 기준은 `offset`(페이로드 시작점부터 건너뛸 바이트)과 `depth`(검색할 최대 길이)이며, 이전 매칭 패턴 기준 상대 위치 옵션은 `distance`(이전 매칭 끝점부터 건너뛸 바이트)와 `within`(이전 매칭 기준 검색할 최대 길이)입니다. `nocase`는 대소문자 구분 없이 탐지하는 옵션입니다.",
    keyPoint: "Snort 위치 옵션 짝꿍: 절대 위치 = offset(시작점) + depth(검색범위) / 상대 위치(이전 매칭 기준) = distance(간격) + within(검색범위)"
  },

  // ================= 3과목: 애플리케이션 보안 =================
  {
    id: "Q301",
    subjectId: 3,
    year: "2026년 1회 기출유형",
    difficulty: "중",
    tags: ["XSS", "CSRF", "웹 취약점", "SameSite", "HttpOnly"],
    question: "웹 애플리케이션 취약점인 XSS(Cross-Site Scripting)와 CSRF(Cross-Site Request Forgery)를 비교한 설명으로 가장 적절하지 않은 것은?",
    options: [
      "XSS는 공격자가 삽입한 악성 스크립트가 피해자의 웹 브라우저에서 실행되는 공격이고, CSRF는 인증된 피해자의 권한을 도용해 의도치 않은 요청을 서버에 전송하게 만드는 공격이다.",
      "쿠키에 HttpOnly 플래그를 설정하면 자바스크립트의 document.cookie 접근을 차단하여 XSS를 통한 세션 쿠키 탈취를 완화할 수 있다.",
      "CSRF 공격을 방어하기 위해서는 재인증(비밀번호·CAPTCHA), CSRF Token 검증, Referer 헤더 검증, SameSite 쿠키 속성 설정 등이 효과적이다.",
      "입력값에 대해 HTML 엔티티 치환(<, >, &, \", ' 필터링)만 적용하면 XSS뿐만 아니라 CSRF 공격도 100% 완벽하게 방어할 수 있다."
    ],
    answer: 3,
    explanation: "HTML 엔티티 인코딩(치환)은 브라우저에서 스크립트 태그가 실행되는 것을 막는 XSS 방어 대책입니다. CSRF는 스크립트 실행 없이도 `<img>` 태그의 `src` 속성이나 자동 제출 `<form>` 등을 통해 정상적인 HTTP 요청을 위조하므로, HTML 엔티티 치환만으로는 막을 수 없으며 CSRF Token이나 SameSite 쿠키, 재인증 등을 적용해야 합니다.",
    keyPoint: "XSS(실행 위치: 클라이언트 브라우저 / 대책: 입출력 HTML Entity 인코딩, CSP, HttpOnly) vs CSRF(실행 위치: 서버가 위조 요청 처리 / 대책: CSRF Token, Referer 검증, 재인증, SameSite)"
  },
  {
    id: "Q302",
    subjectId: 3,
    year: "2025년 1회 기출유형",
    difficulty: "중",
    tags: ["SQL Injection", "Prepared Statement", "시큐어 코딩"],
    question: "SQL Injection 공격을 근본적으로 예방하기 위한 시큐어 코딩 기법으로 가장 올바른 것은?",
    options: [
      "사용자 입력값을 문자열 연결 연산자(+)로 SQL 쿼리문에 직접 결합하되, 클라이언트 측 자바스크립트에서 특수문자를 검사한다.",
      "Prepared Statement(매개변수화된 쿼리, Parameterized Query)를 사용하여 사용자의 입력 데이터가 SQL 구문(구조)을 변경하지 못하고 단순 바인딩 변수로만 처리되게 한다.",
      "데이터베이스 에러 메시지를 화면에 상세히 출력하여 관리자가 공격 여부를 즉시 파악할 수 있게 한다.",
      "동적 테이블명이나 ORDER BY 컬럼명에도 바인딩 변수(?)를 그대로 적용하면 별도의 화이트리스트 검증 없이 안전하다."
    ],
    answer: 1,
    explanation: "SQL Injection의 가장 근본적인 해결책은 Prepared Statement(바인딩 변수 사용)입니다. 클라이언트 자바스크립트 검증은 프록시 도구(Burp Suite 등)로 쉽게 우회되며, 테이블명이나 컬럼명(`ORDER BY` 절 등)에는 바인딩 변수를 사용할 수 없으므로 반드시 서버 측 화이트리스트(허용 목록) 검증을 수행해야 합니다.",
    keyPoint: "SQL Injection 근본 대책: Prepared Statement(Parameterized Query). 단, 테이블명/컬럼명/ORDER BY 절에는 바인딩 불가하므로 화이트리스트(Whitelist) 검증 필수!"
  },
  {
    id: "Q303",
    subjectId: 3,
    year: "2023년 3회 기출유형",
    difficulty: "상",
    tags: ["메일 보안", "SPF", "DKIM", "DMARC"],
    question: "이메일 발신자 주소 위조(Email Spoofing) 및 피싱 메일을 방지하기 위한 이메일 보안 기술의 설명으로 옳은 것은?",
    options: [
      "SPF(Sender Policy Framework): 발신 도메인의 DNS TXT 레코드에 메일 발송이 허용된 서버의 IP 목록을 등록하여 수신 측이 검증한다.",
      "DKIM(DomainKeys Identified Mail): 발신 메일 서버가 수신자의 공개키로 메일 본문을 암호화하여 기밀성을 보장하는 프로토콜이다.",
      "DMARC: 첨부파일의 악성코드 여부를 샌드박스에서 동적 분석하는 엔드포인트 백신 표준이다.",
      "S/MIME과 PGP는 DNS 레코드 기반으로 동작하며 별도의 인증서나 키 교환 없이 도메인 단위로 스팸을 차단한다."
    ],
    answer: 0,
    explanation: "1) 옳음: SPF는 DNS TXT 레코드에 승인된 발송 메일 서버 IP를 명시합니다. 2) DKIM은 발신 서버가 자신의 '개인키'로 메일 헤더/본문을 전자서명하고, 수신 서버가 DNS에 공개된 발신 도메인의 '공개키'로 검증하는 기술입니다(기밀성 암호화가 아닌 무결성·발신 인증). 3) DMARC는 SPF와 DKIM 검증 실패 시의 처리 정책(none, quarantine, reject)과 리포팅을 정의합니다.",
    keyPoint: "이메일 발신자 인증 3총사(DNS TXT 레코드 활용): SPF(발송 허용 IP 등록), DKIM(개인키 전자서명 + DNS 공개키 검증), DMARC(SPF+DKIM 기반 인증 실패 처리 정책)"
  },
  {
    id: "Q304",
    subjectId: 3,
    year: "2023년 2회 기출유형",
    difficulty: "중",
    tags: ["OWASP Top 10", "SSRF", "클라우드 메타데이터"],
    question: "공격자가 웹 애플리케이션 서버로 하여금 공격자가 지정한 내부망 URL이나 클라우드 인스턴스 메타데이터 주소(예: http://169.254.169.254)로 HTTP 요청을 보내도록 유도하는 취약점은?",
    options: [
      "SSRF (Server-Side Request Forgery)",
      "XXE (XML External Entity)",
      "IDOR (Insecure Direct Object References)",
      "Open Redirect"
    ],
    answer: 0,
    explanation: "SSRF(서버 측 요청 위조)는 웹 서버가 외부로부터 입력받은 URL을 적절히 검증하지 않고 백엔드에서 직접 호출할 때 발생하며, 외부에서 접근 불가능한 내부망(localhost, 192.168.x.x)이나 클라우드 메타데이터 서버(169.254.169.254)의 자격증명을 탈취하는 데 악용됩니다. OWASP Top 10 (2021) A10에 등재되었습니다.",
    keyPoint: "SSRF 핵심 키워드: 서버가 내부망/루프백/클라우드 메타데이터(169.254.169.254)로 요청을 대신 전송 → 화이트리스트 도메인 검증 및 사설 IP 대역 차단으로 방어"
  },
  {
    id: "Q305",
    subjectId: 3,
    year: "2024년 1회 기출유형",
    difficulty: "중",
    tags: ["데이터베이스 보안", "접근통제", "뷰", "암호화 방식"],
    question: "데이터베이스(DB) 암호화 구축 방식 중 애플리케이션 수정 없이 DB 서버 내부의 Plug-in 모듈이나 뷰(View)·트리거(Trigger)를 활용하여 암·복호화를 수행하는 방식과 그 특징으로 옳은 것은?",
    options: [
      "API 방식 - 애플리케이션 서버에서 암·복호화를 수행하므로 DB 서버에 부하가 전혀 없다.",
      "Plug-in 방식 - 애플리케이션 코드 수정을 최소화할 수 있으나 암·복호화 연산으로 인해 DB 서버에 부하가 발생할 수 있다.",
      "TDE(Transparent Data Encryption) 방식 - 네트워크 전송 구간까지 자동으로 암호화해주며, SQL 쿼리 레벨에서 세밀한 컬럼별 접근통제가 가능하다.",
      "Hybrid 방식 - 평문 상태로 디스크에 저장하고 백업 시에만 암호화하는 방식이다."
    ],
    answer: 1,
    explanation: "DB 암호화 방식 중 Plug-in 방식은 DB 내부에 암호화 모듈을 설치하고 View와 Trigger를 이용해 암·복호화하므로 애플리케이션 수정이 거의 없지만 DB 서버의 CPU 부하가 증가합니다. API 방식은 애플리케이션 수정이 많이 필요하지만 DB 부하가 적고, TDE(커널/파일 레벨)는 애플리케이션 수정이 전혀 없지만 메모리(SGA/버퍼 캐시)에 올라온 데이터는 평문이므로 DB 계정 탈취 시 평문 조회가 된다는 한계가 있습니다.",
    keyPoint: "DB 암호화 3대 방식: API 방식(App에서 암호화, DB부하↓, App수정↑), Plug-in 방식(DB내 모듈+뷰/트리거, DB부하↑, App수정↓), TDE 방식(저장 파일/블록 암호화, App수정X, DB내 권한통제 별도 필요)"
  },
  {
    id: "Q306",
    subjectId: 3,
    year: "2022년 2회 기출유형",
    difficulty: "하",
    tags: ["파일 업로드 취약점", "웹셸", "시큐어 코딩"],
    question: "파일 업로드(File Upload) 취약점을 통한 웹셸(Web Shell) 공격을 방어하기 위한 보안 대책으로 가장 부적절한 것은?",
    options: [
      "업로드 허용 확장자를 화이트리스트(White-list) 방식으로 제한하고 대소문자 우회 및 이중 확장자를 검증한다.",
      "업로드된 파일이 저장되는 디렉터리에 웹 서버의 스크립트 실행 권한(Execution Permission)을 제거한다.",
      "업로드된 파일명을 난수화하여 외부에서 업로드 경로와 파일명을 직접 추측할 수 없도록 저장한다.",
      "클라이언트 브라우저에서 HTTP 요청 시 전달되는 Content-Type(MIME 타입) 헤더 값만 검사하여 이미지 여부를 판단한다."
    ],
    answer: 3,
    explanation: "HTTP 요청 헤더의 `Content-Type: image/jpeg` 값은 프록시 툴(Burp Suite 등)로 손쉽게 조작할 수 있으므로 이것만 믿고 업로드를 허용하면 웹셸 업로드가 가능합니다. 반드시 화이트리스트 확장자 검증, 파일 시그니처(Magic Number) 검증, 저장 폴더 실행 권한 제거, 파일명 난수화를 함께 적용해야 합니다.",
    keyPoint: "파일 업로드 4대 보안대책: 1) 화이트리스트 확장자 검증 2) 업로드 디렉터리 실행 권한 제거 3) 파일명 난수화 및 웹 루트 외부 저장 4) 파일 시그니처(Magic Number) 검증"
  },

  // ================= 4과목: 정보보안 일반 =================
  {
    id: "Q401",
    subjectId: 4,
    year: "2026년 1회 기출유형",
    difficulty: "중",
    tags: ["블록암호 운용모드", "ECB", "CBC", "CTR", "GCM"],
    question: "블록 암호 운용 모드(Block Cipher Modes of Operation)에 대한 설명으로 옳지 않은 것은?",
    options: [
      "ECB(Electronic Codebook) 모드는 동일한 평문 블록이 동일한 암호문 블록으로 암호화되므로 패턴이 노출되며, 암호화·복호화 모두 병렬 처리가 가능하다.",
      "CBC(Cipher Block Chaining) 모드는 이전 암호문 블록을 현재 평문 블록과 XOR 연산한 후 암호화하므로, 암호화는 병렬 처리가 불가능하지만 복호화는 병렬 처리가 가능하다.",
      "CTR(Counter) 모드는 카운터 값을 암호화한 키 스트림을 평문과 XOR하므로 암호화와 복호화 모두 병렬 처리가 가능하며 패딩(Padding)이 필요 없다.",
      "CFB(Cipher Feedback) 모드와 OFB(Output Feedback) 모드에서는 블록 암호의 복호화(Decrypt) 함수를 사용하여 복호화를 수행한다."
    ],
    answer: 3,
    explanation: "CFB, OFB, CTR 모드는 블록 암호를 스트림 암호처럼 사용하는 모드로, 평문과 키 스트림을 XOR하여 암호문을 만들고 복호화할 때도 똑같이 키 스트림을 생성(블록 암호의 '암호화(Encrypt)' 함수 사용)하여 암호문과 XOR합니다. 따라서 CFB, OFB, CTR 모드는 복호화 시에도 블록 암호의 암호화(E) 함수만 사용합니다.",
    keyPoint: "블록암호 운용모드 핵심: 병렬 암호화 가능(ECB, CTR), 병렬 복호화 가능(ECB, CBC, CFB, CTR) / 복호화 시에도 암호화(E) 함수만 사용하는 모드: CFB, OFB, CTR / 인증+암호화 동시 제공(AEAD): CCM, GCM"
  },
  {
    id: "Q402",
    subjectId: 4,
    year: "2025년 1회 기출유형",
    difficulty: "중",
    tags: ["접근통제 모델", "BLP", "Biba", "Clark-Wilson", "Chinese Wall"],
    question: "강제적 접근통제(MAC) 기반의 보안 모델인 벨-라파둘라(Bell-LaPadula, BLP) 모델과 비바(Biba) 모델에 대한 설명으로 옳은 것은?",
    options: [
      "BLP 모델은 무결성(Integrity) 보장을 최우선 목적으로 하며 'No Read Down, No Write Up' 규칙을 적용한다.",
      "BLP 모델의 *-보안 속성(Star Property)은 상위 보안 등급의 주체가 하위 보안 등급의 객체에 정보를 기록(Write Down)하는 것을 금지하여 기밀 유출을 막는다.",
      "Biba 모델은 기밀성(Confidentiality) 보장을 목적으로 하며 자신의 등급보다 높은 등급의 데이터를 읽지 못하게 한다.",
      "Clark-Wilson 모델은 군사 환경의 기밀 문서 분류를 위해 고안되었으며 이해상충 방지(Conflict of Interest)가 핵심이다."
    ],
    answer: 1,
    explanation: "1), 2), 3) BLP 모델은 '기밀성' 중심 모델로 Simple Security 속성(No Read Up)과 *-Property(No Write Down)를 따릅니다. Biba 모델은 '무결성' 중심 모델로 No Read Down(오염된 하위 데이터 읽기 금지)과 No Write Up(상위 데이터 변조 금지)을 따릅니다. 4) Clark-Wilson은 상업 환경의 무결성(직무분리, TP/CDI/UDI) 모델이며, 이해상충 방지는 만리장성(Chinese Wall, Brewer-Nash) 모델입니다.",
    keyPoint: "접근통제 모델 암기: BLP = 기밀성(No Read Up, No Write Down) | Biba = 무결성(No Read Down, No Write Up) | Clark-Wilson = 상업용 무결성(TP, CDI, 직무분리) | Chinese Wall = 이해상충 방지"
  },
  {
    id: "Q403",
    subjectId: 4,
    year: "2023년 3회 기출유형",
    difficulty: "중",
    tags: ["해시함수", "생일 역설", "충돌 저항성", "해시 특성"],
    question: "암호학적 해시 함수(Cryptographic Hash Function)의 세 가지 보안 요구사항과 관련 공격의 연결로 옳은 것은?",
    options: [
      "역상 저항성(Preimage Resistance) - 주어진 해시값 h에 대해 H(x) = h를 만족하는 입력 x를 찾기 어려워야 하는 성질이다.",
      "제2역상 저항성(Second Preimage Resistance) - 생일 공격(Birthday Attack)과 직접적으로 연관되며, 임의의 서로 다른 두 입력 x, y에 대해 H(x) = H(y)인 쌍을 찾는 것과 같다.",
      "충돌 저항성(Collision Resistance) - 특정 입력 x가 주어졌을 때 H(x) = H(y)를 만족하는 또 다른 입력 y를 찾기 어려워야 하는 성질이다.",
      "해시 출력 길이가 n비트일 때, 생일 공격(Birthday Attack)으로 충돌 쌍을 찾는 데 필요한 연산 복잡도는 2^n 이다."
    ],
    answer: 0,
    explanation: "1) 옳음: 역상 저항성(일방향성)은 결과 해시값 h로부터 원본 입력 x를 역추적하기 어렵다는 성질입니다. 2) 특정 입력 x가 고정된 상태에서 같은 해시값을 갖는 y를 찾기 어려운 것은 '제2역상 저항성'입니다. 3) 아무 제약 없이 H(x)=H(y)인 임의의 두 입력 쌍(x, y)을 찾기 어려운 성질이 '충돌 저항성'이며, 이는 생일 역설(Birthday Paradox)과 관련됩니다. 4) 생일 공격에 의한 충돌 탐색 복잡도는 2^(n/2) 입니다.",
    keyPoint: "해시 3대 성질: 역상 저항성(h만 주어짐 → x 찾기 어려움, 2^n), 제2역상 저항성(x가 주어짐 → H(x)=H(y)인 y 찾기 어려움, 2^n), 충돌 저항성(임의의 H(x)=H(y) 쌍 찾기 어려움, 생일공격 복잡도 2^(n/2))"
  },
  {
    id: "Q404",
    subjectId: 4,
    year: "2023년 2회 기출유형",
    difficulty: "상",
    tags: ["공개키 암호", "RSA", "ECC", "ElGamal", "Diffie-Hellman"],
    question: "비대칭키(공개키) 암호 알고리즘과 그 수학적 기반 문제의 연결이 바르지 않은 것은?",
    options: [
      "RSA - 큰 정수의 소인수분해 문제 (Integer Factorization Problem)",
      "ElGamal - 유한체 상의 이산대수 문제 (Discrete Logarithm Problem)",
      "ECC (타원곡선 암호) - 타원곡선 상의 이산대수 문제 (ECDLP, RSA 대비 짧은 키 길이로 동등한 보안 강도 제공)",
      "Diffie-Hellman 키 교환 - 소인수분해 문제에 기반하며 기본적으로 전자서명과 발신자 인증 기능을 내장하고 있다."
    ],
    answer: 3,
    explanation: "Diffie-Hellman(디피-헬만) 키 교환 알고리즘은 '이산대수 문제(DLP)'에 기반하며, 두 통신 주체가 비밀키(대칭키)를 안전하게 합의하는 키 교환 알고리즘일 뿐 암·복호화나 전자서명 기능이 없고, 통신 상대방에 대한 인증 기능이 없어 중간자 공격(MITM)에 취약합니다.",
    keyPoint: "수학적 난제 분류: 소인수분해 기반(RSA, Rabin) vs 이산대수 기반(Diffie-Hellman, ElGamal, DSA, Schnorr, ECC) | Diffie-Hellman은 인증 부재로 MITM에 취약!"
  },
  {
    id: "Q405",
    subjectId: 4,
    year: "2024년 1회 기출유형",
    difficulty: "하",
    tags: ["전자서명", "부인방지", "은닉서명", "화이트박스 암호"],
    question: "특수 전자서명 기법 중 서명자가 메시지의 구체적인 내용을 알지 못하는 상태에서 서명을 해주고, 추후 서명된 메시지가 공개되어도 누가 언제 서명을 요청했는지 추적할 수 없어 전자화폐나 전자투표의 익명성 보장에 사용되는 서명 방식은?",
    options: [
      "은닉 서명 (Blind Signature)",
      "부인방지 서명 (Undeniable Signature)",
      "은닉 채널 서명 (Covert Channel Signature)",
      "그룹 서명 (Group Signature)"
    ],
    answer: 0,
    explanation: "David Chaum이 제안한 은닉 서명(Blind Signature)은 서명 요청자가 메시지에 은닉 인자(Blinding Factor)를 곱해 서명자에게 보내면, 서명자는 내용을 모른 채 서명해주고 요청자가 은닉 인자를 제거하여 유효한 서명을 얻는 방식으로 전자투표·디지털 현금에 활용됩니다. 참고로 그룹 서명은 그룹 관리자가 필요시 서명자의 신원을 추적(익명성 해제)할 수 있습니다.",
    keyPoint: "특수 전자서명: 은닉 서명(내용 모른 채 서명, 전자투표/전자화폐) | 부인방지 서명(서명자의 협조가 있어야만 검증 가능) | 그룹 서명(그룹원 익명 서명 + 그룹관리자는 신원 오픈 가능) | 실패-중지(Fail-Stop) 서명(위조 시 위조되었음을 증명 가능)"
  },
  {
    id: "Q406",
    subjectId: 4,
    year: "2022년 3회 기출유형",
    difficulty: "중",
    tags: ["커버로스", "SSO", "인증", "AS", "TGS"],
    question: "분산 네트워크 환경의 티켓 기반 싱글 사인온(SSO) 인증 프로토콜인 커버로스(Kerberos)에 대한 설명으로 틀린 것은?",
    options: [
      "대칭키 암호 기술에 기반하여 동작하며, KDC(Key Distribution Center)는 AS(인증 서버)와 TGS(티켓 발부 서버)로 구성된다.",
      "클라이언트는 AS로부터 TGT(Ticket Granting Ticket)를 발급받고, 이후 서비스 접근 시 TGS에 TGT를 제시하여 서비스 티켓(ST)을 발급받는다.",
      "재전송 공격(Replay Attack)을 방지하기 위해 타임스탬프(Timestamp)를 사용하므로 시스템 간 시간 동기화가 매우 중요하다.",
      "패스워드가 네트워크를 통해 평문으로 전송되므로 스니핑에 취약하지만, KDC가 단일 장애점(SPOF)이 되지 않는 완전 분산형 구조이다."
    ],
    answer: 3,
    explanation: "커버로스(Kerberos)는 사용자의 패스워드를 네트워크로 전송하지 않고 패스워드로부터 유도된 대칭키로 티켓과 인증자를 암·복호화합니다. 그러나 중앙의 KDC(Key Distribution Center)가 장애를 일으키거나 해킹당하면 전체 인증이 마비되는 단일 장애점(SPOF) 문제가 있으며, 타임스탬프 검증을 위한 시간 동기화와 패스워드 추측 공격 취약점이 단점입니다.",
    keyPoint: "Kerberos 핵심: 대칭키 기반 티켓 인증(AS → TGT 발급, TGS → 서비스 티켓 발급), 타임스탬프로 재전송 공격 방지(시간 동기화 필수), KDC 단일 장애점(SPOF)"
  },

  // ================= 5과목: 정보보안 관리 및 법규 =================
  {
    id: "Q501",
    subjectId: 5,
    year: "2026년 1회 기출유형",
    difficulty: "중",
    tags: ["ISMS-P", "인증기준", "유효기간", "사후심사"],
    question: "「정보보호 및 개인정보보호 관리체계 인증 등에 관한 고시」에 따른 ISMS-P 인증 제도에 대한 설명으로 옳지 않은 것은?",
    options: [
      "ISMS-P 인증 기준은 '1. 관리체계 수립 및 운영(16개)', '2. 보호대책 요구사항(64개)', '3. 개인정보 처리단계별 요구사항(21개)'의 총 101개 통제항목으로 구성된다.",
      "정보보호 관리체계(ISMS)만 인증을 받고자 하는 경우에는 '1. 관리체계 수립 및 운영'과 '2. 보호대책 요구사항'의 총 80개 항목을 심사받는다.",
      "ISMS-P 인증의 유효기간은 3년이며, 인증을 취득한 기관은 유효기간 중 매년 1회 이상 사후심사를 받아야 한다.",
      "인증 유효기간을 연장하기 위한 갱신심사는 유효기간 만료일 30일 전 이후에만 신청할 수 있다."
    ],
    answer: 3,
    explanation: "ISMS-P 인증의 유효기간은 3년이며 매년 1회 사후심사를 받아야 합니다. 유효기간 연장을 위한 갱신심사는 유효기간 만료일 3개월(90일) 전까지 신청해야 합니다. (※ 최근 고시 개정에 따라 ISMS-P 통제항목은 101개(16+64+21) 또는 기존 102개(16+64+22) 기준을 함께 알아두면 안전합니다.)",
    keyPoint: "ISMS-P 핵심 수치: 유효기간 3년, 사후심사 연 1회 이상, 갱신심사 만료 3개월 전 신청 | 통제항목: 관리체계 수립·운영(16) + 보호대책(64) = ISMS(80개) + 개인정보 처리단계(21~22) = ISMS-P(101~102개)"
  },
  {
    id: "Q502",
    subjectId: 5,
    year: "2025년 1회 기출유형",
    difficulty: "하",
    tags: ["위험관리", "위험처리", "회피", "전가", "감소", "수용"],
    question: "정보보호 위험관리(Risk Management) 과정에서 식별된 위험을 처리하는 4가지 방안(수용, 감소, 회피, 전가) 중, 보험 가입이나 외부 전문 업체로의 아웃소싱 계약을 통해 위험의 책임을 제3자와 분담하는 방식은?",
    options: [
      "위험 수용 (Risk Acceptance)",
      "위험 감소/완화 (Risk Mitigation / Reduction)",
      "위험 회피 (Risk Avoidance)",
      "위험 전가/분담 (Risk Transfer / Sharing)"
    ],
    answer: 3,
    explanation: "위험 처리 4대 전략: 1) 위험 수용(Acceptance): 위험 수준이 목표 위험(DoA) 이하일 때 현재 위험을 감수 2) 위험 감소(Mitigation): 정보보호 대책(방화벽, 암호화 등)을 구현하여 위험 수준을 낮춤 3) 위험 회피(Avoidance): 위험을 유발하는 사업이나 시스템 운영 자체를 중단·포기 4) 위험 전가(Transfer): 배상책임보험 가입, 외주/클라우드 위탁 계약 등을 통해 제3자에게 위험을 이전합니다.",
    keyPoint: "위험 계산 공식: 위험(Risk) = 자산가치(Asset) × 위협(Threat) × 취약점(Vulnerability) | 연간예상손실(ALE) = 단일예상손실(SLE = AV × EF) × 연간발생률(ARO)"
  },
  {
    id: "Q503",
    subjectId: 5,
    year: "2023년 3회 기출유형",
    difficulty: "중",
    tags: ["개인정보 보호법", "안전성 확보조치", "접속기록", "비밀번호 암호화"],
    question: "「개인정보의 안전성 확보조치 기준」에 따른 개인정보처리자의 기술적·관리적 보호조치에 대한 설명으로 옳지 않은 것은?",
    options: [
      "개인정보취급자가 개인정보처리시스템에 접속한 기록은 최소 1년 이상 보관·관리하여야 하며, 5만 명 이상의 정보주체에 관하여 개인정보를 처리하거나 고유식별정보·민감정보를 처리하는 시스템의 경우에는 2년 이상 보관·관리하여야 한다.",
      "비밀번호를 암호화하여 저장할 때에는 복호화가 가능한 양방향 대칭키 암호 알고리즘(AES 등)을 사용하여야 한다.",
      "개인정보처리자는 개인정보의 유출·변조·훼손을 방지하기 위하여 개인정보처리시스템의 접속기록 등을 월 1회 이상 점검하여야 한다.",
      "정보통신망을 통해 고유식별정보나 비밀번호를 송·수신할 때에는 SSL/TLS 등 암호화 통신 또는 안전한 암호 알고리즘으로 암호화하여야 한다."
    ],
    answer: 1,
    explanation: "「개인정보의 안전성 확보조치 기준」 제7조(개인정보의 암호화)에 따라 비밀번호는 복호화되지 아니하도록 **일방향(해시 함수) 암호화**하여 저장해야 합니다. 고유식별정보, 바이오정보 등은 양방향(또는 일방향) 암호화가 가능합니다. 또한 접속기록 점검 주기는 '월 1회 이상', 접속기록 다운로드 사유 확인 및 보관 기간은 일반 1년 이상(5만명 이상 또는 고유식별·민감정보 처리 시 2년 이상)입니다.",
    keyPoint: "개인정보 안전성 확보조치 빈출: 비밀번호는 반드시 '일방향(해시)' 암호화 저장! | 접속기록 보관: 기본 1년 이상(5만명↑ 또는 고유식별·민감정보 처리 시 2년 이상) | 접속기록 점검: 월 1회 이상"
  },
  {
    id: "Q504",
    subjectId: 5,
    year: "2023년 2회 기출유형",
    difficulty: "중",
    tags: ["BCP", "재해복구", "RTO", "RPO", "미러사이트", "핫사이트"],
    question: "업무연속성계획(BCP) 및 재해복구계획(DRP)에서 재해 발생 시점으로부터 업무가 정상으로 복구될 때까지 걸리는 목표 시간을 의미하는 지표와, 실시간 동기화를 통해 이 시간이 거의 '0'에 가까운 재해복구센터 유형의 연결로 옳은 것은?",
    options: [
      "RTO (Recovery Time Objective) - 미러 사이트 (Mirror Site)",
      "RPO (Recovery Point Objective) - 콜드 사이트 (Cold Site)",
      "RTO (Recovery Time Objective) - 웜 사이트 (Warm Site)",
      "MTBF (Mean Time Between Failures) - 핫 사이트 (Hot Site)"
    ],
    answer: 0,
    explanation: "재해 발생 후 시스템/업무를 복구하는 데 걸리는 목표 시간은 **RTO(복구 목표 시간, Recovery Time Objective)**이며, 어느 시점의 데이터까지 손실 없이 복구할 것인가를 나타내는 지표는 **RPO(복구 목표 시점, Recovery Point Objective)**입니다. 복구 속도가 빠른 순서: 미러 사이트(Active-Active, RTO≈0) > 핫 사이트(Active-Standby, 수 시간 내) > 웜 사이트(중요 장비만 보유, 수 일~수 주) > 콜드 사이트(공간만 확보, 수 주~수 개월).",
    keyPoint: "RTO(복구 목표 시간: 얼마나 빨리 복구할까?) vs RPO(복구 목표 시점: 데이터 손실을 어디까지 허용할까?) | DR 센터 비교: Mirror(RTO≈0) > Hot(수시간) > Warm(수일) > Cold(수주)"
  },
  {
    id: "Q505",
    subjectId: 5,
    year: "2024년 1회 기출유형",
    difficulty: "중",
    tags: ["개인정보 보호법", "유출 통지", "유출 신고", "72시간"],
    question: "개정된 「개인정보 보호법」에 따라 개인정보처리자가 개인정보의 유출 등이 되었음을 알게 되었을 때, 정보주체에게 유출 사실을 통지하고 개인정보보호위원회 또는 한국인터넷진흥원(KISA)에 신고해야 하는 기한은?",
    options: [
      "유출되었음을 알게 된 때부터 72시간 이내",
      "유출되었음을 알게 된 때부터 7일 이내",
      "유출이 발생한 시점부터 14일 이내",
      "유출되었음을 알게 된 때부터 30일 이내"
    ],
    answer: 0,
    explanation: "2023년 9월 시행된 개정 「개인정보 보호법」에 따라 기존의 일반 개인정보처리자(5일)와 정보통신서비스 제공자 특례(24시간)가 통합되어, 모든 개인정보처리자는 유출되었음을 알게 된 때부터 **72시간 이내**에 정보주체 통지 및 개인정보위(또는 KISA) 신고를 해야 합니다. (단, 정보통신망법상 침해사고 신고는 알게 된 때부터 24시간 이내입니다.)",
    keyPoint: "법규 시간 암기 주의! 개정 개인정보 보호법상 개인정보 유출 통지·신고 = '알게 된 때부터 72시간 이내' (신고 대상: 1천명 이상 유출, 민감·고유식별정보 유출, 해킹으로 인한 유출) | 정보통신망법 침해사고 신고 = '24시간 이내'"
  },
  {
    id: "Q506",
    subjectId: 5,
    year: "2023년 1회 기출유형",
    difficulty: "하",
    tags: ["디지털 포렌식", "무결성", "연계보관성", "휘발성 순서"],
    question: "디지털 포렌식(Digital Forensics)의 5대 기본 원칙과 RFC 3227에 따른 증거 수집 시 휘발성(Order of Volatility) 순서에 대한 설명으로 틀린 것은?",
    options: [
      "정당성의 원칙: 증거는 적법한 절차(영장 등)에 의해 수집되어야 법적 증거능력을 인정받는다.",
      "무결성의 원칙: 수집된 디지털 증거가 위·변조되지 않았음을 해시값(SHA-256 등)을 통해 증명해야 한다.",
      "연계보관성(Chain of Custody)의 원칙: 증거의 수집, 이송, 분석, 보관, 법정 제출에 이르는 전 과정과 담당자가 명확히 기록·관리되어야 한다.",
      "증거 수집 시 비휘발성 저장매체(하드디스크, 백업 테이프)를 가장 먼저 수집한 후 CPU 레지스터와 캐시, RAM 메모리를 마지막에 수집해야 한다."
    ],
    answer: 3,
    explanation: "RFC 3227(증거 수집 및 보관 가이드라인)에 따르면 전원이 꺼지거나 시간이 지나면 사라지기 쉬운 **휘발성이 높은 데이터부터 먼저 수집**해야 합니다. 휘발성 순서: CPU 레지스터 및 캐시 → 라우팅 테이블, ARP 캐시, 프로세스 테이블, 커널 통계, RAM 메모리 → 임시 파일 시스템 → 하드디스크(비휘발성) → 원격 로그 및 모니터링 데이터 → 물리적 구성 및 네트워크 토폴로지 → 아카이브 미디어(백업 테이프/CD).",
    keyPoint: "디지털 포렌식 5대 원칙: 정당성, 재현성, 신속성, 연계보관성(Chain of Custody), 무결성(해시값) | 증거 수집 순서(RFC 3227): 휘발성이 높은 것(레지스터/캐시 → RAM → 디스크 → 백업매체)부터 수집!"
  },

  // ================= [추가 확장] 1과목: 시스템 보안 (Q107 ~ Q112) =================
  {
    id: "Q107",
    subjectId: 1,
    year: "2026년 2회 기출유형",
    difficulty: "중",
    tags: ["umask", "기본권한", "파일권한", "디렉터리권한"],
    question: "리눅스 시스템에서 현재 사용자의 umask 값이 '0027'로 설정되어 있을 때, 이 사용자가 새로 생성하는 일반 파일과 디렉터리의 기본 접근 권한(8진수 및 심볼릭)으로 옳은 것은?",
    options: [
      "일반 파일: 640 (-rw-r-----) / 디렉터리: 750 (drwxr-x---)",
      "일반 파일: 644 (-rw-r--r--) / 디렉터리: 755 (drwxr-xr-x)",
      "일반 파일: 750 (-rwxr-x---) / 디렉터리: 750 (drwxr-x---)",
      "일반 파일: 660 (-rw-rw----) / 디렉터리: 770 (drwxrwx---)"
    ],
    answer: 0,
    explanation: "리눅스에서 일반 파일의 최대 기본 권한은 666(-rw-rw-rw-)이고, 디렉터리의 최대 기본 권한은 777(drwxrwxrwx)입니다. umask 027(권한 차감 마스크: 소유자 0, 그룹 2(w), 기타 7(rwx))을 적용하면 일반 파일은 666 & ~027 = 640(-rw-r-----), 디렉터리는 777 & ~027 = 750(drwxr-x---)이 됩니다.",
    keyPoint: "umask 계산법: 일반 파일 기본권한(666) - umask / 디렉터리 기본권한(777) - umask (엄밀히는 NOT 비트 AND 연산)"
  },
  {
    id: "Q108",
    subjectId: 1,
    year: "2025년 2회 기출유형",
    difficulty: "중",
    tags: ["포맷 스트링", "Format String", "%n", "%x"],
    question: "C언어 프로그램에서 printf(buf); 와 같이 포맷 지정자를 생략하고 사용자 입력을 직접 출력할 때 발생하는 포맷 스트링(Format String) 취약점에서, 특정 메모리 주소에 지금까지 출력된 바이트 수를 기록(Write)하여 실행 흐름을 변조하는 데 악용되는 형식 지정자는?",
    options: [
      "%n",
      "%x",
      "%s",
      "%d"
    ],
    answer: 0,
    explanation: "포맷 스트링 공격에서 `%x`나 `%p`는 스택 메모리의 값을 16진수로 열람(Read)할 때 쓰이고, `%s`는 해당 주소가 가리키는 문자열을 읽을 때 쓰입니다. 반면 `%n`은 현재까지 출력된 문자열의 바이트 수를 인자로 전달된 메모리 주소에 기록(Write)하는 유일한 지정자로, RET나 GOT 주소를 변조하는 데 핵심적으로 사용됩니다.",
    keyPoint: "포맷 스트링 지정자: %x(스택 메모리 값 읽기), %s(참조 주소 문자열 읽기), %n(메모리 주소에 출력 바이트 수 쓰기/변조!)"
  },
  {
    id: "Q109",
    subjectId: 1,
    year: "2023년 1회 기출유형",
    difficulty: "하",
    tags: ["cron", "at", "작업스케줄러", "접근제어"],
    question: "리눅스 시스템에서 정기적인 예약 작업을 수행하는 cron 데몬의 사용자 접근 통제 우선순위 및 규칙으로 옳은 것은?",
    options: [
      "/etc/cron.allow 파일과 /etc/cron.deny 파일이 모두 존재할 경우, cron.allow 파일이 우선 적용되어 해당 파일에 등록된 사용자만 crontab을 사용할 수 있다.",
      "/etc/cron.allow와 /etc/cron.deny 파일이 둘 다 없을 경우, 일반 사용자를 포함한 모든 사용자가 crontab 명령을 자유롭게 사용할 수 있다.",
      "/etc/cron.deny 파일만 존재하고 그 안에 아무 사용자도 적혀 있지 않다면 root만 crontab을 사용할 수 있다.",
      "crontab 설정 파일의 시간 필드는 '초 - 분 - 시 - 일 - 월 - 요일'의 6개 필드로 구성된다."
    ],
    answer: 0,
    explanation: "1) 옳음: `cron.allow`와 `cron.deny`가 모두 있으면 `cron.allow`만 적용됩니다. 2) 두 파일이 모두 없으면 root(관리자)만 사용 가능합니다(단, 배포판에 따라 빈 cron.deny가 기본 존재해 모두 허용되기도 함). 3) `cron.deny`만 있고 비어 있으면 거부된 사용자가 없으므로 모든 사용자가 사용 가능합니다. 4) crontab 시간 필드는 '분(0-59) 시(0-23) 일(1-31) 월(1-12) 요일(0-7)'의 5개 필드입니다.",
    keyPoint: "cron/at 접근제어: allow가 deny보다 항상 우선! 둘 다 없으면 root만 가능 | crontab 5개 시간 필드: 분-시-일-월-요일"
  },
  {
    id: "Q110",
    subjectId: 1,
    year: "2024년 1회 기출유형",
    difficulty: "중",
    tags: ["Windows 이벤트 로그", "Event ID", "4624", "4625"],
    question: "Windows 운영체제의 보안 이벤트 로그(Security Event Log)에서 무차별 대입 공격(Brute-Force Attack) 징후를 탐지하기 위해 중점적으로 모니터링해야 하는 '계정 로그온 실패' 이벤트 ID는?",
    options: [
      "Event ID 4625",
      "Event ID 4624",
      "Event ID 4672",
      "Event ID 4720"
    ],
    answer: 0,
    explanation: "Windows 보안 감사 로그(Vista/Server 2008 이후 표준)에서 주요 Event ID: 4624(로그온 성공), 4625(로그온 실패 - 무차별 대입 공격 탐지 핵심), 4634/4647(로그오프), 4672(새 로그온에 관리자 등 특수 권한 할당), 4720(사용자 계정 생성), 1102(감사 로그 삭제됨)입니다.",
    keyPoint: "Windows 보안 이벤트 ID 암기: 4624(로그온 성공), 4625(로그온 실패), 4672(특수 권한 할당), 4720(계정 생성), 1102(감사 로그 초기화)"
  },
  {
    id: "Q111",
    subjectId: 1,
    year: "2022년 2회 기출유형",
    difficulty: "중",
    tags: ["/etc/shadow", "패스워드 해시", "솔트", "Salt"],
    question: "리눅스의 /etc/shadow 파일에 저장된 패스워드 해시 필드가 '$6$xyz123$ab89cd...' 형태일 때, 이에 대한 설명으로 옳은 것은?",
    options: [
      "맨 앞의 '$6$'는 SHA-512 해시 알고리즘이 사용되었음을 의미하며, 'xyz123'은 레인보우 테이블 공격을 방어하기 위한 솔트(Salt) 값이다.",
      "맨 앞의 '$6$'는 패스워드 최소 길이가 6자리임을 의미한다.",
      "'$6$'는 MD5 해시 알고리즘을 의미하며, 양방향 복호화가 가능하다.",
      "/etc/shadow 파일은 모든 일반 사용자에게 읽기 권한(r)이 부여되어 있어야 로그인이 가능하다."
    ],
    answer: 0,
    explanation: "`/etc/shadow`의 암호화 필드는 `$알고리즘ID$Salt$Hash값` 구조입니다. 알고리즘 ID는 `$1$`(MD5), `$2a$`(Blowfish/bcrypt), `$5$`(SHA-256), `$6$`(SHA-512), `$y$`(yescrypt)를 의미합니다. Salt(솔트)는 동일한 패스워드라도 서로 다른 해시값을 갖게 하여 사전 공격 및 레인보우 테이블 공격을 무력화합니다.",
    keyPoint: "/etc/shadow 해시 식별자: $1$(MD5), $5$(SHA-256), $6$(SHA-512), $y$(yescrypt) | Salt(솔트): 레인보우 테이블(사전 계산된 해시 체인) 방어"
  },
  {
    id: "Q112",
    subjectId: 1,
    year: "2023년 2회 기출유형",
    difficulty: "상",
    tags: ["chroot", "아파치 보안", "ServerTokens", "디렉터리 리스팅"],
    question: "리눅스 웹 서버(Apache) 및 시스템 보안 강화 설정에 대한 설명으로 틀린 것은?",
    options: [
      "chroot(Change Root)를 적용하여 프로세스의 최상위 디렉터리를 격리하면 침해사고 발생 시 상위 시스템 파일로의 접근을 제한할 수 있다.",
      "Apache 설정(httpd.conf)에서 'ServerTokens Prod'와 'ServerSignature Off'를 설정하면 에러 페이지나 응답 헤더에 상세 버전 정보가 노출되는 것을 막을 수 있다.",
      "디렉터리 내에 index.html 파일이 없을 때 파일 목록이 노출되는 디렉터리 리스팅 취약점을 막으려면 Options 지시자에서 'Indexes'를 제거(-Indexes)해야 한다.",
      "Apache의 'FollowSymLinks' 옵션을 활성화하면 심볼릭 링크를 통한 웹 루트 외부 파일 접근을 완벽히 차단할 수 있다."
    ],
    answer: 3,
    explanation: "Apache의 `Options FollowSymLinks`가 활성화되어 있으면 웹 문서 디렉터리 안에 생성된 심볼릭 링크를 따라 웹 루트 바깥의 시스템 중요 파일(`/etc/passwd` 등)에 접근할 위험이 있으므로, 보안상 `-FollowSymLinks`로 제거해야 합니다.",
    keyPoint: "Apache 보안 설정 3대장: 1) 디렉터리 리스팅 차단(Options -Indexes) 2) 심볼릭 링크 추적 차단(Options -FollowSymLinks) 3) 버전 정보 숨김(ServerTokens Prod, ServerSignature Off)"
  },

  // ================= [추가 확장] 2과목: 네트워크 보안 (Q207 ~ Q212) =================
  {
    id: "Q207",
    subjectId: 2,
    year: "2026년 2회 기출유형",
    difficulty: "중",
    tags: ["DNS 보안", "DNSSEC", "DNS Spoofing", "Kaminsky 공격"],
    question: "DNS 응답 패킷의 위·변조(DNS Spoofing / Cache Poisoning)를 방지하기 위해 공개키 암호 기반의 전자서명을 도입한 DNSSEC(DNS Security Extensions)에 대한 설명으로 옳지 않은 것은?",
    options: [
      "DNS 데이터에 대한 발신지 인증(Origin Authentication)과 데이터 무결성(Data Integrity)을 보장한다.",
      "DNS 질의 및 응답 패킷 전체를 암호화하여 네트워크 스니핑으로부터 완벽한 기밀성(Confidentiality)을 제공한다.",
      "RRSIG(전자서명 레코드), DNSKEY(공개키 레코드), DS(위임 서명자 레코드), NSEC/NSEC3(부재 증명 레코드) 등의 새로운 리소스 레코드를 사용한다.",
      "상위 도메인(Root → TLD → 2차 도메인)에서 하위 도메인으로 이어지는 신뢰 체인(Chain of Trust) 구조를 통해 공개키를 검증한다."
    ],
    answer: 1,
    explanation: "DNSSEC은 공개키 전자서명을 통해 DNS 응답이 정당한 권한 서버에서 온 것인지(인증)와 변조되지 않았는지(무결성)를 검증할 뿐, **DNS 트래픽을 암호화하여 기밀성을 제공하지는 않습니다**. DNS 질의 자체의 기밀성(암호화)을 위해서는 DoH(DNS over HTTPS)나 DoT(DNS over TLS)를 사용해야 합니다.",
    keyPoint: "DNSSEC 핵심: 전자서명 기반 '무결성 + 발신지 인증' 제공, 단 '기밀성(암호화)은 미제공'! (암호화는 DoT/DoH)"
  },
  {
    id: "Q208",
    subjectId: 2,
    year: "2025년 2회 기출유형",
    difficulty: "중",
    tags: ["SSL/TLS", "Handshake", "Record 프로토콜", "Heartbleed"],
    question: "SSL/TLS 프로토콜의 계층 구조와 동작 과정에 대한 설명으로 틀린 것은?",
    options: [
      "SSL Record 프로토콜은 상위 프로토콜로부터 전달받은 데이터를 '단편화(Fragmentation) → 압축(Compression) → MAC 추가 → 암호화(Encryption) → SSL 헤더 부착' 순서로 처리한다.",
      "Handshake 과정에서 클라이언트는 서버의 공개키 인증서를 검증한 뒤, Pre-Master Secret을 생성하여 서버의 공개키로 암호화해 전송(RSA 키 교환 기준)한다.",
      "Change Cipher Spec 프로토콜은 협상된 암호화 알고리즘과 세션키를 이후 통신부터 실제로 적용하겠다고 알리는 단일 바이트 메시지이다.",
      "SSL/TLS는 3계층(네트워크 계층)에서 동작하므로 응용 프로그램(HTTP, SMTP 등)과는 완전히 투명하게 IP 패킷 헤더까지 모두 암호화한다."
    ],
    answer: 3,
    explanation: "3계층(네트워크 계층)에서 IP 패킷을 암호화하는 것은 IPSec입니다. SSL/TLS는 전송 계층(L4, TCP)과 응용 계층(L7) 사이에서 동작하며, 응용 계층 페이로드를 보호합니다.",
    keyPoint: "SSL Record 처리 순서: 단편화 → 압축 → MAC 첨부 → 암호화 → 헤더 부착 | SSL 상위 3대 프로토콜: Handshake, Change Cipher Spec, Alert"
  },
  {
    id: "Q209",
    subjectId: 2,
    year: "2024년 1회 기출유형",
    difficulty: "중",
    tags: ["DRDoS", "증폭 공격", "Smurf", "NTP", "BCP 38"],
    question: "공격자가 좀비 PC(에이전트)를 직접 감염시키지 않고, 출발지 IP를 피해자 IP로 위조(Spoofing)하여 정상적인 외부 서버(DNS, NTP, Memcached 등)에 요청을 보냄으로써 대량의 응답 패킷이 피해자에게 집중되도록 하는 공격 기법과 근본적인 네트워크 예방 대책은?",
    options: [
      "DRDoS (Distributed Reflection DoS) - ISP 및 라우터에서 출발지 IP 위조 패킷을 차단하는 Ingress/Egress 필터링(BCP 38) 적용",
      "Slowloris DoS - 웹 서버의 Keep-Alive 타임아웃 시간 연장",
      "Land Attack - 스위치의 Spanning Tree Protocol(STP) 비활성화",
      "Teardrop Attack - DNS 서버의 재귀 질의(Recursive Query) 전면 허용"
    ],
    answer: 0,
    explanation: "DRDoS(분산 반사/증폭 서비스 거부 공격)는 출발지 IP 스푸핑과 UDP 기반 프로토콜(DNS any 질의, NTP monlist, SNMP GetBulk, Memcached, SSDP)의 응답 크기 증폭(Amplification) 특성을 악용합니다. 근본 대책은 출발지 IP 위조를 네트워크 경계에서 차단하는 Ingress/Egress Filtering(RFC 2827 / BCP 38)과 반사 서버의 불필요한 명령(monlist, Open Resolver) 비활성화입니다.",
    keyPoint: "DRDoS 특징: 에이전트(좀비PC) 설치 불필요, 출발지 IP 스푸핑 + UDP 증폭(DNS, NTP monlist, Memcached) → 대책: Ingress 필터링(BCP 38), Open Resolver 제한"
  },
  {
    id: "Q210",
    subjectId: 2,
    year: "2023년 2회 기출유형",
    difficulty: "중",
    tags: ["방화벽", "iptables", "Chain", "NAT", "Stateful Inspection"],
    question: "리눅스 커널 기반 방화벽인 Netfilter(iptables)의 기본 체인(Chain) 중, 방화벽 호스트 자체가 목적지가 아니라 방화벽을 통과(경유)하여 다른 네트워크로 라우팅되는 패킷을 필터링할 때 사용하는 체인은?",
    options: [
      "FORWARD",
      "INPUT",
      "OUTPUT",
      "POSTROUTING"
    ],
    answer: 0,
    explanation: "iptables의 filter 테이블 3대 기본 체인: `INPUT`(방화벽 호스트 자신으로 들어오는 패킷), `OUTPUT`(방화벽 호스트 내부에서 생성되어 외부로 나가는 패킷), `FORWARD`(방화벽을 경유하여 다른 호스트로 전달/라우팅되는 패킷)입니다. `PREROUTING`과 `POSTROUTING`은 주로 nat 테이블(DNAT, SNAT/Masquerade)에서 사용됩니다.",
    keyPoint: "iptables filter 체인: INPUT(목적지=나), OUTPUT(출발지=나), FORWARD(나를 통과해 라우팅되는 패킷) | nat 체인: PREROUTING(DNAT), POSTROUTING(SNAT/Masquerade)"
  },
  {
    id: "Q211",
    subjectId: 2,
    year: "2022년 3회 기출유형",
    difficulty: "하",
    tags: ["NAC", "네트워크 접근제어", "802.1X", "EAP", "RADIUS"],
    question: "단말(PC, 노트북 등)이 내부 네트워크에 접속하기 전에 단말의 보안 상태(백신 설치 여부, OS 보안 패치, 비인가 프로그램 유무)를 검사하고 사용자 인증(IEEE 802.1X)을 거쳐 네트워크 접속을 허용하거나 격리하는 보안 솔루션은?",
    options: [
      "NAC (Network Access Control)",
      "WAF (Web Application Firewall)",
      "ESM (Enterprise Security Management)",
      "SOAR (Security Orchestration, Automation and Response)"
    ],
    answer: 0,
    explanation: "NAC(네트워크 접근제어)는 단말의 네트워크 연결 시점에 인증(802.1X, MAC 등)과 무결성/보안정책 준수 여부(Posture Check: 백신, 패치 등)를 점검하여 비준수 단말을 격리(Quarantine)하고 치료 후 접속을 허용하는 솔루션입니다.",
    keyPoint: "보안 솔루션 구분: NAC(단말 인증+백신/패치 무결성 검증 후 네트워크 접속 통제), WAF(웹 공격 SQLi/XSS 방어), SIEM/SOAR(통합 로그 빅데이터 상관분석 및 플레이북 기반 자동 대응)"
  },
  {
    id: "Q212",
    subjectId: 2,
    year: "2023년 1회 기출유형",
    difficulty: "중",
    tags: ["VLAN", "VLAN Hopping", "Switch Spoofing", "Double Tagging"],
    question: "L2 스위치의 가상 랜(VLAN) 환경을 우회하여 다른 VLAN에 속한 호스트로 패킷을 전송하는 'VLAN Hopping' 공격의 두 가지 대표적인 기법은?",
    options: [
      "Switch Spoofing(DTP 악용 트렁크 협상) 및 Double Tagging(이중 802.1Q 태그 캡슐화)",
      "ARP Poisoning 및 DNS Cache Poisoning",
      "ICMP Redirect 및 STP Root Bridge 탈취",
      "SYN Flooding 및 Smurf Attack"
    ],
    answer: 0,
    explanation: "VLAN Hopping 공격은 ① 공격자 포트가 스위치인 것처럼 DTP(Dynamic Trunking Protocol) 패킷을 보내 Trunk 포트로 전환시키는 **Switch Spoofing**과, ② Native VLAN을 이용해 외부 태그와 내부 태그 2개의 802.1Q 태그를 붙여 첫 번째 스위치에서 외부 태그가 벗겨진 뒤 대상 VLAN으로 넘어가는 **Double Tagging** 기법이 있습니다.",
    keyPoint: "VLAN Hopping 2대 기법: Switch Spoofing(DTP 자동 트렁크 협상 악용 → 사용자 포트 switchport mode access 고정으로 방어) & Double Tagging(이중 802.1Q 태그 → Native VLAN 변경으로 방어)"
  },

  // ================= [추가 확장] 3과목: 애플리케이션 보안 (Q307 ~ Q312) =================
  {
    id: "Q307",
    subjectId: 3,
    year: "2026년 2회 기출유형",
    difficulty: "중",
    tags: ["XXE", "XML 보안", "외부 엔티티", "시큐어 코딩"],
    question: "XML 문서를 파싱할 때 외부 엔티티(External Entity) 참조 기능이 활성화되어 있어 서버 내부의 로컬 파일(예: file:///etc/passwd)을 열람하거나 SSRF, DoS(Billion Laughs) 공격을 유발하는 취약점은?",
    options: [
      "XXE (XML External Entity) Injection",
      "XPath Injection",
      "LDAP Injection",
      "DOM-based XSS"
    ],
    answer: 0,
    explanation: "XXE(XML 외부 엔티티) 취약점은 XML 문서의 DTD(Document Type Definition) 선언부에 `<!ENTITY xxe SYSTEM \"file:///etc/passwd\">`와 같은 외부 엔티티를 정의해 서버 로컬 파일을 읽거나 내부망 요청을 유발하는 공격입니다. 방어 대책은 XML 파서에서 **DTD 및 외부 엔티티 처리 기능을 비활성화**하는 것입니다.",
    keyPoint: "XXE 핵심 키워드: XML DTD `<!ENTITY ... SYSTEM \"file:///...\">` 악용 → 대책: XML 파서에서 외부 엔티티 및 DTD 선언 비활성화"
  },
  {
    id: "Q308",
    subjectId: 3,
    year: "2025년 2회 기출유형",
    difficulty: "중",
    tags: ["전자상거래", "SET", "이중서명", "Dual Signature"],
    question: "신용카드 기반 전자상거래 보안 프로토콜인 SET(Secure Electronic Transaction)에서 상점에게는 구매자의 신용카드 결제 정보(PI)를 숨기고, 카드사(PG)에게는 구매자의 물품 주문 정보(OI)를 숨기면서도 두 정보의 상호 연관성과 무결성을 증명하기 위해 사용하는 핵심 기술은?",
    options: [
      "이중 서명 (Dual Signature)",
      "은닉 서명 (Blind Signature)",
      "그룹 서명 (Group Signature)",
      "타임스탬프 토큰 (Time-Stamp Token)"
    ],
    answer: 0,
    explanation: "SET 프로토콜의 이중 서명(Dual Signature)은 주문 정보 해시값 `H(OI)`와 결제 정보 해시값 `H(PI)`를 연결하여 다시 해시한 뒤 구매자의 개인키로 전자서명(`Sig(H(H(OI) || H(PI)))`)하는 기법입니다. 상점은 `OI`와 `H(PI)`만으로 서명을 검증하고, 은행/카드사는 `PI`와 `H(OI)`만으로 서명을 검증할 수 있습니다.",
    keyPoint: "SET = 이중 서명(Dual Signature): 상점에는 결제정보(PI) 은닉, 카드사에는 주문정보(OI) 은닉 (주의: 전자화폐/전자투표 익명성은 '은닉 서명')"
  },
  {
    id: "Q309",
    subjectId: 3,
    year: "2024년 1회 기출유형",
    difficulty: "중",
    tags: ["세션 하이재킹", "세션 고정", "Session Fixation", "쿠키 보안"],
    question: "공격자가 미리 유효한 세션 ID(JSESSIONID 등)를 발급받은 뒤 피해자에게 해당 세션 ID가 포함된 URL이나 쿠키를 주입하여 피해자가 로그인하게 만든 후, 동일한 세션 ID로 피해자 계정을 탈취하는 웹 공격 기법과 그 방어 대책은?",
    options: [
      "세션 고정 공격 (Session Fixation) - 사용자 로그인(인증) 성공 시 반드시 기존 세션 ID를 파기하고 새로운 세션 ID를 재발급한다.",
      "세션 예측 공격 (Session Prediction) - 세션 타임아웃 시간을 무제한으로 설정한다.",
      "CSRF 공격 - URL 파라미터에 세션 ID를 포함하여 전송(URL Rewriting)한다.",
      "클릭재킹 (Clickjacking) - X-Frame-Options 헤더를 제거한다."
    ],
    answer: 0,
    explanation: "세션 고정(Session Fixation) 공격은 로그인 전과 로그인 후에 동일한 세션 식별자(Session ID)가 그대로 유지되는 취약점을 악용합니다. 따라서 **로그인(인증)이 성공하거나 권한 수준이 변경될 때마다 기존 세션을 무효화하고 새로운 세션 ID를 재발급**해야 하며, URL에 세션 ID가 노출되는 URL Rewriting을 금지해야 합니다.",
    keyPoint: "세션 고정(Session Fixation) 방어 핵심: 로그인 성공 시 반드시 '새로운 세션 ID 재발급'! + URL 내 세션 ID 전달 금지"
  },
  {
    id: "Q310",
    subjectId: 3,
    year: "2023년 2회 기출유형",
    difficulty: "하",
    tags: ["클릭재킹", "Clickjacking", "X-Frame-Options", "CSP"],
    question: "웹 페이지 위에 투명한 `<iframe>`을 겹쳐 놓아 사용자가 눈에 보이는 버튼을 클릭했을 때 실제로는 숨겨진 다른 사이트의 버튼이나 링크를 클릭하게 만드는 'UI Redressing(클릭재킹, Clickjacking)' 공격의 방어 대책으로 가장 적절한 것은?",
    options: [
      "HTTP 응답 헤더에 'X-Frame-Options: DENY'(또는 SAMEORIGIN) 또는 CSP의 'frame-ancestors' 지시자를 설정한다.",
      "데이터베이스 연결 시 Prepared Statement를 사용한다.",
      "패스워드 저장 시 솔트(Salt)를 추가한 SHA-256 해시를 적용한다.",
      "쿠키에 Secure 속성을 제거하여 HTTP 통신에서도 쿠키가 전송되게 한다."
    ],
    answer: 0,
    explanation: "클릭재킹(Clickjacking)은 타 사이트가 내 웹 페이지를 `<iframe>`이나 `<frame>` 내부에 삽입하지 못하도록 HTTP 응답 헤더에 `X-Frame-Options: DENY` (모든 프레임 삽입 차단) 또는 `SAMEORIGIN` (동일 출처만 허용), 혹은 `Content-Security-Policy: frame-ancestors 'none'`을 설정하여 방어합니다.",
    keyPoint: "Clickjacking(UI Redressing, 투명 iframe 악용) 방어: X-Frame-Options(DENY / SAMEORIGIN) 또는 CSP frame-ancestors 설정"
  },
  {
    id: "Q311",
    subjectId: 3,
    year: "2022년 3회 기출유형",
    difficulty: "중",
    tags: ["시큐어 코딩", "경로 조작", "Path Traversal", "Command Injection"],
    question: "파일 다운로드 기능 구현 시 사용자 입력 파일명에 '../'와 같은 문자열이 포함되어 허용된 디렉터리 외부의 시스템 설정 파일(/etc/passwd, boot.ini 등)을 열람할 수 있게 되는 취약점은?",
    options: [
      "경로 조작 및 자원 삽입 (Path Traversal / Directory Traversal)",
      "운영체제 명령어 삽입 (OS Command Injection)",
      "크로스 사이트 요청 위조 (CSRF)",
      "정수 오버플로우 (Integer Overflow)"
    ],
    answer: 0,
    explanation: "경로 조작(Path Traversal / Directory Traversal) 취약점은 파일 입출력 시 외부 입력값에서 경로 순회 문자(`..`, `/`, `\\`, `%00` 등)를 필터링하지 않을 때 발생합니다. 시큐어 코딩 대책으로는 파일명을 직접 입력받지 않고 DB 인덱스 번호로 매핑하거나, `replaceAll` 등으로 `..`, `/`, `\\` 문자를 제거하고 기준 디렉터리 내부인지 정규화(Canonicalization) 검증을 수행해야 합니다.",
    keyPoint: "경로 조작(Path Traversal): ../, ..\\, %00(Null Byte) 필터링 및 파일명 대신 DB 인덱스 매핑 사용 | OS 명령어 삽입(Command Injection): ; | & ` $() 필터링 및 외부 프로세스 직접 실행 지양"
  },
  {
    id: "Q312",
    subjectId: 3,
    year: "2023년 1회 기출유형",
    difficulty: "중",
    tags: ["역직렬화", "Insecure Deserialization", "시큐어 코딩", "OWASP"],
    question: "신뢰할 수 없는 외부의 직렬화된 객체 데이터(Java ObjectInputStream, Python pickle, PHP unserialize 등)를 검증 없이 역직렬화(Deserialization)할 때 원격 코드 실행(RCE) 등이 발생할 수 있는 취약점을 방어하기 위한 대책으로 옳은 것은?",
    options: [
      "역직렬화 대상 클래스를 화이트리스트(허용 목록) 방식으로 엄격히 제한하고, 가능한 경우 JSON 등 순수 데이터 포맷과 전자서명(무결성 검증)을 사용한다.",
      "모든 클래스가 Serializable 인터페이스를 구현하도록 강제하고 접근 제한자를 public으로 변경한다.",
      "클라이언트 쿠키에 직렬화된 관리자 객체를 평문 그대로 저장하여 서버 부하를 줄인다.",
      "역직렬화 시 발생하는 예외 메시지를 사용자 화면에 전체 스택 트레이스로 출력한다."
    ],
    answer: 0,
    explanation: "안전하지 않은 역직렬화(Insecure Deserialization)는 공격자가 조작한 바이트 스트림(가젯 체인)을 `readObject()`나 `pickle.loads()`로 복원할 때 임의 코드가 실행되는 치명적인 취약점입니다. 화이트리스트 클래스 검증(`resolveClass` 오버라이딩), 데이터 전자서명/HMAC 검증, 또는 JSON/XML 같은 단순 데이터 구조 사용으로 방어합니다.",
    keyPoint: "역직렬화(Deserialization) 취약점 방어: 1) 허용된 클래스만 역직렬화(화이트리스트 검증) 2) 전송 데이터에 HMAC/전자서명으로 위변조 차단 3) pickle/ObjectInputStream 대신 JSON 사용 권장"
  },

  // ================= [추가 확장] 4과목: 정보보안 일반 (Q407 ~ Q412) =================
  {
    id: "Q407",
    subjectId: 4,
    year: "2026년 2회 기출유형",
    difficulty: "중",
    tags: ["대칭키 암호", "AES", "DES", "Feistel", "SPN"],
    question: "현대 대칭키 블록 암호 알고리즘인 DES, AES, SEED, ARIA의 내부 구조와 특징에 대한 설명으로 옳지 않은 것은?",
    options: [
      "DES는 64비트 블록 크기와 56비트 유효 키 길이를 가지며, 16라운드의 파이스텔(Feistel) 구조로 이루어져 있어 암·복호화 구조가 동일하다.",
      "AES(Rijndael)는 128비트 블록 크기와 128/192/256비트 키 길이에 따라 각각 10/12/14라운드로 동작하는 SPN(Substitution-Permutation Network) 구조이다.",
      "AES의 한 라운드는 SubBytes(비선형 치환) → ShiftRows(행 이동) → MixColumns(열 혼합, 마지막 라운드는 생략) → AddRoundKey(라운드키 XOR)의 4단계로 구성된다.",
      "SPN 구조를 사용하는 AES와 ARIA는 파이스텔(Feistel) 구조와 달리 라운드 함수가 가역적(역함수 존재)이어야 할 필요가 전혀 없다."
    ],
    answer: 3,
    explanation: "파이스텔(Feistel) 구조(DES, SEED 등)는 입력 블록을 좌·우로 나누어 교차 연산하므로 라운드 함수 $F$가 비가역적(일방향)이어도 키 순서만 반대로 넣으면 복호화가 가능합니다. 반면 **SPN 구조(AES, ARIA 등)는 블록 전체를 한 번에 변환하므로 복호화를 위해 각 단계(SubBytes, ShiftRows, MixColumns)가 반드시 가역적(역함수 InvSubBytes 등이 존재)이어야 합니다.**",
    keyPoint: "블록암호 구조 비교: Feistel 구조(DES, 3DES, SEED - 라운드 함수 역함수 불필요, 암·복호화 회로 동일) vs SPN 구조(AES, ARIA - 라운드 변환의 역함수 필수! Block 128bit, Key 128/192/256 → 10/12/14 라운드)"
  },
  {
    id: "Q408",
    subjectId: 4,
    year: "2025년 2회 기출유형",
    difficulty: "중",
    tags: ["PKI", "CRL", "OCSP", "인증서 폐지"],
    question: "공개키 기반구조(PKI)에서 사용자의 개인키 유출 등으로 인해 유효기간이 남아있는 인증서가 폐지(Revocation)되었는지 여부를 확인하는 방식에 대한 설명으로 옳은 것은?",
    options: [
      "OCSP(Online Certificate Status Protocol)는 클라이언트가 실시간으로 서버에 특정 인증서의 상태(Good, Revoked, Unknown)를 질의하여 즉각적인 유효성 검증을 수행한다.",
      "CRL(Certificate Revocation List)은 인증서 폐지 즉시 모든 클라이언트에 푸시(Push)되어 시간 지연(Time Lag) 문제가 전혀 발생하지 않는다.",
      "Delta CRL은 지금까지 폐지된 모든 인증서의 전체 누적 목록을 담고 있어 기본 CRL보다 파일 크기가 항상 크다.",
      "인증서의 전자서명은 인증서 소유자 본인의 개인키로 서명하여 위조를 방지한다."
    ],
    answer: 0,
    explanation: "1) 옳음: OCSP는 온라인으로 특정 인증서 일련번호의 실시간 상태(Good/Revoked/Unknown)만 응답받아 CRL의 실시간성 부족과 대용량 다운로드 문제를 해결합니다. 2) CRL은 주기적으로 발행되므로 다음 발행 주기까지 시간 지연이 있습니다. 3) Delta CRL은 이전 기본(Base) CRL 발행 이후 변경(추가 폐지)된 내역만 담아 크기를 줄인 방식입니다. 4) 인증서는 소유자가 아니라 발행 기관인 **CA(인증기관)의 개인키**로 전자서명됩니다.",
    keyPoint: "인증서 폐지 확인: CRL(주기적 폐지 목록 배포, 실시간성 부족) → Delta CRL(변경분만 배포해 용량 절감) → OCSP(실시간 온라인 상태 질의: Good/Revoked/Unknown)"
  },
  {
    id: "Q409",
    subjectId: 4,
    year: "2024년 1회 기출유형",
    difficulty: "하",
    tags: ["접근통제 정책", "DAC", "MAC", "RBAC"],
    question: "접근통제 정책 중 조직 내에서 사용자의 개인 식별자(ID)가 아니라 사용자가 수행하는 '직무나 직책(Role)'에 권한을 부여함으로써 인사이동이나 보직 변경 시 권한 관리의 복잡성을 크게 줄이고 직무 분리(SoD)를 효과적으로 구현할 수 있는 모델은?",
    options: [
      "RBAC (Role-Based Access Control, 역할 기반 접근통제)",
      "DAC (Discretionary Access Control, 임의적 접근통제)",
      "MAC (Mandatory Access Control, 강제적 접근통제)",
      "Bell-LaPadula (벨-라파둘라) 모델"
    ],
    answer: 0,
    explanation: "1) RBAC(역할 기반 접근통제): 사용자(User) ↔ 역할(Role) ↔ 권한(Permission)을 매핑하는 비임의적 접근통제로 기업/상업 환경에서 가장 널리 쓰입니다. 2) DAC(임의적 접근통제): 객체의 소유자가 임의로 권한 부여(신분 기반, ACL). 3) MAC(강제적 접근통제): 시스템이 주체와 객체의 보안 등급(Label)을 비교해 강제 통제(규칙 기반).",
    keyPoint: "접근통제 3대 정책: DAC(소유자 중심, 신분 기반, ACL) / MAC(시스템 중심, 보안등급/레이블 기반, BLP·Biba) / RBAC(직무/역할 기반, 기업 인사변동 관리 최적화)"
  },
  {
    id: "Q410",
    subjectId: 4,
    year: "2023년 2회 기출유형",
    difficulty: "중",
    tags: ["MAC", "HMAC", "CMAC", "전자서명", "부인방지"],
    question: "메시지 인증 코드(MAC: Message Authentication Code)와 전자서명(Digital Signature)을 비교한 설명으로 옳은 것은?",
    options: [
      "MAC은 송신자와 수신자가 동일한 대칭키(비밀키)를 공유하므로 메시지 무결성과 개체 인증은 제공하지만, 제3자에게 증명하는 '부인방지(Non-repudiation)' 기능은 제공하지 못한다.",
      "전자서명은 송신자의 공개키로 서명을 생성하고 수신자의 개인키로 서명을 검증한다.",
      "HMAC은 블록 암호 알고리즘을 기반으로 하고, CMAC은 해시 함수를 기반으로 동작한다.",
      "MAC과 전자서명 모두 메시지 본문 전체를 암호화하여 제3자가 내용을 볼 수 없게 하는 기밀성(Confidentiality) 보장 기술이다."
    ],
    answer: 0,
    explanation: "1) 옳음: MAC(HMAC, CMAC 등)은 송·수신자가 같은 대칭키를 공유하므로 수신자도 동일한 MAC 값을 생성할 수 있어 제3자 앞에서 누가 만들었는지 증명하는 '부인방지'가 불가능합니다. 2) 전자서명은 **송신자의 개인키로 서명**하고 **송신자의 공개키로 검증**하며 부인방지를 제공합니다. 3) HMAC은 해시 함수 기반, CMAC/CBC-MAC은 블록 암호 기반입니다. 4) 두 기술 모두 무결성·인증 기술이며 기밀성(암호화)과는 별개입니다.",
    keyPoint: "해시 vs MAC vs 전자서명: 해시(키 없음, 무결성만) / MAC(대칭키 사용, 무결성+인증, 부인방지X) / 전자서명(비대칭키 사용: 송신자 개인키 서명·공개키 검증, 무결성+인증+부인방지O)"
  },
  {
    id: "Q411",
    subjectId: 4,
    year: "2022년 2회 기출유형",
    difficulty: "상",
    tags: ["RSA", "계산문제", "오일러 피 함수", "공개키", "개인키"],
    question: "RSA 공개키 암호 알고리즘에서 두 소수 p = 3, q = 11을 선택하고 공개키 지수 e = 7로 설정했을 때, 이에 대응하는 개인키 지수 d의 값으로 올바른 것은? (단, ed ≡ 1 (mod φ(n)))",
    options: [
      "d = 3",
      "d = 5",
      "d = 9",
      "d = 13"
    ],
    answer: 0,
    explanation: "RSA 키 생성 공식: 1) $n = p \\times q = 3 \\times 11 = 33$ 2) 오일러 피 함수 $\\phi(n) = (p-1)(q-1) = 2 \\times 10 = 20$ 3) 개인키 $d$는 $e \\times d \\equiv 1 \\pmod{\\phi(n)}$을 만족해야 하므로 $7 \\times d \\equiv 1 \\pmod{20}$ 입니다. $d = 3$일 때 $7 \\times 3 = 21$이고 20으로 나눈 나머지가 1이 되므로 $d = 3$입니다.",
    keyPoint: "RSA 계산 공식: n = p×q, φ(n) = (p-1)(q-1), 공개키 e와 개인키 d의 관계: (e × d) mod φ(n) = 1 | 암호화 C = M^e mod n, 복호화 M = C^d mod n"
  },
  {
    id: "Q412",
    subjectId: 4,
    year: "2023년 1회 기출유형",
    difficulty: "중",
    tags: ["OTP", "S/KEY", "해시체인", "2FA", "인증"],
    question: "일회용 패스워드(OTP) 생성 방식 중 Lamport의 해시 체인(Hash Chain)에 기반한 S/KEY 인증 시스템과 주요 OTP 방식에 대한 설명으로 틀린 것은?",
    options: [
      "S/KEY는 클라이언트에서 시드(Seed)에 일방향 해시 함수를 N번 반복 적용하여 생성한 값 중 N-1번째, N-2번째... 값을 역순으로 서버에 전송하여 인증한다.",
      "시간 동기화(Time-Synchronized, TOTP) 방식은 클라이언트와 서버가 현재 시각(예: 30초~1분 단위)을 입력값으로 사용하여 일회용 비밀번호를 생성한다.",
      "챌린지-응답(Challenge-Response) 방식은 서버가 보낸 난수(Challenge)를 클라이언트가 비밀키와 연산하여 응답값(Response)을 돌려주는 비동기식 방식이다.",
      "이벤트 동기화(HOTP) 방식은 시간 동기화만 맞으면 클라이언트가 버튼을 수백 번 눌러 카운터가 어긋나도 항상 인증에 성공한다."
    ],
    answer: 3,
    explanation: "이벤트 동기화(카운터 동기화, HOTP) 방식은 클라이언트와 서버가 각각 OTP 생성 횟수(Counter)를 증가시키며 동기화하므로, 사용자가 OTP 생성 버튼을 여러 번 눌러 카운터 차이가 허용 윈도우(Window) 범위를 벗어나면 동기화가 깨져 인증에 실패합니다.",
    keyPoint: "OTP 4대 방식: S/KEY(일방향 해시 체인 역순 사용, N-1 → N-2...), 시간 동기화(TOTP: 시각 기준), 이벤트 동기화(HOTP: 생성 횟수 카운터 기준), 챌린지-응답(서버 난수 질의값 연산)"
  },

  // ================= [추가 확장] 5과목: 정보보안 관리 및 법규 (Q507 ~ Q512) =================
  {
    id: "Q507",
    subjectId: 5,
    year: "2026년 2회 기출유형",
    difficulty: "중",
    tags: ["정량적 위험분석", "SLE", "ALE", "ARO", "EF"],
    question: "정보보호 위험 분석에서 자산 가치(AV)가 2억 원인 웹 서버가 특정 위협에 노출될 경우 자산의 25%(노출계수 EF = 0.25)가 손실될 것으로 평가되었다. 이 위협이 2년에 1회꼴(연간발생률 ARO = 0.5)로 발생한다고 할 때, 단일예상손실(SLE)과 연간예상손실(ALE)은 얼마인가?",
    options: [
      "SLE: 5,000만 원 / ALE: 2,500만 원",
      "SLE: 2,500만 원 / ALE: 5,000만 원",
      "SLE: 1억 원 / ALE: 5,000만 원",
      "SLE: 5,000만 원 / ALE: 1억 원"
    ],
    answer: 0,
    explanation: "정량적 위험분석 공식: 1) **단일예상손실(SLE)** = 자산가치(AV) × 노출계수(EF) = 2억 원 × 0.25 = **5,000만 원**. 2) **연간예상손실(ALE)** = 단일예상손실(SLE) × 연간발생률(ARO) = 5,000만 원 × 0.5(2년에 1번) = **2,500만 원**.",
    keyPoint: "정량적 위험 계산 필수 공식: SLE = AV × EF | ALE = SLE × ARO (예: 4년에 1번 발생이면 ARO = 0.25)"
  },
  {
    id: "Q508",
    subjectId: 5,
    year: "2025년 2회 기출유형",
    difficulty: "중",
    tags: ["정보통신망법", "침해사고 신고", "24시간", "ISMS 의무대상"],
    question: "「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따른 침해사고 대응 및 ISMS 인증 의무에 대한 설명으로 옳은 것은?",
    options: [
      "정보통신서비스 제공자는 침해사고가 발생한 것을 알게 된 때부터 24시간 이내에 과학기술정보통신부장관 또는 한국인터넷진흥원(KISA)에 신고하여야 한다.",
      "정보통신서비스 부문의 전년도 매출액이 10억 원 이상이면 이용자 수와 무관하게 무조건 ISMS 의무 인증 대상이 된다.",
      "침해사고의 원인 분석을 위해 과학기술정보통신부장관은 어떠한 경우에도 민간 사업자의 사업장에 출입하거나 자료 제출을 요구할 수 없다.",
      "ISMS 의무 인증 대상자가 인증을 받지 아니한 경우 10년 이하의 징역에 처한다."
    ],
    answer: 0,
    explanation: "1) 옳음: 정보통신망법 제48조의3에 따라 정보통신서비스 제공자는 침해사고 발생을 알게 된 때부터 **24시간 이내**에 과기정통부장관 또는 KISA에 신고해야 합니다. 2) ISMS 의무 대상 매출/이용자 기준은 정보통신서비스 부문 전년도 매출액 **100억 원 이상** 또는 전년도 직전 3개월간 일일 평균 이용자 수 **100만 명 이상**(또는 연간 매출액/세입 1,500억 원 이상 상급종합병원·학교, ISP, IDC)입니다. 4) 미인증 시 3천만 원 이하의 과태료가 부과됩니다.",
    keyPoint: "정보통신망법 핵심 숫자: 침해사고 신고 = 알게 된 때부터 '24시간 이내'(과기정통부/KISA) | ISMS 의무 기준: ISP, IDC, 매출·세입 1,500억↑ 병원/학교, 정보통신 매출 100억↑, 일평균 이용자 100만명↑ (미이행 시 과태료 3천만원 이하)"
  },
  {
    id: "Q509",
    subjectId: 5,
    year: "2024년 1회 기출유형",
    difficulty: "중",
    tags: ["개인정보 영향평가", "PIA", "공공기관", "5만명", "100만명"],
    question: "「개인정보 보호법」 및 동법 시행령에 따라 공공기관의 장이 개인정보파일의 운용으로 인하여 정보주체의 개인정보 침해가 우려되는 경우 의무적으로 '개인정보 영향평가(PIA)'를 수행해야 하는 대상 기준으로 옳지 않은 것은?",
    options: [
      "구축·운용 또는 변경하려는 개인정보파일로서 5만 명 이상의 정보주체에 관한 민감정보 또는 고유식별정보의 처리가 수반되는 개인정보파일",
      "구축·운용하고 있는 개인정보파일을 해당 공공기관 내부 또는 외부에서 구축·운용하고 있는 다른 개인정보파일과 연계하려는 경우로서 연계 결과 50만 명 이상의 정보주체에 관한 개인정보가 포함되는 개인정보파일",
      "구축·운용 또는 변경하려는 개인정보파일로서 100만 명 이상의 정보주체에 관한 개인정보파일",
      "민간 중소기업이 내부 임직원 100명의 급여 지급을 위해 구축하는 인사·급여 관리용 개인정보파일"
    ],
    answer: 3,
    explanation: "개인정보 영향평가(PIA) 의무 대상은 **공공기관**이 구축·운용·변경하는 개인정보파일 중 ① **5만 명 이상** 민감정보·고유식별정보 처리 ② 타 파일과 연계 결과 **50만 명 이상** ③ **100만 명 이상**의 정보주체에 관한 개인정보파일입니다. 민간 기업은 법적 의무 대상이 아니라 자율적 수행(노력 의무) 대상입니다.",
    keyPoint: "개인정보 영향평가(PIA) 의무 대상: '공공기관' + (5만명↑ 민감·고유식별정보 / 50만명↑ 파일 연계 / 100만명↑ 일반 개인정보파일)"
  },
  {
    id: "Q510",
    subjectId: 5,
    year: "2023년 2회 기출유형",
    difficulty: "하",
    tags: ["비밀번호 작성규칙", "안전성 확보조치", "8자리", "10자리"],
    question: "「개인정보의 안전성 확보조치 기준」에 따라 개인정보처리자가 개인정보취급자 또는 정보주체의 비밀번호 작성규칙을 수립할 때, 영문 대문자·영문 소문자·숫자·특수문자 중 '2종류 이상'을 조합하는 경우와 '3종류 이상'을 조합하는 경우의 최소 길이 기준으로 옳게 짝지어진 것은?",
    options: [
      "2종류 이상 조합: 최소 10자리 이상 / 3종류 이상 조합: 최소 8자리 이상",
      "2종류 이상 조합: 최소 8자리 이상 / 3종류 이상 조합: 최소 10자리 이상",
      "2종류 이상 조합: 최소 6자리 이상 / 3종류 이상 조합: 최소 8자리 이상",
      "2종류 이상 조합: 최소 12자리 이상 / 3종류 이상 조합: 최소 10자리 이상"
    ],
    answer: 0,
    explanation: "개인정보의 안전성 확보조치 기준에 따른 비밀번호 작성규칙은 문자 종류(영문 대·소문자, 숫자, 특수문자) 중 **2종류 이상을 조합하여 최소 10자리 이상** 또는 **3종류 이상을 조합하여 최소 8자리 이상**의 길이로 구성하여야 합니다.",
    keyPoint: "비밀번호 작성규칙 공식 숫자: 2종류 조합 → 10자리 이상 / 3종류 이상 조합 → 8자리 이상"
  },
  {
    id: "Q511",
    subjectId: 5,
    year: "2022년 3회 기출유형",
    difficulty: "중",
    tags: ["주요정보통신기반시설", "취약점 분석 평가", "보호대책"],
    question: "「정보통신기반 보호법」에 따른 주요정보통신기반시설의 지정 및 취약점 분석·평가에 대한 설명으로 옳지 않은 것은?",
    options: [
      "중앙행정기관의 장은 소관 분야의 정보통신기반시설 중 전자적 침해행위로부터의 보호가 필요하다고 인정되는 시설을 주요정보통신기반시설로 지정할 수 있다.",
      "관리기관의 장은 주요정보통신기반시설로 지정된 후 6개월 이내에 최초 취약점 분석·평가를 실시하고, 이후 매년(연 1회) 취약점 분석·평가를 실시하여야 한다.",
      "관리기관의 장은 취약점 분석·평가 결과를 반영하여 매년 주요정보통신기반시설 보호대책을 수립·시행하여야 한다.",
      "주요정보통신기반시설의 취약점 분석·평가는 개인 프리랜서 누구나 별도의 지정이나 자격 요건 없이 대행하여 수행할 수 있다."
    ],
    answer: 3,
    explanation: "주요정보통신기반시설의 취약점 분석·평가는 관리기관이 자체 수행하거나, 한국인터넷진흥원(KISA), 정보공유분석센터(ISAC), 정보보호 전문서비스 기업 등 법에서 정한 전문 기관에만 의뢰하여 수행할 수 있습니다. 주기는 기본적으로 **매년(연 1회)** 실시합니다.",
    keyPoint: "정보통신기반 보호법 핵심: 지정 주체 = 관할 중앙행정기관의 장 | 취약점 분석·평가 주기 = 최초 지정 후 6개월 이내, 이후 매년(연 1회) 실시"
  },
  {
    id: "Q512",
    subjectId: 5,
    year: "2023년 1회 기출유형",
    difficulty: "하",
    tags: ["ISO 27001", "PDCA", "위험분석 방법론", "정성적", "정량적"],
    question: "정보보호 위험분석 방법론 중 화폐 단위나 수치 대신 설문서, 인터뷰, 델파이 기법, 순위 결정법 등을 활용하여 위험의 상대적 크기를 평가하는 '정성적 위험분석(Qualitative Risk Analysis)'의 특징으로 가장 적절한 것은?",
    options: [
      "정량적 분석에 비해 계산에 소요되는 시간과 비용이 적게 들지만, 평가자의 주관적 판단이 개입될 수 있어 결과의 객관성이 상대적으로 낮다.",
      "단일예상손실(SLE)과 연간예상손실(ALE)을 정확한 금액(원/달러)으로 산출하므로 비용 대비 효과 분석(CBA)에 가장 유리하다.",
      "수십 년간 축적된 정확한 통계적 위협 발생 확률 데이터가 반드시 있어야만 수행할 수 있다.",
      "계산 과정이 매우 복잡하여 자동화된 수학적 시뮬레이션 소프트웨어 없이는 수행이 불가능하다."
    ],
    answer: 0,
    explanation: "정성적 위험분석(델파이법, 시나리오법, 순위결정법, 퍼지 행렬법)은 과거 통계 데이터나 정확한 자산 가치 산정이 어려울 때 전문가의 경험과 직관으로 빠르게 평가할 수 있어 시간·노력이 적게 들지만, 주관성이 개입되어 비용 대비 효과(ROI/CBA)를 화폐 가치로 입증하기 어렵다는 단점이 있습니다.",
    keyPoint: "정량적 위험분석(수치/화폐, SLE/ALE, 객관적, 비용효과분석 용이, 통계자료 필요·시간 많이 소요) vs 정성적 위험분석(델파이/순위/시나리오, 빠르고 간편, 주관적 개입)"
  }
];

// 과목별 핵심 요약 사전 구축 데이터
window.SUBJECT_SUMMARIES = {
  1: {
    title: "1과목: 시스템 보안 핵심 요약 노트",
    examWeight: "20문항 (과락 기준 40점, 목표 75점+)",
    sections: [
      {
        topic: "1. 리눅스/유닉스 로그 및 권한 관리 (출제율 99%)",
        bullets: [
          "바이너리 로그 4종: `/var/log/utmp`(현재 로그인 상태 → `w`, `who`, `users`), `/var/log/wtmp`(로그인/아웃·재부팅 이력 → `last`), `/var/log/btmp`(실패한 로그인 → `lastb`), `/var/log/lastlog`(최근 접속 시각 → `lastlog`)",
          "텍스트 로그: `/var/log/messages`(시스템 전반), `/var/log/secure`(인증/보안 로그), `/var/log/xferlog`(FTP 전송 로그)",
          "특수 권한: **SetUID(4000)** 실행 시 소유자 권한(예: `/usr/bin/passwd`), **SetGID(2000)** 그룹 권한, **Sticky Bit(1000)** 공유 디렉터리(`/tmp`)에서 소유자와 root만 삭제 가능. 기존 실행권한(x)이 없을 때 대문자(`S`, `T`)로 표시.",
          "`umask`: 파일 기본 권한(666), 디렉터리 기본 권한(777)에서 차감(AND NOT 연산). 예: `umask 022` → 파일 `644`, 디렉터리 `755`."
        ]
      },
      {
        topic: "2. 메모리 공격 및 보호 기법 (빈출 핵심)",
        bullets: [
          "**Stack Buffer Overflow**: RET(복귀 주소)를 덮어써 쉘코드 주소로 점프. **Heap BOF**: 동적 할당 영역(malloc) 함수 포인터 변조.",
          "**Format String Attack**: `printf(buf)`처럼 포맷 지정자 없이 사용 시 `%x`(메모리 열람), `%n`(해당 주소에 출력 바이트 수 기록)을 악용.",
          "**메모리 보호 3대장**: ① **Stack Guard(Canary)**(RET 앞 카나리 값 변조 검사: Random, Terminator, XOR) ② **DEP / NX**(스택·힙 실행 권한 제거 → RTL, ROP 공격으로 우회 가능) ③ **ASLR**(실행 시마다 스택·힙·라이브러리 주소를 난수화)."
        ]
      },
      {
        topic: "3. Windows 보안 및 PAM 모듈",
        bullets: [
          "**Windows 계정/인증**: 로컬 패스워드 해시(NTLM)는 `SAM` 파일에 저장. SID 끝자리 **RID 500(Administrator)**, **501(Guest)**, **1000~(일반 사용자)**.",
          "**리눅스 PAM 모듈**: 로그인 실패 잠금(`pam_tally2.so`, `pam_faillock.so` - `deny=5 unlock_time=600`), 패스워드 복잡도(`pam_cracklib.so`, `pam_pwquality.so` - `lcredit`, `ucredit`, `dcredit`, `ocredit`), root 콘솔 제한(`pam_securetty.so`)."
        ]
      }
    ]
  },
  2: {
    title: "2과목: 네트워크 보안 핵심 요약 노트",
    examWeight: "20문항 (과락 기준 40점, 목표 70점+)",
    sections: [
      {
        topic: "1. L2/L3/L4 스니핑·스푸핑 및 포트 스캔",
        bullets: [
          "**L2 스위치 공격**: **MAC Flooding**(위조 MAC 대량 전송으로 CAM 테이블을 채워 더미 허브처럼 브로드캐스트 유발 → 스위치 Port Security로 방어), **ARP Spoofing**(위조 ARP Reply 전송으로 MAC 주소 변조 MITM → `arp -s` 정적 등록 및 DAI로 방어).",
          "**포트 스캔(Nmap)**: TCP Open(3-way 완료), **TCP SYN(Half-open)**(SYN+ACK 수신 시 RST 전송하여 로그 회피), **FIN / XMAS / NULL 스캔**(Open 시 무응답, Closed 시 RST 응답 — 단, Windows에는 미동작), **UDP 스캔**(Closed 시 ICMP Port Unreachable 응답)."
        ]
      },
      {
        topic: "2. DoS / DDoS 공격 완벽 분류",
        bullets: [
          "**대역폭/자원 소진형**: SYN Flooding(Backlog Queue 고갈 → `tcp_syncookies`, Backlog 증설로 방어), Smurf(ICMP Echo + Directed Broadcast 증폭), Land Attack(출발지 IP=목적지 IP), Teardrop/Bonk/Boink(IP 단편화 오프셋 조작), Ping of Death(65,535 바이트 초과 ICMP).",
          "**L7 웹 애플리케이션 DDoS**: **HTTP GET Flooding / CC Attack**(Cache-Control 헤더로 캐시 서버 우회), **Slowloris**(HTTP Header 끝 `\\r\\n\\r\\n` 미전송), **RUDY**(HTTP POST `Content-Length`를 크게 잡고 1바이트씩 지연 전송), **Slow Read**(TCP Window Size를 극도로 작게 설정)."
        ]
      },
      {
        topic: "3. IPSec, SSL/TLS, 무선랜 및 Snort Rule",
        bullets: [
          "**IPSec(L3)**: **AH**(무결성+발신지 인증, 암호화X) vs **ESP**(기밀성 암호화+무결성+인증) / **전송 모드**(IP 페이로드만 보호, 호스트 간) vs **터널 모드**(전체 IP 패킷 암호화 후 새 IP 헤더 부착, VPN 게이트웨이 간).",
          "**무선랜(802.11)**: WEP(RC4, 24bit IV 취약) → WPA(TKIP+RC4, Michael MIC) → **WPA2(802.11i, AES 기반 CCMP)** → **WPA3(SAE/Dragonfly 키 교환, 오프라인 사전공격 방어 및 전방향 안전성)**.",
          "**Snort Rule 옵션**: 절대 위치 `offset`(시작점) + `depth`(탐지 깊이) / 상대 위치(이전 매칭 기준) `distance`(간격) + `within`(탐지 범위)."
        ]
      }
    ]
  },
  3: {
    title: "3과목: 애플리케이션 보안 핵심 요약 노트",
    examWeight: "20문항 (과락 기준 40점, 목표 75점+)",
    sections: [
      {
        topic: "1. 웹 해킹 핵심 취약점 (XSS, CSRF, SQLi, SSRF)",
        bullets: [
          "**XSS vs CSRF**: **XSS**는 클라이언트 브라우저에서 악성 스크립트가 실행됨(Reflected, Stored, DOM 기반 / 대책: 입출력 HTML Entity 치환 `< > & \" '`, `HttpOnly` 쿠키, CSP). **CSRF**는 피해자의 인증 세션을 이용해 서버에 위조된 요청(비밀번호 변경, 송금 등)을 전송함(대책: **CSRF Token**, Referer 검증, 재인증/CAPTCHA, `SameSite` 쿠키).",
          "**SQL Injection**: 근본 대책은 **Prepared Statement(바인딩 변수)** 사용. 단, 테이블명·컬럼명·`ORDER BY` 절에는 바인딩이 불가능하므로 반드시 **화이트리스트(허용 목록) 검증** 적용.",
          "**SSRF(Server-Side Request Forgery)**: 웹 서버가 내부망(`127.0.0.1`, 사설 IP)이나 클라우드 메타데이터(`169.254.169.254`)를 대신 호출하게 만드는 공격 → URL 화이트리스트 및 내부 IP 차단으로 방어."
        ]
      },
      {
        topic: "2. 파일 업로드, 이메일 보안 및 DB 암호화",
        bullets: [
          "**파일 업로드(웹셸) 방어**: ① 확장자 화이트리스트 검증 ② 업로드 폴더의 **실행 권한(x) 제거** ③ 저장 파일명 난수화 및 웹 루트 외부 저장 ④ Magic Number(파일 시그니처) 검증.",
          "**이메일 보안**: **SPF**(DNS에 발송 허용 서버 IP 등록), **DKIM**(발신 서버 개인키 전자서명 + DNS 공개키 검증), **DMARC**(SPF+DKIM 기반 실패 메일 처리 정책). 내용 암호화·서명은 **PGP**, **S/MIME**.",
          "**DB 암호화 방식**: **API 방식**(애플리케이션에서 암복호화, DB 부하↓, App 수정↑), **Plug-in 방식**(DB 모듈+뷰/트리거, DB 부하↑, App 수정↓), **TDE 방식**(DB 커널/파일 블록 레벨 자동 암호화, App 수정 없음)."
        ]
      }
    ]
  },
  4: {
    title: "4과목: 정보보안 일반 핵심 요약 노트",
    examWeight: "20문항 (과락 기준 40점, 고득점 전략 과목 목표 80점+)",
    sections: [
      {
        topic: "1. 대칭키 블록 암호 운용 모드 & 공개키 암호",
        bullets: [
          "**블록 암호 운용 모드**: **ECB**(블록 독립 암호화, 패턴 노출, 암·복호화 모두 병렬 가능), **CBC**(IV 사용, 평문과 이전 암호문 XOR, 암호화 직렬 / **복호화 병렬 가능**), **CFB / OFB / CTR**(스트림 암호화 방식, 패딩 불필요, **복호화 시에도 블록 암호의 암호화(E) 함수 사용**), **CTR**(암·복호화 모두 병렬 가능, 임의 접근 가능), **GCM**(CTR 암호화 + GMAC 인증).",
          "**공개키 수학적 기반**: **소인수분해**(RSA, Rabin) vs **이산대수**(Diffie-Hellman, ElGamal, DSA, Schnorr, ECC). *주의: Diffie-Hellman은 인증 기능이 없어 중간자 공격(MITM)에 취약!*"
        ]
      },
      {
        topic: "2. 해시 함수, 전자서명 및 인증(Kerberos)",
        bullets: [
          "**해시 함수 3대 성질**: **역상 저항성**(해시값 `h`로 원본 `x` 찾기 불가), **제2역상 저항성**(특정 입력 `x`와 같은 해시값을 갖는 `y` 찾기 불가), **충돌 저항성**(임의의 `H(x)=H(y)` 쌍 찾기 불가, **생일 공격 복잡도 $2^{n/2}$**).",
          "**특수 전자서명**: **은닉 서명(Blind)**(서명자가 내용을 모른 채 서명, 전자투표/전자화폐 익명성 보장), **부인방지 서명**(서명자 협조 없이 검증 불가), **그룹 서명**(익명 서명하되 그룹 관리자는 신원 추적 가능).",
          "**Kerberos(커버로스)**: 대칭키 기반 티켓 SSO(KDC = AS + TGS). 타임스탬프로 재전송 공격 방지(시간 동기화 필수), KDC 단일 장애점(SPOF)."
        ]
      },
      {
        topic: "3. 접근통제 보안 모델 (무조건 1~2문제 출제)",
        bullets: [
          "**BLP(Bell-LaPadula)**: 군사용 **기밀성** 모델 → **No Read Up**(단순 보안 속성), **No Write Down**(*-속성).",
          "**Biba(비바)**: **무결성** 모델 → **No Read Down**(하위 오염 데이터 읽기 금지), **No Write Up**(상위 데이터 변조 금지).",
          "**Clark-Wilson**: 상업용 무결성 모델(직무 분리, 잘 형성된 트랜잭션 TP, 무결성 검증 프로시저 IVP, CDI/UDI).",
          "**Chinese Wall(Brewer-Nash)**: 이해상충 방지 모델(동일 이해상충 그룹 내 타 기업 정보 접근 차단)."
        ]
      }
    ]
  },
  5: {
    title: "5과목: 정보보안 관리 및 법규 핵심 요약 노트",
    examWeight: "20문항 (과락 기준 40점, 암기 시 안정적 75점+)",
    sections: [
      {
        topic: "1. ISMS-P 인증 제도 및 위험 관리",
        bullets: [
          "**ISMS-P 인증**: 유효기간 **3년**, 매년 1회 이상 **사후심사**, 만료 **3개월 전** 갱신심사 신청. 통제항목: 관리체계 수립·운영(16) + 보호대책(64) = ISMS(80개) + 개인정보 처리단계(21~22) = ISMS-P(101~102개).",
          "**위험 관리 공식**: $SLE(단일예상손실) = AV(자산가치) \\times EF(노출계수)$, $ALE(연간예상손실) = SLE \\times ARO(연간발생률)$.",
          "**위험 처리 4대 방안**: **위험 수용**(DoA 이하 시 감수), **위험 감소**(보호대책 구현), **위험 회피**(해당 업무/시스템 포기·중단), **위험 전가**(보험 가입, 외주 위탁)."
        ]
      },
      {
        topic: "2. 업무연속성계획(BCP) 및 디지털 포렌식",
        bullets: [
          "**BCP 핵심 지표**: **RTO(복구 목표 시간)**(중단 시점부터 업무 복구까지 목표 시간) vs **RPO(복구 목표 시점)**(허용 가능한 데이터 손실 시점).",
          "**재해복구센터(DR)**: **미러 사이트**(Active-Active 실시간 동기화, RTO ≈ 0) > **핫 사이트**(Active-Standby, 수 시간) > **웜 사이트**(핵심 장비만 보유, 수 일) > **콜드 사이트**(장소만 확보, 수 주).",
          "**디지털 포렌식**: 5대 원칙(정당성, 재현성, 신속성, 연계보관성, 무결성). **RFC 3227 휘발성 수집 순서**: 레지스터·캐시 → RAM·네트워크 상태(ARP/라우팅) → 하드디스크 → 백업 미디어."
        ]
      },
      {
        topic: "3. 개인정보 보호법 및 정보통신망법 핵심 숫자",
        bullets: [
          "**개인정보 유출 통지·신고**: 유출되었음을 알게 된 때부터 **72시간 이내** (신고 대상: 1천명 이상 유출, 민감·고유식별정보 유출, 불법적인 외부 접근/해킹 유출). *참고: 정보통신망법상 침해사고 신고는 **24시간 이내**.*",
          "**개인정보 안전성 확보조치**: 비밀번호는 복호화 불가능하도록 **일방향(해시) 암호화** 저장. 접속기록 보관: **최소 1년 이상**(5만명 이상 또는 고유식별·민감정보 처리 시 **2년 이상**). 접속기록 점검: **월 1회 이상**."
        ]
      }
    ]
  }
};

