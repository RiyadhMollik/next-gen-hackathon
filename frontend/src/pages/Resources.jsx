import { useEffect, useState } from 'react';
import api from '../utils/api';
import ResourceCard from '../components/ResourceCard';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    platform: '',
    cost: '',
    level: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, resources]);

  const fetchResources = async () => {
    try {
      const response = await api.get('/resources');
      const resourcesData = response.data.resources || [];
      setResources(resourcesData);
      setFilteredResources(resourcesData);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(resources)) return;
    
    let filtered = [...resources];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(search) ||
        resource.platform.toLowerCase().includes(search) ||
        resource.description?.toLowerCase().includes(search)
      );
    }

    if (filters.platform) {
      filtered = filtered.filter(resource => resource.platform === filters.platform);
    }

    if (filters.cost) {
      filtered = filtered.filter(resource => resource.cost === filters.cost);
    }

    if (filters.level) {
      filtered = filtered.filter(resource => resource.level === filters.level);
    }

    setFilteredResources(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      platform: '',
      cost: '',
      level: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Resources</h1>

      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search resources..."
            className="input-field"
          />
          
          <select
            name="platform"
            value={filters.platform}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">All Platforms</option>
            <option value="Udemy">Udemy</option>
            <option value="Coursera">Coursera</option>
            <option value="YouTube">YouTube</option>
            <option value="edX">edX</option>
            <option value="Google">Google</option>
            <option value="AWS Training">AWS Training</option>
            <option value="Moz">Moz</option>
          </select>

          <select
            name="cost"
            value={filters.cost}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">All Costs</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>

          <select
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="mt-4 text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          Clear Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600 text-lg">No resources found matching your criteria</p>
          <button onClick={clearFilters} className="btn-primary mt-4">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Resources;
