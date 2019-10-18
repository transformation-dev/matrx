/// <reference types="Cypress" />

context('Realtime', () => {
  beforeEach(() => {
    cy.visit('localhost:8080/#/login?origin=/poc')
      .get("#login")
      .click()
      // .next()
      // .should()

    cy.wait(1000)
  })

  it('cy.window() - get the global window object', () => {
    cy.window().should('have.property', 'top')
  })

  it('cy.document() - get the document object', () => {
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })

  it('cy.title() - get the title', () => {
    cy.title().should('include', 'MatrX')
  })
})