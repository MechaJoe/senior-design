import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import AssignmentsPage from './pages/AssignmentsPage'
import CoursesPage from './CoursesPage'
import HomePage from './pages/HomePage'
import GroupsPage from './pages/GroupsPage'
import LoginPage from './pages/LoginPage'
import ProfileForm from './ProfileForm'
import Profile from './Profile'

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
    path: 'profile',
    element: <Profile />,
  },
  {
    path: '/courses',
    element: <CoursesPage />,
  },
  {
    path: '/courses/:classCode/assignments',
    element: <AssignmentsPage />,
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
