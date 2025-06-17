import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, School } from 'lucide-react';
import { useClassManagement } from '../../../hooks/useAdmin';
import './ClassManagement.css';

const ClassManagement = () => {
    const navigate = useNavigate();
    const { classes, levels, loading, error, addClass, editClass, removeClass } = useClassManagement();

    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    const [formData, setFormData] = useState({ name: '', level_id: '' });

    const filteredClasses = classes.filter(cls =>
        cls.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.level.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({ name: '', level_id: '' });
        setEditingClass(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingClass) {
            await editClass(editingClass.class_id, formData);
        } else {
            await addClass(formData);
        }
        resetForm();
    };

    const handleEdit = (cls) => {
        setFormData({ name: cls.class_name, level_id: cls.level_id });
        setEditingClass(cls);
        setShowForm(true);
    };

    const handleDelete = async (classId) => {
        if (window.confirm('Weet je zeker dat je deze klas wilt verwijderen?')) {
            await removeClass(classId);
        }
    };

    if (loading) return <div className="admin-container"><h2>Loading Classes...</h2></div>;
    if (error) return <div className="admin-container"><h2 style={{ color: 'red' }}>Error: {error}</h2></div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="header-navigation">
                        <button className="back-button" onClick={() => navigate('/admin/dashboard')}><ArrowLeft size={20} />Terug naar Dashboard</button>
                    </div>
                    <h1 className="admin-title"><School className="title-icon" />Klassen beheren</h1>
                    <p className="admin-subtitle">Voeg nieuwe klassen toe of bewerk bestaande.</p>
                </div>
            </div>

            <div className="admin-content">
                <div className="controls-section">
                    <div className="search-container">
                        <input type="text" placeholder="Zoek klassen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    </div>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus size={20} />Nieuwe klas
                    </button>
                </div>

                {showForm && (
                    <div className="form-section">
                        <div className="form-header"><h2 className="form-title">{editingClass ? 'Klas bewerken' : 'Nieuwe klas toevoegen'}</h2></div>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Naam klas *</label>
                                    <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="level" className="form-label">Onderwijsniveau *</label>
                                    <select id="level" value={formData.level_id} onChange={(e) => setFormData({ ...formData, level_id: e.target.value })} className="form-select" required>
                                        <option value="">Selecteer niveau</option>
                                        {levels.map(level => (
                                            <option key={level.level_id} value={level.level_id}>{level.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-buttons">
                                <button type="button" onClick={resetForm} className="btn btn-outline">Annuleren</button>
                                <button type="submit" className="btn btn-primary">{editingClass ? 'Bijwerken' : 'Toevoegen'}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-section">
                    <div className="table-header"><h2 className="table-title">Alle klassen ({filteredClasses.length})</h2></div>
                    <div className="table-container">
                        <table className="users-table">
                            <thead><tr><th>Naam</th><th>Niveau</th><th>Acties</th></tr></thead>
                            <tbody>
                            {filteredClasses.map(cls => (
                                <tr key={cls.class_id}>
                                    <td>{cls.class_name}</td>
                                    <td>{cls.level.name}</td>
                                    <td className="user-actions">
                                        <button onClick={() => handleEdit(cls)} className="action-btn edit-btn" title="Bewerken"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(cls.class_id)} className="delete-button" title="Verwijderen"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredClasses.length === 0 && (
                            <div className="empty-state"><School size={48} /><p>Geen klassen gevonden</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;