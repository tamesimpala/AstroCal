// api/beautyAstrologyService.js
// Astrological timing for beauty and hygiene routines

import { generateProjection } from './projectionService.js';

// Moon phase recommendations for beauty and hygiene
export const beautyMoonPhaseRecommendations = {
  'New Moon': {
    haircut: "Avoid cutting hair - growth will be slower than usual.",
    hairCare: "Deep conditioning treatments are effective now.",
    skinCare: "Begin new skincare routines. Good for detoxification.",
    nails: "Not ideal for nail treatments - they'll grow slowly.",
    general: "Focus on planning and setting beauty intentions."
  },
  'Waxing Crescent': {
    haircut: "Good time for trims that encourage faster growth.",
    hairCare: "Hair absorbs nutrients well - apply strengthening treatments.",
    skinCare: "Skin absorbs products effectively. Good for hydration masks.",
    nails: "Excellent time for nail treatments for faster growth.",
    general: "Buildup phase - nutrients are well absorbed."
  },
  'First Quarter': {
    haircut: "Excellent for haircuts when you want faster regrowth.",
    hairCare: "Hair is receptive to treatments aimed at growth and strength.",
    skinCare: "Good time for facial treatments and extractions.",
    nails: "Ideal for manicures and nail strengthening treatments.",
    general: "Energy supports transformative beauty treatments."
  },
  'Waxing Gibbous': {
    haircut: "Very good for cuts when wanting thicker regrowth.",
    hairCare: "Excellent for hair treatments that build volume and texture.",
    skinCare: "Beneficial for treatments targeting cell regeneration.",
    nails: "Good for strengthening treatments and growth serums.",
    general: "Finishing touches and refinements work well now."
  },
  'Full Moon': {
    haircut: "Best time for cutting hair if you want maximum growth.",
    hairCare: "Hair is at its strongest - perfect for color treatments.",
    skinCare: "Enhanced results from rejuvenating treatments.",
    nails: "Optimal time for nail care for strength and growth.",
    general: "Peak time for all beauty treatments and their effectiveness."
  },
  'Waning Gibbous': {
    haircut: "Good for cuts to reduce thickness or slow growth.",
    hairCare: "Focus on repair treatments and damage control.",
    skinCare: "Excellent for exfoliation and removing dead skin cells.",
    nails: "Good time for removing cuticles and maintenance.",
    general: "Begin eliminating what doesn't serve your beauty goals."
  },
  'Last Quarter': {
    haircut: "Ideal for cuts when wanting slower regrowth.",
    hairCare: "Focus on clarifying treatments to remove buildup.",
    skinCare: "Good for removing blemishes and detoxifying treatments.",
    nails: "Focus on cuticle care and removal of damaged areas.",
    general: "Release old routines and prepare for new ones."
  },
  'Waning Crescent': {
    haircut: "Best time to cut hair if you want it to grow more slowly.",
    hairCare: "Perfect for scalp treatments and cleansing.",
    skinCare: "Detoxifying masks and cleansing routines work best.",
    nails: "Focus on healing damaged nails rather than new treatments.",
    general: "Rest, cleanse, and prepare for the next cycle."
  }
};

