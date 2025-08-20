import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { TransactionDetailComponent } from './pages/transaction-detail/transaction-detail.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'transaction/:id', component: TransactionDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
