// import logo from './logo.svg'
// import ReactDOM from 'react-dom/client'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
// import Login from './pages/Login'
import AssignmentDashboard from './AssignmentDashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
  {
    path: 'login',
    // element: <Login />,
  },
  {
    path: '/assignments',
    element: <AssignmentDashboard classCode="CIS 4000" />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
