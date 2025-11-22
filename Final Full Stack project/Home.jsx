import { useAuth } from '../context/AuthContext'
import TaskList from '../components/TaskList'
import { Navigate } from 'react-router-dom'

const Home = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <TaskList />
}

export default Home