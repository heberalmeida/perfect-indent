<?php
// PHP - Mal indentado propositalmente
class UserController {
private $users = [];
public function __construct() {
$this->users = [];
}
public function addUser($user) {
if($user && is_array($user)){
$this->users[] = $user;
if(count($this->users) > 10){
$this->notifyAdmin();
}
}
return $this;
}
private function notifyAdmin() {
mail('admin@test.com', 'Alert', 'Too many users');
}
public function getUsers() {
return array_filter($this->users, function($user){
return isset($user['active']) && $user['active'];
});
}
}
$controller = new UserController();
$controller->addUser(['name' => 'John', 'active' => true]);
?>

