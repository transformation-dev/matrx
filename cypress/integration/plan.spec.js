/* eslint-disable no-undef */
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
      .trigger('dragenter')

    cy.get('#pan-right')
      .should('have.class', 'has-background-grey-lighter')

    cy.get('#pan-right')
      .trigger('dragleave')

    cy.get('#pan-right')
      .should('not.have.class', 'has-background-grey-lighter')

    cy.get('#pan-right')
      .trigger('dragenter')
      .trigger('drop')

    cy.get('#pan-right')
      .should('not.have.class', 'has-background-grey-lighter')
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

    cy.visit('localhost:8080/#/test-jig')
    cy.wait(2000)
    cy.url().should('include', 'teamID=team1')
    cy.url().should('not.include', 'startOn')
    cy.url().should('not.include', 'slidesToDisplay')

    cy.visit('localhost:8080/#/plan')
    cy.wait(2000)
    cy.url().should('include', 'teamID=team1')
    cy.url().should('include', 'startOn=1')
    cy.url().should('include', 'slidesToDisplay=1')

    cy.get('#practice5')
      .trigger('dragstart')
    
    cy.get(`#${CSS.escape('(queue1, Actions)')}`)
      .trigger('dragenter')

    cy.get(`#${CSS.escape('(queue1, Actions)')}`)
      .should('have.class', 'has-background-grey-lighter')

    cy.get(`#${CSS.escape('(queue1, Actions)')}`)
      .trigger('dragleave')

    cy.get(`#${CSS.escape('(queue1, Actions)')}`)
      .should('not.have.class', 'has-background-grey-lighter')
      
    // cy.get(`#${CSS.escape('(queue1, Actions)')}`)
    //   .trigger('dragenter')
    //   .trigger('drop')

    // cy.get(`#${CSS.escape('(queue1, Actions)')}`)
    //   .contains("Network Originated Scans")
      
  })

  // eslint-disable-next-line no-undef
  afterEach(() => {
    cy.get("#logout")
      .click()
  })

})
