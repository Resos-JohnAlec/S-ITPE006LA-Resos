// Dependency-free checks: node test-store.js
const fs=require('fs');
const vm=require('vm');
const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
function setup(saved='[]'){
 const storage=new Map([['form-cart-v1',saved]]), elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',hidden:false,value:'',listeners:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},focus(){},querySelectorAll(){return [];},querySelector(){return null;},addEventListener(name,fn){this.listeners[name]=fn;}});return elements.get(id);};
 const scope={Intl,console,crypto:webcrypto,Uint32Array,setTimeout(){},clearTimeout(){},CustomEvent:class{},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},document:{getElementById:element,querySelectorAll:()=>[],addEventListener(){},dispatchEvent(){}},scrollTo(){}};
 scope.window=scope;vm.createContext(scope);
 for(const file of ['products','cart'])vm.runInContext(fs.readFileSync(`js/${file}.js`,'utf8'),scope);
 return {scope,element,storage};
}
const {scope:s,element,storage}=setup();
assert.equal(s.StoreProducts.length,10);
assert.throws(()=>s.Cart.add('p01',''),/size/);
assert.throws(()=>s.Cart.add('p01','M',1.5),/quantity/);
s.Cart.add('p01','M',2);s.Cart.add('p01','M',1);s.Cart.add('p01','L',1);
assert.equal(s.Cart.count(),4);assert.equal(s.Cart.subtotal(),2360);assert.equal(s.Cart.shipping(),0);
s.Cart.resize('p01','L','M');assert.equal(s.Cart.getItems().length,1);assert.equal(s.Cart.count(),4);
assert.equal(s.Cart.update('p01','M',0),false);
s.Cart.update('p01','M',1);assert.equal(s.Cart.subtotal(),590);assert.equal(s.Cart.shipping(),120);
assert.equal(setup(storage.get('form-cart-v1')).scope.Cart.count(),1);
assert.equal(setup('invalid json').scope.Cart.count(),0);
assert.equal(setup('[null,{"id":"fake","size":"S","quantity":2},{"id":"p01","size":"S","quantity":-1}]').scope.Cart.count(),0);
vm.runInContext(fs.readFileSync('js/checkout.js','utf8'),s);
for(const [field,bad,good] of [['name',' ','Ana Santos'],['email','wrong@','ana@example.com'],['phone','12345','0917 123 4567'],['postal','123','1000'],['street','','12 Main Street']]){
 assert.notEqual(s.validation(field,bad),'');assert.equal(s.validation(field,good),'');
}
assert.equal(s.validation('phone','+639171234567'),'');
vm.runInContext("Object.assign(customer,{name:'Ana <Santos>',email:'ana@example.com',phone:'09171234567',street:'12 Main',barangay:'Poblacion',city:'Makati',province:'Metro Manila',postal:'1200'});step=3;render();",s);
assert.match(element('checkout-panel').innerHTML,/Ana &lt;Santos&gt;/);
assert.match(element('checkout-panel').innerHTML,/Size M · Qty 1/);
vm.runInContext('step=4;render();customer.payment="GCash";',s);
element('payment-form').listeners.submit({preventDefault(){}});
assert.equal(s.Cart.count(),0);assert.equal(storage.get('form-cart-v1'),'[]');
assert.match(element('checkout-panel').innerHTML,/DEMO ORDER SUCCESSFULLY PLACED/);
assert.match(element('checkout-panel').innerHTML,/FORM-\d{8}-[A-Z0-9]+/);
assert.match(element('checkout-panel').innerHTML,/GCash/);
assert.match(element('checkout-panel').innerHTML,/710\.00/);
for(const p of s.StoreProducts)assert.ok(fs.existsSync(p.image),p.image);
assert.ok(fs.existsSync('images/hero.svg'));
console.log('Passed: catalog assets, size/quantity validation, cart merge/update, persistence, shipping, field validation, escaped review, and order confirmation.');
