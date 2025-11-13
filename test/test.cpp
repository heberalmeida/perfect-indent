// C++ - Mal indentado propositalmente
#include <iostream>
#include <vector>
#include <string>
class User {
private:
int id;
std::string name;
std::string email;
public:
User(int id, std::string name, std::string email)
: id(id), name(name), email(email) {}
void display() const {
std::cout << "User ID: " << id << std::endl;
std::cout << "Name: " << name << std::endl;
if (!email.empty()) {
std::cout << "Email: " << email << std::endl;
}
}
int getId() const { return id; }
};
class UserService {
private:
std::vector<User> users;
public:
void addUser(const User& user) {
if (user.getId() > 0) {
users.push_back(user);
if (users.size() > 100) {
notifyAdmin();
}
}
}
void notifyAdmin() {
std::cout << "Too many users!" << std::endl;
}
};
int main() {
UserService service;
service.addUser(User(1, "John", "john@test.com"));
service.addUser(User(2, "Jane", "jane@test.com"));
return 0;
}

