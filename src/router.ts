export interface IRoute {
  pathname: string;
  title: string | undefined;
  renderFn: (routeContainerElem: HTMLDivElement) => void;
}