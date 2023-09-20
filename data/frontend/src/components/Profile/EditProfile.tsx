import {
  Box,
  Grid,
  Button,
  Avatar,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUploadAvatarMutation } from "../../store/api";
import webSocketManager from "../../webSocket";

function EditProfile() {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState<any>(null);
  const [uploadAvatar, response] = useUploadAvatarMutation();

  useEffect(() => {
    if (response.isSuccess) window.location.reload();
    else if (response.isError) setError(response.error);
  }, [response]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] !== undefined) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        alert("Only images are allowed");
        setSelectedFile(undefined);
        setFileUrl("");
      } else if (e.target.files[0].size > 1024 * 1024 * 5) {
        alert("Image is too large");
        setSelectedFile(undefined);
        setFileUrl("");
      } else {
        setSelectedFile(e.target.files[0]);
        setFileUrl(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const saveChanges = () => {
    const formData = new FormData();
    if (newUsername !== "" && newUsername.length < 10) {
      webSocketManager.getSocket()?.emit("changeUsername", newUsername);
      setNewUsername("");
    }
    if (selectedFile !== undefined) {
      formData.append("file", selectedFile);
      uploadAvatar(formData);
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  const urlAvatar = `http://${import.meta.env.VITE_IP}:5000/api/avatar/${
    user.username
  }`;

  const mainBoxStyle = {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
    width: "35em",
    height: "20em",
    borderRadius: "3em",
    background: "#d6d4d470",
    backdropFilter: "blur(8px)",
    border: "1px solid #00000088",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  };

  const textStyle = {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  };

  const buttonStyle = {
    textTransform: "none",
    fontSize: "16px",
    width: "5em",
    height: "1.5em",
    backgroundColor: "#d6d4d4",
    border: "1px solid #000000",
    borderRadius: "1em",
    color: "black",
    "&:hover": {
      backgroundColor: "grey",
    },
  };

  const downloadButtonStyle = {
    textTransform: "none",
    fontSize: "16px",
    width: "15em",
    height: "1.5em",
    backgroundColor: "#d6d4d4",
    border: "1px solid #000000",
    borderRadius: "1em",
    color: "black",
    "&:hover": {
      backgroundColor: "grey",
    },
  };

  return (
    <div>
      <Box sx={mainBoxStyle}>
        <Grid
          container
          direction="row"
          style={{ height: "100%", marginLeft: "2em" }}
        >
          {/* Avatar Grid */}
          <Grid
            item
            xs={5}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              src={fileUrl ? fileUrl : urlAvatar}
              alt="User Avatar"
              sx={{ width: "10em", height: "10em" }}
            />
          </Grid>

          {/* Content Grid */}
          <Grid
            item
            xs={5}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item>
              <Typography variant="h6" sx={textStyle}>
                Username
              </Typography>
              <TextField
                placeholder="New username"
                size="small"
                autoComplete="off"
                value={newUsername}
                onChange={(e) =>
                  e.target.value.length < 10
                    ? setNewUsername(e.target.value)
                    : null
                }
                sx={{
                  backgroundColor: "#F8F8F8",
                  "& input": { color: "grey" },
                }}
              />
            </Grid>

            <Grid item>
              <Button
                sx={{ ...downloadButtonStyle }}
                variant="contained"
                color="primary"
                component="label"
              >
                <input type="file" onChange={handleFileChange} hidden />
                Download new image
              </Button>
            </Grid>

            <Grid
              item
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Button
                  onClick={handleProfileClick}
                  variant="contained"
                  color="primary"
                  sx={buttonStyle}
                >
                  Back
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  sx={buttonStyle}
                  onClick={saveChanges}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={!(!error)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error {`${error?.data?.statusCode}: ${error?.data?.message}`}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default EditProfile;
