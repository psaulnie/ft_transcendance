import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';
import { UsersList } from 'src/entities/usersList.entity';
import { Repository } from 'typeorm';
import { accessStatus, userRole } from '../chatModule/chatEnums';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(UsersList)
    private usersListRepository: Repository<UsersList>,
  ) {}

  async findOne(name: string): Promise<Room> {
    return await this.roomsRepository.findOne({
      where: { roomName: name },
      relations: ['usersList', 'usersList.user', 'owner'],
    });
  }

  async findAll(): Promise<Room[]> {
    return await this.roomsRepository.find({
      relations: ['usersList', 'usersList.user', 'owner'],
    });
  }

  async createRoom(
    name: string,
    user: User,
    access: number,
    password: string,
  ): Promise<Room> {
    console.log('createroom');
    const room = new Room();
    const usersList = new UsersList();

    usersList.user = user;
    usersList.role = userRole.owner;
    usersList.isBanned = false;
    usersList.isMuted = false;

    room.roomName = name;
    room.owner = user;
    room.usersNumber = 1;
    room.access = access;
    room.password = password;
    console.log('hash: ', room.password);
    if (!room.usersList) room.usersList = [];
    room.usersList.push(await this.usersListRepository.save(usersList));
    return await this.roomsRepository.save(room);
  }

  async addRoom(room: Room): Promise<Room> {
    console.log('addroom');
    return await this.roomsRepository.save(room);
  }

  async addUser(
    roomName: string,
    user: User,
    invited: boolean,
  ): Promise<number> {
    console.log('adduser');
    const room = await this.findOne(roomName);
    if (!room) return;
    if (room.access == accessStatus.private && !invited) {
      return accessStatus.private;
    }
    const rightUser = room.usersList.find((obj) => obj.user.uid === user.uid);

    if (rightUser && rightUser.isBanned) return -1;
    else if (rightUser) return accessStatus.public;

    const newEntry = new UsersList();

    newEntry.user = user;
    newEntry.role = userRole.none;
    newEntry.isBanned = false;
    newEntry.isMuted = false;

    room.usersNumber += 1;
    room.usersList.push(await this.usersListRepository.save(newEntry));
    await this.roomsRepository.save(room);
    return accessStatus.public;
  }

  async removeUser(roomName: string, userId: number) {
    console.log('removeuser');
    const room = await this.findOne(roomName);
    if (!room) return;
    console.log('-1 user in ' + roomName);
    room.usersNumber--;
    console.log('number of users:' + room.usersNumber);
    if (room.usersNumber <= 0) {
      console.log('room deleted');
      this.removeRoom(roomName);
      return;
    }
    room.usersList = room.usersList.filter((user) => {
      if (user.user && user.user.uid) return user.user.uid !== userId;
      return true;
    });
    await this.roomsRepository.save(room);
  }

  async removeRoom(name: string) {
    console.log('removeroom');
    return await this.roomsRepository.delete({ roomName: name });
  }

  async removeUserFromRooms(userId: number) {
    console.log('removeuserfromrooms');
    const rooms = this.findAll();
    (await rooms).forEach((element) => {
      this.removeUser(element.roomName, userId);
    });
  }

  async getRole(room: Room, userId: number): Promise<userRole> {
    console.log('getrole');

    let isAdmin = false;
    if (!room) throw new Error('Room not found');
    if (room.owner.uid == userId) return userRole.owner;
    room.usersList.forEach((user) => {
      if (user.role == userRole.admin && user.user.uid == userId) {
        isAdmin = true;
        return;
      }
    });
    if (isAdmin) return userRole.admin;
    return userRole.none;
  }

  async addToBanList(roomName: string, user: User): Promise<Room> {
    console.log('addtobanlist');
    const room = await this.findOne(roomName);
    const userInList = room.usersList.find((obj) => obj.user.uid == user.uid);
    userInList.isBanned = true;
    room.usersNumber--;
    await this.usersListRepository.save(userInList);
    return await this.roomsRepository.save(room);
  }

  async addToMutedList(roomName: string, user: User): Promise<Room> {
    console.log('addtomutedlist');
    const room = await this.findOne(roomName);
    if (!room) return;
    const userInList = room.usersList.find((obj) => obj.user.uid == user.uid);
    userInList.isMuted = true;
    await this.usersListRepository.save(userInList);
    return await this.roomsRepository.save(room);
  }

  async removeFromMutedList(roomName: string, user: User): Promise<Room> {
    console.log('removefrommutedlist');
    const room = await this.findOne(roomName);
    if (!room) return;
    const userInList = room.usersList.find((obj) => obj.user.uid == user.uid);
    userInList.isMuted = false;
    await this.usersListRepository.save(userInList);
    return await this.roomsRepository.save(room);
  }

  async isMuted(roomName: string, user: User): Promise<boolean> {
    console.log('ismuted');
    const room = await this.findOne(roomName);
    if (!room) return false;
    const userInList = room.usersList.find((obj) => {
      if (obj.user.uid) return obj.user.uid == user.uid;
      return false;
    });
    if (!userInList) return false;
    return userInList.isMuted;
  }

  async addAdmin(roomName: string, user: User): Promise<Room> {
    console.log('addadmin');
    const room = await this.findOne(roomName);
    const userInList = room.usersList.find((obj) => obj.user.uid == user.uid);

    userInList.role = userRole.admin;
    await this.usersListRepository.save(userInList);
    return await this.roomsRepository.save(room);
  }

  async getPassword(roomName: string): Promise<string> {
    console.log('getpassword');
    const room = await this.findOne(roomName);
    return room.password;
  }

  async setPasswordToRoom(roomName: string, password: string) {
    console.log('setpasswordtoroom');

    const room = await this.findOne(roomName);
    if (room) {
      room.password = password;
      room.access = accessStatus.protected;
      await this.roomsRepository.save(room);
    }
  }

  async removePasswordToRoom(roomName: string) {
    console.log('removepasswordtoroom');

    const room = await this.findOne(roomName);
    if (room) {
      room.password = '';
      room.access = accessStatus.public;
      await this.roomsRepository.save(room);
    }
  }

  async isUserInRoom(roomName: string, userID: number): Promise<boolean> {
    console.log('isuserinroom');
    const room = await this.findOne(roomName);
    if (!room || !room.usersList.find((obj) => obj.user.uid == userID))
      return false;
    else return true;
  }
}
