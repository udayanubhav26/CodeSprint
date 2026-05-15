import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import HomePage from "./Pages/HomePage";
import {checkAuth} from './authSlice.js'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import Admin from './Pages/Admin.jsx';
import ProblemPage from "./Pages/ProblemPage";
import AdminCreate from "./components/AdminCreate.jsx";
import AdminDelete from "./components/AdminDelete.jsx";
import AdminUpdate from "./components/AdminUpdate.jsx";
import Home from "./Pages/Home.jsx";
import Layout from "./Pages/Layout.jsx";
import Quiz from "./Pages/Quiz.jsx";
import About from "./Pages/About.jsx";
import Assistant from "./Pages/Assistant.jsx";



function App() {

  //code likhna isAuthenticated
  const {isAuthenticated, user, loading} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
   dispatch(checkAuth());  //Check initial Authentication is user Login or Not and its cookie is avalaible or expired!
  },[dispatch]);

  if(loading){
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-xl"></span>
    </div>
  }
  
 
  return (
  <Routes>

    {/* AUTH WRAP FOR MAIN APP */}
    <Route element={isAuthenticated ? <Layout /> : <Navigate to="/signup" />}>
      <Route path="/" element={<Home />} />
      <Route path="/problems" element={<HomePage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/about" element={<About />} />
      <Route path="/assistant" element={<Assistant />} />
    </Route>

    {/* AUTH PAGES (UNCHANGED) */}
    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
    <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />

    {/* ADMIN */}
    <Route path="/admin" element={isAuthenticated && user?.role === "admin" ? <Admin /> : <Navigate to="/" />} />
    <Route path="/admin/create" element={isAuthenticated && user?.role === "admin" ? <AdminCreate /> : <Navigate to="/" />} />
    <Route path="/admin/delete" element={isAuthenticated && user?.role === "admin" ? <AdminDelete /> : <Navigate to="/" />} />
    <Route path="/admin/update" element={isAuthenticated && user?.role === "admin" ? <AdminUpdate /> : <Navigate to="/" />} />

    {/* PROBLEM PAGE (no layout needed if you want full editor view) */}
    <Route path="/problem/:id" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />

  </Routes>
);
}

export default App
