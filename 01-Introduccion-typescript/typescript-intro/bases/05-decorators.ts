class NewPokemon {
  constructor(
    public readonly id: number,
    public name: string,
  ) { }

  scream() {
    console.log(`NO QUIERO!!`);
  }

  speak() {
    console.log(`NO QUIERO HABLAR!!`);
  }
}



const MyDecorator = () => {         // Un decorador es una simple función
  return (target: Function) => {    // que llama a otra función
    //console.log(target)
    return NewPokemon;              // para ejecutar los métodos de esta (NewPokemon.scream y NewPokemon.speak)
  }                                 // Si coinciden los sustituye y si no existen se agregan a los de la clase ppal.
}



@MyDecorator()
export class Pokemon {

  constructor(
    public readonly id: number,
    public name: string,
  ) { }

  scream() {
    console.log(`${this.name.toUpperCase()}!!`)
  }

  speak() {
    console.log(`${this.name}, ${this.name}!`)
  }

}

export const charmander = new Pokemon(4, 'Charmander');

charmander.scream();
charmander.speak();