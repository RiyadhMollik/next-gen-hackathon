import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CreateCourseDialog from '../components/CreateCourseDialog';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      const coursesData = response.data.courses || [];
      
      // Parse JSON strings if needed
      const parsedCourses = coursesData.map(course => {
        if (typeof course.courseLayout === 'string') {
          try {
            course.courseLayout = JSON.parse(course.courseLayout);
          } catch (e) {
            console.error('Failed to parse courseLayout:', e);
          }
        }
        return course;
      });
      
      setCourses(parsedCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCreated = (courseId) => {
    fetchCourses();
    navigate(`/courses/edit/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'generating':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
            <p className="mt-4 text-slate-600 font-medium">Discovering amazing courses for you...</p>
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
                  � AI Learning Hub
                </h1>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Create personalized, AI-powered learning experiences tailored to your goals. 
            Build comprehensive courses with interactive content and real-world projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center gap-3 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Course</span>
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </button>
            <div className="flex items-center space-x-2 text-slate-600">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">AI-Powered • Interactive • Project-Based</span>
            </div>
          </div>
        </div>

        {/* Enhanced Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">{courses.length}</p>
                <p className="text-slate-600 text-sm font-medium">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-emerald-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-emerald-100 to-mint-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {courses.filter(c => c.status === 'published').length}
                </p>
                <p className="text-slate-600 text-sm font-medium">Published</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-mint-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-mint-100 to-green-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 group-hover:text-mint-600 transition-colors">
                  {courses.reduce((sum, c) => sum + (c.noOfChapters || 0), 0)}
                </p>
                <p className="text-slate-600 text-sm font-medium">Total Chapters</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                  {courses.filter(c => c.status === 'draft').length}
                </p>
                <p className="text-slate-600 text-sm font-medium">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-100 p-16 text-center animate-fade-in">
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-0 right-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-mint-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              </div>
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">
                🎯 Ready to Start Learning?
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Create your first AI-powered course and embark on a personalized learning journey. 
                Our intelligent system will craft content tailored specifically to your goals and learning style.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Create Your First Course
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </button>
                <p className="text-sm text-slate-500">✨ AI-powered • 🎯 Personalized • 🚀 Interactive</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Enhanced Course Banner */}
                <div
                  className="h-56 bg-gradient-to-br from-green-400 via-emerald-500 to-mint-600 relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: course.bannerImageUrl ? `url(${course.bannerImageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20" />
                  
                  {/* Floating Elements */}
                  <div className="absolute top-3 left-3 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-8 left-8 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm bg-white/90 ${getLevelColor(course.level)} shadow-lg`}>
                      {course.level}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm bg-white/90 ${getStatusColor(course.status)} shadow-lg`}>
                      {course.status}
                    </span>
                  </div>

                  {/* Course Icon */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Enhanced Course Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
                      {course.name}
                    </h3>
                    <div className="ml-2 flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                    {course.description || "Discover new skills and advance your career with this comprehensive course designed for modern learners."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-green-50 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium">{course.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-emerald-50 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="font-medium">{course.noOfChapters || 0} Chapters</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-green-100">
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Course
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}
                      className="px-3 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 hover:scale-105 transition-all duration-300 border border-red-200 hover:border-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Dialog */}
      <CreateCourseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCourseCreated={handleCourseCreated}
      />
    </div>
  );
};

export default Courses;
