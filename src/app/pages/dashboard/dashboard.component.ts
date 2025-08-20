import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { TuiAppearance } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { TransactionHistoryComponent } from '../../components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TuiAppearance,
    TuiCardLarge,
    TransactionFormComponent,
    TransactionHistoryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private transactionService = inject(TransactionService);

  async addTransaction(transactionData: any) {
    try {
      await this.transactionService.addTransaction(transactionData);
    } catch (error) {
      console.error('Ошибка при добавлении транзакции:', error);
    }
  }
}
