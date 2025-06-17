import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, Settings, GraduationCap } from 'lucide-react';
import { useDashboardStats } from '../../../hooks/useAdmin'; // Import the hook
import './AdminDashboard.css';

// Added a helper method for Admin "Recent Activities component."
const getLogDetails = (logItem) => {
    if (!logItem.details) return null;
    if (typeof logItem.details === 'object') return logItem.details;
    try {
        return JSON.parse(logItem.details);
    } catch (error) {
        console.error('Failed to parse log details:', error);
        return null;
    }
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    // Use our new hook to fetch data
    const { stats, loading, error } = useDashboardStats();

    // The navigation cards remain the same
    const dashboardCards = [
        {
            title: 'Gebruikers beheren',
            description: 'Toevoegen, wijzigen en verwijderen van gebruikers',
            icon: <Users className="dashboard-icon" />,
            route: '/admin/users',
            color: 'primary'
        },
        {
            title: 'Klassen beheren',
            description: 'Toevoegen, wijzigen en verwijderen van klassen',
            icon: <BookOpen className="dashboard-icon" />,
            route: '/admin/classes',
            color: 'secondary'
        },
        {
            title: 'Studenten beheren',
            description: 'Bekijk en beheer alle studenten in het systeem',
            icon: <GraduationCap className="dashboard-icon" />,
            route: '/admin/students',
            color: 'quaternary' // A new color for distinction
        },
        {
            title: 'Afspraken overzicht',
            description: 'Bekijk alle geplande en afgelopen afspraken',
            icon: <Calendar className="dashboard-icon" />,
            route: '/admin/appointments',
            color: 'tertiary'
        }
    ];

    // Display a loading message while data is being fetched
    if (loading) {
        return <div className="admin-container"><h1 className="admin-title">Loading Dashboard...</h1></div>;
    }

    // Display an error message if fetching fails
    if (error) {
        return <div className="admin-container"><h1 className="admin-title" style={{color: 'red'}}>Error: {error}</h1></div>;
    }

    // Once loading is complete, use the 'stats' object to build the data
    const quickStats = [
        { label: 'Actieve Gebruikers', value: stats?.totalUsers ?? 'N/A' },
        { label: 'Totaal Klassen', value: stats?.totalClasses ?? 'N/A' },
        { label: 'Afspraken Vandaag', value: stats?.appointmentsToday ?? 'N/A' },
        { label: 'Totaal Afspraken', value: stats?.totalAppointments ?? 'N/A' }
    ];

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-header-content">
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">Welkom terug! Beheer hier uw EduPlan systeem.</p>
                </div>
                <div className="admin-user-info">
                    <div className="admin-user-avatar">
                        <Settings className="avatar-icon" />
                    </div>
                    <div className="admin-user-details">
                        <span className="admin-user-name">Administrator</span>
                        <span className="admin-user-role">Systeembeheerder</span>
                    </div>
                </div>
            </div>

            <div className="admin-content">
                {/* Quick Stats Section - Now uses live data */}
                <div className="stats-section">
                    <h2 className="section-title">Statistieken</h2>
                    <div className="stats-grid">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Cards Section - No changes needed here */}
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
                                <div className="dashboard-card-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Section - Now uses live data */}
                <div className="activity-section">
                    <h2 className="section-title">Recente activiteit</h2>
                    <div className="activity-list">
                        {stats && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((item) => {
                                const details = getLogDetails(item);
                                const actor = item.user?.name || (details?.createdBy === 'Parent' ? 'Parent' : 'System');

                                return (
                                    <div key={item.log_id} className="activity-item">
                                        <div className="activity-icon activity-icon-user">
                                            <Users size={16} />
                                        </div>
                                        <div className="activity-content">
                                            <span className="activity-text">{item.action} by {actor}</span>
                                            <span className="activity-time">{new Date(item.created_at).toLocaleString('nl-NL')}</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Geen recente activiteit gevonden.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;