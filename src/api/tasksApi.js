import axiosInstance from './axiosInstance'

// Get all tasks
export async function getTasks() {
  // The server responds with { status, message, data }
  // axiosInstance returns response.data (the wrapper), so unwrap to return only the payload `data`.
  const res = await axiosInstance.get('/api/tasks')
  return res.data
}

// Get tasks for a specific user (createdBy or assignedTo)
export async function getTasksByUser(userId) {
  if (!userId) return []
  const res = await axiosInstance.get(`/api/tasks/user/${userId}`)
  return res.data
}

// Get single task
export async function getTask(id) {
  const res = await axiosInstance.get(`/api/tasks/${id}`)
  return res.data
}

// Create task
export async function createTask(taskData) {
  const res = await axiosInstance.post('/api/tasks', taskData)
  return res.data
}

// Update task
export async function updateTask(id, taskData) {
  const res = await axiosInstance.put(`/api/tasks/${id}`, taskData)
  return res.data
}

// Delete task
export async function deleteTask(id) {
  const res = await axiosInstance.delete(`/api/tasks/${id}`)
  return res.data
}

// Get tasks by status
export async function getTasksByStatus(status) {
  const res = await axiosInstance.get('/api/tasks', {
    params: { status },
  })
  return res.data
}

// Get tasks by priority
export async function getTasksByPriority(priority) {
  const res = await axiosInstance.get('/api/tasks', {
    params: { priority },
  })
  return res.data
}

// Get overdue tasks
export async function getOverdueTasks() {
  const res = await axiosInstance.get('/api/tasks', {
    params: { overdue: true },
  })
  return res.data
}
