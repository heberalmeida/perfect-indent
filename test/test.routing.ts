// Angular Routing - Mal indentado propositalmente
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';
const routes: Routes = [
{
path: 'users',
component: UserListComponent,
children: [
{
path: ':id',
component: UserDetailComponent,
resolve: {
user: UserResolver
}
}
]
},
{
path: '',
redirectTo: '/users',
pathMatch: 'full'
},
{
path: '**',
redirectTo: '/users'
}
];
@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }

