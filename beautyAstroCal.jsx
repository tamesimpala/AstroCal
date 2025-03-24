// components/BeautyAstrologyCalendar.jsx
// Beauty & Hygiene astrological timing component

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Scissors, Droplet, Sparkles, Moon, Star, 
  ChevronLeft, ChevronRight, Info, Palette
} from 'lucide-react';
import { 
  getBeautyRecommendations, 
  findOptimalBeautyDates, 
  addBeautyEventsToCalendar 
} from '../api/beautyAstrologyService';

/**
 * Component for beauty and hygiene astrological timing recommendations
 */
const BeautyAstrologyCalendar = ({ calendar, astroData, isLoading: parentLoading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [beautyRecommendations, setBeautyRecommendations] = useState(null);
  const [optimalDates, setOptimalDates] = useState({});
  const [selectedTreatment, setSelectedTreatment] = useState('haircut');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('today');
  const [beautyCalendar, setBeautyCalendar] = useState([]);

  // Treatment types
  const treatmentTypes = [
    { id: 'haircut', label: 'Haircuts', icon: Scissors },
    { id: 'coloring', label: 'Hair Coloring', icon: Palette },
    { id: 'facial', label: 'Facials', icon: Sparkles },
    { id: 'nails', label: 'Nail Care', icon: Star },
    { id: 'detox', label: 'Detox', icon: Moon }
  ];

  // Process calendar to add beauty events
  useEffect(() => {
    if (calendar && calendar.length > 0) {
      const processedCalendar = addBeautyEventsToCalendar(calendar);
      setBeautyCalendar(processedCalendar);
    }
  }, [calendar]);

  // Load beauty recommendations for today
  useEffect(() => {
    const loadRecommendations = async () => {
      if (parentLoading || !astroData?.moonPhase) return;

      setIsLoading(true);
      setError(null);
      
      try {
        // Get beauty recommendations for selected date
        const recommendations = await getBeautyRecommendations(selectedDate, astroData);
        setBeautyRecommendations(recommendations);
      } catch (err) {
        console.error('Error loading beauty recommendations:', err);
        setError('Failed to generate beauty recommendations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [selectedDate, astroData, parentLoading]);

  // Find optimal dates when treatment type changes
  useEffect(() => {
    if (beautyCalendar && beautyCalendar.length > 0) {
      try {
        const dates = findOptimalBeautyDates(beautyCalendar, selectedTreatment);
        setOptimalDates(prev => ({ ...prev, [selectedTreatment]: dates }));
      } catch (err) {
        console.error('Error finding optimal dates:', err);
      }
    }
  }, [beautyCalendar, selectedTreatment]);

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle date selection change
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the corresponding day in the calendar
      const selectedDay = calendar?.find(day => 
        new Date(day.date).toDateString() === new Date(date).toDateString()
      );
      
      if (selectedDay) {
        // Get beauty recommendations for the selected date
        const dayRecommendations = await getBeautyRecommendations(date, {
          moonPhase: selectedDay.moonPhase,
          planetaryPositions: { 
            sun: { sign: selectedDay.sunSign },
            mercury: { isRetrograde: selectedDay.keyEvents?.some(e => e.name?.includes('Mercury Retrograde')) },
            venus: { isRetrograde: selectedDay.keyEvents?.some(e => e.name?.includes('Venus Retrograde')) }
          }
        });
        
        setBeautyRecommendations(dayRecommendations);
      } else {
        // If no matching day in calendar, use the current astro data
        const dayRecommendations = await getBeautyRecommendations(date, astroData);
        setBeautyRecommendations(dayRecommendations);
      }
    } catch (err) {
      console.error('Error loading beauty recommendations for selected date:', err);
      setError('Could not generate recommendations for the selected date.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get the current dates to display
  const getCurrentOptimalDates = () => {
    if (optimalDates[selectedTreatment] && optimalDates[selectedTreatment].length > 0) {
      return optimalDates[selectedTreatment];
    }
    return [];
  };

  // Get a color based on rating
  const getRatingColor = (rating) => {
    if (rating >= 90) return 'bg-green-500';
    if (rating >= 75) return 'bg-green-400';
    if (rating >= 60) return 'bg-yellow-400';
    if (rating >= 45) return 'bg-yellow-300';
    return 'bg-gray-300';
  };

  // Get label based on rating
  const getRatingLabel = (rating) => {
    if (rating >= 90) return 'Excellent';
    if (rating >= 75) return 'Very Good';
    if (rating >= 60) return 'Good';
    if (rating >= 45) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b px-4 py-3">
        <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Beauty & Hygiene Timing
        </h2>
      </div>
      
      {/* Section Tabs */}
      <div className="flex border-b">
        <button 
          className={`px-4 py-2 font-medium ${activeSection === 'today' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
          onClick={() => setActiveSection('today')}
        >
          Today's Guide
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeSection === 'optimal' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
          onClick={() => setActiveSection('optimal')}
        >
          Optimal Dates
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeSection === 'calendar' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
          onClick={() => setActiveSection('calendar')}
        >
          Calendar View
        </button>
      </div>
      
      {/* Error message display */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border-b">
          <p>{error}</p>
        </div>
      )}
      
      {/* Today's Guide Section */}
      {activeSection === 'today' && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedDate.toDateString() === new Date().toDateString() 
                ? "Today's Beauty & Hygiene Guide" 
                : `Guide for ${formatDate(selectedDate)}`}
            </h3>
            
            {/* Date selector for non-today */}
            {selectedDate.toDateString() !== new Date().toDateString() && (
              <div className="flex items-center">
                <button 
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 1);
                    handleDateChange(newDate);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label="Previous day"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDateChange(new Date())}
                  className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded mx-1"
                >
                  Today
                </button>
                <button 
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 1);
                    handleDateChange(newDate);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label="Next day"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : beautyRecommendations ? (
            <div className="space-y-4">
              {/* Astrological Context */}
              <div className="bg-purple-50 rounded-lg p-3">
                <h4 className="font-semibold mb-2">Astrological Context</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Moon Phase:</span> {beautyRecommendations.moonPhase}
                  </div>
                  <div>
                    <span className="font-medium">Moon Sign:</span> {beautyRecommendations.moonSign}
                  </div>
                  <div>
                    <span className="font-medium">Growth Cycle:</span> {beautyRecommendations.isWaxing ? 'Waxing (Growing)' : 'Waning (Decreasing)'}
                  </div>
                </div>
              </div>
              
              {/* Hair Care Section */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-3 py-2 font-semibold flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Hair Care
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="font-medium">Haircuts:</p>
                      <p className="text-sm">{beautyRecommendations.hairCare.cutting}</p>
                    </div>
                    <div>
                      <p className="font-medium">Treatments:</p>
                      <p className="text-sm">{beautyRecommendations.hairCare.treatments}</p>
                    </div>
                    <div>
                      <p className="font-medium">Growth Expectation:</p>
                      <p className="text-sm">{beautyRecommendations.hairCare.growthExpectation}</p>
                    </div>
                    {beautyRecommendations.hairCare.additionalNotes && (
                      <div>
                        <p className="font-medium">Notes:</p>
                        <p className="text-sm">{beautyRecommendations.hairCare.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Skin Care Section */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-3 py-2 font-semibold flex items-center gap-2">
                  <Droplet className="h-4 w-4" />
                  Skin Care
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="font-medium">Recommended:</p>
                      <p className="text-sm">{beautyRecommendations.skinCare.recommended}</p>
                    </div>
                    <div>
                      <p className="font-medium">Focal Areas:</p>
                      <p className="text-sm">{beautyRecommendations.skinCare.facialAreas}</p>
                    </div>
                    <div>
                      <p className="font-medium">Best Treatments:</p>
                      <p className="text-sm">{beautyRecommendations.skinCare.bestTreatments}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nail Care & Body Treatment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-3 py-2 font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Nail Care
                  </div>
                  <div className="p-3">
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Manicure/Pedicure:</p>
                        <p className="text-sm">{beautyRecommendations.nailCare.manicure}</p>
                      </div>
                      <div>
                        <p className="font-medium">Recommended:</p>
                        <p className="text-sm">{beautyRecommendations.nailCare.recommended}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-3 py-2 font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Body Treatments
                  </div>
                  <div className="p-3">
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Focus Areas:</p>
                        <p className="text-sm">{beautyRecommendations.bodyTreatments.focusAreas}</p>
                      </div>
                      <div>
                        <p className="font-medium">Avoid:</p>
                        <p className="text-sm">{beautyRecommendations.bodyTreatments.avoid}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* General Beauty */}
              <div className="bg-purple-50 rounded-lg p-3">
                <h4 className="font-semibold mb-1">General Beauty Advice:</h4>
                <p>{beautyRecommendations.generalBeauty}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Unable to load beauty recommendations. Please try again.
            </div>
          )}
        </div>
      )}
      
      {/* Optimal Dates Section */}
      {activeSection === 'optimal' && (
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Find Optimal Dates</h3>
            <div className="flex flex-wrap gap-2">
              {treatmentTypes.map(treatment => (
                <button
                  key={treatment.id}
                  onClick={() => setSelectedTreatment(treatment.id)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                    selectedTreatment === treatment.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {React.createElement(treatment.icon, { className: "h-4 w-4" })}
                  <span>{treatment.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3">
              <h4 className="font-semibold">Best Dates for {treatmentTypes.find(t => t.id === selectedTreatment)?.label}</h4>
            </div>
            <div className="p-4">
              {getCurrentOptimalDates().length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {getCurrentOptimalDates().slice(0, 5).map((date, index) => (
                    <div key={index} className="flex items-center border-b last:border-0 pb-2 last:pb-0">
                      <div className="w-16 font-medium">
                        {new Date(date.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1 px-3">
                        <div className="text-sm">Moon in {date.moonSign} • {date.moonPhase}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div 
                            className={`h-2.5 rounded-full ${getRatingColor(date.rating)}`} 
                            style={{ width: `${date.rating}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-24 text-right text-sm font-medium">
                        {getRatingLabel(date.rating)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  No optimal dates found in the current time period.
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-1 flex items-center gap-1">
              <Info className="h-4 w-4" />
              How We Determine Optimal Dates
            </h4>
            <p className="text-sm">
              Optimal dates are calculated based on the moon's phase and zodiac sign position, 
              along with other planetary aspects. For {treatmentTypes.find(t => t.id === selectedTreatment)?.label.toLowerCase()}, 
              we look at factors specific to hair growth cycles, absorption rates, and traditional astrological timing.
            </p>
            {selectedTreatment === 'haircut' && (
              <div className="mt-2 text-sm">
                <p className="font-medium">For faster hair growth:</p>
                <p>{hairCuttingGuide.fasterGrowth}</p>
                <p className="font-medium mt-1">For slower hair growth:</p>
                <p>{hairCuttingGuide.slowerGrowth}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Calendar View Section */}
      {activeSection === 'calendar' && (
        <div className="p-4">
          {beautyCalendar.length > 0 ? (
            <div className="mb-4 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-3">Beauty Calendar</h3>
              <div className="grid grid-cols-7 gap-2 min-w-full">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="font-medium text-center text-sm py-1">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days - show first 4 weeks (28 days) */}
                {beautyCalendar.slice(0, 28).map((day, index) => {
                  // Find beauty-specific events
                  const beautyEvents = day.keyEvents?.filter(event => event.type === 'beauty') || [];
                  const hasBeautyEvent = beautyEvents.length > 0;
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleDateChange(day.date)}
                      className={`border rounded-lg p-2 cursor-pointer ${
                        selectedDate.toDateString() === day.date.toDateString() 
                          ? 'border-purple-500 bg-purple-50' 
                          : hasBeautyEvent ? 'border-pink-300 hover:bg-pink-50' : 'hover:bg-gray-50'
                      } ${day.isToday ? 'ring-2 ring-purple-300' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-semibold">{day.dayOfMonth}</div>
                        <div className="text-lg">{day.moonPhase?.phaseEmoji || "🌑"}</div>
                      </div>
                      
                      {/* Beauty Events */}
                      {hasBeautyEvent && (
                        <div className="mt-1 space-y-1">
                          {beautyEvents.map((event, i) => (
                            <div key={i} className="text-xs bg-pink-100 text-pink-800 rounded px-1 py-0.5 flex items-center">
                              <span className="mr-1">{event.icon}</span>
                              <span className="truncate">{event.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Moon sign */}
                      <div className="mt-1 text-xs text-gray-500 truncate">
                        {day.moonPhase?.sign}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="flex justify-center mb-4">
                <Calendar className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
              <p className="text-gray-500">
                Loading beauty calendar data...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Traditional hair cutting recommendations for reference in UI
const hairCuttingGuide = {
  fasterGrowth: "Cut hair when the moon is in Cancer, Scorpio, or Pisces (water signs) during the waxing or full moon.",
  slowerGrowth: "Cut hair when the moon is in Aries, Leo, or Sagittarius (fire signs) during the waning moon."
};

export default BeautyAstrologyCalendar;