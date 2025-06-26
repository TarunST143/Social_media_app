import React, { useState } from 'react';
import '../styles/landingpage.css';

import socialeXLogo from '../images/SocialeX.png';
import About1 from '../images/about-1.png';
import About2 from '../images/about-2.jpg';

import Login from '../components/Login';
import Register from '../components/Register';

const LandingPage = () => {

    const [isLoginBox, setIsLoginBox] = useState(true);


  return (
    <div className='landingPage'>
        
        <div className="landing-header">
            <span className="landing-header-logo"><img src={socialeXLogo} alt="" /></span>
            <ul>
                <li className='header-li'><a href="#home">Home</a></li>
                <li className='header-li'><a href="#about">About</a> </li>
                <li className='header-li'><a href="#home">Join now</a></li>
            </ul>
        </div>


        <div className="landing-body">

            <div className="landing-hero" id='home'>
                <div className="landing-hero-content">
                    <h1>SocialeX</h1>
                    <p>Step into SocialeX, the playground for the wildly imaginative, where vibrant communities thrive and eccentricities are celebrated. </p>

                    <div className="authentication-form">

                        { isLoginBox ?

                            <Login setIsLoginBox={setIsLoginBox} />
                            :
                            <Register setIsLoginBox={setIsLoginBox} />
                        }

                    </div>

                </div>


                <div className="landing-hero-image">
                    
                        <div id='landing-image-sidebar-left'></div>
                        <div className="back"></div>
                        <div id='landing-image-sidebar-right'></div>
                   
                </div>
            </div>

            <div className="landing-about" id='about'>

                <div className="about-1">
                    <img src={About1} className='about-1-img' alt="" />
                    <div className="about-1-content">

                        <h3>Stay Connected</h3>
                        <p>SocialeX makes it easy to maintain touch with your old friends, regardless of geographical boundaries. Connect with them on the platform, follow their profiles, and keep up with their updates. Engage with their content, share memories, and reminisce together.</p>
                        <a href='#home'>Join now!!</a>

                    </div>
                </div>
                <div className="about-2">
                    <div className="about-2-content">
                        <h3>Amplify Your Voice</h3>
                        <p>SocialeX gives you the power to amplify your voice and share your unique perspective with a global audience. Whether you're an artist, a writer, a musician, or a content creator in any other field, SocialeX provides you with the stage to showcase your talent and gain recognition.</p>
                        <a href='#home'>Join now!!</a>
                    </div>
                    <img src={About2} className='about-2-img' alt="" />
                </div>

            </div>

            <div className="footer">
                <p>All rights reserved - &#169; SocialeX.com</p>
            </div>


        </div>

    </div>
  )
}

export default LandingPage