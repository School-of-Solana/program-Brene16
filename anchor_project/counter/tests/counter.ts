import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import * as assert from "assert";

describe("counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;
  const user = provider.wallet;

  let counterPda: anchor.web3.PublicKey;
  let counterBump: number;

  before(async () => {
    [counterPda, counterBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("counter"), user.publicKey.toBuffer()],
      program.programId
    );
  });

  // ====================
  // Initialize
  // ====================
  it("Initialize counter", async () => {
    await program.methods
      .initialize()
      .accounts({
        counter: counterPda,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.counter.fetch(counterPda);
    assert.equal(account.count.toNumber(), 0);
    assert.equal(account.authority.toBase58(), user.publicKey.toBase58());
  });

  it("Initialize counter: already initialized", async () => {
    try {
      await program.methods
        .initialize()
        .accounts({
          counter: counterPda,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have thrown an error");
    } catch (err: any) {
      assert.ok(
        err.toString().includes("already in use") ||
        err.toString().includes("The account has already been initialized")
      );
    }
  });

  // ====================
  // Increment
  // ====================
  it("Increment counter", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterPda,
        authority: user.publicKey,
      })
      .rpc();

    const account = await program.account.counter.fetch(counterPda);
    assert.equal(account.count.toNumber(), 1);
  });

  it("Increment counter; overflow", async () => {
    // Set count to max u64 via helper
    await program.methods
      .setCount(new anchor.BN("18446744073709551615"))
      .accounts({
        counter: counterPda,
        authority: user.publicKey,
      })
      .rpc();

    try {
      await program.methods
        .increment()
        .accounts({
          counter: counterPda,
          authority: user.publicKey,
        })
        .rpc();
      assert.fail("Should have thrown overflow error");
    } catch (err: any) {
      assert.ok(err.toString().includes("Arithmetic overflow"));
    }
  });

  // ====================
  // Decrement
  // ====================
  it("Decrement counter", async () => {
    // Set count to 1
    await program.methods
      .setCount(new anchor.BN(1))
      .accounts({
        counter: counterPda,
        authority: user.publicKey,
      })
      .rpc();

    await program.methods
      .decrement()
      .accounts({
        counter: counterPda,
        authority: user.publicKey,
      })
      .rpc();

    const account = await program.account.counter.fetch(counterPda);
    assert.equal(account.count.toNumber(), 0);
  });

  it("Decrement counter;underflow", async () => {
    // Counter is 0 now
    try {
      await program.methods
        .decrement()
        .accounts({
          counter: counterPda,
          authority: user.publicKey,
        })
        .rpc();
      assert.fail("Should have thrown underflow error");
    } catch (err: any) {
      assert.ok(err.toString().includes("Arithmetic underflow"));
    }
  }); 
});
