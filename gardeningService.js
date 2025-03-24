// Astrology Gardening API
// A RESTful API that provides gardening guidance based on astrological events

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database mock (in a real app, you'd use MongoDB, PostgreSQL, etc.)
const lunarPhases = {
  'new_moon': {
    activities: ['planning', 'soil preparation', 'composting'],
    avoid: ['planting', 'transplanting', 'pruning'],
    description: 'A time for planning and preparation, not active planting.'
  },
  'waxing_crescent': {
    activities: ['planting leafy greens', 'planting above-ground crops', 'fertilizing'],
    avoid: ['harvesting', 'root work'],
    description: 'Good time for planting crops that grow above ground.'
  },
  'first_quarter': {
    activities: ['planting fruiting plants', 'transplanting', 'grafting'],
    avoid: ['root pruning'],
    description: 'Balanced energy for growth and establishment.'
  },
  'waxing_gibbous': {
    activities: ['planting flowering plants', 'heavy feeding', 'irrigation'],
    avoid: ['pruning flowers'],
    description: 'Strong growing energy, good for plants that produce fruits and flowers.'
  },
  'full_moon': {
    activities: ['harvesting', 'pruning for growth', 'planting root crops'],
    avoid: ['planting above-ground crops'],
    description: 'Peak energy time, good for harvesting and medicinal herbs.'
  },
  'waning_gibbous': {
    activities: ['harvesting root crops', 'pruning', 'weeding'],
    avoid: ['planting new seedlings'],
    description: 'Good for maintenance tasks and root work.'
  },
  'last_quarter': {
    activities: ['root pruning', 'harvesting for storage', 'applying mulch'],
    avoid: ['transplanting', 'fertilizing'],
    description: 'Declining energy good for clearing and maintenance.'
  },
  'waning_crescent': {
    activities: ['soil preparation', 'weeding', 'rest'],
    avoid: ['most planting', 'pruning'],
    description: 'Time for rest and minimal garden activity.'
  }
};

const zodiacSigns = {
  'aries': {
    element: 'fire',
    plantTypes: ['fruiting vegetables', 'spicy herbs', 'plants with thorns'],
    bestFor: ['fast-growing crops', 'seed sprouting'],
    avoid: ['root vegetables', 'leafy greens'],
    description: 'Good for quick-growing plants and initiating new garden projects.'
  },
  'taurus': {
    element: 'earth',
    plantTypes: ['root vegetables', 'fruit trees', 'perennials'],
    bestFor: ['planting for longevity', 'establishing permanent gardens'],
    avoid: ['delicate annuals', 'quick harvest crops'],
    description: 'Excellent for establishing permanent plantings and root vegetables.'
  },
  'gemini': {
    element: 'air',
    plantTypes: ['climbing plants', 'flowering vines', 'herbs'],
    bestFor: ['pollination', 'grafting', 'trellising'],
    avoid: ['root crops', 'strongly scented plants'],
    description: 'Good for vine crops, flowering plants, and versatile garden tasks.'
  },
  'cancer': {
    element: 'water',
    plantTypes: ['leafy greens', 'water plants', 'flowering vegetables'],
    bestFor: ['irrigation', 'fertilizing', 'nurturing seedlings'],
    avoid: ['drought-tolerant plants', 'dry-soil herbs'],
    description: 'Excellent for water-loving plants and establishing nurturing conditions.'
  },
  'leo': {
    element: 'fire',
    plantTypes: ['sunflowers', 'bright flowers', 'fruits'],
    bestFor: ['heat-loving plants', 'ornamentals', 'sunlight exposure planning'],
    avoid: ['shade plants', 'cool-season crops'],
    description: 'Good for sun-loving ornamentals and plants that need strong light.'
  },
  'virgo': {
    element: 'earth',
    plantTypes: ['medicinal herbs', 'root vegetables', 'practical plants'],
    bestFor: ['detailed work', 'companion planting', 'garden organization'],
    avoid: ['invasive species', 'plants requiring minimal maintenance'],
    description: 'Perfect for detailed garden tasks and medicinal herb planting.'
  },
  'libra': {
    element: 'air',
    plantTypes: ['flowers', 'ornamentals', 'companion plants'],
    bestFor: ['aesthetic planning', 'balanced garden design', 'pollinator attractors'],
    avoid: ['aggressive species', 'singular crop planting'],
    description: 'Good for balanced gardens, companion planting, and garden aesthetics.'
  },
  'scorpio': {
    element: 'water',
    plantTypes: ['deep-rooted plants', 'regenerative plants', 'medicinal herbs'],
    bestFor: ['composting', 'pest control', 'soil regeneration'],
    avoid: ['shallow-rooted plants', 'fragile seedlings'],
    description: 'Excellent for deep soil work, composting, and plant transformation.'
  },
  'sagittarius': {
    element: 'fire',
    plantTypes: ['tall plants', 'exotic species', 'expressive flowers'],
    bestFor: ['garden expansion', 'experimental planting', 'new crops'],
    avoid: ['contained or limited growth plants', 'high-maintenance species'],
    description: 'Good for garden expansion and trying adventurous new plants.'
  },
  'capricorn': {
    element: 'earth',
    plantTypes: ['hardy perennials', 'structural plants', 'long-term food crops'],
    bestFor: ['infrastructure', 'building garden beds', 'long-term planning'],
    avoid: ['fragile annuals', 'spontaneous plantings'],
    description: 'Perfect for establishing garden infrastructure and long-term plants.'
  },
  'aquarius': {
    element: 'air',
    plantTypes: ['unusual varieties', 'air plants', 'pollinator-friendly flowers'],
    bestFor: ['innovative techniques', 'sustainable systems', 'companion planting'],
    avoid: ['traditional mono-crops', 'high-maintenance plants'],
    description: 'Good for innovative garden techniques and unusual plant varieties.'
  },
  'pisces': {
    element: 'water',
    plantTypes: ['water plants', 'moisture-loving herbs', 'fungal crops'],
    bestFor: ['irrigation planning', 'hydroponic systems', 'spiritual gardens'],
    avoid: ['drought-tolerant plants', 'cacti'],
    description: 'Excellent for water gardens, moisture-loving plants, and intuitive gardening.'
  }
};

const plants = {
  'tomato': {
    type: 'fruiting vegetable',
    bestPhase: 'waxing_gibbous',
    bestSigns: ['leo', 'cancer', 'taurus'],
    companionPlants: ['basil', 'marigold', 'onion'],
    avoidPlants: ['potato', 'corn', 'fennel'],
    growingTips: 'Plant deeply, water regularly at the base, provide support.'
  },
  'lettuce': {
    type: 'leafy green',
    bestPhase: 'waxing_crescent',
    bestSigns: ['cancer', 'pisces', 'taurus'],
    companionPlants: ['carrot', 'radish', 'cucumber'],
    avoidPlants: ['broccoli', 'sunflower'],
    growingTips: 'Plant in succession for continuous harvest, provide partial shade in summer.'
  },
  'carrot': {
    type: 'root vegetable',
    bestPhase: 'full_moon',
    bestSigns: ['taurus', 'virgo', 'capricorn'],
    companionPlants: ['onion', 'sage', 'pea'],
    avoidPlants: ['dill', 'parsnip'],
    growingTips: 'Loosen soil deeply, thin seedlings, keep soil consistently moist.'
  },
  'basil': {
    type: 'herb',
    bestPhase: 'waxing_crescent',
    bestSigns: ['leo', 'gemini', 'libra'],
    companionPlants: ['tomato', 'pepper', 'oregano'],
    avoidPlants: ['rue', 'sage'],
    growingTips: 'Pinch flowers to promote leaf growth, water at base to prevent disease.'
  },
  'rose': {
    type: 'flower',
    bestPhase: 'waxing_gibbous',
    bestSigns: ['libra', 'taurus', 'leo'],
    companionPlants: ['garlic', 'lavender', 'chives'],
    avoidPlants: ['grape', 'raspberry'],
    growingTips: 'Plant where they receive morning sun, prune in early spring, water at base.'
  }
  // More plants would be added in a complete implementation
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Astrology Gardening API',
    endpoints: [
      '/lunar-phases',
      '/zodiac-signs',
      '/plants',
      '/gardening-advice',
      '/plant-compatibility'
    ]
  });
});

