use anchor_lang::prelude::*;

#[event]
pub struct CounterCreated {
    pub authority: Pubkey,
    pub counter: Pubkey,
    pub timestamp: i64,
}


#[event]
pub struct CounterIncremented {
    pub authority: Pubkey,
    pub counter: Pubkey,
    pub new_count: u64,
    pub timestamp: i64,
}

#[event]
pub struct CounterDecremented {
    pub authority: Pubkey,
    pub counter: Pubkey,
    pub new_count: u64,
    pub timestamp: i64,
}