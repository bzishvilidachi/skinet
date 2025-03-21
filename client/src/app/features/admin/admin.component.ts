import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Order } from '../../shared/models/order';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../core/services/dialog.service';
import { Product } from '../../shared/models/product';
import { ProductParams } from '../../shared/models/productParams';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from '../../core/services/snackbar.service';


@Component({
  selector: 'app-admin',
  imports: [
    MatTableModule,         
    MatPaginatorModule,     
    MatButtonModule,        
    MatIconModule,         
    MatSelectModule, 
    MatListModule,         
    MatMenuModule,       
    DatePipe,               
    CurrencyPipe,           
    MatTooltipModule,       
    MatTabsModule,          
    RouterLink,            
    FormsModule,           
    ReactiveFormsModule,    
    CommonModule            
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  displayedOrderColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  displayedProductColumns: string[] = ['id', 'name', 'brand', 'type', 'price', 'action'];
  orderDataSource = new MatTableDataSource<Order>([]);
  productDataSource = new MatTableDataSource<Product>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  private snack = inject(SnackbarService);
  
  productParams = new ProductParams();
  orderParams = new OrderParams();
  totalOrderItems = 0;
  totalProducts = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' }
  ];
  pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts(this.productParams).subscribe({
      next: response => {
        if (response.data) {
          this.productDataSource.data = response.data;
          this.totalProducts = response.count;
        }
      },
      error: error => console.log(error)
    });
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if (response.data) {
          this.orderDataSource.data = response.data;
          this.totalOrderItems = response.count;
        }
      },
      error: error => console.log(error)
    });
  }

  onPageChange(event: PageEvent){
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onSearchChange() {
    this.productParams.pageNumber = 1;
    this.loadProducts();
  }

  handleProductPageEvent(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  }

  handleOrderPageEvent(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.productParams.sort = selectedOption.value;
      this.productParams.pageNumber = 1;
      this.loadProducts();
    }
  }

  onFilterSelect(event: MatSelectChange) {
    this.orderParams.status = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to issue this refund? This cannot be undone'
    );

    if (confirmed) this.refundOrder(id);
  }

  async openDeleteDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm deletion',
      'Are you sure you want to delete this product? This cannot be undone'
    );

    if (confirmed) this.deleteProduct(id);
  }

  deleteProduct(id: number){
    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        this.snack.success('Product deleted successfully!');
        this.loadProducts(); 
      },
      error: err => {
        console.error('Error deleting product', err);
        this.snack.error('Failed to delete product.');
      }
    });;
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.orderDataSource.data = this.orderDataSource.data.map(o => (o.id === id ? order : o));
      }
    });
  }
}
