import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'card'
})
export class CardPipe implements PipeTransform {

  transform(value?: ConfirmationToken['payment_method_preview'], ...args: unknown[]): unknown {
    if(value?.card){
      const {brand, exp_month, exp_year, funding, last4} = value.card;
      return `${brand.toUpperCase()} **** **** **** ${last4}, ${funding} card, Exp: ${exp_month}/${exp_year}`;

  } else {
    return 'Unknown payment method'
  }
    }
  }


