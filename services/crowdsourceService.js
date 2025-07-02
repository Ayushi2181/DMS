const axios = require('axios');

class CrowdsourceService {
    constructor() {
        this.overpassApiUrl = 'https://overpass-api.de/api/interpreter';
    }

    async getCrowdsourcedFloodData(lat, lng, radius = 50) {
        try {
            // Get OSM data
            const osmData = await this._getOSMFloodData(lat, lng, radius);

            return {
                hasCrowdsourcedData: true,
                lastUpdate: new Date().toISOString(),
                source: 'OpenStreetMap Data',
                metadata: {
                    totalReports: osmData?.elements?.length || 0,
                    osm: this._processOSMData(osmData),
                    confidence: this._calculateCrowdsourceConfidence(osmData)
                }
            };
        } catch (error) {
            console.error('Error fetching crowdsourced data:', error);
            return {
                hasCrowdsourcedData: false,
                error: 'Unable to fetch crowdsourced data',
                lastUpdate: new Date().toISOString()
            };
        }
    }

    async _getOSMFloodData(lat, lng, radius) {
        try {
            const query = `
                [out:json][timeout:25];
                (
                    node["flood"](around:${radius * 1000},${lat},${lng});
                    way["flood"](around:${radius * 1000},${lat},${lng});
                    relation["flood"](around:${radius * 1000},${lat},${lng});
                );
                out body;
                >;
                out skel qt;
            `;

            const response = await axios.post(this.overpassApiUrl, query);
            return response.data;
        } catch (error) {
            console.warn('OSM API error:', error.message);
            return null;
        }
    }

    _processOSMData(data) {
        if (!data?.elements) return null;

        return {
            totalReports: data.elements.length,
            reports: data.elements.map(element => ({
                id: element.id,
                type: element.type,
                tags: element.tags,
                timestamp: element.timestamp,
                location: {
                    lat: element.lat,
                    lng: element.lon
                }
            })),
            lastUpdate: new Date().toISOString()
        };
    }

    _calculateCrowdsourceConfidence(osmData) {
        let confidence = 0.5; // Base confidence

        // Factor 1: Number of reports
        const totalReports = osmData?.elements?.length || 0;
        if (totalReports >= 10) confidence += 0.3;
        else if (totalReports >= 5) confidence += 0.2;
        else if (totalReports >= 1) confidence += 0.1;

        // Factor 2: Recent reports (within last 24 hours)
        const recentReports = (osmData?.elements || [])
            .filter(r => {
                const reportTime = new Date(r.timestamp);
                const now = new Date();
                return (now - reportTime) <= 24 * 60 * 60 * 1000;
            });
        if (recentReports.length > 0) confidence += 0.2;

        return Number(confidence.toFixed(2));
    }

    _calculateBoundingBox(lat, lng, radius) {
        const R = 6371; // Earth's radius in km
        const dLat = (radius / R) * (180 / Math.PI);
        const dLng = (radius / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
        
        return [
            lng - dLng, // minLng
            lat - dLat, // minLat
            lng + dLng, // maxLng
            lat + dLat  // maxLat
        ].join(',');
    }
}

module.exports = CrowdsourceService; 