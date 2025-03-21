import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/product';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-product-update',
  imports: [  
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    NgFor,
    MatSelectModule
  ],

  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.scss'
})
export class ProductUpdateComponent {
  productForm!: FormGroup;
  productId!: number;
  isLoading: boolean = true;

  brands: string[] = [];
  types: string[] = [];

  selectedFile?: File;
  previewUrl?: string;

 

  private route = inject(ActivatedRoute);
  private shopService = inject(ShopService);
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    
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

    
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      pictureUrl: [''],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      quantityInStock: [null, [Validators.required, Validators.min(0)]]
    });

    this.loadProduct();
  }

  loadProduct() {
    this.shopService.getProduct(this.productId).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue(product);
        this.isLoading = false;
      },
      error: err => console.error('Error fetching product', err)
    });
  }

  checkIfDataIsReady() {
    if (this.brands.length > 0 && this.types.length > 0) {
      console.log('Brands and Types loaded:', this.brands, this.types);
    }
  }

  updateProduct() {
    if (this.productForm.valid) {
      const updatedProduct: Product = { id: this.productId, ...this.productForm.value };

      this.adminService.updateProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          this.snack.success('Product updated successfully!');
          this.router.navigate(['/admin']);
        },
        error: err => console.error('Error updating product', err)
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

}
