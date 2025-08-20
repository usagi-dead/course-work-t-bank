import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { TuiDay } from '@taiga-ui/cdk';
import { Transaction } from '../shared/models/transaction.model';
import { INCOME } from '../shared/constants/transaction-types';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private authService = inject(AuthService);

  private convertToDate(dateValue: any): Date {
    if (typeof dateValue === 'number') {
      return new Date(dateValue);
    } else if (dateValue instanceof Timestamp) {
      return dateValue.toDate();
    } else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      return new Date(dateValue.seconds * 1000);
    } else if (dateValue instanceof Date) {
      return dateValue;
    } else {
      return new Date();
    }
  }

  private convertToFirestoreDate(date: Date | TuiDay): number {
    if (date instanceof TuiDay) {
      const jsDate = new Date(date.year, date.month - 1, date.day);
      return jsDate.getTime();
    } else if (date instanceof Date) {
      return date.getTime();
    } else {
      return Date.now();
    }
  }

  getTransactions(): Observable<Transaction[]> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }

        const col = collection(this.firestore, `users/${user.uid}/transactions`);
        const q = query(col, orderBy('date', 'desc'));

        return collectionData(q, { idField: 'id' }).pipe(
          map((items: any[]) =>
            items.map(
              it =>
                ({
                  id: it.id,
                  description: it.description,
                  amount: it.amount,
                  date: this.convertToDate(it.date),
                  category: it.category,
                  type: it.type,
                } as Transaction),
            ),
          ),
        );
      }),
    );
  }

  getTransactionById(id: string): Observable<Transaction | null> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }

        const docRef = doc(this.firestore, `users/${user.uid}/transactions/${id}`);

        return new Observable<Transaction | null>(subscriber => {
          getDoc(docRef)
            .then(snapshot => {
              if (snapshot.exists()) {
                const data = snapshot.data();
                const transaction: Transaction = {
                  id: snapshot.id,
                  description: data['description'],
                  amount: data['amount'],
                  date: this.convertToDate(data['date']),
                  category: data['category'],
                  type: data['type'],
                };

                subscriber.next(transaction);
              } else {
                subscriber.next(null);
              }
              subscriber.complete();
            })
            .catch(error => {
              console.error('Error getting transaction:', error);
              subscriber.error(error);
            });
        });
      }),
    );
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const timestamp = this.convertToFirestoreDate(transaction.date);

      const transactionsRef = collection(this.firestore, `users/${user.uid}/transactions`);
      const docRef = await addDoc(transactionsRef, {
        description: transaction.description,
        amount:
          transaction.type === INCOME
            ? Math.abs(transaction.amount)
            : -Math.abs(transaction.amount),
        date: timestamp,
        category: transaction.category,
        type: transaction.type,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const docRef = doc(this.firestore, `users/${user.uid}/transactions/${id}`);
      const updateData: any = {};

      if (transaction.description !== undefined) updateData.description = transaction.description;
      if (transaction.amount !== undefined) {
        updateData.amount =
          transaction.type === INCOME
            ? Math.abs(transaction.amount)
            : -Math.abs(transaction.amount);
      }
      if (transaction.category !== undefined) updateData.category = transaction.category;
      if (transaction.type !== undefined) updateData.type = transaction.type;

      if (transaction.date !== undefined) {
        updateData.date = this.convertToFirestoreDate(transaction.date);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }
}