// Zodiac sign influences on beauty treatments
export const beautyZodiacInfluences = {
  // Fire Signs - generally good for treatments that involve heat or stimulation
  Aries: {
    haircut: "Fast regrowth. Good for bold, short cuts and styles that require minimal maintenance.",
    hairCare: "Stimulating scalp treatments to promote growth.",
    skinCare: "Treatments that boost circulation and provide quick results.",
    nails: "Bold colors and designs. Quick-dry formulas are preferable.",
    general: "Favors bold transformations and quick treatments."
  },
  Leo: {
    haircut: "Excellent for glamorous styles and cuts that frame the face.",
    hairCare: "Luxurious conditioning and treatments that add shine.",
    skinCare: "Anti-aging and radiance-boosting treatments work well.",
    nails: "Statement manicures, gold accents, and artistic designs.",
    general: "Emphasize treatments that enhance your natural glow."
  },
  Sagittarius: {
    haircut: "Good for adventurous changes and styles with movement.",
    hairCare: "Treatments that add bounce and freedom to hair.",
    skinCare: "Revitalizing treatments that brighten the complexion.",
    nails: "Unique designs and colors that express individuality.",
    general: "Perfect for trying new products and experimental treatments."
  },
  
  // Earth Signs - good for nurturing, grounding treatments
  Taurus: {
    haircut: "Creates thicker-looking, more luxurious hair. Go for sensual styles.",
    hairCare: "Rich, nourishing treatments with natural ingredients.",
    skinCare: "Sensorial treatments with natural ingredients and pleasant scents.",
    nails: "Long-lasting formulas in elegant, earthy tones.",
    general: "Emphasize indulgent, sensory beauty experiences."
  },
  Virgo: {
    haircut: "Precision cuts with attention to detail. Good for practical styles.",
    hairCare: "Purifying treatments and products that improve hair health.",
    skinCare: "Meticulous routines with focus on purity and cleanliness.",
    nails: "Clean, precise manicures with attention to nail health.",
    general: "Focus on health-oriented treatments with proven results."
  },
  Capricorn: {
    haircut: "Classic, enduring styles that project authority. Good for strengthening cuts.",
    hairCare: "Long-term strengthening treatments that build over time.",
    skinCare: "Anti-aging and structural support for skin. Collagen treatments.",
    nails: "Classic, sophisticated manicures with staying power.",
    general: "Invest in quality treatments with long-term benefits."
  },
  
  // Air Signs - good for lightweight, aesthetic treatments
  Gemini: {
    haircut: "Versatile, layered cuts that can be styled multiple ways.",
    hairCare: "Light-weight treatments that don't weigh hair down.",
    skinCare: "Multi-tasking products and quick, effective routines.",
    nails: "Playful designs, multiple colors, or gradient effects.",
    general: "Try treatments that offer variety and flexibility."
  },
  Libra: {
    haircut: "Balanced, harmonious cuts that frame the face beautifully.",
    hairCare: "Treatments for symmetry and evenness in texture and color.",
    skinCare: "Balancing treatments that promote an even complexion.",
    nails: "Perfectly balanced French manicures or symmetrical designs.",
    general: "Emphasize treatments that create harmony and balance."
  },
  Aquarius: {
    haircut: "Innovative, unique styles ahead of trends.",
    hairCare: "Try cutting-edge treatments and innovative formulas.",
    skinCare: "High-tech treatments and unusual ingredients.",
    nails: "Avant-garde designs and unconventional colors.",
    general: "Perfect time for experimental treatments and procedures."
  },
  
  // Water Signs - good for deep conditioning, emotional renewal
  Cancer: {
    haircut: "Nurturing cuts that grow out gracefully. Good for soft, romantic styles.",
    hairCare: "Deeply nourishing treatments that support emotional well-being.",
    skinCare: "Gentle, nurturing treatments that protect skin's moisture barrier.",
    nails: "Pearlescent finishes and colors that evoke emotional comfort.",
    general: "Focus on self-care treatments that provide emotional comfort."
  },
  Scorpio: {
    haircut: "Transformative cuts for intense changes. Good for dramatic styles.",
    hairCare: "Deep treatments that transform hair from within.",
    skinCare: "Intensive treatments that promote renewal and regeneration.",
    nails: "Deep, rich colors and magnetic, mysterious finishes.",
    general: "Ideal for profound beauty transformations."
  },
  Pisces: {
    haircut: "Flowing, ethereal styles. Waves and movement are enhanced.",
    hairCare: "Treatments that enhance natural texture and movement.",
    skinCare: "Hydrating, replenishing treatments with soothing properties.",
    nails: "Iridescent finishes, water-inspired designs, and soft colors.",
    general: "Emphasize dreamy, artistic beauty experiences."
  }
};

