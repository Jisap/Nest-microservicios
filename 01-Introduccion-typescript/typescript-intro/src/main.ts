import './style.css'

//import { name, templateString } from '../bases/01-type';
//import { charmander, bulbasaur, pokemons } from '../bases/02-objects';
//import { charmander } from '../bases/03-classes'
//import { charmander } from '../bases/04-injection';
//import { charmander } from '../bases/05-decorators';
import { charmander } from '../bases/06-decorators2';

const app = document.querySelector<HTMLDivElement>('#app')!;

// 01-types.ts

// app.innerHTML = `
//   <h1>Hello ${ name }</h1>
//   </br>
//   ${templateString}
// `

// 02-objects.ts
// app.innerHTML = `
//   <h1>Hello ${charmander.name} ${charmander.id}!</h1>
//   <h1>Hello ${bulbasaur.name} ${bulbasaur.id}</h1>
// `;

// 03 classes // 04 injections
app.innerHTML = `
  <h1>Hello ${charmander.name} ${charmander.id}!</h1>
`;


