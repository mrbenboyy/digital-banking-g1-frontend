import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';
import { BankAccountDTO } from '../model/bank-account.model'; // Import the correct model
import { AccountsService } from '../services/accounts.service'; // Import the correct service

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer!: Customer;
  accounts!: BankAccountDTO[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountsService: AccountsService // Use the correct service
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
}
