import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ShopService } from '../../../core/services/shop.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Product } from '../../../shared/models/product';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-create',
  imports: [
    MatLabel,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})

export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;
  brands: string[] = [];
  types: string[] = [];
  isLoading: boolean = true;

  private shopService = inject(ShopService);
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(SnackbarService);

  ngOnInit(): void {
    this.fetchBrandsAndTypes();

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      pictureUrl: [''],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      quantityInStock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  fetchBrandsAndTypes() {
    this.shopService.getBrands().subscribe({
      next: brands => {
        this.brands = brands;
        this.checkIfDataIsReady();
      }
    });

    this.shopService.getTypes().subscribe({
      next: types => {
        this.types = types;
        this.checkIfDataIsReady();
      }
    });
  }

  checkIfDataIsReady() {
    if (this.brands.length > 0 && this.types.length > 0) {
      this.isLoading = false;
      console.log('Brands and Types loaded:', this.brands, this.types);
    }
  }

  createProduct() {
    if (this.productForm.valid) {
      const newProduct: Product = { ...this.productForm.value };

      this.adminService.createProduct(newProduct).subscribe({
        next: () => {
          this.snack.success('Product created successfully!');
          this.router.navigate(['/admin']);
        },
        error: err => console.error('Error creating product', err)
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
