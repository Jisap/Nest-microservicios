import './style.css'
//import typescriptLogo from './typescript.svg'
//import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { templateString } from '../bases/01-type';


document.querySelector<HTMLDivElement>('#app')!.innerHTML = templateString


setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
