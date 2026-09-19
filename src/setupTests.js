import { expect, afterEach, vitest } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom/vitest";
import { File } from "node:buffer";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

export const mockAuthenticatedStatus = {
  isLoading: false,
  isAuthenticated: false,
};

export const getMockAuthStatus = () => {
  return mockAuthenticatedStatus;
};

vitest.mock("react-oidc-context", () => ({
  // The result of this mock can be altered by changing `mockAuthenticatedStatus` in your test
  useAuth() {
    const { isLoading, isAuthenticated } = getMockAuthStatus();
    return {
      isLoading,
      isAuthenticated,
      signinRedirect: vitest.fn(),
      removeUser: vitest.fn(),
      settings: {},
    };
  },
}));

Object.defineProperty(globalThis, "File", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: File,
});
