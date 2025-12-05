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

        const category = queryCopy.category;

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        let queryStringCopy = JSON.stringify(queryCopy);
        queryStringCopy = queryStringCopy.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (key) => `$${key}`
        );
        queryStringCopy = JSON.parse(queryStringCopy);

        if (category) {
            queryStringCopy.category = {
                $regex: `^${category}$`,
                $options: "i",
            };
        }

        this.query = this.query.find(queryStringCopy);
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
