
package com.ledgerline.ledgerline;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import com.ledgerline.ledgerline.entity.Account;
import com.ledgerline.ledgerline.repository.AccountRepository;
import com.ledgerline.ledgerline.service.AccountService;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class LedgerlineApplicationTests {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountService accountService;

    // Test 1: Spring Boot application starts successfully
    @Test
    void contextLoads() {
    }

    // Test 2: Account creation works successfully
    @Test
    void shouldCreateAccountSuccessfully() {

        when(accountRepository.existsByAccountNumber(anyString()))
                .thenReturn(false);

        when(accountRepository.save(any(Account.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Account account = accountService.createAccount("Test User");

        assertNotNull(account.getId());
        assertEquals("Test User", account.getAccountHolderName());
        assertEquals(0, account.getBalance().compareTo(
                java.math.BigDecimal.ZERO));
        assertEquals("ACTIVE", account.getStatus().name());

        verify(accountRepository).save(any(Account.class));
    }

    // Test 3: Empty account holder name is rejected
    @Test
    void shouldRejectEmptyAccountHolderName() {

        assertThrows(IllegalArgumentException.class,
                () -> accountService.createAccount("   "));

        verify(accountRepository, never()).save(any(Account.class));
    }

    // Test 4: Name longer than 100 characters is rejected
    @Test
    void shouldRejectNameLongerThan100Characters() {

        String longName = "A".repeat(101);

        assertThrows(IllegalArgumentException.class,
                () -> accountService.createAccount(longName));

        verify(accountRepository, never()).save(any(Account.class));
    }
}