// Get all lunar phases
app.get('/lunar-phases', (req, res) => {
  res.json(lunarPhases);
});

// Get specific lunar phase
app.get('/lunar-phases/:phase', (req, res) => {
  const phase = req.params.phase.toLowerCase();
  if (lunarPhases[phase]) {
    res.json(lunarPhases[phase]);
  } else {
    res.status(404).json({ error: 'Lunar phase not found' });
  }
});

// Get all zodiac signs
app.get('/zodiac-signs', (req, res) => {
  res.json(zodiacSigns);
});

// Get specific zodiac sign
app.get('/zodiac-signs/:sign', (req, res) => {
  const sign = req.params.sign.toLowerCase();
  if (zodiacSigns[sign]) {
    res.json(zodiacSigns[sign]);
  } else {
    res.status(404).json({ error: 'Zodiac sign not found' });
  }
});

// Get all plants
app.get('/plants', (req, res) => {
  res.json(plants);
});

// Get specific plant
app.get('/plants/:plant', (req, res) => {
  const plant = req.params.plant.toLowerCase();
  if (plants[plant]) {
    res.json(plants[plant]);
  } else {
    res.status(404).json({ error: 'Plant not found' });
  }
});

// Get gardening advice based on date
app.get('/gardening-advice', (req, res) => {
  const { date, latitude, longitude } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }
  
  // In a real implementation, we would:
  // 1. Calculate the current lunar phase for the given date
  // 2. Calculate the zodiac sign the moon is in
  // 3. Consider the season based on latitude/longitude
  // 4. Generate customized gardening advice
  
  // Mock implementation for demonstration
  const mockDate = new Date(date);
  const day = mockDate.getDate();
  
  // Simplified lunar phase calculation (would use proper astronomical calculations in production)
  const lunarPhaseIndex = Math.floor((day % 28) / 3.5);
  const phases = Object.keys(lunarPhases);
  const currentPhase = phases[lunarPhaseIndex];
  
  // Simplified zodiac calculation (would use proper astronomical calculations in production)
  const zodiacIndex = mockDate.getMonth();
  const signs = Object.keys(zodiacSigns);
  const currentSign = signs[zodiacIndex];
  
  const advice = {
    date: date,
    lunarPhase: currentPhase,
    lunarPhaseInfo: lunarPhases[currentPhase],
    zodiacSign: currentSign,
    zodiacSignInfo: zodiacSigns[currentSign],
    recommendedActivities: [
      ...lunarPhases[currentPhase].activities,
      ...zodiacSigns[currentSign].bestFor
    ],
    avoidActivities: [
      ...lunarPhases[currentPhase].avoid,
      ...zodiacSigns[currentSign].avoid
    ],
    recommendedPlants: Object.keys(plants).filter(plant => 
      plants[plant].bestPhase === currentPhase || 
      plants[plant].bestSigns.includes(currentSign)
    ),
    seasonalConsiderations: mockDate.getMonth() >= 2 && mockDate.getMonth() <= 8 ? 
      'Growing season in Northern Hemisphere' : 'Dormant season in Northern Hemisphere'
  };
  
  res.json(advice);
});

