import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'
import AssignmentsPage from './pages/AssignmentsPage'
import HomePage from './pages/HomePage'
import GroupsPage from './pages/GroupsPage'
import LoginPage from './pages/LoginPage'
import ProfileForm from './ProfileForm'
import Profile from './Profile'
<<<<<<< HEAD
import ChatPage from './pages/ChatPage'
import InstructorCourses from './pages/InstructorCourses'
=======
import RequestsPage from './pages/RequestsPage'
>>>>>>> 06bdaf1 (Individual vs group requests queries done)

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
    path: '/courses/:classCode/assignments/:assignmentId/requests',
    element: <RequestsPage />,
  },
  {
    path: 'signup',
    element: <ProfileForm />,
  },
  {
    path: 'courses/:classCode/assignments/:assignmentId',
    element: <GroupsPage />,
  },
  {
    path: 'chat/:initialChatId?',
    element: <ChatPage />,
  },
  {
    path: 'instructorcourses',
    element: <InstructorCourses />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
