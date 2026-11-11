
package com.ledgerline.ledgerline.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ledgerline.ledgerline.entity.Account;

import jakarta.persistence.LockModeType;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByIdAndOwner_Id(UUID accountId, UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT a FROM Account a
            WHERE a.id = :accountId
            AND a.owner.id = :userId
            """)
    Optional<Account> findByIdAndOwnerIdForUpdate(
            @Param("accountId") UUID accountId,
            @Param("userId") UUID userId
    );
}
