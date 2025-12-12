// backend/utils/searchFeatures.js
class SearchFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr || {};
  }

  // search by name keyword (case insensitive)
 search() {
    const keyword = this.queryStr.keyword
        ? {
              $or: [
                  { name: { $regex: this.queryStr.keyword, $options: "i" } },
                  { category: { $regex: this.queryStr.keyword, $options: "i" } }
              ]
          }
        : {};

    this.query = this.query.find(keyword);
    return this;
}


  // filter handles keys like:
  // category=Mobiles
  // price[gte]=1000
  // ratings[gte]=4
  filter() {
    // shallow copy of query params
    const queryCopy = { ...this.queryStr };

    // remove control params
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((f) => delete queryCopy[f]);

    // Build new filter object, converting bracket params to mongo operators
    const filterObj = {};

    for (const rawKey of Object.keys(queryCopy)) {
      const value = queryCopy[rawKey];

      // If key like price[gte]
      const bracketMatch = rawKey.match(/^([^\[]+)\[([^\]]+)\]$/);
      if (bracketMatch) {
        const root = bracketMatch[1]; // e.g. "price"
        const op = bracketMatch[2]; // e.g. "gte"

        if (!filterObj[root]) filterObj[root] = {};

        // convert to numeric if possible
        const parsed = this._tryParseNumber(value);
        filterObj[root][`$${op}`] = parsed;
      } else {
        // normal key, e.g. category, brand, stock, etc.
        // For category use regex match (case-insensitive)
        if (rawKey === "category") {
          if (String(value).trim() !== "") {
            filterObj.category = {
              $regex: String(value).trim(),
              $options: "i",
            };
          }
        } else {
          // numeric cast when appropriate
          filterObj[rawKey] = this._tryParseNumber(value);
        }
      }
    }

    // apply final filter object to query
    this.query = this.query.find(filterObj);
    return this;
  }

  // pagination
  pagination(resultPerPage = 12) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }

  // helper to convert numeric strings to numbers when possible
  _tryParseNumber(value) {
    if (value === null || value === undefined) return value;
    const s = String(value).trim();
    if (s === "") return s;
    if (!isNaN(s) && s !== "") {
      // if integer-like or float-like convert
      return s.includes(".") ? parseFloat(s) : parseInt(s, 10);
    }
    return value;
  }
}

module.exports = SearchFeatures;
