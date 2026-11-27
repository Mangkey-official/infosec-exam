// 정보보안기사 필기 5과목 상세 비주얼 요약본 데이터 (비교표, 핵심 요약, 기출 함정 포인트, 초압축 숫자/명령어 족보)

window.QUICK_CHEATSHEET = [
  {
    category: "🐧 리눅스/시스템 필수 숫자 & 명령어",
    color: "blue",
    items: [
      { key: "SetUID / SetGID / Sticky Bit", val: "4000 (s/S) / 2000 (s/S) / 1000 (t/T) — 실행권한(x) 없으면 대문자" },
      { key: "umask 기본값 계산", val: "파일 최대 666 - umask / 디렉터리 최대 777 - umask (예: 022 → 644 / 755)" },
      { key: "리눅스 4대 바이너리 로그", val: "utmp(현재: who, w) / wtmp(이력: last) / btmp(실패: lastb) / lastlog(최근접속: lastlog)" },
      { key: "Windows 주요 SID(RID)", val: "500 (Administrator) / 501 (Guest) / 1000 이상 (일반 사용자)" },
      { key: "Windows 보안 이벤트 ID", val: "4624(로그온 성공), 4625(로그온 실패), 4672(특수권한 할당), 4720(계정 생성)" }
    ]
  },
  {
    category: "🌐 네트워크 & 보안장비 필수 포트/옵션",
    color: "emerald",
    items: [
      { key: "주요 보안 프로토콜 포트", val: "SSH(22), DNS(53), Kerberos(88), SNMP(161/162), HTTPS(443), IPSec IKE(UDP 500), RADIUS(1812/1813)" },
      { key: "스텔스 스캔 (FIN/XMAS/NULL)", val: "열림(Open) → 무응답 / 닫힘(Closed) → RST 응답 (※ Windows는 항상 RST 응답)" },
      { key: "Snort 페이로드 위치 옵션", val: "절대 위치: offset(시작점) + depth(검색폭) / 상대 위치: distance(이전매칭 후 간격) + within(검색폭)" },
      { key: "무선랜 암호화 진화", val: "WEP(RC4, 24bit IV) → WPA(TKIP+RC4, Michael) → WPA2(AES-CCMP) → WPA3(SAE/Dragonfly 키교환)" },
      { key: "L7 Slow DDoS 3종 구분", val: "Slowloris(Header \\r\\n\\r\\n 미전송) / RUDY(POST Body 1바이트씩 지연) / Slow Read(Window Size=0)" }
    ]
  },
  {
    category: "🔐 암호학 & 접근통제 필수 공식",
    color: "purple",
    items: [
      { key: "블록암호 복호화 시 '암호화(E)' 함수만 쓰는 모드", val: "CFB, OFB, CTR (스트림처럼 키스트림과 XOR 연산하므로)" },
      { key: "블록암호 병렬 처리 가능 여부", val: "암호화 병렬 가능: ECB, CTR / 복호화 병렬 가능: ECB, CBC, CFB, CTR (※ OFB는 암·복호화 모두 직렬)" },
      { key: "해시 충돌 탐색 복잡도 (n비트)", val: "역상·제2역상 저항성 = 2^n / 충돌 저항성(생일 역설 공격) = 2^(n/2)" },
      { key: "접근통제 모델 핵심 규칙", val: "BLP(기밀성: No Read Up, No Write Down) vs Biba(무결성: No Read Down, No Write Up)" },
      { key: "수학적 난제 분류", val: "소인수분해(RSA, Rabin) vs 이산대수(Diffie-Hellman, ElGamal, DSA, Schnorr, ECC)" }
    ]
  },
  {
    category: "⚖️ 보안 관리 & 법규 시험장 필수 숫자",
    color: "pink",
    items: [
      { key: "개인정보 유출 통지 및 신고 기한", val: "유출되었음을 알게 된 때부터 72시간 이내 (개정 개인정보보호법 일원화)" },
      { key: "정보통신망법 침해사고 신고 기한", val: "침해사고 발생을 알게 된 때부터 24시간 이내 (과기정통부 또는 KISA)" },
      { key: "접속기록 보관 및 점검 주기", val: "최소 1년 이상 보관 (5만명↑ 또는 고유식별·민감정보 처리 시 2년 이상) / 월 1회 이상 점검" },
      { key: "ISMS-P 통제항목 및 유효기간", val: "총 101개(관리체계 16 + 보호대책 64 + 개인정보 21) / 유효기간 3년 (매년 사후심사, 만료 3개월 전 갱신)" },
      { key: "위험관리 계산 공식", val: "단일예상손실(SLE) = 자산가치(AV) × 노출계수(EF) / 연간예상손실(ALE) = SLE × 연간발생률(ARO)" },
      { key: "패스워드 작성규칙 최소 길이", val: "영문·숫자·특수문자 중 2종류 조합 시 10자리 이상 / 3종류 이상 조합 시 8자리 이상" }
    ]
  }
];

