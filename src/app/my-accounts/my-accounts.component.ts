// my-accounts.component.ts
import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../services/accounts.service';
import { AuthService } from '../services/auth.service';
import { BankAccountDTO } from '../model/bank-account.model';
import { Router } from '@angular/router';
import { AccountOperation } from '../model/account.model';

@Component({
  selector: 'app-my-accounts',
  templateUrl: './my-accounts.component.html',
  styleUrls: ['./my-accounts.component.css']
})
export class MyAccountsComponent implements OnInit {
  accounts!: BankAccountDTO[];
  operations!: AccountOperation[]; // To store the operations for the selected account
  selectedAccountId!: string; // To store the selected account ID
  errorMessage!: string;

  constructor(
    private accountsService: AccountsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMyAccounts();
  }

  loadMyAccounts() {
    const email = this.authService.email; // Get the logged-in user's email
    if (email) {
      this.authService.getCustomerByEmail(email).subscribe({
        next: (customer) => {
          const customerId = customer.id; // Extract the customer ID
          this.accountsService.getCustomerAccounts(customerId).subscribe({
            next: (data) => {
              this.accounts = data;
            },
            error: (err) => {
              this.errorMessage = err.message;
            }
          });
        },
        error: (err) => {
          this.errorMessage = "Failed to fetch customer details.";
        }
      });
    } else {
      this.errorMessage = "User email not found. Please log in again.";
    }
  }

  viewAccountOperations(accountId: string) {
    this.selectedAccountId = accountId; // Store the selected account ID
    this.accountsService.getAccount(accountId, 0, 10).subscribe({
      next: (data) => {
        this.operations = data.accountOperationDTOS; // Store the operations
      },
      error: (err) => {
        this.errorMessage = "Failed to fetch account operations.";
      }
    });
  }
}
