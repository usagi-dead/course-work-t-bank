import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { TuiLoader } from '@taiga-ui/core';
import { CategoriesService } from '../../services/categories.service';
import { TransactionAmountPipe } from '../../pipes/transaction-amount.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, TuiLoader, TransactionAmountPipe, RouterLink],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent {
  private txService = inject(TransactionService);
  private categoriesService = inject(CategoriesService);

  transactions$ = this.txService.getTransactions();

  getCategoryColor(category: string): string {
    return this.categoriesService.getColor(category);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}