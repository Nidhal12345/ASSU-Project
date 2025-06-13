package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.productRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public Session createSession(productRequest productRequest) throws StripeException {

        ProductCreateParams productParams = ProductCreateParams.builder()
                .setName(productRequest.getName())
                .build();
        Product product = Product.create(productParams);


        PriceCreateParams priceParams = PriceCreateParams.builder()
                .setCurrency("eur")
                .setUnitAmount(productRequest.getAmount())
                .setRecurring(
                        PriceCreateParams.Recurring.builder()
                                .setInterval(PriceCreateParams.Recurring.Interval.DAY)
                                .build()
                )
                .setProduct(product.getId())
                .build();

        Price price = Price.create(priceParams);

        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                .setPrice(price.getId())
                .setQuantity(1L)
                .build();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .addLineItem(lineItem)

                .putMetadata("userId", String.valueOf(productRequest.getUserId()))
                .build();

        return Session.create(params);
    }
}
