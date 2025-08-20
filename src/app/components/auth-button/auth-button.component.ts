import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule, TuiAvatar, TuiButton, TuiIcon],
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthButtonComponent {
  private authService = inject(AuthService);

  currentUser$ = this.authService.currentUser$;

  async login() {
    await this.authService.loginWithGoogle();
  }

  async logout() {
    await this.authService.logout();
  }
}
