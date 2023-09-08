import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router';

import { Box, Grid, Button, Typography, Avatar } from '@mui/material';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import brickwall from '../Game/img/brickwall.jpg';
import industrial from '../Game/img/industrial.jpg';
import medieval from '../Game/img/medieval.jpg';
import orange from '../Game/img/orange.jpg';
import scooby from '../Game/img/scooby.jpg';

import webSocketManager from '../../webSocket';

function Options() {
    const [twoFactorAuthState, setTwoFactorAuthState] = useState<boolean>(false);
    const navigate = useNavigate();

    const brickwallStyle = {
      backgroundImage: 'url(' + brickwall +')',
      backgroundSize: 'cover'
    }
    const industrialStyle = {
      backgroundImage: 'url(' + industrial +')',
      backgroundSize: 'cover'
    }
    const medievalStyle = {
      backgroundImage: 'url(' + medieval +')',
      backgroundSize: 'cover'
    }
    const orangeStyle = {
      backgroundImage: 'url(' + orange +')',
      backgroundSize: 'cover'
    }
    const scoobyStyle = {
      backgroundImage: 'url(' + scooby +')',
      backgroundSize: 'cover'
    }

    useEffect(() => {
        async function checkTwoFactorState() {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_IP}:5000/2fa/getState`, {
                    method: 'post',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setTwoFactorAuthState(data);
                } else {
                    console.error('Unexpected response:', data);
                }
            } catch (error) {
              console.error('Error: ', error);
            }
        }
        checkTwoFactorState();
    }, []);

    async function changeTwoFactorAuthState() {
      try {
        const newState = !twoFactorAuthState;
        setTwoFactorAuthState(newState);
        const response = await fetch(`http://${process.env.REACT_APP_IP}:5000/2fa/changeState`, {
          method: 'post',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ twoFactorAuthState: newState }),
        });
        if (!response.ok) {
            console.error('Failed to fetch state of 2FA');
        }
        if (newState) {
          navigate('/2fa');
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    }

    return (
    <div>
      {/* <UploadButton /> */}
      <Box
        sx={{
          position: 'fixed',
          transform: 'translate(5%, 0%)',
          top: '25%',
          width: '90%',
          height: '50%',
          padding: '1em',
          borderRadius: '3em',
          background: 'linear-gradient(to right, #ECECEC, #d6d4d4)',
          border: '2px solid #000000',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Grid
          container
          spacing={0}
          direction='column'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item xs sx={{ width: '100%', height: '100%' }}>
            <Typography
              variant='h6'
              sx={{
                fontSize: 22,
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 'auto',
              }}
            >
              Background:
            </Typography>
          </Grid>
          <Grid
            item
            xs
            sx={{ backgroundColor: '', width: '100%', height: '90%' }}
          >
            <Grid
              container
              spacing={1}
              justifyContent='center'
              alignItems='center'
            >
              <Grid item xs={4}>
                <Button
                  sx={{ backgroundColor: 'black', height: '4em', width: '4em' }}
                  onClick={() => { webSocketManager.getSocket().emit('changeBackground', 'canvas')}}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{height: '4em', width: '4em' }}
                  style={brickwallStyle}
                  onClick={() => { webSocketManager.getSocket().emit('changeBackground', 'brickwall')}}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ height: '4em', width: '4em' }}
                  style={industrialStyle}
                  onClick={() => { webSocketManager.getSocket().emit('changeBackground', 'industrial')}}
                ></Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs
            sx={{
              backgroundColor: '',
              width: '100%',
              height: '90%',
              marginTop: '0.5em',
            }}
          >
            <Grid
              container
              spacing={1}
              justifyContent='center'
              alignItems='center'
            >
              <Grid item xs={4}>
                <Button
                  sx={{ height: '4em', width: '4em' }}
                  style={medievalStyle}
                  onClick={() => { webSocketManager.getSocket().emit('changeBackground', 'medieval')}}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ height: '4em', width: '4em' }}
                  style={orangeStyle}
                  onClick={() => { webSocketManager.getSocket().emit('changeBackground', 'orange')}}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ height: '4em', width: '4em' }}
                  style={scoobyStyle}
                  onClick={() => { webSocketManager.getSocket().emit('changeBackground', 'scooby')}}
                ></Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs sx={{ width: '100%', height: '100%' }}>
            <Typography
              variant='h6'
              sx={{
                fontSize: 22,
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 'auto',
              }}
            >
              2FA:
            </Typography>
          </Grid>
          <Grid
            item
            xs
            sx={{ width: '100%', height: '100%', marginTop: '-0.3em' }}
          >
            <FormControl component='fieldset'>
              <FormGroup aria-label='position' row>
                <FormControlLabel
                  value='start'
                  control={
                    <Switch
                        color='warning'
                        checked={twoFactorAuthState}
                        onChange={changeTwoFactorAuthState}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />}
                  label='2 factor authentication'
                  sx={{color: 'black'}}
                  labelPlacement='start'
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid
            item
            xs
            sx={{ width: '100%', height: '100%', marginTop: '0.4em' }}
          >
            <Button
              variant='contained'
              color='primary'
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '20px',
                width: '10em',
                height: '1.5em',
                backgroundColor: 'rgba(220, 220, 220, 0.9)',
                border: '2px solid #020202',
                borderRadius: '1em',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'grey',
                  borderColor: 'red',
                },
              }}
            >
              Save changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Options;
