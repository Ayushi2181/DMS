import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapEvents from './MapEvents';
import FloodVerification from './FloodVerification';

// Fix the default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
});

const FloodMap = ({ location, floodData }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { token } = useAuth();

    const verifyFloodRisk = async () => {
        if (!selectedLocation) {
            setError('Please select a location on the map');
            return;
        }

        if (!token) {
            setError('Please login to verify flood risk');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Selected location:', selectedLocation); // Debug log
            const response = await axios.post(
                'http://localhost:5001/api/v1/flood/verify',
                {
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            console.log('API response:', response.data); // Debug log
            setAssessment(response.data);
        } catch (err) {
            console.error('Flood verification error:', err);
            setError(err.response?.data?.error || err.message || 'Error verifying flood risk. Please try again.');
            setAssessment(null);
        } finally {
            setLoading(false);
        }
    };

    const renderAssessment = () => {
        if (!assessment) return null;

        const riskColors = {
            LOW: 'success',
            MODERATE: 'warning',
            HIGH: 'danger'
        };

        return (
            <div className="mt-4">
                <div className={`alert alert-${riskColors[assessment.risk]}`}>
                    <h4 className="alert-heading">Flood Risk Assessment</h4>
                    <p>Risk Level: {assessment.risk}</p>
                    <p>Risk Score: {assessment.riskScore}</p>
                    {assessment.details && assessment.details.length > 0 ? (
                        <div>
                            <h5>Details:</h5>
                            <ul>
                                {assessment.details.map((detail, index) => (
                                    <li key={index}>
                                        <strong>{detail.type}:</strong> {detail.message}
                                        {detail.riskLevel && (
                                            <span className={`badge bg-${riskColors[detail.riskLevel]} ms-2`}>
                                                {detail.riskLevel}
                                            </span>
                                        )}
                                        {detail.value !== undefined && (
                                            <span className="ms-2">(Value: {detail.value.toFixed(2)})</span>
                                        )}
                                        {detail.historicalData && detail.historicalData.length > 0 && (
                                            <div className="mt-1">
                                                <small>Historical Data:</small>
                                                <ul className="list-unstyled ms-3">
                                                    {detail.historicalData.map((event, idx) => (
                                                        <li key={idx}>
                                                            {event.year}: {event.severity} - {event.affected}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {detail.riverInfo && (
                                            <div className="mt-1">
                                                <small>River Info:</small>
                                                <ul className="list-unstyled ms-3">
                                                    <li>Length: {detail.riverInfo.length} km</li>
                                                    <li>Basin Area: {detail.riverInfo.basinArea} km²</li>
                                                    <li>States: {detail.riverInfo.states.join(', ')}</li>
                                                </ul>
                                            </div>
                                        )}
                                        {detail.type === 'SATELLITE' && (
                                            <div className="mt-1">
                                                <small>Satellite Data:</small>
                                                <ul className="list-unstyled ms-3">
                                                    <li>Source: {detail.source}</li>
                                                    <li>Confidence: {detail.confidence}</li>
                                                    <li>Last Update: {new Date(detail.metadata.acquisitionDate).toLocaleDateString()}</li>
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No specific risk factors identified</p>
                    )}
                    {assessment.satelliteData && (
                        <div className="mt-3">
                            <h5>Satellite Mapping Data</h5>
                            {assessment.satelliteData.hasFloodData ? (
                                <div className="alert alert-info">
                                    <p>Recent flood mapping data available from Copernicus EMS</p>
                                    <p>Last Update: {new Date(assessment.satelliteData.lastUpdate).toLocaleDateString()}</p>
                                    <p>Confidence: {assessment.satelliteData.confidence}</p>
                                </div>
                            ) : (
                                <div className="alert alert-secondary">
                                    <p>No recent satellite mapping data available for this area</p>
                                    {assessment.satelliteData.error && (
                                        <p className="text-danger">Error: {assessment.satelliteData.error}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    <p>Elevation: {assessment.elevation?.toFixed(2) || 'N/A'} meters</p>
                    {assessment.historicalData?.recentFloods > 0 && (
                        <p>Recent Floods: {assessment.historicalData.recentFloods}</p>
                    )}
                    {assessment.soilMoisture !== undefined && (
                        <p>Soil Moisture: {assessment.soilMoisture.toFixed(2)}</p>
                    )}
                    {assessment.riverLevel !== undefined && (
                        <p>River Level: {assessment.riverLevel.toFixed(2)} ft</p>
                    )}
                </div>
            </div>
        );
    };

    const renderCrowdsourcedData = (data) => {
        if (!data?.metadata?.crowdsource) return null;

        const { ushahidi, photMapper } = data.metadata.crowdsource;
        
        return (
            <div className="crowdsourced-data">
                <h3>Crowdsourced Reports</h3>
                <div className="reports-grid">
                    {ushahidi?.reports?.map(report => (
                        <div key={report.id} className="report-card">
                            <h4>{report.title}</h4>
                            <p>{report.description}</p>
                            <div className="report-meta">
                                <span className={`severity ${report.severity.toLowerCase()}`}>
                                    {report.severity}
                                </span>
                                <span className="water-level">
                                    Water Level: {report.waterLevel}
                                </span>
                                {report.verified && <span className="verified">✓ Verified</span>}
                            </div>
                            <div className="report-time">
                                {new Date(report.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <h3>Photo Evidence</h3>
                <div className="photos-grid">
                    {photMapper?.photos?.map(photo => (
                        <div key={photo.id} className="photo-card">
                            <img src={photo.url} alt="Flood evidence" />
                            <div className="photo-meta">
                                <span className="water-level">
                                    Water Level: {photo.waterLevel}
                                </span>
                                {photo.verified && <span className="verified">✓ Verified</span>}
                            </div>
                            <div className="photo-time">
                                {new Date(photo.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h3 className="text-center mb-4">Flood Risk Verification Map</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <MapContainer 
                        center={[20.5937, 78.9629]} 
                        zoom={5} 
                        style={{ height: '500px', width: '100%' }}
                        className="mb-4"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {selectedLocation && (
                            <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                                <Popup>
                                    Selected Location<br />
                                    Lat: {selectedLocation.lat.toFixed(4)}<br />
                                    Lng: {selectedLocation.lng.toFixed(4)}
                                </Popup>
                            </Marker>
                        )}
                        <MapEvents onLocationSelect={setSelectedLocation} />
                    </MapContainer>
                    <div className="text-center mb-3">
                        <button
                            className="btn btn-primary"
                            onClick={verifyFloodRisk}
                            disabled={!selectedLocation || loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Flood Risk'}
                        </button>
                    </div>
                    {assessment && <FloodVerification assessment={assessment} />}
                    
                    {floodData?.details?.find(d => d.type === 'CROWDSOURCE') && (
                        <div className="crowdsourced-section">
                            {renderCrowdsourcedData(floodData)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = `
    .crowdsourced-data {
        margin-top: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .reports-grid, .photos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
        margin-top: 10px;
    }

    .report-card, .photo-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .photo-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
    }

    .report-meta, .photo-meta {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        font-size: 0.9em;
    }

    .severity {
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: bold;
    }

    .severity.high {
        background: #ffebee;
        color: #c62828;
    }

    .severity.moderate {
        background: #fff3e0;
        color: #ef6c00;
    }

    .severity.low {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .verified {
        color: #2e7d32;
        font-weight: bold;
    }

    .report-time, .photo-time {
        font-size: 0.8em;
        color: #666;
    }

    .water-level {
        color: #1976d2;
    }
`;

export default FloodMap;
