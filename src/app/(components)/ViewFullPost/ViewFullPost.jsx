"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Avatar,
  CardHeader,
  CardMedia,
  Divider,
} from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchViewPost, addComment } from "./actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ViewFullPost = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    comment_content: "",
    postId: id,
  });
  const [token, setToken] = useState(null);
  const queryClient = useQueryClient();

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: () => addComment(token, formData, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["viewedPost"]);
      setFormData({ ...formData, comment_content: "" });
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["viewedPost"],
    queryFn: () => fetchViewPost(id),
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []); // Run this effect only once on mount

  useEffect(() => {
    if (token === null) return; // Wait for the token to be set

    if (!token) {
      router.push("/login");
    }
  }, [router, token]); // Run this effect whenever the router or token changes

  if (token === null && isLoading) {
    router.push("/login"); // Show a loading spinner while checking the token
  }

  return (
    <>
      {!token ? (
        <div>No token received Please login</div>
      ) : (
        <Box sx={{ mt: 4, margin: 2 }}>
          <Link href={"/homepage"} passHref>
            <Button variant="contained" color="primary" sx={{ mb: 2 }}>
              Go Back
            </Button>
          </Link>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              avatar={<Avatar src={data?.author?.profileImage} />}
              title={data?.author?.name}
              // subheader={new Date(data?.createdAt).toLocaleDateString()}
            />
            <CardContent>
              <Typography variant="h5">
                {data?.title?.length
                  ? data?.title
                  : "No Title provided for this post"}
              </Typography>
              <Typography variant="body1">
                {data?.content?.length
                  ? data?.content
                  : "No Content for this post"}
              </Typography>
              {data?.imageUrl && (
                <CardMedia
                  component="img"
                  height="194"
                  image={data?.imageUrl}
                  alt="Post Image"
                  sx={{ mt: 2, borderRadius: 1 }}
                />
              )}
              <Typography variant="body1" sx={{ mt: 2 }}>
                {data?.likes?.length} {"Like(s)"}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Comments - {data?.comments?.length}
              </Typography>
              <form onSubmit={handleCommentSubmit}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Add a comment"
                  value={formData.comment_content}
                  name="comment_content"
                  onChange={handleChange}
                  sx={{ mt: 2, mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </form>
              <Divider sx={{ my: 2 }} />
              {data?.comments?.map((comment, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}
                >
                  <Avatar src={comment?.author?.profileImage} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {comment?.author?.name}
                    </Typography>
                    <Typography variant="body2">
                      {comment?.comment_content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default ViewFullPost;
