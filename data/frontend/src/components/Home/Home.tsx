import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {Box, Grid, Button, Typography, Avatar, imageListClasses} from "@mui/material";

import { useGetLeaderboardQuery, useGetMyProfileQuery } from "../../store/api";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import { useEffect } from "react";

export default function Home() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const play = () => {
    navigate("/game");
  };

  const {
    data: userProfile,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyProfileQuery({});

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    isError: isErrorLeaderboard,
    error: errorLeaderboard,
    refetch: refetchLeaderboard,
  } = useGetLeaderboardQuery({});

  useEffect(() => {
    if (localStorage.getItem("user")) {
      refetch();
      refetchLeaderboard();
    }
  });

  if (isLoading || isLoadingLeaderboard) return <Loading />;
  if (isError) return <ErrorSnackbar error={error} />;
  if (isErrorLeaderboard) return <ErrorSnackbar error={errorLeaderboard} />;

  return (


    <Grid
      container
      direction='column'
      sx={{
        position: "absolute",
        height: '94%',
        width: '100%',
        border: '1px solid #000000',
      }}
    >
      <Typography align="left" sx={{ color: "black", fontWeight: "bold", fontSize: "30px", marginLeft: '1em', marginTop: '1em' }}>Welcome {userProfile.username}</Typography>

      <Grid item sx={{ marginLeft: '2em' }}>
        <Typography align="left" sx={{ color: "black", fontSize: "16px", marginBottom: '-5px' }}>‣ Rank: {userProfile.rank}</Typography>
        <Typography align="left" sx={{ color: "black", fontSize: "16px", marginBottom: '-5px' }}>‣ Wins: {userProfile.wins}</Typography>
        <Typography align="left" sx={{ color: "black", fontSize: "16px" }}>‣ Losses: {userProfile.loses}</Typography>
      </Grid>

      <Grid item sx={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, 0%)' }}>
        <Button
          variant="text"
          color="primary"
          onClick={play}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "36px",
            width: "6em",
            height: "1.8em",
            backgroundColor: "#d6d4d4",
            border: "1px solid #00000088",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "10px",
            color: "black",
            "&:hover": {
              backgroundColor: "#FC7D07",
            },
          }}
        >
          Play
        </Button>
      </Grid>

      <Grid item sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, 0%)' }}>
        <Box
          sx={{
            width: "30em",
            height: "14em",
            borderRadius: "1.5em",
            background: "#FFFFFF32",
            border: "1px solid #00000032",
            paddingTop: '10px',
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "24px", marginBottom: '10px' }}>Leaderboard</Typography>

          <Grid sx={{ overflow: "auto" }}>
            {leaderboard.map((user: any, index: number) => {
              return (
                <Grid container key={index} alignItems="center" justifyContent="center" sx={{
                  background: "linear-gradient(90deg, #45454500, #454545AA, #454545FF, #454545AA, #45454500)",
                  borderWidth: '1px 0',
                  borderStyle: 'solid',
                  borderImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), #d6d4d4, rgba(0, 0, 0, 0))',
                  borderImageSlice: '1 0',
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                  marginBottom: '0.5em'
                }}
                >
                  <Grid item container alignItems="center" justifyContent="center">
                    <Avatar src={`http://${process.env.REACT_APP_IP}:5000/api/avatar/${user.username}`}/>
                    <Typography color="black">{user.username}</Typography>
                    {index === 0 ? (
                      <Typography color="black" display="inline">👑</Typography>
                    ) : (
                      <></>
                    )}
                    {index === 1 ? (
                      <Typography color="black" display="inline">🥈</Typography>
                    ) : (
                      <></>
                    )}
                    {index === 2 ? (
                      <Typography color="black" display="inline">🥉</Typography>
                    ) : (
                      <></>
                    )}
                    <Typography color={"black"}>Score: {user.score}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>

        </Box>
      </Grid>

    </Grid>
  );
}
