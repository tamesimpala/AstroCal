// Astrology Investment API
// A RESTful API that provides investment guidance based on astrological events

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database mock (in a real app, you'd use a proper database)
const planetaryInfluences = {
  'mercury': {
    direct: {
      favorableActivities: ['communication-based investments', 'technology stocks', 'short-term trading'],
      cautions: ['long-term commitments', 'real estate investments'],
      description: 'Good for quick, analytical decisions and technology-based investments.'
    },
    retrograde: {
      favorableActivities: ['reviewing existing portfolios', 'researching', 'planning'],
      cautions: ['signing contracts', 'launching new investments', 'making major purchases'],
      description: 'Better for reassessment than new financial commitments.'
    }
  },
  'venus': {
    direct: {
      favorableActivities: ['luxury goods investments', 'art markets', 'beauty industry stocks'],
      cautions: ['high-risk ventures', 'industrial stocks'],
      description: 'Favorable for investments in beauty, art, luxury, and social enterprises.'
    },
    retrograde: {
      favorableActivities: ['reassessing value investments', 'reviewing partnerships'],
      cautions: ['new partnerships', 'major beauty or luxury purchases'],
      description: 'Time to reassess value rather than make new commitments in Venus-ruled areas.'
    }
  },
  'mars': {
    direct: {
      favorableActivities: ['energy sector investments', 'competitive markets', 'bold initiatives'],
      cautions: ['overly aggressive moves', 'impulsive decisions'],
      description: 'Good for assertive investment moves and energy-related markets.'
    },
    retrograde: {
      favorableActivities: ['reviewing action plans', 'reassessing energy investments'],
      cautions: ['launching new ventures', 'aggressive market moves'],
      description: 'Better to hold back and plan than to act impulsively.'
    }
  },
  'jupiter': {
    direct: {
      favorableActivities: ['expansion', 'international markets', 'educational investments', 'publishing'],
      cautions: ['overextension', 'excessive optimism'],
      description: 'Excellent for growth-oriented investments and expanding portfolios.'
    },
    retrograde: {
      favorableActivities: ['philosophical reassessment', 'reviewing growth strategies'],
      cautions: ['major expansions', 'foreign investments'],
      description: 'Time to review growth plans rather than initiate new ones.'
    }
  },
  'saturn': {
    direct: {
      favorableActivities: ['long-term investments', 'real estate', 'established industries', 'bonds'],
      cautions: ['speculative ventures', 'untested markets'],
      description: 'Favorable for conservative, long-term investment strategies.'
    },
    retrograde: {
      favorableActivities: ['restructuring', 'reassessing long-term plans'],
      cautions: ['committing to new long-term investments', 'career changes'],
      description: 'Time to reconsider structures and commitments rather than create new ones.'
    }
  },
  'uranus': {
    direct: {
      favorableActivities: ['technology innovation', 'disruptive markets', 'alternative investments'],
      cautions: ['traditional markets', 'stability-focused portfolios'],
      description: 'Good for innovative and unconventional investment approaches.'
    },
    retrograde: {
      favorableActivities: ['reassessing innovative approaches', 'reviewing tech investments'],
      cautions: ['radical changes', 'untested technology investments'],
      description: 'Time to review rather than revolutionize.'
    }
  },
  'neptune': {
    direct: {
      favorableActivities: ['creative industries', 'pharmaceuticals', 'spiritual markets'],
      cautions: ['unclear ventures', 'investments lacking transparency'],
      description: 'Can be good for intuitive investments but requires careful analysis.'
    },
    retrograde: {
      favorableActivities: ['clarifying vague investments', 'uncovering deceptions'],
      cautions: ['speculative ventures', 'unclear propositions'],
      description: 'Time to seek clarity in existing investments.'
    }
  },
  'pluto': {
    direct: {
      favorableActivities: ['transformative industries', 'renewable energy', 'recycling markets'],
      cautions: ['resistance to necessary change', 'holding onto outdated investments'],
      description: 'Good for transformative and regenerative investment areas.'
    },
    retrograde: {
      favorableActivities: ['internal reassessment', 'reviewing power dynamics in investments'],
      cautions: ['power struggles in business', 'hostile takeovers'],
      description: 'Time to review deep transformations rather than initiate them.'
    }
  }
};

const zodiacInfluences = {
  'aries': {
    favorableSectors: ['technology', 'sports', 'competitive industries', 'startups'],
    challengedSectors: ['slow-growth industries', 'conservative investments'],
    investment_style: 'Bold, pioneering, sometimes impulsive',
    best_timing: 'Quick entry and exit, first-mover advantage',
    description: 'Favors being first in new markets and taking calculated risks.'
  },
  'taurus': {
    favorableSectors: ['banking', 'real estate', 'agriculture', 'luxury goods'],
    challengedSectors: ['volatile markets', 'high-risk ventures'],
    investment_style: 'Patient, value-oriented, security-focused',
    best_timing: 'Long-term holds, buying during stability',
    description: 'Best for stable, tangible investments with steady returns.'
  },
  'gemini': {
    favorableSectors: ['media', 'communications', 'transportation', 'education'],
    challengedSectors: ['slow-moving industries', 'overly complex investments'],
    investment_style: 'Diverse, adaptable, information-driven',
    best_timing: 'Short to medium-term trades, following trends',
    description: 'Suited to diversification and information-rich markets.'
  },
  'cancer': {
    favorableSectors: ['real estate', 'food industry', 'home goods', 'family businesses'],
    challengedSectors: ['high-risk ventures', 'impersonal corporations'],
    investment_style: 'Security-focused, intuitive, protective',
    best_timing: 'Buying during dips, holding for security',
    description: 'Best for investments that provide emotional and financial security.'
  },
  'leo': {
    favorableSectors: ['entertainment', 'luxury goods', 'creative industries', 'gold'],
    challengedSectors: ['behind-the-scenes businesses', 'utilitarian sectors'],
    investment_style: 'Bold, leadership-focused, prestige-oriented',
    best_timing: 'Investing in growth phases, showcasing successes',
    description: 'Favors high-visibility investments with prestige value.'
  },
  'virgo': {
    favorableSectors: ['healthcare', 'pharmaceuticals', 'tech analysis', 'efficiency services'],
    challengedSectors: ['speculative ventures', 'untested concepts'],
    investment_style: 'Detail-oriented, analytical, improvement-focused',
    best_timing: 'Value investing based on detailed analysis',
    description: 'Best for well-researched investments with practical applications.'
  },
  'libra': {
    favorableSectors: ['luxury retail', 'beauty industry', 'law firms', 'partnerships'],
    challengedSectors: ['controversial industries', 'unbalanced operations'],
    investment_style: 'Balance-seeking, partnership-oriented, aesthetic',
    best_timing: 'Balanced entry and exit, relationship-based investing',
    description: 'Suited to balanced portfolios and partnership ventures.'
  },
  'scorpio': {
    favorableSectors: ['financial services', 'research', 'transformative technologies', 'insurance'],
    challengedSectors: ['transparent operations', 'surface-level businesses'],
    investment_style: 'Strategic, investigative, transformation-focused',
    best_timing: 'Contrarian investing, finding hidden value',
    description: 'Best for deep-value investments and transformative sectors.'
  },
  'sagittarius': {
    favorableSectors: ['international markets', 'travel', 'higher education', 'publishing'],
    challengedSectors: ['local-only businesses', 'restrictive ventures'],
    investment_style: 'Expansive, optimistic, growth-oriented',
    best_timing: 'Investing during expansionary phases',
    description: 'Suited to growth and international investment opportunities.'
  },
  'capricorn': {
    favorableSectors: ['established industries', 'government contracts', 'infrastructure', 'mining'],
    challengedSectors: ['untested startups', 'fad-based ventures'],
    investment_style: 'Conservative, disciplined, long-term',
    best_timing: 'Buying undervalued established assets',
    description: 'Best for traditional, reliable investment approaches with proven track records.'
  },
  'aquarius': {
    favorableSectors: ['technology innovation', 'social enterprises', 'alternative energy', 'networking'],
    challengedSectors: ['traditional industries', 'hierarchical businesses'],
    investment_style: 'Progressive, innovative, community-minded',
    best_timing: 'Early adoption of disruptive technologies',
    description: 'Suited to forward-thinking and socially conscious investments.'
  },
  'pisces': {
    favorableSectors: ['creative arts', 'pharmaceuticals', 'spiritual products', 'water-related industries'],
    challengedSectors: ['highly analytical sectors', 'rigid business models'],
    investment_style: 'Intuitive, compassionate, trend-sensitive',
    best_timing: 'Intuitive timing, following collective movements',
    description: 'Best for investments guided by intuition and collective trends.'
  }
};

const aspectInfluences = {
  'conjunction': {
    effect: 'intensifying',
    financial_impact: 'Concentrates energy in specific market sectors',
    description: 'Unifies the energies of two planets, creating focus in related investment areas.'
  },
  'sextile': {
    effect: 'harmonious opportunity',
    financial_impact: 'Creates favorable conditions for growth with some effort',
    description: 'Offers positive opportunities that require active engagement.'
  },
  'square': {
    effect: 'tension and challenge',
    financial_impact: 'Creates market tensions and potential volatility',
    description: 'Generates tension that can lead to necessary adjustments in portfolios.'
  },
  'trine': {
    effect: 'harmony and flow',
    financial_impact: 'Smooths market movements in relevant sectors',
    description: 'Provides easy flow and harmony in related investment areas.'
  },
  'opposition': {
    effect: 'polarization and awareness',
    financial_impact: 'Creates market polarization and potential for corrections',
    description: 'Brings awareness through contrast, highlighting imbalances in investment approaches.'
  },
  'quincunx': {
    effect: 'adjustment and redirection',
    financial_impact: 'Requires portfolio adjustments and flexibility',
    description: 'Necessitates adjustments and new approaches to investment strategy.'
  }
};

const marketSectors = {
  'technology': {
    ruling_planets: ['mercury', 'uranus'],
    favorable_signs: ['aquarius', 'gemini', 'aries'],
    description: 'Includes software, hardware, telecommunications, and IT services.'
  },
  'healthcare': {
    ruling_planets: ['neptune', 'mercury'],
    favorable_signs: ['virgo', 'pisces', 'capricorn'],
    description: 'Includes pharmaceuticals, medical devices, healthcare services, and biotechnology.'
  },
  'finance': {
    ruling_planets: ['jupiter', 'venus', 'pluto'],
    favorable_signs: ['taurus', 'scorpio', 'capricorn'],
    description: 'Includes banking, insurance, investment services, and fintech.'
  },
  'energy': {
    ruling_planets: ['mars', 'pluto', 'uranus'],
    favorable_signs: ['scorpio', 'aries', 'aquarius'],
    description: 'Includes oil & gas, renewable energy, utilities, and energy services.'
  },
  'consumer_goods': {
    ruling_planets: ['venus', 'moon'],
    favorable_signs: ['taurus', 'cancer', 'libra'],
    description: 'Includes retail, food & beverage, apparel, and personal products.'
  },
  'real_estate': {
    ruling_planets: ['saturn', 'venus', 'moon'],
    favorable_signs: ['taurus', 'cancer', 'capricorn'],
    description: 'Includes residential, commercial, REITs, and property management.'
  },
  'communications': {
    ruling_planets: ['mercury', 'moon'],
    favorable_signs: ['gemini', 'cancer', 'aquarius'],
    description: 'Includes media, telecommunications, advertising, and publishing.'
  },
  'industrials': {
    ruling_planets: ['mars', 'saturn'],
    favorable_signs: ['capricorn', 'aries', 'scorpio'],
    description: 'Includes manufacturing, aerospace, defense, and industrial equipment.'
  },
  'materials': {
    ruling_planets: ['saturn', 'venus'],
    favorable_signs: ['taurus', 'capricorn', 'virgo'],
    description: 'Includes chemicals, mining, metals, and forestry products.'
  },
  'transportation': {
    ruling_planets: ['mercury', 'jupiter'],
    favorable_signs: ['gemini', 'sagittarius', 'aquarius'],
    description: 'Includes airlines, shipping, rail, and logistics services.'
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Astrology Investment API',
    endpoints: [
      '/planetary-influences',
      '/zodiac-influences',
      '/aspect-influences',
      '/market-sectors',
      '/investment-forecast',
      '/personal-investment-guide',
      '/market-timing'
    ]
  });
});

