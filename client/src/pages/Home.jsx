import React from 'react';
import '../styles/Home.css';
import Post from '../components/Post';
import HomeLogo from '../components/HomeLogo';
import Navbar from '../components/Navbar';
import Stories from '../components/Stories';

const Home = () => {
  return (
    <div className='homePage'>
      <HomeLogo /> 
      <Navbar />
      <Stories />
      <Post />
      
    </div>
  )
}

export default Home