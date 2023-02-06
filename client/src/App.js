// import logo from './logo.svg'
// import ReactDOM from 'react-dom/client'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
// import Login from './pages/Login'
import ProfileForm from './ProfileForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
  // {
  //   path: 'login',
  //   element: <Login />,
  // },
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
