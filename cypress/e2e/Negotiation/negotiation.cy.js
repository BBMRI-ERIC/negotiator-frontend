/// <reference types="cypress" />

describe('Test create negotiation', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8080')
        cy.login('Admin', 'admin')
    })

    context('check if negotiation is visible', () => {
        it('test if table contains negotiation', () => {
            // Number of negotiation is more than 0
            cy.get('.negotiations-number').should('be.visible')
            cy.get('.negotiations-number').contains('0').should('not.exist')

            // Negotiation is visible in table view
            cy.get('tbody > tr > th').should('be.visible')
            cy.get('tbody > tr > :nth-child(2)').should('be.visible')
            cy.get('tbody > tr >  :nth-child(3)').should('be.visible')
            cy.get('tbody > tr >  :nth-child(4)').should('be.visible')
            cy.get('tbody > tr >  :nth-child(5)').should('be.visible')
            cy.get('tbody > tr >  :nth-child(6)').should('be.visible')
        })

        it('test if card contains negotiation', () => {
            // Negotiation is visible in card view
            cy.get('.text-end > :nth-child(1)').click()

            cy.get(':nth-child(1) > .card').should('be.visible')
            cy.get(':nth-child(1) > .card > .card-header').should('be.visible')
            cy.get(':nth-child(1) > .card > .card-header > .float-end > .bg-status-badge').should('be.visible')
            cy.get(':nth-child(1) > .card > .card-body > :nth-child(1)').should('be.visible')
            cy.get(':nth-child(1) > .card > .card-body > :nth-child(2)').should('be.visible')
            cy.get(':nth-child(1) > .card > .card-body > :nth-child(3)').should('be.visible')
        })

        it('test if negotaiton page contains all fields', () => {
            cy.get('tbody > :nth-child(1) > :nth-child(6)').click()

            cy.url().should('contain', '/negotiations')
            cy.url().should('contain', '/ROLE_RESEARCHER')
            //  Title
            cy.get('.row-col-2 > .text-primary')
            //  Badge
            cy.get('.row-col-2 > .bg-status-badge')
            // PROJECT
            cy.get('.list-group > :nth-child(1) > .fs-5').should('be.visible')

            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(2)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(3)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(4)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(5)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(6)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(7)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(8)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(9)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(1) > :nth-child(10)').should('be.visible')

            // REQUEST
            cy.get('.list-group > :nth-child(2) > .fs-5').should('be.visible')

            cy.get('.col-md-8 > .list-group > :nth-child(2) > :nth-child(2)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(2) > :nth-child(3)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(2) > :nth-child(4)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(2) > :nth-child(5)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(2) > :nth-child(6)').should('be.visible')

            //  ETHICS-VOTE
            cy.get('.list-group > :nth-child(3) > .fs-5').should('be.visible')

            cy.get('.col-md-8 > .list-group > :nth-child(3) > :nth-child(2)').should('be.visible')
            cy.get('.col-md-8 > .list-group > :nth-child(3) > :nth-child(3)').should('be.visible')

            // ATTACHMENTS
            cy.get('.list-group > :nth-child(3) > .fs-5').should('be.visible')

            // ATTACHMENTS
            cy.get('.list-group > :nth-child(4) > .fs-5').should('be.visible')

            // SEARCH PARAMETERS
            cy.get(':nth-child(5) > .d-flex > [aria-expanded="true"] > .fs-5').should('be.visible')

            // COLLECTIONS
            cy.get(':nth-child(6) > .mb-3').should('be.visible')


            // Right side informations
            //  Author:
            cy.get('.order-1 > .list-group > :nth-child(1) > .fw-bold').should('be.visible')
            cy.get(':nth-child(1) > .text-secondary-text').should('be.visible')
            //  Email:
            cy.get('.order-1 > .list-group > :nth-child(2) > .fw-bold').should('be.visible')
            cy.get(':nth-child(2) > .text-secondary-text').should('be.visible')
            //  Negotiation ID:
            cy.get('.order-1 > .list-group > :nth-child(3) > .fw-bold').should('be.visible')
            cy.get(':nth-child(3) > .text-secondary-text').should('be.visible')
            //  Submitted at:
            cy.get('.order-1 > .list-group > :nth-child(4) > .fw-bold').should('be.visible')
            cy.get(':nth-child(4) > .text-secondary-text').should('be.visible')
            //  Status:
            cy.get('.list-group > .justify-content-between > :nth-child(1) > .fw-bold').should('be.visible')
            cy.get('.list-group > .justify-content-between > :nth-child(1) > span').should('be.visible')
            //   Download PDF
            cy.get('.btn-sm > .mt-2').should('be.visible')
        })
    })
})
