const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

export async function fetchCSRNeeds() {
    const response = await fetch(`${API_BASE}/api/csr-needs`);
    if (!response.ok) throw new Error('Failed to fetch CSR Needs');
    return await response.json();
}

export async function fetchCSRNeed(id) {
    const response = await fetch(`${API_BASE}/api/csr-needs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch CSR Need');
    return await response.json();
}

export async function createCSRNeed(data) {
    const response = await fetch(`${API_BASE}/api/csr-needs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create CSR Need');
    }
    return await response.json();
}

export async function analyzeCSRNeed(csr_need_id) {
    const response = await fetch(`${API_BASE}/api/ai/analyze-need`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csr_need_id }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to perform AI analysis');
    }
    return await response.json();
}

export async function assessCSRNeedPriority(id) {
    const response = await fetch(`${API_BASE}/api/csr-needs/${id}/priority`, {
        method: 'POST',
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to assess priority');
    }
    return await response.json();
}

export async function fetchNGOs(search = '', sector = '', location = '', beneficiary_type = '') {
    let url = `${API_BASE}/api/ngos`;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sector) params.append('sector', sector);
    if (location) params.append('location', location);
    if (beneficiary_type) params.append('beneficiary_type', beneficiary_type);
    if (params.toString()) {
        url += '?' + params.toString();
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch NGOs');
    return await response.json();
}

export async function fetchNGO(id) {
    const response = await fetch(`${API_BASE}/api/ngos/${id}`);
    if (!response.ok) throw new Error('Failed to fetch NGO details');
    return await response.json();
}

export async function fetchCSRProjects(ngo_id = '') {
    let url = `${API_BASE}/api/csr-projects`;
    const params = new URLSearchParams();
    if (ngo_id) params.append('ngo_id', ngo_id);
    if (params.toString()) {
        url += '?' + params.toString();
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch CSR Projects');
    return await response.json();
}

export async function fetchLocations() {
    const response = await fetch(`${API_BASE}/api/locations`);
    if (!response.ok) throw new Error('Failed to fetch Locations');
    return await response.json();
}

export async function generateMatches(csrNeedId) {
    const response = await fetch(`${API_BASE}/api/csr-needs/${csrNeedId}/matches`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to generate matches');
    return await response.json();
}

export async function getMatches(csrNeedId) {
    const response = await fetch(`${API_BASE}/api/csr-needs/${csrNeedId}/matches`);
    if (!response.ok) {
        if (response.status === 404) return { matches: [] };
        throw new Error('Failed to fetch matches');
    }
    return await response.json();
}

export async function generateRecommendations(csrNeedId) {
    const response = await fetch(`${API_BASE}/api/csr-needs/${csrNeedId}/recommendations`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to generate explanations');
    return await response.json();
}

export async function getRecommendations(csrNeedId) {
    const response = await fetch(`${API_BASE}/api/csr-needs/${csrNeedId}/recommendations`);
    if (!response.ok) {
        if (response.status === 404) return { recommendations: [] };
        throw new Error('Failed to fetch recommendations');
    }
    return await response.json();
}

export async function getStatusHistory(csrNeedId) {
    const response = await fetch(`${API_BASE}/api/csr-needs/${csrNeedId}/status-history`);
    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch status history');
    }
    return await response.json();
}

export async function getDashboardSummary() {
    const response = await fetch(`${API_BASE}/api/dashboard/summary`);
    if (!response.ok) throw new Error('Failed to fetch dashboard summary');
    return await response.json();
}
export async function getGlobalRecommendations() {
    const response = await fetch(`${API_BASE}/api/recommendations`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    return await response.json();
}


export const fetchNGODocuments = async (ngoId) => {
    const res = await fetch(`${API_BASE}/api/ngos/${ngoId}/documents`);
    if (!res.ok) throw new Error('Failed to fetch NGO documents');
    return res.json();
};

export const uploadNGODocument = async (ngoId, documentType, file) => {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE}/api/ngos/${ngoId}/documents`, {
        method: 'POST',
        body: formData,
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to upload document');
    }
    return res.json();
};

export const downloadDocumentUrl = (docId) => `${API_BASE}/api/documents/download/${docId}`;
