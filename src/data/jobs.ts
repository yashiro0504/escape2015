export interface Job {
  id: string;
  company: string;
  role: string;
  salary: number;
  requiredExp: number; // 필요 경력 (개월 수)
  stress: number; // 월간 발생하는 스트레스
  raiseRate: number; // 연봉 인상률
  description: string;
}

export const JOB_LIST: Job[] = [
  {
    id: 'part-time',
    company: '편의점/카페',
    role: '아르바이트',
    salary: 1200000,
    requiredExp: 0,
    stress: 5,
    raiseRate: 0.01,
    description: '최저시급 수준의 알바. 몸은 고되지만 책임은 적다.'
  },
  {
    id: 'startup-intern',
    company: '스타트업',
    role: '인턴/신입',
    salary: 1500000,
    requiredExp: 0,
    stress: 15,
    raiseRate: 0.02,
    description: '9 to 6... 아니, 가끔은 밤도 샌다. 열정페이의 냄새가 난다.'
  },
  {
    id: 'small-company',
    company: '중소기업',
    role: '사원',
    salary: 2200000,
    requiredExp: 12,
    stress: 20,
    raiseRate: 0.03,
    description: '어엿한 직장인. 하지만 매달 카드값 메우기에 급급하다.'
  },
  {
    id: 'mid-company',
    company: '중견기업',
    role: '대리/과장',
    salary: 3500000,
    requiredExp: 36,
    stress: 25,
    raiseRate: 0.05,
    description: '허리가 휘어지는 중간 관리자. 연봉은 올랐지만 내 시간은 줄어들었다.'
  },
  {
    id: 'big-company',
    company: '대기업',
    role: '팀장',
    salary: 5500000,
    requiredExp: 72,
    stress: 35,
    raiseRate: 0.07,
    description: '모두가 부러워하는 직장. 높은 연봉만큼 책임과 스트레스도 막중하다.'
  },
  {
    id: 'it-giant',
    company: '네카라쿠배',
    role: '시니어 개발자',
    salary: 8000000,
    requiredExp: 120,
    stress: 30,
    raiseRate: 0.10,
    description: '업계 최고의 대우. 억대 연봉자가 되어 경제적 자유에 한 걸음 다가선다.'
  },
  {
    id: 'unemployed',
    company: '백수',
    role: '무직',
    salary: 0,
    requiredExp: 0,
    stress: 0,
    raiseRate: 0,
    description: '눈치 보며 늦잠 자는 하루. 월급은 없지만 스트레스도 없다.'
  }
];
