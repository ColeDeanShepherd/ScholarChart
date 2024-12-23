import '@picocss/pico/css/pico.min.css';
import './style.css';

import 'bootstrap-icons/font/bootstrap-icons.css';
import feather from 'feather-icons';

import logo from './logo.svg';
import { isDevEnv } from './config';
import { initAnalytics, trackPageView } from './analytics';
import { runAnimation, IKeyframe, KeyframeBuilder, IKeyframeAnimation } from './animation';
import { getElementYRelativeToContainer } from './ui-lib';
import { getCurQueryParams } from './web-lib';

// make it shareable
// publish to social media
// TODO: write skew?

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
          <h1>Learn with bite-sized, beautiful visualizations!</h1>
          <p>StudyChart is still a work-in-progress so content is sparse, but you can check out the following content now:</p>
          <ul class="lsp-inside">
            <li><a href="/sql-server-transaction-isolation-levels">SQL Server Transaction Isolation Levels</a></li>
          </ul>
          <br />
          <h3>Subscribe our newsletter to be notified of new content!</h3>
          <iframe src="https://scholarchart.substack.com/embed" width="480" height="320" style="border:1px solid #EEE; background:white;" frameborder="0" scrolling="no"></iframe>
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
            <h3><u>Read Phenomena</u>: Artifacts in read data due to isolation level</h3>
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
                    <li><u>Example Use</u>: Generating approximate reports in real-time dashboards.</li>
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
                      With READ_COMMITTED_SNAPSHOT on:
                      <ul>
                        <li><u>Example Use</u>: Typical OLTP workloads.</li>
                        <li>The default isolation level in Azure SQL.</li>
                        <li>Uses row versioning to prevent dirty reads without blocking.</li>
                        <li>Increases I/O &amp; TempDB usage.</li>
                      </ul>
                    </li>
                    <li>
                      With READ_COMMITTED_SNAPSHOT off:
                      <ul>
                        <li><u>Example Use</u>: OLTP workloads where increased blocking is OK.</li>
                        <li>The default isolation level in SQL Server.</li>
                        <li>Uses locks to prevent dirty reads.</li>
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
                    <li><u>Example Use</u>: Financial applications calculating intermediate results based on multiple reads.</li>
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
                <td>🔥<span class="inactive-emoji">🔥🔥🔥</span></td>
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
            <div>v1 (Dec. 23, 2024)</div>
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
  }
];

if (isDevEnv()) {
  routes.push({
    pathname: '/dev',
    title: 'Dev',
    renderFn: routeContainerElem => {
      const gridDiv = document.createElement('div');
      gridDiv.classList.add('grid');
      gridDiv.style.position = 'relative';

      const txn1Container = document.createElement('article');
      txn1Container.innerHTML = `
        <header>Transaction 1 (READ UNCOMMITTED)</header>
        <p>...</p>
        <p>SELECT Value FROM Table WHERE Id = 2</p>
        <p>...</p>
        <p>COMMIT TRANSACTION</p>`;
      
      gridDiv.appendChild(txn1Container);
      
      const txn2Container = document.createElement('article');
      txn2Container.innerHTML = `
        <header>Transaction 2</header>
        <p>UPDATE Table SET Value = 250 WHERE Id = 2</p>
        <p>...</p>
        <p>ROLLBACK TRANSACTION</p>`;
      
      gridDiv.appendChild(txn2Container);

      const overlayDiv = document.createElement('div');
      overlayDiv.style.position = 'absolute';
      overlayDiv.style.top = '0';
      overlayDiv.style.left = '0';
      overlayDiv.style.width = '100%';
      overlayDiv.style.border = '1px solid white';
      overlayDiv.style.borderRadius = '8px';
      overlayDiv.style.padding = '0.5rem';

      gridDiv.appendChild(overlayDiv);

      routeContainerElem.appendChild(gridDiv);
      
      overlayDiv.style.height = txn1Container.getElementsByTagName('p')[0].clientHeight + 'px';

      const tableContainer = document.createElement('div');
      tableContainer.innerHTML = `
        <h2>Table</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Value</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>100</td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <span id="value">200</span>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>300</td>
            </tr>
        </table>`;
      routeContainerElem.appendChild(tableContainer);

      // Change the text's margin-left from 100px to 200px over 2 seconds. Use requestAnimationFrame, and the timestamp passed into it. Make it framerate-independent.
      const ps = txn1Container.getElementsByTagName('p');
      const posKeyframeBuilder = new KeyframeBuilder();
      posKeyframeBuilder.stepToValue(getElementYRelativeToContainer(ps[0], gridDiv), 0);
      posKeyframeBuilder.wait(1);
      posKeyframeBuilder.lerpToValue(getElementYRelativeToContainer(ps[1], gridDiv), 1);
      posKeyframeBuilder.wait(1);
      posKeyframeBuilder.lerpToValue(getElementYRelativeToContainer(ps[2], gridDiv), 1);
      posKeyframeBuilder.wait(1);
      posKeyframeBuilder.lerpToValue(getElementYRelativeToContainer(ps[3], gridDiv), 1);
      posKeyframeBuilder.wait(1);

      const valueSpan = tableContainer.querySelector<HTMLSpanElement>('#value')!;

      const valueKeyframeBuilder = new KeyframeBuilder();
      valueKeyframeBuilder.stepToValue(200, 0);
      valueKeyframeBuilder.wait(0.5);
      valueKeyframeBuilder.stepToValue(250, 0);
      valueKeyframeBuilder.wait(4);
      valueKeyframeBuilder.stepToValue(200, 0);

      const animation: IKeyframeAnimation = {
        curves: [
          {
            keyframes: posKeyframeBuilder.build(),
            updateControlledValue: newValue => {
              overlayDiv.style.top = `${newValue}px`;
            }
          },
          {
            keyframes: valueKeyframeBuilder.build(),
            updateControlledValue: newValue => {
              valueSpan.innerText = (newValue !== 250)
                ? newValue.toString()
                : '250 (uncommitted)';
            }
          }
        ],
        loop: true
      };
      
      runAnimation(animation);
    }
  });
}

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

function activateRoute(route: IRoute) {
  const routeContainer = document.querySelector<HTMLDivElement>('#route-container')!;
  document.title = (route.title !== undefined)
    ? `${route.title} - ScholarChart`
    : 'ScholarChart';

  // Send page view to Google Analytics now that the page title is set.
  if (!isDevEnv()) {
    initAnalytics();

    trackPageView();
  }

  route.renderFn(routeContainer);
}

function run() {
  const curRoute = getCurRoute();
  activateRoute(curRoute);

  document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
  });
}

run();
