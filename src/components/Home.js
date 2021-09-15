import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Button, Card, Form, FormControl, ListGroup, Modal } from 'react-bootstrap'
import axios from 'axios'

export default function Home() {
  const [unicorns, setUnicorns] = useState([])
  const [unicornInput, setUnicornInput] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [unicornDelete, setUnicornDelete] = useState(null)
  const [unicornEdit, setUnicornEdit] = useState(null)
  

  // const apiBaseUrl = 'https://crudcrud.com/api/8f1e51230f024f0a96cd510624b8cf8d'
  const apiBaseUrl = 'http://localhost:3000'

  useEffect(() => {
    const getUnicorns = async () => {
      try {
        // retrieve all unicorns from the API
        const response = await axios.get(`${apiBaseUrl}/unicorns`)
        setUnicorns(response.data.map(u => (
          {
            _id: u._id,
            name: u.name,
            age: u.age
          }
        )))
      } catch(e) {
        // if API call was unsuccessful, log the error to the console
        console.error('Error retrieving unicorns!', e)
      }
    }
    getUnicorns()
  }, [])

  const handleAddUnicorn = async () => {
    try {
      // send new unicorn to the API
      const response = await axios.post(`${apiBaseUrl}/unicorns`, {
        name: unicornInput,
        age: Math.ceil(Math.random() * 100)
      })
      
      // if API call was successful, add the new unicorn to state
      const newUnicorn = {
        _id: response.data._id,
        name: unicornInput,
        age: response.data.age
      }
      const updatedUnicorns = [...unicorns]
      updatedUnicorns.push(newUnicorn)
      setUnicorns(updatedUnicorns)
      setUnicornInput('')
    } catch(e) {
      // if API call was unsuccessful, log the error to the console
      console.error('Error creating unicorn!', e)
    }
  }

  const handleDeleteUnicorn = async unicorn => {
    try {
      // delete unicorn from the API
      await axios.delete(`${apiBaseUrl}/unicorns/${unicorn._id}`)

      // if API call was successful, delete the unicorn from state
      const updatedUnicorns = unicorns.filter(u => u._id !== unicorn._id)
      setUnicorns(updatedUnicorns)
      setShowDeleteModal(false)
    } catch(e) {
      // if API call was unsuccessful, log the error to the console
      console.error('Error deleting unicorn!', e)
    }
  }

  const handleEditUnicorn = async unicorn => {
    try {
      // update unicorn in the API
      await axios.put(`${apiBaseUrl}/unicorns/${unicorn._id}`, {
        ...unicorn
      })
      // if API call was successful, delete the unicorn from state
      const updatedUnicorns = unicorns.map(u => {
        if (u._id === unicorn._id) {
          return unicorn
        }
        return u
      })
      setUnicorns(updatedUnicorns)
      setShowEditModal(false)
    } catch(e) {
      // if API call was unsuccessful, log the error to the console
      console.error('Error updating unicorn!', e)
    }
  }

  const handleEditUnicornName = e => {
    setUnicornEdit({
      ...unicornEdit,
      name: e.target.value
    })
    console.log("Editing unicorn: ", unicornEdit)
  }

  const handleEditUnicornAge = e => {
    setUnicornEdit({
      ...unicornEdit,
      age: e.target.value
    })
    console.log(e.target.value)
  }

  const handleCloseDeleteModal = () => {
    setUnicornDelete(null)
    setShowDeleteModal(false)
  }

  const handleCloseEditModal = () => {
    setUnicornEdit(null)
    setShowEditModal(false)
  }

  const handleShowDeleteModal = unicorn => {
    setUnicornDelete(unicorn)
    setShowDeleteModal(true)
  }

  const handleShowEditModal = unicorn => {
    setUnicornEdit(unicorn)
    setShowEditModal(true)
  }

  return (
    <>
      <Container fluid className="main">
        <Row>
          <Col
            xs={12}
            sm={6}
            className="mb-4"
          >
            <Card bg="dark" text="white">
              <Card.Body>
                <Card.Title>
                  <strong>Add a Unicorn!</strong>
                </Card.Title>
                <FormControl type="text" placeholder="Enter a unicorn name..." value={unicornInput} onChange={(e) => setUnicornInput(e.target.value)}></FormControl>
                <Col className="d-flex justify-content-end mt-3">
                  <Button onClick={handleAddUnicorn}>+&#x1f984;</Button>
                </Col>
              </Card.Body>
            </Card>
          </Col>
          <Col
            xs={12}
            sm={6}
          >
            <Card bg="dark" text="white">
              <Card.Body>
                <Card.Title>
                  <strong>Unicorns</strong>
                </Card.Title>
                <FormControl type="text" placeholder="Filter" className="mb-3"></FormControl>
                <ListGroup>
                  {
                    !unicorns.length
                      ? (
                        <span>No unicorns to show.</span>
                      )
                      : (
                        unicorns.map((unicorn, i) => (
                          <ListGroup.Item key={i} variant="warning">
                            <Container fluid>
                              <Row className="d-flex align-items-center">
                                <Col xs={1}>&#x1f984;</Col>
                                <Col><strong>{unicorn.name}</strong> ({unicorn.age})</Col>
                                <Col xs={2} className="d-flex justify-content-end">
                                  <Button onClick={() => handleShowEditModal(unicorn)}>&#x270f;</Button>
                                  <Button variant="danger" onClick={() => handleShowDeleteModal(unicorn)}>X</Button>
                                </Col>
                              </Row>
                            </Container>
                          </ListGroup.Item>
                        ))
                      )
                  }
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <h3>Delete Unicorn</h3>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete:
          {
            unicornDelete && <ListGroup.Item variant="warning">&#x1f984; {unicornDelete.name}</ListGroup.Item>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Close</Button>
          <Button variant="danger" onClick={() => handleDeleteUnicorn(unicornDelete)}>-&#x1f984;</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <h3>Edit Unicorn</h3>
        </Modal.Header>
        <Modal.Body>
          {
            unicornEdit && (
              <>
                <Form.Label>Name</Form.Label>
                <FormControl type="text" value={unicornEdit.name} onChange={handleEditUnicornName}></FormControl>
                <Form.Label>Age</Form.Label>
                <FormControl type="text" value={unicornEdit.age} onChange={handleEditUnicornAge}></FormControl>
              </>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
          <Button variant="primary" onClick={() => handleEditUnicorn(unicornEdit)}>&#x270f;&#x1f984;</Button>
        </Modal.Footer>
      </Modal>
    </>
  )   
}