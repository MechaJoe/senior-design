import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import AssignmentDashboard from './AssignmentDashboard'
import Assignments from './pages/Assignments'
import Login from './pages/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element:
  <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
    <p className="text-3xl text-gray-700 font-bold mb-5">
      Welcome!
    </p>
    <p className="text-gray-500 text-lg">
      React and Tailwind CSS in action
    </p>
  </div>,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: '/assignments',
    element: <AssignmentDashboard classCode="CIS 4000" />,
  },
  {
    path: 'assignments',
    element: <Assignments />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
