import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shop.Params';
import { environment } from '../../../environments/environment';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams()

    if(shopParams.brands.length > 0){
      params = params.append('brands', shopParams.brands.join(','));
    }

    if(shopParams.types.length > 0){
      params = params.append('types', shopParams.types.join(','));
    }

    if(shopParams.sort){
      params = params.append('sort', shopParams.sort)
    }

    if(shopParams.search){
      params = params.append('search', shopParams.search)
    }

    params = params.append('pagesize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);
    
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {params})
  }

  getProduct(id: number){
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }


  getBrands() {
    if (this.brands.length > 0) return of(this.brands); // Use `of()` to return existing data immediately
    return this.http.get<string[]>(this.baseUrl + 'products/brands').pipe(
      tap(response => (this.brands = response)) // Store brands after fetching
    );
  }

  getTypes() {
    if (this.types.length > 0) return of(this.types);
    return this.http.get<string[]>(this.baseUrl + 'products/types').pipe(
      tap(response => (this.types = response))
    );
  }
}
