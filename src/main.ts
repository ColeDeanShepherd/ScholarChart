import '@picocss/pico/css/pico.min.css';
import './style.css';

import 'bootstrap-icons/font/bootstrap-icons.css';
import feather from 'feather-icons';

import logo from './logo.svg';

// think about all the ways to display this table-like data
// start making it look nice
// make it linkable
// make it shareable
// publish to social media

// TODO: write skew?
// TODO: read committed snapshot?
// phantom read in snapshot?
// read committed snapshot

interface IRoute {
  pathname: string;
  title: string | undefined;
  renderFn: (routeContainerElem: HTMLDivElement) => void;
}

const routes: IRoute[] = [
  {
    pathname: '/',
    title: undefined,
    renderFn: routeContainerElem => {
      routeContainerElem.innerHTML = `
        <section class="hero">
          <h1>Learn with interactive, animated visualizations!</h1>
          <p>StudyChart is still a work-in-progress so content is sparse, but you can check out the following content now:</p>
          <ul class="lsp-inside">
            <li><a href="/sql-server-transaction-isolation-levels">SQL Server Transaction Isolation Levels</a></li>
          </ul>
        </section>
      `;
    }
  },
  {
    pathname: '/sql-server-transaction-isolation-levels',
    title: 'SQL Server Transaction Isolation Levels',
    renderFn: routeContainerElem => {
      routeContainerElem.innerHTML = `
        <div class="sql-server-transaction-isolation-levels">
          <h1>Azure SQL/SQL Server Transaction Isolation Levels</h1>
          <p>Control how one transaction is affected by others executing concurrently, balancing concurrency/performance and data consistency.</p>

          <article>
            <h2>Read Phenomena</h2>
            <ul>
              <li><span class="bold underline">Dirty Read</span>: Reading uncommitted changes from other transactions that could be rolled back later.</li>
              <li><span class="bold underline">Non-Repeatable Read</span>: Getting different values when re-reading the same row due to updates by other transactions.</li>
              <li><span class="bold underline">Phantom Read</span>: Seeing new or missing rows when re-reading a range due to inserts/deletes by other transactions.</li>
            </ul>
          </article>

          <table>
            <thead>
              <tr>
                <th>Isolation Level</th>
                <th>Prevents Dirty Reads?</th>
                <th>Prevents Non-Repeatable Reads?</th>
                <th>Prevents Phantom Reads?</th>
                <th>Concurrency &amp; Performance</th>
                <th>Use-Cases &amp; Remarks</th>
            </thead>

            <tbody>
              <tr>
                <td>READ UNCOMMITTED</td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td>🔥🔥🔥🔥</td>
                <td class="left-align">
                  <ul>
                    <li>Example Use: Generating approximate reports in real-time dashboards.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>READ COMMITTED</td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td>🔥🔥🔥<span class="inactive-emoji">🔥</span></td>
                <td class="left-align">
                  <ul>
                    <li>
                      READ_COMMITTED_SNAPSHOT = ON
                      <ul>
                        <li>The default isolation level in Azure SQL.</li>
                        <li>Uses row versioning to prevent dirty reads without blocking.</li>
                        <li>Increases I/O &amp; TempDB usage.</li>
                        <li>Example Use: Typical OLTP workloads.</li>
                      </ul>
                    </li>
                    <li>
                      READ_COMMITTED_SNAPSHOT = OFF
                      <ul>
                        <li>The default isolation level in SQL Server.</li>
                        <li>Uses locks to prevent dirty reads.</li>
                        <li>Example Use: OLTP workloads where increased blocking is OK.</li>
                      </ul>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>REPEATABLE READ</td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td>🔥🔥<span class="inactive-emoji">🔥🔥</span></td>
                <td class="left-align">
                  <ul>
                    <li>Example Use: Financial applications calculating intermediate results based on multiple reads.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>SNAPSHOT</td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td>🔥🔥🔥<span class="inactive-emoji">🔥</span></td>
                <td class="left-align">
                  <ul>
                    <li>
                      Example Uses:
                      <ul>
                        <li>Reporting and analytics workloads requiring a consistent snapshot of data.</li>
                        <li>Ensuring application sees stable/coherent snapshots when querying change-tracked data.</li>
                      </ul>
                    </li>
                    <li>Uses versioning to provide a consistent view of data from the transaction's start.</li>
                    <li>Minimal locking.</li>
                    <li>Increases I/O &amp; TempDB usage.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>SERIALIZABLE</td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td>🔥<span class="inactive-emoji">🔥🔥🔥</span></td>
                <td class="left-align">
                  <ul>
                    <li>Example Use: Financial applications where transactions involve critical integrity constraints.</li>
                    <li>Behaves like only one transaction can access data at a time.</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <p class="logo-with-name"><img src="${logo}" alt="ScholarChart" /> ScholarChart.com</p>
          
          <p>Source: <a href="https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide" target="_blank">https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide</a></p>
        </div>
      `;
    }
  }
];

const notFoundRoute: IRoute = {
  pathname: '/404',
  title: '404 Not Found',
  renderFn: routeContainerElem => {
    routeContainerElem.innerHTML = `
      <h1>404 Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
    `;
  }
};

function getCurRoute() {
  const route = window.location.pathname;
  return routes.find(r => r.pathname === route) ?? notFoundRoute;
}

function renderRoute(route: IRoute) {
  const routeContainer = document.querySelector<HTMLDivElement>('#route-container')!;
  document.title = (route.title !== undefined)
    ? `${route.title} - ScholarChart`
    : 'ScholarChart';
  route.renderFn(routeContainer);
}

function run() {
  const curRoute = getCurRoute();
  renderRoute(curRoute);

  document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
  });
}

run();
