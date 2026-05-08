const API_URL = "http://localhost:3000";

export async function loadFullGrade(id) {

  const response = await fetch(
    `${API_URL}/grades/${id}/full`
  );

  return response.json();
}