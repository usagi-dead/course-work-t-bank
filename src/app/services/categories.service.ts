import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private incomeCategories = ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарки'];
    private expenseCategories = ['Еда', 'Транспорт', 'Развлечения', 'Здоровье'];

    private categoryColors: Record<string, string> = {
        // Income
        'Зарплата': '#248929',
        'Фриланс': '#7ad113',
        'Инвестиции': '#bde936',
        'Подарки': '#FFC107',

        // Expense
        'Еда': '#ff6122',
        'Транспорт': '#22a7ff',
        'Развлечения': '#d632a9',
        'Здоровье': '#8a02a1'
    };

    getIncomeCategories(): string[] {
        return [...this.incomeCategories];
    }

    getExpenseCategories(): string[] {
        return [...this.expenseCategories];
    }

    getColor(category: string): string {
        return this.categoryColors[category] || '#fedd2e';
    }
}