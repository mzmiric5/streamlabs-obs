<template>
  <div class="tags-container">
    <label class="input-label">{{ tagsLabel }}</label>
    <multiselect
      v-model="value"
      :options="options"
      :placeholder="selectPlaceholder"
      :tag-placeholder="tagPlaceholder"
      label="name"
      track-by="tag_id"
      :multiple="true"
      :taggable="true"
      @input="onInput"
    ></multiselect>
  </div>
</template>

<script lang="ts" src="./TwitchTagsInput.vue.ts">
</script>

<style lang="less">
@import '../../../styles/index';

.tags-container {
  flex-direction: row;
  flex: 1;
  display: flex;

  .multiselect {
    width: 70%;
    margin-bottom: 8px;
  }

  .multiselect__input {
    background: @day-dropdown-bg;
    border-color: @day-dropdown-border;
  }

  .multiselect__tags {
    min-height: 40px;
    display: block;
  }

  .multiselect__tag {
    position: relative;
    display: inline-block;
    padding: 4px 26px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    color: #fff;
    line-height: 1;
    background: @twitch;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
  }

  .multiselect__tags-wrap {
    display: inline;
  }

  .multiselect__content-wrapper {
    display: block;
    //width: 100%;
    //max-height: 178px;
    border-top: none;
    z-index: 50;
  }

  .multiselect--active .multiselect__content-wrapper {
    bottom: 100%;
  }

  .multiselect__tag ~ .multiselect__input,
  .multiselect__tag ~ .multiselect__single {
    width: auto;
  }

  .multiselect__tag-icon {
    cursor: pointer;
    margin-left: 7px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    font-weight: 700;
    font-style: initial;
    width: 22px;
    text-align: center;
    line-height: 22px;
    transition: all 0.2s ease;
    border-radius: 5px;
  }

  .multiselect__tag-icon:after {
    content: "×";
    color: white;
    font-size: 14px;
  }

  .multiselect__tag-icon:focus,
  .multiselect__tag-icon:hover {
    background: #369a6e;
  }
}

.input-label {
  width: 30%;
  .padding-right(2);
}
</style>
