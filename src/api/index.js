// Simple central API exports. Import from `src/api` in components to keep code readable.
// Example: `import { createTask } from '../api'`
export * from './authApi'
export * from './tasksApi'

// Export the configured axios instance in case a component needs low-level access.
export { default as axiosInstance } from './axiosInstance'
