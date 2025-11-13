// TypeScript - Mal indentado propositalmente
interface User {
name: string;
age: number;
}
class UserService {
private users: User[] = [];
addUser(user: User): void {
this.users.push(user);
if(user.age >= 18){
console.log("Adult user");
}
}
getUsers(): User[] {
return this.users.filter(u => {
return u.age > 0;
});
}
}

