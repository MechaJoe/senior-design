import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Home from './pages/Home'
// import Assignments from './pages/Assignments'
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
