import React, { useState, useEffect } from 'react';
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
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    learningGoals: [],
    days: [],
  });

  const fetchFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions({
        subjects: response.subjects,
        learningGoals: response.learningGoals,
        days: response.days,
      });
    } catch (err) {
      console.error('Error fetching filter options:', err);
      setError(err || 'Failed to load filter options');
    }
  };

  const fetchTutors = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        search: filters.search || undefined,
        learningGoals: filters.learningGoals?.length > 0 ? filters.learningGoals.join(',') : undefined,
        subjects: filters.subjects?.length > 0 ? filters.subjects.join(',') : undefined,
        priceMin: filters.priceRange ? filters.priceRange[0] : undefined,
        priceMax: filters.priceRange ? filters.priceRange[1] : undefined,
        availability: filters.availability?.length > 0 ? filters.availability.join(',') : undefined,
        rating: filters.rating || undefined,
        sortBy: filters.sortBy || undefined,
        page,
        limit: pagination.limit,
      };

      console.log('Fetching tutors with queryParams:', queryParams);
      const response = await searchTutors(queryParams);
      console.log('API response:', response.data);
      setFilteredTutors(response.data.tutors);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalTutors: response.data.totalTutors,
        limit: response.data.limit,
      });
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setError(err.response?.data?.error || 'Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options and tutors on initial load
  useEffect(() => {
    fetchFilterOptions();
    fetchTutors(1);
  }, []);

  // Fetch tutors when filters change
  useEffect(() => {
    fetchTutors(1);
  }, [filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
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
                {filteredTutors.map(tutor => (
                  <TutorCard key={tutor._id} tutor={tutor} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-6 flex justify-center items-center space-x-4">
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