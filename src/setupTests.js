import "@testing-library/jest-dom";

// Polyfill MutationObserver for Vitest + jsdom
if (!globalThis.MutationObserver) {
  globalThis.MutationObserver = class {
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
  };
}
