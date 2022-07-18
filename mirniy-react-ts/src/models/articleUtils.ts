import {ImageSrc} from "./ImageSrc";
import {ArticleApiFull} from "../api/test/articleApiTest";


function wrapWithP(articleText: string){
    const parser = new DOMParser()
    let wrappedText = `<root>${articleText}</root>` // need to wrap in some root tag
    let xmlDoc = parser.parseFromString(wrappedText, 'text/xml')

    const root = xmlDoc.childNodes[0]
    let currentP = undefined as undefined|ChildNode
    for (let i = 0; i<root.childNodes.length; ){
        const ch = root.childNodes[i]
        if (['#text','i','b','mark'].includes(ch.nodeName)){
            if (!currentP){
                currentP = xmlDoc.createElement('p')
                root.appendChild(currentP)
                root.insertBefore(currentP, ch)
                i++
            }
            currentP.appendChild(ch)
        } else {
            currentP = undefined
            i++
        }
    }

    const xmlSerializer = new XMLSerializer()
    const taggedText = xmlSerializer.serializeToString(root).slice(6,-7)
    return taggedText
}


function inlineImages(article: ArticleApiFull){
    const parser = new DOMParser()
    let wrappedText = `<root>${article.text}</root>` // need to wrap in some root tag
    let xmlDoc = parser.parseFromString(wrappedText, 'text/xml')

    const root = xmlDoc.childNodes[0]
    for (let i = 0; i<root.childNodes.length; i++){
        const ch = root.childNodes[i]
        if ('article-image'===ch.nodeName){
            const el = ch as Element
            const localId = el.attributes["localId"].value
            const srcUrl = article.imagesSrc.find(it=>it.id==localId)?.getUrl()
            const img = parser.parseFromString(
                `<img src="${srcUrl}" style="display: block; width: 100%; height: 300px; object-fit: cover;"/>`,
                'text/xml'
            ).childNodes[0]
            root.replaceChild(img, ch)
        }
    }

    const xmlSerializer = new XMLSerializer()
    const imagesInlinedText = xmlSerializer.serializeToString(root).slice(6,-7)
    return imagesInlinedText
}


function getUsedImageLocalIds(articleText: string){
    const ids = [] as number[]

    const parser = new DOMParser()
    let wrappedText = `<root>${articleText}</root>` // need to wrap in some root tag
    let xmlDoc = parser.parseFromString(wrappedText, 'text/xml')

    const root = xmlDoc.childNodes[0]
    for (let i = 0; i<root.childNodes.length; i++){
        const ch = root.childNodes[i]
        if ('article-image'===ch.nodeName){
            const el = ch as Element
            let localId = el.attributes["localId"].value
            localId = Number(localId)
            if (!Number.isFinite(localId)) throw new Error('localId is not a finite number')
            if (localId) ids.push(localId)
        }
    }

    return ids
}


export const articleUtils = {
    wrapWithP,
    inlineImages,
    getUsedImageLocalIds,
}