// import logo from './logo.svg'
// import ReactDOM from 'react-dom/client'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
// import Login from './pages/Login'
import CoursesPage from './CoursesPage'

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
    path: '/courses',
    element: <CoursesPage />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
