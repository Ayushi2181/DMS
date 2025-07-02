const FloodRisk = require('../models/FloodRisk');

class DecisionSupportService {
    constructor() {
        // Response protocols based on risk levels
        this.responseProtocols = {
            HIGH: {
                immediateActions: [
                    'Issue immediate evacuation orders',
                    'Activate emergency response teams',
                    'Deploy rescue boats and equipment',
                    'Set up emergency shelters'
                ],
                resourceAllocation: {
                    personnel: 'Maximum available',
                    equipment: 'All available rescue equipment',
                    shelters: 'All designated shelters',
                    medical: 'Full medical teams'
                },
                communication: [
                    'Emergency broadcast system activation',
                    'SMS alerts to all registered users',
                    'Social media updates every 30 minutes'
                ]
            },
            MODERATE: {
                immediateActions: [
                    'Issue flood warnings',
                    'Prepare evacuation routes',
                    'Pre-position emergency supplies',
                    'Monitor water levels hourly'
                ],
                resourceAllocation: {
                    personnel: '50% of available teams',
                    equipment: 'Basic rescue equipment',
                    shelters: 'Key shelters on standby',
                    medical: 'Basic medical teams'
                },
                communication: [
                    'Regular updates via SMS',
                    'Social media updates every 2 hours',
                    'Community alert system activation'
                ]
            },
            LOW: {
                immediateActions: [
                    'Monitor weather conditions',
                    'Check drainage systems',
                    'Update emergency contact lists',
                    'Review evacuation plans'
                ],
                resourceAllocation: {
                    personnel: 'Skeleton crew',
                    equipment: 'Basic monitoring equipment',
                    shelters: 'On standby',
                    medical: 'On-call teams'
                },
                communication: [
                    'Daily situation updates',
                    'Regular weather bulletins',
                    'Community awareness programs'
                ]
            }
        };

        // Evacuation planning parameters
        this.evacuationParameters = {
            maxEvacuationDistance: 50, // km
            shelterCapacity: 100, // people per shelter
            evacuationTimeEstimate: 2 // hours per 10km
        };

        // Sahana EDEN specific features
        this.sahanaFeatures = {
            incidentTracking: {
                statuses: ['DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED'],
                priorities: ['HIGH', 'MEDIUM', 'LOW'],
                categories: ['FLOOD', 'EVACUATION', 'RESCUE', 'RELIEF']
            },
            resourceManagement: {
                types: ['PERSONNEL', 'EQUIPMENT', 'VEHICLE', 'FACILITY', 'SUPPLY'],
                statuses: ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'LOST'],
                units: ['PERSON', 'UNIT', 'KIT', 'VEHICLE', 'FACILITY']
            },
            volunteerManagement: {
                roles: ['RESCUE', 'MEDICAL', 'LOGISTICS', 'COMMUNICATION', 'ADMIN'],
                statuses: ['ACTIVE', 'INACTIVE', 'ON_DUTY', 'OFF_DUTY'],
                skills: ['FIRST_AID', 'BOATING', 'COMMUNICATION', 'LOGISTICS', 'COUNSELING']
            }
        };

