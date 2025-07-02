const axios = require('axios');
const copernicusService = require('./copernicusService');
const CrowdsourceService = require('./crowdsourceService');
const decisionSupportService = require('./decisionSupportService');

// Major rivers in India with detailed information
const MAJOR_RIVERS = [
    { 
        name: 'Ganges', 
        lat: 25.3, 
        lng: 83.0,
        length: 2525,
        basinArea: 1080000,
        states: ['Uttarakhand', 'Uttar Pradesh', 'Bihar', 'West Bengal'],
        floodRisk: 'HIGH'
    },
    { 
        name: 'Brahmaputra', 
        lat: 26.2, 
        lng: 92.8,
        length: 2900,
        basinArea: 651334,
        states: ['Arunachal Pradesh', 'Assam'],
        floodRisk: 'HIGH'
    },
    { 
        name: 'Godavari', 
        lat: 19.0, 
        lng: 73.3,
        length: 1465,
        basinArea: 312812,
        states: ['Maharashtra', 'Telangana', 'Andhra Pradesh'],
        floodRisk: 'MODERATE'
    },
    { 
        name: 'Krishna', 
        lat: 16.3, 
        lng: 80.4,
        length: 1400,
        basinArea: 258948,
        states: ['Maharashtra', 'Karnataka', 'Andhra Pradesh'],
        floodRisk: 'MODERATE'
    },
    { 
        name: 'Yamuna', 
        lat: 25.4, 
        lng: 81.8,
        length: 1376,
        basinArea: 366223,
        states: ['Uttarakhand', 'Haryana', 'Delhi', 'Uttar Pradesh'],
        floodRisk: 'HIGH'
    },
    { 
        name: 'Narmada', 
        lat: 22.2, 
        lng: 73.0,
        length: 1312,
        basinArea: 98796,
        states: ['Madhya Pradesh', 'Maharashtra', 'Gujarat'],
        floodRisk: 'MODERATE'
    },
    { 
        name: 'Mahanadi', 
        lat: 20.3, 
        lng: 85.8,
        length: 858,
        basinArea: 141589,
        states: ['Chhattisgarh', 'Odisha'],
        floodRisk: 'HIGH'
    },
    { 
        name: 'Kaveri', 
        lat: 12.0, 
        lng: 79.8,
        length: 805,
        basinArea: 81155,
        states: ['Karnataka', 'Tamil Nadu'],
        floodRisk: 'MODERATE'
    }
];

// High risk cities
// High risk cities
const HIGH_RISK_CITIES = [
    {
        name: 'Mumbai',
        lat: { min: 18.5, max: 19.6 },  // Expanded from 18.8-19.3
        lng: { min: 72.4, max: 73.4 },  // Expanded from 72.7-73.1
        riskLevel: 'HIGH',
        description: 'Coastal city with urban flooding issues',
        majorRivers: ['Mithi', 'Oshiwara', 'Dahisar'],
        historicalFloods: [
            { year: 2005, severity: 'HIGH', affected: '20 million' },
            { year: 2017, severity: 'MODERATE', affected: '12 million' }
        ]
    },
    {
        name: 'Kolkata',
        lat: { min: 21.9, max: 23.0 },  // Expanded from 22.2-22.7
        lng: { min: 87.8, max: 88.9 },  // Expanded from 88.1-88.6
        riskLevel: 'HIGH',
        description: 'Urban area with frequent monsoon flooding',
        majorRivers: ['Hooghly'],
        historicalFloods: [
            { year: 2020, severity: 'HIGH', affected: '1.2 million' },
            { year: 2021, severity: 'MODERATE', affected: '0.8 million' }
        ]
    },
    {
        name: 'Chennai',
        lat: { min: 12.4, max: 13.6 },  // Expanded from 12.7-13.3
        lng: { min: 79.8, max: 80.8 },  // Expanded from 80.1-80.5
        riskLevel: 'HIGH',
        description: 'Coastal city with urban flooding',
        majorRivers: ['Cooum', 'Adyar', 'Kosasthalaiyar'],
        historicalFloods: [
            { year: 2015, severity: 'HIGH', affected: '4 million' },
            { year: 2021, severity: 'MODERATE', affected: '2 million' }
        ]
    }
];


