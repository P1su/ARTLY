import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['dist', 'node_modules'], // 검사 제외 폴더
  },
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      ...js.configs.recommended.rules,
      'react/no-unknown-property': 'warn', // HTML 속성 잘못 사용 경고
      'react/self-closing-comp': [
        'warn',
        { component: true, html: true }, // children이 없는 경우 단일 태그 사용 권장
      ],
      'react/react-in-jsx-scope': 'off',
      'react/no-array-index-key': 'error', // key로 index 사용 경고
      'react/jsx-key': 'error', // React key 필수 사용
      'react/jsx-no-useless-fragment': 'warn', // 불필요한 Fragment 사용 제한
      'react/jsx-no-duplicate-props': 'warn', // JSX에서 중복 props 방지
      'react/jsx-boolean-value': ['warn', 'never'], // 불필요한 `={true}` 생략 권장

      'no-var': 'error', // var 변수 선언 금지
      'no-unused-vars': 'warn', // 선언한 변수 사용 권장
      'no-multiple-empty-lines': 'error', //연속으로 여러 개의 빈줄 사용 금지
      'dot-notation': 'warn', // 객체 프로퍼티 접근시 점 표기법 권장
      'prefer-destructuring': ['warn', { object: true, array: false }], // 구조분해 할당 권장
      'prefer-template': 'warn', // 템플릿 리터럴 사용 권장

      // 반복문, 조건문 관련
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForStatement',
          message:
            'Use array methods like .map(), .filter() or .forEach() instead of for loops.',
        },
      ],

      eqeqeq: ['error', 'always'], // 삼중 등호(===) 사용 강제
      camelcase: ['error', { properties: 'always' }], //프로퍼티명으로 camelCase 작성 강제
    },
  },
]);
