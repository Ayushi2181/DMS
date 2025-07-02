import React, { useEffect, useState } from 'react'
import '../assets/CSS/Header.css';
import Logo from '../assets/images/dms-logo-black.png';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Header= () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const loggedIn = !!token;
  const isAdmin = user?.isAdmin || false;
  const location = useLocation();
  console.log(location.pathname.split("/"));
  const navBars= ['.nav-incidents','.nav-communities','.nav-medicals','.nav-donate','.nav-flood' ];

  const SetActive= (command)=>{
      navBars.forEach((bars)=>{
        if (bars===command){
          document.querySelector(command).classList.add('nav-active');
        }
        else{
          document.querySelector(bars).classList.remove('nav-active');
        }
      })
  }

  useEffect(()=>{
    if (navBars.includes(".nav-"+ location.pathname.split("/")[1])) SetActive(".nav-"+ location.pathname.split("/")[1]);
    else{
      navBars.forEach((bars)=>{
        document.querySelector(bars).classList.remove('nav-active');
      })
    }
  }
      ,[location.pathname.split("/")])
  
  return (
    <>
    <div className='main-header'>
        <div >
        <div className="header-navbar">
            <img src={Logo} className='header-logo' alt="DMS logo" />
          <Link to='/'>
            <h1 className='header-text'>Disaster <br className='breakline'/>Management System</h1>
          </Link>
        
        <div className="nav-links">  
            <ul >
                <li className='nav-incidents' >
                  <Link to='/incidents'>Incidents</Link></li>

                <li className='nav-communities' >
                  <Link  to='/communities'>Community</Link></li>

                <div className='nav-flood'>
                  <Link to='/flood'>Flood Risk</Link>
                </div>
                <li className='nav-medicals' >
                  <Link to='/medicals'>Medicals</Link></li>

                <li className='nav-donate' >
                  <Link to='/donate'>Donate</Link></li>
                  {!loggedIn && (
                  <li className='nav-login'>
                    <button 
                      type="button" 
                      className="header-login" 
                      onClick={() => navigate('/auth')}
                    >
                      Login/Register
                    </button>
                  </li>
                )}
                {/* Show Admin link when user is admin AND logged in */}
                {isAdmin && loggedIn && (
                  <li className='nav-admin'>
                    <Link to='/admin'>Admin</Link>
                  </li>
                )}
                
                {loggedIn && (
                  <li className='nav-login'>
                    <button 
                      type="button" 
                      className="header-login" 
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      LogOut
                    </button>
                  </li>
                )}
            </ul>
        </div>
        </div>
    </div>
    </div>
    </>
  )
}
