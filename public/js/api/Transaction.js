/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * */
class Transaction extends Entity {
  // * Имеет свойство URL со значением "/transaction"
    // Имеет свойство URL, равно пустой строке.
  static URL = "/transaction";
  static options = {
    URL: this.URL,
  };
}

