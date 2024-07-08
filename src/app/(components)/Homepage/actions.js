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

export const likePost = async (postId, token) => {
  const res = await fetch(`/api/post/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to like post");
  }

  return await res.json();
};
