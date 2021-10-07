const actions = {
  ADD_CREATURE: 'ADD_CREATURE',
  ADD_CREATURES: 'ADD_CREATURES',
  EDIT_CREATURE: 'EDIT_CREATURE',
  DELETE_CREATURE: 'DELETE_CREATURE'
}

function reducer(state, action) {
  let newState = { ...state }
  switch (action.type) {
    case actions.ADD_CREATURES:
      newState = {
        creatures: [
          ...state.creatures,
          ...action.payload
        ]
      }
      return newState
    case actions.ADD_CREATURE:
      const newCreatures = [...state.creatures]
      newCreatures.push(action.payload)
      newState = {
        creatures: newCreatures
      }
      return newState
    case actions.EDIT_CREATURE:
      const updatedCreatures = state.creatures.map(c => {
        if (c._id === action.payload._id) {
          return action.payload
        }
        return c
      })
      newState.creatures = updatedCreatures
      return newState
    case actions.DELETE_CREATURE:
      const creaturesAfterDelete = state.creatures.filter(c => c._id !== action.payload._id)
      newState.creatures = creaturesAfterDelete
      return newState
    default:
      return newState
  }
}

module.exports = {
  actions,
  reducer
}