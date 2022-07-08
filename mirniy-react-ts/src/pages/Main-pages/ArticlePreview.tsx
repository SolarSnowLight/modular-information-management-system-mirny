
import css from './ArticlePreview.module.scss'



import {useAppSelector} from "../../redux/hooks";
import React, {useEffect, useState} from "react";

const ArticlePreview = () => {

    const article = useAppSelector(s=>s.app.article)
    const [articleArray, setArticleArray] = useState([] as (string|File)[])

    console.log(article)

    useEffect(()=>{
        if (article){
            const arr: typeof articleArray = []

            let pos: number = 0
            article.images.forEach(it=>{
                if (it.index) arr.push(article.text.substring(pos, pos=it.index))
                arr.push(it.file)
            })
            if (pos<article.text.length) arr.push(article.text.substring(pos))

            setArticleArray(arr)
        }
    }, [article])

    return <div>
        <div>Article Preview</div>

        { articleArray.map(it=>{
            if (typeof it === 'string') return <div>{it}</div>
            if (it instanceof File) return <Image file={it}/>
        }) }

    </div>
}
export default React.memo(ArticlePreview)



const Image = React.memo(({ file }: { file: File }) => {

    const [fileUrl, setFileUrl] = useState(undefined as undefined|string)

    useEffect(()=>{
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (ev) => {
            setFileUrl(ev.target?.result as string)
        }
        //reader.readAsArrayBuffer(file)
        reader.readAsDataURL(file)
    }, [file])



    return <div className={css.imgPreview}
                style={{ backgroundImage: `url(${fileUrl})`}}
    />

})