// Get all planetary influences
app.get('/planetary-influences', (req, res) => {
  res.json(planetaryInfluences);
});

// Get specific planetary influence
app.get('/planetary-influences/:planet', (req, res) => {
  const planet = req.params.planet.toLowerCase();
  const motion = req.query.motion || 'direct';
  
  if (planetaryInfluences[planet]) {
    if (motion === 'direct' || motion === 'retrograde') {
      res.json({
        planet,
        motion,
        influence: planetaryInfluences[planet][motion]
      });
    } else {
      res.json(planetaryInfluences[planet]);
    }
  } else {
    res.status(404).json({ error: 'Planet not found' });
  }
});

// Get all zodiac influences
app.get('/zodiac-influences', (req, res) => {
  res.json(zodiacInfluences);
});

// Get specific zodiac influence
app.get('/zodiac-influences/:sign', (req, res) => {
  const sign = req.params.sign.toLowerCase();
  if (zodiacInfluences[sign]) {
    res.json(zodiacInfluences[sign]);
  } else {
    res.status(404).json({ error: 'Zodiac sign not found' });
  }
});

// Get all aspect influences
app.get('/aspect-influences', (req, res) => {
  res.json(aspectInfluences);
});

// Get specific aspect influence
app.get('/aspect-influences/:aspect', (req, res) => {
  const aspect = req.params.aspect.toLowerCase();
  if (aspectInfluences[aspect]) {
    res.json(aspectInfluences[aspect]);
  } else {
    res.status(404).json({ error: 'Aspect not found' });
  }
});

