"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "./actions";
import { UploadButton } from "@/utils/uploadthing";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function CreateBlogPost() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleTitleFocus = () => {
    setIsTitleFocused(true);
  };

  const handleTitleBlur = () => {
    setTimeout(() => {
      setIsTitleFocused(false);
    }, 100);
  };

  const handleTextareaFocus = () => {
    setIsTextareaFocused(true);
  };

  const handleTextareaBlur = () => {
    setTimeout(() => {
      setIsTextareaFocused(false);
    }, 100);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: () => createPost(formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries("post");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
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
            onFocus={handleTitleFocus}
            onBlur={handleTitleBlur}
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
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <IconButton color="primary" component="label">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  console.log("Files: ", res);
                  setFormData({ ...formData, imageUrl: res[0].url });
                }}
                onUploadError={(error) => {
                  // Do something with the error.
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
  );
}

export default CreateBlogPost;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createPost } from "./actions";
// import { UploadButton } from "@/utils/uploadthing";
// import { TextField, Button, Box, Typography, IconButton } from "@mui/material";
// import styles from "./styles.module.css";
// import UploadFileIcon from "@mui/icons-material/UploadFile";

// function CreateBlogPost() {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     imageUrl: "",
//   });
//   const [isTitleFocused, setIsTitleFocused] = useState(false);
//   const [isTextareaFocused, setIsTextareaFocused] = useState(false);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setToken(localStorage.getItem("token"));
//     }
//   }, []);

//   const handleTitleFocus = () => {
//     setIsTitleFocused(true);
//   };

//   const handleTitleBlur = () => {
//     setTimeout(() => {
//       setIsTitleFocused(false);
//     }, 100);
//   };

//   const handleTextareaFocus = () => {
//     setIsTextareaFocused(true);
//   };

//   const handleTextareaBlur = () => {
//     setTimeout(() => {
//       setIsTextareaFocused(false);
//     }, 100);
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const mutation = useMutation({
//     mutationFn: () => createPost(formData, token),
//     onSuccess: () => {
//       queryClient.invalidateQueries("post");
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate();
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#2d3748",
//         p: 3,
//         borderRadius: 2,
//         marginBottom: 2,
//       }}
//     >
//       <form onSubmit={handleSubmit}>
//         <Typography variant="h6" color="white" gutterBottom>
//           Whats on your mind?
//         </Typography>
//         <TextField
//           fullWidth
//           label={isTextareaFocused ? "Blog title" : "Create a post"}
//           variant="outlined"
//           margin="normal"
//           name="title"
//           onChange={handleChange}
//           InputProps={{
//             style: { backgroundColor: "#4a5568", color: "white" },
//           }}
//           InputLabelProps={{
//             style: { color: "white" },
//           }}
//           onFocus={handleTitleFocus}
//           onBlur={handleTitleBlur}
//         />
//         {(isTitleFocused || isTextareaFocused) && (
//           <TextField
//             fullWidth
//             label="Write your post here..."
//             variant="outlined"
//             margin="normal"
//             name="content"
//             onChange={handleChange}
//             multiline
//             rows={4}
//             InputProps={{
//               style: { backgroundColor: "#4a5568", color: "white" },
//             }}
//             InputLabelProps={{
//               style: { color: "white" },
//             }}
//             onFocus={handleTextareaFocus}
//             onBlur={handleTextareaBlur}
//           />
//         )}
//         <Box mt={2} display="flex" justifyContent="space-between">
//           <IconButton color="primary" component="label">
//             <UploadFileIcon />
//             <UploadButton
//               endpoint="imageUploader"
//               onClientUploadComplete={(res) => {
//                 // Do something with the response
//                 console.log("Files: ", res);
//                 setFormData({ imageUrl: res[0].url });
//               }}
//               onUploadError={(error) => {
//                 // Do something with the error.
//                 alert(`ERROR! ${error.message}`);
//               }}
//             />
//             {formData.imageUrl.length ? (
//               <div>
//                 <img
//                   src={formData.imageUrl}
//                   alt="my image"
//                   className={styles.image}
//                 />
//               </div>
//             ) : null}
//             {/* <input hidden name="imageUrl" accept="image/*" type="file" /> */}
//           </IconButton>
//           <Button
//             disabled={mutation.isPending}
//             type="submit"
//             variant="contained"
//             color="primary"
//           >
//             Post
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// }

// export default CreateBlogPost;

// // import React, {useState} from "react";
// // import styles from "./styles.module.css";
// // import { TextField, Button, Box, Typography, IconButton } from "@mui/material";
// // import UploadFileIcon from "@mui/icons-material/UploadFile";

// // const CreatePost = () => {
// //   return (
// //     <Box
// //       sx={{
// //         backgroundColor: "primary.dark",
// //         p: 3,
// //         borderRadius: 2,
// //       }}
// //     >
// //       <Typography variant="h6" color="white" gutterBottom>
// //         Create a Blog Post
// //       </Typography>
// //       <TextField
// //         fullWidth
// //         label="Blog Post Title"
// //         variant="outlined"
// //         margin="normal"
// //         InputProps={{
// //           style: { backgroundColor: "#2E3B55", color: "white" },
// //         }}
// //         InputLabelProps={{
// //           style: { color: "white" },
// //         }}
// //       />
// //       <TextField
// //         fullWidth
// //         label="Write your post here..."
// //         variant="outlined"
// //         margin="normal"
// //         multiline
// //         rows={4}
// //         InputProps={{
// //           style: { backgroundColor: "#2E3B55", color: "white" },
// //         }}
// //         InputLabelProps={{
// //           style: { color: "white" },
// //         }}
// //       />
// //       <Box mt={2} display="flex" justifyContent="space-between">
// //         <IconButton color="primary" component="label">
// //           <UploadFileIcon />
// //           <input hidden accept="image/*" type="file" />
// //         </IconButton>
// //         <Button variant="contained" color="primary">
// //           Post
// //         </Button>
// //       </Box>
// //     </Box>
// //     // <div>
// //     //   <form>
// //     //     <div className={styles.createPostSection}>
// //     //       <h2 className={styles.createPostTitle}>Create a Blog Post</h2>
// //     //       <input
// //     //         className={styles.textarea}
// //     //         placeholder="Write your post here..."
// //     //       ></input>
// //     //       <button className={styles.postButton}>Post</button>
// //     //     </div>
// //     //   </form>
// //     // </div>
// //   );
// // };

// // export default CreatePost;