// Moderate risk cities
const MODERATE_RISK_CITIES = [
    {
        name: 'Pune',
        lat: { min: 18.1, max: 19.0 },  // Expanded from 18.4-18.7
        lng: { min: 73.4, max: 74.2 },  // Expanded from 73.7-73.9
        riskLevel: 'MODERATE',
        description: 'City with moderate monsoon flooding',
        majorRivers: ['Mula', 'Mutha'],
        historicalFloods: [
            { year: 2019, severity: 'MODERATE', affected: '0.5 million' }
        ]
    },
    {
        name: 'Hyderabad',
        lat: { min: 17.0, max: 17.9 },  // Expanded from 17.3-17.6
        lng: { min: 78.0, max: 78.9 },  // Expanded from 78.3-78.6
        riskLevel: 'MODERATE',
        description: 'City with moderate urban flooding',
        majorRivers: ['Musi'],
        historicalFloods: [
            { year: 2020, severity: 'MODERATE', affected: '0.3 million' }
        ]
    }
];


// Low risk cities
const LOW_RISK_CITIES = [
    {
        name: 'Bangalore',
        lat: { min: 12.5, max: 13.4 },  // Expanded from 12.8-13.1
        lng: { min: 77.2, max: 78.1 },  // Expanded from 77.5-77.8
        riskLevel: 'LOW',
        description: 'City with low flood risk',
        majorRivers: ['Vrishabhavathi'],
        historicalFloods: [
            { year: 2022, severity: 'LOW', affected: '0.1 million' }
        ]
    },
    {
        name: 'Ahmedabad',
        lat: { min: 22.7, max: 23.4 },  // Expanded from 23.0-23.1
        lng: { min: 72.2, max: 73.0 },  // Expanded from 72.5-72.7
        riskLevel: 'LOW',
        description: 'City with low flood risk',
        majorRivers: ['Sabarmati'],
        historicalFloods: [
            { year: 2006, severity: 'LOW', affected: '0.05 million' }
        ]
    }
];

// Combine all regions
const ALL_RISK_REGIONS = [
    ...HIGH_RISK_CITIES,
    ...MODERATE_RISK_CITIES,
    ...LOW_RISK_CITIES
];

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Helper function to check if location is in any risk region
function isInHighRiskRegion(lat, lng) {
    return ALL_RISK_REGIONS.find(region => 
        lat >= region.lat.min && lat <= region.lat.max &&
        lng >= region.lng.min && lng <= region.lng.max
    );
}

// Helper function to find nearest river
function findNearestRiver(lat, lng) {
    let nearestRiver = null;
    let minDistance = Infinity;

    MAJOR_RIVERS.forEach(river => {
        const distance = calculateDistance(lat, lng, river.lat, river.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestRiver = { ...river, distance };
        }
    });

    return nearestRiver;
}

// Helper function to calculate elevation based on location
function calculateElevation(lat, lng) {
    // Simple elevation calculation based on latitude and proximity to coast
    const baseElevation = 100; // Base elevation in meters
    const coastalEffect = Math.abs(lat - 20) * 10; // Higher elevation away from equator
    const riverEffect = findNearestRiver(lat, lng).distance * 2; // Higher elevation away from rivers
    
    return Math.max(baseElevation + coastalEffect - riverEffect, 10);
}

// Helper function to calculate soil moisture
function calculateSoilMoisture(lat, lng) {
    // Simple soil moisture calculation based on location and season
    const month = new Date().getMonth();
    const isMonsoon = month >= 6 && month <= 9; // June to September
    const baseMoisture = isMonsoon ? 0.7 : 0.3;
    const riverEffect = Math.max(0, 1 - (findNearestRiver(lat, lng).distance / 100));
    
    return Math.min(baseMoisture + riverEffect, 1);
}

class FloodVerificationService {
    constructor() {
        this.crowdsourceService = new CrowdsourceService();
    }

