import React, {useState, useEffect} from 'react'

export default function AIpage() {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  useEffect(() =>{
   console.log("Runs only on mount");
  },[])
  useEffect(() =>{
    alert("Runs after every re-render")
  })
  useEffect(() =>{
    console.log(`New count is: ${count}`);
  },[count])



  return (
    <div>
       <div>
          AI promptPage
        </div> 
    
        <div>
          <h1>Count: {count}</h1>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
        </div>
    </div>
  )
}
