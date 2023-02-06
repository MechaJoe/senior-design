import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
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
    path: '/courses',
    element: <CoursesPage />,
  },
  {
    path: 'signup',
    element: <ProfileForm />,
  },
  {
    path: 'assignments',
    element: <div>hello world</div>,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
