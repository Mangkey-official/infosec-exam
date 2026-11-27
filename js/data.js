// 정보보안기사 필기 5과목 핵심 기출문제 및 요약 데이터베이스
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
    year: "2024년 1회 기출유형",
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
    year: "2024년 2회 기출유형",
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
    year: "2024년 2회 기출유형",
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
    year: "2024년 1회 기출유형",
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
    year: "2024년 2회 기출유형",
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
    year: "2024년 1회 기출유형",
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
    year: "2024년 2회 기출유형",
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
    year: "2024년 1회 기출유형",
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
    year: "2024년 2회 기출유형",
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
    year: "2024년 1회 기출유형",
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
