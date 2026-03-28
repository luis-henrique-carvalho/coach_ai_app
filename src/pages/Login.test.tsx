import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import * as AuthContext from "../contexts/AuthContext";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn(),
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("renders welcome heading", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText(/Welcome to Coach AI/i)).toBeInTheDocument();
  });

  it("renders sign in description", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText(/Sign in to get started/i)).toBeInTheDocument();
  });

  it("renders both Google and GitHub login buttons", () => {
    renderWithRouter(<Login />);

    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue with GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in with email/i)).toBeInTheDocument();
  });

  it("has centered layout with Tailwind classes", () => {
    const { container } = renderWithRouter(<Login />);

    const mainDiv = container.querySelector(".min-h-screen");
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass("flex", "items-center", "justify-center");
  });

  it("uses background styling", () => {
    const { container } = renderWithRouter(<Login />);

    const mainDiv = container.querySelector(".bg-background");
    expect(mainDiv).toBeInTheDocument();
  });
});
