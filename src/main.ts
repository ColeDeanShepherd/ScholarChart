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
          <h1>SQL Server Transaction Isolation Levels</h1>
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
                <th>Behavior</th>
                <th>Prevents Dirty Reads?</th>
                <th>Prevents Non-Repeatable Reads?</th>
                <th>Prevents Phantom Reads?</th>
                <th>Concurrency/Performance</th>
            </thead>

            <tbody>
              <tr>
                <td>READ UNCOMMITTED</td>
                <td class="left-align">
                  <ul>
                    <li>Allows dirty reads.</li>
                    <li>No locks are placed, so data might change or roll back later.</li>
                  </ul>
                </td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td>🔥🔥🔥🔥</td>
              </tr>
              <tr>
                <td>READ COMMITTED</td>
                <td class="left-align">
                  <ul>
                    <li>The default isolation level.</li>
                    <li>Reads only committed data.</li>
                    <li>(READ_COMMITTED_SNAPSHOT = OFF): Shared locks prevent reading uncommitted changes.</li>
                    <li>(READ_COMMITTED_SNAPSHOT = ON): Row versioning prevents reading uncommitted changes. Minimal locking, but increased TempDB usage.</li>
                  </ul>
                </td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td>🔥🔥🔥<span class="inactive-emoji">🔥</span></td>
              </tr>
              <tr>
                <td>REPEATABLE READ</td>
                <td class="left-align">
                  <ul>
                    <li>Ensures that if data is read multiple times within a transaction, it will remain unchanged.</li>
                    <li>Prevents non-repeatable reads by holding locks on read data until the transaction ends.</li>
                  </ul>
                </td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="bad-color"><i data-feather="x"></i></span></td>
                <td>🔥🔥<span class="inactive-emoji">🔥🔥</span></td>
              </tr>
              <tr>
                <td>SNAPSHOT</td>
                <td class="left-align">
                  <ul>
                    <li>Uses versioning to provide a consistent view of data from the transaction's start.</li>
                    <li>Minimal locking.</li>
                  </ul>
                </td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td>🔥🔥🔥<span class="inactive-emoji">🔥</span><br /><br />👎 Increased TempDB usage</td>
              </tr>
              <tr>
                <td>SERIALIZABLE</td>
                <td class="left-align">
                  <ul>
                    <li>Behaves like only one transaction can access data at a time.</li>
                  </ul>
                </td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td><span class="good-color"><i data-feather="check"></i></span></td>
                <td>🔥<span class="inactive-emoji">🔥🔥🔥</span></td>
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
