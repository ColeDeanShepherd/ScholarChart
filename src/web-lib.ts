export function getCurQueryParams(): Record<string, string | string[]> {
    // Get the current URL
    const url = new URL(window.location.href);
  
    // Extract the query parameters
    const queryParams = new URLSearchParams(url.search);
  
    // Convert to an object
    const params: Record<string, string | string[]> = {};
    queryParams.forEach((value, key) => {
      if (params[key]) {
        // If the key already exists, convert it to an array or append to the existing array
        params[key] = Array.isArray(params[key])
          ? [...(params[key] as string[]), value]
          : [params[key] as string, value];
      } else {
        params[key] = value;
      }
    });
  
    return params;
  }