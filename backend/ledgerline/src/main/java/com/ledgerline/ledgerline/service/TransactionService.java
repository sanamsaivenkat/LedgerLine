
package com.ledgerline.ledgerline.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ledgerline.ledgerline.audit.AuditLog;
import com.ledgerline.ledgerline.audit.AuditLogRepository;
import com.ledgerline.ledgerline.entity.Account;
import com.ledgerline.ledgerline.entity.AccountStatus;
import com.ledgerline.ledgerline.repository.AccountRepository;
import com.ledgerline.ledgerline.transaction.Transaction;
import com.ledgerline.ledgerline.transaction.TransactionRepository;
import com.ledgerline.ledgerline.transaction.TransactionType;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AuditLogRepository auditLogRepository;

    public TransactionService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            AuditLogRepository auditLogRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Transaction deposit(
            UUID accountId,
            UUID userId,
            BigDecimal amount) {

        validateAmount(amount);

        Account account = getActiveAccount(accountId, userId);
        account.deposit(amount);

        Transaction transaction = new Transaction(
                account.getId(),
                TransactionType.DEPOSIT,
                amount,
                account.getBalance()
        );

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        AuditLog auditLog = new AuditLog(
                userId,
                account.getId(),
                "DEPOSIT",
                amount
        );

        auditLogRepository.save(auditLog);

        return savedTransaction;
    }

    @Transactional
    public Transaction withdraw(
            UUID accountId,
            UUID userId,
            BigDecimal amount) {

        validateAmount(amount);

        Account account = getActiveAccount(accountId, userId);
        account.withdraw(amount);

        Transaction transaction = new Transaction(
                account.getId(),
                TransactionType.WITHDRAWAL,
                amount,
                account.getBalance()
        );

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        AuditLog auditLog = new AuditLog(
                userId,
                account.getId(),
                "WITHDRAWAL",
                amount
        );

        auditLogRepository.save(auditLog);

        return savedTransaction;
    }

    @Transactional(readOnly = true)
    public List<Transaction> getTransactionHistory(
            UUID accountId,
            UUID userId) {

        boolean accountBelongsToUser =
                accountRepository.existsByIdAndOwner_Id(accountId, userId);

        if (!accountBelongsToUser) {
            throw new NoSuchElementException("Account not found");
        }

        return transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(accountId);
    }

    private Account getActiveAccount(UUID accountId, UUID userId) {

        Account account = accountRepository
                .findByIdAndOwnerIdForUpdate(accountId, userId)
                .orElseThrow(() ->
                        new NoSuchElementException("Account not found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }

        return account;
    }

    private void validateAmount(BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Transaction amount must be greater than zero");
        }

        if (amount.scale() > 2) {
            throw new IllegalArgumentException(
                    "Transaction amount cannot have more than two decimal places");
        }
    }
}
