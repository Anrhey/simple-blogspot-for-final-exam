"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UploadButton } from "../../../utils/uploadthing";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import styles from "./styles.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { updatePost, fetchPostByID } from "./actions";

function EditPost() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const { id } = useParams();
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  console.log("token from edit post", token);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPostByID(id, token),
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data?.title || "",
        content: data?.content || "",
        imageUrl: data?.imageUrl || "",
      });
    }
  }, [data]);

  console.log(data);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: () => updatePost(formData, token, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setSuccessMessage(true);
      router.push(`/profile-feed`);
    },
  });

  const handleSubmit = (e) => {
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
        <Box
          sx={{
            backgroundColor: "#2d3748",
            p: 3,
            borderRadius: 2,
            marginBottom: 2,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" color="white" gutterBottom>
              <Link href={"/profile-feed"}>Go back</Link>
            </Typography>
            <TextField
              fullWidth
              label={"Blog title"}
              variant="outlined"
              margin="normal"
              name="title"
              value={formData.title}
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
              value={formData.content}
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
                <UploadFileIcon />
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    setFormData({ imageUrl: res[0].url });
                  }}
                  onUploadError={(error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                {formData.imageUrl.length ? (
                  <div>
                    <img
                      src={formData.imageUrl}
                      alt="my image"
                      className={styles.image}
                      value={formData.imageUrl}
                    />
                  </div>
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
          <Snackbar
            open={successMessage}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage(false)}
          >
            <Alert
              onClose={() => setSuccessMessage(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Post updated successfully!
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
}

export default EditPost;
