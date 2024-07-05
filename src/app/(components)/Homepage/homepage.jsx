"use client";

import React, { useEffect, useState } from "react";
import { IoIosLogOut, IoIosHome, IoIosSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import {
  Box,
  Container,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../Profile/ProfileCard"; // Assume this is your previously created ProfileCard component
import CreatePost from "../CreatePost/createpost"; // Assume this is your previously created CreatePost component

const Homepage = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const [posts, setPosts] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await fetch("/api/post/fetch-posts", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      setPosts(data);
      return data;
    },
  });

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
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for post..."
              />
            </Paper>

            <CreatePost />

            {/* Blog Posts */}
            <Box sx={{ mt: 4 }}>
              {posts
                .slice()
                .reverse()
                .map((post, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Avatar />
                    <Typography variant="h5">{post.author.name}</Typography>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body1">{post.content}</Typography>
                    {post.imageUrl.length ? (
                      <Box sx={{ mt: 2 }}>
                        <img
                          src={post.imageUrl}
                          alt="image"
                          style={{ maxWidth: "100%", borderRadius: 4 }}
                        />
                      </Box>
                    ) : null}
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Likes here</Typography>
                      <Typography variant="body2">Comments here</Typography>
                    </Box>
                  </Paper>
                ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Homepage;
