import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService)
  const snackBar = inject(SnackbarService)
  
  if(!cartService.cart() || cartService.cart()?.items.length === 0){
    snackBar.error("Your cart is empty")
    return of(false);
  }
  
  return true;
};
