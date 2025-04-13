import 'logic-entity';

declare module 'logic-entity' {
  namespace Util {
    /**
     * Check if the given string is a valid CSS selector.
     * 
     * @param selector - CSS selector string
     */
    function validSelector(selector: string): boolean;

    /**
     * Loads the script for the external path.  
     * 
     * @param url - Script URL
     * @param callback - Callback function to call after loading is complete
     */
    function loadScript(url: string, callback?: Function)
  }
}