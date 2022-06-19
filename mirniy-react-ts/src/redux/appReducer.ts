import {Reducer} from "redux";



type Article = undefined | {
    text: string,
    images: {
        index: number,
        file: File
    }[]
}


type AppState = typeof initialState
const initialState = {
    isDragging: false,
    isDraggingFiles: false,

    article: undefined as Article,
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

        case 'setArticle': return {
            ...state,
            article: action.payload
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



type SetArticleActionPayload = Article
const setArticle = (article: Article) => ({
    type: 'setArticle', payload: article
})


export const appActions = {
    setDragging,
    setDraggingFiles,

    setArticle,
}