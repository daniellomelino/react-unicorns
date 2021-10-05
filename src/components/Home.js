import React, { useEffect, useReducer, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Button, ButtonGroup, Card, Form, ListGroup, Modal } from 'react-bootstrap'
import axios from 'axios'

const actions = {
  addCreature: 'ADD_CREATURE',
  addCreatures: 'ADD_CREATURES',
  editCreature: 'EDIT_CREATURE',
  deleteCreature: 'DELETE_CREATURE'
}

function reducer(state, action) {
  let newState = { ...state }
  switch (action.type) {
    case actions.addCreatures:
      newState = {
        creatures: [
          ...state.creatures,
          ...action.payload
        ]
      }
      return newState
    case actions.addCreature:
      const newCreatures = [...state.creatures]
      newCreatures.push(action.payload)
      newState = {
        creatures: newCreatures
      }
      return newState
    case actions.editCreature:
      const updatedCreatures = state.creatures.map(c => {
        if (c._id === action.payload._id) {
          return action.payload
        }
        return c
      })
      newState.creatures = updatedCreatures
      return newState
    case actions.deleteCreature:
      const creaturesAfterDelete = state.creatures.filter(c => c._id !== action.payload._id)
      newState.creatures = creaturesAfterDelete
      return newState
    default:
      return newState
  }
}