// Specific body part zodiac rulerships
export const zodiacBodyRulerships = {
  Aries: {
    rules: "Head, face, brain",
    favorable: "Facial treatments, scalp care, headache remedies",
    avoid: "Treatments involving the head when Mars is retrograde"
  },
  Taurus: {
    rules: "Throat, neck, thyroid",
    favorable: "Neck treatments, voice care, thyroid support",
    avoid: "Throat treatments when Venus is retrograde"
  },
  Gemini: {
    rules: "Arms, hands, lungs, nervous system",
    favorable: "Hand treatments, manicures, arm exfoliation",
    avoid: "Hand surgeries when Mercury is retrograde"
  },
  Cancer: {
    rules: "Chest, breasts, stomach",
    favorable: "Chest treatments, stomach-soothing routines",
    avoid: "Breast procedures when the Moon is waning"
  },
  Leo: {
    rules: "Heart, spine, upper back",
    favorable: "Back treatments, circulation-enhancing routines",
    avoid: "Spine treatments when the Sun is afflicted"
  },
  Virgo: {
    rules: "Digestive system, intestines",
    favorable: "Detox routines, gut-health support",
    avoid: "Abdominal treatments when Mercury is retrograde"
  },
  Libra: {
    rules: "Kidneys, lower back, skin",
    favorable: "Skin treatments, lower back massages",
    avoid: "Kidney-related treatments when Venus is retrograde"
  },
  Scorpio: {
    rules: "Reproductive organs, excretory system",
    favorable: "Detoxification, elimination-supporting treatments",
    avoid: "Reproductive area treatments when Mars/Pluto are retrograde"
  },
  Sagittarius: {
    rules: "Hips, thighs, liver",
    favorable: "Thigh treatments, hip-area massages",
    avoid: "Hip-area treatments when Jupiter is retrograde"
  },
  Capricorn: {
    rules: "Bones, joints, knees, skin",
    favorable: "Joint care, knee treatments, structural skin support",
    avoid: "Knee treatments when Saturn is retrograde"
  },
  Aquarius: {
    rules: "Circulation, ankles, calves",
    favorable: "Circulation-enhancing treatments, ankle care",
    avoid: "Ankle treatments when Uranus is retrograde"
  },
  Pisces: {
    rules: "Feet, lymphatic system",
    favorable: "Foot treatments, reflexology, lymphatic drainage",
    avoid: "Foot treatments when Neptune is retrograde"
  }
};

// Hair cutting moon sign recommendations
export const hairCuttingZodiacGuide = {
  // Fruitful (fertile) signs - encourage growth and thickness
  fruitfulSigns: ["Cancer", "Scorpio", "Pisces", "Taurus", "Libra"],
  // Barren signs - discourage growth and reduce thickness
  barrenSigns: ["Aries", "Leo", "Sagittarius", "Gemini", "Aquarius"],
  // Semi-fruitful signs - moderate effect
  semiSigns: ["Virgo", "Capricorn"],
  
  recommendations: {
    // For faster growth
    fasterGrowth: "Cut hair when the moon is in Cancer, Scorpio, or Pisces (water signs) during the waxing or full moon.",
    // For slower growth
    slowerGrowth: "Cut hair when the moon is in Aries, Leo, or Sagittarius (fire signs) during the waning moon.",
    // For thicker hair
    thickerHair: "Cut when the moon is in Taurus, Leo, or Capricorn during the waxing moon.",
    // For wave and texture
    betterTexture: "Cut when the moon is in Cancer, Scorpio, or Pisces.",
    // For strength
    strength: "Cut when the moon is in Taurus, Leo, or Capricorn.",
    // For general health
    generalHealth: "Cut when the moon is in Taurus or Virgo."
  }
};

/**
 * Get beauty recommendations for a specific date using either provided data or projection
 * @param {Date} date - The date to get recommendations for
 * @param {Object} astroData - Optional astrological data for the date
 * @returns {Object|null} - Beauty recommendations or null if data unavailable
 */
