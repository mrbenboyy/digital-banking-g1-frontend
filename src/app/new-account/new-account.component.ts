import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { AccountsService } from '../services/accounts.service';
import { Router } from '@angular/router';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {
  newAccountFormGroup!: FormGroup;
  customers!: Customer[];
  showOverdraftField: boolean = false;
  showInterestRateField: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private accountsService: AccountsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Charger la liste des clients
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.log(err);
      }
    });

    // Initialiser le formulaire
    this.newAccountFormGroup = this.fb.group({
      customerId: this.fb.control(null, [Validators.required]),
      accountType: this.fb.control('CURRENT', [Validators.required]),
      balance: this.fb.control(0, [Validators.required, Validators.min(0)]),
      overdraft: this.fb.control(0),
      interestRate: this.fb.control(0)
    });

    // Gérer les changements de type de compte
    this.onAccountTypeChange({ target: { value: 'CURRENT' } });
  }

  onAccountTypeChange(event: any) {
    const accountType = event.target.value;
    this.showOverdraftField = accountType === 'CURRENT';
    this.showInterestRateField = accountType === 'SAVING';

    if (this.showOverdraftField) {
      this.newAccountFormGroup.get('overdraft')?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.newAccountFormGroup.get('overdraft')?.clearValidators();
    }

    if (this.showInterestRateField) {
      this.newAccountFormGroup.get('interestRate')?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.newAccountFormGroup.get('interestRate')?.clearValidators();
    }

    this.newAccountFormGroup.get('overdraft')?.updateValueAndValidity();
    this.newAccountFormGroup.get('interestRate')?.updateValueAndValidity();
  }

  handleSaveAccount() {
    if (this.newAccountFormGroup.invalid) return;

    const accountType = this.newAccountFormGroup.value.accountType;
    const customerId = +this.newAccountFormGroup.value.customerId; // Convertir en nombre
    const balance = this.newAccountFormGroup.value.balance;

    // Récupérer le client correspondant à l'ID
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) {
      alert('Customer not found!');
      return;
    }

    if (accountType === 'CURRENT') {
      const overdraft = this.newAccountFormGroup.value.overdraft;
      const currentAccountDTO = {
        balance: balance,
        overDraft: overdraft,
        customerDTO: customer // Envoyer le CustomerDTO complet
      };
      this.accountsService.createCurrentAccount(currentAccountDTO).subscribe({
        next: () => {
          alert('Current account created successfully!');
          this.router.navigateByUrl('/admin/accounts');
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (accountType === 'SAVING') {
      const interestRate = this.newAccountFormGroup.value.interestRate;
      const savingAccountDTO = {
        balance: balance,
        interestRate: interestRate,
        customerDTO: customer // Envoyer le CustomerDTO complet
      };
      this.accountsService.createSavingAccount(savingAccountDTO).subscribe({
        next: () => {
          alert('Saving account created successfully!');
          this.router.navigateByUrl('/admin/accounts');
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
