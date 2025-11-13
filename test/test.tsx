// React TypeScript JSX - Mal indentado propositalmente
import React, { useState, useEffect } from 'react';
interface User {
id: number;
name: string;
email: string;
}
const UserList: React.FC = () => {
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(false);
useEffect(() => {
fetchUsers();
}, []);
const fetchUsers = async () => {
setLoading(true);
try {
const response = await fetch('/api/users');
if (response.ok) {
const data = await response.json();
setUsers(data);
}
} catch (error) {
console.error('Error fetching users:', error);
} finally {
setLoading(false);
}
};
return (
<div className="user-list">
{loading ? (
<p>Loading...</p>
) : (
<ul>
{users.map(user => (
<li key={user.id}>
{user.name}
{user.email && (
<span className="email">{user.email}</span>
)}
</li>
))}
</ul>
)}
</div>
);
};
export default UserList;

