export default [
    {
      ignores: ["node_modules", "dist", "src/temp"],
    },
    {
      files: ["**/*.js", "**/*.ts"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          browser: true, // 기존 `env.browser`
          node: true,    // 기존 `env.node`
          // es6: true,     // 기존 `env.es6`
          es5: true,     // 기존 `env.es5`
          es6: true,     // 기존 `env.es6`
          console: true, // console 사용 허용
          process: 'readonly',
          require: 'readonly',
          fetch: 'readonly',
          navigator: 'readonly',
        },
      },
      rules: {
        "indent": ["warn", 4], // 들여쓰기
        "quotes": ["warn", "single"], // 따옴표
        "semi": ["warn", "always"], // 세미콜론
        // "comma-dangle": ["warn", "always"], // 마지막 쉼표
        "no-undef": ["warn"], // 선언되지 않은 변수 사용
        "no-unused-vars": ["warn", { "caughtErrors": "none" }], // 사용되지 않은 변수
        "no-redeclare": ["warn"], // 중복 선언
        // "no-console": ["warn"], // console 사용
        "eqeqeq": ["warn"], // ==, != 사용
        // "curly": ["warn"], // 중괄호 사용
        "no-eval": ["warn"], // eval 사용
        "no-implied-eval": ["warn"], // setTimeout, setInterval에 문자열 사용
        "no-empty": ["warn"], // 빈 블록 사용
        "no-constant-condition": ["warn"], // 상수 조건문 사용
        "no-unreachable": ["warn"], // 도달할 수 없는 코드
        "consistent-return": ["warn"], // return 문에서 항상 값을 반환
        "no-useless-return": "off", // 불필요한 return 문
        "no-mixed-spaces-and-tabs": ["warn"], // 들여쓰기에 space와 tab 혼용 방지
        // "no-magic-numbers": ["warn", { "ignore": [0, 1], "ignoreArrayIndexes": true }], // 의미 없는 숫자 리터럴 사용을 제한 
        "yoda": ["warn", "never"], // Yoda 조건문을 막음
        "object-curly-spacing": ["warn", "always"], // 객체 중괄호 사이 공백
        // "dot-notation": ["warn"], // 객체 프로퍼티 접근 obj.key 권장
        // "spaced-comment": ["warn", "never"], // 주석 앞뒤에 공백 권장
        "no-case-declarations": ["warn"], // switch 문에서 case 블록에 선언된 변수가 다른 case 블록에서 사용될 수 없음
        "default-case": ["warn"] //  switch 문에 default case 누락
      }
    },
  ];