describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('добавляет конкретный ингредиент в конструктор', () => {
    const ingredientName = 'Флюоресцентная булка R2-D3';

    cy.get('[data-cy="constructor-area"]').should('not.contain', ingredientName);

    cy.contains('[data-cy="ingredient-item"]', ingredientName)
      .as('targetIngredient')
      .trigger('dragstart');

    cy.get('[data-cy="constructor-area"]').trigger('drop');

    cy.get('[data-cy="constructor-area"]').should('contain', ingredientName);
  });

  it('открывает модалку с данными выбранного ингредиента', () => {
    const ingredientName = 'Флюоресцентная булка R2-D3';

    cy.contains('[data-cy="ingredient-item"]', ingredientName).click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal"]').should('contain', ingredientName);

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создаёт заказ и очищает конструктор', () => {
    cy.setCookie('accessToken', 'fake-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    const ingredientName = 'Флюоресцентная булка R2-D3';

    cy.contains('[data-cy="ingredient-item"]', ingredientName).trigger('dragstart');
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
