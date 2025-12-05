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

        // 🔥 Extract category before fields deletion
        const category = queryCopy.category;

        // Remove unnecessary fields
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Convert operators
        let queryStringCopy = JSON.stringify(queryCopy);
        queryStringCopy = queryStringCopy.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (key) => `$${key}`
        );
        queryStringCopy = JSON.parse(queryStringCopy);

        // 🔥 Case-insensitive category filtering
        if (category) {
            queryStringCopy.category = {
                $regex: `^${category}$`,
                $options: "i",
            };
        }

        this.query = this.query.find(queryStringCopy);

        return this;
    }
}

module.exports = SearchFeatures;
