const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
