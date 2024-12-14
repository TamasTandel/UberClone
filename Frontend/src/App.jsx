import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSingup from './pages/CaptainSingup'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'

const App = () => {

  return (
    <div>
      <Routes>
        <Route 
        path='/' 
        element={<Start/>}
        ></Route>
        <Route 
        path='/home' 
        element={
        // <UserProtectWrapper>
          <Home/>
        // </UserProtectWrapper>
        }></Route>
        <Route 
        path='/login' 
        element={<UserLogin/>}
        ></Route>
        <Route 
        path='/signup' 
        element={<UserSignup/>}
        ></Route>
        <Route 
        path='/captain-home' 
        element={<CaptainProtectWrapper><CaptainHome/></CaptainProtectWrapper>}></Route>
        <Route 
        path='/captain-login' 
        element={<CaptainLogin/>}
        ></Route>
        <Route 
        path='/captain-signup' 
        element={<CaptainSingup/>}
        ></Route>
        <Route 
        path='/user/logout' 
        element={<UserProtectWrapper><UserLogout/></UserProtectWrapper>}
        ></Route>
      </Routes>
    </div>
  )
}

export default App