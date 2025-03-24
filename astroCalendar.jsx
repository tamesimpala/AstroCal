// components/AstrologicalCalendar.jsx
// Calendar projection component showing future astrological conditions

import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Calendar as CalendarIcon, ChevronLeft, 
  ChevronRight, Orbit, Info 
} from 'lucide-react';
import { generateAstroCalendar } from '../api/projectionService';

const AstrologicalCalendar = ({ astroData, isLoading: parentLoading, calendar: providedCalendar }) => {
  const [calendar, setCalendar] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week', 'twoWeek', or 'month'
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // If calendar is provided by parent, use it, otherwise generate
  useEffect(() => {
    if (providedCalendar && providedCalendar.length > 0) {
      setCalendar(providedCalendar);
      setSelectedDay(providedCalendar[0]);
      setIsLoading(false);
    } else {
      // Only generate if parent isn't already loading
      if (!parentLoading && astroData?.moonPhase) {
        generateCalendarData();
      }
    }
  }, [providedCalendar, parentLoading, astroData]);

  // Generate calendar data when component mounts or when start date changes
  const generateCalendarData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await generateAstroCalendar(astroData, currentStartDate, 28);
      setCalendar(data);
      // Select today by default
      setSelectedDay(data[0]);
    } catch (err) {
      console.error('Error generating calendar:', err);
      setError('Failed to generate astrological calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to regenerate calendar when start date changes
  useEffect(() => {
    if (astroData?.moonPhase && !providedCalendar) {
      generateCalendarData();
    }
  }, [currentStartDate]);

  // Handle navigation between date ranges
  const navigateCalendar = (direction) => {
    const newStartDate = new Date(currentStartDate);
    
    if (direction === 'next') {
      // Move forward based on current view mode
      if (viewMode === 'week') {
        newStartDate.setDate(newStartDate.getDate() + 7);
      } else if (viewMode === 'twoWeek') {
        newStartDate.setDate(newStartDate.getDate() + 14);
      } else {
        newStartDate.setDate(newStartDate.getDate() + 28);
      }
    } else {
      // Move backward based on current view mode
      if (viewMode === 'week') {
        newStartDate.setDate(newStartDate.getDate() - 7);
      } else if (viewMode === 'twoWeek') {
        newStartDate.setDate(newStartDate.getDate() - 14);
      } else {
        newStartDate.setDate(newStartDate.getDate() - 28);
      }
    }
    
    setCurrentStartDate(newStartDate);
  };

  // Get the visible days based on the current view mode
  const getVisibleDays = () => {
    if (!calendar.length) return [];
    
    if (viewMode === 'week') {
      return calendar.slice(0, 7);
    } else if (viewMode === 'twoWeek') {
      return calendar.slice(0, 14);
    } else {
      return calendar.slice(0, 28);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  // Get day of week label
  const getDayOfWeek = (day) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  // Handle day selection
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b px-4 py-3 flex justify-between items-center">
        <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Astrological Calendar
        </h2>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden">
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm ${viewMode === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setViewMode('twoWeek')}
              className={`px-3 py-1 text-sm ${viewMode === 'twoWeek' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              14 Days
            </button>
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm ${viewMode === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              28 Days
            </button>
          </div>
          
          <button 
            onClick={() => navigateCalendar('prev')}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => navigateCalendar('next')}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="p-4">
          {/* Calendar Grid */}
          <div className="mb-6 overflow-x-auto">
            <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7 md:grid-rows-' + (viewMode === 'twoWeek' ? '2' : '4')} gap-2 min-w-full`}>
              {getVisibleDays().map((day, index) => (
                <div 
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                    selectedDay?.date?.toDateString() === day.date?.toDateString() 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'hover:bg-gray-50'
                  } ${day.isToday ? 'ring-2 ring-purple-300' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-gray-500">{getDayOfWeek(day.dayOfWeek)}</div>
                      <div className="font-bold">{day.dayOfMonth}</div>
                    </div>
                    <div className="text-xl" title={day.moonPhase?.phase || ""}>
                      {day.moonPhase?.phaseEmoji || <Moon className="h-5 w-5" />}
                    </div>
                  </div>
                  
                  {/* Key Events */}
                  {day.keyEvents && day.keyEvents.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {day.keyEvents.map((event, i) => (
                        <div key={i} className="text-xs bg-purple-100 text-purple-800 rounded px-1 py-0.5 flex items-center">
                          <span className="mr-1">{event.icon}</span>
                          <span className="truncate">{event.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Brief Forecast Preview */}
                  <div className="mt-1 text-xs text-gray-600 truncate">
                    {day.forecast?.substring(0, 20) || ""}...
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Day Details */}
          {selectedDay && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">
                  {formatDate(selectedDay.date)}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Sun className="h-5 w-5 text-orange-500" />
                    <span>{selectedDay.sunSign}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Moon className="h-5 w-5 text-blue-500" />
                    <span>{selectedDay.moonPhase?.phase} {selectedDay.moonPhase?.phaseEmoji}</span>
                  </div>
                </div>
              </div>
              
              {/* Forecast */}
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Daily Forecast</h4>
                <p>{selectedDay.forecast}</p>
              </div>
              
              {/* Moon Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold mb-1 flex items-center gap-1">
                    <Moon className="h-4 w-4" />
                    Moon Phase Details
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>Phase:</div>
                    <div className="font-medium">{selectedDay.moonPhase?.phase} {selectedDay.moonPhase?.phaseEmoji}</div>
                    <div>Sign:</div>
                    <div className="font-medium">{selectedDay.moonPhase?.sign}</div>
                    <div>Illumination:</div>
                    <div className="font-medium">{Math.round((selectedDay.moonPhase?.illumination || 0) * 100)}%</div>
                  </div>
                </div>
                
                {/* Key Events */}
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-semibold mb-1 flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Astrological Events
                  </h4>
                  {selectedDay.keyEvents && selectedDay.keyEvents.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {selectedDay.keyEvents.map((event, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="mt-0.5">{event.icon}</span>
                          <span>{event.description}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No major astrological events today.</p>
                  )}
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-semibold mb-1 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Astrological Guidance for Today
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-1">
                    <span className="font-medium">Energy Level:</span> 
                    <span>{['New Moon', 'Waxing Crescent'].includes(selectedDay.moonPhase?.phase) 
                      ? "Building - good for starting new projects" 
                      : ['First Quarter', 'Waxing Gibbous', 'Full Moon'].includes(selectedDay.moonPhase?.phase)
                      ? "High - excellent for productive action and completion"
                      : "Decreasing - focus on reflection and planning"}</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="font-medium">Decision Making:</span> 
                    <span>{['Full Moon', 'Waning Gibbous'].includes(selectedDay.moonPhase?.phase)
                      ? "Clarity and insight are enhanced"
                      : ['New Moon', 'Waning Crescent'].includes(selectedDay.moonPhase?.phase)
                      ? "Intuition is stronger than logic today"
                      : "Balance logic and intuition for best results"}</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="font-medium">Focus on:</span> 
                    <span>{selectedDay.sunSign === 'Aries' || selectedDay.sunSign === 'Leo' || selectedDay.sunSign === 'Sagittarius'
                      ? "Action, creativity, and self-expression" 
                      : selectedDay.sunSign === 'Taurus' || selectedDay.sunSign === 'Virgo' || selectedDay.sunSign === 'Capricorn'
                      ? "Practical matters, organization, and resources"
                      : selectedDay.sunSign === 'Gemini' || selectedDay.sunSign === 'Libra' || selectedDay.sunSign === 'Aquarius'
                      ? "Communication, social connections, and ideas"
                      : "Emotional matters, intuition, and self-care"}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AstrologicalCalendar;