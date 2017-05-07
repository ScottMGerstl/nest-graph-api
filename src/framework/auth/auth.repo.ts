import { Component } from 'nest.js';
import { NotFoundException } from '../../types/exceptions';

export class AuthRepo {
    private repo: any[] = [];

    public createAccount(account): Promise<number> {
        this.repo.push(account);
        account.accountId = this.repo.length;

        return Promise.resolve(account.accountId);
    }

    public getAccountByEmail(email: string): Promise<any> {
        for (let r of this.repo) {
            if (r.email === email) {
                return Promise.resolve(r);
            }
        }

        return Promise.reject(new NotFoundException(null));
    }

    public getAccountById(accountId: number): Promise<any> {
        for (let r of this.repo) {
            if (r.accountId === accountId) {
                return Promise.resolve(r);
            }
        };

        return Promise.reject(new NotFoundException(null));
    }
}