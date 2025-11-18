# Counter Program (Solana + Anchor)
A  Solana program built using Anchor, implementing a secure, PDA-based counter for each user.
Every wallet gets a unique counter stored in a Program Derived Address (PDA), enabling safe and isolated state management on-chain.

# Overview
This program allows any user to create and manage their own on-chain counter.
The logic uses PDAs to ensure:

* A user can only access their counter
* A counter is automatically tied to the wallet that initialized it
* Unauthorized access is prevented by `has_one = authority` checks

The counter supports the following operations:

* Initialize (create counter at PDA)
* Increment
* Decrement
* Manually set the count
* Emit events after every update

# 🏗 Program Structure

```
program/src
 ├── lib.rs          // Main program with instructions
 ├── context.rs      // Account validation, PDA seeds, bumps
 ├── state.rs        // Counter account structure & sizing
 ├── errors.rs       // Custom error definitions
 └── events.rs       // Program events emitted on every action
```

# Counter Account Layout

```rust
#[account]
pub struct Counter {
    pub authority: Pubkey, // owner of the counter
    pub count: u64,        // current value
}

impl Counter {
    pub const SPACE: usize = 8 + 32 + 8;
}
```

* `8` = discriminator
* `32` = authority pubkey
* `8` = counter value

# PDA Derivation

Each counter is stored in a PDA derived as:

```
seeds = ["counter", user_pubkey]
```

This ensures:

* Each user can only have one counter
* Deterministic address — no need to store the PDA anywhere
* Only the authority can modify the counter (`has_one = authority`)


# Testing

This project includes full test coverage written in TypeScript and run using;

```bash
anchor test
```

**Happy Path Tests**

* Initialize counter
* Increment counter
* Decrement counter
* Set counter to a specific value

**Unhappy Path Tests**

* Re-initializing an existing counter
* Overflow when incrementing `u64::MAX`
* Underflow when decrementing `0`
* Unauthorized operations (handled by `has_one`)


# Deploying

Build the program:

```bash
anchor build
```

Deploy to Devnet:

```bash
anchor deploy
```