// Get all market sectors
app.get('/market-sectors', (req, res) => {
  res.json(marketSectors);
});

// Get specific market sector
app.get('/market-sectors/:sector', (req, res) => {
  const sector = req.params.sector.toLowerCase();
  if (marketSectors[sector]) {
    res.json(marketSectors[sector]);
  } else {
    res.status(404).json({ error: 'Market sector not found' });
  }
});

// Get investment forecast based on date
app.get('/investment-forecast', (req, res) => {
  const { date, longitude, latitude } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }
  
  // In a real implementation, we would:
  // 1. Calculate the positions of all planets for the given date
  // 2. Determine which aspects are active
  // 3. Analyze which zodiac signs are being emphasized
  // 4. Generate customized investment advice
  
  // Mock implementation for demonstration
  const mockDate = new Date(date);
  const day = mockDate.getDate();
  const month = mockDate.getMonth();
  
  // Simplified planetary positions (would use proper astronomical calculations in production)
  const mercuryRetrograde = (month % 4 === 3); // Every 4th month
  const venusSign = Object.keys(zodiacInfluences)[month % 12];
  const marsSign = Object.keys(zodiacInfluences)[(month + 2) % 12];
  const jupiterSign = Object.keys(zodiacInfluences)[(month + 4) % 12];
  const saturnSign = Object.keys(zodiacInfluences)[(month + 6) % 12];
  
  // Simplified active aspects
  const activeAspects = [];
  if (day % 7 === 0) activeAspects.push('conjunction');
  if (day % 7 === 1) activeAspects.push('sextile');
  if (day % 7 === 2) activeAspects.push('square');
  if (day % 7 === 3) activeAspects.push('trine');
  if (day % 7 === 4) activeAspects.push('opposition');
  if (day % 7 === 5) activeAspects.push('quincunx');
  
  // Determine favorable sectors based on planetary positions
  const favorableSectors = [];
  for (const sector in marketSectors) {
    const sectorInfo = marketSectors[sector];
    
    // Check if current planetary positions favor this sector
    const planetalAlignment = sectorInfo.ruling_planets.some(planet => 
      planetaryInfluences[planet].direct.favorableActivities.some(activity => 
        activity.includes(sector)
      )
    );
    
    const zodiacAlignment = sectorInfo.favorable_signs.some(sign => 
      sign === venusSign || sign === marsSign || sign === jupiterSign
    );
    
    if (planetalAlignment || zodiacAlignment) {
      favorableSectors.push(sector);
    }
  }
  
  // Create forecast
  const forecast = {
    date: date,
    general_market_condition: day % 3 === 0 ? 'bullish' : (day % 3 === 1 ? 'neutral' : 'cautious'),
    mercury_retrograde: mercuryRetrograde,
    key_planetary_positions: {
      venus: venusSign,
      mars: marsSign,
      jupiter: jupiterSign,
      saturn: saturnSign
    },
    active_aspects: activeAspects.map(aspect => ({
      aspect,
      influence: aspectInfluences[aspect]
    })),
    favorable_sectors: favorableSectors,
    cautions: mercuryRetrograde ? 
      ['Delay signing financial contracts', 'Double-check all transaction details', 'Prepare for communication delays'] : 
      ['Normal due diligence recommended'],
    investment_outlook: {
      short_term: day % 4 === 0 ? 'volatile' : (day % 4 === 1 ? 'trending upward' : (day % 4 === 2 ? 'trending downward' : 'stable')),
      medium_term: month % 3 === 0 ? 'positive' : (month % 3 === 1 ? 'neutral' : 'challenging'),
      long_term: (month + day) % 2 === 0 ? 'favorable' : 'requires caution'
    }
  };
  
  res.json(forecast);
});

