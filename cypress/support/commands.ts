/// <reference types="cypress" />

Cypress.Commands.add('mockOAuthCallback', (provider: 'google' | 'github', user: any) => {
  // Mock the /auth/me endpoint to return user data
  cy.intercept('GET', '**/api/auth/me', {
    statusCode: 200,
    body: user
  }).as('getUser')
  
  // Set cookies that would be set by backend OAuth callback
  cy.setCookie('access_token', 'mock-jwt-token-' + provider, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  })
  
  cy.setCookie('refresh_token', 'mock-refresh-token-' + provider, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mock OAuth callback by setting cookies and intercepting /auth/me
       * @param provider - OAuth provider (google or github)
       * @param user - User object to return from /auth/me
       * @example cy.mockOAuthCallback('google', { id: '123', email: 'test@example.com', ... })
       */
      mockOAuthCallback(provider: 'google' | 'github', user: any): Chainable<void>
    }
  }
}

export {}
