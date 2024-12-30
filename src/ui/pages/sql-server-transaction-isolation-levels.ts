import logo from '../../logo.svg';
import { getCurQueryParams } from "../../web-lib";
import { IRoute } from '../../router';
import { isDevEnv } from '../../config';
import { a, article, button, details, div, elemsFromRawHtml, h2, h3, img, li, p, section, span, summary, text, ul } from '../../framework/ui/ui-core';
import { arrIndices, arrRandElem } from '../../framework/array-util';

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

interface ITableData {
  columnHeaderHtmls: string[];
  rows: string[][];
}

function extractDataFromTable(table: HTMLTableElement): ITableData {
  const columnHeaderHtmls = Array.from(table.querySelectorAll('thead th')).map(th => th.innerHTML);
  const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerHTML));
  return { columnHeaderHtmls, rows };
}

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

interface ITerm {
  term: string;
  definition: string;
}

const readPheonomenaTerms = [
  {
    term: 'Dirty Read',
    definition: 'Reading uncommitted changes from other transactions that could be rolled back later.'
  },
  {
    term: 'Non-Repeatable Read',
    definition: 'Getting different values when re-reading the same row due to updates by other transactions.'
  },
  {
    term: 'Phantom Read',
    definition: 'Seeing new or missing rows when re-reading a range due to inserts/deletes by other transactions.'
  }
];

function termsView(terms: ITerm[]): HTMLUListElement {
  return ul(
    { class: 'terms' },
    terms.map(term => li(
      [
        span({ class: 'bold underline' }, [ text(term.term) ]),
        text(`: ${term.definition}`)
      ]
    ))
  );
}

interface IQuestion {
  question: string;
  answers: Set<string>;
  correctAnswer: string;
}

export const sqlServerTransactionIsolationLevelsRoute: IRoute = {
  pathname: '/sql-server-transaction-isolation-levels',
  title: 'SQL Server Transaction Isolation Levels',
  renderFn: routeContainerElem => {
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
          </tr>
        </thead>

        <tbody>
          ${transactionIsolationLevels.map(infoToTr).join('')}
        </tbody>
      </table>`;

    const _termsView = termsView(readPheonomenaTerms);
    const termsHtml = _termsView.outerHTML;

    routeContainerElem.innerHTML = `
      <div class="sql-server-transaction-isolation-levels">
        <h1>Azure SQL/SQL Server Transaction Isolation Levels</h1>
        <p>Control how one transaction is affected by others executing concurrently, balancing concurrency and data consistency.</p>

        <article>
          <h3>Artifacts in read data due to isolation level:</h3>
          ${termsHtml}
        </article>

        ${tableHtml}
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
    }

    const container = document.getElementsByClassName('sql-server-transaction-isolation-levels')[0];

    if (isDevEnv()) {
      const tableData = extractDataFromTable(container.getElementsByTagName('table')[0]);
      const allValsInEachCol = tableData.columnHeaderHtmls
        .map((_, colIndex) => new Set(tableData.rows.map(row => row[colIndex])));
      
      const questions = tableData.rows.flatMap(row => {
        const isolationLevel = row[0];
        
        return arrIndices(row)
          .filter(i => i > 0)
          .map<IQuestion>(i => ({
            question: `<u>${isolationLevel}</u><br /><br />${tableData.columnHeaderHtmls[i]}:`,
            answers: allValsInEachCol[i],
            correctAnswer: row[i]
          }));
      });

      // TODO: show correct or incorrect, normal text (not "a" text), questions about terms at top, test on phone, scramble answers
      
      function nextQuestion() {
        const question = arrRandElem(questions);
        questionContainer.replaceChildren(questionView(question));
      }

      function createAnswerEffect(button: HTMLElement, isCorrect: boolean) {
        //👍👎
        // get position of button
        // create an element at that position (fixed, centered) with the right emoji
        // make the emoji drift up and fade out, then remove it

        const btnRect = button.getBoundingClientRect();
        const top = btnRect.top + (btnRect.height / 2);
        const left = btnRect.left + (btnRect.width / 2);
        
        const emoji = document.createElement('div');
        emoji.style.position = 'fixed';
        emoji.style.top = `${top}px`;
        emoji.style.left = `${left}px`;
        emoji.style.opacity = '1';
        emoji.style.transition = 'top 1s linear, opacity 1s ease-in';
        emoji.style.fontSize = '1.25rem';
        emoji.style.zIndex = '1000';
        emoji.style.userSelect = 'none';
        emoji.style.visibility = 'hidden';
        emoji.innerHTML = isCorrect ? 'Correct 😄' : 'Incorrect 😞';
        
        document.body.appendChild(emoji);

        setTimeout(() => {
          const width = emoji.offsetWidth;
          emoji.style.left = `${left - (width / 2)}px`;

          emoji.style.top = `${top - 100}px`;
          emoji.style.opacity = '0';
          emoji.style.visibility = 'visible';
        }, 0);

        setTimeout(() => {
          document.body.removeChild(emoji);
        }, 1000);
      }

      function questionView(question: IQuestion) {
        let detailsElem: HTMLElement;
        let summaryElem: HTMLElement;
        let selectedAnswer: string;

        const result = article([
          div({ style: "margin-bottom: var(--pico-spacing);" }, elemsFromRawHtml(question.question)),
          detailsElem = details({ class: 'dropdown' }, [
            (summaryElem = summary([ text('Select an answer') ])),
            ul(
              Array.from(question.answers).map(answer => {
                let aElem: HTMLAnchorElement;

                return li([
                  aElem = a({
                    href: '#',
                    onClick: e => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectedAnswer = answer;
                      summaryElem.innerHTML = aElem.innerHTML;
                      detailsElem.removeAttribute('open');
                    }
                  },
                  elemsFromRawHtml(answer))
                ]);
              })
            )
          ]),
          button(
            {
              onClick: e => {
                const isCorrect = selectedAnswer === question.correctAnswer;
                createAnswerEffect(e.target as HTMLElement, isCorrect);

                if (isCorrect) {
                  nextQuestion();
                }
              },
              class: 'primary'
            },
            [ text('Submit') ]
          )
        ]);

        return result;
      }

      let questionContainer: HTMLElement;

      const quizSection = section({ class: 'hide-in-screenshot' }, [
        h2([ text('Test your knowledge:') ]),
        (questionContainer = div())
      ]);
      container.appendChild(quizSection);
      
      nextQuestion();
    }

    container.appendChild(
      p({ class: 'sources hide-in-screenshot', style: 'margin-top: 2rem;' }, [
        text('Source: '),
        a({ href: 'https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide', target: '_blank' }, [ text('https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide') ])
      ])
    );

    container.appendChild(
      div({ style: 'display: flex; justify-content: space-between; align-items: center;' }, [
        div({ class: 'logo-with-name' }, [
          div({ class: 'show-only-in-screenshot' }, [
            img({ src: logo, alt: 'ScholarChart' }),
            text(' ScholarChart.com')
          ])
        ]),
        text('v4 (Dec. 29, 2024)')
      ])
    );
  }
};