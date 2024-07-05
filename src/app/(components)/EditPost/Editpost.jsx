"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UploadButton } from "@/utils/uploadthing";
import { TextField, Button, Box, Typography, IconButton } from "@mui/material";
import styles from "./styles.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { updatePost, fetchPostByID, deletePost } from "./actions";

function EditPost() {
  //   const [token, setToken] = useState(null);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const { id } = useParams();
  const router = useRouter();

  //   useEffect(() => {
  //     if (typeof window !== "undefined") {
  //       setToken(localStorage.getItem("token"));
  //     }
  //   }, []);

  const token = localStorage.getItem("token");
  console.log("token from edit post", token);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPostByID(id, token),
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        content: data.content || "",
        imageUrl: data.imageUrl || "",
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
      queryClient.invalidateQueries("post");
      router.push("/profile-feed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
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
                // Do something with the response
                console.log("Files: ", res);
                setFormData({ imageUrl: res[0].url });
              }}
              onUploadError={(error) => {
                // Do something with the error.
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
            {/* <input hidden name="imageUrl" accept="image/*" type="file" /> */}
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
    </Box>
  );
}

export default EditPost;
