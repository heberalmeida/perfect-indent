// Kotlin - Mal indentado propositalmente
data class User(
val id: Int,
val name: String,
val email: String
)
class UserService {
private val users = mutableListOf<User>()
fun addUser(user: User) {
if (user.id > 0) {
users.add(user)
if (users.size > 100) {
notifyAdmin()
}
}
}
fun findUser(id: Int): User? {
return users.find { it.id == id }
}
private fun notifyAdmin() {
println("Too many users!")
}
}
fun main() {
val service = UserService()
service.addUser(User(1, "John", "john@test.com"))
service.addUser(User(2, "Jane", "jane@test.com"))
val user = service.findUser(1)
user?.let {
println("Found user: ${it.name}")
if (it.email.isNotEmpty()) {
println("Email: ${it.email}")
}
}
}

