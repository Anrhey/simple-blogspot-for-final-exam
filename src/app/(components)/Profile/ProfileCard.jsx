"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "./actions";
import { useRouter } from "next/navigation";

function ProfileCard() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(token),
    enabled: !!token, // Only run the query if token exists
  });

  const handleLogout = () => {
    router.push("/login");
    localStorage.removeItem("token");
  };

  if (!token) return <Typography>Unauthorized</Typography>;
  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error loading user data</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 3,
      }}
    >
      <Card
        sx={{
          width: 320,
          borderRadius: 3,
          backgroundColor: "#37474f",
          color: "white",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              border: "4px solid white",
              backgroundColor: "#e91e63",
              margin: "1rem",
            }}
            src={data?.userData?.profileImage}
            alt={data?.userData?.name}
          />
        </Box>
        <CardContent sx={{ mt: -6 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#e91e63" }}
          >
            {data?.userData?.name}
          </Typography>
          <Typography variant="body2" color="inherit">
            {data?.userData?.email}
          </Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}
          >
            <Tooltip title="Home">
              <IconButton
                href="/homepage"
                sx={{
                  color: "white",
                  backgroundColor: "#e91e63",
                  borderRadius: "50%",
                  padding: 1,
                }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Profile Feed">
              <IconButton
                href="/profile-feed"
                sx={{
                  color: "white",
                  backgroundColor: "#e91e63",
                  borderRadius: "50%",
                  padding: 1,
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Profile">
              <IconButton
                href={`/EditUser/${data?.userData?.id}`}
                sx={{
                  color: "white",
                  backgroundColor: "#e91e63",
                  borderRadius: "50%",
                  padding: 1,
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: "white",
                  backgroundColor: "#e91e63",
                  borderRadius: "50%",
                  padding: 1,
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
        <Divider sx={{ backgroundColor: "white" }} />
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            backgroundColor: "#e91e63",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <Typography variant="body2" sx={{ color: "white" }}>
            {data?.userData?.posts.length} posts
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default ProfileCard;
