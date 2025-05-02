import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';

export const TutorFilter = ({ onFilter, subjects, learningGoals, days }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [minRating, setMinRating] = useState(null);
  const [sortBy, setSortBy] = useState('priceLowToHigh');

  const toggleFilter = () => setIsOpen(!isOpen);

  const handleReset = () => {
    setSearch('');
    setSelectedSubjects([]);
    setSelectedGoals([]);
    setPriceRange([0, 100]);
    setSelectedDays([]);
    setMinRating(null);
    setSortBy('priceLowToHigh');

    onFilter({
      search: '',
      subjects: [],
      priceRange: [0, 100],
      availability: [],
      rating: null,
      learningGoals: [],
      sortBy: 'priceLowToHigh',
    });
  };

  const toggleArrayValue = (stateSetter, list, value) => {
    stateSetter(
      list.includes(value) ? list.filter(v => v !== value) : [...list, value]
    );
  };

  const applyFilters = () => {
    onFilter({
      search,
      subjects: selectedSubjects,
      priceRange,
      availability: selectedDays,
      rating: minRating,
      learningGoals: selectedGoals,
      sortBy,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 mb-6">
      <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="p-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by name, subject or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleFilter}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            }
            className="focus:ring-teal-500"
          />
        </div>

        {/* Advanced Filter Section */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-secondary-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-secondary-900">Advanced Filters</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs h-auto py-1"
              >
                <X className="h-3 w-3 mr-1" />
                Reset all
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Subjects */}
              <div>
                <label className="block text-xs font-medium mb-2">Subjects</label>
                <div className="max-h-32 overflow-y-auto space-y-1 text-sm">
                  {subjects.map((subject) => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => toggleArrayValue(setSelectedSubjects, selectedSubjects, subject)}
                        className="mr-2"
                      />
                      {subject}
                    </label>
                  ))}
                </div>
              </div>

              {/* Learning Goals */}
              <div>
                <label className="block text-xs font-medium mb-2">Learning Goals</label>
                <div className="space-y-1 text-sm">
                  {learningGoals.map((goal) => (
                    <label key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedGoals.includes(goal)}
                        onChange={() => toggleArrayValue(setSelectedGoals, selectedGoals, goal)}
                        className="mr-2"
                      />
                      {goal}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium mb-2">Price Range (ETB/hour)</label>
                <div className="space-y-2 text-sm">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-secondary-600">
                    <span>Min: {priceRange[0]} ETB</span>
                    <span>Max: {priceRange[1]} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability, Rating, Sorting */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Availability */}
              <div>
                <label className="block text-xs font-medium mb-2">Available on</label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {days.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleArrayValue(setSelectedDays, selectedDays, day)}
                      className={`px-2 py-1 rounded-full ${
                        selectedDays.includes(day)
                          ? 'bg-primary-100 text-primary-700 border border-primary-300'
                          : 'bg-secondary-100 text-secondary-700 border border-secondary-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-medium mb-2">Minimum Rating</label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[null, 3, 3.5, 4, 4.5, 5].map((rating, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setMinRating(rating)}
                      className={`px-2 py-1 rounded-full ${
                        rating === minRating
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                          : 'bg-secondary-100 text-secondary-700 border border-secondary-200'
                      }`}
                    >
                      {rating === null ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-xs font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="ratingHighToLow">Rating: High to Low</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={toggleFilter}>Cancel</Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};