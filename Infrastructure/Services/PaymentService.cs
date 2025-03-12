using System;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config, ICartService cartService, 
IUnitOfWork unit) : IPaymentService
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:Secretkey"];
        var cart = await cartService.GetCartAsync(cartId)
          ?? throw new Exception("Cart unavailable");

        var shippingPrice = await GetShippingPriceAsync(cart) ?? 0;

        await ValidateCartItemsInCartAsync(cart);

        var subtotal = CalculateSubtotal(cart);

         if (cart.Coupon != null)
        {
            subtotal = await ApplyDiscountAsync(cart.Coupon, subtotal);
        }
         var total = subtotal + shippingPrice;

        
        await CreateUpdatePaymentIntentAsync(cart, total);
        await cartService.SetCartAsync(cart);
        return cart;
    }

     private async Task CreateUpdatePaymentIntentAsync(ShoppingCart cart, long amount)
    {
        var service = new PaymentIntentService();
        
        
        if(string.IsNullOrEmpty(cart.PaymentIntetId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "usd", 
                PaymentMethodTypes = ["card"]
            };
            var intent = await service.CreateAsync(options);
            cart.PaymentIntetId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
               Amount = amount
            };
            await service.UpdateAsync(cart.PaymentIntetId, options);
        }
    }
    private async Task<long> ApplyDiscountAsync(AppCoupon appCoupon, long amount)
    {
        var couponService = new Stripe.CouponService();
        var coupon = await couponService.GetAsync(appCoupon.CouponId);
        if (coupon.AmountOff.HasValue)
        {
            amount -= (long)coupon.AmountOff * 100;
        }
        if (coupon.PercentOff.HasValue)
        {
            var discount = amount * (coupon.PercentOff.Value / 100);
            amount -= (long)discount;
        }
        return amount;
    }
    private long CalculateSubtotal(ShoppingCart cart)
    {
        var subtotal = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)); 
        return subtotal;
    }
    private async Task ValidateCartItemsInCartAsync(ShoppingCart cart)
    {
    // hint: throw exception if missing product
        
        
            foreach( var item in cart.Items )
            {
                var productItem = await unit.Repository<Core.Entities.Product>().GetByIdAsync(item.ProductId);
                if( productItem == null ) throw new Exception("Product is missing");
                if(item.Price != productItem.Price )
                {
                    item.Price = productItem.Price;
                }
                
            }
            
    }

    private async Task<long?> GetShippingPriceAsync(ShoppingCart cart)
    { 
        if(cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod == null) throw  new Exception("Delivery method is not valid");

            return (long)deliveryMethod.Price * 100;
        }
        return null;
    }
}
