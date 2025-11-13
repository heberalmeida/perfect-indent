-- Lua - Mal indentado propositalmente
local User = {}
User.__index = User
function User:new(id, name, email)
local obj = {
id = id,
name = name,
email = email
}
setmetatable(obj, User)
return obj
end
function User:display()
print("User ID: " .. self.id)
print("Name: " .. self.name)
if self.email and self.email ~= "" then
print("Email: " .. self.email)
end
end
local UserService = {}
function UserService:new()
local obj = {
users = {}
}
setmetatable(obj, {__index = UserService})
return obj
end
function UserService:addUser(user)
if user and user.id > 0 then
table.insert(self.users, user)
if #self.users > 100 then
self:notifyAdmin()
end
end
end
function UserService:notifyAdmin()
print("Too many users!")
end
local service = UserService:new()
service:addUser(User:new(1, "John", "john@test.com"))
service:addUser(User:new(2, "Jane", "jane@test.com"))

