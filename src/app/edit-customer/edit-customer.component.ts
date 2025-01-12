import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  editCustomerFormGroup!: FormGroup;
  customerId!: number;
  availableRoles: string[] = ['ADMIN', 'USER'];
  selectedRole!: string;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['id'];
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer: Customer) => {
        this.selectedRole = customer.role; // Initialiser le rôle sélectionné
        this.editCustomerFormGroup = this.fb.group({
          name: [customer.name, [Validators.required, Validators.minLength(4)]],
          email: [customer.email, [Validators.required, Validators.email]],
          role: [this.selectedRole, [Validators.required]], // Initialiser le champ rôle
          password: [''] // Champ mot de passe (optionnel)
        });
      },
      error: (err) => console.log(err),
    });
  }

  handleUpdateCustomer() {
    if (this.editCustomerFormGroup.invalid) return;

    const updatedCustomer = {
      ...this.editCustomerFormGroup.value,
      role: this.editCustomerFormGroup.value.role // Utiliser la valeur du formulaire pour le rôle
    };

    // Ne pas envoyer le mot de passe s'il n'est pas modifié
    if (!this.editCustomerFormGroup.value.password) {
      delete updatedCustomer.password;
    }

    this.customerService.updateCustomer(this.customerId, updatedCustomer).subscribe({
      next: () => {
        alert('Customer updated successfully');
        this.router.navigateByUrl('/admin/customers');
      },
      error: (err) => console.log(err),
    });
  }
}
