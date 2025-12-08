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

    // Remove fields which are not needed for filtering
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Apply numeric filters (price, ratings)
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (key) => `$${key}`
    );
    queryString = JSON.parse(queryString);

    if (this.queryStr.category) {
    const category = this.queryStr.category.trim().toLowerCase();

    queryString.category = {
        $regex: `^${category}$`,
        $options: "i",
    };
}


    // Apply search query
    this.query = this.query.find(queryString);
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
