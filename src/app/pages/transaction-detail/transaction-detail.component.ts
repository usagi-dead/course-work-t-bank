import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CategoriesService } from '../../services/categories.service';
import { TuiDay } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDropdownDirective,
  TuiLoader, TuiAppearance,
} from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiInputDate,
  TuiInputDateDirective,
  TuiInputNumberDirective,
  TuiSelectDirective,
  TuiTextarea,
  TuiTextareaLimit,
} from '@taiga-ui/kit';
import { EXPENSE, INCOME, TransactionType } from '../../shared/constants/transaction-types';
import { Subscription } from 'rxjs';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TuiTextfieldComponent,
    TuiChevron,
    TuiSelectDirective,
    TuiDataListWrapperComponent,
    TuiLabel,
    TuiTextfieldDropdownDirective,
    TuiInputNumberDirective,
    TuiInputDateDirective,
    TuiTextarea,
    TuiButton,
    TuiLoader,
    TuiInputDate,
    TuiTextareaLimit,
    TuiAppearance,
    TuiCardLarge,
  ],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.less'],
})
export class TransactionDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private txService = inject(TransactionService);
  private categoriesService = inject(CategoriesService);

  transactionForm!: FormGroup;
  transactionId: string | null = null;
  categories: string[] = [];
  isLoading = true;
  isEditing = false;
  private transactionSub!: Subscription;

  readonly INCOME = INCOME;
  readonly EXPENSE = EXPENSE;

  protected readonly minDate = new TuiDay(1900, 1, 1);
  protected readonly maxDate = TuiDay.currentLocal();

  ngOnInit() {
    this.transactionId = this.route.snapshot.paramMap.get('id');

    if (this.transactionId) {
      this.loadTransaction(this.transactionId);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadTransaction(id: string) {
    this.transactionSub = this.txService.getTransactionById(id).subscribe(transaction => {
      if (transaction) {
        this.initForm(transaction);
      } else {
        this.router.navigate(['/']);
      }
      this.isLoading = false;
    });
  }

  initForm(transaction: any) {
    const tuiDate = TuiDay.fromLocalNativeDate(new Date(transaction.date));

    this.transactionForm = this.fb.group({
      description: [
        transaction.description || '',
        [Validators.required, Validators.maxLength(100)],
      ],
      amount: [Math.abs(transaction.amount) || null, [Validators.required, Validators.min(0.01)]],
      type: [transaction.type || EXPENSE, Validators.required],
      category: [transaction.category || '', Validators.required],
      date: [tuiDate, Validators.required],
    });

    this.updateCategories(this.transactionForm.get('type')?.value);

    if (!this.isEditing) {
      this.disableForm();
    }
  }

  updateType(type: TransactionType) {
    const currentType = this.transactionForm.get('type')?.value;

    if (currentType !== type) {
      this.transactionForm.patchValue({ type });
      this.updateCategories(type);

      if (this.categories.length > 0) {
        this.transactionForm.patchValue({ category: this.categories[0] });
      }
    }
  }

  private updateCategories(type: TransactionType) {
    this.categories =
      type === INCOME
        ? this.categoriesService.getIncomeCategories()
        : this.categoriesService.getExpenseCategories();

    if (this.categories.length > 0 && !this.transactionForm.get('category')?.value) {
      this.transactionForm.patchValue({ category: this.categories[0] });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.enableForm();
    } else {
      this.loadTransaction(this.transactionId!);
    }
  }

  enableForm() {
    this.transactionForm.get('description')?.enable();
    this.transactionForm.get('amount')?.enable();
    this.transactionForm.get('type')?.enable();
    this.transactionForm.get('category')?.enable();
    this.transactionForm.get('date')?.enable();
  }

  disableForm() {
    this.transactionForm.get('description')?.disable();
    this.transactionForm.get('amount')?.disable();
    this.transactionForm.get('type')?.disable();
    this.transactionForm.get('category')?.disable();
    this.transactionForm.get('date')?.disable();
  }

  async onSubmit() {
    if (this.transactionForm.valid && this.transactionId) {
      try {
        const formValue = this.transactionForm.value;
        await this.txService.updateTransaction(this.transactionId, formValue);
        this.isEditing = false;
        this.disableForm();
      } catch (error) {
        console.error('Ошибка при обновлении транзакции:', error);
      }
    }
  }

  ngOnDestroy() {
    if (this.transactionSub) {
      this.transactionSub.unsubscribe();
    }
  }
}
