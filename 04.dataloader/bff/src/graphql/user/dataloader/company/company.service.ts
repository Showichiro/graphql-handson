import { Injectable, Scope } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { BaseDataloader } from 'src/abstract/base-dataloader';
import {
  CompanySearchControllerService,
  EntityModelCompany,
} from 'src/generated';

@Injectable({ scope: Scope.REQUEST })
export class CompanyService extends BaseDataloader<string, EntityModelCompany> {
  constructor(private readonly companyService: CompanySearchControllerService) {
    super();
  }

  /**
   * @param {string[]} companyCodes
   * @returns {Promise<(EntityModelCompany | Error)[]>}
   */
  protected async batchLoad(
    companyCodes: string[],
  ): Promise<(EntityModelCompany | Error)[]> {
    // companyCodeの配列を利用して、会社の一覧を取得する。
    const companies = await this.getCompanies(companyCodes);
    return this.mapCompanyByKey(companyCodes, companies);
  }

  /**
   * 会社コードの一覧から会社の一覧を取得するバックエンドAPIを呼び出すサービス処理.
   * @param {string[]} companyCodes
   * @returns {Promise<EntityModelCompany[]>}
   */
  private async getCompanies(
    companyCodes: string[],
  ): Promise<EntityModelCompany[]> {
    // dataloader都合でObservableからPromiseに変換する
    return lastValueFrom(
      // バックエンドAPIを呼び出す処理
      this.companyService.executeSearchCompanyGet(companyCodes).pipe(
        // 取得結果の加工
        map((res) => res.data),
        map((data) => data._embedded.companies),
      ),
    );
  }

  /**
   * 会社コードと取得した会社一覧をマッピングする.
   * @param {string[]} companyCodes
   * @param {EntityModelCompany[]} companies
   * @returns {(EntityModelCompany | Error)[]}
   */
  private mapCompanyByKey(
    companyCodes: string[],
    companies: EntityModelCompany[],
  ): (EntityModelCompany | Error)[] {
    return companyCodes.map(
      (key) =>
        companies.find((company) => company.companyId === key) ??
        new Error('not found'),
    );
  }
}
