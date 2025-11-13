// Swift - Mal indentado propositalmente
struct User {
let id: Int
let name: String
let email: String
func display() {
print("User ID: \(id)")
print("Name: \(name)")
if !email.isEmpty {
print("Email: \(email)")
}
}
}
class UserService {
private var users: [User] = []
func addUser(_ user: User) {
if user.id > 0 {
users.append(user)
if users.count > 100 {
notifyAdmin()
}
}
}
func findUser(id: Int) -> User? {
return users.first { $0.id == id }
}
private func notifyAdmin() {
print("Too many users!")
}
}
let service = UserService()
service.addUser(User(id: 1, name: "John", email: "john@test.com"))
service.addUser(User(id: 2, name: "Jane", email: "jane@test.com"))
if let user = service.findUser(id: 1) {
user.display()
}

