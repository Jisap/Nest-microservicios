const Deprecated = (deprecationReason: string) => {

  return (                                            // Typescript proporciona estos 3 argumentos a la función del decorador
    target: any,                                      // La clase que contiene el método decorado (Pokemon)
    memberName: string,                               // El nombre del método decorado (speak)
    propertyDescriptor: PropertyDescriptor            // Accede al método original y modificar su comportamiento.
  ) => {
    //   console.log({target})
    return {

      get() {
        const wrapperFn = (...args: any[]) => {                                                   // Wrapper es un contenedor para el método original      
          console.warn(`Method ${memberName} is deprecated with reason: ${deprecationReason}`);   // La función get imprimirá un mensaje de advertencia                                   
          propertyDescriptor.value.apply(this, args);                                             // Luego se llama al método original (speak) para que se use. 
        }
        return wrapperFn;
      }

    }
  }
}


export class Pokemon {

  constructor(
    public readonly id: number,
    public name: string,
  ) { }

  scream() {
    console.log(`${this.name.toUpperCase()}!!`)
  }

  @Deprecated('Most use speak2 method instead')
  speak() {
    console.log(`${this.name}, ${this.name}!`)
  }

  @Deprecated('Most use speak3 method instead')
  speak2() {
    console.log(`${this.name}, ${this.name}!!!`)
  }

}

export const charmander = new Pokemon(4, 'Charmander');

charmander.speak();