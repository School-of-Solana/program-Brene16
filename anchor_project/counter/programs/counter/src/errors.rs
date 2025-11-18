use anchor_lang::prelude::*;

#[error_code]
pub enum CounterError {
    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,
    
    #[msg("Arithmetic underflow occurred")]
    ArithmeticUnderflow,
    
    #[msg("Unauthorized access to counter")]
    Unauthorized,
}