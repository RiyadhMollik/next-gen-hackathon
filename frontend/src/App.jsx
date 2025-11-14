import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatWidget from './components/ChatWidget';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import Resources from './pages/Resources';
import Courses from './pages/Courses';
import CourseEdit from './pages/CourseEdit';
import CourseViewer from './pages/CourseViewer';
import RoadmapViewer from './pages/RoadmapViewer';
import MockInterview from './pages/MockInterview';
import InterviewFeedback from './pages/InterviewFeedback';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                <PrivateRoute>
                  <Jobs />
                </PrivateRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <PrivateRoute>
                  <Resources />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute>
                  <Courses />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/edit/:courseId"
              element={
                <PrivateRoute>
                  <CourseEdit />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <PrivateRoute>
                  <CourseViewer />
                </PrivateRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <PrivateRoute>
                  <RoadmapViewer />
                </PrivateRoute>
              }
            />
            <Route
              path="/roadmap/:roadmapId"
              element={
                <PrivateRoute>
                  <RoadmapViewer />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/:interviewId"
              element={
                <PrivateRoute>
                  <MockInterview />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/:interviewId/feedback"
              element={
                <PrivateRoute>
                  <InterviewFeedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <AnalyticsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
          </main>
          <Footer />
          <ScrollToTop />
          <ChatWidget />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
