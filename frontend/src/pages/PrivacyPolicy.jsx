import React from 'react';
import { PageHeader } from '../components/UI';

const PrivacyPolicy = () => {
    return (
        <div className="animate-fade-in-up" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <PageHeader 
                title="Privacy Policy" 
                subtitle="How Inspectra collects, uses, stores, and protects information."
            />

            <div className="card mb-4" style={{ backgroundColor: '#fff3cd', borderColor: '#ffe69c' }}>
                <div className="card-body">
                    <strong>IMPORTANT LEGAL DISCLAIMER:</strong> This Privacy Policy is provided for the Inspectra prototype/hackathon application and should be reviewed and adapted for the final production deployment and applicable legal requirements. This document does not constitute legal advice.
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>1. Introduction</h3></div>
                <div className="card-body">
                    <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        Inspectra is a CSR technology platform designed to help organizations assess CSR needs, identify priorities, discover NGOs, match CSR needs with NGOs, generate explainable recommendations, and track CSR status. This policy outlines how information is handled within our prototype environment.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>2. Information We Collect</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p>We collect information directly entered into the platform to facilitate core workflows. This includes:</p>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                        <li><strong>User/account information:</strong> Configured prototype roles (Corporate CSR Admin, CSR Manager / Officer, NGO Partner).</li>
                        <li><strong>CSR need information:</strong> Details regarding CSR requirements, specifically: State, District, City/Locality, CSR category, Beneficiary type, Beneficiary count, CSR need description, and Urgency.</li>
                        <li><strong>NGO & CSR project information:</strong> Information describing NGO operations, sector alignment, locations, and historical project data. FAQs and organizational documents (such as Registration, 12A/80G, and Audited Financial Reports) may also be submitted. Please note these files may contain sensitive organizational and financial data.</li>
                        <li><strong>Application usage information:</strong> Basic metadata where technically collected by the platform infrastructure to operate features.</li>
                    </ul>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>3. How We Use Information</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p>Information collected is exclusively used within the platform to:</p>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                        <li>Create and manage CSR needs</li>
                        <li>Analyze CSR needs</li>
                        <li>Identify CSR priorities</li>
                        <li>Discover relevant NGOs</li>
                        <li>Calculate NGO matching scores</li>
                        <li>Generate explainable recommendations</li>
                        <li>Display CSR status and history</li>
                        <li>Provide dashboard information</li>
                        <li>Improve application functionality</li>
                    </ul>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>4. AI Processing</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p>Inspectra utilizes Gemini AI for specific AI-assisted workflows, including <strong>CSR need analysis</strong> and <strong>Explainable recommendation generation</strong>.</p>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', marginBottom: 0 }}>
                        <li>AI output is strictly generated from information supplied directly to the system.</li>
                        <li>AI recommendations act as decision-support insights and should be critically reviewed by users.</li>
                        <li>The AI does not make final funding, approval, or partnership decisions.</li>
                        <li>Inspectra does not guarantee that an NGO is suitable solely because of an AI-generated recommendation.</li>
                    </ul>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>5. NGO Matching</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p>NGO ranking is computed mathematically via the application's native deterministic matching engine. The current weighted factors are:</p>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        <li>Sector &mdash; 35%</li>
                        <li>Location &mdash; 30%</li>
                        <li>Beneficiary &mdash; 20%</li>
                        <li>Experience &mdash; 15%</li>
                    </ul>
                    <p style={{ margin: 0 }}>The match score acts exclusively as a decision-support signal and is not a definitive guarantee of NGO suitability or compliance.</p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>6. Data Storage</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Application data is persisted standardly using the application's configured database infrastructure. This is a prototype application; users should not submit live sensitive data into the platform.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>7. Data Sharing</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Inspectra does not sell or share data with advertisers or arbitrary third parties. For AI processing, information submitted specifically for AI-assisted functionality is processed securely through the configured AI service in order to compute analysis and generate recommendations.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>8. Data Security</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Reasonable technical measures are utilized to protect application information. However, no internet-based system can guarantee absolute security. Proceed with discretion appropriate for a prototype-tier technology platform.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>9. User Choices</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Users possess full control over terminating their localized sessions smoothly via the secure Logout feature provided natively within the application interface.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>10. Data Retention</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Retention periods depend strictly on the application's current storage constraints and operational requirements. No formal deletion policy operates autonomously during this prototype phase.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>11. Children's Privacy</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Inspectra is strictly intended for organizational/CSR usage and is not designed for children.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>12. External Services</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Inspectra integrates strictly alongside the configured Gemini AI framework to generate dynamic insights supporting analysis functionality.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>13. Changes to This Privacy Policy</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        This policy may be updated systematically whenever the application's codebase, functionality, or data practices expand.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>14. Contact</h3></div>
                <div className="card-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        Contact information will be provided by the Inspectra team.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
