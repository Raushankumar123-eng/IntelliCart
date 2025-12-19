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
  const queryCopy = { ...this.queryStr };
  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((f) => delete queryCopy[f]);

  const filterObj = {};

  for (const rawKey of Object.keys(queryCopy)) {
    const value = queryCopy[rawKey];

    // ratings guard
    if (rawKey.startsWith("ratings")) {
      if (Number(value) <= 0) continue;
    }

    // price guard
    if (rawKey.startsWith("price")) {
      const num = Number(value);
      if (isNaN(num)) continue;
      if (num === 0 || num === 200000) continue;
    }

    const bracketMatch = rawKey.match(/^([^\[]+)\[([^\]]+)\]$/);

    if (bracketMatch) {
      const root = bracketMatch[1];
      const op = bracketMatch[2];

      if (!filterObj[root]) filterObj[root] = {};

      filterObj[root][`$${op}`] = this._tryParseNumber(value);
    } else {
      if (rawKey === "category") {
        if (String(value).trim()) {
          filterObj.category = {
            $regex: String(value).trim(),
            $options: "i",
          };
        }
      } else {
        filterObj[rawKey] = this._tryParseNumber(value);
      }
    }
  }

  // 🔥 remove empty objects
  for (const key in filterObj) {
    if (
      typeof filterObj[key] === "object" &&
      Object.keys(filterObj[key]).length === 0
    ) {
      delete filterObj[key];
    }
  }

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
