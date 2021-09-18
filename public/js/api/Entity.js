/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
    static URL = "";
    static options = {
      URL: this.URL
    };
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback){
    this.options.method = "GET";
    this.options.data = data;
    this.options.callback = callback;
    createRequest(this.options, requestCounter);
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    this.options.method = "PUT";
    this.options.data = data;
    this.options.callback = callback;
    createRequest(this.options, requestCounter);
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback ) {
    this.options.method = "DELETE";
    this.options.data = data;
    this.options.callback = callback;
    createRequest(this.options, requestCounter);
  }
}