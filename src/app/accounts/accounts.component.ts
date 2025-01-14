import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AccountsService } from "../services/accounts.service";
import { catchError, Observable, throwError } from "rxjs";
import { AccountDetails } from "../model/account.model";
import { AuthService } from '../services/auth.service';
import { Customer } from '../model/customer.model';
import { BankAccountDTO } from '../model/bank-account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>;
  operationFromGroup!: FormGroup;
  errorMessage!: string;
  customerAccounts!: BankAccountDTO[]; // To store the user's accounts
  selectedAccountId!: string; // To store the selected account ID

  constructor(
    private fb: FormBuilder,
    private accountService: AccountsService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadCustomerAccounts();
  }

  initForms(): void {
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control('') // This will be populated with the user's accounts
    });

    this.operationFromGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null)
    });
  }

  loadCustomerAccounts(): void {
    const email = this.authService.email; // Get the logged-in user's email
    if (email) {
      this.authService.getCustomerByEmail(email).subscribe({
        next: (customer: Customer) => {
          const customerId = customer.id; // Extract the customer ID
          this.accountService.getCustomerAccounts(customerId).subscribe({
            next: (accounts: BankAccountDTO[]) => {
              this.customerAccounts = accounts; // Store the user's accounts
              if (accounts.length > 0) {
                this.selectedAccountId = accounts[0].id; // Select the first account by default
                this.handleSearchAccount(); // Load the operations for the selected account
              }
            },
            error: (err) => {
              this.errorMessage = 'Failed to load customer accounts.';
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch customer details.';
        }
      });
    } else {
      this.errorMessage = 'User email not found. Please log in again.';
    }
  }

  handleSearchAccount(): void {
    if (this.selectedAccountId) {
      this.accountObservable = this.accountService.getAccount(this.selectedAccountId, this.currentPage, this.pageSize).pipe(
        catchError(err => {
          this.errorMessage = err.message;
          return throwError(err);
        })
      );
    }
  }

  gotoPage(page: number): void {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation(): void {
    const accountId = this.selectedAccountId;
    const operationType = this.operationFromGroup.value.operationType;
    const amount = this.operationFromGroup.value.amount;
    const description = this.operationFromGroup.value.description;
    const accountDestination = this.operationFromGroup.value.accountDestination;

    if (operationType === 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Debit successful!");
          this.operationFromGroup.reset();
          this.handleSearchAccount(); // Refresh the account operations
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType === 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Credit successful!");
          this.operationFromGroup.reset();
          this.handleSearchAccount(); // Refresh the account operations
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType === 'TRANSFER') {
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: (data) => {
          alert("Transfer successful!");
          this.operationFromGroup.reset();
          this.handleSearchAccount(); // Refresh the account operations
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
