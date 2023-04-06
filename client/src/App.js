import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'
import AssignmentsPage from './pages/AssignmentsPage'
import HomePage from './pages/HomePage'
import GroupsPage from './pages/GroupsPage'
import GroupsPageInstr from './pages/GroupsPageInstr'
import LoginPage from './pages/LoginPage'
import ProfileForm from './ProfileForm'
import Profile from './Profile'
import ChatPage from './pages/ChatPage'
import RequestsPage from './pages/RequestsPage'
import InstructorAssignmentsPage from './pages/InstructorAssignmentsPage'

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
    path: 'instructor/courses/:classCode/assignments/:assignmentId',
    element: <GroupsPageInstr />,
  },
  {
    path: 'chat/:initialChatId?',
    element: <ChatPage />,
  },
  {
    path: '/courses/:classCode/assignments/instructormode',
    element: <InstructorAssignmentsPage />,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
