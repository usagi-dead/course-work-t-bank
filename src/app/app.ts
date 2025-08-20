import { TuiAppearance, TuiRoot, TuiTitle, TuiLoader } from '@taiga-ui/core';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    TuiRoot,
    AuthButtonComponent,
    TuiAppearance,
    TuiCardLarge,
    TuiTitle,
    TuiLoader,
  ],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App implements OnInit {
  authService = inject(AuthService);

  isLoading$ = this.authService.currentUser$.pipe(map(user => user === undefined));

  ngOnInit() {
    this.authService.initAuthStateListener();
  }
}
