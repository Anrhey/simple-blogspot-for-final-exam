"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { UploadButton } from "@/utils/uploadthing";
import { useParams, useRouter } from "next/navigation";
import { fetchUser, updateUser } from "./actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const EditUser = () => {
  const [token, setToken] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    profileImage: "",
  });

  const { id } = useParams();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetchUser(id, token),
  });

  useEffect(() => {
    if (data) {
      setFormData({
        email: data.userData.email || "",
        name: data.userData.name || "",
        profileImage: data.userData.profileImage || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => updateUser(id, token, formData),
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      router.push("/profile-feed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email: {"(Email cant be edited)"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Email cant be edited"
              disabled
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Name"
            />
          </div>
          <div className={styles.inputGroup}>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                setFormData({ profileImage: res[0].url });
              }}
              onUploadError={(error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
            {formData.profileImage.length ? (
              <div>
                <img
                  src={formData.profileImage}
                  alt="my image"
                  className={styles.image}
                  value={formData.profileImage}
                />
              </div>
            ) : null}
          </div>

          <button type="submit" className={styles.loginButton}>
            Update Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
