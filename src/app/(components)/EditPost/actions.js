export async function fetchPostByID(id, token) {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(formData, token, id) {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: "PUT",
      mode: "no-cors",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(token, id) {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: "DELETE",
      mode: "no-cors",
      headers: {
        "Content-type": "application/json",
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
