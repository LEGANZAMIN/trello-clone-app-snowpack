<script>
    import { autoFocusout } from "~/actions/autoFocusout";
    import { tick, createEventDispatcher, onDestroy } from "svelte";
    import { lists } from "~/store/list";

    export let list

    let isEditMode = false
    let title = list.title
    let textareaEl
    const dispatch = createEventDispatcher()

    function  saveTitle(){
        if(title.trim()){
            lists.edit({
                listId: list.id,
                title
            })

        }
        offEditMode()
    }
    function removeList(){
        lists.remove({
            listId: list.id
        })
        offEditMode()
    }
    async function onEditMode(){
        isEditMode = true
        title = list.title
        dispatch('editMode', true)
        await tick()
        textareaEl && textareaEl.focus()
    }
    function offEditMode(){
        isEditMode = false
        dispatch('editMode', false)
    }

    // 삭제 후 offEditMode를 호출해도 되지만
    // 해당 컴포넌트가 삭제될 때 호출해도 된다.
    onDestroy( () => {
        offEditMode()
    })


</script>

{#if isEditMode}
    <div
            use:autoFocusout={offEditMode}
            class="edit-mode"
    >
        <textarea
                bind:value={title}
                bind:this={textareaEl}
                on:keydown={ event => {
                    event.key === 'Enter' && saveTitle()
                    event.key === 'Escape' && offEditMode()
                    event.key === 'Esc' && offEditMode()
                }}
        ></textarea>
        <div class="actions">
            <div
                    class="btn success"
                    on:click={saveTitle}
            >Save</div>
            <div
                    class="btn"
                    on:click={offEditMode}
            >Cancel</div>
            <div
                    class="btn danger"
                    on:click={removeList}
            >Delete List</div>
        </div>
    </div>


{:else}
    <h2 class="title">
        {list.title}
        <div
                class="btn small"
                on:click={onEditMode}
        >Edit</div>
    </h2>
{/if}

<style lang="scss">
    h2.title {
      position: relative;
      font-weight: 700;
      padding: 4px 8px;
      cursor: pointer;
      .btn{
        position: absolute;
        top:0;
        right:0;
        display: none;

      }
    }
    /* ListTitle 컴포넌트에는 list__inner가 없다.
       global 수식어로 묶어준다.
     */
    :global(.list__inner:hover .list__heading h2 .btn){
        display: block;

      }

</style>
