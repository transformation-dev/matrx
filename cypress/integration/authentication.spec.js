/// <reference types="Cypress" />

context('Authentication', () => {

  it('should only be able to get to pages where allowUnauthenticated=true', () => {
    cy.visit('localhost:8080/#/')

    cy.get("#logout")
      .click()

    cy.visit("localhost:8080/#/test-jig")
      
    cy.get("#login")

  })

  // eslint-disable-next-line no-undef
  afterEach(() => {
    cy.get("#logout")
      .click()
  })

})
