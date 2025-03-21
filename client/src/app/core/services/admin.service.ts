import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OrderParams } from '../../shared/models/orderParams';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Order } from '../../shared/models/order';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ProductParams } from '../../shared/models/productParams';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getProducts(productParams: ProductParams) {
    let params = new HttpParams();
    if (productParams.search) {
      params = params.append('search', productParams.search);
    }
    if (productParams.sort) {
      params = params.append('sort', productParams.sort);
    }
    productParams.brands.forEach(brand => {
      params = params.append('brands', brand);
    });
    productParams.types.forEach(type => {
      params = params.append('types', type);
    });
    params = params.append('pageIndex', productParams.pageNumber);
    params = params.append('pageSize', productParams.pageSize);

    return this.http.get<Pagination<Product>>(`${this.baseUrl}products`, { params });
  }

  
  getProduct(id: number) {
    return this.http.get<Product>(`${this.baseUrl}products/${id}`);
  }

  
  createProduct(product: Product) {
    return this.http.post<Product>(`${this.baseUrl}products`, product);
  }

  
  updateProduct(id: number, product: Product) {
    return this.http.put(`${this.baseUrl}products/${id}`, product);
  }

  
  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}products/${id}`);
  }

  getOrders(orderParams: OrderParams){
    let params = new HttpParams();
    if(orderParams.status && orderParams.status !== 'All') {
      params = params.append('status', orderParams.status)
    }
    params = params.append('pageIndex', orderParams.pageNumber);
    params = params.append('pageSize', orderParams.pageSize);

    return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', {params});
  }

  getOrder(id: number) {
    return this.http.get<Order>(this.baseUrl + 'admin/orders/' + id);
  }

  refundOrder(id: number) {
    return this.http.post<Order>(this.baseUrl + 'admin/orders/refund/' + id, {});
  }
  
}
