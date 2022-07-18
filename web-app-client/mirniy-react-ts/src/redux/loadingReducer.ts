import {Reducer} from "redux";


type LoadingState = typeof initialState

const initialState = {
    login: false,
    logout: false,
    signup: false,
    articles: false,
}



export const loadingReducer: Reducer<LoadingState> = (state = initialState, action) => {
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


type SetLoadingActionPayload = { part: keyof LoadingState, isLoading: boolean }
const setLoading = (part: keyof LoadingState, isLoading = true) => ({
    type: 'setLoading', payload: { part, isLoading } as SetLoadingActionPayload
})


export const loadingActions = {
    setLoading
}

