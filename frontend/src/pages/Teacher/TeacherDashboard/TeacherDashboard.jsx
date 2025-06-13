import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Settings, CheckCircle, XCircle } from 'lucide-react';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const navigate = useNavigate();

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

    const quickStats = [
        { label: 'Afspraken vandaag', value: '5', change: '+2 vergeleken met gisteren' },
        { label: 'Afspraken deze week', value: '23', change: '+7 vergeleken met vorige week' },
        { label: 'Ingeplande afspraken', value: '18', change: '3 nog te bevestigen' },
        { label: 'Geannuleerde afspraken', value: '2', change: 'Deze week' }
    ];

    const upcomingAppointments = [
        {
            id: 1,
            time: '09:00 - 09:15',
            studentName: 'Emma van der Berg',
            class: '3A',
            status: 'scheduled',
            type: 'online'
        },
        {
            id: 2,
            time: '09:30 - 09:45',
            studentName: 'Daan Jansen',
            class: '2B',
            status: 'scheduled',
            type: 'onsite'
        },
        {
            id: 3,
            time: '10:00 - 10:15',
            studentName: 'Sophie Bakker',
            class: '3A',
            status: 'cancelled',
            type: 'choice'
        }
    ];

    const getStatusIcon = (status) => {
        return status === 'scheduled' ?
            <CheckCircle className="status-icon status-scheduled" /> :
            <XCircle className="status-icon status-cancelled" />;
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'online': return 'Online';
            case 'onsite': return 'Op school';
            case 'choice': return 'Naar keuze';
            default: return 'Onbekend';
        }
    };

    return (
        <div className="teacher-container">
            <div className="teacher-header">
                <div className="teacher-header-content">
                    <h1 className="teacher-title">Medewerker dashboard</h1>
                    <p className="teacher-subtitle">Welkom terug! Beheer hier uw afspraken en beschikbaarheid.</p>
                </div>
                <div className="teacher-user-info">
                    <div className="teacher-user-avatar">
                        <User className="avatar-icon" />
                    </div>
                    <div className="teacher-user-details">
                        <span className="teacher-user-name">Dhr. M. van den Berg</span>
                        <span className="teacher-user-role">Mentor 3A</span>
                    </div>
                </div>
            </div>

            <div className="teacher-content">
                {/* Quick Stats */}
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

                {/* Dashboard Cards */}
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

                {/* Today's Appointments */}
                <div className="appointments-section">
                    <h2 className="section-title">Afspraken vandaag</h2>
                    <div className="appointments-today">
                        {upcomingAppointments.length === 0 ? (
                            <div className="no-appointments">
                                <p>Geen afspraken vandaag gepland.</p>
                            </div>
                        ) : (
                            upcomingAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className={`appointment-today-item ${appointment.status === 'cancelled' ? 'cancelled' : ''}`}
                                >
                                    <div className="appointment-today-time">
                                        <div className="time-display">{appointment.time}</div>
                                        <div className="appointment-type">{getTypeText(appointment.type)}</div>
                                    </div>
                                    <div className="appointment-today-details">
                                        <div className="student-name">{appointment.studentName}</div>
                                        <div className="class-info">Klas: {appointment.class}</div>
                                    </div>
                                    <div className="appointment-today-status">
                                        {getStatusIcon(appointment.status)}
                                        <span className={`status-text ${appointment.status}`}>
                                            {appointment.status === 'scheduled' ? 'Ingepland' : 'Geannuleerd'}
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