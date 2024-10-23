import React from 'react'
import { Accordion } from 'react-bootstrap'

export default function Accord() {
  return (
    <Accordion>
    <Accordion.Item eventKey="0">
      <Accordion.Header>Accordion Item #1</Accordion.Header>
      <Accordion.Body>
        This is the content for Accordion Item #1. You can put any text, images, or even other components here.
      </Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="1">
      <Accordion.Header>Accordion Item #2</Accordion.Header>
      <Accordion.Body>
        This is the content for Accordion Item #2. You can put any text, images, or even other components here.
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  )
}
