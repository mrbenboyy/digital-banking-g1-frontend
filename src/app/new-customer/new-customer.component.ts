import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {
  newCustomerFormGroup!: FormGroup;
  availableRoles: string[] = ['ADMIN', 'USER'];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.email]],
      role: ['USER', [Validators.required]], // Rôle par défaut
      password: ['', [Validators.required]]
    });
  }

  handleSaveCustomer() {
    if (this.newCustomerFormGroup.invalid) return;

    const customer = this.newCustomerFormGroup.value;
    this.customerService.saveCustomer(customer).subscribe({
      next: () => {
        alert('Customer has been successfully saved!');
        this.router.navigateByUrl('/admin/customers');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
