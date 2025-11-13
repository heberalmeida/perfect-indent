// Angular Service - Mal indentado propositalmente
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
providedIn: 'root'
})
export class UserService {
private apiUrl = 'https://api.example.com/users';
constructor(private http: HttpClient) {}
getUsers(): Observable<User[]> {
return this.http.get<User[]>(this.apiUrl).pipe(
map(users => {
if (users && Array.isArray(users)) {
return users.filter(user => user.id > 0);
}
return [];
})
);
}
getUser(id: number): Observable<User> {
return this.http.get<User>(`${this.apiUrl}/${id}`);
}
createUser(user: User): Observable<User> {
if (user && user.name && user.email) {
return this.http.post<User>(this.apiUrl, user);
}
throw new Error('Invalid user data');
}
updateUser(id: number, user: Partial<User>): Observable<User> {
return this.http.put<User>(`${this.apiUrl}/${id}`, user);
}
deleteUser(id: number): Observable<void> {
return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}
interface User {
id: number;
name: string;
email: string;
}

