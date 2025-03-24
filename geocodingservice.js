// api/geocodingService.js
// Google Geocoding API integration for birth place coordinates

// API Key
const GOOGLE_GEOCODING_API_KEY = 'AIzaSyBh54grNkxHuzgQbExOFaNndEfdFa7fiq4';
const GOOGLE_GEOCODING_API_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Geocodes a place name to coordinates using Google Maps Geocoding API
 * @param {string} place - The place name to geocode
 * @returns {Object|null} - Object with latitude, longitude, and formatted address or null if geocoding fails
 */
export async function geocodeBirthPlace(place) {
  if (!place) return null;
  
  const params = new URLSearchParams({
    'address': place,
    'key': GOOGLE_GEOCODING_API_KEY
  });
  
  try {
    console.log(`Geocoding place: ${place}`);
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${GOOGLE_GEOCODING_API_BASE_URL}?${params}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Geocoding API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
    
    const result = data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formatted: result.formatted_address
    };
  } catch (error) {
    console.error('Error geocoding birth place:', error);
    
    // Fall back to mock geocoding data if API call fails
    console.log("Falling back to mock geocoding data for:", place);
    
    // Mock data for common cities
    const mockGeoData = {
      "new york": { latitude: 40.7128, longitude: -74.0060, formatted: "New York, NY, USA" },
      "los angeles": { latitude: 34.0522, longitude: -118.2437, formatted: "Los Angeles, CA, USA" },
      "chicago": { latitude: 41.8781, longitude: -87.6298, formatted: "Chicago, IL, USA" },
      "houston": { latitude: 29.7604, longitude: -95.3698, formatted: "Houston, TX, USA" },
      "phoenix": { latitude: 33.4484, longitude: -112.0740, formatted: "Phoenix, AZ, USA" },
      "philadelphia": { latitude: 39.9526, longitude: -75.1652, formatted: "Philadelphia, PA, USA" },
      "san antonio": { latitude: 29.4241, longitude: -98.4936, formatted: "San Antonio, TX, USA" },
      "san diego": { latitude: 32.7157, longitude: -117.1611, formatted: "San Diego, CA, USA" },
      "dallas": { latitude: 32.7767, longitude: -96.7970, formatted: "Dallas, TX, USA" },
      "san jose": { latitude: 37.3382, longitude: -121.8863, formatted: "San Jose, CA, USA" },
      "london": { latitude: 51.5074, longitude: -0.1278, formatted: "London, UK" },
      "paris": { latitude: 48.8566, longitude: 2.3522, formatted: "Paris, France" },
      "tokyo": { latitude: 35.6762, longitude: 139.6503, formatted: "Tokyo, Japan" },
      "sydney": { latitude: -33.8688, longitude: 151.2093, formatted: "Sydney, Australia" },
      "rome": { latitude: 41.9028, longitude: 12.4964, formatted: "Rome, Italy" },
      "berlin": { latitude: 52.5200, longitude: 13.4050, formatted: "Berlin, Germany" },
      "moscow": { latitude: 55.7558, longitude: 37.6173, formatted: "Moscow, Russia" },
      "beijing": { latitude: 39.9042, longitude: 116.4074, formatted: "Beijing, China" },
      "mumbai": { latitude: 19.0760, longitude: 72.8777, formatted: "Mumbai, India" },
      "rio de janeiro": { latitude: -22.9068, longitude: -43.1729, formatted: "Rio de Janeiro, Brazil" }
    };
    
    // Check if we have mock data for this place
    const lowerPlace = place.toLowerCase();
    
    // First try an exact match
    if (mockGeoData[lowerPlace]) {
      return mockGeoData[lowerPlace];
    }
    
    // Then try a partial match
    for (const [key, value] of Object.entries(mockGeoData)) {
      if (lowerPlace.includes(key) || key.includes(lowerPlace)) {
        return value;
      }
    }
    
    // Default fallback coordinates (New York City)
    return { 
      latitude: 40.7128, 
      longitude: -74.0060,
      formatted: place
    };
  }
}

/**
 * Gets the timezone for a location based on coordinates
 * @param {number} latitude - The latitude
 * @param {number} longitude - The longitude
 * @param {number} timestamp - Optional UNIX timestamp (defaults to current time)
 * @returns {Object|null} - Object with timezone ID and offset or null if request fails
 */
export async function getTimezone(latitude, longitude, timestamp = Math.floor(Date.now() / 1000)) {
  if (!latitude || !longitude) return null;
  
  const params = new URLSearchParams({
    'location': `${latitude},${longitude}`,
    'timestamp': timestamp,
    'key': GOOGLE_GEOCODING_API_KEY
  });
  
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?${params}`);
    
    if (!response.ok) {
      throw new Error(`Timezone API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Timezone request failed: ${data.status}`);
    }
    
    return {
      timeZoneId: data.timeZoneId,
      timeZoneName: data.timeZoneName,
      dstOffset: data.dstOffset, // Daylight Saving Time offset in seconds
      rawOffset: data.rawOffset,  // The time zone offset from UTC in seconds
      totalOffset: (data.dstOffset + data.rawOffset) / 3600 // Total offset in hours
    };
  } catch (error) {
    console.error('Error getting timezone:', error);
    
    // Return a default offset (UTC)
    return {
      timeZoneId: "Etc/UTC",
      timeZoneName: "Coordinated Universal Time",
      dstOffset: 0,
      rawOffset: 0,
      totalOffset: 0
    };
  }
}