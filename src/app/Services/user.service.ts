import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private storageKey = 'users'; // Key to store users in localStorage

  constructor() {}

  addUser(user: any) {
    const users = this.getUsers(); // Get the existing users
    users.push(user); // Add the new user
    localStorage.setItem(this.storageKey, JSON.stringify(users)); // Save to localStorage
  }

  getUsers() {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : []; // Return the users or an empty array if none are found
  }

  deleteUser(index: number) {
    const users = this.getUsers();
    users.splice(index, 1); // Remove user by index
    localStorage.setItem(this.storageKey, JSON.stringify(users)); // Save updated users to localStorage
  }

  updateUser(index: number, updatedUser: any) {
    const users = this.getUsers();
    users[index] = updatedUser; // Update the user at the specified index
    localStorage.setItem(this.storageKey, JSON.stringify(users)); // Save updated users to localStorage
  }
}
