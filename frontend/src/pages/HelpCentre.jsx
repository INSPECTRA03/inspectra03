import React, { useState } from 'react';
import { PageHeader } from '../components/UI';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
    {
        question: "How NGO Document Submission Works",
        answer: "1. Select document type (e.g. 12A, 80G, CSR-1). 2. Upload the document via your NGO Profile. 3. Inspectra securely records the submission. 4. Document status can be reviewed instantly (e.g. SUBMITTED). 5. Legal Verification, if supported by the deployment, is a separate downstream process."
    },
    {
        question: "How does AI CSR Analysis work?",
        answer: "The platform uses Google Gemini AI to analyze your raw CSR need description and automatically categorize the requirement, identify target beneficiary groups, and suggest the most effective interventions. This analysis strictly operates on the data you provide."
    },
    {
        question: "How are NGOs matched?",
        answer: "Our matching engine evaluates all available NGOs in the system against your analyzed CSR need based on four strict parameters: Sector alignment (35%), Location overlap (30%), Target Beneficiary match (20%), and Operational Experience (15%)."
    },
    {
        question: "What does the Priority Assessment do?",
        answer: "The platform evaluates the scale of the need, the vulnerability of the targeted beneficiaries, and the stated urgency to output an objective HIGH, MEDIUM, or LOW priority score. This helps CSR Managers triage incoming requirements efficiently."
    },
    {
        question: "How are the Explainable Recommendations generated?",
        answer: "Once NGOs are ranked, the AI engine reviews the profiles of the top matches against your specific CSR need and generates a transparent summary outlining why they were matched, key strengths they offer, and potential capacity limits to consider."
    },
    {
        question: "How does Status Tracking work?",
        answer: "A CSR need moves logically through a structured lifecycle: Need Identified ? AI Assessment ? Prioritized ? Matched ? Recommended. Our dashboard and status timeline track exactly when each phase was completed."
    }
];

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', backgroundColor: 'var(--surface)' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', textAlign: 'left' }}
                className="card-hover-effect"
            >
                {question}
                {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
            </button>
            {isOpen && (
                <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, animation: 'fadeIn 0.2s forwards' }}>
                    {answer}
                </div>
            )}
        </div>
    );
};

const HelpCentre = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFaqs = FAQS.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up" style={{ maxWidth: '800px' }}>
            <PageHeader 
                title="Help Centre" 
                subtitle="Frequently asked questions and guides for using the Inspectra platform."
            />

            <div className="card mb-4">
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input 
                        type="text" 
                        placeholder="Search for answers..." 
                        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', color: 'var(--text-primary)' }} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, idx) => <FAQItem key={idx} question={faq.question} answer={faq.answer} />)
                ) : (
                    <div className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                        No results found for "{searchTerm}".
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpCentre;
