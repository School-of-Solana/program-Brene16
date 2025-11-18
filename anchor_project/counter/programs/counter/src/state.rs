use anchor_lang::prelude::*;

/// Counter account storing the count and authority
#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
}

impl Counter {
    pub const SPACE: usize = 8 + 32 + 8;
}