module.exports = (mongoose) => {
    const { Schema } = mongoose;
  
    const discardedTokenSchema = new Schema({
      username: {
        type: String,
        required: true,
        index: true
      },
      token: {
        type: String,
        required: true
      },
      dateCreated: {
        type: Number,
        required: true,
        default: () => new Date().getTime()
      },
      dateUpdated: {
        type: Number,
        required: true,
        default: () => new Date().getTime()
      }
    });
  
    return mongoose.model('DiscardedToken', discardedTokenSchema);
  };
  