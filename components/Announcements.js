import React, { useState, useEffect } from 'react';
import '../assets/CSS/Announcements.css';
import { useDispatch, useSelector } from 'react-redux';
import { changeRole } from '../store/roleSlice';

export const Announcements = () => {
    const dispatch = useDispatch();
    const isAdmin = useSelector(state => state.roleState.isAdmin);
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/announcements');
            const data = await response.json();
            setAnnouncements(data.announcements || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/v1/announcements/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowForm(false);
                fetchAnnouncements();
            } else {
                throw new Error('Failed to create announcement');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement. Please try again.');
        }
    };

    const handleDelete = async (announcementId) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/v1/announcements/${announcementId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchAnnouncements();
            } else {
                throw new Error('Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement. Please try again.');
        }
    };

    return (
        <div className="announcements-container">
            <h1 className="section-header">Announcements</h1>

            {isAdmin && (
                <div className="create-announcement">
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Create New Announcement'}
                    </button>
                </div>
            )}

            {showForm && (
                <div className="announcement-form active">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <table className="announcement-list">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Content</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement) => (
                        <tr key={announcement._id}>
                            <td>{announcement.title}</td>
                            <td>{new Date(announcement.date).toLocaleDateString()}</td>
                            <td>{announcement.content}</td>
                            {isAdmin && (
                                <td>
                                    <button
                                        onClick={() => handleDelete(announcement._id)}
                                        style={{
                                            backgroundColor: '#be6a57',
                                            color: 'white',
                                            border: 'none',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};