// C - Mal indentado propositalmente
#include <stdio.h>
#include <stdlib.h>
struct User {
int id;
char name[50];
char email[100];
};
void print_user(struct User* user) {
if (user != NULL) {
printf("User ID: %d\n", user->id);
printf("Name: %s\n", user->name);
if (user->email[0] != '\0') {
printf("Email: %s\n", user->email);
}
}
}
int process_users(struct User* users, int count) {
int processed = 0;
for (int i = 0; i < count; i++) {
if (users[i].id > 0) {
print_user(&users[i]);
processed++;
if (processed > 10) {
break;
}
}
}
return processed;
}
int main() {
struct User users[] = {
{1, "John", "john@test.com"},
{2, "Jane", "jane@test.com"}
};
int count = process_users(users, 2);
printf("Processed %d users\n", count);
return 0;
}

