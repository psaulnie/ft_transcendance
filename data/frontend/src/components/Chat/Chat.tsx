import React, { useEffect, useState } from 'react';

import { chatSocket } from '../../chatSocket';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { addBlockedUser, unmute } from '../../store/user';

import Room from './Room';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import JoinDirectMessage from './JoinDirectMessage';
import DirectMessageProvider from './DirectMessageProvider';
import ChatProcess from './ChatProcess';

import { Skeleton, Box, Grid } from '@mui/material';

import RoomTabs from './RoomTabs';

function Chat() {
	const user = useSelector((state: any) => state.user);
	const rooms = useSelector((state: any) => state.rooms);
	const dispatch = useDispatch();

	const [roomIndex, setRoomIndex] = useState(-1);

	useEffect(() => {
		chatSocket.emit("newUser", user.username);
		dispatch(unmute());
	}, [user.username, dispatch]);
	

	
	const {
		data: blockedUsers,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch
	} = useGetBlockedUsersQuery({username: user.username});

	useEffect(() => {
		refetch();
		if (isSuccess)
		{
			blockedUsers.data.forEach((element: any) => {
				dispatch(addBlockedUser(element.username));
			});
		}
		// if (rooms.room.length !== 0)
		// 	setRoomIndex(0); // TODO check if necessary

	}, [user.username, isSuccess, blockedUsers, dispatch, refetch, setRoomIndex, rooms]);
	


	if (isError) // TODO fix show real error page (make Error component)
		return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
		return (
			<div>
				<Skeleton variant="text"/>
				<Skeleton variant="rectangular" />
			</div>
		);

	return (
		<div className='chat'>
			<ChatProcess roomIndex={roomIndex} setRoomIndex={setRoomIndex} />
			<Grid container sx={{ display: 'flex'}} justifyContent="space-evenly">
				<Grid item xs={3}>
						<Box sx={{ backgroundColor: '#102b47', height: '100%', padding: '16px', borderRadius: '10px'}}>
							<Grid container>
								<JoinDirectMessage setRoomIndex={setRoomIndex} />
							</Grid>
							<Grid container>
								<CreateChannel setRoomIndex={setRoomIndex} />
							</Grid>
							<Grid container>
								<JoinChannel setRoomIndex={setRoomIndex} />
							</Grid>
						</Box>
				</Grid>
				<Grid item xs={7}>
						<DirectMessageProvider roomIndex={roomIndex} setRoomIndex={setRoomIndex}/>
						<Grid>
							{ 
								roomIndex !== -1 && rooms.room[roomIndex] ?
									<Room key={rooms.room[roomIndex].name} channelName={rooms.room[roomIndex].name}/>
								: null
							}	
						</Grid>
						<Grid item sx={{ marginBottom: '70px' }}>
							<RoomTabs roomIndex={roomIndex} setRoomIndex={setRoomIndex} />
						</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

export default Chat;