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
} from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchViewPost, addComment, fetchComments } from "./actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ViewFullPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    comment_content: "",
    postId: id,
  });
  const [token, setToken] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: () => addComment(token, formData, id),
    onSuccess: () => {
      queryClient.invalidateQueries("viewedPost");
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

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Link href={"/homepage"}>Go Back</Link>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5">
            {data.title.length ? (
              data.title
            ) : (
              <div>No Title provided for this post</div>
            )}
          </Typography>
          <Typography variant="body1">Posted by: {data.author.name}</Typography>
          <Typography variant="subtitle2">
            {data.content.length ? (
              data.content
            ) : (
              <div>No Content for this post</div>
            )}
          </Typography>

          {data.imageUrl.length ? (
            <img src={data.imageUrl} alt="image" />
          ) : (
            <div>No image for this post</div>
          )}
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">
            Comments - {data.comments.length}
          </Typography>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              variant="outlined"
              fullWidth
              label="Add a comment"
              //   value={formData.commentContent}
              name="comment_content"
              onChange={handleChange}
              sx={{ mt: 2, mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              //   disabled={commentLoading}
            >
              {"Submit"}
            </Button>
          </form>
          {data.comments.map((comment, index) => (
            <Box key={index} sx={{ mt: 2, mb: 2 }}>
              <Avatar src={comment.author.imageUrl} />
              {comment.author.name}
              <Typography variant="body2">{comment.comment_content}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewFullPost;
