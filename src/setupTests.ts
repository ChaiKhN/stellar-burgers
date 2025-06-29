import '@testing-library/jest-dom';

// Добавляем полифил для crypto.randomUUID
Object.defineProperty(global.self, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${Math.random()}`,
  },
});
