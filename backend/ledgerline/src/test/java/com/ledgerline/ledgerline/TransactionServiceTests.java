
package com.ledgerline.ledgerline;

import com.ledgerline.ledgerline.audit.AuditLog;
import com.ledgerline.ledgerline.audit.AuditLogRepository;
import com.ledgerline.ledgerline.entity.Account;
import com.ledgerline.ledgerline.entity.AppUser;
import com.ledgerline.ledgerline.repository.AccountRepository;
import com.ledgerline.ledgerline.service.TransactionService;
import com.ledgerline.ledgerline.transaction.Transaction;
import com.ledgerline.ledgerline.transaction.TransactionRepository;
import com.ledgerline.ledgerline.transaction.TransactionType;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTests {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private TransactionService transactionService;

    private final UUID userId =
            UUID.fromString("50009149-afa3-416b-b0f4-0f5965ad3a4c");

    private final UUID anotherUserId = UUID.randomUUID();

    private Account createAccount() {

        AppUser owner = new AppUser(
                "test@example.com",
                "password-hash"
        );

        return new Account(
                "123456789012",
                "Test User",
                owner
        );
    }

    // Test 1: Successful deposit by account owner
    @Test
    void shouldDepositSuccessfully() {

        Account account = createAccount();
        account.deposit(new BigDecimal("100.00"));

        when(accountRepository.findByIdAndOwnerIdForUpdate(
                account.getId(), userId))
                .thenReturn(Optional.of(account));

        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction transaction = transactionService.deposit(
                account.getId(), userId, new BigDecimal("50.00")
        );

        assertEquals(TransactionType.DEPOSIT,
                transaction.getTransactionType());

        assertEquals(0, account.getBalance().compareTo(
                new BigDecimal("150.00")));

        assertEquals(0, transaction.getBalanceAfter().compareTo(
                new BigDecimal("150.00")));

        verify(transactionRepository).save(any(Transaction.class));
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    // Test 2: Successful withdrawal by account owner
    @Test
    void shouldWithdrawSuccessfully() {

        Account account = createAccount();
        account.deposit(new BigDecimal("100.00"));

        when(accountRepository.findByIdAndOwnerIdForUpdate(
                account.getId(), userId))
                .thenReturn(Optional.of(account));

        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction transaction = transactionService.withdraw(
                account.getId(), userId, new BigDecimal("40.00")
        );

        assertEquals(TransactionType.WITHDRAWAL,
                transaction.getTransactionType());

        assertEquals(0, account.getBalance().compareTo(
                new BigDecimal("60.00")));

        verify(transactionRepository).save(any(Transaction.class));
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    // Test 3: Reject withdrawal with insufficient balance
    @Test
    void shouldRejectWithdrawalWithInsufficientBalance() {

        Account account = createAccount();
        account.deposit(new BigDecimal("100.00"));

        when(accountRepository.findByIdAndOwnerIdForUpdate(
                account.getId(), userId))
                .thenReturn(Optional.of(account));

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.withdraw(
                        account.getId(), userId,
                        new BigDecimal("200.00")
                ));

        assertEquals(0, account.getBalance().compareTo(
                new BigDecimal("100.00")));

        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // Test 4: Reject zero transaction amount
    @Test
    void shouldRejectZeroAmount() {

        UUID accountId = UUID.randomUUID();

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.deposit(
                        accountId, userId, BigDecimal.ZERO
                ));

        verify(accountRepository, never())
                .findByIdAndOwnerIdForUpdate(any(), any());

        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // Test 5: Reject negative transaction amount
    @Test
    void shouldRejectNegativeAmount() {

        UUID accountId = UUID.randomUUID();

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.deposit(
                        accountId, userId,
                        new BigDecimal("-50.00")
                ));

        verify(accountRepository, never())
                .findByIdAndOwnerIdForUpdate(any(), any());

        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // Test 6: Reject deposit by a different user
    @Test
    void shouldRejectDepositByNonOwner() {

        Account account = createAccount();

        when(accountRepository.findByIdAndOwnerIdForUpdate(
                account.getId(), anotherUserId))
                .thenReturn(Optional.empty());

        assertThrows(java.util.NoSuchElementException.class,
                () -> transactionService.deposit(
                        account.getId(), anotherUserId,
                        new BigDecimal("50.00")
                ));

        assertEquals(0, account.getBalance().compareTo(BigDecimal.ZERO));

        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // Test 7: Reject withdrawal by a different user
    @Test
    void shouldRejectwithdrawalByNonOwner() {

        Account account = createAccount();
        account.deposit(new BigDecimal("100.00"));

        when(accountRepository.findByIdAndOwnerIdForUpdate(
                account.getId(), anotherUserId))
                .thenReturn(Optional.empty());

        assertThrows(java.util.NoSuchElementException.class,
                () -> transactionService.withdraw(
                        account.getId(), anotherUserId,
                        new BigDecimal("40.00")
                ));

        assertEquals(0, account.getBalance().compareTo(
                new BigDecimal("100.00")));

        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // Test 8: Reject transaction history access by a different user
    @Test
    void shouldRejectTransactionHistoryAccessByNonOwner() {

        UUID accountId = UUID.randomUUID();

        when(accountRepository.existsByIdAndOwner_Id(
                accountId, anotherUserId))
                .thenReturn(false);

        assertThrows(java.util.NoSuchElementException.class,
                () -> transactionService.getTransactionHistory(
                        accountId, anotherUserId
                ));

        verify(transactionRepository, never())
                .findByAccountIdOrderByCreatedAtDesc(any());
    }

    // Test 9: Allow transaction history access by account owner
    @Test
    void shouldAllowTransactionHistoryAccessByOwner() {

        UUID accountId = UUID.randomUUID();

        when(accountRepository.existsByIdAndOwner_Id(
                accountId, userId))
                .thenReturn(true);

        when(transactionRepository.findByAccountIdOrderByCreatedAtDesc(
                accountId))
                .thenReturn(List.of());

        List<Transaction> history =
                transactionService.getTransactionHistory(
                        accountId, userId
                );

        assertNotNull(history);
        assertTrue(history.isEmpty());

        verify(transactionRepository)
                .findByAccountIdOrderByCreatedAtDesc(accountId);

        verifyNoInteractions(auditLogRepository);
    }
}