export default function Home() {
  const [creatureInput, setCreatureInput] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [creatureDelete, setCreatureDelete] = useState(null)
  const [creatureEdit, setCreatureEdit] = useState(null)

  const initialState = { creatures: [] }
  const [state, dispatch] = useReducer(reducer, initialState)

  const apiBaseUrl = 'http://localhost:3000/api'

  useEffect(() => {
    const getCreatures = () => {
      const creatureTypes = ['bison', 'unicorns']
      try {
        // retrieve all creatures from the API
        creatureTypes.forEach(async creatureType => {
          const rCreatures = await axios.get(`${apiBaseUrl}/${creatureType}`)
          const newCreatures = rCreatures.data.map(c => (
            {
              _id: c._id,
              type: creatureType,
              name: c.name,
              age: c.age
            }
          ))
          dispatch({
            type: actions.addCreatures, payload: newCreatures
          })
        })
      } catch (e) {
        // if API call was unsuccessful, log the error to the console
        console.error('Error retrieving unicorns!', e)
      }
    }
    getCreatures()
  }, [])

  const handleAddCreature = async type => {
    console.log('add', type)
    try {
      // send new creature to the API
      const response = await axios.post(`${apiBaseUrl}/${type}`, {
        name: creatureInput,
        age: Math.ceil(Math.random() * 100)
      })

      // if API call was successful, add the new creature to state
      const newCreature = {
        _id: response.data._id,
        type,
        name: creatureInput,
        age: response.data.age
      }
      // const updatedCreatures = [...creatures]
      // updatedCreatures.push(newCreature)
      // setCreatures(updatedCreatures)
      dispatch({ type: 'ADD_CREATURE', payload: newCreature })
      setCreatureInput('')
    } catch (e) {
      // if API call was unsuccessful, log the error to the console
      console.error('Error creating creature!', e)
    }
  }

  const handleDeleteCreature = async creature => {
    try {
      // delete creature from the API
      await axios.delete(`${apiBaseUrl}/${creature.type}/${creature._id}`)

      // if API call was successful, delete the creature from state
      // setCreatures(updatedCreatures)
      dispatch({ type: actions.deleteCreature, payload: creature })
      setShowDeleteModal(false)
    } catch (e) {
      // if API call was unsuccessful, log the error to the console
      console.error('Error deleting creature!', e)
    }
  }

  const handleEditCreature = async creature => {
    try {
      // update creature in the API
      await axios.put(`${apiBaseUrl}/${creature.type}/${creature._id}`, {
        ...creature
      })
      // if API call was successful, update the creature in state
      // setCreatures(updatedCreatures)
      dispatch({ type: actions.editCreature, payload: creature })
      setShowEditModal(false)
    } catch (e) {
      // if API call was unsuccessful, log the error to the console
      console.error('Error updating creature!', e)
    }
  }

  const handleChangeName = e => {
    setCreatureEdit({
      ...creatureEdit,
      name: e.target.value
    })
    console.log("Editing creature: ", creatureEdit)
  }

  const handleChangeAge = e => {
    setCreatureEdit({
      ...creatureEdit,
      age: e.target.value
    })
    console.log(e.target.value)
  }

  const handleCloseDeleteModal = () => {
    setCreatureDelete(null)
    setShowDeleteModal(false)
  }

  const handleCloseEditModal = () => {
    setCreatureEdit(null)
    setShowEditModal(false)
  }

  const handleShowDeleteModal = creature => {
    setCreatureDelete(creature)
    setShowDeleteModal(true)
  }

  const handleShowEditModal = creature => {
    setCreatureEdit(creature)
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
                  <strong>Add a Creature!</strong>
                </Card.Title>
                <Form.Control type="text" placeholder="Enter a name..." value={creatureInput} onChange={(e) => setCreatureInput(e.target.value)}></Form.Control>
                <Col className="d-flex justify-content-end mt-3">
                  <ButtonGroup>
                    <Button variant="warning" onClick={() => handleAddCreature('bison')}>+&#x1f9ac;</Button>
                    <Button variant="info" onClick={() => handleAddCreature('unicorns')}>+&#x1f984;</Button>
                  </ButtonGroup>
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
                  <strong>Creatures</strong>
                </Card.Title>
                <Form.Control type="text" placeholder="Filter" className="mb-3"></Form.Control>
                <ListGroup>
                  {
                    !state.creatures.length
                      ? (
                        <span>No creatures to show.</span>
                      )
                      : (
                        state.creatures.map((creature, i) => (
                          <ListGroup.Item key={i} variant="warning">
                            <Container fluid>
                              <Row className="d-flex align-items-center">
                                {
                                  creature.type === 'bison'
                                    ? <Col xs={1}>&#x1f9ac;</Col>
                                    : <Col xs={1}>&#x1f984;</Col>
                                }
                                <Col><strong>{creature.name}</strong> ({creature.age})</Col>
                                <Col xs={4} className="d-flex justify-content-between">
                                  <Button onClick={() => handleShowEditModal(creature)}>&#x270f;</Button>
                                  <Button variant="danger" onClick={() => handleShowDeleteModal(creature)}>X</Button>
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
          {
            creatureDelete && <h3>Delete {creatureDelete.type === 'bison' ? 'Bison' : 'Unicorn'}</h3>
          }
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete:
          {
            creatureDelete && (
              creatureDelete.type === 'bison'
                ? <ListGroup.Item variant="warning">&#x1f9ac; {creatureDelete.name}</ListGroup.Item>
                : <ListGroup.Item variant="warning">&#x1f984; {creatureDelete.name}</ListGroup.Item>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Close</Button>
          {
            creatureDelete && (
              creatureDelete.type === 'bison'
                ? <Button variant="danger" onClick={() => handleDeleteCreature(creatureDelete)}>-&#x1f9ac;</Button>
                : <Button variant="danger" onClick={() => handleDeleteCreature(creatureDelete)}>-&#x1f984;</Button>
            )
          }
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          {
            creatureEdit && <h3>Edit {creatureEdit.type === 'bison' ? 'Bison' : 'Unicorn'}</h3>
          }
        </Modal.Header>
        <Modal.Body>
          {
            creatureEdit && (
              <>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={creatureEdit.name} onChange={handleChangeName}></Form.Control>
                <Form.Label>Age</Form.Label>
                <Form.Control type="text" value={creatureEdit.age} onChange={handleChangeAge}></Form.Control>
              </>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
          {
            creatureEdit && creatureEdit.type === 'bison'
              ? <Button variant="primary" onClick={() => handleEditCreature(creatureEdit)}>&#x270f;&#x1f9ac;</Button>
              : <Button variant="primary" onClick={() => handleEditCreature(creatureEdit)}>&#x270f;&#x1f984;</Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}