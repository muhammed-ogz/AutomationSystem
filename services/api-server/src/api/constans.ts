import { APIError } from "./APIError";

const INTERNAL_SERVER_API_ERROR = new APIError(
  0,
  "An unknown internal server error occured while processing your request. Pkease try again later."
);

const RESOURCE_NOT_FOUND_API_ERROR = new APIError(
  0,
  "Reuested resource not found."
);

export { INTERNAL_SERVER_API_ERROR, RESOURCE_NOT_FOUND_API_ERROR };