// Get personalized investment guidance based on birth chart
app.get('/personal-investment-guide', (req, res) => {
  const { birth_date, birth_time, birth_place, investment_type } = req.query;
  
  if (!birth_date) {
    return res.status(400).json({ error: 'Birth date parameter is required' });
  }
  
  // In a real implementation, we would:
  // 1. Calculate the user's birth chart based on birth information
  // 2. Analyze the chart for investment tendencies
  // 3. Generate personalized investment recommendations
  
  // Mock implementation for demonstration
  const mockBirthDate = new Date(birth_date);
  const birthMonth = mockBirthDate.getMonth();
  const birthDay = mockBirthDate.getDate();
  
  // Simplified sun sign calculation
  const sunSignIndex = ((birthMonth * 30 + birthDay) / 30.5) % 12;
  const sunSign = Object.keys(zodiacInfluences)[Math.floor(sunSignIndex)];
  
  // Mock ascending sign
  const ascendantSign = Object.keys(zodiacInfluences)[(birthMonth + 1) % 12];
  
  // Mock moon sign
  const moonSign = Object.keys(zodiacInfluences)[(birthMonth + 2) % 12];
  
  // Generate personalized profile
  const profile = {
    birth_information: {
      date: birth_date,
      time: birth_time || 'unknown',
      place: birth_place || 'unknown'
    },
    key_chart_placements: {
      sun_sign: sunSign,
      moon_sign: moonSign,
      ascendant: ascendantSign,
      mercury: Object.keys(zodiacInfluences)[(birthMonth + 3) % 12],
      venus: Object.keys(zodiacInfluences)[(birthMonth + 4) % 12],
      mars: Object.keys(zodiacInfluences)[(birthMonth + 5) % 12],
      jupiter: Object.keys(zodiacInfluences)[(birthMonth + 6) % 12],
      saturn: Object.keys(zodiacInfluences)[(birthMonth + 7) % 12]
    },
    investment_profile: {
      natural_strengths: zodiacInfluences[sunSign].investment_style,
      risk_tolerance: ['aries', 'leo', 'sagittarius', 'aquarius'].includes(sunSign) ? 'high' : 
                      ['taurus', 'virgo', 'capricorn'].includes(sunSign) ? 'low' : 'moderate',
      decision_style: ['gemini', 'libra', 'aquarius'].includes(sunSign) ? 'analytical' :
                      ['cancer', 'scorpio', 'pisces'].includes(sunSign) ? 'intuitive' : 'balanced',
      time_horizon: ['taurus', 'cancer', 'capricorn'].includes(sunSign) ? 'long-term' :
                    ['aries', 'gemini', 'sagittarius'].includes(sunSign) ? 'short-term' : 'medium-term'
    },
    recommended_sectors: zodiacInfluences[sunSign].favorableSectors,
    sectors_to_approach_with_caution: zodiacInfluences[sunSign].challengedSectors,
    investment_timing: {
      favorable_periods: `When the Moon is in ${moonSign}, ${sunSign}, or ${ascendantSign}`,
      cautionary_periods: 'During Mercury retrograde and eclipses',
      best_planning_days: 'New Moon periods for initiating new investments'
    },
    custom_advice: investment_type ? 
      `For ${investment_type} investments, your ${sunSign} nature suggests ${zodiacInfluences[sunSign].best_timing}` : 
      'Provide investment_type for more specific guidance'
  };
  
  res.json(profile);
});

