import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from "./components/ScrollToTop/index.js";

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Teacher/Auth/Login';
import UniqueCode from './pages/Parent/UniqueCode/UniqueCode';
import Appointment from './pages/Parent/Appointment/Appointment';
import TeacherAvailability from './pages/Teacher/TeacherAvailability/TeacherAvailability.jsx';
import TeacherDashboard from './pages/Teacher/TeacherDashboard/TeacherDashboard.jsx';
import TeacherOverview from './pages/Teacher/TeacherOverview/TeacherOverview.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard.jsx';
import UserManagement from './pages/Admin/UserManagement/UserManagement.jsx';
import ClassManagement from './pages/Admin/ClassManagement/ClassManagement.jsx';
import AppointmentManagement from './pages/Admin/AppointmentManagement/AppointmentManagement.jsx';
import StudentManagement from './pages/Admin/StudentManagement/StudentManagement.jsx';




// CSS
import './index.css';
import NotFound from './pages/NotFound.jsx';
import Team from './pages/Contact/Team.jsx';



function AppContent() {
    // State to manage loading state
    const [isLoading, setIsLoading] = useState(true);

    // Simulate initial app loading/authentication check
    useEffect(() => {
        const checkInitialState = async () => {
            // Any initial app setup can go here
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        checkInitialState();
    }, []);

    if (isLoading) {
        return <div className="app-loader">Loading application...</div>;
    }

    return (
        <Router>
            <ScrollToTop />
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="contact/team" element={<Team />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/code" element={<UniqueCode />} />
                        <Route path="/afspraak-plannen" element={<Appointment />} />
                        <Route path="/teacher/availability" element={<TeacherAvailability />} />
                        <Route path="/teacher/overview" element={<TeacherOverview />} />
                        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/classes" element={<ClassManagement />} />
                        <Route path="/admin/appointments" element={<AppointmentManagement />} />
                        <Route path="/admin/students" element={<StudentManagement />} />
                        <Route path="*" element={<NotFound />} />
                        
                        
                        
                        
                        


                        {/*/!* Auth Routes - Redirect if already logged in *!/*/}
                        {/*<Route*/}
                        {/*    path="/login"*/}
                        {/*    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/register"*/}
                        {/*    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}*/}
                        {/*/>*/}

                        {/*/!* Protected Routes *!/*/}
                        {/*<Route*/}
                        {/*    path="/dashboard"*/}
                        {/*    element={*/}
                        {/*        <ProtectedRoute>*/}
                        {/*            <Dashboard />*/}
                        {/*        </ProtectedRoute>*/}
                        {/*    }*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/dashboard/:section"*/}
                        {/*    element={*/}
                        {/*        <ProtectedRoute>*/}
                        {/*            <Dashboard />*/}
                        {/*        </ProtectedRoute>*/}
                        {/*    }*/}
                        {/*/>*/}

                        {/*/!* 404 Route *!/*/}
                        {/*<Route path="*" element={<NotFound />} />*/}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

function App() {
    return (
        // <AuthProvider>
            <AppContent />
        // </AuthProvider>
    );
}

export default App;

