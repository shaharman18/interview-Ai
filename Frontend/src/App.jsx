import { RouterProvider } from 'react-router-dom'
import { router } from './AppRoutes.jsx'
import './App.css'
import { AuthProvider } from './features/auth/Auth.context.jsx'
import { InterviewProvider } from './features/ai/InterviewContext.jsx'

function App() {
  return (
    <>
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}/>
      </InterviewProvider>
    </AuthProvider>
    </>
  )
}

export default App
