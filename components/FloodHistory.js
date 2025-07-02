import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

export const FloodHistory = () => {
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistoryData();
    }, []);

    const fetchHistoryData = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get('/api/v1/flood/history');
            setHistoryData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching flood history');
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        if (!historyData || historyData.length === 0) return null;

        // Group data by month
        const monthlyData = {};
        historyData.forEach(item => {
            const date = new Date(item.createdAt);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const key = `${month} ${year}`;

            if (!monthlyData[key]) {
                monthlyData[key] = {
                    riskScore: 0,
                    count: 0,
                    month: month,
                    year: year
                };
            }

            monthlyData[key].riskScore += item.riskScore;
            monthlyData[key].count++;
        });

        const labels = Object.keys(monthlyData).sort();
        const riskScores = labels.map(key => monthlyData[key].riskScore);
        const counts = labels.map(key => monthlyData[key].count);

        return {
            labels,
            datasets: [
                {
                    label: 'Average Risk Score',
                    data: labels.map((label, index) => riskScores[index] / counts[index]),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Number of Assessments',
                    data: counts,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }
            ]
        };
    };

    const renderChart = () => {
        const data = getChartData();
        if (!data) return null;

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Flood Risk History'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        return (
            <div className="mt-4">
                <Line data={data} options={options} />
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h3 className="text-center mb-4">Historical Flood Risk Analysis</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {loading && <div className="text-center">Loading...</div>}
                    {renderChart()}
                </div>
            </div>
        </div>
    );
};

export default FloodHistory;
