import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";

const SearchPosts = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue === "") {
      setData([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/post/fetch-posts", {
        method: "GET",
      });

      const data = await res.json();
      console.log(data);

      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Box sx={{ mt: 4, width: "100%", padding: 1 }}>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          width: "100%",
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          label="Search posts by title or content"
          value={value}
          onChange={handleChange}
        />
      </Box>
      <Box>
        {loading && <CircularProgress />}
        {value &&
          data
            .filter(
              (item) =>
                item.title.toLowerCase().includes(value.toLowerCase()) ||
                item.content.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 5)
            .map((item) => (
              <Card key={item.postId} sx={{ mb: 2 }}>
                <Link href={`/ViewPost/${item.postId}`} passHref>
                  <MuiLink underline="none">
                    <CardContent>
                      <Typography variant="h5">
                        {item.title.length ? (
                          truncateContent(item.title, 50)
                        ) : (
                          <div>No Title provided for this post</div>
                        )}
                      </Typography>
                      <Typography variant="body1">
                        Posted by: {item.author.name}
                      </Typography>
                      <Typography variant="subtitle2">
                        {item.content.length ? (
                          truncateContent(item.content, 50)
                        ) : (
                          <div>No Content for this post</div>
                        )}
                      </Typography>
                    </CardContent>
                  </MuiLink>
                </Link>
              </Card>
            ))}
      </Box>
    </Box>
  );
};

export default SearchPosts;

// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import Link from "next/link";

// const SearchPosts = () => {
//   const [value, setValue] = useState("");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleChange = async (e) => {
//     const inputValue = e.target.value;
//     setValue(inputValue);

//     if (inputValue === "") {
//       setData([]);
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/post/fetch-posts", {
//         method: "GET",
//       });

//       const data = await res.json();
//       console.log(data);

//       setData(data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const truncateContent = (content, maxLength) => {
//     if (content.length <= maxLength) return content;
//     return content.substring(0, maxLength) + "...";
//   };

//   return (
//     <Box sx={{ mt: 4, width: "100%", padding: 1 }}>
//       <Box
//         component="form"
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           mb: 4,
//           width: "100%",
//         }}
//       >
//         <TextField
//           variant="outlined"
//           fullWidth
//           label="Search posts by title or content"
//           value={value}
//           onChange={handleChange}
//         />
//       </Box>
//       <Box>
//         {loading && <CircularProgress />}
//         {value &&
//           data
//             .filter(
//               (item) =>
//                 item.title.toLowerCase().includes(value.toLowerCase()) ||
//                 item.content.toLowerCase().includes(value.toLowerCase())
//             )
//             .slice(0, 5)
//             .map((item) => (
//               <Card key={item.postId} sx={{ mb: 2 }}>
//                 <Link href={`/ViewPost/${item.postId}`}>
//                   <CardContent>
//                     <Typography variant="h5">
//                       {item.title.length ? (
//                         truncateContent(item.title, 50)
//                       ) : (
//                         <div>No Title provided for this post</div>
//                       )}
//                     </Typography>
//                     <Typography variant="body1">
//                       Posted by: {item.author.name}
//                     </Typography>
//                     <Typography variant="subtitle2">
//                       {item.content.length ? (
//                         truncateContent(item.content, 50)
//                       ) : (
//                         <div>No Content for this post</div>
//                       )}
//                     </Typography>
//                   </CardContent>
//                 </Link>
//               </Card>
//             ))}
//       </Box>
//     </Box>
//   );
// };

// export default SearchPosts;