        // Enhanced response protocols with Sahana features
        this.responseProtocols = {
            HIGH: {
                ...this.responseProtocols.HIGH,
                incidentTracking: {
                    status: 'ACTIVE',
                    priority: 'HIGH',
                    categories: ['FLOOD', 'EVACUATION', 'RESCUE'],
                    assignedTo: 'EMERGENCY_RESPONSE_TEAM'
                },
                resourceManagement: {
                    personnel: {
                        type: 'PERSONNEL',
                        quantity: 'MAXIMUM',
                        roles: ['RESCUE', 'MEDICAL', 'LOGISTICS'],
                        status: 'IN_USE'
                    },
                    equipment: {
                        type: 'EQUIPMENT',
                        items: ['RESCUE_BOATS', 'MEDICAL_KITS', 'COMMUNICATION_DEVICES'],
                        status: 'IN_USE'
                    }
                },
                volunteerCoordination: {
                    requiredRoles: ['RESCUE', 'MEDICAL', 'LOGISTICS'],
                    requiredSkills: ['FIRST_AID', 'BOATING', 'COMMUNICATION'],
                    deploymentAreas: ['EVACUATION_ZONES', 'SHELTERS', 'MEDICAL_CENTERS']
                }
            },
            MODERATE: {
                ...this.responseProtocols.MODERATE,
                incidentTracking: {
                    status: 'ACTIVE',
                    priority: 'MEDIUM',
                    categories: ['FLOOD', 'EVACUATION'],
                    assignedTo: 'LOCAL_RESPONSE_TEAM'
                },
                resourceManagement: {
                    personnel: {
                        type: 'PERSONNEL',
                        quantity: 'MODERATE',
                        roles: ['RESCUE', 'LOGISTICS'],
                        status: 'ON_STANDBY'
                    },
                    equipment: {
                        type: 'EQUIPMENT',
                        items: ['BASIC_RESCUE_EQUIPMENT', 'COMMUNICATION_DEVICES'],
                        status: 'AVAILABLE'
                    }
                },
                volunteerCoordination: {
                    requiredRoles: ['LOGISTICS', 'COMMUNICATION'],
                    requiredSkills: ['COMMUNICATION', 'LOGISTICS'],
                    deploymentAreas: ['PREPARATION_ZONES', 'COMMUNICATION_CENTERS']
                }
            },
            LOW: {
                ...this.responseProtocols.LOW,
                incidentTracking: {
                    status: 'DRAFT',
                    priority: 'LOW',
                    categories: ['FLOOD'],
                    assignedTo: 'MONITORING_TEAM'
                },
                resourceManagement: {
                    personnel: {
                        type: 'PERSONNEL',
                        quantity: 'MINIMAL',
                        roles: ['MONITORING'],
                        status: 'AVAILABLE'
                    },
                    equipment: {
                        type: 'EQUIPMENT',
                        items: ['MONITORING_EQUIPMENT'],
                        status: 'AVAILABLE'
                    }
                },
                volunteerCoordination: {
                    requiredRoles: ['MONITORING'],
                    requiredSkills: ['COMMUNICATION'],
                    deploymentAreas: ['MONITORING_STATIONS']
                }
            }
        };
    }

    async generateRecommendations(floodRiskAssessment) {
        try {
            const { risk, riskScore, details, elevation, soilMoisture, nearestRiver } = floodRiskAssessment;
            
            // Get response protocol based on risk level
            const protocol = this.responseProtocols[risk];
            
            // Generate evacuation plan
            const evacuationPlan = this._generateEvacuationPlan(floodRiskAssessment);
            
            // Generate resource allocation plan
            const resourcePlan = this._generateResourcePlan(floodRiskAssessment);
            
            // Generate timeline
            const timeline = this._generateTimeline(floodRiskAssessment);

            // Generate volunteer coordination plan
            const volunteerPlan = this._generateVolunteerPlan(floodRiskAssessment);

            return {
                riskLevel: risk,
                riskScore,
                recommendations: {
                    immediateActions: protocol.immediateActions,
                    resourceAllocation: protocol.resourceAllocation,
                    communication: protocol.communication
                },
                evacuationPlan,
                resourcePlan,
                timeline,
                supportingData: {
                    elevation,
                    soilMoisture,
                    nearestRiver,
                    riskFactors: details
                },
                volunteerPlan,
                resourceManagement: protocol.resourceManagement,
                volunteerCoordination: protocol.volunteerCoordination
            };
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return {
                error: 'Failed to generate recommendations',
                details: error.message
            };
        }
    }

    _generateEvacuationPlan(assessment) {
        const { risk, nearestRiver } = assessment;
        const distanceToRiver = nearestRiver.distance;
        
        let evacuationZones = [];
        let shelterLocations = [];
        
        if (risk === 'HIGH') {
            // Immediate evacuation zone
            evacuationZones.push({
                priority: 1,
                radius: Math.min(10, distanceToRiver),
                population: 'High density areas first'
            });
            
            // Secondary evacuation zone
            evacuationZones.push({
                priority: 2,
                radius: Math.min(20, distanceToRiver + 10),
                population: 'Medium density areas'
            });
            
            // Shelter locations
            shelterLocations = this._calculateShelterLocations(assessment);
        } else if (risk === 'MODERATE') {
            // Warning zone
            evacuationZones.push({
                priority: 1,
                radius: Math.min(5, distanceToRiver),
                population: 'Critical infrastructure areas'
            });
            
            // Preparation zone
            evacuationZones.push({
                priority: 2,
                radius: Math.min(15, distanceToRiver + 5),
                population: 'High-risk communities'
            });
        }

        return {
            evacuationZones,
            shelterLocations,
            estimatedTime: this._calculateEvacuationTime(evacuationZones),
            routes: this._generateEvacuationRoutes(assessment)
        };
    }

    _generateResourcePlan(assessment) {
        const { risk, riskScore } = assessment;
        const protocol = this.responseProtocols[risk];
        
        return {
            personnel: {
                required: protocol.resourceAllocation.personnel,
                deployment: this._calculatePersonnelDeployment(riskScore)
            },
            equipment: {
                required: protocol.resourceAllocation.equipment,
                distribution: this._calculateEquipmentDistribution(assessment)
            },
            medical: {
                required: protocol.resourceAllocation.medical,
                facilities: this._identifyMedicalFacilities(assessment)
            }
        };
    }

    _generateTimeline(assessment) {
        const { risk } = assessment;
        const now = new Date();
        
        return {
            immediate: {
                time: '0-1 hour',
                actions: this.responseProtocols[risk].immediateActions.slice(0, 2)
            },
            shortTerm: {
                time: '1-6 hours',
                actions: this.responseProtocols[risk].immediateActions.slice(2)
            },
            mediumTerm: {
                time: '6-24 hours',
                actions: this._generateMediumTermActions(assessment)
            },
            longTerm: {
                time: '24+ hours',
                actions: this._generateLongTermActions(assessment)
            }
        };
    }

    _calculateShelterLocations(assessment) {
        // This would be implemented with actual shelter location data
        return [
            {
                name: 'Primary Shelter',
                capacity: this.evacuationParameters.shelterCapacity,
                distance: 5 // km
            },
            {
                name: 'Secondary Shelter',
                capacity: this.evacuationParameters.shelterCapacity,
                distance: 10 // km
            }
        ];
    }

    _calculateEvacuationTime(zones) {
        return zones.reduce((total, zone) => {
            return total + (zone.radius * this.evacuationParameters.evacuationTimeEstimate / 10);
        }, 0);
    }

    _generateEvacuationRoutes(assessment) {
        // This would be implemented with actual routing data
        return [
            {
                name: 'Primary Route',
                distance: 5, // km
                estimatedTime: 1 // hours
            },
            {
                name: 'Secondary Route',
                distance: 8, // km
                estimatedTime: 1.5 // hours
            }
        ];
    }

    _calculatePersonnelDeployment(riskScore) {
        return {
            emergencyResponders: Math.ceil(riskScore / 20),
            medicalStaff: Math.ceil(riskScore / 25),
            supportStaff: Math.ceil(riskScore / 30)
        };
    }

    _calculateEquipmentDistribution(assessment) {
        const { risk, nearestRiver } = assessment;
        return {
            rescueBoats: risk === 'HIGH' ? Math.ceil(nearestRiver.distance / 5) : 0,
            medicalKits: risk === 'HIGH' ? 10 : risk === 'MODERATE' ? 5 : 2,
            communicationDevices: risk === 'HIGH' ? 20 : risk === 'MODERATE' ? 10 : 5
        };
    }

    _identifyMedicalFacilities(assessment) {
        // This would be implemented with actual medical facility data
        return [
            {
                name: 'Primary Medical Center',
                distance: 3, // km
                capacity: 50
            },
            {
                name: 'Secondary Medical Center',
                distance: 7, // km
                capacity: 30
            }
        ];
    }

    _generateMediumTermActions(assessment) {
        return [
            'Assess damage to infrastructure',
            'Begin recovery operations',
            'Coordinate with relief organizations',
            'Update affected communities'
        ];
    }

    _generateLongTermActions(assessment) {
        return [
            'Implement flood prevention measures',
            'Review and update emergency plans',
            'Conduct post-disaster assessment',
            'Plan reconstruction efforts'
        ];
    }

    _generateVolunteerPlan(assessment) {
        const { risk } = assessment;
        const protocol = this.responseProtocols[risk].volunteerCoordination;

        return {
            requiredRoles: protocol.requiredRoles,
            requiredSkills: protocol.requiredSkills,
            deploymentAreas: protocol.deploymentAreas,
            coordinationCenters: this._identifyCoordinationCenters(assessment),
            communicationChannels: this._setupCommunicationChannels(assessment),
            trainingRequirements: this._determineTrainingRequirements(assessment)
        };
    }

    _calculateAffectedAreas(assessment) {
        const { risk, nearestRiver } = assessment;
        const distanceToRiver = nearestRiver.distance;

        if (risk === 'HIGH') {
            return [
                {
                    name: 'Primary Impact Zone',
                    radius: Math.min(10, distanceToRiver),
                    population: 'High density areas',
                    priority: 1
                },
                {
                    name: 'Secondary Impact Zone',
                    radius: Math.min(20, distanceToRiver + 10),
                    population: 'Medium density areas',
                    priority: 2
                }
            ];
        } else if (risk === 'MODERATE') {
            return [
                {
                    name: 'Warning Zone',
                    radius: Math.min(5, distanceToRiver),
                    population: 'Critical infrastructure areas',
                    priority: 1
                }
            ];
        }
        return [];
    }

    _calculateRequiredResources(assessment) {
        const { risk, riskScore } = assessment;
        return {
            personnel: {
                emergencyResponders: Math.ceil(riskScore / 20),
                medicalStaff: Math.ceil(riskScore / 25),
                logisticsStaff: Math.ceil(riskScore / 30),
                communicationStaff: Math.ceil(riskScore / 35)
            },
            equipment: {
                rescueBoats: risk === 'HIGH' ? Math.ceil(riskScore / 10) : 0,
                medicalKits: risk === 'HIGH' ? 10 : risk === 'MODERATE' ? 5 : 2,
                communicationDevices: risk === 'HIGH' ? 20 : risk === 'MODERATE' ? 10 : 5
            }
        };
    }

    _identifyCoordinationCenters(assessment) {
        return [
            {
                name: 'Primary Coordination Center',
                location: {
                    type: 'Point',
                    coordinates: [
                        assessment.location.coordinates[0] + 0.01,
                        assessment.location.coordinates[1] + 0.01
                    ]
                },
                capacity: 50,
                facilities: ['COMMUNICATION', 'LOGISTICS', 'ADMIN']
            },
            {
                name: 'Secondary Coordination Center',
                location: {
                    type: 'Point',
                    coordinates: [
                        assessment.location.coordinates[0] - 0.01,
                        assessment.location.coordinates[1] - 0.01
                    ]
                },
                capacity: 30,
                facilities: ['LOGISTICS', 'ADMIN']
            }
        ];
    }

    _setupCommunicationChannels(assessment) {
        const { risk } = assessment;
        const baseChannels = ['SMS', 'EMAIL', 'SOCIAL_MEDIA'];

        if (risk === 'HIGH') {
            return [...baseChannels, 'EMERGENCY_BROADCAST', 'RADIO', 'SIREN'];
        } else if (risk === 'MODERATE') {
            return [...baseChannels, 'COMMUNITY_ALERT'];
        }
        return baseChannels;
    }

    _determineTrainingRequirements(assessment) {
        const { risk } = assessment;
        
        if (risk === 'HIGH') {
            return {
                mandatory: ['FIRST_AID', 'RESCUE_OPERATIONS', 'EMERGENCY_COMMUNICATION'],
                recommended: ['PSYCHOLOGICAL_FIRST_AID', 'LOGISTICS_MANAGEMENT']
            };
        } else if (risk === 'MODERATE') {
            return {
                mandatory: ['BASIC_FIRST_AID', 'COMMUNICATION_SKILLS'],
                recommended: ['RESCUE_OPERATIONS']
            };
        }
        return {
            mandatory: ['BASIC_SAFETY'],
            recommended: ['FIRST_AID']
        };
    }
}

module.exports = new DecisionSupportService(); 