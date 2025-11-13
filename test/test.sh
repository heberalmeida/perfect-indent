#!/bin/bash
# Shell Script - Mal indentado propositalmente
function process_users() {
local count=0
for user in "$@"; do
if [ -n "$user" ]; then
echo "Processing user: $user"
count=$((count + 1))
if [ $count -gt 10 ]; then
echo "Too many users!"
break
fi
fi
done
return $count
}
if [ $# -eq 0 ]; then
echo "Usage: $0 user1 user2 ..."
exit 1
fi
process_users "$@"
result=$?
echo "Processed $result users"

