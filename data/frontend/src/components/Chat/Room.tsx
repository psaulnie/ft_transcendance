import { useState, useEffect } from 'react';

import MessagesBox from './Message/MessagesBox';
import InputForm from './Message/InputForm';

import { useSelector } from 'react-redux';

import { Grid, Box, Typography } from '@mui/material';

import UsersList from './UsersList';

function Room({channelName}: {channelName: string}) {
	const rooms = useSelector((state: any) => state.rooms);

	const [role, setRole] = useState('none');
	const roomIndex = rooms.room.findIndex((obj: {name: string, role: string}) => obj.name === channelName); // TODO check if need to recalculate index at every rendering in useEffect

	useEffect(() => {
		const cRole = rooms.room.find((obj: {name: string, role: string}) => obj.name === channelName);
		if (cRole)
			setRole(cRole.role);
	}, [setRole, rooms, channelName]);


	return (
		<Grid sx={{display: 'flex'}}>
			<Grid item xs={8}>
				<Grid item xs={12}>
					<Box sx={{ height: '80vh', padding: '16px', overflow: 'auto' }}>
						<MessagesBox messages={ rooms.room[roomIndex].messages } role={ role } channelName={ channelName } />
					</Box>
				</Grid>
				<Grid item xs={12}>
					<InputForm channelName={ channelName } isDirectMessage={rooms.room[roomIndex].isDirectMessage} />
				</Grid>
			</Grid>
			<Grid item xs={4}>
				<Box sx={{ backgroundColor: '#102b47', height: '100%', padding: '16px', borderRadius: '10px'}}>
					<Typography>Users:</Typography>
					<UsersList roomName={channelName} />
				</Box>
			</Grid>
		</Grid>
	);
}

export default Room;