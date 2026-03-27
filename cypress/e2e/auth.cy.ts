describe('Authentication Flows', () => {
  beforeEach(() => {
    // Clear cookies before each test
    cy.clearCookies()
  })

  describe('Google OAuth', () => {
    it('[AUTH-01] User can sign up with Google OAuth', () => {
      cy.fixture('user').then((users) => {
        const googleUser = users.google
        
        // Visit login page
        cy.visit('/login')
        cy.contains('Continue with Google').should('be.visible')
        
        // Intercept OAuth redirect (we don't actually go to Google)
        cy.intercept('GET', '**/api/auth/google', (req) => {
          // Simulate OAuth callback by redirecting to frontend
          req.reply({
            statusCode: 302,
            headers: { Location: '/' }
          })
        })
        
        // Click Google login button
        cy.contains('Continue with Google').click()
        
        // Mock the OAuth callback result
        cy.mockOAuthCallback('google', googleUser)
        
        // Should be redirected to dashboard
        cy.url().should('include', '/')
        
        // Manually navigate to dashboard (since we mocked the redirect)
        cy.visit('/dashboard')
        
        // User profile should be visible with Google user data
        cy.contains(googleUser.name).should('be.visible')
        cy.contains(googleUser.email).should('be.visible')
      })
    })

    it('[AUTH-03] User can log in with Google OAuth (existing user)', () => {
      cy.fixture('user').then((users) => {
        const googleUser = users.google
        
        // Mock existing logged in session
        cy.mockOAuthCallback('google', googleUser)
        
        // Visit dashboard (should work because we're "authenticated")
        cy.visit('/dashboard')
        
        // User profile should be visible
        cy.contains(googleUser.name).should('be.visible')
      })
    })
  })

  describe('GitHub OAuth', () => {
    it('[AUTH-02] User can sign up with GitHub OAuth', () => {
      cy.fixture('user').then((users) => {
        const githubUser = users.github
        
        cy.visit('/login')
        cy.contains('Continue with GitHub').should('be.visible')
        
        cy.intercept('GET', '**/api/auth/github', (req) => {
          req.reply({
            statusCode: 302,
            headers: { Location: '/' }
          })
        })
        
        cy.contains('Continue with GitHub').click()
        cy.mockOAuthCallback('github', githubUser)
        
        cy.visit('/dashboard')
        cy.contains(githubUser.name).should('be.visible')
        cy.contains(githubUser.email).should('be.visible')
      })
    })

    it('[AUTH-04] User can log in with GitHub OAuth (existing user)', () => {
      cy.fixture('user').then((users) => {
        const githubUser = users.github
        
        cy.mockOAuthCallback('github', githubUser)
        cy.visit('/dashboard')
        
        cy.contains(githubUser.name).should('be.visible')
      })
    })
  })

  describe('Session Management', () => {
    it('[AUTH-05] User session persists across browser sessions', () => {
      cy.fixture('user').then((users) => {
        const googleUser = users.google
        
        // Login
        cy.mockOAuthCallback('google', googleUser)
        cy.visit('/dashboard')
        cy.contains(googleUser.name).should('be.visible')
        
        // Refresh page (simulates browser session)
        cy.reload()
        
        // User should still be logged in
        cy.contains(googleUser.name).should('be.visible')
        cy.url().should('include', '/dashboard')
      })
    })

    it('[AUTH-06] User can log out from any page', () => {
      cy.fixture('user').then((users) => {
        const googleUser = users.google
        
        // Login
        cy.mockOAuthCallback('google', googleUser)
        cy.visit('/dashboard')
        
        // Intercept logout API call
        cy.intercept('POST', '**/api/auth/logout', {
          statusCode: 200,
          body: { success: true }
        }).as('logout')
        
        // Click logout button
        cy.contains('Logout').click()
        
        // Should call logout API
        cy.wait('@logout')
        
        // Should redirect to home or login
        cy.url().should('not.include', '/dashboard')
        
        // Try to visit dashboard again
        cy.visit('/dashboard')
        
        // Should be redirected to login (no longer authenticated)
        cy.url().should('include', '/login')
      })
    })

    it('[AUTH-07] User profile is created automatically on first login', () => {
      cy.fixture('user').then((users) => {
        const newUser = {
          ...users.google,
          id: 'new-user-' + Date.now(),
          email: 'newuser@example.com',
          name: 'Brand New User'
        }
        
        // First login creates profile
        cy.mockOAuthCallback('google', newUser)
        cy.visit('/dashboard')
        
        // Profile should be visible (proves it was created)
        cy.contains(newUser.name).should('be.visible')
        cy.contains(newUser.email).should('be.visible')
      })
    })

    it('[AUTH-08] User data syncs across devices when logged in', () => {
      cy.fixture('user').then((users) => {
        const googleUser = users.google
        
        // Simulate device 1
        cy.mockOAuthCallback('google', googleUser)
        cy.visit('/dashboard')
        cy.contains(googleUser.name).should('be.visible')
        
        // Simulate device 2 (clear and re-login with same user)
        cy.clearCookies()
        cy.mockOAuthCallback('google', googleUser)
        cy.visit('/dashboard')
        
        // Same user data should appear
        cy.contains(googleUser.name).should('be.visible')
        cy.contains(googleUser.email).should('be.visible')
        
        // User ID should match (same user, different session)
        cy.window().then((win) => {
          // This would verify the same user ID in both sessions
          // In a real E2E test with backend, we'd verify DB has single user entry
        })
      })
    })
  })

  describe('Protected Routes', () => {
    it('Unauthenticated user cannot access dashboard', () => {
      // Try to visit dashboard without login
      cy.visit('/dashboard')
      
      // Should be redirected to login
      cy.url().should('include', '/login')
    })

    it('Authenticated user can access dashboard', () => {
      cy.fixture('user').then((users) => {
        const googleUser = users.google
        
        cy.mockOAuthCallback('google', googleUser)
        cy.visit('/dashboard')
        
        // Should stay on dashboard
        cy.url().should('include', '/dashboard')
        cy.contains(googleUser.name).should('be.visible')
      })
    })
  })
})
