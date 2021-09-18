/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением "/account"
 * */
class Account extends Entity {
  static URL = "/account";
  static options = {
    URL: this.URL,
  };

  /**
   * Получает информацию о счёте
   * */
  static get(id = "", callback){
    this.options.method = "GET";
    // this.options.id = id;
    this.options.URL = this.URL + "/" + id;
    this.options.callback = callback;

    createRequest(this.options, requestCounter);
    this.options.URL = this.URL;
  }
}