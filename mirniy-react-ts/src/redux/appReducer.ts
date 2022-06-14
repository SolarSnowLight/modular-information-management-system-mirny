import {Reducer} from "redux";


type AppState = typeof initialState
const initialState = {
    isDragging: false,
    isDraggingFiles: false,
}



export const appReducer: Reducer<AppState> = (state = initialState, action) => {
    switch (action.type) {
        case 'setDragging': return {
            ...state,
            isDragging: action.payload as SetDraggingActionPayload
        }
        case 'setDraggingFiles': return {
            ...state,
            isDraggingFiles: action.payload as SetDraggingFilesActionPayload
        }
        default: return state
    }
}





type SetDraggingActionPayload = boolean
const setDragging = (isDragging = true) => ({
    type: 'setDragging', payload: isDragging as SetDraggingActionPayload
})


type SetDraggingFilesActionPayload = boolean
const setDraggingFiles = (isDraggingFiles = true) => ({
    type: 'setDraggingFiles', payload: isDraggingFiles as SetDraggingFilesActionPayload
})



export const appActions = {
    setDragging,
    setDraggingFiles,
}