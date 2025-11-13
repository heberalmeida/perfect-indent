// Angular Component - Mal indentado propositalmente
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
@Component({
selector: 'app-user-list',
templateUrl: './user-list.component.html',
styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
users: User[] = [];
loading = false;
constructor(private userService: UserService) {}
ngOnInit(): void {
this.loadUsers();
}
loadUsers(): void {
this.loading = true;
this.userService.getUsers().subscribe({
next: (users) => {
if (users && users.length > 0) {
this.users = users;
}
this.loading = false;
},
error: (error) => {
console.error('Error loading users:', error);
this.loading = false;
}
});
}
deleteUser(id: number): void {
if (confirm('Are you sure?')) {
this.userService.deleteUser(id).subscribe({
next: () => {
this.users = this.users.filter(u => u.id !== id);
},
error: (error) => {
console.error('Error deleting user:', error);
}
});
}
}
}
interface User {
id: number;
name: string;
email: string;
}

