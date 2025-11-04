import { FilterQuery, Query } from "mongoose";
import { excludeField } from "./Constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // 🔍 Search
  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm?.trim();
    if (searchTerm) {
      const searchQuery = {
        $or: searchableField.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      this.modelQuery = this.modelQuery.find(searchQuery as FilterQuery<T>);
    }
    return this;
  }

  // 🧩 Filter
  filter(): this {
    const filter = { ...this.query };
    for (const field of excludeField) delete filter[field];
    this.modelQuery = this.modelQuery.find(filter as FilterQuery<T>);
    return this;
  }

  // 🔃 Sort
  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // 📋 Fields selection
  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    if (fields) this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // 📄 Pagination
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // 🚀 Execute final query
  async build() {
    return await this.modelQuery.exec();
  }

  // 📊 Get meta info
  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
