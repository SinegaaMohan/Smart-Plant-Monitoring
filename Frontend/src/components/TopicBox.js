import React from 'react'
import './topicbox.css'

export default function TopicBox(props) {
    
  return (
    <div>
        <div className="topicbox">
            <span className="text">sjjhdsdhasd {props.food} wanna suck is {props.dick}</span>
            {props.children}
        </div>
    </div>
  )
}
