import { useState, useEffect } from 'react'
import TaskCard from './TaskCard.jsx'
import TaskForm from './TaskForm.jsx'
import api from '../api/client.js'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({ status: '', priority: '', sortBy: 'createdAt', order: 'desc' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters)
      const res = await api.get(`/tasks?${params}`)
      setTasks(res.data.data)
    } catch (error) {
      console.error('Fetch tasks failed', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filters])

  const handleRefresh = (updatedTask, type) => {
    if (type === 'add') {
      setTasks([updatedTask, ...tasks])
    } else if (type === 'update') {
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
    } else if (type === 'delete') {
      setTasks(tasks.filter((t) => t._id !== updatedTask?._id))
    } else {
      fetchTasks()
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks ({tasks.length})</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium"
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {showForm && <TaskForm onAdd={(task) => handleRefresh(task, 'add')} onCancel={() => setShowForm(false)} />}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Filters & Sort</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={() => handleFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc')}
            className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Sort {filters.order === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No tasks yet!</p>
            <p>Add one above to get started.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onRefresh={handleRefresh} />
          ))
        )}
      </div>
    </div>
  )
}

export default TaskList