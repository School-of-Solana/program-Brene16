# Project Description

**Deployed Frontend URL** `https://counter-frontend-a9ar.vercel.app/`

**Solana Program ID** `Asfjdz55joSntTv9NKCSCXvRVhGEJ6CWguurNkokAF2j`

## Project Overview

### Description
This project is a simple Solana dApp built using the Anchor framework.
It allows each user to create their own PDA-based counter, which they can increment, decrement, or set manually. The counter is stored in a Program Derived Address unique to each wallet, ensuring that every user has their own isolated state.

### Key Features
1. **Per-User PDA Counter** - Every wallet creates and manages its own counter account.

2. **Safe Increments & Decrements** - Built-in checks prevent arithmetic overflow and underflow.

3. **Manual Count Setting** - Users can set the counter to any value, as long as they’re the authorized owner.

4. **Event Emission** - The program emits events each time the counter is created or updated.


### How to Use the dApp
1. The user connects their Solana wallet (Phantom) on the frontend.

2. Click on initialize to initialize the counter. This creates a PDA counter tied to your wallet

3. Click on the increment button

4. Click on the decrement  button

5.Enter any number and click Set Count. Only the counter’s owner can do this.

## Program Architecture
This Anchor program is organized into 4 modules:

* `context.rs` — Accounts and PDA constraints
* `state.rs` — Counter struct definition
* `errors.rs` — Custom error definitions
* `events.rs` — Emitted events for each action

The core logic lives in `lib.rs`.

The program exposes four instructions:

1. **initialize** – Creates a new counter PDA for the user.
2. **increment** – Adds 1 to the counter value.
3. **decrement** – Subtracts 1 from the counter value.
4. **set_count** – Manually sets the counter to any u64.

### PDA Usage
The program uses one PDA per user, derived from:

```
seeds = ["counter", user_pubkey]
```

The purpose of this PDA is to:

* Make each counter unique per user
* Prevent duplicate initialization
* Allow clients to derive the account address beforehand
* Enforce security through on-chain seed validation

**PDAs Used**

**Counter PDA** - It stores the user’s counter state (`authority` + `count`).

### Program Instructions
**1. `initialize()`**
Creates the user’s counter PDA. Count starts at 0. Emits `CounterCreated`.

**2. `increment()`**
Adds 1 to the existing count. Emits `CounterIncremented`.

**3. `decrement()`**
Subtracts 1 from the count, if not already zero. Emits `CounterDecremented`.

**4. `set_count(count: u64)`**
Allows the owner to set an arbitrary count value. Includes an authority check.

### Account Structure
```rust
#[account]
pub struct Counter {
    pub authority: Pubkey, // The owner of the counter
    pub count: u64,        // Current counter value
}
```

## Testing

### Test Coverage
The project includes thorough Anchor TypeScript tests covering both success and failure scenarios.

## **Happy Path Tests**

* **Initialize Counter** - Ensures the counter PDA is created correctly with initial count = 0.

* **Increment Counter** - Verifies count increases from 0 → 1.

* **Decrement Counter** - Checks count decreases safely from 1 → 0.

* **Set Count** - Used internally to prepare state for overflow/underflow tests.

## **Unhappy Path Tests**

* **Initialize Twice** - Attempts to create the counter again and expects an “already in use” error.

* **Overflow on Increment** - Sets count to `u64::MAX` and verifies increment fails with `"Arithmetic overflow"`.

* **Underflow on Decrement** - Attempts to decrement when count is 0 and expects `"Arithmetic underflow"`.

### Running Tests
```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators
Writing comprehensive tests for both success and failure cases taught me the importance of thinking about edge cases from the beginning. The arithmetic overflow/underflow tests were particularly educational.