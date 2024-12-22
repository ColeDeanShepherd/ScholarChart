import '@picocss/pico/css/pico.min.css';
import './style.css';

import 'bootstrap-icons/font/bootstrap-icons.css';

import logo from './logo.svg';

// think about all the ways to display this table-like data
// start making it look nice
// make it linkable
// make it shareable
// publish to social media

//document.querySelector<HTMLDivElement>('#route-container')

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
          <ul>
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
        <h1>SQL Server Transaction Isolation Levels</h1>
        <p>Control how one transaction is affected by others executing concurrently, balancing performance and data consistency.</p>

        <article>
          <h2>Read Phenomena</h2>
          <ul style="text-align: left; list-style-type: none; margin: 0; padding: 0;">
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
              <th>Dirty Reads</th>
              <th>Non-Repeatable Reads</th>
              <th>Phantom Reads</th>
              <th>Performance</th>
          </thead>

          <tbody>
            <tr>
              <td>READ UNCOMMITTED</td>
              <td class="left-align">Allows dirty reads. No locks are placed, so data might change or roll back later.</td>
              <td><span class="bad-color">Yes</span></td>
              <td><span class="bad-color">Yes</span></td>
              <td><span class="bad-color">Yes</span></td>
              <td><span class="color-rating-5-of-5">Fastest</span></td>
            </tr>
            <tr>
              <td>READ COMMITTED</td>
              <td class="left-align">Reads only committed data. Shared locks prevent reading uncommitted changes. This is the default isolation level.</td>
              <td><span class="good-color">No</span></td>
              <td><span class="bad-color">Yes</span></td>
              <td><span class="bad-color">Yes</span></td>
              <td><span class="color-rating-4-of-5">Fast</span></td>
            </tr>
            <tr>
              <td>REPEATABLE READ</td>
              <td class="left-align">Ensures that if data is read multiple times within a transaction, it will remain unchanged. Prevents non-repeatable reads by holding locks on read data until the transaction ends.</td>
              <td><span class="good-color">No</span></td>
              <td><span class="good-color">No</span></td>
              <td><span class="bad-color">Yes</span></td>
              <td><span class="color-rating-3-of-5">Moderate</span></td>
            </tr>
            <tr>
              <td>SNAPSHOT</td>
              <td class="left-align">Uses versioning to provide a consistent view of data from the transaction's start. No locks.</td>
              <td><span class="good-color">No</span></td>
              <td><span class="good-color">No</span></td>
              <td><span class="good-color">No</span></td>
              <td><span class="color-rating-4-of-5">Fast (requires extra storage for data snapshots)</span></td>
            </tr>
            <tr>
              <td>SERIALIZABLE</td>
              <td class="left-align">Only allows one transaction to access data at a time with exclusive locks, preventing dirty reads, non-repeatable reads, and phantom reads.</td>
              <td><span class="good-color">No</span></td>
              <td><span class="good-color">No</span></td>
              <td><span class="good-color">No</span></td>
              <td><span class="color-rating-1-of-5">Slow</span></td>
            </tr>
          </tbody>
        </table>

        <p class="logo-with-name"><img src="${logo}" alt="ScholarChart" /> ScholarChart.com</p>
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
}

run();
