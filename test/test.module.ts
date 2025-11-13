// Angular Module - Mal indentado propositalmente
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';
@NgModule({
declarations: [
UserListComponent
],
imports: [
CommonModule,
FormsModule,
ReactiveFormsModule,
HttpClientModule
],
providers: [
UserService
],
exports: [
UserListComponent
]
})
export class UserModule { }

