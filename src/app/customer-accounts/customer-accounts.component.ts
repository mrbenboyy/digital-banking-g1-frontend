import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';
import { BankAccountDTO } from '../model/bank-account.model';
import { AccountsService } from '../services/accounts.service';
import { AccountOperation } from '../model/account.model'; // Import the AccountOperation model

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer!: Customer;
  accounts!: BankAccountDTO[];
  operations!: AccountOperation[]; // To store the operations for the selected account
  selectedAccountId!: string; // To store the selected account ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountsService: AccountsService
  ) {
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.fetchCustomerAccounts();
  }

  fetchCustomerAccounts(): void {
    this.accountsService.getCustomerAccounts(Number(this.customerId)).subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
      }
    });
  }

  viewAccountOperations(accountId: string): void {
    this.selectedAccountId = accountId; // Store the selected account ID
    this.accountsService.getAccount(accountId, 0, 10).subscribe({
      next: (data) => {
        this.operations = data.accountOperationDTOS; // Store the operations
      },
      error: (err) => {
        console.error('Error fetching account operations:', err);
      }
    });
  }
}
