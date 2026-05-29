import { AuthenticatedSocket, ServerSocket } from "../../socket/socket.types";
import { UserSocketControllerContract } from "./types/user.contracts";
import { GetOnlineUsersAcknowlegment } from "./types/user.types";

const USER_ROOM_PREFIX = "user_room:";

export const UserSocketController: UserSocketControllerContract = {
	getOnlineUsers: function (
		ioServer: ServerSocket,
		socket: AuthenticatedSocket,
		userIds: number[],
		ack?: GetOnlineUsersAcknowlegment,
	): void {
		const onlineUserIds: number[] = [];
		for (const userId of userIds) {
			if (this.isUserOnline(ioServer, userId)) {
				onlineUserIds.push(userId);
			}
		}
		if (typeof ack === "function") {
			ack({ userIds: onlineUserIds });
		}
	},
	isUserOnline: function (ioServer: ServerSocket, id: number): boolean {
		return ioServer.sockets.adapter.rooms.has(`${USER_ROOM_PREFIX}${id}`);
	},
	registerHandlers: function (
		socket: AuthenticatedSocket,
		ioServer: ServerSocket,
	): void {
		console.log(
			"User joined the room: ",
			`${USER_ROOM_PREFIX}${socket.data.userId}`,
		);
		socket.join(`${USER_ROOM_PREFIX}${socket.data.userId}`);
		socket.on("getOnlineUsers", (userIds, ack) => {
			this.getOnlineUsers(ioServer, socket, userIds, ack);
		});
		socket.on("disconnect", () => {
			socket.leave(`${USER_ROOM_PREFIX}${socket.data.userId}`);
			console.log(
				"User left the room: ",
				`${USER_ROOM_PREFIX}${socket.data.userId}`,
			);
		});
	},
};