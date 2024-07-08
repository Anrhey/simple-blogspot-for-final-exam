"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActions,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileCard from "../Profile/ProfileCard";
import { UploadButton } from "../../../utils/uploadthing";
import SearchPosts from "../SearchPost/SearchPost";
import { likePost, fetchPost } from "./actions";
import { createPost } from "../CreatePost/actions";
import Link from "next/link";

const Homepage = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPost(),
  });

  const [currentLikePostId, setCurrentLikePostId] = useState(null);
  const [creatingPost, setCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState(null);

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      await likePost(postId, token);
    },
    onMutate: (postId) => {
      setCurrentLikePostId(postId);
    },
    onSettled: () => {
      setCurrentLikePostId(null);
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleLikeToggle = async (postId) => {
    await likeMutation.mutateAsync(postId);
  };

  const renderLikeButton = (post) => {
    const userLike = post?.likes?.find(
      (like) => like?.userId === parseInt(token)
    );

    return (
      <IconButton
        onClick={() => handleLikeToggle(post?.postId)}
        aria-label={userLike && userLike?.isLiked ? "unlike" : "like"}
        color="primary"
        size="medium"
      >
        <Tooltip
          title={userLike && userLike?.isLiked ? "Unlike" : "Like"}
          placement="top"
        >
          {currentLikePostId === post?.postId ? (
            <CircularProgress size={24} />
          ) : userLike && userLike?.isLiked ? (
            <ThumbDown />
          ) : (
            <ThumbUp />
          )}
          {post?.likes?.filter((like) => like?.isLiked).length}
        </Tooltip>
      </IconButton>
    );
  };

  // Create post
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: () => createPost(formData, token),
    onMutate: () => {
      setCreatingPost(true);
    },
    onSuccess: (newPostData) => {
      queryClient.invalidateQueries("posts");
      setCreatingPost(false);
      setNewPost(newPostData);
      setTimeout(() => setNewPost(null), 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading posts</div>;

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <ProfileCard />
          </Grid>

          {/* Main Content Section */}
          <Grid item xs={12} md={8}>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                mb: 4,
              }}
            >
              <SearchPosts />
            </Paper>

            <Card sx={{ mb: 4, backgroundColor: "#2d3748", color: "white" }}>
              <CardHeader
                title="Create a Blog Post"
                titleTypographyProps={{ variant: "h6", color: "white" }}
              />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Blog Title"
                    variant="outlined"
                    margin="normal"
                    name="title"
                    onChange={handleChange}
                    InputProps={{
                      style: { backgroundColor: "#4a5568", color: "white" },
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Write your post here..."
                    variant="outlined"
                    margin="normal"
                    name="content"
                    onChange={handleChange}
                    multiline
                    rows={4}
                    InputProps={{
                      style: { backgroundColor: "#4a5568", color: "white" },
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                  />
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <IconButton color="primary" component="label">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          setFormData({ ...formData, imageUrl: res[0].url });
                        }}
                        onUploadError={(error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                      {formData.imageUrl.length ? (
                        <img
                          src={formData.imageUrl}
                          alt="Uploaded"
                          style={{
                            maxHeight: "200px",
                            borderRadius: "8px",
                            marginTop: "10px",
                          }}
                        />
                      ) : null}
                    </IconButton>
                    <Button
                      disabled={mutation.isPending}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Post
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>

            {/* Blog Posts */}
            <Box sx={{ mt: 4 }}>
              {creatingPost && (
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 200,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </CardContent>
                </Card>
              )}
              {newPost && (
                <Card key={newPost?.postId} sx={{ mb: 4 }}>
                  <Link href={`/ViewPost/${newPost?.postId}`} passHref>
                    <CardHeader
                      avatar={<Avatar src={newPost?.author?.profileImage} />}
                      title={newPost?.author?.name}
                      subheader={new Date(
                        newPost?.createdAt
                      ).toLocaleDateString()}
                    />
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {truncateContent(newPost?.title, 150)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {truncateContent(newPost?.content, 250)}
                      </Typography>
                    </CardContent>
                  </Link>
                  {newPost?.imageUrl && (
                    <CardMedia
                      component="img"
                      height="194"
                      image={newPost?.imageUrl}
                      alt={newPost?.title}
                      sx={{
                        padding: 1,
                      }}
                    />
                  )}

                  <CardActions disableSpacing>
                    {renderLikeButton(newPost)}
                    <Button size="small" color="primary">
                      {newPost?.comments?.length} Comments
                    </Button>
                  </CardActions>
                </Card>
              )}
              {data
                ?.slice()
                .reverse()
                .map((post, index) => (
                  <Card key={index} sx={{ mb: 4 }}>
                    <Link href={`/ViewPost/${post?.postId}`} passHref>
                      <CardHeader
                        avatar={<Avatar src={post?.author?.profileImage} />}
                        title={post?.author?.name}
                        // subheader={new Date(
                        //   post?.createdAt
                        // ).toLocaleDateString()}
                      />
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {truncateContent(post?.title, 150)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {truncateContent(post?.content, 250)}
                        </Typography>
                      </CardContent>
                    </Link>
                    {post?.imageUrl && (
                      <CardMedia
                        component="img"
                        height="194"
                        image={post?.imageUrl}
                        alt={post?.title}
                        sx={{
                          padding: 1,
                        }}
                      />
                    )}

                    <CardActions disableSpacing>
                      {renderLikeButton(post)}
                      <Button size="small" color="primary">
                        {post?.comments?.length} Comments
                      </Button>
                    </CardActions>
                  </Card>
                ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Homepage;
