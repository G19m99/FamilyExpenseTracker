/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as expenseCategories from "../expenseCategories.js";
import type * as expenses from "../expenses.js";
import type * as families from "../families.js";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as lib_family from "../lib/family.js";
import type * as router from "../router.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  expenseCategories: typeof expenseCategories;
  expenses: typeof expenses;
  families: typeof families;
  http: typeof http;
  invitations: typeof invitations;
  "lib/family": typeof lib_family;
  router: typeof router;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
