export function autoFocusout( elem, focusoutListener ){

    const focusinListener = event => {
        event.stopPropagation()
    }

    setTimeout(() => {
        elem.addEventListener('click', focusinListener)

        window.addEventListener('click', focusoutListener)
    })

    return {
        destroy(){
            elem.removeEventListener('click', focusinListener)
            window.removeEventListener('click', focusoutListener)
        }
    }


}