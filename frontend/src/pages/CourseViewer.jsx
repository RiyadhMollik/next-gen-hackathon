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
  const [savingProgress, setSavingProgress] = useState(false);

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

  const markChapterComplete = async (chapterIndex) => {
    const updatedCompletedChapters = new Set(completedChapters);
    if (updatedCompletedChapters.has(chapterIndex)) {
      updatedCompletedChapters.delete(chapterIndex);
    } else {
      updatedCompletedChapters.add(chapterIndex);
    }
    
    setCompletedChapters(updatedCompletedChapters);
    
    // Save to backend
    setSavingProgress(true);
    try {
      await api.put(`/courses/${courseId}/progress`, {
        completedChapters: Array.from(updatedCompletedChapters)
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
      // Revert on error
      setCompletedChapters(completedChapters);
      alert('Failed to save progress. Please try again.');
    } finally {
      setSavingProgress(false);
    }
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
          <div className="mt-6">
            <div className="animate-pulse flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-mint-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const currentChapterContent = course.courseContent?.[selectedChapter];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-mint-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-4 hover:gap-3 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>

          {/* Course Banner */}
          <div
            className="h-64 rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-mint-500 relative overflow-hidden mb-6 shadow-2xl"
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100/50 p-6 mb-6 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Your Progress
                {savingProgress && (
                  <span className="text-xs text-emerald-600 font-normal flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div>
                    Saving...
                  </span>
                )}
              </h3>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600 h-4 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-3 font-medium">
              {completedChapters.size} of {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).length} chapters completed
            </p>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chapter List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100/50 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                Chapters
              </h2>
              <div className="space-y-2">
                {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedChapter(index)}
                    className={`w-full text-left p-4 rounded-2xl transition-all transform hover:scale-[1.02] ${
                      selectedChapter === index
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-md'
                        : 'bg-slate-50/80 hover:bg-green-50/50 border-2 border-transparent hover:border-green-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          markChapterComplete(index);
                        }}
                        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                          completedChapters.has(index)
                            ? 'bg-green-500 border-green-500 shadow-md'
                            : 'border-slate-300 hover:border-green-400 hover:bg-green-50'
                        }`}
                      >
                        {completedChapters.has(index) && (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold mb-1 ${
                          selectedChapter === index ? 'text-green-700' : 'text-slate-700'
                        }`}>
                          Chapter {index + 1}
                        </p>
                        <p className={`text-xs line-clamp-2 ${
                          selectedChapter === index ? 'text-slate-600 font-medium' : 'text-slate-500'
                        }`}>
                          {chapter.chapterName || chapter.chapterTitle}
                        </p>
                        {chapter.duration && (
                          <p className="text-xs text-emerald-500 font-semibold mt-1">{chapter.duration}</p>
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
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100/50 overflow-hidden">
              {/* Chapter Header */}
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-mint-50 p-6 border-b border-green-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Chapter {selectedChapter + 1}: {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [])[selectedChapter]?.chapterName || (course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [])[selectedChapter]?.chapterTitle}
                </h2>
                {(course.courseLayout?.course?.chapters || course.courseLayout?.chapters || [])[selectedChapter]?.duration && (
                  <p className="text-emerald-600 flex items-center gap-2 font-semibold">
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
                          <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
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
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mt-6 border-2 border-green-100 shadow-lg">
                            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
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
                                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] border-2 border-green-100 hover:border-green-300"
                                >
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-32 object-cover"
                                  />
                                  <div className="p-3">
                                    <p className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">
                                      {video.title}
                                    </p>
                                    <p className="text-xs text-green-600 font-semibold">{video.channelTitle}</p>
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-t border-green-100 flex justify-between">
                <button
                  onClick={() => setSelectedChapter(Math.max(0, selectedChapter - 1))}
                  disabled={selectedChapter === 0}
                  className="px-6 py-3 bg-white text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-green-200 hover:border-green-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => setSelectedChapter(Math.min(((course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).length || 1) - 1, selectedChapter + 1))}
                  disabled={selectedChapter === ((course.courseLayout?.course?.chapters || course.courseLayout?.chapters || []).length || 1) - 1}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600 text-white rounded-2xl font-bold hover:from-green-600 hover:via-emerald-700 hover:to-mint-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
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
