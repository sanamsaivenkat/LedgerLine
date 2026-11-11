
package com.ledgerline.ledgerline;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ledgerline.ledgerline.audit.AuditLog;
import com.ledgerline.ledgerline.audit.AuditLogRepository;
import com.ledgerline.ledgerline.entity.Account;
import com.ledgerline.ledgerline.entity.AppUser;
import com.ledgerline.ledgerline.repository.AccountRepository;
import com.ledgerline.ledgerline.repository.AppUserRepository;
import com.ledgerline.ledgerline.service.AccountService;

@ExtendWith(MockitoExtension.class)
class LedgerlineApplicationTests {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AccountService accountService;

    private final UUID userId =
            UUID.fromString("50009149-afa3-416b-b0f4-0f5965ad3a4c");

    // Test 1: Account creation works and assigns the owner
    @Test
    void shouldCreateAccountSuccessfully() {

        AppUser user = new AppUser("test@example.com", "password-hash");

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(accountRepository.existsByAccountNumber(anyString()))
                .thenReturn(false);

        when(accountRepository.save(any(Account.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Account account = accountService.createAccount("Test User", userId);

        assertEquals("Test User", account.getAccountHolderName());
        assertEquals(0, account.getBalance().compareTo(BigDecimal.ZERO));
        assertEquals("ACTIVE", account.getStatus().name());
        assertEquals(user, account.getOwner());

        verify(accountRepository).save(any(Account.class));

        // Verify audit record is saved
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    // Test 2: Empty account holder name is rejected
    @Test
    void shouldRejectEmptyAccountHolderName() {

        assertThrows(IllegalArgumentException.class,
                () -> accountService.createAccount("   ", userId));

        verify(userRepository, never()).findById(any());
        verify(accountRepository, never()).save(any(Account.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // Test 3: Name longer than 100 characters is rejected
    @Test
    void shouldRejectNameLongerThan100Characters() {

        String longName = "A".repeat(101);

        assertThrows(IllegalArgumentException.class,
                () -> accountService.createAccount(longName, userId));

        verify(userRepository, never()).findById(any());
        verify(accountRepository, never()).save(any(Account.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // Test 4: Account creation is rejected for an unknown user
    @Test
    void shouldRejectAccountCreationForUnknownUser() {

        when(userRepository.findById(userId))
                .thenReturn(Optional.empty());

        assertThrows(java.util.NoSuchElementException.class,
                () -> accountService.createAccount("Test User", userId));

        verify(accountRepository, never()).save(any(Account.class));
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }
}
