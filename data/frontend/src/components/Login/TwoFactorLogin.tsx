import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DoneIcon from "@mui/icons-material/Done";

function TwoFactorLogin() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [twoFactorTurnOnCode, setTwoFactorTurnOnCode] = useState("");
  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState("");
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean | null>(
    false
  );

  useEffect(() => {
    async function checkTwoFactorAuthState() {
      try {
        const response = await fetch(
          `http://${process.env.REACT_APP_IP}:5000/2fa/getState`,
          {
            method: "post",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok && data === true) {
          checkTwoFactorStatus();
        } else if (response.ok && data === false) {
          navigate("/home");
        } else {
          console.error("Failed to fetch state of 2FA");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    checkTwoFactorAuthState();
  }, []);

  async function checkTwoFactorStatus() {
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP}:5000/2fa/status`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setIsTwoFactorEnabled(data);
      if (!data) {
        fetchQrCode();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function fetchQrCode() {
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP}:5000/2fa/generate`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "image/png",
          },
        }
      );
      const data = await response.blob();
      const url = URL.createObjectURL(data);
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function validateTwoFactorTurnOnCode() {
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP}:5000/2fa/turn-on`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ twoFactorAuthCode: twoFactorTurnOnCode }),
        }
      );
      const data = await response.json();
      if (response.ok && data.status !== "codeError") {
        console.log("2FA is turned on.");
        setError(false);
        navigate("/home");
      } else {
        console.log("Wrong authentication code");
        setError(true);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function validateTwoFactorAuthCode() {
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP}:5000/2fa/authenticate`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ twoFactorAuthCode: twoFactorAuthCode }),
        }
      );
      const data = await response.json();
      if (response.ok && data.status !== "codeError") {
        console.log("2FA authentication successfully.");
        setError(false);
        navigate("/home");
      } else {
        console.log("Wrong authentication code");
        setError(true);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  return (
    <Grid
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        sx={{
          // top: '25%',
          width: "100%",
          height: "60%",
          padding: "2em",
          borderRadius: "3em",
          background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
          border: "1px solid #000000",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        {isTwoFactorEnabled ? (
          <>
            <div>
              <Typography
                variant="h6"
                sx={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: "auto",
                  marginBottom: "1em",
                }}
              >
                Enter the validation code in Google Authenticator
              </Typography>
              <TextField
                type="text"
                label="Code"
                variant="outlined"
                sx={{
                  input: {
                    borderColor: "black",
                    color: "black",
                  },
                }}
                value={twoFactorTurnOnCode}
                onChange={(e) => setTwoFactorTurnOnCode(e.target.value)}
                placeholder="Enter validation code"
              />
              <Button
                onClick={validateTwoFactorTurnOnCode}
                variant="outlined"
                sx={{
                  width: "55px",
                  height: "55px",
                  color: "black",
                  backgroundColor: "white",
                  marginLeft: "1em",
                }}
              >
                <DoneIcon />
              </Button>
            </div>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{
                fontSize: 22,
                fontWeight: "bold",
                color: "black",
                marginLeft: "auto",
                marginBottom: "1em",
              }}
            >
              Scan the QrCode to obtain a validation code
            </Typography>
            <div>
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  id="qrCodeImage"
                  style={{ marginBottom: "1em" }}
                />
              )}
            </div>
            <div>
              <TextField
                type="text"
                label="Code"
                variant="outlined"
                sx={{
                  input: {
                    borderColor: "black",
                    color: "black",
                  },
                }}
                value={twoFactorTurnOnCode}
                onChange={(e) => setTwoFactorTurnOnCode(e.target.value)}
                placeholder="Enter validation code"
              />
              <Button
                onClick={validateTwoFactorTurnOnCode}
                variant="outlined"
                sx={{
                  width: "55px",
                  height: "55px",
                  color: "black",
                  backgroundColor: "white",
                  marginLeft: "1em",
                }}
              >
                <DoneIcon />
              </Button>
            </div>
          </>
        )}

        {error && (
          <p style={{ color: "black" }}>Incorrect code, please try again.</p>
        )}
      </Box>
    </Grid>
  );
}

export default TwoFactorLogin;
