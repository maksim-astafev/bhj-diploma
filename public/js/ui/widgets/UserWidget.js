/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы
 * */

class UserWidget {
  // static userNameLabel = document.querySelector(`.user-name`);

  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    this.userNameLabel = document.querySelector(`.user-name`);

    if(!document.querySelector("body").contains(element)) {
      throw `Элемент ${element} не существует`;
    }
    this.element = element;

    // this.userNameLabel = document.querySelector(`.user-name`);
    // console.log(this.userNameLabel);
    // debugger;
  }

  /**
   * Получает информацию о текущем пользователе
   * с помощью User.current()
   * Если пользователь авторизован,
   * в элемент .user-name устанавливает имя
   * авторизованного пользователя
   * */
  update(){
    const currentUser = User.current();
    // console.log(currentUser);

    if(currentUser && currentUser.name) {
      this.userNameLabel.textContent = currentUser.name;
    }
  }
}
