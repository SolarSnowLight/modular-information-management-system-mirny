


export let lastFocused = null as Element|null
let currFocused = null as Element|null

document.addEventListener('focusin', (ev:FocusEvent)=>{
    lastFocused = currFocused
    currFocused = document.activeElement
})

