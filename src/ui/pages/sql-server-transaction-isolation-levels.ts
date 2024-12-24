import logo from '../../logo.svg';
import { getCurQueryParams } from "../../web-lib";
import { IRoute } from '../../router';

export const sqlServerTransactionIsolationLevelsRoute: IRoute = {
  pathname: '/sql-server-transaction-isolation-levels',
  title: 'SQL Server Transaction Isolation Levels',
  renderFn: routeContainerElem => {
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

        <table class="striped">
          <thead>
            <tr>
              <th>Isolation Level</th>
              <th>Prevents Dirty Reads?</th>
              <th>Prevents Non-Repeatable Reads?</th>
              <th>Prevents Phantom Reads?</th>
              <th>Degree of Concurrency</th>
              <th>Use-Cases &amp; Remarks</th>
          </thead>

          <tbody>
            <tr>
              <td>READ UNCOMMITTED</td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td>
                <div class="v-rating">
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                </div>
              </td>
              <td class="left-align">
                <ul>
                  <li><u>Example Use</u>: Generating approximate reports in real-time dashboards.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>READ COMMITTED<br /><small><span class="no-word-break">(w/READ_COMMITTED_SNAPSHOT on)</span></small></td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td>
                <div class="v-rating">
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                </div>
              </td>
              <td class="left-align">
                <ul>
                  <li><u>Example Use</u>: Typical OLTP workloads.</li>
                  <li>The default isolation level in Azure SQL.</li>
                  <li>Uses row versioning to prevent dirty reads without blocking.</li>
                  <li>Increases I/O &amp; TempDB usage.</li>
                </ul>
              </td>
            </tr><tr>
              <td>READ COMMITTED<br /><small><span class="no-word-break">(w/READ_COMMITTED_SNAPSHOT off)</span></small></td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td>
                <div class="v-rating">
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                </div>
              </td>
              <td class="left-align">
                <ul>
                  <li><u>Example Use</u>: OLTP workloads where increased I/O &amp; TempDB usage is a problem.</li>
                  <li>The default isolation level in SQL Server.</li>
                  <li>Uses locks to prevent dirty reads.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>REPEATABLE READ</td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="bad-color"><i data-feather="x"></i></span></td>
              <td>
                <div class="v-rating">
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                </div>
              </td>
              <td class="left-align">
                <ul>
                  <li><u>Example Use</u>: Financial applications calculating intermediate results based on multiple reads.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>SNAPSHOT</td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td>
                <div class="v-rating">
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                  <div class="v-rating-bar"></div>
                </div>
              </td>
              <td class="left-align">
                <ul>
                  <li>
                    <u>Example Uses</u>:
                    <ul>
                      <li>Reporting and analytics workloads requiring a consistent snapshot of data.</li>
                      <li>Ensuring application sees stable/coherent snapshots when querying change-tracked data.</li>
                    </ul>
                  </li>
                  <li>Uses versioning to provide a consistent view of data from start of transaction without blocking.</li>
                  <li>Increases I/O &amp; TempDB usage.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>SERIALIZABLE</td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td><span class="good-color"><i data-feather="check"></i></span></td>
              <td>
                <div class="v-rating">
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar inactive"></div>
                  <div class="v-rating-bar"></div>
                </div>
              </td>
              <td class="left-align">
                <ul>
                  <li><u>Example Use</u>: Financial applications where transactions involve critical integrity constraints.</li>
                  <li>Behaves like only one transaction can access data at a time.</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="logo-with-name"><img src="${logo}" alt="ScholarChart" /> ScholarChart.com</div>
          <div>v2 (Dec. 24, 2024)</div>
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