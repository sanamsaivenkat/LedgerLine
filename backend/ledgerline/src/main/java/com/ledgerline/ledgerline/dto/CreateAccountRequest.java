package com.ledgerline.ledgerline.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAccountRequest(

        @NotBlank(message = "Account holder name is required")
        @Size(max = 100, message = "Name cannot exceed 100 characters")
        String accountHolderName

) {
}