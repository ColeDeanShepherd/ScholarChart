import './style.css';

// think about all the ways to display this table-like data
// start making it look nice
// make it linkable
// make it shareable
// publish to social media

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>SQL Server Transaction Isolation Levels</h1>
  <p>These determine the degree to which one transaction is isolated from the effects of other concurrent transactions. Isolation levels help balance the trade-off between performance and consistency.</p>

  <h2>Terminology</h2>
  <ul>
    <li>Dirty Reads: Occur when a transaction reads data that has been modified by another transaction but not yet committed. This can lead to reading values that are later rolled back.</li>
    <li>Non-Repeatable Reads: Occur when a transaction reads the same row multiple times and gets different values due to other transactions modifying the data.</li>
    <li>Phantom Reads: Occur when a transaction reads a range of rows multiple times and gets different results due to other transactions inserting/removing rows at the same time..</li>
  </ul>

  <table>
    <thead>
      <tr>
        <th>Isolation Level</th>
        <th>Behavior</th>
        <th>Dirty Reads</th>
        <th>Non-Repeatable Reads</th>
        <th>Phantom Reads</th>
        <th>Concurrency Impact/Perf</th>
    </thead>

    <tbody>
      <tr>
        <td>READ UNCOMMITTED</td>
        <td>The transaction can read data that other transactions have modified but not yet committed (dirty reads). This means you might read values that could be rolled back later.</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>Fastest</td>
      </tr>
      <tr>
        <td>READ COMMITTED</td>
        <td>Ensures only committed data is read. SQL Server places shared locks on data while reading and releases them immediately after reading. This is the default isolation level.</td>
        <td>No</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>Fast</td>
      </tr>
      <tr>
        <td>REPEATABLE READ</td>
        <td>Ensures that if data is read multiple times within a transaction, it will remain unchanged. SQL Server holds shared locks on all data read by the transaction until it completes.</td>
        <td>No</td>
        <td>No</td>
        <td>Yes</td>
        <td>Moderate</td>
      </tr>
      <tr>
        <td>SNAPSHOT</td>
        <td>Provides a snapshot of the data as it existed at the start of the transaction. It uses versioning rather than locks, allowing other transactions to continue modifying data.</td>
        <td>No</td>
        <td>No</td>
        <td>No</td>
        <td>Fast, but requires extra storage for snapshots of data.</td>
      </tr>
      <tr>
        <td>SERIALIZABLE</td>
        <td>The most restrictive isolation level. It ensures complete consistency by preventing dirty reads, non-repeatable reads, and phantom reads. SQL Server locks the data and the range of rows being read or written, effectively serializing transactions.</td>
        <td>No</td>
        <td>No</td>
        <td>No</td>
        <td>Slow</td>
      </tr>
    </tbody>
  </table>
`;
