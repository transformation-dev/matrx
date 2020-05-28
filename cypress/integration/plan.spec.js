/// <reference types="Cypress" />

context('Plan', () => {
  beforeEach(() => {
    cy.clearLocalStorage().should((ls) => {
      expect(ls.getItem('teamID')).to.be.null
      expect(ls.getItem('startOn')).to.be.null
      expect(ls.getItem('slidesToDisplay')).to.be.null
    })

    cy.visit('localhost:8080/#/login?origin=/plan')
      .get("#login")
      .click()
  })

  it('drags and drops stuff around', () => {
    cy.url().should('include', 'teamID=team1')
    cy.url().should('include', 'startOn=0')
    cy.url().should('include', 'slidesToDisplay=1')

    cy.should(() => {
      expect(localStorage.getItem('/plan.startOn')).to.eq('0')
      expect(localStorage.getItem('/plan.slidesToDisplay')).to.eq('1')
    })

    cy.get('#practice5')
      .contains("Network Originated Scans")
      .trigger('dragstart')
    
    cy.get('#pan-right')
      .contains("Doing")
      .trigger('drop')
      .click()

    cy.should(() => {
      expect(localStorage.getItem('/plan.startOn')).to.eq('1')
      expect(localStorage.getItem('/plan.slidesToDisplay')).to.eq('1')
    })

    cy.url().should('include', 'startOn=1')

    cy.get('#pan-left')
      .contains("Todo")

    cy.get('#practice5')
      .contains("Network Originated Scans")
  })

  // eslint-disable-next-line no-undef
  afterEach(() => {
    cy.get("#logout")
      .click()
  })

})
