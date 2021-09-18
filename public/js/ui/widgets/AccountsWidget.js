"use strict";

/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

 class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.activeAccount = null;
    this.activeAccountId = null;
    this.accountsPanelBlock = document.querySelector(`.accounts-panel`);
    this.createAccountButton = this.accountsPanelBlock.querySelector(`.create-account`);

    if(!document.querySelector("body").contains(element)) {
      throw `Элемент ${element} не существует`;
    }
    this.element = element;
    
    this.update();
    this.registerEvents();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.createAccountButton.onclick = () => {
      App.getModal("createAccount").open();
    };
    
    const accounts = Array.from(this.accountsPanelBlock.querySelectorAll(`.account`));
    accounts.forEach(account => {
      account.onclick = () => this.onSelectAccount(account);
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if(User.current()) {
      Account.list({}, (err, response) => {
        // AccountsWidget.update
        if(!err && response && response.success && response.data) {
          this.clear();
          this.renderItems(Array.from(response.data));

          if(this.activeAccount) {
            const accounts = Array.from(this.accountsPanelBlock.querySelectorAll(".account"));
            accounts.forEach(account => {
              if(account.dataset.id === this.activeAccountId) {
                this.activeAccount = account;
                this.activeAccount.classList.add("active");
              }
            });
          }
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountElements = Array.from(this.accountsPanelBlock.querySelectorAll(`.account`));
    accountElements.forEach(account => {
      account.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    if(this.activeAccount) {
      this.activeAccount.classList.remove("active");
    }

    element.classList.add("active");
    this.activeAccount = element;
    this.activeAccountId = element.dataset.id;

    if(element.dataset.id) {
      App.showPage("transactions", { "account_id": element.dataset.id });
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    if(item.name && item.id) {
      return `
        <li class="account" data-id="${item.id}">
          <a href="#">
              <span>${item.name}</span> /
              <span>${TransactionsPage.formatSum(item.sum)} ₽</span>
          </a>
        </li>
      `;
    } else {
      return null;
    }
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItems(data){
    data = Array.from(data);
    data.forEach(account => {
      this.accountsPanelBlock.insertAdjacentHTML("beforeEnd", this.getAccountHTML(account));
    });

    this.registerEvents();
  }
}