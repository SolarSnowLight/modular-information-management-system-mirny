import {useParams} from "react-router-dom";


const Article = () => {

    const { articleId } = useParams()

    return <div>
        id: {articleId}
    </div>
}
export default Article

