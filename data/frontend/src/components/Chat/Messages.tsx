import React from 'react';
import { chatSocket } from '../../chatSocket';
import { chatResponseArgs } from './args.interface';
import { actionTypes } from './args.types';
import { useSelector } from 'react-redux';

type arg = {
	messages: chatResponseArgs[],
	role: string,
	channelName: string
}

export default function Messages({ messages, role, channelName }: arg) {
	const user = useSelector((state: any) => state.user);

	return (
		<div className='messages'>
		{
			messages.map((message, index) => {
				user.blockedUsers.forEach((element: string) => {
					// dispatch(addBlockedUser(element));
				});
				if (message.action === actionTypes.join)
				{
					return(
						<div key={ index } className='userJoined'> {/*the three paragraphs must be on the same line*/}
							<p>=&gt; </p>
							<p>{message.source}</p>
							<p> joined the room</p>
						</div>
					);
				}
				else if (message.action === actionTypes.left)
				{
					return(
						<div key={ index } className='userLeft'> {/*the three paragraphs must be on the same line*/}
							<p>&#60;= </p>
							<p>{message.source}</p>
							<p> left the room</p>
						</div>
					);
				}
				else if (message.action === actionTypes.msg && !user.blockedUsers.indexOf(message.source))
				{
					return (
						<div key={ index } className='message'>
							<div className='options'>
							{
								role !== "none" && user.username !== message.source ? (
									<div className='adminOptions'>
										<button onClick={ () => { chatSocket.emit("kick", { source: user.username, target: message.source, room: channelName }) } } >Kick</button>
										<button onClick={ () => { chatSocket.emit("ban", { source: user.username, target: message.source, room: channelName })  } } >Ban</button>
									</div>
								) : null
							}
							{
								user.username !== message.source ? (
									<button onClick={ () => { chatSocket.emit("block", { source: user.username, target: message.source, room: channelName }) } } >Block</button>
								) : null
							}
							</div>
							<p>{ message.source }</p>
							<p>{ message.data }</p>
						</div>
					);
				}
				else
					return ('');
			}
		)
		}
		</div>
	);
}
