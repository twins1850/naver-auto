import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8001";

export async function issueLicense({
  user_id,
  plan = "basic",
  status = "active",
  expire_at,
}: {
  user_id: number;
  plan?: string;
  status?: string;
  expire_at?: string;
}) {
  const res = await axios.post(`${API_BASE}/licenses`, {
    user_id,
    plan,
    status,
    expire_at,
  });
  return res.data;
}

export async function getLicenses() {
  const res = await axios.get(`${API_BASE}/licenses`);
  return res.data;
}

export async function updateLicense({
  id,
  status,
  expire_at,
}: {
  id: number;
  status?: string;
  expire_at?: string;
}) {
  const res = await axios.patch(`${API_BASE}/licenses/${id}`, {
    status,
    expire_at,
  });
  return res.data;
}

export async function getLicenseDetail(id: number) {
  const res = await axios.get(`${API_BASE}/licenses/${id}`);
  return res.data;
}

export async function validateLicense({
  token,
  version,
  hardware_id,
}: {
  token: string;
  version: string;
  hardware_id: string;
}) {
  const res = await axios.post(`${API_BASE}/licenses/validate`, {
    token,
    version,
    hardware_id,
  });
  return res.data;
}
