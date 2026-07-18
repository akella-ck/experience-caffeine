import { describe, expect, it } from "vitest";
import {
  accessForPath,
  authenticateDemoCredentials,
  canAccessPath,
  parseAuthSession,
  safeInternalPath,
} from "./access";
import { navigationForRole } from "./navigation";
import { clearStoredSessions } from "./storage";

describe("demo authentication", () => {
  it("maps the individual demo credentials to the individual role", () => {
    const result = authenticateDemoCredentials({
      email: " TEST@EXPERIENCECAFFEINE.COM ",
      password: "coffeeistheanswer",
      rememberSession: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.session.role).toBe("individual");
  });

  it("maps the corporate demo credentials to the corporate role", () => {
    const result = authenticateDemoCredentials({
      email: "cafe@experiencecaffeine.com",
      password: "whatsyourorder",
      rememberSession: false,
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.session.role).toBe("corporate");
  });

  it("rejects invalid credentials", () => {
    expect(authenticateDemoCredentials({
      email: "test@experiencecaffeine.com",
      password: "wrong-password",
      rememberSession: true,
    })).toEqual({ ok: false, error: "Those demo credentials do not match an available account." });
  });

  it("validates restored sessions instead of trusting arbitrary storage", () => {
    const valid = JSON.stringify({
      version: 1,
      role: "individual",
      email: "test@experiencecaffeine.com",
      displayName: "Test Brewer",
      accountName: "Individual Demo",
      signedInAt: "2026-07-17T12:00:00.000Z",
    });

    expect(parseAuthSession(valid)?.role).toBe("individual");
    expect(parseAuthSession(JSON.stringify({ ...JSON.parse(valid), role: "admin" }))).toBeNull();
    expect(parseAuthSession("not-json")).toBeNull();
  });

  it("clears both persistence locations on logout", () => {
    const localRemoved: string[] = [];
    const sessionRemoved: string[] = [];
    clearStoredSessions(
      { removeItem: (key) => localRemoved.push(key) },
      { removeItem: (key) => sessionRemoved.push(key) },
    );

    expect(localRemoved).toEqual(["experience-caffeine-demo-auth-local-v1"]);
    expect(sessionRemoved).toEqual(["experience-caffeine-demo-auth-session-v1"]);
  });
});

describe("centralized route access", () => {
  it("keeps the public education surface open", () => {
    expect(accessForPath("/")).toBe("public");
    expect(accessForPath("/explore")).toBe("public");
    expect(accessForPath("/brew-methods")).toBe("public");
    expect(accessForPath("/grinders")).toBe("public");
    expect(accessForPath("/learn")).toBe("public");
    expect(accessForPath("/learn/grind-size")).toBe("public");
    expect(accessForPath("/for-business")).toBe("public");
  });

  it("marks complete consumer tools and detailed guides as member access", () => {
    expect(accessForPath("/brew-lab")).toBe("member");
    expect(accessForPath("/troubleshoot")).toBe("member");
    expect(accessForPath("/guided-brew")).toBe("member");
    expect(accessForPath("/brew-methods/v60")).toBe("member");
    expect(accessForPath("/grinders/baratza-encore")).toBe("member");
    expect(accessForPath("/learn/where-coffee-grows")).toBe("member");
  });

  it("keeps private individual and corporate spaces separate", () => {
    expect(canAccessPath("individual", "/dashboard")).toBe(true);
    expect(canAccessPath("individual", "/journal")).toBe(true);
    expect(canAccessPath("individual", "/profile")).toBe(true);
    expect(canAccessPath("individual", "/corporate/dashboard")).toBe(false);

    expect(canAccessPath("corporate", "/corporate/dashboard")).toBe(true);
    expect(canAccessPath("corporate", "/brew-lab")).toBe(true);
    expect(canAccessPath("corporate", "/troubleshoot")).toBe(true);
    expect(canAccessPath("corporate", "/journal")).toBe(false);
    expect(canAccessPath("corporate", "/dashboard")).toBe(false);
    expect(canAccessPath("corporate", "/dashboard?view=recent")).toBe(false);
    expect(canAccessPath("corporate", "/profile")).toBe(false);
    expect(canAccessPath("individual", "/corporate/dashboard?location=all")).toBe(false);
  });

  it("does not treat public previews as full public tool access", () => {
    expect(canAccessPath("public", "/brew-lab")).toBe(false);
    expect(canAccessPath("public", "/brew-methods/v60")).toBe(false);
    expect(canAccessPath("public", "/learn/grind-size")).toBe(true);
  });
});

describe("redirect and navigation safety", () => {
  it("accepts only local redirect paths", () => {
    expect(safeInternalPath("/brew-lab?method=v60")).toBe("/brew-lab?method=v60");
    expect(safeInternalPath("//malicious.example/path")).toBeNull();
    expect(safeInternalPath("https://malicious.example")).toBeNull();
    expect(safeInternalPath("/safe\\redirect")).toBeNull();
  });

  it("shows role-appropriate navigation without cross-role destinations", () => {
    const publicItems = navigationForRole("public").map((item) => item.href);
    const individualItems = navigationForRole("individual").map((item) => item.href);
    const corporateItems = navigationForRole("corporate").map((item) => item.href);

    expect(publicItems).toContain("/grinders");
    expect(individualItems).toContain("/guided-brew");
    expect(individualItems).toContain("/journal");
    expect(individualItems.some((href) => href.startsWith("/corporate"))).toBe(false);
    expect(corporateItems).toContain("/corporate/locations");
    expect(corporateItems).not.toContain("/journal");
    expect(corporateItems).not.toContain("/brew-lab");
  });
});
