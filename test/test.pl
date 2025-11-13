# Perl - Mal indentado propositalmente
package User;
sub new {
my ($class, %args) = @_;
my $self = {
id => $args{id},
name => $args{name},
email => $args{email}
};
bless $self, $class;
return $self;
}
sub display {
my $self = shift;
print "User ID: $self->{id}\n";
print "Name: $self->{name}\n";
if ($self->{email}) {
print "Email: $self->{email}\n";
}
}
package UserService;
sub new {
my $class = shift;
my $self = {
users => []
};
bless $self, $class;
return $self;
}
sub add_user {
my ($self, $user) = @_;
if ($user && $user->{id} > 0) {
push @{$self->{users}}, $user;
if (scalar @{$self->{users}} > 100) {
$self->notify_admin();
}
}
}
sub notify_admin {
my $self = shift;
print "Too many users!\n";
}
my $service = UserService->new();
$service->add_user(User->new(id => 1, name => "John", email => "john@test.com"));

