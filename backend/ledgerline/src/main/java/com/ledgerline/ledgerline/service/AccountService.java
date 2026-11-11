
package com.ledgerline.ledgerline.service;

import java.security.SecureRandom;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ledgerline.ledgerline.audit.AuditLog;
import com.ledgerline.ledgerline.audit.AuditLogRepository;
import com.ledgerline.ledgerline.entity.Account;
import com.ledgerline.ledgerline.entity.AppUser;
import com.ledgerline.ledgerline.repository.AccountRepository;
import com.ledgerline.ledgerline.repository.AppUserRepository;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final AppUserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    private static final SecureRandom RANDOM = new SecureRandom();

    public AccountService(
            AccountRepository accountRepository,
            AppUserRepository userRepository,
            AuditLogRepository auditLogRepository) {

        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Account createAccount(String accountHolderName, UUID userId) {

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

        AppUser owner = userRepository.findById(userId)
                .orElseThrow(() ->
                        new NoSuchElementException("User not found"));

        String accountNumber = generateUniqueAccountNumber();

        Account account = new Account(
                accountNumber,
                holderName,
                owner
        );

        Account savedAccount = accountRepository.save(account);

        AuditLog auditLog = new AuditLog(
                userId,
                savedAccount.getId(),
                "ACCOUNT_CREATED",
                null
        );

        auditLogRepository.save(auditLog);

        return savedAccount;
    }

    @Transactional(readOnly = true)
    public List<Account> getAccounts(UUID userId) {
        return accountRepository
                .findAllByOwner_IdOrderByCreatedAtDesc(userId);
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
