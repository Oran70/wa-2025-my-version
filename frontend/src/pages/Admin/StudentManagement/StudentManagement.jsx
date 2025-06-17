import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft, Plus, Edit, Trash2, Search, GraduationCap} from 'lucide-react';
import {useStudentManagement} from '../../../hooks/useAdmin';
import './StudentManagement.css';

const StudentManagement = () => {
    const navigate = useNavigate();
    const {
        students,
        pagination,
        classes,
        levels,
        loading,
        error,
        addStudent,
        editStudent,
        removeStudent,
        search
    } = useStudentManagement();

    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const initialFormData = {name: '', student_number: '', level_id: '', class_id: ''};
    const [formData, setFormData] = useState(initialFormData);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        // This will refetch students from the backend with the search query
        search({search: term});
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingStudent(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingStudent) {
            await editStudent(editingStudent.student_id, formData);
        } else {
            await addStudent(formData);
        }
        resetForm();
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            student_number: student.student_number,
            level_id: student.level_id,
            class_id: student.class_id
        });
        setEditingStudent(student);
        setShowForm(true);
    };

    const handleDelete = async (studentId) => {
        if (window.confirm('Weet je zeker dat je deze student wilt verwijderen?')) {
            await removeStudent(studentId);
        }
    };

    if (loading && !students.length) return <div className="admin-container"><h2>Loading Students...</h2></div>;
    if (error) return <div className="admin-container"><h2 style={{color: 'red'}}>Error: {error}</h2></div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="header-navigation">
                        <button className="back-button" onClick={() => navigate('/admin/dashboard')}><ArrowLeft
                            size={20}/>Terug naar Dashboard
                        </button>
                    </div>
                    <h1 className="admin-title"><GraduationCap className="title-icon"/>Studenten beheren</h1>
                    <p className="admin-subtitle">Bekijk, zoek en beheer alle studenten in het systeem.</p>
                </div>
            </div>

            <div className="admin-content">
                <div className="controls-section">
                    <div className="search-container">
                        <Search className="search-icon"/>
                        <input type="text" placeholder="Zoek op naam of studentnummer..." value={searchTerm}
                               onChange={handleSearch} className="search-input"/>
                    </div>
                    <button className="btn btn-primary" onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}><Plus size={20}/>Nieuwe student
                    </button>
                </div>

                {showForm && (
                    <div className="form-section">
                        <h2 className="form-title">{editingStudent ? 'Student bewerken' : 'Nieuwe student toevoegen'}</h2>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-grid">
                                <div className="form-group"><label>Volledige naam *</label><input type="text"
                                                                                                  value={formData.name}
                                                                                                  onChange={(e) => setFormData({
                                                                                                      ...formData,
                                                                                                      name: e.target.value
                                                                                                  })} required/></div>
                                <div className="form-group"><label>Studentnummer *</label><input type="text"
                                                                                                 value={formData.student_number}
                                                                                                 onChange={(e) => setFormData({
                                                                                                     ...formData,
                                                                                                     student_number: e.target.value
                                                                                                 })} required/></div>
                                <div className="form-group"><label>Niveau *</label>
                                    <select value={formData.level_id} onChange={(e) => setFormData({
                                        ...formData,
                                        level_id: e.target.value,
                                        class_id: ''
                                    })} required>
                                        <option value="">Selecteer niveau</option>
                                        {levels.map(level => <option key={level.level_id}
                                                                     value={level.level_id}>{level.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group"><label>Klas *</label>
                                    <select value={formData.class_id}
                                            onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                                            required disabled={!formData.level_id}>
                                        <option value="">Selecteer eerst een niveau</option>
                                        {classes.filter(c => c.level_id === formData.level_id).map(cls => <option
                                            key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-buttons">
                                <button type="button" onClick={resetForm} className="btn btn-outline">Annuleren</button>
                                <button type="submit"
                                        className="btn btn-primary">{editingStudent ? 'Bijwerken' : 'Toevoegen'}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-section">
                    <h2 className="table-title">Alle studenten ({pagination?.totalStudents || 0})</h2>
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>Naam</th>
                                <th>Studentnummer</th>
                                <th>Klas</th>
                                <th>Acties</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.map(student => (
                                <tr key={student.student_id}>
                                    <td>{student.name}</td>
                                    <td>{student.student_number}</td>
                                    <td>{student.class?.class_name || 'N/A'} ({student.level?.name || 'N/A'})</td>
                                    <td className="user-actions">
                                        <button onClick={() => handleEdit(student)} className="action-btn edit-btn"
                                                title="Bewerken"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(student.student_id)}
                                                className="delete-button" title="Verwijderen"><Trash2 size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentManagement;