export async function searchPost(query) {
  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      mode: "no-cors",
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
