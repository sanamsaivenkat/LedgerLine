package com.ledgerline.ledgerline.dto;

import java.util.UUID;

public record AuthResponse(
    UUID userId,
    String email,
    String message
) {
}