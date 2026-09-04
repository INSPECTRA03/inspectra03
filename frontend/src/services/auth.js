export const getRole = () => localStorage.getItem('inspectra_role');
export const setRole = (role) => localStorage.setItem('inspectra_role', role);
export const clearRole = () => localStorage.removeItem('inspectra_role');

export const ROLE_CONFIGS = {
  CORPORATE_ADMIN: {
    label: "Corporate CSR Admin",
    user: "Enterprise Admin"
  },
  CSR_MANAGER: {
    label: "CSR Manager / Officer",
    user: "CSR Officer"
  },
  NGO_PARTNER: {
    label: "NGO Partner",
    user: "NGO Representative"
  }
};
