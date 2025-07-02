import React, { useState, useEffect } from 'react'
import "../../assets/CSS/Communities.css"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

export const Communities = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [communities, setCommunities] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCommunity, setNewCommunity] = useState({
        name: '',
        location: '',
        type: 'Others',
        details: ''
    });

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!token) {
            navigate('/auth/login');
            return;
        }
        
        // Fetch communities from the server
        fetchCommunities();
    }, [token, navigate]);

    const fetchCommunities = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/community/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.communities) {
                setCommunities(data.communities);
            }
        } catch (error) {
            console.error('Error fetching communities:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCommunity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const createCommunity = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/v1/community/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    Name: newCommunity.name,
                    Location: newCommunity.location,
                    Type: newCommunity.type,
                    Details: newCommunity.details,
                    CreatedBy: user.UserID
                })
            });

            if (response.ok) {
                // Reset form and fetch updated communities
                setNewCommunity({
                    name: '',
                    location: '',
                    type: 'Others',
                    details: ''
                });
                setShowCreateForm(false);
                fetchCommunities();
            } else {
                const errorData = await response.json();
                alert(`Failed to create community: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating community:', error);
            alert('Failed to create community. Please try again.');
        }
    };

    const joinCommunity = async (communityId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/v1/community/${communityId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchCommunities(); // Refresh the list
                alert('Successfully joined the community!');
            } else {
                const errorData = await response.json();
                alert(`Failed to join community: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error joining community:', error);
            alert('Failed to join community. Please try again.');
        }
    };

    const leaveCommunity = async (communityId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/v1/community/${communityId}/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchCommunities(); // Refresh the list
                alert('Successfully left the community!');
            } else {
                const errorData = await response.json();
                alert(`Failed to leave community: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error leaving community:', error);
            alert('Failed to leave community. Please try again.');
        }
    };

    return (
        <div className="communities-container">
            <div className="communities-header">
                <h1>Communities</h1>
                <button 
                    className="create-community-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : 'Create New Community'}
                </button>
            </div>

            {showCreateForm && (
                <div className="create-community-form">
                    <h2>Create New Community</h2>
                    <form onSubmit={createCommunity}>
                        <div className="form-group">
                            <label>Community Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={newCommunity.name}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={newCommunity.location}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select 
                                name="type" 
                                value={newCommunity.type}
                                onChange={handleInputChange}
                            >
                                <option value="Flood">Flood</option>
                                <option value="Earthquake">Earthquake</option>
                                <option value="Fire">Fire</option>
                                <option value="Cyclone">Cyclone</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Details</label>
                            <textarea 
                                name="details" 
                                value={newCommunity.details}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        <button type="submit" className="submit-btn">Create Community</button>
                    </form>
                </div>
            )}

            <div className="communities-list">
                <h2>Available Communities</h2>
                {communities.length === 0 ? (
                    <p>No communities available. Create one to get started!</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Date Created</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th>Members</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {communities.map(community => {
                                const isMember = community.Users?.includes(user.UserID);
                                return (
                                    <tr key={community.ComID}>
                                        <td>{community.ComID}</td>
                                        <td>{community.Name}</td>
                                        <td>{community.Location}</td>
                                        <td>{new Date(community.DateCreated).toLocaleString()}</td>
                                        <td>{community.Type}</td>
                                        <td style={{ maxWidth: '180px' }}>{community.Details}</td>
                                        <td>{community.Users?.length || 0}</td>
                                        <td>
                                            <button 
                                                className='action-btn' 
                                                onClick={() => navigate(`/community/${community.ComID}`)}
                                            >
                                                See Insights
                                            </button>
                                            {isMember ? (
                                                <button 
                                                    className='action-btn leave-btn' 
                                                    onClick={() => leaveCommunity(community.ComID)}
                                                >
                                                    Leave
                                                </button>
                                            ) : (
                                                <button 
                                                    className='action-btn join-btn' 
                                                    onClick={() => joinCommunity(community.ComID)}
                                                >
                                                    Join
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};