export async function getBeautyRecommendations(date, astroData) {
  // If no specific astro data provided, we need to project it
  if (!astroData || !astroData.moonPhase) {
    try {
      // Calculate days between target date and today
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      // Generate a projection for the target date
      const projection = await generateProjection(null, diffDays);
      astroData = projection;
      
      if (!astroData || !astroData.moonPhase) {
        throw new Error("Could not generate astrological data for the date");
      }
    } catch (error) {
      console.error("Error generating beauty recommendations:", error);
      return null;
    }
  }
  
  // Extract moon phase, sign, etc. from the provided astroData
  const { moonPhase, planetaryPositions } = astroData;
  
  if (!moonPhase || !planetaryPositions) return null;
  
  // Get sun and moon signs
  const sunSign = planetaryPositions.sun?.sign || astroData.currentSign || "Pisces";
  const moonSign = moonPhase.sign || "Cancer";
  
  // Determine if the moon is waxing or waning
  const isWaxing = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous'].includes(moonPhase.phase);
  
  // Get relevant recommendations
  const phaseRecs = beautyMoonPhaseRecommendations[moonPhase.phase] || {};
  const sunSignRecs = beautyZodiacInfluences[sunSign] || {};
  const moonSignRecs = beautyZodiacInfluences[moonSign] || {};
  const bodyParts = zodiacBodyRulerships[moonSign] || {};
  
  // Check if moon is in fruitful or barren sign for hair cutting
  const hairGrowthCondition = hairCuttingZodiacGuide.fruitfulSigns.includes(moonSign) 
    ? (isWaxing ? "Very favorable for growth" : "Favorable for moderate growth")
    : hairCuttingZodiacGuide.barrenSigns.includes(moonSign)
    ? (isWaxing ? "Average growth" : "Minimal growth")
    : "Moderate growth";
  
  // Mercury retrograde check
  const mercuryRetrograde = planetaryPositions.mercury?.isRetrograde || false;
  
  // Venus retrograde check (affects beauty treatments)
  const venusRetrograde = planetaryPositions.venus?.isRetrograde || false;
  
  // Special notes based on retrograde planets
  let specialNotes = [];
  if (mercuryRetrograde) {
    specialNotes.push("Mercury is retrograde - double-check communication with your stylist.");
  }
  if (venusRetrograde) {
    specialNotes.push("Venus is retrograde - not ideal for major beauty changes. Focus on maintenance.");
  }
  
  // Compile beauty recommendations
  return {
    date,
    moonPhase: moonPhase.phase,
    moonSign,
    isWaxing,
    
    hairCare: {
      cutting: phaseRecs.haircut || "Neutral time for haircuts.",
      treatments: phaseRecs.hairCare || "Standard hair treatments are fine.",
      growthExpectation: hairGrowthCondition,
      additionalNotes: specialNotes.length > 0 ? specialNotes.join(" ") : null
    },
    
    skinCare: {
      recommended: phaseRecs.skinCare || "Regular skincare routine is appropriate.",
      facialAreas: bodyParts.rules || "No specific areas of focus.",
      bestTreatments: sunSignRecs.skinCare || "Standard treatments are fine."
    },
    
    nailCare: {
      manicure: phaseRecs.nails || "Standard manicure/pedicure is fine.",
      recommended: moonSignRecs.nails || "Choose colors that feel right to you."
    },
    
    bodyTreatments: {
      focusAreas: bodyParts.favorable || "No specific focus areas.",
      avoid: bodyParts.avoid || "No specific areas to avoid."
    },
    
    generalBeauty: phaseRecs.general || "Regular beauty routines are appropriate."
  };
}

/**
 * Get optimal dates for specific beauty treatments within a calendar range
 * @param {Array} calendar - Array of calendar day objects with astrological data
 * @param {string} treatmentType - Type of treatment ('haircut', 'coloring', 'facial', 'nails', 'detox')
 * @returns {Array} - Array of optimal dates sorted by favorability
 */
