class SearchFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

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

    filter() {
        const queryCopy = { ...this.queryStr };

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (key) => `$${key}`
        );
        queryString = JSON.parse(queryString);

        // ⭐ Flexible category match (case insensitive)
        // Accepts 'Mobile' / 'Mobiles' / 'mobile' etc.
        // Escape user input to avoid accidental regex injection
        if (this.queryStr.category && this.queryStr.category.trim() !== "") {
            const rawCat = this.queryStr.category.trim();
            const escaped = rawCat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            // allow optional plural (s or es), and be case-insensitive
            // matches: 'Mobile', 'Mobiles', 'mobile', 'mobiles'
            queryString.category = {
                $regex: `^${escaped}(es|s)?$`,
                $options: "i",
            };
        }

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
