import Vue from 'vue';
import electron from 'electron';
import path from 'path';
import util from 'util';
import mkdirpModule from 'mkdirp';
import { PersistentStatefulService } from '../persistent-stateful-service';
import { ILoadedApp, PlatformAppsService } from './index';
import { mutation } from '../stateful-service';
import { Inject } from 'util/injector';
import { downloadFile, getChecksum } from 'util/requests';

type Checksum = string;

/**
 * Maintains a lookup table of asset filenames to checksum mappings, grouped by app ID.
 *
 * @see {AssetsMap}
 */
export interface AssetsServiceState {
  [appId: string]: AssetsMap;
}

export interface AssetsMap {
  // asset filename -> checksum
  [assetFilename: string]: Checksum;
}

const mkdirp = util.promisify(mkdirpModule);

/**
 * Manage and download assets provided by platform apps.
 *
 * This is initially designed to download stinger transition files
 */
export class PlatformAppAssetsService extends PersistentStatefulService<AssetsServiceState> {
  @Inject() private platformAppsService: PlatformAppsService;

  static defaultState: AssetsServiceState = {};

  /**
   * Get a specific asset checksum
   *
   * @param appId Application ID
   * @param assetName Asset filename
   */
  getAsset(appId: string, assetName: string): string | null {
    const appAssets = this.state[appId];

    return appAssets ? appAssets[assetName] : null;
  }

  /**
   * Returns whether we have downloaded an asset before
   *
   * @param appId Application ID
   * @param assetName Asset filename
   */
  hasAsset(appId: string, assetName: string) {
    return !!this.getAsset(appId, assetName);
  }

  /**
   * Add a platform app asset, download and calculate checksum
   *
   * @param appId Application ID
   * @param assetUrl Original asset URL
   * @param force Re-download the file even if it's present on cache
   * @returns Path to the downloaded asset on disk
   * @see {ADD_ASSET}
   */
  async addPlatformAppAsset(appId: string, assetUrl: string, force: boolean = false) {
    const originalUrl = this.platformAppsService.getAssetUrl(appId, assetUrl);

    const assetsDir = await this.getAssetsTargetDirectory(appId);
    const filePath = path.join(assetsDir, path.basename(originalUrl));

    // TODO: what if file is being used
    await downloadFile(originalUrl, filePath);

    const checksum = await getChecksum(filePath);

    this.ADD_ASSET(appId, assetUrl, checksum);

    return filePath;
  }

  /**
   * Get the directory where we should place downloaded files for this app
   *
   * @param appId Application ID
   */
  async getAssetsTargetDirectory(appId: string): Promise<string> {
    return ensureAssets(this.getApp(appId));
  }

  @mutation()
  private ADD_ASSET(appId: string, assetName: string, checksum: string): void {
    if (!this.state[appId]) {
      Vue.set(this.state, appId, {});
    }

    Vue.set(this.state[appId], assetName, checksum);
  }

  private getApp(appId: string): ILoadedApp {
    const app = this.platformAppsService.getApp(appId);

    if (!app) {
      throw new Error(`Invalid app: ${appId}`);
    }

    return app;
  }
}

/**
 * Ensure the App instance has an assets key and that the assets directory exist
 *
 * @param app App instance
 * @returns Assets directory path for this app
 */
const ensureAssets = async (app: ILoadedApp): Promise<string> => {
  const appAssetsDir = path.join(
    // prettier-ignore
    electron.remote.app.getPath('userData'),
    'Media',
    'Apps',
    app.id,
  );

  await mkdirp(appAssetsDir);

  return appAssetsDir;
};
