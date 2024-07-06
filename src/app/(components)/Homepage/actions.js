export async function fetchPost() {
  try {
    const res = await fetch("/api/post/fetch-posts", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId, token) {
  try {
    const res = await fetch(`/api/like/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log("liked post: ", data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
