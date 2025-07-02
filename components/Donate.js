import React, { useState } from 'react';
import '../assets/CSS/Donate.css';

export const Donate = () => {
    const [selectedAmount, setSelectedAmount] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const amountOptions = ['500', '1000', '2000', '5000', '10000'];
    const paymentOptions = [
        { id: 'credit', icon: '💳', label: 'Credit/Debit Card' },
        { id: 'upi', icon: 'UPI', label: 'UPI Payment' },
        { id: 'crypto', icon: '💰', label: 'Cryptocurrency' }
    ];

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
    };

    const handlePaymentSelect = (payment) => {
        setSelectedPayment(payment);
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Donation submitted:', {
            amount: selectedAmount,
            paymentMethod: selectedPayment,
            ...formData
        });
        // Reset form
        setSelectedAmount('');
        setSelectedPayment('');
        setShowForm(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <div className="donate-container">
            <h1 className="donate-header">Support Our Cause</h1>
            
            <div className="donate-section">
                <div className="donate-content">
                    <div className="donate-card">
                        <h3>Choose Amount</h3>
                        <div className="amount-options">
                            {amountOptions.map(amount => (
                                <button
                                    key={amount}
                                    className={`amount-button ${selectedAmount === amount ? 'selected' : ''}`}
                                    onClick={() => handleAmountSelect(amount)}
                                >
                                    ₹{amount}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="donate-card">
                        <h3>Payment Methods</h3>
                        <div className="payment-methods">
                            {paymentOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`payment-option ${selectedPayment === option.id ? 'active' : ''}`}
                                    onClick={() => handlePaymentSelect(option.id)}
                                >
                                    <span>{option.icon}</span>
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showForm && (
                        <div className="donate-card">
                            <h3>Donation Details</h3>
                            <form onSubmit={handleSubmit} className="donate-form active">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        Donate Now
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
