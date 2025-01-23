class APIfeatures {
  constructor(query, querystring) {
    this.query = query;
    this.querystring = querystring;
  }

  filter() {
    //REGULAR FILTERING

    const queryObj = { ...this.querystring };
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach(el => delete queryObj[el]);

    //ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.querystring.sort) {
      const sortBy = this.querystring.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fields() {
    if (this.querystring.fields) {
      const fields = this.querystring.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.querystring.page * 1 || 1;
    const limit = this.querystring.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIfeatures;
