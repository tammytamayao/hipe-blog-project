import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUp from './sessions/SignUp';
import LogIn from './sessions/LogIn';
import VerifyEmail from './sessions/VerifyEmail';
import LogOut from './sessions/LogOut';

import MyProfile from './layout/MyProfile';
import MyPosts from './layout/MyPosts';
import ViewPost from './layout/ViewPost';
import CreatePost from './layout/NewPost';
import UpdatePost from './layout/UpdatePost';
import UpdateComment from './layout/UpdateComment';

export default function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LogIn/>} />
      <Route path="/login" element={<LogIn/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/verify/:token" element={<VerifyEmail />} />
      <Route path="/logout" element={<LogOut/>}/>

      <Route path="/myprofile" element={<MyProfile/>} />
      <Route path="/posts" element={<MyPosts/>} />
      <Route path="/posts/:id" element={<ViewPost />} />
      <Route path="/posts/new" element={<CreatePost/>} />
      <Route path="/posts/:id/edit" element={<UpdatePost />} />
      <Route path="/posts/:post_id/comments/:id/edit" element={<UpdateComment />} />
    </Routes>
  </Router>
  )
}
