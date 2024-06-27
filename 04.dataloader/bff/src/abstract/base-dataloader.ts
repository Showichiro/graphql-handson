import * as DataLoader from 'dataloader';

/**
 * BaseDataloaderは、サブクラスの実装にバッチ読み込みを委任しながら、
 * キャッシュのクリア、データの読み込み、キャッシュの初期化を行うメソッドを提供する抽象クラスです。
 *
 * @template K - キーの型。
 * @template V - 値の型。
 */
export abstract class BaseDataloader<K, V> extends Object {
  /**
   * バッチ処理とキャッシングを行うDataLoaderのインスタンス。
   * @protected
   */
  protected dataloader: DataLoader<K, V> = new DataLoader<K, V>(
    this.batchLoad.bind(this),
  );

  /**
   * 指定されたキーのキャッシュをクリアします。
   *
   * @param {K} key - キャッシュをクリアするキー。
   * @returns {DataLoader<K, V>} DataLoaderのインスタンス。
   */
  public clear(key: K): DataLoader<K, V> {
    return this.dataloader.clear(key);
  }

  /**
   * 全てのキャッシュをクリアします。
   *
   * @returns {DataLoader<K, V>} DataLoaderのインスタンス。
   */
  public clearAll(): DataLoader<K, V> {
    return this.dataloader.clearAll();
  }

  /**
   * 指定されたキーのデータを読み込みます。
   *
   * @param {K} key - 読み込むデータのキー。
   * @returns {Promise<V>} 読み込まれた値を解決するPromise。
   */
  public async load(key: K): Promise<V> {
    return this.dataloader.load(key);
  }

  /**
   * 複数のキーのデータを読み込みます。
   *
   * @param {K[]} keys - 読み込むデータのキー。
   * @returns {Promise<(V | Error)[]>} 読み込まれた値またはエラーの配列を解決するPromise。
   */
  public async loadMany(keys: K[]): Promise<(V | Error)[]> {
    return this.dataloader.loadMany(keys);
  }

  /**
   * 指定されたキーと値でキャッシュを初期化します。
   *
   * @param {K} key - キャッシュを初期化するキー。
   * @param {V} value - キャッシュを初期化する値。
   * @returns {DataLoader<K, V>} DataLoaderのインスタンス。
   */
  public prime(key: K, value: V): DataLoader<K, V> {
    return this.dataloader.prime(key, value);
  }

  /**
   * サブクラスが複数のキーのデータをどのようにバッチ読み込みするかを定義するために実装しなければならない抽象メソッド。
   *
   * @abstract
   * @param {K[]} keys - 読み込むデータのキー。
   * @returns {Promise<(V | Error)[]>} 読み込まれた値またはエラーの配列を解決するPromise。
   */
  protected abstract batchLoad(keys: K[]): Promise<(V | Error)[]>;
}
