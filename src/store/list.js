import { writable } from "svelte/store";
import { v4 as uuid } from 'uuid'
import _find from 'lodash/find'
import _remove from 'lodash/remove'
import _cloneDeep from 'lodash/cloneDeep'


const generatedId = () => uuid()
const repoLists = JSON.parse(window.localStorage.getItem('lists')) || []

const _lists = writable(repoLists)
_lists.subscribe( $lists  => {
    window.localStorage.setItem('lists', JSON.stringify($lists))
})

export const lists = {
    subscribe: _lists.subscribe,
    add( payload ) {
        const { title } = payload
        _lists.update( $lists => {
            $lists.push({
                id: generatedId(),
                title,
                cards:[]
            })
            return $lists
        })
    },
    edit( payload ) {
        const { listId, title } = payload
        _lists.update( $lists => {

            // 성민 작성 로직
            // $lists.forEach( list => {
            //     if( list.id === listId){
            //         list.title = title
            //     }
            // })

            // const foundItem = $lists.find( item => item.id === listId )
            // foundItem.title = title

            // lodash를 사용하여 소스를 간결하게 작성
            const foundItem = _find($lists, { id: listId })
            foundItem.title = title


            return $lists
        })

    },
    remove( payload ){
        const { listId } = payload
        _lists.update( $lists => {

            _remove($lists, { id: listId })
            return $lists

        })

    },
    reorder( payload ) {
        const { oldIndex, newIndex } = payload
        _lists.update( $lists => {

            const clonedItem = _cloneDeep($lists[oldIndex])
            $lists.splice(oldIndex, 1)
            $lists.splice(newIndex, 0, clonedItem)

            return $lists
        })
    }
}

export const cards = {
    reorder( payload ) {
        const {
            fromListId, toListId, oldIndex, newIndex
        } = payload
        _lists.update( $lists => {

            const fromListItem = _find($lists, { id: fromListId})
            const toListItem = fromListId === toListId ? fromListItem : _find($lists, { id: toListId})

            const fromCardItem = _cloneDeep(fromListItem.cards[oldIndex])
            fromListItem.cards.splice(oldIndex, 1)

            // const toListItem = _find($lists, { id: toListId})
            toListItem.cards.splice(newIndex, 0, fromCardItem)

            return $lists
        })

    },
    add( payload ) {
        const { listId, title } = payload
        _lists.update( $lists => {

            const foundItem = _find($lists, { id: listId } )
            foundItem.cards.push({
                id: generatedId(),
                title
            })

            return $lists
        })
    },
    edit( payload ) {
        let { listId, cardId, title } = payload;
        _lists.update( $lists => {

            const listItem = _find($lists, { id: listId })
            const cardItem = _find(listItem.cards, { id: cardId })
            cardItem.title = title

            return $lists
        })

    },
    remove( payload ) {
        let { listId, cardId } = payload
        _lists.update( $lists => {

            const listItem = _find( $lists, { id: listId })
            _remove(listItem.cards, { id: cardId })

            return $lists
        })

    }

}