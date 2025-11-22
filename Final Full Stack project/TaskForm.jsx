import { useState } from 'react'
import api from '../api/client.js'

const TaskForm = ({ onAdd, editTask, onCancel }) => {
  const [formData, setFormData] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    dueDate: editTask?.dueDate ? new Date(editTask.dueDate).toISOString().split('T')[0] : '',
    priority: editTask?.priority || 'medium',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editTask) {
        const res = await api.put(`/tasks/${editTask._id}`, formData)
        onAdd(res.data.data, 'update')
      } else {
        const res = await api.post('/tasks', formData)
        onAdd(res.data.data, 'add')
      }
      if (onCancel) onCancel()
    } catch (error) {
      console.error('Form submit failed', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 font-medium"
        >
          {editTask ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm