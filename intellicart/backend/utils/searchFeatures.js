class SearchFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i",
                  },
              }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove fields not needed for filter
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Convert price and rating operators like gte, lte into MongoDB format
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (key) => `$${key}`
        );

        let parsedQuery = JSON.parse(queryStr);

        // Fix category filter - case insensitive match
        if (this.queryStr.category) {
            parsedQuery.category = {
                $regex: this.queryStr.category,
                $options: "i",
            };
        }

        // Ensure price filter always works
        if (!parsedQuery.price) {
            parsedQuery.price = {};
        }
        parsedQuery.price.$gte = parsedQuery.price.$gte || 0;
        parsedQuery.price.$lte = parsedQuery.price.$lte || 200000;

        // Ensure rating filter always works
        if (!parsedQuery.ratings) {
            parsedQuery.ratings = {};
        }
        parsedQuery.ratings.$gte = parsedQuery.ratings.$gte || 0;

        this.query = this.query.find(parsedQuery);
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = SearchFeatures;
