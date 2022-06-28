import {ArticleApi} from "../api/articleApiMock";
import {Action, Reducer} from "redux";
import {AppThunk} from "./store";
import {errorsActions} from "./errorsReducer";
import {loadingActions} from "./loadingReducer";
import {userService} from "../service/userService";
import {articleService} from "../service/articleService";
import {errors} from "./errors";


type ArticleState = typeof initialState
const initialState = {
    articles: undefined as ArticleApi[]|undefined
}



export const articleReducer: Reducer<ArticleState> = (
    state = initialState, action
) => {
    switch (action.type){
        case 'setArticles': return {
            ...state,
            articles: action.payload,
        }
        default: return state
    }
}


// Actions
const setArticles = (articles?: ArticleApi[]) => ({
    type: 'setArticles', payload: articles
})




// Thunks
const loadArticles = (): AppThunk =>
    async (dispatch, getState) => {

        const state = getState()
        if(state.loading.articles) return

        dispatch(errorsActions.addErrors({ articles: undefined }))

        dispatch(loadingActions.setLoading('articles'))


        let { data, error } = await articleService.getArticles()
            .finally(()=>dispatch(loadingActions.setLoading('articles',false)))


        if (error){
            switch (error.code){
                case "connection error":
                    dispatch(errorsActions.addErrors({
                        articles: { common:[
                                { code: 'connection error', message: 'Ошибка соединения с сервером' }
                            ] }
                    }))
                    return
                default:
                    dispatch(errorsActions.addErrors({
                        articles: { common: [ errors.of('error','Ошибка') ] }
                    }))
                    return
            }
        }

        data = data!

        dispatch(setArticles(data.articles))
    }



export const articleActions = {
    loadArticles,
}