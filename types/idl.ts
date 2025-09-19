
// Fix: Export the IDL as a const object and derive the type from it.
// This provides stronger typing and ensures compatibility with Anchor's Program class.
export const idl = {
  "version": "0.1.0",
  "name": "solana_raffle_contract",
  "instructions": [
    {
      "name": "initializeRaffle",
      "accounts": [
        {
          "name": "raffle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierId",
          "type": "string"
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "raffle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "slotHashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierId",
          "type": "string"
        }
      ]
    },
    {
      "name": "distributePrize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "raffle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "winner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "winnerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "opsWallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "opsAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "burnWallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "burnAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierId",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "RaffleAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "tierId",
            "type": "string"
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "participants",
            "type": {
              "array": [
                "publicKey",
                12
              ]
            }
          },
          {
            "name": "participantsCount",
            "type": "u8"
          },
          {
            "name": "winner",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": {
              "defined": "RaffleStatus"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "RaffleStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Closed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "RaffleFull",
      "msg": "This raffle is already full."
    },
    {
      "code": 6001,
      "name": "RaffleNotOpen",
      "msg": "This raffle is not open for ticket purchases."
    },
    {
      "code": 6002,
      "name": "RaffleNotClosed",
      "msg": "This raffle is not closed for prize distribution."
    },
    {
      "code": 6003,
      "name": "InvalidWinner",
      "msg": "The provided winner does not match the stored winner."
    },
    {
      "code": 6004,
      "name": "InvalidRaffleAccount",
      "msg": "The provided raffle account does not match the tier ID."
    },
    {
      "code": 6005,
      "name": "InvalidTier",
      "msg": "The provided tier ID is not valid."
    },
    {
      "code": 6006,
      "name": "SlotHashesUnavailable",
      "msg": "Slot hashes sysvar is not yet available."
    }
  ]
} as const;

export type SolanaRaffleContract = typeof idl;
