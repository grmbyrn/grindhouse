import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
    cleanup()
    localStorage.clear()
})

// jsdom has no ResizeObserver; Radix components (radio group, select) call it to measure themselves
globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
}
