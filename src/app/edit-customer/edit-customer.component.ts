import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  editCustomerFormGroup!: FormGroup;
  customerId!: number;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['id']; // Récupérer l'ID depuis l'URL
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer) => {
        this.editCustomerFormGroup = this.fb.group({
          name: this.fb.control(customer.name, [Validators.required, Validators.minLength(4)]),
          email: this.fb.control(customer.email, [Validators.required, Validators.email]),
        });
      },
      error: (err) => console.log(err),
    });
  }

  handleUpdateCustomer() {
    const updatedCustomer = this.editCustomerFormGroup.value;
    this.customerService.updateCustomer(this.customerId, updatedCustomer).subscribe({
      next: () => {
        alert('Customer updated successfully');
        this.router.navigateByUrl('/admin/customers');
      },
      error: (err) => console.log(err),
    });
  }
}
