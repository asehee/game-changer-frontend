# GameChanger Platform - Frontend
<img width="1276" height="718" alt="image" src="https://github.com/user-attachments/assets/9a50c0cd-f00a-4ec5-a9cb-fd2ec9a605a9" />

## 🎮 Project Overview
게임 플레이 시간당 실시간 과금부터 개발자에게 직접 지급까지! "충전 지갑" 위임을 통해 결제 시 매번 서명해야 하는 번거로움은 줄이고, 자산 유출 위험은 안전하게 차단합니다. 또한 조건 기반 Escrow 트랜잭션으로 먹튀 걱정 없는 신뢰성 높은 크라우드 펀딩을 실현하여, 인디 개발자부터 글로벌 유저까지 아우르는 새로운 기회로 게임 시장을 확 바꿀 Game Changer!

---

## 🚩 Problems We Solve
우리는 게임을 사랑하지만, 그 이면에는 게이머와 개발자 모두가 감수해야 하는 불편한 현실이 존재합니다.

### 게이머의 불편함: 7만 원을 결제한 게임이 30분 만에 실망스러웠던 경험, 누구나 한 번쯤은 겪어봤을 겁니다. 재미있을지 확신도 없는 게임을 '선구매'하고, 복잡한 환불 절차를 거쳐야 하는 불편함은 여전합니다. 해외 플랫폼이라면 비싼 수수료의 해외 결제 장벽까지 넘어야 합니다.

### 개발자의 고충: 이러한 불편함은 사실, 개발자들이 겪는 더 큰 문제에서 시작됩니다. 기존 플랫폼들은 30%에 달하는 높은 수수료를 가져가고, 개발자는 몇 달을 기다려 늦은 정산을 받습니다. 특히 자금을 모으기 어려운 인디 개발자들은 크라우드펀딩에 의존하지만, 후원자들은 언제든 발생할 수 있는 '먹튀' 가능성에 불안해합니다.

결국 이는 게이머와 개발자 모두를 위한 신뢰와 효율성이 부족한 악순환입니다.

---

## 🌟 Key Features & Innovation

### 1. Pay-Per-Time Gaming System  
- 게임을 미리 구매하지 않아도 됨  
- 플레이 시간만큼만 과금 → 재미없으면 중단 가능, 재미있으면 이어갈 수 있음  
- 기존 정액제·패키지 모델을 **근본적으로 대체할 새로운 소비 방식**  

### 2. Instant Settlement for Developers  
- XRPL을 통해 과금이 발생하는 즉시 정산  
- 글로벌 인디 개발자도 **실시간으로 수익 확보 가능**  
- 누구나 지속 가능한 게임 개발 가능  

### 3. Ad-powered Fee Model  
- XRPL 거래 수수료는 **광고 시청**으로 충당  
- 유저는 추가 비용 없이 게임 플레이 가능  
- 수수료 장벽을 제거해 **Web3 대중화** 촉진  

### 4. Trustless Crowdfunding  
- 모든 후원금은 XRPL **TokenEscrow**에 조건부로 잠김  
- 펀딩 종료 3일 전, 개발자는 **중간 산출물 제출**  
- 후원자 투표 결과에 따라 **Finish(지급) 또는 Cancel(환불)** 결정  
- **Batch 처리**로 대량 트랜잭션도 효율적 정산 → “먹튀” 구조적 차단  

---

## Technology Stack

### Blockchain & Payment
- **XRPL (XRP Ledger)** – Blockchain infrastructure  
- **xrpl.js** – XRP Ledger JavaScript library  

### Backend Features
- **세션 기반 JWT 인증** – 5분 롤링 토큰 방식  
- **하트비트 메커니즘** – 세션 지속성 모니터링 (30초 간격)  
- **Range 스트리밍** – 세션 검증과 함께 게임 에셋 스트리밍  
- **빌링 연동** – XRPL 기반 실시간 결제 시스템  

---

## Team & Contributors
- **AHSKNUE**
