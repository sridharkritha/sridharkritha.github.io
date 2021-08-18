    // bookModel.js
    const mongoose = require('mongoose');
    const db = mongoose.connect('mongodb://localhost/bookAPI');

    const {Schema} = mongoose;
    const bookModel = new Schema(
                                    {
                                        title: {type: String},
                                        genre: {type: String},
                                        author: {type: String},
                                        read: {type: Boolean, default: false}
                                    }
                                );
    // converts schema => model
    module.exports = mongoose.model('Book', bookModel);