import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CourseEdit = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${courseId}`);
      const courseData = response.data.course;
      
      // Parse JSON strings if needed
      if (typeof courseData.courseLayout === 'string') {
        courseData.courseLayout = JSON.parse(courseData.courseLayout);
      }
      if (typeof courseData.courseContent === 'string') {
        courseData.courseContent = JSON.parse(courseData.courseContent);
      }
      
      setCourse(courseData);
    } catch (error) {
      console.error('Failed to fetch course:', error);
      alert('Failed to load course');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const generateCourseContent = async () => {
    if (!window.confirm('This will generate detailed content and YouTube videos for all chapters. This may take 1-2 minutes. Continue?')) {
      return;
    }

    try {
      setGenerating(true);
      const response = await api.post(`/courses/generate-content/${courseId}`);
      
      if (response.data.success) {
        alert('✅ Course content generated successfully! Redirecting to course viewer...');
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error('Content generation error:', error);
      alert(`Failed to generate content: ${error.response?.data?.message || error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const courseLayout = course.courseLayout?.course || course.courseLayout;
  const hasContent = course.courseContent && course.courseContent.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </button>

        {/* Course Info Card */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 via-indigo-600 to-mint-600 bg-clip-text text-transparent mb-3">
                  {courseLayout?.name || course.name}
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {courseLayout?.description || course.description}
                </p>
              </div>

              {/* Info Boxes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-semibold">Duration</p>
                      <p className="text-lg font-bold text-blue-900">2-3 Hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-semibold">Chapters</p>
                      <p className="text-lg font-bold text-green-900">{course.noOfChapters}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 font-semibold">Level</p>
                      <p className="text-lg font-bold text-purple-900 capitalize">{course.level}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              {!hasContent ? (
                <button
                  onClick={generateCourseContent}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Content & Videos...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Course Content
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Continue Learning
                </button>
              )}

              {generating && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Processing...</p>
                      <p className="text-xs text-blue-700 mt-1">
                        AI is generating detailed content for each topic and finding relevant YouTube videos. This may take 1-2 minutes. Please don't close this page.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Image */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={course.bannerImageUrl || 'https://placehold.co/400x300/6366f1/ffffff?text=Course+Banner'}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Course Structure
          </h2>

          <div className="space-y-4">
            {(courseLayout?.chapters || []).map((chapter, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {chapter.chapterName || chapter.chapterTitle}
                    </h3>
                    {chapter.duration && (
                      <p className="text-sm text-slate-600 flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {chapter.duration}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(chapter.topics || []).map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1 bg-white text-slate-700 text-sm rounded-lg border border-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  {hasContent && (
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;
