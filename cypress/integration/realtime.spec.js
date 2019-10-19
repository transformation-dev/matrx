/// <reference types="Cypress" />

context('Realtime', () => {
  beforeEach(() => {
    cy.visit('localhost:8080/#/login?origin=/test-jig')
      .get("#login")
      .click()
  })

  it('Keeps stores synchronized', () => {
    cy.get('button[id=a]')
  })

})