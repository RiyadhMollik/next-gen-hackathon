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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
          <div className="mt-6">
            <div className="animate-pulse flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-mint-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Discovering amazing resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-mint-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl mb-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-mint-600 bg-clip-text text-transparent">
                  📚 Learning Resources
                </h1>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Discover curated learning materials from top platforms. Enhance your skills with courses, tutorials, and resources tailored to your career goals.
          </p>
          <div className="flex items-center justify-center space-x-2 text-slate-600">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Curated • High-Quality • Career-Focused</span>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-green-100/50 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Filter Resources</h2>
          </div>
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
    </div>
  );
};

export default Resources;
