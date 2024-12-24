import '@picocss/pico/css/pico.min.css';
import './style.css';

import 'bootstrap-icons/font/bootstrap-icons.css';
import feather from 'feather-icons';

import { isDevEnv } from './config';
import { initAnalytics, trackPageView } from './analytics';
import { IRoute } from './router';
import { sqlServerTransactionIsolationLevelsRoute } from './ui/pages/sql-server-transaction-isolation-levels';
import { devTestRoute } from './ui/pages/dev-test';
import { homeRoute } from './ui/pages/home';
import { runOpenAITest } from './llm';
import { llmTestRoute } from './ui/pages/llm-test';

const routes: IRoute[] = [
  homeRoute,
  sqlServerTransactionIsolationLevelsRoute
];

if (isDevEnv()) {
  routes.push(devTestRoute);
  routes.push(llmTestRoute);
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

async function run() {
  const curRoute = getCurRoute();
  activateRoute(curRoute);

  document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
  });
}

run();
