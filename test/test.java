// Java - Mal indentado propositalmente
public class UserService {
private List<User> users;
public UserService() {
this.users = new ArrayList<>();
}
public void addUser(User user) {
if (user != null && user.isValid()) {
this.users.add(user);
if (this.users.size() > 100) {
notifyAdmin();
}
}
}
public User findUser(int id) {
return this.users.stream()
.filter(user -> user.getId() == id)
.findFirst()
.orElse(null);
}
private void notifyAdmin() {
System.out.println("Too many users!");
}
}
class User {
private int id;
private String name;
public User(int id, String name) {
this.id = id;
this.name = name;
}
public boolean isValid() {
return id > 0 && name != null && !name.isEmpty();
}
public int getId() {
return id;
}
}

