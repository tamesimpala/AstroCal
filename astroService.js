// api/astroService.js
// Core astrological API service with Free Astrology API integration

// API Keys
const ASTROLOGY_API_KEY = 'q4BSnYWM0o4SrbkP8Ew004xGL8Okv0Ub2kimtBuJ';
const BASE_URL = 'https://json.freeastrologyapi.com/v1';

// Mock data for fallbacks
const MOCK_DATA = {
  moonPhase: {
    phaseName: "Waxing Crescent",
    signName: "Leo",
    illumination: 35,
    phaseEmoji: "🌒",
    nextPhaseDt: "2025-03-07"
  },
  planetaryPositions: {
    planets: {
      Sun: { signName: "Pisces", position: 5.23, isRetrograde: false },
      Moon: { signName: "Leo", position: 12.48, isRetrograde: false },
      Mercury: { signName: "Aquarius", position: 28.4, isRetrograde: true },
      Venus: { signName: "Aries", position: 3.12, isRetrograde: false },
      Mars: { signName: "Capricorn", position: 19.87, isRetrograde: false },
      Jupiter: { signName: "Gemini", position: 8.32, isRetrograde: false },
      Saturn: { signName: "Pisces", position: 14.56, isRetrograde: false }
    }
  },
  dailyHoroscope: {
    prediction: "Today offers a chance for personal growth and connection. Focus on communication and don't be afraid to express your authentic self. An unexpected opportunity may arise in your professional sphere.",
    luckyColor: "Blue",
    luckyNumber: "7",
    mood: "Optimistic",
    compatibility: "Gemini"
  },
  birthChart: {
    ascendant: { signName: "Virgo", position: 15.42 },
    planets: {
      Sun: { signName: "Leo", position: 23.1, house: 12 },
      Moon: { signName: "Scorpio", position: 8.76, house: 3 },
      Mercury: { signName: "Leo", position: 18.24, house: 12, isRetrograde: false },
      Venus: { signName: "Libra", position: 2.56, house: 2, isRetrograde: false },
      Mars: { signName: "Aries", position: 15.78, house: 8, isRetrograde: false },
      Jupiter: { signName: "Taurus", position: 4.32, house: 9, isRetrograde: false },
      Saturn: { signName: "Aquarius", position: 27.89, house: 6, isRetrograde: true }
    },
    houses: {
      1: "Virgo",
      2: "Libra",
      3: "Scorpio",
      4: "Sagittarius",
      5: "Capricorn",
      6: "Aquarius",
      7: "Pisces",
      8: "Aries",
      9: "Taurus",
      10: "Gemini",
      11: "Cancer",
      12: "Leo"
    }
  },
  compatibility: {
    compatibility: 78,
    description: "Leo and Gemini create a dynamic and stimulating relationship. Both signs value communication, creativity, and social interaction. Leo brings warmth and confidence while Gemini contributes intellectual curiosity and adaptability. They enjoy a vibrant social life together and stimulate each other's minds."
  }
};

