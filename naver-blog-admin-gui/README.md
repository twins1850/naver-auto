# React 19 + TypeScript + MUI + Jest 테스트 환경 구축 및 문제 해결 (2025.05)

## 1. 테스트 환경 구성

- **테스트 러너:** Jest
- **트랜스파일러:** Babel (babel-jest)
- **React 버전:** 19.x
- \*\*TypeScript, MUI, @testing-library/react 등 최신 조합
- **테스트 환경:** jsdom

### 주요 설정 파일

- `babel.config.cjs`
  ```js
  module.exports = {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      ["@babel/preset-react", { runtime: "automatic" }],
      "@babel/preset-typescript",
    ],
  };
  ```
- `jest.config.cjs`
  ```js
  module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1",
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
      "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(react|@mui|@emotion)/)",
      "/dist/",
    ],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  };
  ```
- `jest.setup.js`
  ```js
  import "@testing-library/jest-dom";
  ```

## 2. 문제 및 해결 과정

- Jest 28+부터 `jest-environment-jsdom` 패키지가 별도 설치 필요 → `npm i -D jest-environment-jsdom --legacy-peer-deps`
- babel-jest만 사용하는 것이 React 19+와 TypeScript, MUI 최신 조합에서 가장 호환성이 높음
- 패키지 충돌 시 `--legacy-peer-deps` 옵션으로 설치
- 테스트는 반드시 해당 프로젝트 폴더(naver-blog-admin-gui)에서 실행
- babel 설정이 실제로 jest에 적용되는지 `BABEL_SHOW_CONFIG_FOR`로 확인 가능

## 3. 실제 문제 해결 로그 요약

- jsx 파싱 에러(`Support for the experimental syntax 'jsx' isn't currently enabled`) 발생
- babel-jest, @babel/preset-react, @babel/preset-typescript, jest-environment-jsdom 등 최신 패키지 설치 및 설정
- jest-environment-jsdom 누락으로 인한 환경 인식 실패 → 별도 설치 후 정상 동작
- 최종적으로 모든 테스트 통과 확인

## 4. CI/CD 파이프라인 구성 (2025.05)

### CI 파이프라인 구성

- GitHub Actions를 통한 자동화된 품질 관리
- 주요 브랜치(main, develop)에 대한 push와 PR 시 자동 실행

### 품질 검사 항목

1. **코드 품질 검사**

   - ESLint를 통한 정적 코드 분석
   - TypeScript 타입 체크
   - 빌드 검증

2. **테스트 자동화**

   - Jest를 통한 단위/통합 테스트 실행
   - 커버리지 임계값 설정 (브랜치 70%, 함수 80%, 라인 80%)
   - 테스트 결과 및 커버리지 리포트 자동 생성

3. **PR 자동 리뷰**
   - 커버리지 리포트 PR 코멘트 자동 추가
   - 테스트/품질 검사 실패 시 자동 알림

### 실행 명령어

```bash
# 개발 서버 실행
npm run dev

# 린트 검사
npm run lint

# 타입 체크
npx tsc --noEmit

# 테스트 실행
npm test

# 커버리지 포함 테스트
npm run test:coverage

# 프로덕션 빌드
npm run build
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## 2025-05-23 3단계: 관리자 GUI 인증키 관리 및 통계 설계

- 인증키 발급/검증 API 연동 샘플(`src/api/license.ts`) 구현 (axios 기반)
- 인증키 관리(발급/검증) 기능 샘플 작성
- 인증키 관리(발급/연장/회수/검증) API 설계
- 결제/사용량/로그 통계 기능 설계(초안)
- 모든 작업 내역/테스트 결과 README에 자동 기록
