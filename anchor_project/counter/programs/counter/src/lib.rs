use anchor_lang::prelude::*;

declare_id!("Asfjdz55joSntTv9NKCSCXvRVhGEJ6CWguurNkokAF2j");

pub mod context;
pub mod state;
pub mod errors;
pub mod events;

use context::*;
use state::*;
use errors::CounterError;
use events::*;

#[program]
pub mod counter {
    use super::*;

    /// Initialize a counter for a user
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = ctx.accounts.user.key();
        counter.count = 0;
        
        emit!(CounterCreated {
            authority: ctx.accounts.user.key(),
            counter: counter.key(),
            timestamp: Clock::get()?.unix_timestamp
        });
        
        Ok(())
    }

    /// Increment the counter
    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        
        counter.count = counter.count.checked_add(1)
            .ok_or(CounterError::ArithmeticOverflow)?;
        
        emit!(CounterIncremented {
            authority: ctx.accounts.authority.key(),
            counter: counter.key(),
            new_count: counter.count,
            timestamp: Clock::get()?.unix_timestamp
        });
        
        Ok(())
    }

    /// Decrement the counter
    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        
        counter.count = counter.count.checked_sub(1)
            .ok_or(CounterError::ArithmeticUnderflow)?;
        
        emit!(CounterDecremented {
            authority: ctx.accounts.authority.key(),
            counter: counter.key(),
            new_count: counter.count,
            timestamp: Clock::get()?.unix_timestamp
        });
        
        Ok(())
    }

    pub fn set_count(ctx: Context<Update>, count: u64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        require!(
            ctx.accounts.authority.key() == counter.authority,
            CounterError::Unauthorized
        );
        counter.count = count;
        Ok(())
    }
}