// Check plant compatibility
app.get('/plant-compatibility', (req, res) => {
  const { plant1, plant2 } = req.query;
  
  if (!plant1 || !plant2) {
    return res.status(400).json({ error: 'Both plant1 and plant2 parameters are required' });
  }
  
  if (!plants[plant1]) {
    return res.status(404).json({ error: `Plant "${plant1}" not found` });
  }
  
  if (!plants[plant2]) {
    return res.status(404).json({ error: `Plant "${plant2}" not found` });
  }
  
  const isCompanion1 = plants[plant1].companionPlants.includes(plant2);
  const isCompanion2 = plants[plant2].companionPlants.includes(plant1);
  const isAvoided1 = plants[plant1].avoidPlants.includes(plant2);
  const isAvoided2 = plants[plant2].avoidPlants.includes(plant1);
  
  let compatibility;
  let reason;
  
  if (isCompanion1 && isCompanion2) {
    compatibility = 'excellent';
    reason = 'Both plants benefit from being planted together';
  } else if (isCompanion1 || isCompanion2) {
    compatibility = 'good';
    reason = `${isCompanion1 ? plant1 : plant2} benefits from being planted with ${isCompanion1 ? plant2 : plant1}`;
  } else if (isAvoided1 || isAvoided2) {
    compatibility = 'poor';
    reason = `${isAvoided1 ? plant1 : plant2} should not be planted with ${isAvoided1 ? plant2 : plant1}`;
  } else {
    compatibility = 'neutral';
    reason = 'These plants neither benefit nor harm each other significantly';
  }
  
  res.json({
    plant1,
    plant2,
    compatibility,
    reason,
    plant1Info: plants[plant1],
    plant2Info: plants[plant2]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Astrology Gardening API running on port ${PORT}`);
});

module.exports = app;