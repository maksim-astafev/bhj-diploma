/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.createIncomeButton = document.querySelector(`.create-income-button`);
    this.createExpenseButton = document.querySelector(`.create-expense-button`);

    if(!document.querySelector("body").contains(element)) {
      throw `Элемент ${element} не существует`;
    }
    this.element = element;

    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.createIncomeButton.onclick = () => {
      App.getModal("newIncome").open();
    };

    this.createExpenseButton.onclick = () => {
      App.getModal("newExpense").open();
    };
  }
}
