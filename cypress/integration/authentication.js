/// <reference types="Cypress" />

context('Authentication', () => {

  it('should only be able to get to pages where allowUnauthenticated=true', () => {
    cy.get("#logout")
      .click()

    cy.get("#login")
      .click()

    cy.visit("localhost:8080/#/test-jig")

    cy.get('#a-button')
      .click()
  })

  // eslint-disable-next-line no-undef
  afterEach(() => {
    cy.get("#logout")
      .click()
  })

})
