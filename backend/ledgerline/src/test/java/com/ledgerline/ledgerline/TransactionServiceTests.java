
package com.ledgerline.ledgerline;

import com.ledgerline.ledgerline.entity.Account;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTests {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    // Test 1: Successful deposit
    @Test
    void shouldDepositSuccessfully() {

        Account account = new Account("123456789012", "Test User");
        account.deposit(new BigDecimal("100.00"));

        when(accountRepository.findByIdForUpdate(account.getId()))
                .thenReturn(Optional.of(account));

        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction transaction = transactionService.deposit(
                account.getId(), new BigDecimal("50.00"));

        assertEquals(TransactionType.DEPOSIT,
                transaction.getTransactionType());

        assertEquals(0, account.getBalance().compareTo(
                new BigDecimal("150.00")));

        assertEquals(0, transaction.getBalanceAfter().compareTo(
                new BigDecimal("150.00")));

        verify(transactionRepository).save(any(Transaction.class));
    }

    // Test 2: Successful withdrawal
    @Test
    void shouldWithdrawSuccessfully() {

        Account account = new Account("123456789012", "Test User");
        account.deposit(new BigDecimal("100.00"));

        when(accountRepository.findByIdForUpdate(account.getId()))
                .thenReturn(Optional.of(account));

        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction transaction = transactionService.withdraw(
                account.getId(), new BigDecimal("40.00"));

        assertEquals(TransactionType.WITHDRAWAL,
                transaction.getTransactionType());

        assertEquals(0, account.getBalance().compareTo(
                new BigDecimal("60.00")));

        verify(transactionRepository).save(any(Transaction.class));
    }

    // Test 3: Reject withdrawal with insufficient balance
    @Test
    void shouldRejectWithdrawalWithInsufficientBalance() {

        Account account = new Account("123456789012", "Test User");
        account.deposit(new BigDecimal("100.00"));

        when(accountRepository.findByIdForUpdate(account.getId()))
                .thenReturn(Optional.of(account));

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.withdraw(
                        account.getId(), new BigDecimal("200.00")));

        assertEquals(0, account.getBalance().compareTo(
                new BigDecimal("100.00")));

        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    // Test 4: Reject zero transaction amount
    @Test
    void shouldRejectZeroAmount() {

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.deposit(
                        java.util.UUID.randomUUID(), BigDecimal.ZERO));

        verify(accountRepository, never()).findByIdForUpdate(any());
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    // Test 5: Reject negative transaction amount
    @Test
    void shouldRejectNegativeAmount() {

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.deposit(
                        java.util.UUID.randomUUID(), new BigDecimal("-50.00")));

        verify(accountRepository, never()).findByIdForUpdate(any());
        verify(transactionRepository, never()).save(any(Transaction.class));
    }
}
