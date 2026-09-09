'use strict';
(() => {
 const key='form-cart-v1';
 let items=[];
 try {const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved)) items=saved.filter(i=>i&&StoreProducts.some(p=>p.id===i.id&&p.sizes.includes(i.size))&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=99).reduce((result,i)=>{const old=result.find(x=>x.id===i.id&&x.size===i.size);if(old) old.quantity=Math.min(99,old.quantity+i.quantity);else result.push({id:i.id,size:i.size,quantity:i.quantity});return result;},[]);} catch {items=[];}
 function commit(){try{localStorage.setItem(key,JSON.stringify(items));}catch{notify('Your browser cannot save the bag. Keep this page open.');}document.dispatchEvent(new CustomEvent('cartchange'));}
 window.notify = message => {const el=document.getElementById('toast');if(!el)return;el.textContent=message;el.classList.add('visible');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('visible'),4000);};
 window.Cart={
  getItems:()=>items.map(i=>({...i,product:StoreProducts.find(p=>p.id===i.id)})),
  count:()=>items.reduce((s,i)=>s+i.quantity,0),
  subtotal:()=>items.reduce((s,i)=>s+StoreProducts.find(p=>p.id===i.id).price*i.quantity,0),
  shipping:()=>items.length?(Cart.subtotal()>=2000?0:120):0,
  add(id,size,quantity=1){const p=StoreProducts.find(p=>p.id===id);if(!p||!p.sizes.includes(size))throw new Error('Please select a size first.');if(!Number.isInteger(quantity)||quantity<1||quantity>99)throw new Error('Choose a quantity from 1 to 99.');const existing=items.find(i=>i.id===id&&i.size===size);if(existing&&existing.quantity+quantity>99)throw new Error('You can order up to 99 of each size.');if(existing)existing.quantity+=quantity;else items.push({id,size,quantity});commit();},
  update(id,size,quantity){if(!Number.isInteger(quantity)||quantity<1||quantity>99)return false;const item=items.find(i=>i.id===id&&i.size===size);if(item){item.quantity=quantity;commit();}return true;},
  resize(id,size,newSize){const p=StoreProducts.find(p=>p.id===id);if(!p||!p.sizes.includes(newSize))return;const item=items.find(i=>i.id===id&&i.size===size);if(!item||size===newSize)return;const existing=items.find(i=>i.id===id&&i.size===newSize);if(existing){if(existing.quantity+item.quantity>99){notify('This size would exceed the maximum quantity of 99.');return;}existing.quantity+=item.quantity;items=items.filter(i=>i!==item);}else item.size=newSize;commit();},
  remove(id,size){items=items.filter(i=>i.id!==id||i.size!==size);commit();},
  clear(){items=[];commit();}
 };
 document.addEventListener('cartchange',()=>document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=Cart.count()));
 document.addEventListener('DOMContentLoaded',()=>{document.dispatchEvent(new CustomEvent('cartchange'));const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();});
})();
