import logo from '../../logo.svg';
import { getCurQueryParams } from "../../web-lib";
import { IRoute } from '../../router';

interface ITransactionIsolationLevelInfo {
  nameHtml: string;
  preventsDirtyReads: boolean;
  preventsNonRepeatableReads: boolean;
  preventsPhantomReads: boolean;
  throughputRating: number;
  additionalIoAndTempDbUsageRating: number;
  useCasesRemarksHtml: string;
}

function boolToXOrCheckHtml(val: boolean): string {
  return `<span class="${val ? 'good-color' : 'bad-color'}"><i data-feather="${val ? 'check' : 'x'}"></i></span>`;
}

function ratingToBarsHtml(rating: number, maxRating: number, classNames?: string): string {
  const classes = classNames ? `v-rating ${classNames}` : 'v-rating';
  return `<div class="${classes}">${Array.from({ length: maxRating }, (_, i) => `<div class="v-rating-bar ${((maxRating - i) <= rating) ? '' : 'inactive'}"></div>`).join('')}</div>`;
}

function infoToTr(info: ITransactionIsolationLevelInfo): string {
  return (
    `<tr>
      <td>${info.nameHtml}</td>
      <td>${boolToXOrCheckHtml(info.preventsDirtyReads)}</td>
      <td>${boolToXOrCheckHtml(info.preventsNonRepeatableReads)}</td>
      <td>${boolToXOrCheckHtml(info.preventsPhantomReads)}</td>
      <td>${ratingToBarsHtml(info.throughputRating, 4, 'good')}</td>
      <td>${ratingToBarsHtml(info.additionalIoAndTempDbUsageRating, 2, 'bad')}</td>
      <td class="left-align">${info.useCasesRemarksHtml}</td>
    </tr>`);
}

