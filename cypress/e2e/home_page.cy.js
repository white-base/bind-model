
// describe('The Home Page', () => {
//   it('successfully loads', () => {
//     cy.visit('http://localhost:8080') // change URL to match your dev URL
//     // cy.visit('/') // change URL to match your dev URL
//   })
// })
// delete wait...

describe('My First Test', () => {
  it('Does not do much!', () => {
    // expect(true).to.equal(true)
  })
  it('successfully loads', () => {
    // cy.visit('http://localhost:8080/index.htm') // change URL to match your dev URL

    
    // cy.visit('/') // change URL to match your dev URL
    // cy.visit({
    //   url: '/index.htm',
    //   method: 'GET',
    // })
    cy.visit('/index.html');
    // cy.contains('BBB').type('AAA')
    cy.get('input').type('sss')

    console.log(this);
    
    cy.get('input').then((cc) => {
      console.log('333');
      // alert(cc)
      console.log(cc)
      // console.log(KKK)
    });
    
    cy.window().then((win) => {
      // use this area to code using the variable, prepending with "win." eg.
      cy.log(win.KKK) // or console.log(win.varyingUrl)
      // debugger 
  
    })

  })
})