window.DETAILED_SUBJECT_SUMMARIES = {
  1: {
    title: "1과목: 시스템 보안 완벽 마스터 노트",
    examWeight: "20문항 출제 · 과락 40점 / 목표 80점+",
    overview: "리눅스/유닉스 로그·권한·PAM 설정과 메모리 보호기법(BOF·ASLR·DEP), Windows SAM·레지스트리·이벤트 로그에서 85% 이상 출제됩니다.",
    sections: [
      {
        id: "s1-1",
        topic: "1. 리눅스 핵심 로그 파일 7종 비교",
        importance: "★★★ 무조건 출제",
        summary: "바이너리 로그 4종(utmp, wtmp, btmp, lastlog)과 텍스트 로그 3종의 저장 형태 및 확인 명령어를 정확히 매칭해야 합니다.",
        table: {
          headers: ["로그 파일 경로", "저장 형식", "확인 명령어", "기록 내용 및 핵심 특징"],
          rows: [
            ["/var/log/utmp", "Binary (바이너리)", "w, who, users, finger", "현재 시스템에 로그인되어 있는 사용자 상태 정보"],
            ["/var/log/wtmp", "Binary (바이너리)", "last", "성공한 로그인/로그아웃 이력 및 시스템 재부팅(reboot) 이력"],
            ["/var/log/btmp", "Binary (바이너리)", "lastb", "실패한 로그인 시도 이력 (5회 이상 실패 등 무차별 대입 공격 흔적)"],
            ["/var/log/lastlog", "Binary (바이너리)", "lastlog", "각 사용자 계정의 가장 최근 성공한 로그인 시각과 접속 IP"],
            ["/var/log/secure", "Text (텍스트)", "cat, tail, grep, vi", "사용자 인증, su, sudo, sshd 등 보안/인증 관련 직접 기록 (Ubuntu는 auth.log)"],
            ["/var/log/messages", "Text (텍스트)", "cat, tail, dmesg", "시스템 운영 전반의 표준 에러 및 커널·데몬 메시지"],
            ["/var/log/xferlog", "Text (텍스트)", "cat, vi", "FTP(vsftpd, proftpd) 파일 업로드/다운로드 전송 로그"]
          ]
        },
        bullets: [
          "**xferlog 주요 플래그**: 방향 `i`(Incoming 업로드), `o`(Outgoing 다운로드) / 전송모드 `a`(ASCII), `b`(Binary) / 완료상태 `c`(Complete 완료), `i`(Incomplete 미완료)"
        ],
        trap: "⚠️ 기출 함정: '/var/log/lastlog나 wtmp를 cat 또는 vi 편집기로 열어서 확인한다'는 선지는 무조건 오답입니다! 바이너리 파일이므로 반드시 전용 명령어(lastlog, last, who, lastb)로만 조회할 수 있습니다."
      },
      {
        id: "s1-2",
        topic: "2. 리눅스 파일 권한, 특수 권한(SetUID) & PAM 모듈",
        importance: "★★★ 빈출 핵심",
        summary: "SetUID가 부여된 root 소유 실행 파일은 권한 상승 공격의 주요 표적이 됩니다. PAM 모듈의 설정 파일과 옵션도 매회 출제됩니다.",
        table: {
          headers: ["구분 / 모듈명", "설정 값 / 경로", "주요 옵션 및 역할", "비고 / 보안 대책"],
          rows: [
            ["SetUID", "8진수 4000 (-rwsr-xr-x)", "실행 시 파일 소유자(주로 root) 권한으로 EUID 변경", "찾기: find / -perm -4000 (예: /usr/bin/passwd)"],
            ["SetGID", "8진수 2000 (-rwxr-sr-x)", "실행 시 파일 소유 그룹 권한으로 EGID 변경", "찾기: find / -perm -2000"],
            ["Sticky Bit", "8진수 1000 (drwxrwxrwt)", "공유 폴더(/tmp)에서 파일 소유자와 root만 삭제 가능", "누구나 생성 가능하지만 타인 파일 삭제 불가"],
            ["pam_tally2.so / pam_faillock.so", "/etc/pam.d/system-auth", "deny=5 unlock_time=600 no_magic_root", "로그인 실패 횟수 임계치 도달 시 계정 잠금"],
            ["pam_pwquality.so / pam_cracklib.so", "/etc/pam.d/system-auth", "minlen=8 lcredit=-1 ucredit=-1 dcredit=-1 ocredit=-1", "패스워드 최소 길이 및 영문 대/소/숫자/특수문자 강제"],
            ["pam_securetty.so", "/etc/securetty", "콘솔(tty) 외 pts/x 단말에서 root 직접 로그인 차단", "SSH root 접속 차단(/etc/ssh/sshd_config의 PermitRootLogin no)"]
          ]
        },
        bullets: [
          "**`/etc/shadow` 필드 구조**: `계정명 : $알고리즘$솔트$해시값 : 최종변경일 : 최소사용기간(mindays) : 최대사용기간(maxdays) : 만료경고기간(warndays) : 비활성기간 : 만료일`",
          "**해시 알고리즘 식별자**: `$1$`(MD5), `$5$`(SHA-256), `$6$`(SHA-512), `$y$`(yescrypt)"
        ],
        trap: "⚠️ 기출 함정: 기존에 실행 권한(x)이 없는 상태에서 SetUID나 Sticky Bit를 부여하면 소문자(s, t)가 아니라 대문자('S', 'T')로 표시됩니다! 또한 pam_limits.so는 로그인 잠금이 아니라 자원(프로세스·메모리) 제한 모듈입니다."
      },
      {
        id: "s1-3",
        topic: "3. 메모리 공격(BOF, Format String) 및 보호기법",
        importance: "★★★ 고난도 필수",
        summary: "버퍼 오버플로우의 공격 순서, 보호기법 4종, 그리고 각 보호기법을 우회하는 공격 기법의 상관관계를 표로 완벽히 정리하세요.",
        table: {
          headers: ["메모리 보호기법", "동작 원리", "방어 대상 공격", "우회 공격 기법 (취약점)"],
          rows: [
            ["Stack Guard (Canary)", "버퍼와 RET(복귀주소) 사이에 Canary 값을 삽입하여 함수 종료 시 변조 여부 검사", "순차적 Stack Buffer Overflow", "포인터 변조, SEH 덮어쓰기, Canary 유출"],
            ["Stack Shield", "함수 시작 시 RET를 Global RET Stack에 복사해두고 종료 시 비교/복원", "RET 변조 기반 Stack BOF", "함수 포인터 변조, Heap BOF"],
            ["DEP / NX (Exec-Shield)", "스택(Stack)과 힙(Heap) 영역에 실행(Execute) 권한을 제거하여 쉘코드 실행 차단", "Stack/Heap에 쉘코드 직접 주입 공격", "RTL (Return-to-Libc), ROP (Return Oriented Programming)"],
            ["ASLR", "실행 시마다 Stack, Heap, 공유 라이브러리의 메모리 주소를 랜덤하게 배치", "고정 메모리 주소를 이용하는 RTL/ROP 및 BOF", "Brute-Force, Memory Leak(정보 노출), NOP Sled / Heap Spray"],
            ["ASCII Armor", "공유 라이브러리(libc) 상위 주소에 NULL 바이트(0x00)를 포함시켜 strcpy() 중단 유도", "문자열 복사 함수를 이용한 RTL 공격", "0x00을 포함하지 않는 PLT/GOT 영역이나 ROP 체인 활용"]
          ]
        },
        bullets: [
          "**포맷 스트링 공격(Format String Attack)**: `printf(user_input)` 사용 시 발생 → `%x` 또는 `%p`(스택 메모리 열람), `%s`(특정 주소 문자열 읽기), **`%n`(지금까지 출력된 바이트 수를 해당 메모리 주소에 기록 → 권한 탈취 핵심!)**",
          "**레이스 컨디션(Race Condition)**: 검사 시점과 사용 시점의 간격(**TOCTOU**: Time-Of-Check to Time-Of-Use)에 심볼릭 링크를 생성해 중요 파일 덮어쓰기"
        ],
        trap: "⚠️ 기출 함정: 'DEP/NX를 적용하면 RTL(Return-to-Libc) 공격을 완벽히 차단할 수 있다' → 오답! RTL은 실행 권한이 이미 있는 libc 라이브러리 영역으로 점프하므로 DEP/NX를 우회합니다."
      },
      {
        id: "s1-4",
        topic: "4. Windows 시스템 보안 핵심",
        importance: "★★☆ 빈출",
        summary: "Windows 인증 구조(LSA, SAM, SRM), SID/RID 체계, 공유 폴더 보안 및 주요 이벤트 ID를 숙지하세요.",
        table: {
          headers: ["핵심 요소", "상세 설명 및 보안 설정", "관련 경로 / 명령어"],
          rows: [
            ["SAM 데이터베이스", "로컬 사용자 계정 및 NTLM 패스워드 해시 저장 (LM 해시는 취약하여 비활성화 권장)", "%SystemRoot%\\System32\\config\\SAM"],
            ["SID & RID 번호", "보안 식별자(SID) 끝자리 RID: 500(Administrator), 501(Guest), 1000~(일반 계정)", "whoami /user, wmic useraccount"],
            ["기본 관리 공유", "C$, D$, ADMIN$, IPC$ 등 숨김 공유($)는 악성코드 측면 이동에 악용되므로 제거", "net share C$ /delete + 레지스트리 AutoShareServer=0"],
            ["로컬 보안 정책", "계정 잠금 임계값, 암호 복잡성, 감사 정책, 사용자 권한 할당 설정", "secpol.msc / gpupdate /force"]
          ]
        },
        bullets: [
          "**Windows 인증 컴포넌트**: `Winlogon` → `LSASS`(Local Security Authority) → `SAM` 또는 Active Directory(`NTDS.dit` / Kerberos) 검증 → `SRM`(Security Reference Monitor)이 접근 토큰(SAT)으로 ACL 검사"
        ],
        trap: "⚠️ 기출 함정: `net share C$ /delete` 명령어로만 기본 공유를 삭제하면 재부팅 시 다시 살아납니다. 영구 제거하려면 레지스트리 `AutoShareServer`(또는 `AutoShareWks`) 값을 `0`으로 설정해야 합니다."
      }
    ]
  },

  2: {
    title: "2과목: 네트워크 보안 완벽 마스터 노트",
    examWeight: "20문항 출제 · 과락 40점 / 목표 75점+",
    overview: "포트 스캐닝 응답 패킷, DoS/DDoS 공격 분류, 스니핑/스푸핑(ARP·DNS), IPSec/SSL/무선랜 보안, 그리고 Snort 룰 작성에서 거의 모든 문제가 출제됩니다.",
    sections: [
      {
        id: "s2-1",
        topic: "1. Nmap 포트 스캐닝 기법별 응답 패킷 완벽 비교",
        importance: "★★★ 매회 1~2문제 출제",
        summary: "포트가 열려 있을 때(Open)와 닫혀 있을 때(Closed), 그리고 방화벽에 필터링될 때의 응답 패킷을 표로 외우면 10초 만에 풀 수 있습니다.",
        table: {
          headers: ["스캔 기법 (Nmap 옵션)", "전송 패킷", "포트 Open 시 응답", "포트 Closed 시 응답", "핵심 특징 및 주의사항"],
          rows: [
            ["TCP Open 스캔 (-sT)", "SYN", "SYN+ACK → ACK → RST", "RST+ACK", "3-Way Handshake 완료로 대상 서버에 세션 로그가 남음"],
            ["TCP SYN / Half-Open (-sS)", "SYN", "SYN+ACK (이후 공격자가 RST 전송)", "RST+ACK", "세션을 완전히 맺지 않고 RST로 끊어 애플리케이션 로그 회피"],
            ["FIN(-sF) / XMAS(-sX) / NULL(-sN)", "FIN / FIN+PSH+URG / 플래그 없음", "무응답 (패킷 무시)", "RST+ACK", "RFC 793 기반 스텔스 스캔 (※ Windows 서버에는 통하지 않음!)"],
            ["TCP ACK 스캔 (-sA)", "ACK", "RST (Unfiltered 확인)", "RST (Unfiltered 확인)", "포트 오픈 여부가 아니라 '방화벽 필터링(Stateful) 유무' 확인 목적!"],
            ["UDP 스캔 (-sU)", "UDP 패킷", "무응답 (또는 서비스 응답)", "ICMP Port Unreachable (Type 3, Code 3)", "패킷 유실 시 오탐 가능성이 있으며 속도가 느림"]
          ]
        },
        bullets: [
          "**TCP 플래그 6종**: `URG`(긴급 데이터), `ACK`(응답 확인), `PSH`(버퍼 지체 없이 즉시 전달), `RST`(연결 강제 초기화), `SYN`(연결 동기화 시작), `FIN`(정상 연결 종료)"
        ],
        trap: "⚠️ 기출 함정: ① 'TCP ACK 스캔으로 대상 서버의 열린 포트와 닫힌 포트를 구분한다' → 오답! ACK 스캔은 방화벽의 필터링 여부(Filtered vs Unfiltered)만 판별합니다. ② FIN/XMAS/NULL 스캔은 Windows OS에서는 Open/Closed 모두 RST를 반환하므로 구분할 수 없습니다."
      },
      {
        id: "s2-2",
        topic: "2. DoS / DDoS 공격 계층별·원리별 총정리",
        importance: "★★★ 무조건 출제",
        summary: "네트워크/전송 계층(L3/L4) 자원 소진 공격과 웹 애플리케이션 계층(L7) 공격의 동작 원리 및 방어 대책을 구분해야 합니다.",
        table: {
          headers: ["공격 명칭", "계층", "핵심 동작 원리 및 키워드", "주요 방어 및 보안 대책"],
          rows: [
            ["SYN Flooding", "L4", "위조된 출발지 IP로 SYN만 대량 전송 → 서버의 SYN Backlog Queue(Half-open 연결) 고갈", "SYN Cookie 활성화(tcp_syncookies=1), Backlog 큐 증설, First SYN Drop"],
            ["Smurf Attack", "L3", "출발지 IP를 피해자로 위조한 ICMP Echo Request를 네트워크 Directed Broadcast로 전송해 증폭", "라우터에서 Directed Broadcast 비활성화(no ip directed-broadcast)"],
            ["Land Attack", "L3/L4", "출발지 IP/Port와 목적지 IP/Port를 피해자 자신으로 동일하게 설정하여 무한 루프 유발", "방화벽에서 출발지 IP = 목적지 IP 패킷 차단, OS 패치"],
            ["Ping of Death", "L3", "IP 패킷 최대 크기(65,535 바이트)를 초과하는 초대형 ICMP 패킷을 단편화 전송해 재조합 시 오버플로우", "일정 크기 이상의 ICMP 단편화 패킷 차단"],
            ["Teardrop / Bonk / Boink", "L3", "IP 단편화(Fragmentation) 패킷의 Offset 값을 중첩시키거나 순서를 조작해 재조합 시 시스템 크래시", "비정상 Fragment Offset 패킷 필터링 및 OS 스택 패치"],
            ["HTTP GET Flooding (CC)", "L7", "정상 3-Way Handshake 완료 후 Cache-Control 헤더를 조작해 캐시 서버를 우회하고 웹/DB 부하 유발", "WAF 임계치 설정, CAPTCHA, 동적 URL 요청 빈도 제한"],
            ["Slowloris (Slow Header)", "L7", "HTTP 헤더의 끝을 알리는 빈 줄(\\r\\n\\r\\n)을 보내지 않고 연결을 점유해 웹서버 스레드 고갈", "헤더 수신 타임아웃(Timeout) 단축, 동시 연결 수 제한"],
            ["RUDY (Slow POST)", "L7", "HTTP POST 헤더의 Content-Length를 크게 설정한 뒤 Body 데이터를 1바이트씩 극도로 느리게 전송", "Body 수신 최소 전송 속도 제한, 최대 세션 유지 시간 제한"],
            ["Slow Read Attack", "L7", "클라이언트의 TCP Window Size를 0 또는 매우 작게 설정해 서버가 응답 버퍼를 비우지 못하게 지연", "최소 TCP Window Size 이하 연결 차단, 전송 타임아웃 설정"]
          ]
        },
        bullets: [
          "**DRDoS(분산 반사 서비스 거부)**: 별도의 에이전트(좀비 PC) 설치 없이 정상적인 외부 서버(DNS, NTP, Memcached, CLDAP, SSDP)를 반사체로 악용해 대량의 응답(Amplification)을 피해자에게 집중시키는 공격 (출발지 IP 스푸핑 방지 **BCP 38 / Ingress Filtering**으로 예방)"
        ],
        trap: "⚠️ 기출 함정: L7 공격(Slowloris, RUDY, HTTP GET Flooding)은 모두 정상적인 TCP 3-Way Handshaking을 완료한 후에 이루어지므로, 단순 SYN Cookie나 IP 스푸핑 차단만으로는 막을 수 없습니다!"
      },
      {
        id: "s2-3",
        topic: "3. IPSec, SSL/TLS 및 무선랜(Wi-Fi) 보안 프로토콜 비교",
        importance: "★★★ 빈출 핵심",
        summary: "OSI 계층별 VPN/암호화 프로토콜(L2: PPTP/L2TP, L3: IPSec, L4/L7: SSL/TLS)과 무선랜 표준(WEP~WPA3)을 비교합니다.",
        table: {
          headers: ["구분", "세부 프로토콜 / 모드", "제공 보안 서비스 및 암호 알고리즘", "핵심 특징"],
          rows: [
            ["IPSec 프로토콜", "AH (Authentication Header)", "무결성 + 발신지 인증 + 재전송 방지 (※ 암호화/기밀성 미제공!)", "IP 헤더 일부까지 무결성 검증하므로 NAT 환경과 충돌"],
            ["IPSec 프로토콜", "ESP (Encapsulating Security Payload)", "기밀성(암호화) + 무결성 + 발신지 인증 + 재전송 방지", "실무 VPN에서 가장 널리 사용되며 NAT-T(UDP 4500) 지원"],
            ["IPSec 운용모드", "전송 모드 (Transport Mode)", "기존 IP 헤더 유지 + IP 페이로드(데이터)만 보호", "종단 호스트 간(Host-to-Host) 직접 보안 통신"],
            ["IPSec 운용모드", "터널 모드 (Tunnel Mode)", "원본 IP 패킷 전체를 암호화하고 새로운 외부 IP 헤더 캡슐화", "보안 게이트웨이/VPN 장비 간(Site-to-Site) 구간 보호"],
            ["무선랜 표준", "WEP → WPA", "WEP(RC4 + 24bit IV + CRC-32) → WPA(TKIP + RC4 + Michael MIC)", "WEP의 짧은 IV 재사용 취약점을 보완하기 위한 과도기 표준이 WPA"],
            ["무선랜 표준", "WPA2 (IEEE 802.11i)", "AES 블록 암호 기반의 CCMP (CTR 암호화 + CBC-MAC 무결성)", "PSK(개인용 4-Way Handshake) 및 Enterprise(802.1X/EAP + RADIUS)"],
            ["무선랜 표준", "WPA3", "SAE(Dragonfly 키교환) + GCMP-256(192비트 엔터프라이즈) + OWE", "오프라인 사전 공격 방어, 전방향 안전성(Forward Secrecy), 개방형 와이파이 암호화(OWE)"]
          ]
        },
        bullets: [
          "**SSL/TLS 프로토콜 구조**: 하위 계층인 **Record 프로토콜**(단편화 → 압축 → MAC 첨부 → 암호화 → 헤더 부착)과 상위 계층인 **Handshake / Change Cipher Spec / Alert 프로토콜**로 구성"
        ],
        trap: "⚠️ 기출 함정: 'IPSec의 AH 프로토콜은 데이터를 암호화하여 기밀성을 보장한다' → 오답! AH는 인증과 무결성만 제공하며 암호화(기밀성)는 ESP만 제공합니다."
      },
      {
        id: "s2-4",
        topic: "4. Snort IDS/IPS 룰(Rule) 문법 및 옵션 완벽 해부",
        importance: "★★★ 실기까지 직결",
        summary: "Snort 룰은 [Rule Header]와 [(Rule Options)]로 구성됩니다. 특히 페이로드 위치 옵션 4종과 threshold 옵션은 매회 출제됩니다.",
        table: {
          headers: ["옵션 분류", "옵션 키워드", "의미 및 동작 방식", "작성 예시"],
          rows: [
            ["헤더 Action", "alert / log / pass / drop / reject", "alert(경고+로그), drop(IPS 패킷 차단+로그), reject(차단+RST/ICMP 전송)", "alert tcp any any -> 192.168.1.0/24 80 (...)"],
            ["페이로드 기본", "content / nocase", "패킷 페이로드 내 특정 문자열/16진수(|hex|) 검색 / nocase는 대소문자 무시", "content:\"GET\"; nocase;"],
            ["절대 위치 지정", "offset / depth", "페이로드 맨 처음(0바이트)부터 offset만큼 건너뛴 뒤, depth 바이트 범위 내에서만 검색", "content:\"HTTP\"; offset:4; depth:10;"],
            ["상대 위치 지정", "distance / within", "직전에 매칭된 content가 끝난 위치로부터 distance만큼 건너뛰고, within 범위 내에서 검색", "content:\"USER\"; content:\"root\"; distance:1; within:10;"],
            ["헤더/플래그 검사", "flags / sameip / ttl", "TCP 플래그 검사(S, A, F, R, P, U) / 출발지 IP = 목적지 IP(Land Attack 탐지)", "flags:S; sameip;"],
            ["임계치 제어", "threshold (limit / threshold / both)", "limit(시간 내 N개까지만 경고), threshold(N개마다 경고), both(N개 이상 시 1번만 경고)", "threshold: type both, track by_src, count 10, seconds 1;"]
          ]
        },
        bullets: [
          "**threshold 3가지 type 비교**: `limit`(지정 시간 동안 처음 count 수만큼만 알림 발생), `threshold`(지정 시간 동안 count 횟수에 도달할 때마다 알림 발생), **`both`(지정 시간 동안 count 횟수 이상 발생 시 단 1회만 알림 발생 → DDoS 경보 폭주 방지에 가장 많이 사용)**"
        ],
        trap: "⚠️ 기출 함정: `offset/depth`와 `distance/within`을 섞어 설명하는 선지를 주의하세요! '이전 매칭 패턴 기준'이라는 말이 나오면 무조건 `distance`(간격)와 `within`(범위)입니다."
      }
    ]
  },

  3: {
    title: "3과목: 애플리케이션 보안 완벽 마스터 노트",
    examWeight: "20문항 출제 · 과락 40점 / 목표 75점+",
    overview: "웹 취약점(XSS, CSRF, SQL Injection, SSRF, 파일 업로드), 시큐어 코딩, DB 암호화 아키텍처, 이메일 보안(SPF/DKIM/DMARC)이 핵심입니다.",
    sections: [
      {
        id: "s3-1",
        topic: "1. 주요 웹 애플리케이션 취약점 비교 (XSS vs CSRF vs SSRF vs SQLi)",
        importance: "★★★ 무조건 출제",
        summary: "공격이 실행되는 위치(클라이언트 브라우저 vs 웹 서버 vs DB 서버)와 각 취약점의 근본적인 시큐어 코딩 방어 대책을 구분해야 합니다.",
        table: {
          headers: ["취약점 명칭", "공격 실행 위치", "공격 원리 및 유형", "근본적인 보안 대책 (시큐어 코딩)"],
          rows: [
            ["XSS (Cross-Site Scripting)", "피해자의 웹 브라우저", "악성 스크립트(JS)를 삽입해 사용자 브라우저에서 실행 (Stored, Reflected, DOM XSS)", "입·출력값 HTML Entity 치환(< > & \" '), 쿠키 HttpOnly 설정, CSP(Content-Security-Policy) 적용"],
            ["CSRF (Cross-Site Request Forgery)", "웹 애플리케이션 서버", "이미 로그인된 피해자의 권한(세션 쿠키)을 도용해 피해자 의도와 무관한 요청(송금, 비번변경) 전송", "CSRF Token(세션별 난수 토큰) 검증, 재인증(현재 비번/CAPTCHA), Referer 검증, SameSite 쿠키"],
            ["SSRF (Server-Side Request Forgery)", "웹 서버 → 내부망/메타데이터", "웹 서버가 외부 입력 URL을 검증 없이 호출하여 내부망(127.0.0.1)이나 클라우드 메타데이터(169.254.169.254) 탈취", "허용된 도메인/URL 화이트리스트 검증, 사설 IP·루프백 대역 요청 차단, IMDSv2 토큰 적용"],
            ["SQL Injection", "데이터베이스(DB) 서버", "사용자 입력값이 SQL 쿼리 구문을 변조(Error-based, Union, Blind Boolean/Time-based)", "Prepared Statement(바인딩 변수 ?) 사용 / 테이블·컬럼명·ORDER BY 절은 화이트리스트 검증"],
            ["파일 업로드 (Web Shell)", "웹 애플리케이션 서버", "악성 스크립트(.jsp, .php, .asp)를 업로드한 뒤 URL로 직접 호출하여 서버 명령어 실행 권한 획득", "1) 확장자 화이트리스트 2) 업로드 폴더 실행권한 제거 3) 파일명 난수화 및 웹루트 밖 저장 4) Magic Number 검증"]
          ]
        },
        bullets: [
          "**쿠키 보안 플래그 3종**: `HttpOnly`(자바스크립트 `document.cookie` 접근 차단 → XSS 쿠키 탈취 방어), `Secure`(HTTPS 암호화 통신 시에만 쿠키 전송), `SameSite=Strict/Lax`(크로스 사이트 요청 시 쿠키 자동 전송 제한 → CSRF 완화)"
        ],
        trap: "⚠️ 기출 함정: ① 'HTML 엔티티 치환이나 HttpOnly 쿠키를 설정하면 CSRF 공격을 막을 수 있다' → 오답! 이는 XSS 대책입니다. ② 'Prepared Statement를 사용하면 동적 테이블명이나 ORDER BY 절의 SQL Injection도 별도 검증 없이 방어된다' → 오답! 테이블명/컬럼명/ORDER BY에는 바인딩 변수를 쓸 수 없으므로 화이트리스트 검증이 필수입니다."
      },
      {
        id: "s3-2",
        topic: "2. 데이터베이스(DB) 암호화 4대 구축 방식 비교",
        importance: "★★★ 빈출 핵심",
        summary: "DB 암호화 방식별 암·복호화 수행 위치, 애플리케이션 수정 여부, DB 서버 부하, 인덱스 검색 제약을 비교하는 문제가 자주 출제됩니다.",
        table: {
          headers: ["암호화 방식", "암·복호화 수행 위치", "애플리케이션 수정", "DB 서버 부하", "핵심 특징 및 장단점"],
          rows: [
            ["API 방식", "애플리케이션 서버 (App 레벨)", "많음 (쿼리 호출부 수정)", "매우 낮음", "네트워크 전송 구간부터 암호화됨, DB 서버 성능 저하가 없으나 개발·유지보수 공수 큼"],
            ["Plug-in 방식", "DB 서버 내부 (View + Trigger + 확장 프로시저)", "거의 없음 (최소화)", "높음", "뷰와 트리거를 이용해 암·복호화 자동 수행, 구축이 빠르나 DB 서버 CPU 부하 발생"],
            ["TDE 방식 (투명한 암호화)", "DB 커널 / 스토리지 블록(파일) 레벨", "전혀 없음 (투명성 보장)", "보통", "데이터 파일 저장 시 자동 암호화 및 메모리 로드 시 자동 복호화 (※ DB 계정 탈취 시 평문 조회됨!)"],
            ["Hybrid 방식", "API 방식 + Plug-in 방식 결합", "중간", "중간", "온라인 트랜잭션은 API 방식, 배치/패키지 프로그램은 Plug-in 방식으로 결합하여 단점 보완"]
          ]
        },
        bullets: [
          "**접근통제 DB 보안 객체**: **뷰(View)**를 활용하면 특정 민감 컬럼이나 행을 제외한 가상 테이블만 사용자에게 노출하여 세밀한 내용 기반(Content-dependent) 접근통제를 구현할 수 있음"
        ],
        trap: "⚠️ 기출 함정: TDE(Transparent Data Encryption)는 디스크 저장 파일과 백업 파일 도난은 막아주지만, DB에 정상 로그인한 사용자의 SELECT 결과는 평문으로 보이므로 별도의 DB 접근제어(DAC/MAC)나 컬럼 암호화가 필요합니다."
      },
      {
        id: "s3-3",
        topic: "3. 전자우편(E-mail) 보안 및 전자상거래 보안 기술",
        importance: "★★☆ 빈출",
        summary: "발신자 도메인 사칭 방지 기술 3종(SPF, DKIM, DMARC)과 이메일 내용 보호 프로토콜(PGP, S/MIME)을 명확히 구분하세요.",
        table: {
          headers: ["기술 명칭", "기반 인프라", "보안 목적", "동작 원리 핵심 요약"],
          rows: [
            ["SPF (Sender Policy Framework)", "DNS TXT 레코드", "발신 서버 IP 인증", "도메인 소유자가 DNS에 '메일 발송을 허용한 서버 IP 목록'을 공개하여 수신 측이 대조"],
            ["DKIM (DomainKeys Identified Mail)", "DNS TXT 레코드 + 공개키 서명", "발신 도메인 인증 + 메일 무결성", "발신 서버가 개인키로 메일 헤더/본문을 전자서명하고, 수신 서버가 DNS에 등록된 공개키로 검증"],
            ["DMARC", "SPF + DKIM 결합 정책", "인증 실패 메일 처리 정책 & 리포팅", "SPF와 DKIM 검증 실패 시 어떻게 처리할지(none, quarantine 격리, reject 거부) 정책을 DNS에 명시"],
            ["PGP (Pretty Good Privacy)", "Web of Trust (개별 사용자 간 신뢰망)", "기밀성(암호화) + 무결성 + 전자서명", "공인 CA 없이 사용자 간 공개키 링(Key Ring) 신뢰 모델 사용, 메시지 압축 기능 지원"],
            ["S/MIME", "X.509 공인 인증서 (PKI 계층적 CA)", "기밀성(암호화) + 무결성 + 전자서명", "MIME 객체(첨부파일 포함)를 PKI 인증서 기반으로 암호화 및 전자서명 (기업 표준)"]
          ]
        },
        bullets: [
          "**SET(Secure Electronic Transaction) 핵심 기술**: **이중 서명(Dual Signature)** — 구매자의 '주문 정보(OI)'와 '결제 정보(PI)'를 각각 해시하여 결합한 뒤 서명함으로써, **상점은 카드번호(PI)를 알 수 없고 카드사(PG)는 구매 물품 내역(OI)을 알 수 없도록** 프라이버시를 보호하면서도 두 정보의 연결성을 증명함!"
        ],
        trap: "⚠️ 기출 함정: 'DKIM은 메일 본문을 암호화하여 기밀성을 제공한다' → 오답! DKIM은 전자서명을 통한 발신자 인증과 위변조 방지(무결성)만 제공하며, 본문 암호화는 PGP나 S/MIME을 사용해야 합니다."
      }
    ]
  },

  4: {
    title: "4과목: 정보보안 일반 완벽 마스터 노트",
    examWeight: "20문항 출제 · 과락 40점 / 고득점 전략 과목 목표 85점+",
    overview: "암호학(대칭키 블록암호 운용모드, 공개키 알고리즘, 해시, 전자서명, PKI)과 접근통제 모델(BLP, Biba)은 개념만 정확히 표로 외우면 90점 이상 가능한 효자 과목입니다.",
    sections: [
      {
        id: "s4-1",
        topic: "1. 블록 암호 6대 운용 모드(Modes of Operation) 완벽 비교표",
        importance: "★★★ 시험 100% 출제 (1순위 암기표)",
        summary: "병렬 처리 가능 여부, 패딩 필요 여부, 복호화 시 사용하는 함수(E vs D), 그리고 1비트 오류 발생 시 전파 범위를 반드시 암기하세요.",
        table: {
          headers: ["운용 모드", "패딩(Padding)", "암호화 병렬처리", "복호화 병렬처리", "복호화 시 사용 함수", "핵심 특징 및 암호문 1블록 오류 전파"],
          rows: [
            ["ECB (Electronic Codebook)", "필요", "가능 (O)", "가능 (O)", "복호화 함수 (D)", "같은 평문 블록 → 같은 암호문 블록(패턴 노출 취약), 해당 평문 1블록만 손상"],
            ["CBC (Cipher Block Chaining)", "필요", "불가능 (X)", "가능 (O)", "복호화 함수 (D)", "이전 암호문과 현재 평문을 XOR 후 암호화(IV 사용), 암호문 1블록 오류 시 현재 블록 + 다음 블록 1비트 오류"],
            ["CFB (Cipher Feedback)", "불필요 (스트림화)", "불가능 (X)", "가능 (O)", "암호화 함수 (E)", "이전 암호문을 암호화(E)한 키스트림과 평문 XOR, 오류 시 현재 블록 + 다음 블록에 영향"],
            ["OFB (Output Feedback)", "불필요 (스트림화)", "불가능 (X)", "불가능 (X)", "암호화 함수 (E)", "키스트림이 평문/암호문과 독립적으로 사전 생성 가능(동기식 스트림), 오류 시 해당 비트만 반전(전파 없음)"],
            ["CTR (Counter)", "불필요 (스트림화)", "가능 (O)", "가능 (O)", "암호화 함수 (E)", "Nonce+Counter 값을 암호화(E)해 평문과 XOR, 고속 병렬 처리 및 임의 블록 랜덤 접근 가능"],
            ["GCM (Galois/Counter Mode)", "불필요", "가능 (O)", "가능 (O)", "암호화 함수 (E)", "CTR 모드 암호화 + 갈루아 필드 곱셈 기반 GMAC 인증 결합 (AEAD: 기밀성+무결성 동시 제공)"]
          ]
        },
        bullets: [
          "**한 줄 암기 공식**: ① 패딩이 필요한 블록 단위 모드는 **ECB, CBC** 뿐! 나머지(**CFB, OFB, CTR, GCM**)는 블록 암호를 스트림 암호처럼 쓰므로 패딩 불필요 & 복호화 시에도 **암호화(E) 함수**만 사용! ② **CBC와 CFB는 암호화는 직렬이지만 복호화는 병렬 처리가 가능**하다!"
        ],
        trap: "⚠️ 기출 함정: ① 'CBC 모드는 암호화와 복호화 모두 병렬 처리가 불가능하다' → 오답! CBC는 복호화 시에는 인접한 두 암호문 블록만 있으면 되므로 병렬 복호화가 가능합니다. ② 'CFB와 OFB는 복호화 시 블록 암호의 복호화(Decrypt) 알고리즘을 사용한다' → 오답! XOR 대칭성 때문에 암호화(Encrypt) 알고리즘을 그대로 사용합니다."
      },
      {
        id: "s4-2",
        topic: "2. 공개키(비대칭키) 암호, 전자서명 및 해시 함수 비교",
        importance: "★★★ 매회 3~4문제 출제",
        summary: "각 공개키 알고리즘의 수학적 기반 난제와 특수 전자서명 5종, 해시 함수의 3대 저항성을 한눈에 비교합니다.",
        table: {
          headers: ["분류", "알고리즘 / 기법", "수학적 기반 난제 / 핵심 원리", "보안 특징 및 시험 포인트"],
          rows: [
            ["공개키 암호", "RSA / Rabin", "큰 정수의 소인수분해 문제 (IFP)", "암·복호화 및 전자서명 모두 가능 (Rabin은 제곱근 계산 기반)"],
            ["키 교환", "Diffie-Hellman (DH)", "유한체 상의 이산대수 문제 (DLP)", "대칭키(세션키) 합의 전용 — 인증 기능이 없어 중간자 공격(MITM)에 취약! (보완: STS, 전자서명)"],
            ["공개키/서명", "ElGamal", "유한체 상의 이산대수 문제 (DLP)", "난수 사용으로 동일 평문도 매번 다른 암호문 생성, 암호문 길이가 평문의 2배로 증가"],
            ["전자서명 전용", "DSA / Schnorr / KCDSA", "유한체 상의 이산대수 문제 (DLP)", "전자서명 및 검증 전용 알고리즘 (암·복호화 기능 없음)"],
            ["타원곡선 암호", "ECC (ECDH, ECDSA)", "타원곡선 상의 이산대수 문제 (ECDLP)", "RSA 대비 훨씬 짧은 키 길이로 동일한 보안 강도 제공 (예: ECC 256bit ≈ RSA 3072bit)"],
            ["특수 전자서명", "은닉 서명 (Blind Signature)", "서명자가 메시지 내용을 모른 채 서명 발급", "추적 불가능한 완전 익명성 보장 → 전자투표, 디지털 현금(전자화폐)에 사용"],
            ["특수 전자서명", "그룹 서명 (Group Signature)", "그룹 구성원이 그룹을 대표해 익명으로 서명", "일반인은 서명자를 알 수 없으나, 분쟁 시 '그룹 관리자'는 서명자 신원을 추적·공개 가능"],
            ["특수 전자서명", "부인방지 서명 (Undeniable)", "서명자의 협조(참여)가 있어야만 서명 검증 가능", "서명 문서의 무단 복제·배포 방지, 서명자가 부인할 경우 부인 프로토콜로 판별"]
          ]
        },
        bullets: [
          "**해시 함수 3대 저항성 (출력 길이 $n$비트 기준)**:",
          "① **역상 저항성(Preimage Resistance, 일방향성)**: 해시값 $h$가 주어졌을 때 $H(x) = h$인 원본 입력 $x$를 찾기 어려움 (복잡도 $2^n$)",
          "② **제2역상 저항성(Second Preimage Resistance, 약한 충돌 저항성)**: **특정 입력 $x$가 주어졌을 때** $x \\neq y$이면서 $H(x) = H(y)$인 또 다른 입력 $y$를 찾기 어려움 (복잡도 $2^n$)",
          "③ **충돌 저항성(Collision Resistance, 강한 충돌 저항성)**: 아무 제약 없이 $H(x) = H(y)$를 만족하는 **임의의 두 입력 쌍 $(x, y)$**를 찾기 어려움 (**생일 역설 공격에 의해 복잡도가 $2^{n/2}$로 감소!**)"
        ],
        trap: "⚠️ 기출 함정: '은닉 서명은 분쟁 발생 시 관리자가 서명자의 신원을 추적할 수 있다' → 오답! 관리자가 신원을 열람할 수 있는 것은 '그룹 서명'이며, '은닉 서명'은 서명자조차도 추적이 불가능합니다."
      },
      {
        id: "s4-3",
        topic: "3. 접근통제 보안 모델 (BLP vs Biba vs Clark-Wilson vs Chinese Wall)",
        importance: "★★★ 무조건 1~2문제 출제",
        summary: "각 모델이 보호하려는 최우선 목표(기밀성 vs 무결성 vs 이해상충 방지)와 읽기/쓰기 제한 규칙을 혼동하지 않도록 표로 정리하세요.",
        table: {
          headers: ["보안 모델명", "최우선 보호 목표", "핵심 규칙 1 (Simple 속성)", "핵심 규칙 2 (*-속성 / 핵심 메커니즘)", "적용 환경 및 특징"],
          rows: [
            ["BLP (Bell-LaPadula)", "기밀성 (Confidentiality)", "No Read Up (단순 보안 속성): 자기보다 높은 등급 열람 금지", "No Write Down (*-속성): 상위 기밀을 하위 등급 객체에 기록(유출) 금지", "군사/국방 기밀 보호 모델 (가용성·무결성보다 기밀 유출 차단이 최우선)"],
            ["Biba (비바 모델)", "무결성 (Integrity)", "No Read Down (단순 무결성): 오염된 하위 등급 데이터 읽기 금지", "No Write Up (*-무결성): 하위 주체가 상위 등급 데이터를 변조(기록) 금지", "BLP의 수학적 쌍대(Dual) 모델, 비인가 수정 및 오염 데이터 유입 차단"],
            ["Clark-Wilson", "상업 환경의 무결성", "잘 형성된 트랜잭션 (Well-formed Transaction, TP)", "직무 분리 (Separation of Duty) & 무결성 검증 프로시저 (IVP)", "금융/회계 등 상업용 환경: 주체는 오직 인가된 프로그램(TP)을 통해서만 데이터(CDI) 수정 가능"],
            ["Chinese Wall (만리장성)", "이해상충 방지 (Conflict of Interest)", "동일 이해상충 그룹(COI) 내에서는 단 1개 기업의 정보만 접근 허용", "다른 이해상충 그룹의 기업 정보는 자유롭게 접근 가능", "컨설팅·법무법인 등에서 경쟁사 기밀 유출 방지 (DAC + MAC 혼합적 성격)"]
          ]
        },
        bullets: [
          "**접근통제 3대 정책 비교**: **DAC(임의적 접근통제)**(데이터 소유자가 권한 부여, 신분 기반, ACL, `chmod`/`GRANT`), **MAC(강제적 접근통제)**(시스템이 보안 레이블·등급으로 강제 통제, 규칙 기반, SELinux), **RBAC(역할 기반 접근통제)**(사용자에게 직무 역할(Role)을 부여, 최소 권한 및 직무 분리 관리 용이)"
        ],
        trap: "⚠️ 기출 함정: BLP의 *-Property(No Write Down)는 상위 등급 주체가 하위 등급 파일에 기밀을 복사해 유출하는 것을 막기 때문에, 결과적으로 상위 주체가 하위 파일을 수정할 수 없어 '무결성/편의성'이 제한되는 단점이 있습니다."
      },
      {
        id: "s4-4",
        topic: "4. 커버로스(Kerberos) 인증 & PKI 공개키 기반구조",
        importance: "★★☆ 빈출",
        summary: "대칭키 티켓 기반 SSO인 커버로스의 4단계 흐름과 PKI 인증서 폐지 확인 기술(CRL vs OCSP)을 정리합니다.",
        table: {
          headers: ["구분", "구성 요소 / 프로토콜", "동작 원리 및 핵심 역할", "장점 및 한계점"],
          rows: [
            ["Kerberos", "AS (인증 서버) → TGT 발급", "사용자 신원 확인 후 TGS와 통신할 수 있는 티켓 발부 티켓(TGT)과 세션키 발급", "패스워드가 네트워크에 평문 노출되지 않음"],
            ["Kerberos", "TGS (티켓 발부 서버) → ST 발급", "클라이언트가 제시한 TGT를 검증한 뒤 실제 응용 서버 접속용 서비스 티켓(ST) 발급", "KDC(AS+TGS) 단일 장애점(SPOF), 타임스탬프 기반이므로 시간 동기화 필수"],
            ["PKI 인증서 검증", "CRL (인증서 폐지 목록)", "CA가 주기적으로 폐지된 인증서 일련번호 목록을 배포 (Delta CRL로 크기 보완)", "목록 갱신 주기 사이에 실시간성 부족, 파일 크기 부하"],
            ["PKI 인증서 검증", "OCSP (온라인 인증서 상태 프로토콜)", "클라이언트가 실시간으로 OCSP 서버에 특정 인증서의 유효/폐지(Good/Revoked/Unknown) 상태 질의", "실시간 검증 가능 (※ 서명키 유효성뿐 아니라 암호화 데이터 복구까지 다루면 SCVP)"]
          ]
        },
        bullets: [
          "**PKI 주요 구성요소**: **CA(인증기관)**(인증서 발급·서명·폐지), **RA(등록기관)**(사용자 신원 확인 및 신청 접수 대행), **Directory(저장소)**(LDAP 기반으로 인증서 및 CRL 게시), **PAA/PCA**(최상위 정책 승인/인증 기관)"
        ],
        trap: "⚠️ 기출 함정: '커버로스(Kerberos)는 공개키(비대칭키) 암호 알고리즘만을 기반으로 티켓을 발급하는 완전 분산형 프로토콜이다' → 오답! 커버로스는 기본적으로 **대칭키 암호** 기반이며 중앙 집중형 KDC를 사용합니다."
      }
    ]
  },

  5: {
    title: "5과목: 정보보안 관리 및 법규 완벽 마스터 노트",
    examWeight: "20문항 출제 · 과락 40점 / 암기 시 안정적 80점+",
    overview: "ISMS-P 인증 기준, 위험관리(SLE/ALE 계산, 위험처리 4전략), BCP/DRP(RTO/RPO, 복구센터), 그리고 개인정보 보호법·정보통신망법의 숫자(시간·보관기간·과징금)에서 그대로 출제됩니다.",
    sections: [
      {
        id: "s5-1",
        topic: "1. ISMS-P 인증 제도 및 정보보호 위험관리 완벽 정리",
        importance: "★★★ 매회 3~4문제 출제",
        summary: "ISMS-P의 3대 영역 통제항목 개수, 심사 주기/기한, 그리고 정량적 위험분석 계산 공식(AV, EF, SLE, ARO, ALE)을 정확히 외워야 합니다.",
        table: {
          headers: ["구분", "세부 항목 / 공식", "핵심 수치 및 내용", "시험 출제 포인트"],
          rows: [
            ["ISMS-P 통제항목", "1. 관리체계 수립 및 운영 (16개)\n2. 보호대책 요구사항 (64개)\n3. 개인정보 처리단계별 요구사항 (21개)", "ISMS만 인증 시: 1 + 2 = 80개 항목\nISMS-P 통합 인증 시: 1 + 2 + 3 = 총 101개 항목 (구 기준 102개)", "관리체계 수립·운영 4단계: 수립 → 운영 → 점검 → 개선 (PDCA)"],
            ["ISMS-P 심사 주기", "최초심사 → 사후심사 → 갱신심사", "유효기간: 3년\n사후심사: 유효기간 중 매년 1회 이상\n갱신심사: 유효기간 만료 3개월 전까지 신청", "인증기관: 과학기술정보통신부·개인정보보호위원회 지정 (KISA, 금융보안원 등)"],
            ["ISMS 의무 대상자", "정보통신망법상 ISMS 의무 인증 기준", "① ISP(주요 정보통신서비스 제공자) ② 집적정보통신시설(IDC) 사업자 ③ 연간 매출액/세입 1,500억원 이상 상급종합병원·학교 ④ 정보통신서비스 부문 전년도 매출액 100억원 이상 또는 일일 평균 이용자 100만명 이상", "의무 대상자가 미인증 시 3천만원 이하 과태료"],
            ["정량적 위험 계산", "SLE (단일 예상 손실액)\nALE (연간 예상 손실액)", "SLE = AV(자산가치) × EF(노출계수, 0~100%)\nALE = SLE × ARO(연간 발생 확률/빈도)", "예: 1억원 서버(AV), 화재 시 50% 손실(EF=0.5) → SLE=5천만원. 5년에 1번 발생(ARO=0.2) → ALE=1천만원"],
            ["위험 처리 4대 전략", "감소 / 회피 / 전가 / 수용", "① 위험 감소(Mitigation): 보안 대책(방화벽, 패치) 적용해 위험 낮춤\n② 위험 회피(Avoidance): 위험을 유발하는 사업·시스템 자체를 중단/포기\n③ 위험 전가(Transfer): 보험 가입, 외부 전문업체 위탁/아웃소싱\n④ 위험 수용(Acceptance): 수용 가능 수준(DoA) 이하의 잔여 위험 감수", "보안 대책 구현 후에도 남아있는 위험 = 잔여 위험(Residual Risk)"]
          ]
        },
        bullets: [
          "**ISMS 관리체계 수립 및 운영 5단계 프로세스**: ① 관리체계 기반 마련 → ② 위험 관리(자산 식별 → 현황 분석 → 취약점·위협 평가 → 위험 평가 → 보호대책 선정) → ③ 관리체계 운영 → ④ 관리체계 점검 및 분석 → ⑤ 관리체계 개선"
        ],
        trap: "⚠️ 기출 함정: '위험 회피는 방화벽이나 침입탐지시스템을 도입하여 공격을 막는 것이다' → 오답! 보안 장비를 도입해 위험을 줄이는 것은 '위험 감소(완화)'이며, '위험 회피'는 해당 업무나 서비스 운영 자체를 하지 않는 것입니다."
      },
      {
        id: "s5-2",
        topic: "2. 업무연속성계획(BCP) 및 재해복구(DRP) 센터 비교",
        importance: "★★★ 빈출 핵심",
        summary: "업무영향분석(BIA)을 통해 산출하는 4대 목표 지표(RTO, RPO, RCO, RSO)와 재해복구센터 4가지 유형의 복구 소요 시간(RTO) 및 구축 비용을 비교합니다.",
        table: {
          headers: ["복구센터 유형", "RTO (복구 목표 시간)", "설비 및 데이터 보유 수준", "구축·유지 비용", "동작 방식 및 특징"],
          rows: [
            ["미러 사이트 (Mirror Site)", "즉시 (RTO ≈ 0, 수 분 이내)", "주 센터와 동일한 장비 + 실시간 데이터 동기화", "매우 높음 (최고)", "Active-Active 구조로 실시간 동시 가동, 무중단 금융 핵심 시스템에 적용"],
            ["핫 사이트 (Hot Site)", "수 시간 이내 (4~24시간)", "주 센터와 동일한 장비 대기 + 주기적/비동기 데이터 미러링", "높음", "Active-Standby 구조로 평시에는 대기 상태였다가 재해 발생 시 절체 가동"],
            ["웜 사이트 (Warm Site)", "수 일 ~ 수 주", "중요 핵심 서버 일부만 보유 + 주기적 백업 테이프/데이터 보관", "중간", "재해 시 백업 데이터를 복원하고 추가 설정을 거쳐 중요 업무부터 재개"],
            ["콜드 사이트 (Cold Site)", "수 주 ~ 수 개월", "전산실 공간(전력, 공조, 통신선)만 확보 (서버 장비 없음)", "매우 낮음", "재해 발생 후 서버 장비를 조달·설치하여 복구하므로 시간은 가장 오래 걸림"]
          ]
        },
        bullets: [
          "**BIA(업무영향분석) 4대 복구 지표**: **RTO(Recovery Time Objective, 복구 목표 시간: 얼마나 빨리 복구할 것인가?)**, **RPO(Recovery Point Objective, 복구 목표 시점: 어느 시점의 백업 데이터까지 복구할 것인가 = 데이터 손실 허용 범위)**, **RCO(복구 목표 일관성)**, **RSO(복구 목표 서비스 수준)**"
        ],
        trap: "⚠️ 기출 함정: RTO와 RPO의 정의를 서로 바꿔 내는 문제가 단골입니다! '시간(Time) = 중단 후 재개까지 걸리는 시간(RTO)', '시점(Point) = 허용 가능한 데이터 손실 시점(RPO)'으로 기억하세요."
      },
      {
        id: "s5-3",
        topic: "3. 정보보호 3대 법률 필수 암기 수치 총정리 (개인정보보호법 · 망법 · 기반시설법)",
        importance: "★★★ 시험 직전 1순위 확인표",
        summary: "법규 문제는 '몇 시간 이내', '몇 년 이상 보관', '월 몇 회 점검', '누가 지정하는가' 등 숫자와 주체를 바꿔 출제합니다. 아래 표 하나면 법규 문제를 완벽히 제압할 수 있습니다.",
        table: {
          headers: ["법률 / 고시 항목", "핵심 의무 사항", "법정 기한 / 수치 (필수 암기!)", "관할 기관 및 세부 조건"],
          rows: [
            ["개인정보 유출 통지·신고\n(개정 개인정보 보호법)", "유출 사실을 정보주체에게 통지 및 당국에 신고", "유출되었음을 알게 된 때부터 72시간 이내", "신고 기관: 개인정보보호위원회 또는 KISA\n(신고 대상: 1천명↑ 유출, 민감·고유식별정보 유출, 외부 불법접근/해킹 유출)"],
            ["침해사고 신고\n(정보통신망법)", "정보통신서비스 제공자의 해킹·DDoS 침해사고 신고", "침해사고 발생을 알게 된 때부터 24시간 이내", "신고 기관: 과학기술정보통신부장관 또는 KISA"],
            ["접속기록 보관 및 점검\n(개인정보 안전성 확보조치)", "개인정보취급자의 처리시스템 접속기록 보관·점검", "보관: 최소 1년 이상 (특정 조건 시 2년 이상)\n점검: 월 1회 이상 (다운로드 사유 확인 포함)", "2년 이상 보관 대상: 5만명 이상 정보주체 처리 또는 고유식별정보·민감정보 처리 시스템"],
            ["비밀번호 암호화 및 작성규칙\n(개인정보 안전성 확보조치)", "비밀번호 저장 방식 및 최소 자릿수 기준", "저장: 복호화 불가능한 일방향(해시) 암호화 필수!\n길이: 2종류 조합 시 10자리↑ / 3종류 조합 시 8자리↑", "고유식별정보·바이오정보는 양방향 암호화 가능하나, 비밀번호는 무조건 일방향 암호화!"],
            ["개인정보 영향평가 (PIA)\n(개인정보 보호법)", "공공기관의 개인정보 파일 구축·변경 시 사전 평가", "① 5만명 이상 민감정보·고유식별정보 처리\n② 50만명 이상 다른 개인정보파일과 연계\n③ 100만명 이상 정보주체의 개인정보파일 구축", "공공기관의 장은 영향평가 결과를 개인정보보호위원회에 제출해야 함 (민간기업은 노력 의무)"],
            ["개인정보 보호책임자(CPO) 및 과징금\n(개정 개인정보 보호법)", "법 위반 시 과징금 상한 기준", "전체 매출액의 100분의 3(3%) 이하\n(매출액 산정 곤란 시 20억원 이하)", "위반행위 관련 매출액이 아닌 '전체 매출액의 3%'로 강화(위반과 무관한 매출은 제외 가능)"],
            ["주요정보통신기반시설 보호\n(정보통신기반 보호법)", "기반시설 지정 및 취약점 분석·평가 주기", "취약점 분석·평가: 매년(연 1회) 실시\n(신규 지정 시 지정 후 6개월 이내 실시)", "중앙행정기관의 장이 지정, 과학기술정보통신부(민간/공공)·국가정보원(국가안보) 총괄"]
          ]
        },
        bullets: [
          "**디지털 포렌식 5대 원칙**: ① 정당성(적법절차) ② 재현성(동일 조건 동일 결과) ③ 신속성 ④ **연계보관성(Chain of Custody)** ⑤ **무결성(해시값 입증)**",
          "**RFC 3227 증거 수집 휘발성 순서**: CPU 레지스터·캐시 → 라우팅 테이블·ARP 캐시·프로세스·RAM 메모리 → 임시 파일 시스템 → 하드디스크(비휘발성) → 원격 로그 → 백업 아카이브 미디어"
        ],
        trap: "⚠️ 기출 함정: ① 개정 개인정보 보호법에서 일반 사업자(5일)와 특례(24시간) 구분이 폐지되고 모두 **'알게 된 때부터 72시간 이내'**로 통일되었습니다! (단, 정보통신망법상 침해사고 신고는 여전히 24시간 이내입니다.) ② 비밀번호를 AES나 SEED 같은 양방향 블록암호로 암호화 저장한다는 선지는 무조건 오답입니다(반드시 SHA-256/512, PBKDF2, bcrypt 등 일방향 해시 사용)."
      }
    ]
  }
};
