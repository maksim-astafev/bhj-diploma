/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( "user-logged" )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    // Регистрирует пользователя через User.register
    User.register(data, (err, response) => {
      if(!err && response && response.success) {
        this.element.reset();
        App.setState("user-logged");
        App.getModal("register").close();

        App.update();
      } 
    });
    event.preventDefault();
  }
}