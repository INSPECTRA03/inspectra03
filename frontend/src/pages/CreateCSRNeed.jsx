import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCSRNeed } from '../services/api';

const CreateCSRNeed = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        state: '',
        district: '',
        city_locality: '',
        category: '',
        beneficiary_type: '',
        beneficiary_count: '',
        urgency: 'LOW',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successId, setSuccessId] = useState(null);
    const [successData, setSuccessData] = useState(null);

    const categories = [
        'Education', 'Healthcare', 'Environment', 'Livelihood', 'Community Development', 'Other'
    ];

    const beneficiaryTypes = [
        'Students', 'Women', 'Children', 'Rural Communities', 'Elderly', 'Persons with Disabilities', 'General Community', 'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        const count = parseInt(formData.beneficiary_count, 10);
        if (isNaN(count) || count < 0) {
            setError('Beneficiary count must be a valid positive integer.');
            return;
        }
        if (!formData.description.trim()) {
            setError('Description must contain meaningful text.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                beneficiary_count: count
            };

            const response = await createCSRNeed(payload);
            setSuccessId(response.id);
            setSuccessData(response);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during submission.');
        } finally {
            setLoading(false);
        }
    };

    if (successId && successData) {
        return (
            <div className="form-container">
                <div className="success-banner">
                    <h2>CSR Need Submitted</h2>
                </div>
                <div className="summary-card">
                    <p><strong>Need ID:</strong> {successData.id}</p>
                    <p><strong>Category:</strong> {successData.category}</p>
                    <p><strong>Location:</strong> {successData.location.city}, {successData.location.district}, {successData.location.state}</p>
                    <p><strong>Beneficiary Count:</strong> {successData.beneficiary_count}</p>
                    <p><strong>Urgency:</strong> <span className={`badge badge-${successData.urgency.toLowerCase()}`}>{successData.urgency}</span></p>
                    <p><strong>Status:</strong> <span className="badge badge-status">{successData.status.replace(/_/g, ' ')}</span></p>

                    <button className="btn-primary mt-4" onClick={() => navigate(`/csr-needs/${successData.id}`)}>
                        View CSR Need
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h1 className="page-title">CSR Need Assessment</h1>
            <p className="subtitle">Submit a CSR requirement to identify, assess and connect it with relevant NGO partners.</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="csr-form">
                <div className="form-section">
                    <h3>SECTION 1: Location</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>State *</label>
                            <input type="text" name="state" required value={formData.state} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>District *</label>
                            <input type="text" name="district" required value={formData.district} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>City / Locality *</label>
                            <input type="text" name="city_locality" required value={formData.city_locality} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>SECTION 2: CSR Requirement</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>CSR Category *</label>
                            <select name="category" required value={formData.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Beneficiary Type *</label>
                            <select name="beneficiary_type" required value={formData.beneficiary_type} onChange={handleChange}>
                                <option value="">Select Beneficiary Type</option>
                                {beneficiaryTypes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Beneficiary Count *</label>
                            <input type="number" min="0" name="beneficiary_count" required value={formData.beneficiary_count} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>SECTION 3: Need Details</h3>
                    <div className="form-group">
                        <label>Need Description *</label>
                        <textarea
                            name="description"
                            required
                            rows="5"
                            placeholder="Describe the CSR need, the problem faced by the community, and the support required."
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Urgency *</label>
                        <select name="urgency" required value={formData.urgency} onChange={handleChange}>
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit CSR Need'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCSRNeed;
