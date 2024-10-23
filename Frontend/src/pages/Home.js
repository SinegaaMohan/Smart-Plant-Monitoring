import React from 'react'
import TopicBox from '../components/TopicBox';
import Content from '../components/Content';
import { Link } from 'react-router-dom/dist';
import { useState } from 'react';
import Accord from '../components/Accord';

function buttonClick(){
    console.log("Button is clicked");
    alert("utto ammata taukanna dala");
}

export default function Home() {

    const [count, setCount] = useState(0);
    
    const increment = () =>{
        setCount(count+1);
    };

    const decrement = () =>{
        setCount(count-1);

    };

  return (
    <div>
        <h1>This is the home page!</h1>
        <TopicBox food="bitch" dick="vagina">
            <span>utte sirisena!</span>
        </TopicBox>
        <TopicBox food="bitcsdasdsdh" dick="vagina2">
            <button> utta</button>
        </TopicBox>
        <Content/>
        <Link to="/AIpage">Prompt</Link>
        <br></br>
        <Link to="/About">About</Link>
        <span>Counter</span>
        <p>count is {count}</p>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <Accord/>
        <br></br>
        <button onClick={buttonClick}>click Here</button>
    </div>

  )
}
