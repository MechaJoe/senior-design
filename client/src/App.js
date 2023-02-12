import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import AssignmentDashboard from './AssignmentDashboard'
import CoursesPage from './CoursesPage'
import HomePage from './pages/HomePage'
import GroupsPage from './pages/GroupsPage'
import LoginPage from './pages/LoginPage'
import ProfileForm from './ProfileForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'signup',
    element: <ProfileForm />,
  },
  {
    path: '/courses',
    element: <CoursesPage />,
  },
  {
    path: '/courses/:classCode/assignments',
    element: <AssignmentDashboard />,
  },
  {
    path: 'signup',
    element: <ProfileForm />,
  },
  {
    path: 'courses/:classCode/assignments/:assignmentId',
    element: <GroupsPage />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
