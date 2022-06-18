import {Reducer} from "redux";


type LoadingState2 = typeof initialState

const initialState = {
    login: false,
    logout: false,
    signup: false,
}



export const loadingReducer2: Reducer<LoadingState2> = (state = initialState, action) => {
    switch (action.type) {
        case 'setLoading':
            const payload = action.payload as SetLoadingActionPayload
            return {
                ...state,
                [payload.part]: payload.isLoading
            }
        default: return state
    }
}


type SetLoadingActionPayload = { part: keyof LoadingState2, isLoading: boolean }
const setLoading = (part: keyof LoadingState2, isLoading = true) => ({
    type: 'setLoading', payload: { part, isLoading } as SetLoadingActionPayload
})


export const loadingActions2 = {
    setLoading
}