export const sqlServerTransactionIsolationLevelsRoute: IRoute = {
  pathname: '/sql-server-transaction-isolation-levels',
  title: 'SQL Server Transaction Isolation Levels',
  renderFn: routeContainerElem => {
    const transactionIsolationLevels: ITransactionIsolationLevelInfo[] = [
      {
        nameHtml: 'READ UNCOMMITTED',
        preventsDirtyReads: false,
        preventsNonRepeatableReads: false,
        preventsPhantomReads: false,
        throughputRating: 4,
        additionalIoAndTempDbUsageRating: 0,
        useCasesRemarksHtml: `
          <ul>
            <li><u>Example Use</u>: Generating approximate reports in real-time dashboards.</li>
          </ul>
        `
      },
      {
        nameHtml: 'READ COMMITTED<br /><small><span class="no-word-break">(w/READ_COMMITTED_SNAPSHOT on)</span></small>',
        preventsDirtyReads: true,
        preventsNonRepeatableReads: false,
        preventsPhantomReads: false,
        throughputRating: 4,
        additionalIoAndTempDbUsageRating: 1,
        useCasesRemarksHtml: `
          <ul>
            <li><u>Example Use</u>: Typical OLTP workloads.</li>
            <li>The default isolation level in Azure SQL.</li>
            <li>Uses row versioning to prevent dirty reads without blocking.</li>
          </ul>
        `
      },
      {
        nameHtml: 'READ COMMITTED<br /><small><span class="no-word-break">(w/READ_COMMITTED_SNAPSHOT off)</span></small>',
        preventsDirtyReads: true,
        preventsNonRepeatableReads: false,
        preventsPhantomReads: false,
        throughputRating: 3,
        additionalIoAndTempDbUsageRating: 0,
        useCasesRemarksHtml: `
          <ul>
            <li><u>Example Use</u>: OLTP workloads where increased I/O &amp; TempDB usage is a problem.</li>
            <li>The default isolation level in SQL Server.</li>
            <li>Uses locks to prevent dirty reads.</li>
          </ul>
        `
      },
      {
        nameHtml: 'REPEATABLE READ',
        preventsDirtyReads: true,
        preventsNonRepeatableReads: true,
        preventsPhantomReads: false,
        throughputRating: 2,
        additionalIoAndTempDbUsageRating: 0,
        useCasesRemarksHtml: `
          <ul>
            <li><u>Example Use</u>: Financial applications calculating intermediate results based on multiple reads.</li>
          </ul>
        `
      },
      {
        nameHtml: 'SNAPSHOT',
        preventsDirtyReads: true,
        preventsNonRepeatableReads: true,
        preventsPhantomReads: true,
        throughputRating: 4,
        additionalIoAndTempDbUsageRating: 2,
        useCasesRemarksHtml: `
          <ul>
            <li>
              <u>Example Uses</u>:
              <ul>
                <li>Reporting and analytics workloads requiring a consistent snapshot of data.</li>
                <li>Ensuring application sees stable/coherent snapshots when querying change-tracked data.</li>
              </ul>
            </li>
            <li>Uses versioning to provide a consistent view of data from start of transaction without blocking.</li>
          </ul>
        `
      },
      {
        nameHtml: 'SERIALIZABLE',
        preventsDirtyReads: true,
        preventsNonRepeatableReads: true,
        preventsPhantomReads: true,
        throughputRating: 1,
        additionalIoAndTempDbUsageRating: 0,
        useCasesRemarksHtml: `
          <ul>
            <li><u>Example Use</u>: Financial applications where transactions involve critical integrity constraints.</li>
            <li>Behaves like only one transaction can access data at a time.</li>
          </ul>
        `
      }
    ];

    const tableHtml = `
      <table class="striped">
        <thead>
          <tr>
            <th>Isolation Level</th>
            <th>Prevents Dirty Reads?</th>
            <th>Prevents Non-Repeatable Reads?</th>
            <th>Prevents Phantom Reads?</th>
            <th>Degree of Concurrency</th>
            <th>Additional I/O &amp; TempDB Usage</th>
            <th>Use-Cases &amp; Remarks</th>
        </thead>

        <tbody>
          ${transactionIsolationLevels.map(infoToTr).join('')}
        </tbody>
      </table>`;

    routeContainerElem.innerHTML = `
      <div class="sql-server-transaction-isolation-levels">
        <h1>Azure SQL/SQL Server Transaction Isolation Levels</h1>
        <p>Control how one transaction is affected by others executing concurrently, balancing concurrency and data consistency.</p>

        <article>
          <h3><u>Read Phenomena</u>: Artifacts in read data due to isolation level</h3>
          <ul>
            <li><span class="bold underline">Dirty Read</span>: Reading uncommitted changes from other transactions that could be rolled back later.</li>
            <li><span class="bold underline">Non-Repeatable Read</span>: Getting different values when re-reading the same row due to updates by other transactions.</li>
            <li><span class="bold underline">Phantom Read</span>: Seeing new or missing rows when re-reading a range due to inserts/deletes by other transactions.</li>
          </ul>
        </article>

        ${tableHtml}

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="logo-with-name"><img src="${logo}" alt="ScholarChart" /> ScholarChart.com</div>
          <div>v3 (Dec. 27, 2024)</div>
        </div>
        
        <p class="sources hide-in-screenshot" style="margin-top: 2rem;">Source: <a href="https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide" target="_blank">https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide</a></p>
      </div>
    `;

    const queryParams = getCurQueryParams();
    const isScreenshotMode = queryParams.screenshot === 'true';

    if (isScreenshotMode) {
      document.body.classList.add('screenshot');

      document.body.getElementsByTagName('header')[0].style.display = 'none';
      document.body.getElementsByTagName('footer')[0].style.display = 'none';

      routeContainerElem.classList.remove('container');
      routeContainerElem.classList.remove('no-padding-top');
      routeContainerElem.classList.add('container-fluid');
      document.getElementsByClassName('hide-in-screenshot')[0].classList.add('hide');
    }
  }
};