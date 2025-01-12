import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from "./customers/customers.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { NewCustomerComponent } from "./new-customer/new-customer.component";
import { CustomerAccountsComponent } from "./customer-accounts/customer-accounts.component";
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "admin", component: AdminTemplateComponent, canActivate: [AuthenticationGuard],
    children: [
      { path: "customers", component: CustomersComponent, canActivate: [AuthorizationGuard], data: { role: "ROLE_ADMIN" } },
      { path: "accounts", component: AccountsComponent },
      { path: "new-customer", component: NewCustomerComponent, canActivate: [AuthorizationGuard], data: { role: "ROLE_ADMIN" } },
      { path: "new-account", component: NewAccountComponent, canActivate: [AuthorizationGuard], data: { role: "ROLE_ADMIN" } },
      { path: "customer-accounts/:id", component: CustomerAccountsComponent },
      { path: "notAuthorized", component: NotAuthorizedComponent },
      { path: "edit-customer/:id", component: EditCustomerComponent, canActivate: [AuthorizationGuard], data: { role: "ROLE_ADMIN" } },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthenticationGuard] }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
