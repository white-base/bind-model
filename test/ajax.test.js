
  
// const {jquery } = require('jquery');
// const $ = jquery;
var $ = require( "jquery" );

const APP = require("./ajax");

  describe("Ajax", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    it("Data should load", () => {
      const ajaxSpy = jest.spyOn($, "ajax");
      APP.getData();
      expect(ajaxSpy).toBeCalledWith({
        type: "GET",
        url: "http://stackoverflow.com",
        success: expect.any(Function),
        error: expect.any(Function),
      });
    });
    it("should handle success", () => {
      const mUser = { userId: 1 };
      const logSpy = jest.spyOn(console, "log");
      APP.handleSuccess(mUser);
      expect(logSpy).toBeCalledWith(mUser);
    });
    it("should handle error", () => {
      const logSpy = jest.spyOn(console, "log");
      APP.handleError();
      expect(logSpy).toBeCalledWith("ERROR");
    });
  });