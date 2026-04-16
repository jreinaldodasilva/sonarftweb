import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// MSW server for Jest — intercepts fetch calls in Node environment
export const server = setupServer(...handlers);
