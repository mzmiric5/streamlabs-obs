import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { metadata } from 'components/shared/inputs';
import VFormGroup from 'components/shared/inputs/VFormGroup.vue';
import ValidatedForm from 'components/shared/inputs/ValidatedForm.vue';
import { PlatformAppsService } from 'services/platform-apps';
import { Inject } from 'util/injector';

@Component({
  components: { VFormGroup, ValidatedForm },
})
export default class AppPlatformDeveloperSettings extends Vue {
  @Inject() platformAppsService: PlatformAppsService;

  appPathMetadata = metadata.file({
    title: 'Unpacked App Path',
    description:
      'This is the path to your unpacked app.  ' +
      'It should be a folder containing a valid manifest.json',
    directory: true,
  });

  appPathValue = this.currentlyLoadedUnpackedApp ? this.currentlyLoadedUnpackedApp.appPath : '';

  appCustomUrlMetadata = metadata.text({
    title: 'App Custom URL',
    description:
      'This is the custom URL to your unpacked app.',
  });

  appCustomUrlValue = this.currentlyLoadedUnpackedApp ? this.currentlyLoadedUnpackedApp.appCustomUrl : '';

  appTokenMetadata = metadata.text({
    title: 'App Token',
    description:
      'This token allows you app to authenticate with the ' +
      'streamlabs API.  Visit dev-platform.streamlabs.com to create a developer account ' +
      'and get a test app token.',
  });

  appTokenValue = this.currentlyLoadedUnpackedApp ? this.currentlyLoadedUnpackedApp.appToken : '';

  get currentlyLoadedUnpackedApp() {
    if (this.platformAppsService.enabledApps.length === 0) return null;

    return this.platformAppsService.enabledApps.find(app => app.unpacked);
  }

  loading = false;
  error = '';

  async loadApp() {
    if (!this.appPathValue) return;
    if (!this.appTokenValue) return;

    if (this.currentlyLoadedUnpackedApp) {
      this.platformAppsService.unloadApps();
    }

    this.loading = true;

    try {
      this.error = await this.platformAppsService.installUnpackedApp(
        this.appPathValue,
        this.appCustomUrlValue,
        this.appTokenValue,
      );
    } catch (e) {
      this.error =
        'There was an error loading this app, please try again ' +
        'or contact the Streamlabs development team for assistance.';
    }

    this.loading = false;
  }

  async reloadApp() {
    this.loading = true;
    this.error = '';

    try {
      this.error = await this.platformAppsService.reloadApp(this.currentlyLoadedUnpackedApp.id);
    } catch (e) {
      this.error =
        'There was an error loading this app, please try again ' +
        'or contact the Streamlabs development team for assistance.';
    }

    this.loading = false;
  }

  unloadApp() {
    this.platformAppsService.unloadApp(this.currentlyLoadedUnpackedApp);
  }
}