// Get market timing advice
app.get('/market-timing', (req, res) => {
  const { start_date, end_date, market_sector } = req.query;
  
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Both start_date and end_date parameters are required' });
  }
  
  // In a real implementation, we would:
  // 1. Calculate planetary positions and aspects for the date range
  // 2. Identify favorable and unfavorable periods for investment
  // 3. Generate specific timing recommendations
  
  // Mock implementation for demonstration
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const dayDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Generate favorable days
  const favorableDays = [];
  const cautionaryDays = [];
  
  for (let i = 0; i <= dayDiff; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Simple algorithm to determine if day is favorable
    if (i % 7 === 1 || i % 7 === 3 || i % 7 === 6) {
      favorableDays.push(currentDate.toISOString().split('T')[0]);
    } else if (i % 7 === 0 || i % 7 === 4) {
      cautionaryDays.push(currentDate.toISOString().split('T')[0]);
    }
  }
  
  // Generate mercury retrograde periods
  const retrograde = {
    start: new Date(startDate),
    end: new Date(startDate)
  };
  
  retrograde.start.setDate(startDate.getDate() + (10 - startDate.getDate() % 30));
  retrograde.end.setDate(retrograde.start.getDate() + 21);
  
  if (retrograde.end > endDate) {
    retrograde.end = endDate;
  }
  
  // Specific sector advice if requested
  let sectorSpecificAdvice = {};
  if (market_sector && marketSectors[market_sector]) {
    const sector = marketSectors[market_sector];
    sectorSpecificAdvice = {
      sector: market_sector,
      ruling_planets: sector.ruling_planets,
      favorable_signs: sector.favorable_signs,
      best_days: favorableDays.slice(0, Math.min(3, favorableDays.length)), // Top 3 favorable days
      description: `For ${market_sector}, pay special attention to the movements of ${sector.ruling_planets.join(', ')}`
    };
  }
  
  // Timing advice
  const timing = {
    date_range: {
      start: start_date,
      end: end_date
    },
    favorable_days: favorableDays,
    cautionary_days: cautionaryDays,
    mercury_retrograde: {
      is_during_period: retrograde.start < endDate && retrograde.end > startDate,
      period: {
        start: retrograde.start.toISOString().split('T')[0],
        end: retrograde.end.toISOString().split('T')[0]
      },
      advice: 'Review existing investments rather than making new commitments during this period'
    },
    lunar_phases: [
      {
        phase: 'new_moon',
        date: new Date(startDate.getFullYear(), startDate.getMonth(), 1 + (Math.floor(Math.random() * 7))).toISOString().split('T')[0],
        investment_advice: 'Good for setting new investment intentions and planning'
      },
      {
        phase: 'full_moon',
        date: new Date(startDate.getFullYear(), startDate.getMonth(), 15 + (Math.floor(Math.random() * 5))).toISOString().split('T')[0],
        investment_advice: 'Good for culmination and seeing results of previous investments'
      }
    ],
    best_timing_summary: 'The most favorable investment days typically occur during waxing moon periods when planets form harmonious aspects',
    sector_specific_advice: sectorSpecificAdvice
  };
  
  res.json(timing);
});

// Start server
app.listen(PORT, () => {
  console.log(`Astrology Investment API running on port ${PORT}`);
});

module.exports = app;