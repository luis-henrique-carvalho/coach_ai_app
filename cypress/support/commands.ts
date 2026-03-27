/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mockOAuthCallback(provider: 'google' | 'github', user: any): Chainable<void>
    }
  }
}

export {}
