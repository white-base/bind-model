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
    function loadScript(url: string, callback?: Function): void

    /**
    * Collect the text of the DOM end (leaf) element
    * Returns a list of selectors that have organized unnecessary intermediate tags·:nth-child(1).
    * Each step is separated by a space (a grandchild selector).
    *
    * @returns {string[]} example) #sod_fin_orderer tr:nth-child(1) td | text | Hong Gil-dong
    */
    function extractSelector(): string[];
  }
}