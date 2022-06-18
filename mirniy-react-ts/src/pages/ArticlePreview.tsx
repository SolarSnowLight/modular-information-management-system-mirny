
//import css from './ArticleNew.module.scss'



import {useAppSelector} from "../redux/hooks";

const ArticlePreview = () => {

    const article = useAppSelector(s=>s.app.article)

    return <div>
        Article Preview

    </div>
}
export default ArticlePreview

