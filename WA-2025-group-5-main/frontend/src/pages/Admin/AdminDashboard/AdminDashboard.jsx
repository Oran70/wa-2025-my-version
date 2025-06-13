import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, Settings, BarChart3 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const dashboardCards = [
        {
            title: 'Gebruikers beheren',
            description: 'Toevoegen, wijzigen en verwijderen van mentoren, decanen en teamleiders',
            icon: <Users className="dashboard-icon" />,
            route: '/admin/users',
            color: 'primary'
        },
        {
            title: 'Klassen beheren',
            description: 'Toevoegen, wijzigen en verwijderen van klassen en onderwijsniveaus',
            icon: <BookOpen className="dashboard-icon" />,
            route: '/admin/classes',
            color: 'secondary'
        },
        {
            title: 'Afspraken overzicht',
            description: 'Bekijk alle afspraken en beheer geplande gesprekken',
            icon: <Calendar className="dashboard-icon" />,
            route: '/admin/appointments',
            color: 'tertiary'
        }
    ];

    const quickStats = [
        { label: 'Gebruikers', value: '24', change: '+2 deze week' },
        { label: 'Klassen', value: '18', change: 'Geen wijzigingen' },
        { label: 'Afspraken vandaag', value: '12', change: '+3 vergeleken met gisteren' },
        { label: 'Afspraken deze week', value: '87', change: '+15 vergeleken met vorige week' }
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

                {/* Recent Activity */}
                <div className="activity-section">
                    <h2 className="section-title">Recente activiteit</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon activity-icon-user">
                                <Users size={16} />
                            </div>
                            <div className="activity-content">
                                <span className="activity-text">Nieuwe gebruiker toegevoegd: J. de Vries (JDV)</span>
                                <span className="activity-time">2 uur geleden</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon activity-icon-appointment">
                                <Calendar size={16} />
                            </div>
                            <div className="activity-content">
                                <span className="activity-text">15 nieuwe afspraken gepland voor morgen</span>
                                <span className="activity-time">4 uur geleden</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon activity-icon-class">
                                <BookOpen size={16} />
                            </div>
                            <div className="activity-content">
                                <span className="activity-text">Klas 4VWO3 toegevoegd aan systeem</span>
                                <span className="activity-time">1 dag geleden</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;