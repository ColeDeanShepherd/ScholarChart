import { IKeyframeAnimation, KeyframeBuilder, runAnimation } from "../../animation";
import { IRoute } from "../../router";
import { getElementYRelativeToContainer } from "../../ui-lib";

export const devTestRoute: IRoute = {
  pathname: '/dev-test',
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
};