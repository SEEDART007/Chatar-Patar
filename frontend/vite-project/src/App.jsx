import React from 'react'
import NavBar from './components/NavBar'
import { Navigate, Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { LoaderIcon, Toaster } from 'react-hot-toast'
import { Loader } from 'lucide-react'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore()
  const {theme} = useThemeStore();
    useEffect(()=>{
     checkAuth()
  },[checkAuth])
 if(isCheckingAuth && !authUser) return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
  )
 
  return (
    <div data-theme={theme}>
    
     <NavBar/>

     <Routes>
      <Route path='/' element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
      <Route path='/signup' element={!authUser?<SignUp/>:<Navigate to="/"/>}/>
      <Route path='/login' element={!authUser?<Login/>:<Navigate to="/"/>}/>
      <Route path='/settings' element={<SettingsPage/>}/>
      <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
     </Routes>
     <Toaster/>
    </div>
  )
}

export default App