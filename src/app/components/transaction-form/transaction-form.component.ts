import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EXPENSE, INCOME, TransactionType } from '../../shared/constants/transaction-types';
import { CategoriesService } from '../../services/categories.service';
import { TuiDay } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDropdownDirective,
} from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiInputDateDirective,
  TuiInputDateTime,
  TuiInputNumberDirective,
  TuiSelectDirective,
  TuiTextarea,
  TuiTextareaLimit,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfieldComponent,
    TuiChevron,
    TuiSelectDirective,
    TuiDataListWrapperComponent,
    TuiLabel,
    TuiTextfieldDropdownDirective,
    TuiInputNumberDirective,
    TuiInputDateDirective,
    TuiInputDateTime,
    TuiTextarea,
    TuiTextareaLimit,
    TuiButton,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.less'],
})
export class TransactionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected categoriesService = inject(CategoriesService);

  @Output() transactionAdded = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  transactionForm!: FormGroup;
  categories: string[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  readonly INCOME = INCOME;
  readonly EXPENSE = EXPENSE;

  protected readonly minDate = new TuiDay(1900, 1, 1);
  protected readonly maxDate = TuiDay.currentLocal();

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.transactionForm = this.fb.group({
      description: [''],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      type: [EXPENSE, Validators.required],
      category: ['', Validators.required],
      date: [TuiDay.currentLocal(), Validators.required],
    });

    this.updateCategories(EXPENSE);
  }

  updateType(type: TransactionType) {
    this.transactionForm.patchValue({ type });
    this.updateCategories(type);
  }

  private updateCategories(type: TransactionType) {
    this.categories =
      type === INCOME
        ? this.categoriesService.getIncomeCategories()
        : this.categoriesService.getExpenseCategories();

    if (this.categories.length > 0) {
      this.transactionForm.patchValue({ category: this.categories[0] });
    }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      this.transactionAdded.emit(formValue);
      this.resetForm();
    }
  }

  resetForm() {
    const currentType = this.transactionForm.get('type')?.value;

    this.transactionForm.patchValue({
      description: '',
      amount: null,
      category: this.categories.length > 0 ? this.categories[0] : '',
      date: TuiDay.currentLocal(),
    });

    this.transactionForm.markAsPristine();
    this.transactionForm.markAsUntouched();

    this.updateCategories(currentType);
  }
}
