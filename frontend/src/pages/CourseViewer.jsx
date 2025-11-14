import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState(new Set());

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
      if (typeof courseData.completedChapters === 'string') {
        courseData.completedChapters = JSON.parse(courseData.completedChapters);
      }
      
      setCourse(courseData);
      
      // Initialize completed chapters
      if (courseData.completedChapters) {
        setCompletedChapters(new Set(courseData.completedChapters));
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
      alert('Failed to load course');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const markChapterComplete = (chapterIndex) => {
    setCompletedChapters(prev => {
      const updated = new Set(prev);
      if (updated.has(chapterIndex)) {
        updated.delete(chapterIndex);
      } else {
        updated.add(chapterIndex);
      }
      return updated;
    });
  };

  const getProgressPercentage = () => {
    if (!course || !course.courseLayout) return 0;
    const chapters = course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [];
    const totalChapters = chapters.length;
    if (totalChapters === 0) return 0;
    return Math.round((completedChapters.size / totalChapters) * 100);
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

  const currentChapterContent = course.courseContent?.[selectedChapter];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>

          {/* Course Banner */}
          <div
            className="h-64 rounded-3xl bg-gradient-to-br from-primary-400 to-indigo-500 relative overflow-hidden mb-6"
            style={{
              backgroundImage: course.bannerImageUrl ? `url(${course.bannerImageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-semibold border border-white/30">
                  {course.level}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-semibold border border-white/30">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-semibold border border-white/30">
                  {course.noOfChapters} Chapters
                </span>
              </div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {course.name}
              </h1>
              <p className="text-white/90 text-lg max-w-3xl">
                {course.description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900">Your Progress</h3>
              <span className="text-2xl font-bold text-primary-600">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {completedChapters.size} of {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).length} chapters completed
            </p>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chapter List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Chapters
              </h2>
              <div className="space-y-2">
                {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedChapter(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedChapter === index
                        ? 'bg-gradient-to-r from-primary-50 to-indigo-50 border-2 border-primary-200'
                        : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          markChapterComplete(index);
                        }}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                          completedChapters.has(index)
                            ? 'bg-green-500 border-green-500'
                            : 'border-slate-300 hover:border-primary-400'
                        }`}
                      >
                        {completedChapters.has(index) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold mb-1 ${
                          selectedChapter === index ? 'text-primary-700' : 'text-slate-700'
                        }`}>
                          Chapter {index + 1}
                        </p>
                        <p className={`text-xs line-clamp-2 ${
                          selectedChapter === index ? 'text-slate-600' : 'text-slate-500'
                        }`}>
                          {chapter.chapterName || chapter.chapterTitle}
                        </p>
                        {chapter.duration && (
                          <p className="text-xs text-slate-400 mt-1">{chapter.duration}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
              {/* Chapter Header */}
              <div className="bg-gradient-to-r from-primary-50 to-indigo-50 p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Chapter {selectedChapter + 1}: {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [])[selectedChapter]?.chapterName || (course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [])[selectedChapter]?.chapterTitle}
                </h2>
                {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [])[selectedChapter]?.duration && (
                  <p className="text-slate-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [])[selectedChapter]?.duration}
                  </p>
                )}
              </div>

              {/* Chapter Content */}
              <div className="p-8">
                {currentChapterContent ? (
                  <>
                    {/* Topics */}
                    {currentChapterContent.topics?.map((topic, topicIndex) => (
                      <div key={topicIndex} className="mb-8 last:mb-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
                            {topicIndex + 1}
                          </span>
                          {topic.title}
                        </h3>
                        
                        {/* Topic Content */}
                        <div
                          className="prose prose-slate max-w-none mb-6"
                          dangerouslySetInnerHTML={{ __html: topic.content }}
                        />

                        {/* YouTube Videos */}
                        {topic.videos && topic.videos.length > 0 && (
                          <div className="bg-slate-50 rounded-xl p-6 mt-6">
                            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                              Recommended Videos
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {topic.videos.map((video, videoIndex) => (
                                <a
                                  key={videoIndex}
                                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200"
                                >
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-32 object-cover"
                                  />
                                  <div className="p-3">
                                    <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1">
                                      {video.title}
                                    </p>
                                    <p className="text-xs text-slate-600">{video.channelTitle}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-slate-600">No content available for this chapter yet</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setSelectedChapter(Math.max(0, selectedChapter - 1))}
                  disabled={selectedChapter === 0}
                  className="px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => setSelectedChapter(Math.min(((course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).length || 1) - 1, selectedChapter + 1))}
                  disabled={selectedChapter === ((course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).length || 1) - 1}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
