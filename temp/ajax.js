const APP = (() => {
    var userData = null;
    const myURL = "http://stackoverflow.com";
    const getData = () => {
      $.ajax({
        type: "GET",
        url: myURL,
        success: obj.handleSuccess,
        error: obj.handleError,
      });
    };
    const handleError = () => {
      console.log("ERROR");
    };
    const handleSuccess = (data) => {
      userData = data;
      console.log(userData);
    };
    const render = () => {
      return "<div>some stuff</div>";
    };
    const obj = {
      getData,
      handleError,
      handleSuccess,
      render,
    };
    return obj;
  })();
  module.exports = APP;