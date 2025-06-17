import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import './TeacherDashboard.css';
import { useTeacherDashboard } from '../../../hooks/useTeacher';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { dashboardData, loading, error } = useTeacherDashboard();
    const [teacherInfo, setTeacherInfo] = useState(null);

    // Get the logged-in teacher's info from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setTeacherInfo(JSON.parse(storedUser));
        }
    }, []);

    // --- THIS IS YOUR ORIGINAL DASHBOARD CARDS CONSTANT. IT IS NOW INCLUDED. ---
    const dashboardCards = [
        {
            title: 'Beschikbaarheid instellen',
            description: 'Stel uw beschikbare tijden in voor ouderavonden en gesprekken',
            icon: <Clock className="dashboard-icon" />,
            route: '/teacher/availability',
            color: 'primary'
        },
        {
            title: 'Afspraken overzicht',
            description: 'Bekijk al uw geplande afspraken en beheer gesprekken',
            icon: <Calendar className="dashboard-icon" />,
            route: '/teacher/overview',
            color: 'secondary'
        }
    ];

    // Map live stats data to the structure your component expects
    const quickStats = [
        { label: 'Totaal Ingepland', value: dashboardData?.statistics?.scheduled ?? '0', change: 'Momenteel gepland' },
        { label: 'Totaal Afgerond', value: dashboardData?.statistics?.completed ?? '0', change: 'In historie' },
        { label: 'Totaal Geannuleerd', value: dashboardData?.statistics?.cancelled ?? '0', change: 'In historie' },
        { label: 'Totaal Afspraken', value: dashboardData?.statistics?.total_appointments ?? '0', change: 'Alle afspraken' },
    ];

    // Filter today's appointments from the live API data
    const todayString = new Date().toISOString().slice(0, 10);
    const appointmentsToday = dashboardData?.appointments?.filter(
        appt => appt.date === todayString && appt.status === 'Scheduled'
    ) || [];

    // Your original helper functions
    const getStatusIcon = (status) => {
        return status === 'Scheduled' ?
            <CheckCircle className="status-icon status-scheduled" /> :
            <XCircle className="status-icon status-cancelled" />;
    };

    const getTypeText = () => 'Gesprek';

    // Loading and Error states
    if (loading) {
        return <div className="teacher-container"><h1 className="teacher-title">Dashboard laden...</h1></div>;
    }
    if (error) {
        return <div className="teacher-container"><h1 className="teacher-title" style={{ color: 'red' }}>Fout bij laden: {error}</h1></div>;
    }

    // Your original JSX structure, with all parts included and connected to live data
    return (
        <div className="teacher-container">
            <div className="teacher-header">
                <div className="teacher-header-content">
                    <h1 className="teacher-title">Medewerker dashboard</h1>
                    <p className="teacher-subtitle">Welkom terug, {teacherInfo?.name}! Beheer hier uw afspraken en beschikbaarheid.</p>
                </div>
                <div className="teacher-user-info">
                    <div className="teacher-user-avatar">
                        <User className="avatar-icon" />
                    </div>
                    <div className="teacher-user-details">
                        <span className="teacher-user-name">{teacherInfo?.name}</span>
                        <span className="teacher-user-role">{teacherInfo?.roles?.join(', ')}</span>
                    </div>
                </div>
            </div>

            <div className="teacher-content">
                <div className="stats-section">
                    <h2 className="section-title">Statistieken</h2>
                    <div className="stats-grid">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-change">{stat.change}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* THIS IS THE MISSING SECTION, NOW RESTORED */}
                <div className="dashboard-section">
                    <h2 className="section-title">Beheren</h2>
                    <div className="dashboard-grid">
                        {dashboardCards.map((card, index) => (
                            <div
                                key={index}
                                className={`dashboard-card dashboard-card-${card.color}`}
                                onClick={() => navigate(card.route)}
                            >
                                <div className="dashboard-card-header">
                                    <div className="dashboard-icon-container">
                                        {card.icon}
                                    </div>
                                    <h3 className="dashboard-card-title">{card.title}</h3>
                                </div>
                                <p className="dashboard-card-description">{card.description}</p>
                                <div className="dashboard-card-arrow">
                                    →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="appointments-section">
                    <h2 className="section-title">Afspraken vandaag</h2>
                    <div className="appointments-today">
                        {appointmentsToday.length === 0 ? (
                            <div className="no-appointments">
                                <p>Geen afspraken vandaag gepland.</p>
                            </div>
                        ) : (
                            appointmentsToday.map((appointment) => (
                                <div
                                    key={appointment.appointment_id}
                                    className={`appointment-today-item`}
                                >
                                    <div className="appointment-today-time">
                                        <div className="time-display">{appointment.start_time} - {appointment.end_time}</div>
                                        <div className="appointment-type">{getTypeText()}</div>
                                    </div>
                                    <div className="appointment-today-details">
                                        <div className="student-name">{appointment.student_name}</div>
                                        <div className="class-info">Ouder: {appointment.parent_name}</div>
                                    </div>
                                    <div className="appointment-today-status">
                                        {getStatusIcon(appointment.status)}
                                        <span className={`status-text ${appointment.status.toLowerCase()}`}>
                                            {appointment.status === 'Scheduled' ? 'Ingepland' : 'Geannuleerd'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;