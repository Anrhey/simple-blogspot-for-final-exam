export async function fetchViewPost(id) {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: "GET",
      mode: "no-cors",
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function addComment(token, formData, id) {
  try {
    const res = await fetch(`/api/post/${id}/comment`, {
      method: "POST",
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

export async function fetchComments(token, id) {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: "GET",
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