    async verifyFloodRisk(lat, lng) {
        try {
            // Debug logging for region detection
            console.log('Verifying for:', lat, lng);
            const highRiskRegion = isInHighRiskRegion(lat, lng);
            console.log('Matched region:', highRiskRegion);

            // Get crowdsourced data
            const crowdsourcedData = await this.crowdsourceService.getCrowdsourcedFloodData(lat, lng);

            // Get satellite data
            const satelliteData = await copernicusService.getFloodMappingData(lat, lng);

            // Get basic risk assessment
            const elevation = calculateElevation(lat, lng);
            const soilMoisture = calculateSoilMoisture(lat, lng);
            const nearestRiver = findNearestRiver(lat, lng);

            // Calculate risk level and score
            let riskLevel = 'LOW';
            let riskScore = 0;
            const details = [];

            // Add elevation risk
            if (elevation < 50) {
                riskScore += 30;
                details.push({
                    type: 'ELEVATION',
                    message: 'Low elevation area',
                    value: elevation,
                    riskLevel: 'HIGH'
                });
            } else if (elevation < 100) {
                riskScore += 15;
                details.push({
                    type: 'ELEVATION',
                    message: 'Moderate elevation area',
                    value: elevation,
                    riskLevel: 'MODERATE'
                });
            }

            // Add river proximity risk
            if (nearestRiver.distance < 5) {
                riskScore += 30;
                details.push({
                    type: 'RIVER',
                    message: `Very close to ${nearestRiver.name} river`,
                    value: nearestRiver.distance,
                    riskLevel: 'HIGH',
                    riverInfo: {
                        name: nearestRiver.name,
                        length: nearestRiver.length,
                        basinArea: nearestRiver.basinArea,
                        states: nearestRiver.states
                    }
                });
            } else if (nearestRiver.distance < 20) {
                riskScore += 15;
                details.push({
                    type: 'RIVER',
                    message: `Close to ${nearestRiver.name} river`,
                    value: nearestRiver.distance,
                    riskLevel: 'MODERATE',
                    riverInfo: {
                        name: nearestRiver.name,
                        length: nearestRiver.length,
                        basinArea: nearestRiver.basinArea,
                        states: nearestRiver.states
                    }
                });
            }

            // Add soil moisture risk
            if (soilMoisture > 0.8) {
                riskScore += 20;
                details.push({
                    type: 'SOIL',
                    message: 'High soil moisture',
                    value: soilMoisture,
                    riskLevel: 'HIGH'
                });
            } else if (soilMoisture > 0.5) {
                riskScore += 10;
                details.push({
                    type: 'SOIL',
                    message: 'Moderate soil moisture',
                    value: soilMoisture,
                    riskLevel: 'MODERATE'
                });
            }

            // Add historical flood risk
            if (highRiskRegion) {
                riskScore += 40;  // Increased from 20 to 40
                details.push({
                    type: 'REGION',
                    message: `Located in ${highRiskRegion.name} flood-prone region`,
                    riskLevel: highRiskRegion.riskLevel,
                    historicalData: highRiskRegion.historicalFloods
                });
            }

            // Set riskLevel directly from region if found
            if (highRiskRegion) {
                riskLevel = highRiskRegion.riskLevel;  // This line is already correct
            } else {
                if (riskScore >= 60) {
                    riskLevel = 'HIGH';
                } else if (riskScore >= 30) {
                    riskLevel = 'MODERATE';
                } else {
                    riskLevel = 'LOW';
                }
            }

            // Prepare location object for DSS
            const location = { type: 'Point', coordinates: [lng, lat] };

            // Get decision support recommendations (DSS)
            const dss = await decisionSupportService.generateRecommendations({
                risk: riskLevel,
                riskScore,
                details,
                elevation,
                soilMoisture,
                nearestRiver,
                highRiskRegion,
                location
            });

            // Return the complete assessment data
            return {
                risk: riskLevel,
                riskScore,
                elevation,
                soilMoisture,
                riverLevel: nearestRiver.distance < 5 ? 10 : 5,
                details,
                satelliteData,
                crowdsourcedData,
                ...dss
            };
        } catch (error) {
            console.error('Error in flood risk verification:', error);
            throw error;
        }
    }
}

// Create an instance of the service
const floodVerificationService = new FloodVerificationService();

// Export the assessFloodRisk function for backward compatibility
module.exports = {
    assessFloodRisk: (lat, lng) => floodVerificationService.verifyFloodRisk(lat, lng)
};
