"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "./actions";
import { UploadButton } from "../../../utils/uploadthing";
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
  Snackbar,
  Alert,
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
  const [successMessage, setSuccessMessage] = useState(false);

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
      queryClient.invalidateQueries(["posts"]);
      setSuccessMessage(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (mutation.isPending) return <div>Loading...</div>;

  return (
    <>
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
          Post created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateBlogPost;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createPost } from "./actions";
// import { UploadButton } from "@/utils/uploadthing";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   Card,
//   CardContent,
//   CardActions,
//   CardHeader,
//   Avatar,
// } from "@mui/material";
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
//     <Card sx={{ mb: 4, backgroundColor: "#2d3748", color: "white" }}>
//       <CardHeader
//         title="Create a Blog Post"
//         titleTypographyProps={{ variant: "h6", color: "white" }}
//       />
//       <CardContent>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Blog Title"
//             variant="outlined"
//             margin="normal"
//             name="title"
//             onChange={handleChange}
//             InputProps={{
//               style: { backgroundColor: "#4a5568", color: "white" },
//             }}
//             InputLabelProps={{
//               style: { color: "white" },
//             }}
//             onFocus={handleTitleFocus}
//             onBlur={handleTitleBlur}
//           />
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
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <IconButton color="primary" component="label">
//               <UploadButton
//                 endpoint="imageUploader"
//                 onClientUploadComplete={(res) => {
//                   // Do something with the response
//                   console.log("Files: ", res);
//                   setFormData({ ...formData, imageUrl: res[0].url });
//                 }}
//                 onUploadError={(error) => {
//                   // Do something with the error.
//                   alert(`ERROR! ${error.message}`);
//                 }}
//               />
//               {formData.imageUrl.length ? (
//                 <img
//                   src={formData.imageUrl}
//                   alt="Uploaded"
//                   style={{
//                     maxHeight: "200px",
//                     borderRadius: "8px",
//                     marginTop: "10px",
//                   }}
//                 />
//               ) : null}
//             </IconButton>
//             <Button
//               disabled={mutation.isPending}
//               type="submit"
//               variant="contained"
//               color="primary"
//             >
//               Post
//             </Button>
//           </Box>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

// export default CreateBlogPost;