export function findOptimalBeautyDates(calendar, treatmentType) {
  if (!calendar || !calendar.length) return [];
  
  const optimalDates = [];
  
  // Define criteria for different treatment types
  const criteria = {
    haircut: {
      forGrowth: (day) => {
        const isGrowthPhase = ['Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon'].includes(day.moonPhase.phase);
        const isGrowthSign = ['Cancer', 'Scorpio', 'Pisces', 'Taurus', 'Libra'].includes(day.moonPhase.sign);
        return isGrowthPhase && isGrowthSign;
      },
      forSlowGrowth: (day) => {
        const isSlowPhase = ['Waning Gibbous', 'Last Quarter', 'Waning Crescent'].includes(day.moonPhase.phase);
        const isSlowSign = ['Aries', 'Leo', 'Sagittarius', 'Gemini', 'Aquarius'].includes(day.moonPhase.sign);
        return isSlowPhase && isSlowSign;
      }
    },
    coloring: {
      optimal: (day) => {
        return day.moonPhase.phase === 'Full Moon' || 
               ['Leo', 'Libra', 'Taurus'].includes(day.moonPhase.sign);
      }
    },
    facial: {
      optimal: (day) => {
        return ['Waxing Crescent', 'First Quarter'].includes(day.moonPhase.phase) ||
               ['Taurus', 'Libra', 'Cancer', 'Scorpio'].includes(day.moonPhase.sign);
      }
    },
    nails: {
      optimal: (day) => {
        return ['Full Moon', 'Waxing Gibbous'].includes(day.moonPhase.phase) ||
               ['Taurus', 'Libra', 'Gemini'].includes(day.moonPhase.sign);
      }
    },
    detox: {
      optimal: (day) => {
        return ['Waning Gibbous', 'Last Quarter', 'Waning Crescent'].includes(day.moonPhase.phase) ||
               ['Virgo', 'Scorpio'].includes(day.moonPhase.sign);
      }
    }
  };
  
  // Apply the appropriate criteria based on treatment type
  const criterion = criteria[treatmentType];
  if (!criterion) return [];
  
  // For haircuts, check if looking for growth or slow growth
  const isForGrowth = treatmentType === 'haircut' && treatmentType.includes('growth');
  const checkFunction = isForGrowth ? criterion.forGrowth : 
                        treatmentType === 'haircut' ? criterion.forSlowGrowth : 
                        criterion.optimal;
  
  // Find days that match the criteria
  calendar.forEach(day => {
    if (checkFunction(day)) {
      optimalDates.push({
        date: day.date,
        day: day.dayOfMonth,
        month: day.month,
        moonPhase: day.moonPhase.phase,
        moonSign: day.moonPhase.sign,
        rating: getRatingForBeautyTreatment(day, treatmentType)
      });
    }
  });
  
  // Sort by rating (highest first)
  return optimalDates.sort((a, b) => b.rating - a.rating);
}

/**
 * Get a numerical rating for how good a day is for a specific beauty treatment
 * @param {Object} day - Calendar day object with astrological data
 * @param {string} treatmentType - Type of treatment
 * @returns {number} - Rating from 0-100
 */
