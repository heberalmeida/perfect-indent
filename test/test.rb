# Ruby - Mal indentado propositalmente
class UserService
def initialize
@users = []
end
def add_user(user)
if user && user.valid?
@users << user
if @users.length > 100
notify_admin
end
end
self
end
def find_user(id)
@users.find do |user|
user.id == id
end
end
private
def notify_admin
Mailer.send('admin@test.com', 'Alert', 'Too many users')
end
end

