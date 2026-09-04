import React, { useEffect, useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, LoadingState, ErrorState, Skeleton, SkeletonCard, StatusBadge, EmptyState } from '../components/UI';

import { useParams } from 'react-router-dom';
import { fetchNGO, fetchCSRProjects, fetchNGODocuments, uploadNGODocument, downloadDocumentUrl } from '../services/api';

import { getRole } from '../services/auth';
import { FileUp, File, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const NGODetail = () => {
    const { id } = useParams();
    const [ngo, setNgo] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [uploadingType, setUploadingType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const role = getRole();


    useEffect(() => {
        async function load() {
            try {
                const ngoData = await fetchNGO(id);
                setNgo(ngoData);
                                const projectsData = await fetchCSRProjects({ ngo_name: ngoData.name });
                setProjects(projectsData);
                const docsData = await fetchNGODocuments(id);
                setDocuments(docsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    
    const handleFileSelect = (type, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingType(type);
        setSelectedFile(file);
        setUploadError(null);
        setUploadSuccess(null);
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile || !uploadingType) return;
        
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setUploadError('Unsupported file type. Only PDF and images are allowed.');
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            setUploadError('File too large. Maximum size is 10MB.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        
        try {
            await uploadNGODocument(id, uploadingType, selectedFile);
            setUploadSuccess(`${uploadingType} successfully uploaded.`);
            const refreshedDocs = await fetchNGODocuments(id);
            setDocuments(refreshedDocs);
            setSelectedFile(null);
            setUploadingType(null);
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

if (loading) return <div className="page-container"><LoadingState /></div>;
if (error) return <div className="page-container animate-fade-in-up"><ErrorState message={error} /></div>;
if (!ngo) return <div className="page-container animate-fade-in-up"><ErrorState message="NGO not found" /></div>;

    return (
        <div className="animate-fade-in-up" style={{maxWidth: '900px'}}>
            <PageHeader title={ngo.name} />

                        <div className="form-grid mb-4">
                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{margin: 0}}>Overall Status</h3></div>
                    <div className="card-body">
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)'}}>
                            <span className="text-muted" style={{fontWeight: 500}}>Match Score</span>
                            <strong style={{color: 'var(--primary)'}}>92%</strong>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)'}}>
                            <span className="text-muted" style={{fontWeight: 500}}>Risk Score</span>
                            <strong>18/100</strong>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span className="text-muted" style={{fontWeight: 500}}>Verification Status</span>
                            <span style={{color: '#d97706', fontWeight: 600, background: '#fef3c7', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem'}}>Review Recommended</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{margin: 0}}>Risk & Verification</h3></div>
                    <div className="card-body">
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span style={{color: 'var(--text-primary)', fontSize: '0.875rem'}}>Sector consistency</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span style={{color: 'var(--text-primary)', fontSize: '0.875rem'}}>Location consistency</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span style={{color: 'var(--text-primary)', fontSize: '0.875rem'}}>Project history found</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                <span style={{color: 'var(--text-primary)', fontSize: '0.875rem'}}>Registration information requires review</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span style={{color: 'var(--text-primary)', fontSize: '0.875rem'}}>Data completeness</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="card mb-4 animate-fade-in-up">
                <div className="card-header"><h3 className="card-title" style={{margin: 0}}>Documents & Verification</h3></div>
                <div className="card-body">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        Submit organizational documents to support CSR partner evaluation.
                        <br />
                        <em>Document submission indicates that information has been provided to Inspectra. It does not by itself confirm authenticity, legal validity, or regulatory compliance.</em>
                    </p>

                    {/* Verification Summary */}
                    {(() => {
                        const requiredTypes = ['Registration Certificate', '12A / 12AB Certificate', '80G Certificate', 'CSR-1 Registration', 'Audited Financial Reports'];
                        const submittedCount = documents.length;
                        const verifiedCount = documents.filter(d => d.status === 'VERIFIED').length;
                        const attentionCount = documents.filter(d => d.status === 'REQUIRES_ATTENTION').length;

                        return (
                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: 600 }}>Document Verification</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Submitted: <strong style={{color: 'var(--primary)'}}>{submittedCount} / 5</strong></div>
                                <div style={{ color: 'var(--text-secondary)' }}>Verified: <strong style={{color: 'var(--success)'}}>{verifiedCount} / 5</strong></div>
                                <div style={{ color: 'var(--text-secondary)' }}>Requires Attention: <strong style={{color: '#d97706'}}>{attentionCount}</strong></div>
                            </div>
                        );
                    })()}

                    {/* Document List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Registration Certificate', '12A / 12AB Certificate', '80G Certificate', 'CSR-1 Registration', 'Audited Financial Reports', 'Other Supporting Documents'].map((docType) => {
                            const existingDoc = documents.find(d => d.document_type === docType);
                            const isSelectedForUpload = uploadingType === docType && selectedFile;
                            return (
                                <div key={docType} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{docType}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Status: 
                                            <span style={{ 
                                                fontWeight: 600, 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.25rem',
                                                color: !existingDoc ? 'var(--text-secondary)' : 
                                                       existingDoc.status === 'VERIFIED' ? 'var(--success)' : 
                                                       existingDoc.status === 'REQUIRES_ATTENTION' ? '#d97706' : 
                                                       existingDoc.status === 'UNDER_REVIEW' ? 'var(--primary)' : 'var(--text-primary)'
                                            }}>
                                                {!existingDoc ? 'Not Submitted' : existingDoc.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        {existingDoc && (
                                            <a href={downloadDocumentUrl(existingDoc.id)} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', textDecoration: 'none' }}>
                                                <File size={16} /> View Document
                                            </a>
                                        )}
                                        {role === 'NGO_PARTNER' && (
                                            <>
                                                {/* Hidden File Input */}
                                                <input type="file" id={`file-upload-${docType}`} accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={(e) => handleFileSelect(docType, e)} />
                                                <label htmlFor={`file-upload-${docType}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', cursor: 'pointer', margin: 0 }}>
                                                    {existingDoc ? 'Replace' : 'Upload Document'}
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Upload Modal Payload */}
                    {uploadingType && selectedFile && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>Uploading {uploadingType}</strong>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Maximum file size: 10MB</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button variant="secondary" onClick={() => { setSelectedFile(null); setUploadingType(null); setUploadError(null); }}>Cancel</Button>
                                    <Button variant="primary" onClick={handleUploadSubmit} disabled={isUploading}>{isUploading ? 'Uploading...' : 'Confirm Upload'}</Button>
                                </div>
                            </div>
                            {uploadError && <div style={{ color: '#ef4444', marginTop: '0.75rem', fontSize: '0.875rem' }}>{uploadError}</div>}
                        </div>
                    )}
                    {uploadSuccess && <div style={{ color: 'var(--success)', marginTop: '1rem', fontSize: '0.875rem', padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>{uploadSuccess}</div>}
                </div>
            </div>

            <div className="card mb-4" style={{borderLeft: '4px solid #d97706'}}>
                <div className="card-header"><h3 className="card-title" style={{margin: 0}}>Potential Risk Indicators</h3></div>
                <div className="card-body" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d97706'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span style={{color: 'var(--text-primary)'}}><strong>1 indicator detected</strong></span>
                    </div>
                    <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.875rem'}}>View Verification Details</button>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{margin: 0}}>About</h3></div>
                <div className="card-body">
                    <p style={{marginBottom: '1.5rem'}}>{ngo.description}</p>
                    <div className="form-grid">
                        <div>
                            <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Sectors</span>
                            <strong>{(ngo.sectors || "").replace(/\|/g, ', ')}</strong>
                        </div>
                        <div>
                            <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Locations</span>
                            <strong>{(ngo.locations || "").replace(/\|/g, ', ')}</strong>
                        </div>
                        <div>
                            <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Beneficiary Types</span>
                            <strong>{(ngo.beneficiary_types || "").replace(/\|/g, ', ')}</strong>
                        </div>
                        <div>
                            <span className="text-muted" style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Experience</span>
                            <strong>{ngo.experience} years</strong>
                        </div>
                    </div>
                </div>
            </div>

            {projects.length > 0 && (
                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{margin: 0}}>Related CSR Projects</h3></div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Company</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map(p => (
                                    <tr key={p.id}>
                                        <td className="text-muted">{p.year}</td>
                                        <td style={{fontWeight: 500}}>{p.company}</td>
                                        <td>{p.category}</td>
                                        <td>{p.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NGODetail;
