import React, { useEffect, useState } from 'react'
import '../assets/CSS/Community.css';
import {
  useParams,
  useNavigate,
  Outlet,
  Link
} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatorInfo, setCreatorInfo] = useState({
    name: 'Unknown',
    phone: 'Not available',
    email: ''
  });

  useEffect(() => {
    console.log(".community-" + location.pathname.split("/")[3]);
    if (location.pathname.split("/").length > 3) SetActive(".community-" + location.pathname.split("/")[3]);
    else SetActive(".community-home")
  }, [location.pathname]);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/v1/community/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch community details');
        }

        const data = await response.json();
        setCommunity(data.community);
        
        // Set creator info directly from community data
        if (data.community && data.community.CreatedBy) {
          setCreatorInfo(prev => ({
            ...prev,
            name: `User ID: ${data.community.CreatedBy}`,
            phone: '01735847466',
            email: ''
          }));
          
          // Try to fetch more detailed creator information if possible
          try {
            const creatorResponse = await fetch(`http://localhost:5001/api/v1/users/${data.community.CreatedBy}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (creatorResponse.ok) {
              const creatorData = await creatorResponse.json();
              if (creatorData.user && creatorData.user.Name) {
                setCreatorInfo({
                  name: creatorData.user.Name,
                  phone: creatorData.user.Phone || '01735847466',
                  email: creatorData.user.Email || ''
                });
              }
            }
          } catch (err) {
            console.error('Error fetching creator details:', err);
            // Keep the default creator info set above
          }
        }
      } catch (err) {
        console.error('Error fetching community details:', err);
        setCreatorInfo({
          name: 'Unknown',
          phone: '01735847466',
          email: ''
        });
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchCommunityDetails();
    }
  }, [id, token]);

  const SetActive = (command) => {
    const navBars = ['.community-home', '.community-chat'];
    console.log(command);
    navBars.forEach((bars) => {
      if (bars === command) {
        document.querySelector(command).classList.add('com-nav-active');
      }
      else {
        document.querySelector(bars).classList.remove('com-nav-active');
      }
    })
  }

  return (
    <div className="community-page">
      <header className='com-header'>
        <h1 className='text-4xl font-medium pl-3'>
          {loading ? 'Loading...' : (community ? community.Name : 'Community Not Found')}
        </h1>

        <nav className='community-nav'>
          <ul>
            <li className='community-home' onClick={() => { SetActive('.community-home') }}>
              <Link to={`/community/${id}`}>Community</Link>
            </li>
            <li className='community-chat' onClick={() => { SetActive('.community-chat') }}>
              <Link to={`/community/${id}/chat`}>Chat</Link>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />

      <section id="contact">
        <h2 className='text-4xl font-semibold mt-2 mb-2'>Contact and Support</h2>
        <ul>
          <li><span>Created By:</span> {creatorInfo.name}</li>
          <li><span>Phone:</span> {creatorInfo.phone}</li>
          <li><span>Email:</span>
            {creatorInfo.email ? (
              <a href={`mailto:${creatorInfo.email}`} target='_blank' rel="noreferrer">{creatorInfo.email}</a>
            ) : (
              <span>Not available</span>
            )}
          </li>
        </ul>
      </section>
    </div>
  )
}

export default Community