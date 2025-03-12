using System;
using System.Reflection.Metadata.Ecma335;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;



namespace Infrastructure.Services;

public class CouponService : ICouponService
{

    public CouponService(IConfiguration config)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
    }
    async Task<AppCoupon?> ICouponService.GetCouponFromPromoCode(string code)
    {
        var promotionService = new PromotionCodeService();

        var options = new PromotionCodeListOptions
        {
            Code = code,
        };

        var promotionCodes = await promotionService.ListAsync(options);
        var promotionCode = promotionCodes.FirstOrDefault();

        if(promotionCode != null && promotionCode.Coupon != null)
        {
            return new AppCoupon
            {
               Name = promotionCode.Coupon.Name,
               AmountOff = promotionCode.Coupon.AmountOff,
               PercentOff = promotionCode.Coupon.PercentOff,
               PromotionCode = promotionCode.Code,
               CouponId = promotionCode.Coupon.Id,
            };
        }
        
    
        return null;
    
    }
}
