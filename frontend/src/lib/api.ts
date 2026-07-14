const API_URL = "http://localhost:8080/api";

// ---------------- Incident APIs ----------------

export async function getIncidents() {
  const response = await fetch(`${API_URL}/incidents`);
  if (!response.ok) throw new Error("Failed to fetch incidents");
  return response.json();
}

export async function createIncident(data: any) {
  const response = await fetch(`${API_URL}/incidents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create incident");

  return response.json();
}

export async function deleteIncident(id: string) {
  const response = await fetch(`${API_URL}/incidents/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete incident");
}

export async function updateIncident(id: string, data: any) {
  const response = await fetch(`${API_URL}/incidents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update incident");

  return response.json();
}

// ---------------- Dashboard ----------------

export async function getDashboard() {
  const response = await fetch(`${API_URL}/dashboard/stats`);

  if (!response.ok) throw new Error("Failed to load dashboard");

  return response.json();
}

