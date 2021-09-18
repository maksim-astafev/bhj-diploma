"use strict";

/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    this.lastOptions = null;
    this.contentWrapper = document.querySelector(`.content-wrapper`);
    this.removeAccountButton = this.contentWrapper.querySelector(`.remove-account`);
    this.contentTitleElement = this.contentWrapper.querySelector(`.content-title`);
    this.contentBlock = this.contentWrapper.querySelector(`.content`);

    if(!document.querySelector("body").contains(element)) {
      throw `Элемент ${element} не существует`;
    }
    this.element = element;

    this.registerEvents();
  }

  /**
   * перерисовывает страницу в случае, если была добавлена новая транзакция или удалена имеющаяся
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
   removeAccount(savedThis) {
    if(savedThis.lastOptions) {
      if(confirm("Вы действительно хотите удалить счёт?")) {
        Account.remove({id: savedThis.lastOptions.account_id}, (err, response) => {
          // TransactionsPage.removeAccount
          if(!err && response && response.success) {
            savedThis.clear();
            App.update();
          }
        });
      }
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.removeAccountButton.onclick = () => this.removeAccount(this);
    const transactions = Array.from(this.contentBlock.querySelectorAll(`.transaction__remove`));
    if(transactions) {
      transactions.forEach(transaction => {
        transaction.onclick = () => {
          if(transaction.dataset.id) {
            this.removeTransaction(transaction.dataset.id);
          }
        };
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждения действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(confirm("Вы действительно хотите удалить транзакцию?")) {
      Transaction.remove({"id": id}, (err, response) => {
        // TransactionsPage.removeTransaction
        if(response && response.success) {
          this.update();
          App.updateWidgets();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    // debugger;

    if(options) {
      this.lastOptions = options;
      if(options.account_id) {
        Account.get(options.account_id, (err, response) => {
          // TransactionsPage.render
          if(!err && response && response.data && response.data.name) {
            this.renderTitle(response.data.name);
            }
        });
        
        Transaction.list(options, (err, response) => {
          // TransactionsPage.list
          if(!err && response && response.data) {
            this.renderTransactions(response.data);
          }
        });
      }
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const transactions = Array.from(this.contentBlock.querySelectorAll(`.transaction`));
    if(transactions) {
      transactions.forEach(transaction => {
        transaction.remove();
      });
    }
    this.renderTransactions([]);
    this.renderTitle("Название счёта");

    // debugger;
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.contentTitleElement.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  static formatDate(date) {
    const months = [
      "номера месяцев с 1",
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря"
    ];

    date = String(date);
    const parts = date.split("T");
    const day = parts[0].split("-");
    const time = parts[1].split(":");
    if(day && time) {
      return day[2] + " " + months[Number(day[1])] + " " + day[0] + " г. в " + time[0] + ":" + time[1];
    } else {
      return "Некорректный формат времени";
    }
  }

  static formatSum(sum) {
    let value = Array.from(String(sum));
    const length = value.length;
    const digits = 3;
    const first = length % digits;
    const quantity = Math.trunc(length / digits);
    for(let n=0; n<quantity; n++) {
      const index = first + n*(digits + 1);
      value.splice(index, 0, " ");
    }

    let result = "";
    value.forEach(char => {
      result += String(char);
    });

    return result;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    if(item.type && item.id && item.name && item.sum && item.created_at) {
      let type = "transaction_";
      switch (item.type) {
        case "income":
            type += "income";
          break;
          case "expense":
            type += "expense";
            break;
      }

      // debugger;

      return `
        <div class="transaction ${type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <div class="transaction__date">${TransactionsPage.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
              ${TransactionsPage.formatSum(item.sum)} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
        </div>
      `;
    } else {
      return null;
    }
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */ 
  renderTransactions(data){
    const blankContentBlock = document.createElement("section");
    blankContentBlock.className = "content";
    this.contentBlock.replaceWith(blankContentBlock);
    this.contentBlock = this.contentWrapper.querySelector(`.content`);
   
    data = Array.from(data);
    data.forEach(transaction => {
      const transactionHtml = this.getTransactionHTML(transaction);
      if(transactionHtml) {
        this.contentBlock.insertAdjacentHTML("beforeEnd", transactionHtml);
      }
    });

    this.registerEvents();
  }
}