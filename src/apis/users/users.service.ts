import { Component } from 'nest.js';
import { NotFoundException } from '../../types/exceptions/not-found.exception';

@Component()
export class UsersService {
    private users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Alice Caerio' },
        { id: 3, name: 'Who Knows' }
    ];

    public getAllUsers() {
        return Promise.resolve(this.users);
    }

    public getUser(id: number) {
        const user = this.users.find(u => u.id === id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return Promise.resolve(user);
    }

    public addUser(user: any) {
        this.users.push(user);
        return Promise.resolve();
    }
}