/// <reference types="cypress" />

describe('Test negotiation message', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8080')
        cy.login('Admin', 'admin')
        // Go to negotiation
        cy.get('tbody > :nth-child(1) > :nth-child(6)').click()
    })

    context('check if message part in negotiation is visable', () => {
        it('test if all message part are visible', () => {
            // Comment section
            cy.get('[resources="[object Object]"] > :nth-child(1)').should('be.visible')
            // Send message section
            cy.get('[resources="[object Object]"] > :nth-child(3)').should('be.visible')
            cy.get('.mb-4 > .mb-3').should('be.visible')
            cy.get('#recipient').should('be.visible')
            cy.get('.btn-attachment').should('be.visible')
            cy.get('.mb-4 > .d-flex > span').should('be.visible')
        })
    })

    context('check if you can send message in negotiation', () => {
        it('test send a message', () => {
            // Comment section
            cy.get('[resources="[object Object]"] > :nth-child(1)').should('be.visible')
            // Send message section
            cy.get('.mb-4 > .mb-3').type('Hi i want to test message functionality, have a great day.')
            cy.get('#recipient').select('Everyone')
            cy.get('span > .btn').click()
        })
    })
    context('check if message is visible in negotiation', () => {
        it('test message visibility', () => {
            // Comment section
            cy.get('[resources="[object Object]"] > :nth-child(1)').should('be.visible')
            // Display sender and reciver of message
            cy.get('.badge').should('be.visible')
            cy.get('.badge').contains('Author')
            cy.get('.badge').contains('Everyone')
            // Date and time when message is sent
            cy.get(':nth-child(2) > .card-header > .justify-content-between > .d-flex > .text-muted').should('be.visible')
            // Test if text is correct
            cy.get('.card-body').contains('Hi i want to test message functionality, have a great day.')
        })
    })
})
