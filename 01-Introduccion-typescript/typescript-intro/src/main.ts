import './style.css'

import { name, templateString } from '../bases/01-type';


const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello ${ name }</h1>
  </br>
  ${templateString}
`


