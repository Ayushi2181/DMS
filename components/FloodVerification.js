import React, { useState } from 'react';
import { Card, CardBody, Alert } from 'reactstrap';

const FloodVerification = ({ assessment }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Debug log to check assessment data
    console.log('Assessment data:', assessment);

    const renderRiskOverview = () => {
        if (!assessment) {
            console.log('No assessment data available');
            return (
                <Alert color="info">
                    No assessment data available. Please verify a location first.
                </Alert>
            );
        }

        const riskColors = {
            LOW: 'success',
            MODERATE: 'warning',
            HIGH: 'danger'
        };

        return (
            <div className="mt-4">
                <Alert color={riskColors[assessment.risk]}>
                    <h4 className="alert-heading">Flood Risk Assessment</h4>
                    <p>Risk Level: {assessment.risk}</p>
                    <p>Risk Score: {assessment.riskScore}</p>
                    {assessment.details && assessment.details.length > 0 && (
                        <div>
                            <h5>Details:</h5>
                            <ul>
                                {assessment.details.map((detail, index) => (
                                    <li key={index}>{detail.message}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p>Elevation: {assessment.elevation} meters</p>
                </Alert>
            </div>
        );
    };

    const renderRecommendations = () => {
        if (!assessment) {
            return (
                <Alert color="info">
                    No assessment data available. Please verify a location first.
                </Alert>
            );
        }

        if (!assessment.recommendations) {
            console.log('No recommendations in assessment data');
            return (
                <Alert color="info">
                    No recommendations available for this assessment.
                </Alert>
            );
        }

        const recommendations = assessment.recommendations;
        console.log('Recommendations data:', recommendations);

        return (
            <div className="mt-4">
                <h4>Decision Support Recommendations</h4>
                
                {recommendations.immediateActions && recommendations.immediateActions.length > 0 && (
                    <Card className="mb-3">
                        <CardBody>
                            <h5>Immediate Actions</h5>
                            <ul>
                                {recommendations.immediateActions.map((action, index) => (
                                    <li key={index}>{action}</li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                )}

                {recommendations.resourceAllocation && Object.keys(recommendations.resourceAllocation).length > 0 && (
                    <Card className="mb-3">
                        <CardBody>
                            <h5>Resource Allocation</h5>
                            <ul>
                                {Object.entries(recommendations.resourceAllocation).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                )}

                {recommendations.communication && recommendations.communication.length > 0 && (
                    <Card className="mb-3">
                        <CardBody>
                            <h5>Communication Plan</h5>
                            <ul>
                                {recommendations.communication.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                )}
            </div>
        );
    };

    const renderEvacuationPlan = () => {
        if (!assessment) {
            return (
                <Alert color="info">
                    No assessment data available. Please verify a location first.
                </Alert>
            );
        }

        if (!assessment.evacuationPlan) {
            console.log('No evacuation plan in assessment data');
            return (
                <Alert color="info">
                    No evacuation plan available for this assessment.
                </Alert>
            );
        }

        const plan = assessment.evacuationPlan;
        console.log('Evacuation plan data:', plan);

        return (
            <div className="mt-4">
                <h4>Evacuation Plan</h4>
                
                {plan.evacuationZones && plan.evacuationZones.length > 0 && (
                    <Card className="mb-3">
                        <CardBody>
                            <h5>Evacuation Zones</h5>
                            <ul>
                                {plan.evacuationZones.map((zone, index) => (
                                    <li key={index}>
                                        Priority {zone.priority}: {zone.radius}km radius - {zone.population}
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                )}

                {plan.shelterLocations && plan.shelterLocations.length > 0 && (
                    <Card className="mb-3">
                        <CardBody>
                            <h5>Shelter Locations</h5>
                            <ul>
                                {plan.shelterLocations.map((shelter, index) => (
                                    <li key={index}>
                                        {shelter.name}: {shelter.capacity} capacity, {shelter.distance}km away
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                )}

                {plan.routes && plan.routes.length > 0 && (
                    <Card className="mb-3">
                        <CardBody>
                            <h5>Evacuation Routes</h5>
                            <ul>
                                {plan.routes.map((route, index) => (
                                    <li key={index}>
                                        {route.name}: {route.distance}km, estimated time: {route.estimatedTime} hours
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                )}
            </div>
        );
    };

    const renderTimeline = () => {
        if (!assessment) {
            return (
                <Alert color="info">
                    No assessment data available. Please verify a location first.
                </Alert>
            );
        }

        if (!assessment.timeline) {
            console.log('No timeline in assessment data');
            return (
                <Alert color="info">
                    No timeline available for this assessment.
                </Alert>
            );
        }

        const timeline = assessment.timeline;
        console.log('Timeline data:', timeline);

        return (
            <div className="mt-4">
                <h4>Action Timeline</h4>
                {Object.entries(timeline).map(([period, data]) => (
                    <Card key={period} className="mb-3">
                        <CardBody>
                            <h5>{period.charAt(0).toUpperCase() + period.slice(1)} ({data.time})</h5>
                            <ul>
                                {data.actions.map((action, index) => (
                                    <li key={index}>{action}</li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    };

    const renderVolunteerPlan = () => {
        if (!assessment) {
            return (
                <Alert color="info">
                    No assessment data available. Please verify a location first.
                </Alert>
            );
        }

        if (!assessment.volunteerPlan) {
            console.log('No volunteer plan in assessment data');
            return (
                <Alert color="info">
                    No volunteer plan available for this assessment.
                </Alert>
            );
        }

        const plan = assessment.volunteerPlan;
        console.log('Volunteer plan data:', plan);

        return (
            <div className="mt-4">
                <h4>Volunteer Coordination</h4>
                <div className="card">
                    <div className="card-body">
                        <h5>Required Roles and Skills</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <h6>Roles</h6>
                                <ul>
                                    {plan.requiredRoles.map((role, index) => (
                                        <li key={index}>{role}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h6>Skills</h6>
                                <ul>
                                    {plan.requiredSkills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <h5 className="mt-3">Deployment Areas</h5>
                        <ul>
                            {plan.deploymentAreas.map((area, index) => (
                                <li key={index}>{area}</li>
                            ))}
                        </ul>

                        <h5 className="mt-3">Coordination Centers</h5>
                        {plan.coordinationCenters.map((center, index) => (
                            <div key={index} className="mb-3">
                                <h6>{center.name}</h6>
                                <p><strong>Capacity:</strong> {center.capacity} people</p>
                                <p><strong>Facilities:</strong> {center.facilities.join(', ')}</p>
                            </div>
                        ))}

                        <h5 className="mt-3">Communication Channels</h5>
                        <ul>
                            {plan.communicationChannels.map((channel, index) => (
                                <li key={index}>{channel}</li>
                            ))}
                        </ul>

                        <h5 className="mt-3">Training Requirements</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <h6>Mandatory Training</h6>
                                <ul>
                                    {plan.trainingRequirements.mandatory.map((training, index) => (
                                        <li key={index}>{training}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h6>Recommended Training</h6>
                                <ul>
                                    {plan.trainingRequirements.recommended.map((training, index) => (
                                        <li key={index}>{training}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`btn ${activeTab === 'recommendations' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('recommendations')}
                >
                    Recommendations
                </button>
                <button
                    className={`btn ${activeTab === 'evacuation' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('evacuation')}
                >
                    Evacuation Plan
                </button>
                <button
                    className={`btn ${activeTab === 'timeline' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    Timeline
                </button>
                <button
                    className={`btn ${activeTab === 'volunteers' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('volunteers')}
                >
                    Volunteer Plan
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && renderRiskOverview()}
                {activeTab === 'recommendations' && renderRecommendations()}
                {activeTab === 'evacuation' && renderEvacuationPlan()}
                {activeTab === 'timeline' && renderTimeline()}
                {activeTab === 'volunteers' && renderVolunteerPlan()}
            </div>
        </div>
    );
};

export default FloodVerification; 