// Rust - Mal indentado propositalmente
struct User {
id: u32,
name: String,
email: String,
}
impl User {
fn new(id: u32, name: String, email: String) -> Self {
User { id, name, email }
}
fn display(&self) {
println!("User: {}", self.name);
if !self.email.is_empty() {
println!("Email: {}", self.email);
}
}
}
fn main() {
let users = vec![
User::new(1, "John".to_string(), "john@test.com".to_string()),
User::new(2, "Jane".to_string(), "jane@test.com".to_string()),
];
for user in &users {
if user.id > 0 {
user.display();
match user.id {
1 => println!("First user"),
_ => println!("Other user"),
}
}
}
let count = process_users(&users);
println!("Processed {} users", count);
}
fn process_users(users: &[User]) -> usize {
users.iter().filter(|u| u.id > 0).count()
}

