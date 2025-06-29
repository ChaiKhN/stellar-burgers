describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
  });

  it('добавляет ингредиент в конструктор', () => {
    cy.get('[data-cy="ingredient-item"]').first().trigger('dragstart');
    cy.get('[data-cy="constructor-area"]').trigger('drop');
    cy.get('[data-cy="constructor-area"] .ingredient-item').should('exist');
  });

  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создаёт заказ и очищает конструктор', () => {
    cy.setCookie('accessToken', 'fake-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    cy.get('[data-cy="ingredient-item"]').eq(0).trigger('dragstart');
    cy.get('[data-cy="constructor-area"]').trigger('drop');

    cy.intercept('POST', '**/orders', {
      body: { order: { number: 12345 } }
    }).as('createOrder');

    cy.get('[data-cy="place-order"]').click();
    cy.wait('@createOrder');
    cy.get('[data-cy="order-number"]').should('contain', '12345');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="constructor-area"] .ingredient-item').should('not.exist');
  });
});
