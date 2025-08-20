import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'transactionAmount',
    standalone: true,
})
export class TransactionAmountPipe implements PipeTransform {
    transform(amount: number, isIncome: boolean): string {
        const formatted = this.formatNumber(Math.abs(amount));
        return isIncome ? `+ ${formatted} ₽` : `- ${formatted} ₽`;
    }

    private formatNumber(value: number): string {
        const [integerPart, decimalPart] = value.toFixed(0).split('.');
        const formattedInteger = integerPart
            .split('')
            .reverse()
            .reduce((acc, digit, index) => {
                return index > 0 && index % 3 === 0
                    ? `${digit} ${acc}`
                    : `${digit}${acc}`;
            }, '');
        return decimalPart
            ? `${formattedInteger},${decimalPart}`
            : formattedInteger;
    }
}