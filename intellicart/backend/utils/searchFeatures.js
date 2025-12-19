class SearchFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr || {};
  }

  // 🔍 keyword search (name only)
  search() {
    if (this.queryStr.keyword) {
      this.query = this.query.find({
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      });
    }
    return this;
  }

  // 🎯 filters (category, price, ratings)
  filter() {
    const queryCopy = { ...this.queryStr };

    // remove non-filter fields
    ["keyword", "page", "limit"].forEach((el) => delete queryCopy[el]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    const parsedQuery = JSON.parse(queryStr);

    // ✅ CATEGORY FIX (THIS IS THE IMPORTANT PART)
    if (this.queryStr.category && this.queryStr.category.trim() !== "") {
      parsedQuery.category = {
        $regex: `^${this.queryStr.category.trim()}$`,
        $options: "i",
      };
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  // 📄 pagination
  pagination(resultPerPage = 12) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = SearchFeatures;
