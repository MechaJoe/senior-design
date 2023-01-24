// import logo from './logo.svg'
// import ReactDOM from 'react-dom/client'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
// import Login from './pages/Login'
import Sidebar from './Sidebar'

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
    element: <Sidebar />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
