import * as bcrypt from 'bcrypt';
import { Entity, BaseTime, preSave } from './base';

const BCRYPT_SALT_WORK_FACTOR = 10;
let _ID_GENERATOR:number = 0

export interface User {
    username: string;
    password: string;
}

export interface UserModel extends User, BaseTime, Entity {
    comparePassword(password: string): boolean;
}

////// Simple in-memory table for purpose of demonstration ////////

const validUsers:UserModel[] = [
    {
        _id: (_ID_GENERATOR++).toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'admin',
        password: 'admin',
        comparePassword(password:string):boolean {
            return this.password === password;
        }
    }
];

export function getUsers(limit = 100): UserModel[] {
    return validUsers;
}

export function getUserById(id: string): Promise<UserModel> {
    return new Promise((resolve, reject) => {
        let user = validUsers.filter((it)=> it._id === id)[0];
        resolve(user);
    });
}

export function getUserByUsername(username): Promise<UserModel> {
    return new Promise((resolve, reject) => {
        let user = validUsers.filter((it)=> it.username === username)[0];
        resolve(user);
    });
}

export function addUser(input: User) {
    throw new Error('addUser not implemented')
}

export function removeUser(id) {
    throw new Error('removeUser not implemented')
}
