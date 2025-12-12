class SearchFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // 🔍 SEARCH BY KEYWORD
    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword.trim(),
                      $options: "i",
                  },
              }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    // 🎯 FILTER (category + price + ratings)
    filter() {
        const queryCopy = { ...this.queryStr };

        // remove unwanted fields
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Convert gt, gte etc.
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (key) => `$${key}`
        );
        queryString = JSON.parse(queryString);

        // ⭐ CATEGORY FILTER (ALWAYS WORKS)
        if (this.queryStr.category) {
            queryString.category = {
                $regex: `^${this.queryStr.category}$`,
                $options: "i",
            };
        }

        // ⭐ PRICE FILTER FIX
        if (this.queryStr["price[gte]"] || this.queryStr["price[lte]"]) {
            queryString.price = {};

            if (this.queryStr["price[gte]"]) {
                queryString.price.$gte = Number(this.queryStr["price[gte]"]);
            }

            if (this.queryStr["price[lte]"]) {
                queryString.price.$lte = Number(this.queryStr["price[lte]"]);
            }
        }

        // ⭐ RATINGS FILTER FIX
        if (this.queryStr["ratings[gte]"]) {
            queryString.ratings = {
                $gte: Number(this.queryStr["ratings[gte]"]),
            };
        }

        this.query = this.query.find(queryString);
        return this;
    }

    // 📄 PAGINATION
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = SearchFeatures;