function getRatingForBeautyTreatment(day, treatmentType) {
  if (!day || !day.moonPhase) return 0;
  
  let rating = 50; // Start with a neutral rating
  
  // Adjust based on moon phase
  const phaseRatings = {
    haircut: {
      'New Moon': 40,
      'Waxing Crescent': 65,
      'First Quarter': 75,
      'Waxing Gibbous': 85,
      'Full Moon': 95,
      'Waning Gibbous': 70,
      'Last Quarter': 50,
      'Waning Crescent': 30
    },
    coloring: {
      'New Moon': 40,
      'Waxing Crescent': 60,
      'First Quarter': 70,
      'Waxing Gibbous': 80,
      'Full Moon': 95,
      'Waning Gibbous': 70,
      'Last Quarter': 50,
      'Waning Crescent': 30
    },
    facial: {
      'New Moon': 60,
      'Waxing Crescent': 80,
      'First Quarter': 70,
      'Waxing Gibbous': 60,
      'Full Moon': 50,
      'Waning Gibbous': 75,
      'Last Quarter': 85,
      'Waning Crescent': 90
    },
    nails: {
      'New Moon': 50,
      'Waxing Crescent': 70,
      'First Quarter': 80,
      'Waxing Gibbous': 90,
      'Full Moon': 95,
      'Waning Gibbous': 70,
      'Last Quarter': 60,
      'Waning Crescent': 50
    },
    detox: {
      'New Moon': 60,
      'Waxing Crescent': 50,
      'First Quarter': 40,
      'Waxing Gibbous': 30,
      'Full Moon': 50,
      'Waning Gibbous': 80,
      'Last Quarter': 90,
      'Waning Crescent': 95
    }
  };
  
  // Apply phase rating
  if (phaseRatings[treatmentType] && phaseRatings[treatmentType][day.moonPhase.phase]) {
    rating = phaseRatings[treatmentType][day.moonPhase.phase];
  }
  
  // Adjust based on moon sign
  if (treatmentType === 'haircut') {
    // For haircuts, check if the moon is in a fruitful or barren sign
    if (hairCuttingZodiacGuide.fruitfulSigns.includes(day.moonPhase.sign)) {
      rating += 20;
    } else if (hairCuttingZodiacGuide.barrenSigns.includes(day.moonPhase.sign)) {
      rating -= 20;
    }
  } else if (treatmentType === 'coloring') {
    // For coloring, certain signs are better
    if (['Leo', 'Libra', 'Taurus'].includes(day.moonPhase.sign)) {
      rating += 15;
    }
  } else if (treatmentType === 'facial') {
    // For facials, signs that rule the face are better
    if (['Aries', 'Taurus', 'Libra'].includes(day.moonPhase.sign)) {
      rating += 15;
    }
  } else if (treatmentType === 'nails') {
    // For nails, signs that rule the hands are better
    if (['Gemini', 'Virgo'].includes(day.moonPhase.sign)) {
      rating += 15;
    }
  } else if (treatmentType === 'detox') {
    // For detox, water signs and Virgo are better
    if (['Cancer', 'Scorpio', 'Pisces', 'Virgo'].includes(day.moonPhase.sign)) {
      rating += 15;
    }
  }
  
  // Check for retrograde planets that might affect the treatment
  if (day.keyEvents) {
    const hasMercuryRetrograde = day.keyEvents.some(event => 
      event.type === 'retrograde' && event.name.includes('Mercury'));
    
    const hasVenusRetrograde = day.keyEvents.some(event => 
      event.type === 'retrograde' && event.name.includes('Venus'));
      
    // Mercury retrograde affects communication - important for explaining what you want
    if (hasMercuryRetrograde) {
      rating -= 10;
    }
    
    // Venus retrograde affects beauty treatments more directly
    if (hasVenusRetrograde) {
      rating -= 20;
    }
  }
  
  // Ensure rating stays within bounds
  return Math.max(0, Math.min(100, Math.round(rating)));
}

/**
 * Get beauty-specific calendar events for a given calendar
 * @param {Array} calendar - Array of calendar day objects
 * @returns {Array} - Same calendar with beauty-specific events added
 */
export function addBeautyEventsToCalendar(calendar) {
  if (!calendar || !calendar.length) return calendar;
  
  // Create a copy of the calendar to add beauty events
  const updatedCalendar = calendar.map(day => {
    const beautyEvents = [];
    
    // Check for ideal haircut days
    if (day.moonPhase && 
        (day.moonPhase.phase === 'Full Moon' || day.moonPhase.phase === 'New Moon') &&
        hairCuttingZodiacGuide.fruitfulSigns.includes(day.moonPhase.sign)) {
      
      beautyEvents.push({
        type: 'beauty',
        name: 'Ideal Haircut Day',
        description: day.moonPhase.phase === 'Full Moon' 
          ? 'Perfect day for haircuts with maximum growth' 
          : 'Good day to set new hair intentions',
        icon: '✂️'
      });
    }
    
    // Check for ideal skincare days
    if (day.moonPhase && 
        (day.moonPhase.phase === 'Waxing Crescent' || day.moonPhase.phase === 'Waning Gibbous') &&
        ['Taurus', 'Libra', 'Scorpio'].includes(day.moonPhase.sign)) {
      
      beautyEvents.push({
        type: 'beauty',
        name: 'Optimal Skincare Day',
        description: day.moonPhase.phase === 'Waxing Crescent'
          ? 'Excellent for hydrating treatments'
          : 'Ideal for exfoliation and detox',
        icon: '💧'
      });
    }
    
    // Add beauty events to the day's events
    return {
      ...day,
      keyEvents: [...(day.keyEvents || []), ...beautyEvents]
    };
  });
  
  return updatedCalendar;
}