// Helper function to make API requests with fallback
async function makeApiRequest(endpoint, method = 'GET', body = null, mockData = null) {
  const headers = {
    'x-api-key': ASTROLOGY_API_KEY
  };
  
  // Add Content-Type header if there's a body
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  
  const options = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    console.log(`Requesting: ${BASE_URL}${endpoint}`);
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    options.signal = controller.signal;
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error with endpoint ${endpoint}:`, error);
    
    // Return mock data if available, otherwise null
    console.log(`Using mock data for ${endpoint}`);
    return mockData;
  }
}

/**
 * Gets the current moon phase and position
 */
export async function getCurrentMoonPhase() {
  const data = await makeApiRequest('/moonphase', 'GET', null, MOCK_DATA.moonPhase);
  
  if (!data) return null;
  
  // Transform the API response into our application format
  return {
    phase: data.phaseName, 
    sign: data.signName || 'Unknown',
    illumination: (data.illumination / 100) || 0, // Convert percentage to decimal
    phaseEmoji: data.phaseEmoji || '🌓',
    nextPhaseDate: data.nextPhaseDt || null
  };
}

/**
 * Gets the current planetary positions
 */
export async function getPlanetaryPositions() {
  const data = await makeApiRequest('/planets/positions', 'GET', null, MOCK_DATA.planetaryPositions);
  
  if (!data || !data.planets) return null;
  
  // Transform API response to our application format
  const positions = {};
  
  // Process each planet in the response
  Object.entries(data.planets).forEach(([key, planet]) => {
    positions[key.toLowerCase()] = {
      sign: planet.signName,
      degree: planet.position, 
      isRetrograde: planet.isRetrograde,
      longitude: planet.longitude || planet.position
    };
  });
  
  return positions;
}

/**
 * Gets daily horoscope for a specific sign
 */
export async function getDailyHoroscope(sign) {
  if (!sign) return null;
  
  const data = await makeApiRequest(`/horoscope/today/${sign.toLowerCase()}`, 'GET', null, MOCK_DATA.dailyHoroscope);
  
  return data;
}

/**
 * Gets compatibility between two signs
 */
export async function getCompatibility(sign1, sign2) {
  if (!sign1 || !sign2) return null;
  
  const data = await makeApiRequest(
    `/compatibility/${sign1.toLowerCase()}/${sign2.toLowerCase()}`, 
    'GET', 
    null, 
    MOCK_DATA.compatibility
  );
  
  return data;
}

/**
 * Calculates a birth chart using birth date, time, and place
 */
export async function calculateBirthChart(date, time, place) {
  if (!date || !time || !place) {
    return null;
  }
  
  // First geocode the place to get coordinates
  const location = await import('./geocodingService.js').then(module => 
    module.geocodeBirthPlace(place)
  );
  
  if (!location) {
    throw new Error('Could not geocode birth place');
  }
  
  // Prepare date and time in the format expected by the API
  // Split the date components (YYYY-MM-DD)
  const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
  
  // Split the time components (HH:MM)
  const [hour, minute] = time.split(':').map(num => parseInt(num, 10));
  
  const body = {
    day,
    month,
    year,
    hour,
    min: minute,
    lat: location.latitude,
    lon: location.longitude,
    tzone: 0 // UTC timezone - consider getting this from API or user
  };
  
  const data = await makeApiRequest('/horoscope', 'POST', body, MOCK_DATA.birthChart);
  
  if (!data) return null;
  
  // Transform API response to our application format
  return {
    sun: {
      sign: data.planets.Sun.signName,
      house: data.planets.Sun.house,
      degree: data.planets.Sun.position
    },
    moon: {
      sign: data.planets.Moon.signName,
      house: data.planets.Moon.house,
      degree: data.planets.Moon.position
    },
    ascendant: data.ascendant.signName,
    ascDegree: data.ascendant.position,
    planets: {
      mercury: {
        sign: data.planets.Mercury.signName,
        house: data.planets.Mercury.house,
        isRetrograde: data.planets.Mercury.isRetrograde
      },
      venus: {
        sign: data.planets.Venus.signName,
        house: data.planets.Venus.house,
        isRetrograde: data.planets.Venus.isRetrograde
      },
      mars: {
        sign: data.planets.Mars.signName,
        house: data.planets.Mars.house,
        isRetrograde: data.planets.Mars.isRetrograde
      },
      jupiter: {
        sign: data.planets.Jupiter.signName,
        house: data.planets.Jupiter.house,
        isRetrograde: data.planets.Jupiter.isRetrograde
      },
      saturn: {
        sign: data.planets.Saturn.signName,
        house: data.planets.Saturn.house,
        isRetrograde: data.planets.Saturn.isRetrograde
      }
    },
    houses: data.houses
  };
}

/**
 * Function to get combined recommendations based on astrological data
 */
export function getRecommendations(goalId, astroData) {
  if (!astroData || !astroData.moonPhase) {
    return null;
  }
  
  // Get moon phase recommendation
  let recommendations = {
    moonPhase: moonPhaseRecommendations[goalId]?.[astroData.moonPhase.phase] || 
      'No specific recommendation for this moon phase.',
      
    zodiac: zodiacInfluences[goalId]?.[astroData.currentSign] || 
      'No specific recommendation for this zodiac sign.',
      
    planets: []
  };
  
  // Add planetary recommendations if we have planetary data
  if (astroData.planetaryPositions) {
    // Convert planet keys to capitalize first letter for matching with our data
    Object.entries(astroData.planetaryPositions).forEach(([planet, data]) => {
      // Convert planet name to capitalize first letter (e.g., "sun" to "Sun")
      const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
      
      if (planetaryGuidance[goalId]?.[planetName]) {
        let retrogradeNote = '';
        if (data.isRetrograde) {
          retrogradeNote = ' (Retrograde: reflect and revise rather than initiate)';
        }
        
        recommendations.planets.push({
          planet: planetName,
          guidance: planetaryGuidance[goalId][planetName] + retrogradeNote,
          sign: data.sign
        });
      }
    });
  }
  
  return recommendations;
}

// Moon phase recommendations for each goal type
export const moonPhaseRecommendations = {
  fitness: {
    'New Moon': 'Start a new fitness routine with gentle movements. Focus on setting intentions.',
    'Waxing Crescent': 'Gradually increase workout intensity. Good time for strength training.',
    'First Quarter': 'Peak energy for challenging workouts and pushing limits.',
    'Full Moon': 'High energy for cardio and group activities.',
    'Waning Gibbous': 'Focus on flexibility and recovery. Ideal for yoga.',
    'Last Quarter': 'Moderate intensity workouts and form refinement.',
    'Waning Crescent': 'Rest and gentle movement only. Perfect for walking.'
  },
  career: {
    'New Moon': 'Ideal time to set new career goals and start projects.',
    'Waxing Crescent': 'Take action on new initiatives. Excellent for networking.',
    'First Quarter': 'Push through obstacles and make key decisions.',
    'Full Moon': 'Finish projects and negotiate deals.',
    'Waning Gibbous': 'Review and refine existing work.',
    'Last Quarter': 'Evaluate progress and adjust strategies.',
    'Waning Crescent': 'Plan and prepare for next cycle.'
  },
  relationships: {
    'New Moon': 'Set intentions for relationship growth. Good time for meeting new people.',
    'Waxing Crescent': 'Take first steps in relationship building. Reach out to others.',
    'First Quarter': 'Address challenges directly. Have important conversations.',
    'Full Moon': 'Celebrate connections. Good time for social gatherings.',
    'Waning Gibbous': 'Express gratitude. Reflect on relationship patterns.',
    'Last Quarter': 'Release unhealthy attachments. Set boundaries.',
    'Waning Crescent': 'Inner reflection. Focus on self-care before new cycle.'
  },
  personal: {
    'New Moon': 'Set intentions for personal development. Begin self-reflection practices.',
    'Waxing Crescent': 'Take first steps toward personal goals. Learn new skills.',
    'First Quarter': 'Overcome inner obstacles. Challenge limiting beliefs.',
    'Full Moon': 'Celebrate growth and insights. Practice self-awareness.',
    'Waning Gibbous': 'Integrate lessons learned. Share wisdom with others.',
    'Last Quarter': 'Release what no longer serves. Let go of old habits.',
    'Waning Crescent': 'Rest and restore. Prepare for new growth cycle.'
  },
  creativity: {
    'New Moon': 'Brainstorm new creative projects. Gather inspiration.',
    'Waxing Crescent': 'Begin sketching ideas and outlining projects.',
    'First Quarter': 'Overcome creative blocks. Make key artistic decisions.',
    'Full Moon': 'Showcase work. Share creations with others.',
    'Waning Gibbous': 'Edit and refine. Pay attention to details.',
    'Last Quarter': 'Evaluate creative process. Consider changes.',
    'Waning Crescent': 'Rest creative mind. Gather inspiration passively.'
  },
  gardening: {
    'New Moon': 'Plant seeds for crops that bear fruit above ground. Set garden intentions.',
    'Waxing Crescent': 'Fertilize and nurture new growth. Good for grafting.',
    'First Quarter': 'Prune for growth. Control pests and weeds.',
    'Full Moon': 'Harvest crops. Gather seeds and herbs.',
    'Waning Gibbous': 'Harvest root vegetables. Apply compost.',
    'Last Quarter': 'Turn soil and prepare beds. Good for weeding.',
    'Waning Crescent': 'Rest garden beds. Plan next planting cycle.'
  },
  beauty: {
    'New Moon': 'Set beauty intentions and plan treatments. Focus on inner beauty.',
    'Waxing Crescent': 'Begin new skincare routines. Good for facial treatments that promote growth.',
    'First Quarter': 'Hair treatments for growth. Manicures that strengthen nails.',
    'Waxing Gibbous': 'Hair coloring and treatments that require deep absorption.',
    'Full Moon': 'Perfect for haircuts when you want maximum growth and thickness.',
    'Waning Gibbous': 'Detoxifying treatments. Focus on drawing out impurities.',
    'Last Quarter': 'Hair removal for slower regrowth. Exfoliating treatments.',
    'Waning Crescent': 'Cleansing and release. Trim hair for slower growth.'
  }
};

// Zodiac influences for each goal
export const zodiacInfluences = {
  fitness: {
    Aries: "Mars energy boosts physical vitality. Excellent for high-intensity workouts.",
    Taurus: "Venus influence supports endurance and steady progress.",
    Gemini: "Mercury energy enhances coordination and quick movements.",
    Cancer: "Moon influence supports water-based activities and emotional balance.",
    Leo: "Solar energy supports strength training and cardio.",
    Virgo: "Mercury promotes detailed form and technique refinement.",
    Libra: "Venus supports balanced movement patterns and partner exercises.",
    Scorpio: "Pluto/Mars energy good for transformative practices like HIIT.",
    Sagittarius: "Jupiter energy excellent for expanding range of motion and outdoor activities.",
    Capricorn: "Saturn supports disciplined training and long-term goals.",
    Aquarius: "Uranus energy good for innovative exercise methods.",
    Pisces: "Neptune supports swimming, yoga, and mind-body practices."
  },
  career: {
    Aries: "Leadership opportunities and pioneering projects.",
    Taurus: "Financial planning and resource management.",
    Gemini: "Communication projects and information gathering.",
    Cancer: "Team building and nurturing company culture.",
    Leo: "Creative direction and public recognition.",
    Virgo: "Systems optimization and detail-oriented tasks.",
    Libra: "Negotiations, partnerships, and creating balance.",
    Scorpio: "Strategic planning and transformational initiatives.",
    Sagittarius: "Expanding horizons, education, and publishing.",
    Capricorn: "Long-term planning and establishing authority.",
    Aquarius: "Innovation, technology, and social impact.",
    Pisces: "Creative problem solving and empathetic leadership."
  },
  relationships: {
    Aries: "Initiate conversations and take relationship leads.",
    Taurus: "Build stability and sensual connection.",
    Gemini: "Improve communication and intellectual bonding.",
    Cancer: "Nurture emotional intimacy and family connections.",
    Leo: "Express affection generously and plan celebrations.",
    Virgo: "Address practical matters and show care through service.",
    Libra: "Focus on fairness, harmony, and partnership balance.",
    Scorpio: "Deepen intimacy and transform relationship patterns.",
    Sagittarius: "Expand horizons together and maintain independence.",
    Capricorn: "Build long-term foundations and demonstrate commitment.",
    Aquarius: "Honor individuality and forge friendship within romance.",
    Pisces: "Connect spiritually and practice compassion."
  },
  personal: {
    Aries: "Develop courage and self-assertion skills.",
    Taurus: "Build self-worth and align with personal values.",
    Gemini: "Expand knowledge and develop communication skills.",
    Cancer: "Nurture emotional intelligence and self-care practices.",
    Leo: "Cultivate authentic self-expression and creativity.",
    Virgo: "Refine personal habits and wellness routines.",
    Libra: "Develop decision-making skills and balanced relationships.",
    Scorpio: "Transform limiting patterns and explore deeper motivations.",
    Sagittarius: "Expand perspectives and philosophical understanding.",
    Capricorn: "Build self-discipline and long-term achievement.",
    Aquarius: "Cultivate originality and connection to community.",
    Pisces: "Develop intuition and spiritual connection."
  },
  creativity: {
    Aries: "Spontaneous creation and bold artistic choices.",
    Taurus: "Sensory-rich projects and natural materials.",
    Gemini: "Word-based projects and varied artistic experiments.",
    Cancer: "Emotionally expressive and nostalgic creations.",
    Leo: "Dramatic, playful, and performance-based projects.",
    Virgo: "Detailed crafts and technique refinement.",
    Libra: "Balanced compositions and aesthetically pleasing designs.",
    Scorpio: "Psychologically deep and transformative artwork.",
    Sagittarius: "Expansive, philosophical, and multicultural influences.",
    Capricorn: "Structured, timeless, and legacy-focused creations.",
    Aquarius: "Innovative, experimental, and community-oriented work.",
    Pisces: "Imaginative, dreamlike, and spiritually inspired art."
  },
  gardening: {
    Aries: "Plant fast-growing crops and use red or spiky plants.",
    Taurus: "Focus on root vegetables and fragrant flowers.",
    Gemini: "Plant vining vegetables and create varied garden spaces.",
    Cancer: "Tend to water features and moon gardens.",
    Leo: "Grow sunflowers and bright, bold blooms.",
    Virgo: "Focus on medicinal herbs and organized garden layouts.",
    Libra: "Create balanced landscapes and plant companions.",
    Scorpio: "Focus on perennials and regenerative gardening.",
    Sagittarius: "Expand garden space and exotic plant varieties.",
    Capricorn: "Build garden structures and focus on long-lived plants.",
    Aquarius: "Try unusual varieties and innovative growing methods.",
    Pisces: "Create water gardens and dreamy, flowing landscapes."
  },
  beauty: {
    Aries: "Treatments for the face and head area. Stimulating scalp massages.",
    Taurus: "Neck and throat treatments. Sensual beauty experiences.",
    Gemini: "Hand treatments and aromatherapy for mental clarity.",
    Cancer: "Nurturing, emotional treatments that promote self-care.",
    Leo: "Hair treatments that add shine and glamour. Spa days.",
    Virgo: "Purifying and detoxifying treatments. Natural products.",
    Libra: "Balancing facial treatments. Aesthetic enhancements.",
    Scorpio: "Transformative beauty treatments. Deep renewal.",
    Sagittarius: "Exotic beauty rituals. Treatments that feel freeing.",
    Capricorn: "Anti-aging treatments. Long-lasting beauty solutions.",
    Aquarius: "Innovative beauty technology. Unique approaches.",
    Pisces: "Dreamy spa experiences. Foot treatments and reflexology."
  }
};

// Planetary guidance for each goal
export const planetaryGuidance = {
  fitness: {
    Mars: "Increases energy and competitive drive",
    Venus: "Supports balanced movement and dance",
    Mercury: "Enhances coordination and quick movements",
    Jupiter: "Expands physical capabilities",
    Saturn: "Builds long-term strength and discipline",
    Sun: "Enhances vitality and core strength",
    Moon: "Influences emotional energy and fluid balance",
    Uranus: "Supports innovative exercise approaches",
    Neptune: "Enhances mind-body connection and flow states",
    Pluto: "Powers transformative physical challenges"
  },
  career: {
    Jupiter: "Expansion and opportunity phases",
    Saturn: "Structure and long-term planning",
    Mercury: "Communication and contract timing",
    Mars: "Action and initiative periods",
    Venus: "Relationship building and resources",
    Sun: "Leadership and visibility opportunities",
    Moon: "Team dynamics and emotional intelligence",
    Uranus: "Innovation and unexpected changes",
    Neptune: "Intuitive decision-making and visioning",
    Pluto: "Power dynamics and transformational business shifts"
  },
  relationships: {
    Venus: "Harmony, attraction, and values alignment",
    Mars: "Passion, assertiveness, and conflict navigation",
    Mercury: "Communication clarity and intellectual connection",
    Jupiter: "Relationship growth and optimism",
    Saturn: "Commitment and relationship structure",
    Sun: "Authentic expression and mutual recognition",
    Moon: "Emotional nurturing and security needs",
    Uranus: "Independence within togetherness and surprise elements",
    Neptune: "Compassion, spiritual connection, and boundary awareness",
    Pluto: "Deep bonding and relationship transformation"
  },
  personal: {
    Sun: "Core identity and authentic self-expression",
    Moon: "Emotional patterns and inner needs",
    Mercury: "Mental patterns and communication style",
    Venus: "Values, aesthetics, and relationship to pleasure",
    Mars: "Action style, energy use, and assertiveness",
    Jupiter: "Growth direction and belief expansion",
    Saturn: "Discipline development and responsibility areas",
    Uranus: "Unique qualities and freedom needs",
    Neptune: "Spiritual connection and dissolution of ego",
    Pluto: "Personal power and transformational processes"
  },
  creativity: {
    Sun: "Authentic creative expression and visibility",
    Moon: "Emotional content and intuitive creation",
    Mercury: "Conceptual development and artistic communication",
    Venus: "Aesthetic sensibility and harmonious creation",
    Mars: "Creative drive and bold artistic choices",
    Jupiter: "Creative expansion and optimistic themes",
    Saturn: "Technical mastery and enduring works",
    Uranus: "Innovative approaches and unexpected elements",
    Neptune: "Imagination, inspiration, and dissolution of boundaries",
    Pluto: "Transformative themes and powerful artistic impact"
  },
  gardening: {
    Sun: "Influences plant vitality and fruiting",
    Moon: "Affects water retention and germination timing",
    Mercury: "Influences flowering and pollination",
    Venus: "Enhances beauty and fragrance of plants",
    Mars: "Supports plant defense systems and vigor",
    Jupiter: "Promotes abundant growth and expansion",
    Saturn: "Supports structural growth and root development",
    Uranus: "Influences unusual growth patterns and adaptations",
    Neptune: "Enhances moisture absorption and fungal balance",
    Pluto: "Influences decomposition and soil regeneration"
  },
  beauty: {
    Sun: "Enhances radiance and glow. Good for treatments that boost confidence.",
    Moon: "Affects fluid retention and emotional well-being. Influences skincare absorption.",
    Mercury: "Influences coordination for detailed treatments. Good for precise techniques.",
    Venus: "Rules beauty and aesthetics. Perfect for enhancing appearance and pleasurable treatments.",
    Mars: "Energizes treatments that require stimulation. Good for circulation-enhancing methods.",
    Jupiter: "Expands and enhances treatments. Good for growth-promoting procedures.",
    Saturn: "Supports structure and discipline. Perfect for anti-aging and long-term beauty protocols.",
    Uranus: "Favors innovative and unusual beauty techniques.",
    Neptune: "Enhances dreamy, ethereal beauty. Good for subtle, artistic approaches.",
    Pluto: "Powers deep transformation. Good for intensive rejuvenation treatments."
  }
};