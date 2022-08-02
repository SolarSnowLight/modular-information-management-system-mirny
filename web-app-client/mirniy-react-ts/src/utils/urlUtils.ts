

const findLastPathSegment = (path: string) => {
    const segments = path.split('/')
    for (let i = segments.length-1; i >= 0 ; i--) {
        const curr = segments[i]
        if (curr) return curr
    }
    return ''
}

export const urlUtils = {
    findLastPathSegment,
}