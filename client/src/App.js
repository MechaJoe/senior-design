import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import AssignmentDashboard from './AssignmentDashboard'
import CoursesPage from './CoursesPage'
import Home from './pages/Home'
import Login from './pages/Login'
import ProfileForm from './ProfileForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  // {
  //   path: 'login',
  //   element: <Login />,
  // },
  {
    path: 'signup',
    element: <ProfileForm />,
  },
  {
    path: '/courses',
    element: <CoursesPage />,
  },
  {
    path: 'assignments',
    element: <AssignmentDashboard classCode="CIS 4000" />,
  },
  {
    path: 'signup',
    element: <ProfileForm />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
