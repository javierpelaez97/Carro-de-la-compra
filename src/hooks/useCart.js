import { useEffect, useState, useMemo } from "react"
import {db} from "../data/db"


const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart): []                  //Primero va a buscar si tiene algo si no lo tiene va a abrir un array vacío
      }
    
      const [data] = useState (db)
    
      const [cart, setCart] = useState(initialCart)
    
      const MAX_ITEMS = 5
    
      useEffect (() => {                                                             //Sirve para ejecutar siempre sin necesidad de entrar en esa funcion ni ejecutarla
        localStorage.setItem('cart', JSON.stringify(cart))
      },[cart])
    
      function addToCart(item) {                                                    //Función para añadir los objetos del Db al carro
    
          const itemExist = cart.findIndex(guitar => guitar.id === item.id )        //Creamos la variable y le indicamos que busque en el array y lo modifique 
          if(itemExist >= 0 ){                                                      // Si es mayor o igual a 0 que no cree el array 
            const updatedCart = [...cart]
            updatedCart[itemExist].quantity++                                       //Cogemos la nueva variable que ya tiene el carrito y si el item existe sumamos 1 al elemente 'quantity'
            setCart(updatedCart)
          }else{
            item.quantity = 1                                                       //Para que añada un nuevoelemento al objeto llamado cantidad, asi podremos saber cuantos hay
            setCart ([...cart, item])                                               //Cojemos todos los elementos que tenemos en cart y le añadimos el item nuevo        
          }
         
      }
    
      function removeFromCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id ))
        
      }
      function increaseFromCart(id){
        const updatedCart = cart.map(item => {
          if(item.id === id && item.quantity < MAX_ITEMS){
            return{
              ...item,
              quantity: item.quantity+1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function decrementCart(id){
       const updatedCart = cart.map (item => {
        if (item.id === id && item.quantity > 1){
          return{
            ...item,
            quantity: item.quantity-1
          }
        }
        return item
       })
       setCart(updatedCart)
       }
    
      function clearCart(){
        setCart([])
      }
      const isEmpty = useMemo (() => cart.length === 0, [cart] ) //Para que haga la recarga solo cuando queramos
      const cartTotal = useMemo (() => cart.reduce((total, item ) => total + (item.quantity * item.price ), 0,  [cart]))
    
    
    return{
        data, 
        cart,
        addToCart,
        increaseFromCart,
        decrementCart,
        clearCart,
        removeFromCart, 
        isEmpty,
        cartTotal 
    }
}

export {
    useCart
}