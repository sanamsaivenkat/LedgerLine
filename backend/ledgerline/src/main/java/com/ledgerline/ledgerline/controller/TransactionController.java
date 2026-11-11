
package com.ledgerline.ledgerline.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ledgerline.ledgerline.dto.TransactionRequest;
import com.ledgerline.ledgerline.service.TransactionService;
import com.ledgerline.ledgerline.transaction.Transaction;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts/{accountId}")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    @ResponseStatus(HttpStatus.CREATED)
    public Transaction deposit(
            @PathVariable UUID accountId,
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());

        return transactionService.deposit(
                accountId,
                userId,
                request.amount()
        );
    }

    @PostMapping("/withdraw")
    @ResponseStatus(HttpStatus.CREATED)
    public Transaction withdraw(
            @PathVariable UUID accountId,
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());

        return transactionService.withdraw(
                accountId,
                userId,
                request.amount()
        );
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactionHistory(
            @PathVariable UUID accountId,
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());

        return transactionService.getTransactionHistory(
                accountId,
                userId
        );
    }
}
