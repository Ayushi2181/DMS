import React, { useState, useEffect } from 'react';
import '../../assets/CSS/CommunityHome.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const CommunityHome = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error('Error fetching community details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchCommunityDetails();
    }
  }, [id, token]);

  if (loading) return <div>Loading community details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!community) return <div>No community data available</div>;

  return (
    <>
      <section id="details">
        <h2 style={{ textDecoration: 'underline' }}>Community Details</h2>
        <ul>
          <li className='p-28'><span> Incident Type:</span> {community.Type || 'Others'}</li>
          <li><span> Incident Details:</span> {community.Details || community.Name}</li>
          <li><span>Number of Members:</span> {community.Users?.length || 0}</li>
          <li><span>Community Leader: </span>{community.Leader}</li>
          <li><span>Community Location: </span> {community.Location || 'Not specified'}</li>
          <li><span>Date Created: </span>{new Date(community.DateCreated).toLocaleDateString()}</li>
        </ul>
      </section>
    </>
  );
};