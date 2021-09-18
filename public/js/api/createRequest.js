"use strict";

// Основная функция для совершения запросов на сервер.
let requestCounter = 1;

const createRequest = (options = {}, useCounter) => {
  requestCounter++;
  // debugger;
  // const method = ;

  const xhr = new XMLHttpRequest;
  xhr.responseType = "json";

  switch (options.method) {
    case "GET":
      let URL = options.URL;
      if(options.data) {
        let first = true;
        for(const key in options.data) {
          if(first) {
            URL += "?";
            first = false;
          } else {
            URL += "&";
          }
          URL += key + "=" + options.data[key];
        }
      } 
        
      try {  
        xhr.open(options.method, URL);
        xhr.send();
      } catch (error) {
        options.callback(error);
      }
      break;
  
    default:
      const formData = new FormData;

      if(options.data) {
        for(const key in options.data) {
          formData.append(key, options.data[key]);
        }
      }
  
      try {
        xhr.open(options.method, options.URL);
        xhr.send(formData);
      } catch (error) {
        options.callback(error);
      }
      break;
  }

  // console.log(useCounter, "request:", options);
  // console.log(useCounter, "requestCallback:", options.callback);
  // debugger;

  const onloadCallback = options.callback;
  xhr.onload = () => {
    // console.log(useCounter, "response:", xhr.response);
    // console.log(useCounter, "onloadCallback:", onloadCallback);
    // debugger;

    let err = null;
    let response = null;

    if(xhr.response) {
      if(xhr.response.success) {
        response = xhr.response;
      } 
      if(xhr.response.error) {
        err = xhr.response.error;
        console.log(`Ошибка: ${err}`);
      }
      if(xhr.response.success && xhr.response.error) {
        throw("Проверить бэк, в response одновременно получены success и error");
      }
    }
    
    // debugger;
    onloadCallback(err, response);
  };

};