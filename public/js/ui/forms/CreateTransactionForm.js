"use strict";

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);

    this.accountsSelects = Array.from(document.querySelectorAll(`.accounts-select`));

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      // CreateTransactionForm
      if(!err && response && response.data) {
        const accounts = Array.from(response.data);
        this.accountsSelects.forEach(select => {
          const options = Array.from(select.querySelectorAll("option"));
          options.forEach(option => {
            option.remove();
          });
          
          accounts.forEach(account => {
            select.insertAdjacentHTML("beforeEnd", `<option value="${account.id}">${account.name}</option>`);
          });
        });
      } 
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    if(data && data.sum) {
      data.sum = Number(data.sum);
    }
    
    Transaction.create(data, (err, response) => {
      // CreateTransactionForm.onSubmit
      if(!err && response && response.success) {
        this.element.reset();
        if(data && data.type) {
          switch (data.type) {
            case "income":
              App.getModal("newIncome").close();
              break;
            case "expense":
              App.getModal("newExpense").close();
              break;
            }
        }

        App.update();
      }
    });

    event.preventDefault();
  }
}