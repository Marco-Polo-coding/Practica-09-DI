import{R as a}from"./index.D15Q2Owl.js";const S=t=>{let e;const n=new Set,c=(s,u)=>{const o=typeof s=="function"?s(e):s;if(!Object.is(o,e)){const g=e;e=u??(typeof o!="object"||o===null)?o:Object.assign({},e,o),n.forEach(f=>f(e,g))}},i=()=>e,r={setState:c,getState:i,getInitialState:()=>l,subscribe:s=>(n.add(s),()=>n.delete(s))},l=e=t(c,i,r);return r},d=t=>t?S(t):S,I=t=>t;function j(t,e=I){const n=a.useSyncExternalStore(t.subscribe,()=>e(t.getState()),()=>e(t.getInitialState()));return a.useDebugValue(n),n}const b=t=>{const e=d(t),n=c=>j(e,c);return Object.assign(n,e),n},x=t=>t?b(t):b;export{x as c};
