import { runOpenAITest } from "../../llm";
import { IRoute } from "../../router";

export const llmTestRoute: IRoute = {
  pathname: '/llm-test',
  title: 'LLM Test',
  renderFn: routeContainerElem => {
    runOpenAITest();
  }
};