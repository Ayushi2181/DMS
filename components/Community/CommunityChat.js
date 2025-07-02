import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import '../../assets/CSS/CommunityChat.css';
import Arrow from '../../assets/images/arrows.png';

export const CommunityChat = () => {
    const { id } = useParams();
    const { token, user } = useAuth();
    const messRef = useRef(null);
    const [chatbox, setChatbox] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [communityName, setCommunityName] = useState('Community Chat');
    const [socket, setSocket] = useState(null);
    const chatEndRef = useRef(null);

    // Initialize Socket.IO connection
    useEffect(() => {
        try {
            const newSocket = io('http://localhost:5001', {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setError('Failed to connect to chat server. Please refresh the page.');
            });

            newSocket.on('connect', () => {
                console.log('Connected to chat server');
                setError(null);
            });

            setSocket(newSocket);

            return () => {
                if (newSocket) {
                    newSocket.disconnect();
                }
            };
        } catch (err) {
            console.error('Error initializing socket:', err);
            setError('Failed to initialize chat. Please refresh the page.');
        }
    }, []);

    // Join community chat room and set up message listener
    useEffect(() => {
        if (socket && id) {
            try {
                socket.emit('join_community', id);

                socket.on('message_received', (message) => {
                    setChatbox(prevMessages => [...prevMessages, message]);
                });

                return () => {
                    socket.emit('leave_community', id);
                    socket.off('message_received');
                };
            } catch (err) {
                console.error('Error joining chat room:', err);
                setError('Failed to join chat room. Please refresh the page.');
            }
        }
    }, [socket, id]);

    // Fetch community details and chat messages
    useEffect(() => {
        const fetchCommunityDetails = async () => {
            try {
                // Fetch community details to get the name
                const communityResponse = await fetch(`http://localhost:5001/api/v1/community/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!communityResponse.ok) {
                    const errorData = await communityResponse.json();
                    throw new Error(errorData.error || 'Failed to fetch community details');
                }

                const communityData = await communityResponse.json();
                setCommunityName(communityData.community.Name);

                // Fetch chat messages
                const chatResponse = await fetch(`http://localhost:5001/api/v1/community/${id}/chat`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!chatResponse.ok) {
                    const errorData = await chatResponse.json();
                    throw new Error(errorData.error || 'Failed to fetch chat messages');
                }

                const chatData = await chatResponse.json();
                setChatbox(chatData.messages || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchCommunityDetails();
        }
    }, [id, token]);

    // Scroll to bottom when chatbox updates
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatbox]);

    // Send a message
    const sendMessage = async () => {
        if (!messRef.current.value.trim()) return;

        try {
            const response = await fetch(`http://localhost:5001/api/v1/community/${id}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: messRef.current.value })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            const data = await response.json();
            messRef.current.value = '';
            messRef.current.focus();
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message);
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) return <div>Loading chat...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1>Chat</h1>
            <div className="chatbox-container">
                <h2 className='chat-header'>{communityName}</h2>
                <div className="chat-header-underline"></div>
                
                <div className="chatbox">
                    {chatbox.length === 0 ? (
                        <div className="message-container">
                            <div className="message">
                                <p>No messages yet. Be the first to send a message!</p>
                            </div>
                        </div>
                    ) : (
                        chatbox.map((message) => (
                            <div key={message.MessageID} className='message-container'>
                                <img src={Arrow} className="chat-person" alt="arrow" />
                                <div className={`message ${message.SenderID === user?.UserID ? 'mine' : ''}`}>
                                    <p style={{
                                        margin: '5px', fontSize:'small', fontFamily:'Times New Roman', fontWeight:'bold', marginLeft:'2px'
                                    }}>
                                        {message.SenderID === user?.UserID ? 'Me' : message.SenderName}
                                    </p>
                                    {message.Message}
                                    <span className='time'>
                                        {new Date(message.DateSent).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}>
                    <input 
                        type="text" 
                        className="input-text" 
                        ref={messRef} 
                        placeholder="Type your message here..."
                    />
                    <button className="sendMessage" type="submit">Send</button>
                </form>
            </div>
        </>
    );
};