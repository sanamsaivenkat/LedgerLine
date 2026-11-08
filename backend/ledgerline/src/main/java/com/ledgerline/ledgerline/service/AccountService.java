package com.ledgerline.ledgerline.service;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ledgerline.ledgerline.entity.Account;
import com.ledgerline.ledgerline.repository.AccountRepository;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    private static final SecureRandom RANDOM = new SecureRandom();

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Transactional
    public Account createAccount(String accountHolderName) {

        if (accountHolderName == null || accountHolderName.isBlank()) {
            throw new IllegalArgumentException(
                    "Account holder name cannot be empty"
            );
        }

        String holderName = accountHolderName.strip();

        if (holderName.length() > 100) {
            throw new IllegalArgumentException(
                    "Account holder name cannot exceed 100 characters"
            );
        }

        String accountNumber = generateUniqueAccountNumber();

        Account account = new Account(accountNumber, holderName);

        return accountRepository.save(account);
    }

    private String generateUniqueAccountNumber() {

        for (int attempt = 0; attempt < 10; attempt++) {

            String number = String.format(
                    "%012d",
                    RANDOM.nextLong(1_000_000_000_000L)
            );

            if (!accountRepository.existsByAccountNumber(number)) {
                return number;
            }
        }

        throw new IllegalStateException(
                "Unable to generate a unique account number"
        );
    }
}