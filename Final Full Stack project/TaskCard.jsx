import { format } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import api from '../api/client.js'

const TaskCard = ({ task, onRefresh }) => {
  const { user } = useAuth()

  const toggleComplete = async () => {
    try {
      const res = await api.patch(`/tasks/${task._id}/complete`)
      onRefresh(res.data.data)
    } catch (error) {
      console.error('Toggle failed', error)
    }
  }

  const deleteTask = async () => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${task._id}`)
        onRefresh(null)
      } catch (error) {
        console.error('Delete failed', error)
      }
    }
  }

  const priorityColor = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-md border-l-4 ${priorityColor[task.priority] || 'border-gray-200'} ${task.status === 'completed' ? 'opacity-60 line-through' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
          {task.description && <p className="text-gray-600 mb-2">{task.description}</p>}
          <div className="flex flex-wrap gap-2 text-sm">
            {task.dueDate && (
              <span className="text-gray-500">Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
            )}
            <span className={`px-2 py-1 rounded-full text-white text-xs capitalize ${priorityColor[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs capitalize ${
              task.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
            } text-white`}>
              {task.status}
            </span>
          </div>
        </div>
        <div className="ml-4 flex gap-2">
          <button
            onClick={toggleComplete}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              task.status === 'completed'
                ? 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {task.status === 'completed' ? 'Undo' : 'Complete'}
          </button>
          <button
            onClick={deleteTask}
            className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard