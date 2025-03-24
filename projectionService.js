// api/projectionService.js
// Functions to calculate and project astrological data into the future

import { 
  getCurrentMoonPhase, 
  getPlanetaryPositions,
  moonPhaseRecommendations,
  zodiacInfluences,
  planetaryGuidance
} from './astroService.js';

// Known moon phase durations (average)
const MOON_PHASE_DURATIONS = {
  'New Moon': 3.69, // days
  'Waxing Crescent': 4.09,
  'First Quarter': 3.89,
  'Waxing Gibbous': 3.89,
  'Full Moon': 3.69,
  'Waning Gibbous': 4.09,
  'Last Quarter': 3.89,
  'Waning Crescent': 3.89
};

// Average time the moon spends in each sign (days)
const MOON_SIGN_DURATION = 2.5; // approximately 2.5 days per sign

// Average time planets spend in each sign (days)
const PLANETARY_SIGN_DURATIONS = {
  'Sun': 30, // 30 days per sign (approximate)
  'Moon': 2.5, // 2.5 days per sign
  'Mercury': 17, // varies greatly due to retrograde
  'Venus': 30, // approximate
  'Mars': 57, // approximate
  'Jupiter': 365, // about 1 year per sign
  'Saturn': 912 // about 2.5 years per sign
};

// Zodiac signs in order
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Gets the next moon phase after the current one
 * @param {string} currentPhase - The current moon phase
 * @returns {string} - The next moon phase
 */
function getNextMoonPhase(currentPhase) {
  const phases = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent'
  ];
  
  const currentIndex = phases.indexOf(currentPhase);
  if (currentIndex === -1) return phases[0]; // Default to New Moon if not found
  
  const nextIndex = (currentIndex + 1) % phases.length;
  return phases[nextIndex];
}

/**
 * Gets the next zodiac sign after the current one
 * @param {string} currentSign - The current zodiac sign
 * @returns {string} - The next zodiac sign
 */
function getNextZodiacSign(currentSign) {
  const currentIndex = ZODIAC_SIGNS.indexOf(currentSign);
  if (currentIndex === -1) return ZODIAC_SIGNS[0]; // Default to Aries if not found
  
  const nextIndex = (currentIndex + 1) % ZODIAC_SIGNS.length;
  return ZODIAC_SIGNS[nextIndex];
}

/**
 * Projects the moon phase for a future date
 * @param {Object} currentMoonPhase - Current moon phase data
 * @param {number} daysAhead - Number of days to project ahead
 * @returns {Object} - Projected moon phase data
 */
function projectMoonPhase(currentMoonPhase, daysAhead) {
  if (!currentMoonPhase) return null;
  
  let projectedPhase = currentMoonPhase.phase;
  let projectedSign = currentMoonPhase.sign;
  let daysRemaining = daysAhead;
  
  // Calculate how many days remain in the current phase
  const daysInCurrentPhase = MOON_PHASE_DURATIONS[projectedPhase] || 3.7;
  let daysElapsedInCurrentPhase = daysInCurrentPhase * currentMoonPhase.illumination;
  let daysRemainingInCurrentPhase = daysInCurrentPhase - daysElapsedInCurrentPhase;
  
  // If we're projecting beyond the current phase, move to next phases
  if (daysRemaining > daysRemainingInCurrentPhase) {
    daysRemaining -= daysRemainingInCurrentPhase;
    
    // Move through phases until we reach the target date
    while (daysRemaining > 0) {
      projectedPhase = getNextMoonPhase(projectedPhase);
      const phaseDuration = MOON_PHASE_DURATIONS[projectedPhase] || 3.7;
      
      if (daysRemaining > phaseDuration) {
        daysRemaining -= phaseDuration;
      } else {
        break;
      }
    }
  }
  
  // Calculate how many days remain in the current sign
  const daysRemainingInCurrentSign = MOON_SIGN_DURATION - (daysElapsedInCurrentPhase % MOON_SIGN_DURATION);
  
  // If we're projecting beyond the current sign, move to next signs
  if (daysAhead > daysRemainingInCurrentSign) {
    let totalDays = daysAhead - daysRemainingInCurrentSign;
    const signChanges = Math.floor(totalDays / MOON_SIGN_DURATION);
    
    // Move through signs
    for (let i = 0; i < signChanges; i++) {
      projectedSign = getNextZodiacSign(projectedSign);
    }
  }
  
  // Calculate illumination based on the projected phase
  let illumination = 0;
  switch (projectedPhase) {
    case 'New Moon':
      illumination = 0.01;
      break;
    case 'Waxing Crescent':
      illumination = 0.25;
      break;
    case 'First Quarter':
      illumination = 0.5;
      break;
    case 'Waxing Gibbous':
      illumination = 0.75;
      break;
    case 'Full Moon':
      illumination = 0.99;
      break;
    case 'Waning Gibbous':
      illumination = 0.75;
      break;
    case 'Last Quarter':
      illumination = 0.5;
      break;
    case 'Waning Crescent':
      illumination = 0.25;
      break;
    default:
      illumination = 0.5;
  }
  
  // If we're within a phase, calculate more precise illumination
  if (daysRemaining > 0 && MOON_PHASE_DURATIONS[projectedPhase]) {
    // How far into the phase we are
    const phaseProgress = daysRemaining / MOON_PHASE_DURATIONS[projectedPhase];
    
    // Adjust illumination based on the phase
    if (['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous'].includes(projectedPhase)) {
      // Waxing phases - illumination increases
      illumination = Math.min(0.99, illumination * phaseProgress);
    } else {
      // Waning phases - illumination decreases
      illumination = Math.max(0.01, illumination * (1 - phaseProgress));
    }
  }
  
  // Get emoji for the projected phase
  let phaseEmoji = '🌑'; // Default to new moon
  switch (projectedPhase) {
    case 'New Moon':
      phaseEmoji = '🌑';
      break;
    case 'Waxing Crescent':
      phaseEmoji = '🌒';
      break;
    case 'First Quarter':
      phaseEmoji = '🌓';
      break;
    case 'Waxing Gibbous':
      phaseEmoji = '🌔';
      break;
    case 'Full Moon':
      phaseEmoji = '🌕';
      break;
    case 'Waning Gibbous':
      phaseEmoji = '🌖';
      break;
    case 'Last Quarter':
      phaseEmoji = '🌗';
      break;
    case 'Waning Crescent':
      phaseEmoji = '🌘';
      break;
  }
  
  return {
    phase: projectedPhase,
    sign: projectedSign,
    illumination: illumination,
    phaseEmoji: phaseEmoji,
    // Calculate the projected date
    date: new Date(Date.now() + (daysAhead * 24 * 60 * 60 * 1000))
  };
}

/**
 * Projects planetary positions for a future date
 * @param {Object} currentPositions - Current planetary positions
 * @param {number} daysAhead - Number of days to project ahead
 * @returns {Object} - Projected planetary positions
 */
function projectPlanetaryPositions(currentPositions, daysAhead) {
  if (!currentPositions) return null;
  
  const projectedPositions = {};
  
  // Project each planet's position
  Object.entries(currentPositions).forEach(([planet, data]) => {
    // Check if planet will change signs in the projected timeframe
    const signDuration = PLANETARY_SIGN_DURATIONS[planet.charAt(0).toUpperCase() + planet.slice(1)] || 30;
    
    // Estimate current position within the sign (0-30 degrees)
    const currentDegree = data.degree || 15; // Default to middle of sign if no degree data
    
    // Calculate how many days until this planet changes signs
    const daysToNextSign = (30 - currentDegree) * (signDuration / 30);
    
    // If we're projecting beyond the sign change, update the sign
    let projectedSign = data.sign;
    let isRetrograde = data.isRetrograde || false;
    
    if (daysAhead > daysToNextSign) {
      projectedSign = getNextZodiacSign(data.sign);
      
      // For Mercury, check if retrograde status might change
      if (planet === 'mercury') {
        // Mercury retrograde typically lasts 3 weeks, occurs 3-4 times a year
        // This is a simplified prediction
        if (daysAhead > 21 && isRetrograde) {
          isRetrograde = false;
        } else if (daysAhead > 90 && !isRetrograde) {
          // Possibility of entering a new retrograde period
          isRetrograde = Math.random() > 0.7; // 30% chance of being retrograde
        }
      }
    }
    
    // Calculate new degree within the sign
    const totalDegreesTraversed = (currentDegree + (daysAhead * (30 / signDuration))) % 30;
    
    projectedPositions[planet] = {
      sign: projectedSign,
      degree: totalDegreesTraversed,
      isRetrograde: isRetrograde
    };
  });
  
  return projectedPositions;
}

/**
 * Generates a projection for a specific date in the future
 * @param {Object} currentAstroData - Current astrological data
 * @param {number} daysAhead - Number of days to project ahead
 * @returns {Object} - Projected astrological data
 */
export async function generateProjection(currentAstroData, daysAhead) {
  // If no current data, try to fetch it
  if (!currentAstroData || !currentAstroData.moonPhase || !currentAstroData.planetaryPositions) {
    try {
      const moonPhase = await getCurrentMoonPhase();
      const planetaryPositions = await getPlanetaryPositions();
      
      currentAstroData = {
        moonPhase,
        planetaryPositions,
        currentSign: planetaryPositions?.sun?.sign || 'Pisces'
      };
    } catch (error) {
      console.error('Error fetching current astrological data:', error);
      return null;
    }
  }
  
  // Generate the projection
  const projectedMoonPhase = projectMoonPhase(currentAstroData.moonPhase, daysAhead);
  const projectedPlanetaryPositions = projectPlanetaryPositions(currentAstroData.planetaryPositions, daysAhead);
  
  // Determine the projected sun sign
  const projectedSunSign = projectedPlanetaryPositions?.sun?.sign || currentAstroData.currentSign;
  
  // Generate a simple horoscope projection based on the moon phase and sun sign
  const projectedHoroscope = generateProjectedHoroscope(projectedSunSign, projectedMoonPhase?.phase);
  
  // Return the projected data
  return {
    date: new Date(Date.now() + (daysAhead * 24 * 60 * 60 * 1000)),
    moonPhase: projectedMoonPhase,
    planetaryPositions: projectedPlanetaryPositions,
    currentSign: projectedSunSign,
    dailyHoroscope: projectedHoroscope
  };
}

/**
 * Generates a projected horoscope based on sun sign and moon phase
 * @param {string} sunSign - The projected sun sign
 * @param {string} moonPhase - The projected moon phase
 * @returns {Object} - A simple horoscope projection
 */
function generateProjectedHoroscope(sunSign, moonPhase) {
  // Base horoscope templates by sun sign
  const baseHoroscopes = {
    Aries: "Your natural leadership abilities will be highlighted. Focus on taking initiative.",
    Taurus: "Stability and resources are emphasized. Good time to build foundations.",
    Gemini: "Communication and social connections are favored. Express your ideas freely.",
    Cancer: "Emotional intuition is heightened. Trust your gut feelings about situations.",
    Leo: "Self-expression and creativity shine. Share your unique talents with others.",
    Virgo: "Analysis and problem-solving are enhanced. Pay attention to details.",
    Scorpio: "Transformation and deep insights are favored. Embrace personal evolution.",
    Sagittarius: "Expansion and exploration are highlighted. Seek new horizons.",
    Capricorn: "Structure and discipline lead to achievement. Focus on long-term goals.",
    Aquarius: "Innovation and community connections are emphasized. Think outside the box.",
    Pisces: "Intuition and spiritual awareness are heightened. Listen to your inner voice."
  };
  
  // Moon phase modifiers
  const moonPhaseModifiers = {
    'New Moon': "A perfect time for new beginnings and setting intentions.",
    'Waxing Crescent': "Building momentum is key. Take initial steps toward your goals.",
    'First Quarter': "Time to overcome obstacles. Make decisive choices.",
    'Waxing Gibbous': "Refine your approach. Pay attention to details before completion.",
    'Full Moon': "Culmination and clarity. Relationships and emotions are highlighted.",
    'Waning Gibbous': "Share knowledge and express gratitude. Reflect on recent developments.",
    'Last Quarter': "Release what no longer serves you. Reconsider your direction.",
    'Waning Crescent': "Rest, reflect, and prepare for the next cycle. Inner work is favored."
  };
  
  // Lucky colors based on sun sign
  const luckyColors = {
    Aries: ["Red", "Orange", "Gold"],
    Taurus: ["Green", "Pink", "Blue"],
    Gemini: ["Yellow", "Light Blue", "Orange"],
    Cancer: ["Silver", "White", "Sea Green"],
    Leo: ["Gold", "Orange", "Royal Purple"],
    Virgo: ["Green", "Brown", "Navy"],
    Libra: ["Pink", "Blue", "Lavender"],
    Scorpio: ["Deep Red", "Black", "Dark Purple"],
    Sagittarius: ["Purple", "Blue", "Turquoise"],
    Capricorn: ["Brown", "Dark Green", "Gray"],
    Aquarius: ["Electric Blue", "Turquoise", "Silver"],
    Pisces: ["Sea Green", "Lavender", "Purple"]
  };
  
  // Combine the base horoscope with the moon phase modifier
  const prediction = `${baseHoroscopes[sunSign] || "Your intuition will guide you in the right direction."} ${moonPhaseModifiers[moonPhase] || "Align yourself with the cosmic energies of the day."}`;
  
  // Generate a simple projected horoscope
  return {
    prediction,
    luckyColor: luckyColors[sunSign]?.[Math.floor(Math.random() * 3)] || "Blue",
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    mood: getMoodBasedOnSignAndPhase(sunSign, moonPhase),
    compatibility: getCompatibleSign(sunSign)
  };
}

/**
 * Determines a mood based on sun sign and moon phase
 * @param {string} sunSign - The sun sign
 * @param {string} moonPhase - The moon phase
 * @returns {string} - A mood description
 */
function getMoodBasedOnSignAndPhase(sunSign, moonPhase) {
  const signMoods = {
    Aries: ["Energetic", "Passionate", "Determined"],
    Taurus: ["Steady", "Content", "Grounded"],
    Gemini: ["Curious", "Social", "Expressive"],
    Cancer: ["Intuitive", "Nurturing", "Reflective"],
    Leo: ["Confident", "Creative", "Generous"],
    Virgo: ["Analytical", "Practical", "Helpful"],
    Libra: ["Harmonious", "Diplomatic", "Social"],
    Scorpio: ["Intense", "Focused", "Transformative"],
    Sagittarius: ["Adventurous", "Optimistic", "Philosophical"],
    Capricorn: ["Ambitious", "Disciplined", "Responsible"],
    Aquarius: ["Innovative", "Independent", "Humanitarian"],
    Pisces: ["Dreamy", "Compassionate", "Intuitive"]
  };
  
  const phaseMoods = {
    'New Moon': ["Introspective", "Hopeful", "Anticipating"],
    'Waxing Crescent': ["Motivated", "Determined", "Building"],
    'First Quarter': ["Challenged", "Resolute", "Active"],
    'Waxing Gibbous': ["Focused", "Perfecting", "Detailed"],
    'Full Moon': ["Emotional", "Expressive", "Illuminated"],
    'Waning Gibbous': ["Grateful", "Giving", "Sharing"],
    'Last Quarter': ["Reflective", "Releasing", "Evaluating"],
    'Waning Crescent': ["Resting", "Surrendering", "Preparing"]
  };
  
  // Get a random mood from either the sign or phase
  const useSignMood = Math.random() > 0.5;
  
  if (useSignMood) {
    return signMoods[sunSign]?.[Math.floor(Math.random() * 3)] || "Balanced";
  } else {
    return phaseMoods[moonPhase]?.[Math.floor(Math.random() * 3)] || "Contemplative";
  }
}

/**
 * Gets a compatible sign for the given sun sign
 * @param {string} sunSign - The sun sign
 * @returns {string} - A compatible zodiac sign
 */
