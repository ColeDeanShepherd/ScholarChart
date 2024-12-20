import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>SQL Server Transaction Isolation Levels</h1>
  <ul>
    <li>
      READ UNCOMMITTED
      Behavior: The transaction can read data that other transactions have modified but not yet committed (dirty reads). This means you might read values that could be rolled back later.
      Performance: Fastest because it avoids locking, allowing maximum concurrency.
      Use Case: When performance is more important than accuracy (e.g., quick reporting or data analysis where stale/incorrect data is acceptable).
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
    </li>
    <li>
      READ COMMITTED (Default Isolation Level)
      Behavior: Ensures only committed data is read. SQL Server places shared locks on data while reading and releases them immediately after reading.
      Performance: Good balance between consistency and concurrency.
      Use Case: Most general-purpose applications, as it avoids dirty reads without significant locking overhead.
      SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    </li>
    <li>
      REPEATABLE READ
      Behavior: Ensures that if data is read multiple times within a transaction, it will remain unchanged. SQL Server holds shared locks on all data read by the transaction until it completes.
      Performance: More restrictive than READ COMMITTED, as it locks data longer, reducing concurrency.
      Use Case: When the application requires consistent data for multiple reads within the same transaction (e.g., complex calculations or reporting).
      SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    </li>
    <li>
      SNAPSHOT
      Behavior: Provides a snapshot of the data as it existed at the start of the transaction. It uses versioning rather than locks, allowing other transactions to continue modifying data.
      Performance: High concurrency, as no locks are used. However, it requires extra storage for versioning.
      Use Case: Ideal for long-running read-only transactions or scenarios requiring full consistency without blocking other transactions (e.g., reporting or analytics).
      ALTER DATABASE YourDatabase SET ALLOW_SNAPSHOT_ISOLATION ON;
      SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
    </li>
    <li>
      SERIALIZABLE
      Behavior: The most restrictive isolation level. It ensures complete consistency by preventing dirty reads, non-repeatable reads, and phantom reads. SQL Server locks the data and the range of rows being read or written, effectively serializing transactions.
      Performance: The most restrictive and slowest, as it holds locks on data and range locks for potential rows that could be inserted.
      Use Case: Critical operations requiring maximum accuracy (e.g., financial transactions, inventory systems).
      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    </li>
  </ul>
`;
