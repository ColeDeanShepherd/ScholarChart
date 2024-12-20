import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <ul>
    <li>READ UNCOMMITTED</li>
    <li>READ COMMITTED</li>
    <li>REPEATABLE READ</li>
    <li>SNAPSHOT</li>
    <li>SERIALIZABLE</li>
  </ul>
`;
