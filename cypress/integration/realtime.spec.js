/// <reference types="Cypress" />

context('Realtime', () => {
  beforeEach(() => {
    cy.visit('localhost:8080/#/login?origin=/test-jig')
      .get("#login")
      .click()
  })

  it('keeps stores synchronized', () => {
    cy.get('#a-value')
      .contains("2000")

    cy.get('#a-button')
      .click()

    cy.get('#a-value')
      .contains("2001")
    
    cy.get('#a-prime-value')
      .contains("2001")

    cy.get('#a-prime-button')
      .click()

    cy.get('#a-value')
      .contains("2002")
    
    cy.get('#a-prime-value')
      .contains("2001")  // Because we have ignoreLocalSet=true
  })

  it('logs out and back in', () => {
    cy.get("#logout")
      .click()

    cy.get("#login")
      .click()

    cy.get('#a-button')
      .click()
  })

  afterEach(() => {
    cy.get("#logout")
      .click()
  })

})
