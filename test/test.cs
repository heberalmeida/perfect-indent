// C# - Mal indentado propositalmente
using System;
using System.Collections.Generic;
using System.Linq;
namespace TestApp
{
public class User
{
public int Id { get; set; }
public string Name { get; set; }
public string Email { get; set; }
public User(int id, string name, string email)
{
Id = id;
Name = name;
Email = email;
}
}
public class UserService
{
private List<User> users;
public UserService()
{
users = new List<User>();
}
public void AddUser(User user)
{
if (user != null && user.Id > 0)
{
users.Add(user);
if (users.Count > 100)
{
NotifyAdmin();
}
}
}
public User FindUser(int id)
{
return users.FirstOrDefault(u => u.Id == id);
}
private void NotifyAdmin()
{
Console.WriteLine("Too many users!");
}
}
class Program
{
static void Main(string[] args)
{
var service = new UserService();
service.AddUser(new User(1, "John", "john@test.com"));
service.AddUser(new User(2, "Jane", "jane@test.com"));
}
}
}

