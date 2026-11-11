
package com.ledgerline.ledgerline.audit;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    private UUID id;

    @Column(name = "actor_user_id", nullable = false)
    private UUID actorUserId;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(name = "action_type", nullable = false, length = 30)
    private String actionType;

    @Column(precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected AuditLog() {
    }

    public AuditLog(
            UUID actorUserId,
            UUID accountId,
            String actionType,
            BigDecimal amount) {

        this.id = UUID.randomUUID();
        this.actorUserId = actorUserId;
        this.accountId = accountId;
        this.actionType = actionType;
        this.amount = amount;
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public UUID getActorUserId() {
        return actorUserId;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public String getActionType() {
        return actionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