function getCompatibleSign(sunSign) {
  const compatibilities = {
    Aries: ["Leo", "Sagittarius", "Gemini"],
    Taurus: ["Virgo", "Capricorn", "Cancer"],
    Gemini: ["Libra", "Aquarius", "Aries"],
    Cancer: ["Scorpio", "Pisces", "Taurus"],
    Leo: ["Aries", "Sagittarius", "Gemini"],
    Virgo: ["Taurus", "Capricorn", "Cancer"],
    Libra: ["Gemini", "Aquarius", "Leo"],
    Scorpio: ["Cancer", "Pisces", "Virgo"],
    Sagittarius: ["Aries", "Leo", "Aquarius"],
    Capricorn: ["Taurus", "Virgo", "Scorpio"],
    Aquarius: ["Gemini", "Libra", "Sagittarius"],
    Pisces: ["Cancer", "Scorpio", "Capricorn"]
  };
  
  // Return a random compatible sign
  return compatibilities[sunSign]?.[Math.floor(Math.random() * 3)] || "Libra";
}

/**
 * Generates projections for multiple days
 * @param {Object} currentAstroData - Current astrological data
 * @param {number[]} projectionDays - Array of days to project (e.g., [7, 14, 21, 28])
 * @returns {Object} - Object with projections for each requested day
 */
export async function generateMultipleDayProjections(currentAstroData, projectionDays = [7, 14, 21, 28]) {
  const projections = {};
  
  for (const days of projectionDays) {
    projections[days] = await generateProjection(currentAstroData, days);
  }
  
  return projections;
}

/**
 * Generates a calendar month with astrological events
 * @param {Object} currentAstroData - Current astrological data
 * @param {Date} startDate - The start date for the calendar (default: today)
 * @param {number} daysToProject - Number of days to include in the calendar (default: 28)
 * @returns {Object[]} - Array of day objects with astrological data
 */
export async function generateAstroCalendar(currentAstroData, startDate = new Date(), daysToProject = 28) {
  const calendar = [];
  
  // Clone the start date to avoid modifying the original
  const calendarStartDate = new Date(startDate);
  
  // Generate a projection for each day
  for (let i = 0; i < daysToProject; i++) {
    const date = new Date(calendarStartDate);
    date.setDate(date.getDate() + i);
    
    // Generate the astrological projection for this day
    const projection = await generateProjection(currentAstroData, i);
    
    // Create a calendar day object
    const calendarDay = {
      date,
      dayOfMonth: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
      isToday: i === 0,
      moonPhase: projection?.moonPhase,
      sunSign: projection?.currentSign,
      // Extract key planetary aspects and events
      keyEvents: extractKeyEvents(projection),
      // A brief one-line forecast
      forecast: generateBriefForecast(projection)
    };
    
    calendar.push(calendarDay);
  }
  
  return calendar;
}

/**
 * Extracts key astrological events from a projection
 * @param {Object} projection - A daily astrological projection
 * @returns {Object[]} - Array of key events for the day
 */
function extractKeyEvents(projection) {
  if (!projection) return [];
  
  const events = [];
  
  // Check for moon phase changes
  if (['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'].includes(projection.moonPhase?.phase)) {
    events.push({
      type: 'moonPhase',
      name: projection.moonPhase.phase,
      description: `${projection.moonPhase.phase} in ${projection.moonPhase.sign}`,
      icon: projection.moonPhase.phaseEmoji
    });
  }
  
  // Check for moon sign changes
  if (projection.moonPhase?.sign) {
    events.push({
      type: 'moonSign',
      name: `Moon enters ${projection.moonPhase.sign}`,
      description: `Moon moves into ${projection.moonPhase.sign}`,
      icon: '🌙'
    });
  }
  
  // Check for sun sign changes
  if (projection.planetaryPositions?.sun?.degree < 1) {
    events.push({
      type: 'sunSign',
      name: `Sun enters ${projection.planetaryPositions.sun.sign}`,
      description: `Sun moves into ${projection.planetaryPositions.sun.sign}`,
      icon: '☀️'
    });
  }
  
  // Check for Mercury retrograde
  if (projection.planetaryPositions?.mercury?.isRetrograde) {
    events.push({
      type: 'retrograde',
      name: 'Mercury Retrograde',
      description: 'Mercury is retrograde - communication and technology may be affected',
      icon: '☿'
    });
  }
  
  return events;
}

