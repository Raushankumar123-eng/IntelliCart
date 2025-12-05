filter() {
    const queryCopy = { ...this.queryStr };

    // 🔥 Extract category before fields deletion
    const category = queryCopy.category;
    
    // Remove unnecessary fields
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Convert query operators to mongoose operators
    let queryStringCopy = JSON.stringify(queryCopy);
    queryStringCopy = queryStringCopy.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (key) => `$${key}`
    );
    queryStringCopy = JSON.parse(queryStringCopy);

    // 🔥 Force category match (case-insensitive)
    if (category) {
        queryStringCopy.category = { $regex: `^${category}$`, $options: "i" };
    }

    this.query = this.query.find(queryStringCopy);

    return this;
}
