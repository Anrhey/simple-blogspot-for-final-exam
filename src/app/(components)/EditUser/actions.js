export async function fetchUser(id, token) {
  try {
    const res = await fetch(`/api/fetch-current-user/${id}`, {
      method: "GET",
      headers: {
        // "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(id, token, formData) {
  const res = await fetch(`/api/edit-user/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  console.log(data);
  return data;
}
