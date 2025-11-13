// Go - Mal indentado propositalmente
package main
import (
"fmt"
"log"
)
type User struct {
ID int
Name string
Email string
}
func main() {
users := []User{
{ID: 1, Name: "John", Email: "john@test.com"},
{ID: 2, Name: "Jane", Email: "jane@test.com"},
}
for _, user := range users {
if user.ID > 0 {
fmt.Printf("User: %s\n", user.Name)
if len(user.Email) > 0 {
fmt.Printf("Email: %s\n", user.Email)
}
}
}
result := processUsers(users)
log.Printf("Processed %d users", result)
}
func processUsers(users []User) int {
count := 0
for _, user := range users {
if user.ID > 0 {
count++
}
}
return count
}

