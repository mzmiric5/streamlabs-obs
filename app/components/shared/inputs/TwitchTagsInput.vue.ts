import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Inject } from 'util/injector';
import { Multiselect } from 'vue-multiselect';
import { $t, I18nService } from 'services/i18n';
import { prepareOptions, TwitchTag, TwitchTagWithLabel } from 'services/platforms/twitch/tags';

@Component({
  components: {
    Multiselect,
  },
})
export default class TwitchTagsInput extends Vue {
  @Inject() i18nService: I18nService;

  @Prop() value: TwitchTagWithLabel;

  @Prop() tags: TwitchTag[];

  tagsLabel = $t('Tags');

  selectPlaceholder = $t('Select stream tags');

  tagPlaceholder = $t('Tag not found');

  get options() {
    return prepareOptions(
      this.i18nService.state.locale || this.i18nService.getFallbackLocale(),
      this.tags,
    );
  }

  onInput() {
    this.$emit('input', this.value);
  }
}
