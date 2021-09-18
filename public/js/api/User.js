// Класс User управляет авторизацией, выходом и регистрацией пользователя из приложения
class User {
  // Имеет свойство URL, равное "/user".
  // static defaultUrl = "/user";
  // static URL = this.defaultUrl;
  static userKey = "user";
  static URL = "/user";
  static options = {
    URL: this.URL,
    // responseType: "json"
  };

  // Устанавливает текущего пользователя в локальном хранилище.
  // Устанавливает в приложении авторизованного (который зарегистрировался) пользователя. Устанавливает в локальном хранилище с ключом user данные пользователя.
  static setCurrent(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Удаляет информацию об авторизованном пользователе из локального хранилища.
  static unsetCurrent() {
    localStorage.removeItem(this.userKey);
  }

  // Возвращает объект текущего авторизованного пользователя. Если его нет, возвращает undefined.
  static current() {
    const currentUserString = localStorage.getItem(this.userKey);
    let currentUser = undefined;
    if(currentUserString) {
      try {
        currentUser = JSON.parse(currentUserString);
      } finally {
        return currentUser;
      }
    } else {
      return undefined;
    }
  }

  // Получает информацию о текущем авторизованном пользователе.
  static fetch(callback) {
    this.options.URL = this.URL + "/current";
    this.options.method = "GET";
    this.options.callback = (err, response) => {
      // User.fetch
      if(response && response.success && response.user) {
        this.setCurrent(response.user);
      } else {
        this.unsetCurrent();
      }
      callback();
    };
    createRequest(this.options, requestCounter);

    // Если пользователь не авторизован, то будет возвращён объект вида:
  }

  // Производит попытку регистрации пользователя. После успешной авторизации необходимо 
  // сохранить пользователя через метод User.setCurrent.
  static register(data, callback) {
    this.options.URL = this.URL + "/register";
    this.options.method = "POST";
    this.options.data = data;
    this.options.callback = (err, response) => {
      if (response && response.success && response.user) {
        this.setCurrent(response.user);
      }
      callback(err, response);
    }
    createRequest(this.options, requestCounter);
  }

  // Производит попытку авторизации. После успешной авторизации необходимо сохранить пользователя 
  // через метод User.setCurrent.
  static login(data, callback) {
    this.options.URL = this.URL + "/login";
    this.options.method = "POST";
    this.options.data = data;
    this.options.callback = (err, response) => {
      if (response && response.success && response.user) {
        this.setCurrent(response.user);
      }
      callback(err, response);              //  параметры?
    }
    createRequest(this.options, requestCounter);
  }

  //  Производит выход из приложения. После успешного выхода необходимо вызвать метод User.unsetCurrent
  static logout(callback) {
    this.options.URL = this.URL + "/logout";
    this.options.method = "POST";
    this.options.callback = (err, response) => {
      if (response && response.success) {
        this.unsetCurrent();
      }
      callback(err, response);              //  параметры?
    }
    createRequest(this.options, requestCounter);
  }
}
