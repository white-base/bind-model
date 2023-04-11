// import Feature from './Feature'
const Feature = require('./Feature')

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM("");
const $ = require( "jquery" )( window );

console.log(1);

describe('Feature', () => {
  const fakeData = { x: 0, y: 0 }
  let subject
  let callback
  
  beforeEach(() => {
    callback = jest.fn()
    $.ajax = jest.fn(() => {
      let deferred = $.Deferred()

      deferred.resolve(fakeData)
      return deferred.promise()
    })
    subject = new Feature()
  })
  
  it('loads JSON data', () => {
    url = 'load_path'
    subject.load(url, callback)

    expect($.ajax).toHaveBeenCalledWith({ url })
  })
  it('calls callback when successful', () => {
    expect(callback).toHaveBeenCalledWith(null, fakeData)
  })
})