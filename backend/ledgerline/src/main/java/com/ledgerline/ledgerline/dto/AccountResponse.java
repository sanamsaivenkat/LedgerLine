package com.ledgerline.ledgerline.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.ledgerline.ledgerline.entity.Account;

public record AccountResponse(
        UUID id,
        String accountNumber,
        String accountHolderName,
        BigDecimal balance,
        String status,
        Instant createdAt
) {

    public static AccountResponse from(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountHolderName(),
                account.getBalance(),
                account.getStatus().name(),
                account.getCreatedAt()
        );
    }
}