/// <reference types="Cypress" />


describe('Blog app', function () {
  const user = {
    username: 'bird',
    name: 'bird',
    password: 'bird1234'
  }
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request(
      'POST',
      'http://localhost:3003/api/users',
      user
    )
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#btn-login').click()

      cy.contains(`${user.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password + '12345')
      cy.get('#btn-login').click()

      cy.get('.notification')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login(user)
    })

    it('A blog can be created', function () {
      const blog = {
        title: 'my title 100',
        author: user.name,
        url: 'xxx.example'
      }
      cy.contains('new note').click()
      cy.get('#inputTitle').type(blog.title)
      cy.get('#inputAuthor').type(blog.author)
      cy.get('#inputUrl').type(blog.url)
      cy.get('#btn-create-blog').click()

      cy.get('.notification')
        .should('contain', `a new blog ${blog.title}! by added ${user.name}`)
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('.blog-item').should('contain', `${blog.title} ${blog.author}`)
      cy.get('.viewAll').should('contain', 'view')
    })
  })
})