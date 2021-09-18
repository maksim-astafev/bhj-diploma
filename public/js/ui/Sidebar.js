/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  static sidebarOpenClass = "sidebar-open";
  static sidebarCollapseClass = "sidebar-collapse";
  static sidebarBody = document.querySelector(`.sidebar-mini`);
  static sidebarToggleButton = this.sidebarBody.querySelector(`.sidebar-toggle`);
  static menuItemRegister = this.sidebarBody.querySelector(`.menu-item_register`);
  static menuItemLogin = this.sidebarBody.querySelector(`.menu-item_login`);
  static menuItemLogout = this.sidebarBody.querySelector(`.menu-item_logout`);

  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    this.sidebarToggleButton.onclick = () => {
      this.sidebarBody.classList.toggle(this.sidebarOpenClass);
      this.sidebarBody.classList.toggle(this.sidebarCollapseClass);
    };
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регистрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    this.menuItemRegister.onclick = () => {
      App.getModal("register").open();
    };

    this.menuItemLogin.onclick = () => {
      App.getModal("login").open();
    };

    this.menuItemLogout.onclick = () => {
      User.logout((err, response) => {
        if(!err && response && response.success) {
          App.setState("init");
        }
      });
    };
  }
}