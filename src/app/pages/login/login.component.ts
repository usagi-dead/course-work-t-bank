import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAppearance, TuiButton } from '@taiga-ui/core';
import { AuthService } from '../../services/auth.service';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TuiButton, TuiAppearance, TuiCardLarge],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  isLoading = false;

  async login() {
    this.isLoading = true;
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      this.isLoading = false;
    }
  }
}
