<script>
    import { tick } from 'svelte'
    import { lists } from '~/store/list'
    import { autoFocusout} from "../actions/autoFocusout";

    let isEditMode = false
    let title = ''
    let textareaEl

    async function onEditMode(){
        isEditMode = true
        // 화면이 갱신될 때까지 기다려야 한다.
        await tick()
        textareaEl && textareaEl.focus()
    }
    function offEditMode(){
        isEditMode = false
        title = ''
    }
    function addList(){
        if(!title.trim()) return
        lists.add({
            title
        })
        offEditMode()
    }

</script>



<div class="create-list">
    {#if isEditMode}
        <div
                use:autoFocusout={offEditMode}
                class="edit-mode">
            <textarea
                    bind:value={title}
                    bind:this={textareaEl}
                    placeholder="Enter a title for this list..."
                    on:keydown={ event => {
                        event.key === 'Enter' && addList()
                        event.key === 'Escape' && offEditMode()
                        event.key === 'Esc' && offEditMode()
                    }}
            ></textarea>
            <div class="actions">
                <div
                        class="btn success"
                        on:click={addList}
                >Add List</div>
                <div
                        class="btn"
                        on:click={offEditMode}
                >Cancel</div>
            </div>

        </div>

    {:else}
        <div
                class="add-another-list"
                on:click={onEditMode}
        >
            + Add another list
        </div>
    {/if}

</div>

<style lang="scss">
     //전역스타일 구조로 변경
     //@import "../scss/main.scss";

    .create-list{
      width: 290px;
      display: inline-block;
      white-space: normal;
      font-size: 1rem;
      box-sizing: border-box;
      padding: 10px 8px;
      vertical-align: top;
      /* SCSS에서 제공해주는 rgba함수 */
      background: rgba(#ebecf0, 0.6);
      border-radius: 4px;
      margin: 0 4px;
      line-height: 20px;
      cursor: pointer;
      transition: 0.2s;
      /* & 중첩되어 있는 해당영역의 선택자를 의미한다. */
      &:hover{
        background: #ebecf0;
      }

    }

</style>