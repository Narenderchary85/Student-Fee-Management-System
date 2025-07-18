import { useState } from 'react'
import Homepage from './components/HomePage'
import { Route, Routes } from "react-router";
import SignUp from './components/SignUp';
import Login from './components/Login';
import StudentsList from './components/student/StudentsList';
import MyProfile from './components/student/MyProfile';
import Fees from './components/student/Fees';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studentlist" element={<StudentsList />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/payfee" element={<Fees />} />
      </Routes>
    </>
  )
}

export default App
