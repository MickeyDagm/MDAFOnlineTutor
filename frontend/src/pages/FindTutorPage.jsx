import React, { useState, useEffect, useRef } from 'react';
import { TutorCard } from '../components/tutors/TutorCard';
import { TutorFilter } from '../components/tutors/TutorFilter';
import { searchTutors, getFilterOptions } from '../api/api';

const FindTutorsPage = () => {
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTutors: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    subjects: [],
    learningGoals: [],
    priceRange: [0, 10000],
    availability: [],
    rating: 0,
    sortBy: 'rating',
  });
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    learningGoals: [],
    days: [],
  });

  const fetchFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      console.log('Filter options response:', JSON.stringify(response, null, 2));
      setFilterOptions({
        subjects: response.subjects || [],
        learningGoals: response.learningGoals || [],
        days: response.days || [],
      });
    } catch (err) {
      console.error('Error fetching filter options:', err.message);
    }
  };

  const fetchTutors = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page,
        limit: pagination.limit,
      };

      if (filters.search && filters.search.trim()) {
        queryParams.search = filters.search.trim();
        console.log('Search filter applied:', queryParams.search);
      }
      if (filters.learningGoals.length) {
        queryParams.learningGoals = filters.learningGoals.join(',');
        console.log('Learning goals filter applied:', queryParams.learningGoals);
      }
      if (filters.subjects.length) {
        queryParams.subjects = filters.subjects.join(',');
        console.log('Subjects filter applied:', queryParams.subjects);
      }
      if (filters.priceRange && (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000)) {
        queryParams.priceMin = filters.priceRange[0];
        queryParams.priceMax = filters.priceRange[1];
        console.log('Price filter applied:', queryParams.priceMin, queryParams.priceMax);
      }
      if (filters.availability.length) {
        queryParams.availability = filters.availability.join(',');
        console.log('Availability filter applied:', queryParams.availability);
      }
      if (filters.rating > 0) {
        queryParams.rating = filters.rating;
        console.log('Rating filter applied:', queryParams.rating);
      }
      if (filters.sortBy) {
        queryParams.sortBy = filters.sortBy;
        console.log('Sort by applied:', queryParams.sortBy);
      }

      console.log('Sending query params:', JSON.stringify(queryParams, null, 2));
      const response = await searchTutors(queryParams);
      console.log('API response:', JSON.stringify(response, null, 2));

      const tutors = response.data?.tutors || [];
      console.log('Tutors in response:', JSON.stringify(tutors, null, 2));

      if (!response.data || !Array.isArray(tutors)) {
        throw new Error('Invalid response structure: tutors array not found');
      }

      setFilteredTutors(tutors);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalTutors: response.data.totalTutors || 0,
        limit: response.data.limit || 10,
      });
    } catch (err) {
      console.error('Error fetching tutors:', err.message, err.stack);
      setError(err.message || 'Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Initial fetch triggered');
    fetchTutors(1);
    fetchFilterOptions();
  }, []);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    console.log('Filters changed:', JSON.stringify(filters, null, 2));
    fetchTutors(1);
  }, [filters]);

  const resetFilters = (activeFilter) => {
    const defaultFilters = {
      search: '',
      subjects: [],
      learningGoals: [],
      priceRange: [0, 10000],
      availability: [],
      rating: 0,
      sortBy: filters.sortBy, // Preserve sortBy
    };
    return { ...defaultFilters, ...activeFilter };
  };

  const handleFilter = (newFilters) => {
    console.log('New filters applied:', JSON.stringify(newFilters, null, 2));
    setFilters((prev) => {
      let updatedFilters = prev;
      // Reset other filters if search or subjects are applied
      if (newFilters.search && newFilters.search.trim()) {
        updatedFilters = resetFilters({ search: newFilters.search, sortBy: newFilters.sortBy || prev.sortBy });
      } else if (newFilters.subjects && newFilters.subjects.length) {
        updatedFilters = resetFilters({ subjects: newFilters.subjects, sortBy: newFilters.sortBy || prev.sortBy });
      } else if (newFilters.priceRange && (newFilters.priceRange[0] !== prev.priceRange[0] || newFilters.priceRange[1] !== prev.priceRange[1])) {
        updatedFilters = resetFilters({ priceRange: newFilters.priceRange, sortBy: newFilters.sortBy || prev.sortBy });
      } else {
        updatedFilters = { ...prev, ...newFilters };
      }
      console.log('Updated filters state:', JSON.stringify(updatedFilters, null, 2));
      return updatedFilters;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      console.log('Changing page to:', newPage);
      fetchTutors(newPage);
    }
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Tutor</h1>
          <p className="mt-2 text-lg text-gray-600">
            Search by subject, goal, availability, price, and more
          </p>
        </div>

        <TutorFilter
          onFilter={handleFilter}
          subjects={filterOptions.subjects}
          learningGoals={filterOptions.learningGoals}
          days={filterOptions.days}
          currentFilters={filters}
        />

        <div className="mt-8">
          {error && (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Error</h3>
              <p className="mt-2 text-gray-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-600">Loading tutors...</div>
          ) : filteredTutors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTutors.map((tutor) => {
                  console.log('Rendering tutor:', JSON.stringify(tutor, null, 2));
                  return <TutorCard key={tutor._id} tutor={tutor} />;
                })}
              </div>

 nocheckpoint              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages} (Total: {pagination.totalTutors} tutors)
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">No tutors found</h3>
              <p className="mt-2 text-gray-600">
                We couldn't find any tutors matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTutorsPage;