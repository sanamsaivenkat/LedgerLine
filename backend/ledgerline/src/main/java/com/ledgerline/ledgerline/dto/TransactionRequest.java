package com.ledgerline.ledgerline.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

public record TransactionRequest(

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.00", inclusive = false,
            message = "Amount must be greater than zero")
    @Digits(integer = 17, fraction = 2,
            message = "Amount can have at most two decimal places")
    BigDecimal amount

) {}