/**
 * Generates a brief forecast based on a projection
 * @param {Object} projection - A daily astrological projection
 * @returns {string} - A brief forecast
 */
function generateBriefForecast(projection) {
  if (!projection) return 'Data unavailable';
  
  // Brief forecast based on moon phase and sun sign
  const moonPhase = projection.moonPhase?.phase;
  const sunSign = projection.currentSign;
  
  // Sample forecasts for different combinations
  const forecasts = {
    'New Moon': {
      Aries: "Perfect for starting new projects with confidence.",
      Taurus: "Begin building foundations for material security.",
      Gemini: "Ideal for initiating new conversations and learning.",
      Cancer: "Start emotional healing and home improvements.",
      Leo: "Launch creative projects with renewed passion.",
      Virgo: "Begin practical routines with clear intentions.",
      Libra: "Start new relationships with balanced expectations.",
      Scorpio: "Powerful time for personal transformation begins.",
      Sagittarius: "Set intentions for expansion and exploration.",
      Capricorn: "Begin building structured paths to achievement.",
      Aquarius: "Innovate and plant seeds for community projects.",
      Pisces: "Start spiritual practices and creative endeavors."
    },
    'Full Moon': {
      Aries: "See results of your independent initiatives.",
      Taurus: "Harvest the rewards of your consistent efforts.",
      Gemini: "Communications reach culmination and clarity.",
      Cancer: "Emotional situations reach illuminating resolution.",
      Leo: "Creative and romantic situations reach a climax.",
      Virgo: "Work projects and health matters reach completion.",
      Libra: "Relationships reach important turning points.",
      Scorpio: "Deep transformations reveal their purpose.",
      Sagittarius: "Expansion efforts show meaningful results.",
      Capricorn: "Career initiatives reach important milestones.",
      Aquarius: "Innovative projects gain community recognition.",
      Pisces: "Spiritual insights bring profound understanding."
    }
  };
  
  // Add forecasts for other moon phases as needed
  const defaultForecasts = {
    Aries: "Channel your energy into purposeful action.",
    Taurus: "Build steadily toward your material goals.",
    Gemini: "Connect and communicate with versatility.",
    Cancer: "Nurture important emotional connections.",
    Leo: "Express your authentic creativity and leadership.",
    Virgo: "Organize and improve with practical precision.",
    Libra: "Create harmony and weigh important decisions.",
    Scorpio: "Transform through deep emotional insights.",
    Sagittarius: "Expand your horizons with optimism.",
    Capricorn: "Structure your path to long-term success.",
    Aquarius: "Innovate with humanitarian perspective.",
    Pisces: "Flow with intuition and creative inspiration."
  };
  
  // Return the appropriate forecast or a default
  return forecasts[moonPhase]?.[sunSign] || defaultForecasts[sunSign] || "Align with the day's cosmic energies.";
}

/**
 * Caching mechanism for projections to improve performance
 */
const projectionCache = new Map();

/**
 * Gets a projection with caching
 * @param {Object} currentAstroData - Current astrological data
 * @param {number} daysAhead - Number of days to project ahead
 * @returns {Object} - Projected astrological data
 */
export async function getCachedProjection(currentAstroData, daysAhead) {
  // Create a cache key based on the date and minimal astro data
  const cacheKey = `${daysAhead}-${currentAstroData?.moonPhase?.phase}-${currentAstroData?.currentSign}`;
  
  // Check if we have a cached projection
  if (projectionCache.has(cacheKey)) {
    return projectionCache.get(cacheKey);
  }
  
  // Generate a new projection
  const projection = await generateProjection(currentAstroData, daysAhead);
  
  // Cache the projection
  projectionCache.set(cacheKey, projection);
  
  // Limit cache size to prevent memory issues
  if (projectionCache.size > 100) {
    // Remove the oldest entry
    const firstKey = projectionCache.keys().next().value;
    projectionCache.delete(firstKey);
  }
  
  return projection;
}

/**
 * Clear the projection cache
 */
export function clearProjectionCache() {
  projectionCache.clear();
}