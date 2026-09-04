import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCSRNeed, fetchLocations } from '../services/api';
import { Button, PageHeader, ErrorState, StatusBadge } from '../components/UI';
import { CheckCircle2 } from 'lucide-react';

const CreateCSRNeed = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        state: '',
        district: '',
        city_locality: '',
        category: '',
        beneficiary_type: '',
        beneficiary_count: '',
        description: '',
        urgency: 'MEDIUM'
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successId, setSuccessId] = useState(null);
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        async function loadLocations() {
            try {
                const data = await fetchLocations();
                setLocations(data);
            } catch (err) {
                console.error("Failed to load locations:", err);
            }
        }
        loadLocations();
    }, []);

    const categories = [
        'Education', 'Healthcare', 'Environment', 'Women Empowerment', 
        'Livelihood', 'Rural Development', 'Disaster Relief', 'Skill Development'
    ];
    
    const beneficiaryTypes = ['Students', 'Women', 'Children', 'Rural Communities', 'Elderly', 'Persons with Disabilities', 'General Community', 'Other'];

    const availableStates = [...new Set(locations.map(l => l.state))].sort();
    
    const availableDistricts = formData.state 
        ? [...new Set(locations.filter(l => l.state === formData.state).map(l => l.district))].sort() 
        : [];
        
    const availableCities = (formData.state && formData.district)
        ? [...new Set(locations.filter(l => l.state === formData.state && l.district === formData.district).map(l => l.city))].sort()
        : [];

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        if (name === 'state') {
            setFormData(prev => ({ ...prev, state: value, district: '', city_locality: '' }));
        } else if (name === 'district') {
            setFormData(prev => ({ ...prev, district: value, city_locality: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

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
            const payload = { ...formData, beneficiary_count: count };
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
            <div style={{maxWidth: '800px'}}>
                <div className="state-container mb-4" style={{borderColor: 'var(--success-bg)'}}>
                    <CheckCircle2 color="var(--success)" />
                    <h3 style={{color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 600}}>CSR Need Submitted</h3>
                    <p>Your community requirement has been successfully identified.</p>
                </div>

                <div className="card mb-4">
                    <div className="card-header"><h2 className="card-title" style={{margin: 0}}>Submission Summary</h2></div>
                    <div className="card-body">
                        <div className="form-grid mb-4">
                            <div>
                                <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Need ID</span>
                                <strong>#{successData.id}</strong>
                            </div>
                            <div>
                                <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Category</span>
                                <strong>{successData.category}</strong>
                            </div>
                            <div>
                                <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Status</span>
                                <StatusBadge status={successData.status.replace(/_/g, ' ')} />
                            </div>
                        </div>
                        <Button onClick={() => navigate(`/csr-needs/${successData.id}`)}>
                            View CSR Need
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up" style={{maxWidth: '800px'}}>
            <PageHeader 
                title="Create CSR Need" 
                subtitle="Provide the details of the community requirement."
            />

            {error && <div className="mb-4"><ErrorState message={error} /></div>}

            <form onSubmit={handleSubmit} className="card">
                <div className="card-body">
                    
                    <h3 style={{color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.125rem'}}>LOCATION</h3>
                    <div className="form-grid mb-4" style={{paddingBottom: '2rem', borderBottom: '1px solid var(--border)'}}>
                        <div className="form-group">
                            <label className="form-label">State *</label>
                            <select name="state" required className="form-control" value={formData.state} onChange={handleLocationChange}>
                                <option value="">Select State</option>
                                {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">District *</label>
                            <select name="district" required className="form-control" value={formData.district} onChange={handleLocationChange} disabled={!formData.state} style={{opacity: !formData.state ? 0.6 : 1}}>
                                <option value="">Select District</option>
                                {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">City / Locality *</label>
                            <select name="city_locality" required className="form-control" value={formData.city_locality} onChange={handleLocationChange} disabled={!formData.district} style={{opacity: !formData.district ? 0.6 : 1}}>
                                <option value="">Select City / Locality</option>
                                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <h3 style={{color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.125rem'}}>CSR REQUIREMENT</h3>
                    <div className="form-grid mb-4" style={{paddingBottom: '2rem', borderBottom: '1px solid var(--border)'}}>
                        <div className="form-group">
                            <label className="form-label">CSR Category *</label>
                            <select name="category" required className="form-control" value={formData.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Beneficiary Type *</label>
                            <select name="beneficiary_type" required className="form-control" value={formData.beneficiary_type} onChange={handleChange}>
                                <option value="">Select Beneficiary Type</option>
                                {beneficiaryTypes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Beneficiary Count *</label>
                            <input type="number" min="0" placeholder="e.g. 1500" name="beneficiary_count" required className="form-control" value={formData.beneficiary_count} onChange={handleChange} />
                        </div>
                    </div>

                    <h3 style={{color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.125rem'}}>NEED DETAILS</h3>
                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea name="description" required rows="5" className="form-control"
                            placeholder="Describe the CSR need, the problem faced by the community, and the support required."
                            value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group" style={{maxWidth: '300px'}}>
                        <label className="form-label">Urgency *</label>
                        <select name="urgency" required className="form-control" value={formData.urgency} onChange={handleChange}>
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                    </div>
                </div>
                
                <div className="card-header" style={{display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--background)'}}>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit CSR Need'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateCSRNeed;
