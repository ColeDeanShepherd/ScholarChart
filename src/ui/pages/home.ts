import { IRoute } from "../../router";

export const homeRoute: IRoute = {
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
};