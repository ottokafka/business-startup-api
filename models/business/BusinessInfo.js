const mongoose = require("mongoose");

// Businessinfo Model for business info
const BusinessInfoSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business"
  },
  company: {
    type: String,
    required: true,
    default: null
  },
  location: {
    address: {
      type: String,
      required: true,
      default: null
    },
    city: {
      type: String,
      required: true,
      lowercase: true,
      default: null
    },
    state: {
      type: String,
      required: true,
      lowercase: true,
      default: null
    },
    zip: {
      type: Number,
      required: true,
      default: null
    },
    distance: String,
  },

  availability: {
    day_of_week1: String,
    work1: Boolean,
    start_time1: String,
    end_time1: String,
    start_lunch1: String,
    end_lunch1: String,
    day_of_week2: String,
    work2: Boolean,
    start_time2: String,
    end_time2: String,
    start_lunch2: String,
    end_lunch2: String,
    day_of_week3: String,
    work3: Boolean,
    start_time3: String,
    end_time3: String,
    start_lunch3: String,
    end_lunch3: String,
    day_of_week4: String,
    work4: Boolean,
    start_time4: String,
    end_time4: String,
    start_lunch4: String,
    end_lunch4: String,
    day_of_week5: String,
    work5: Boolean,
    start_time5: String,
    end_time5: String,
    start_lunch5: String,
    end_lunch5: String,
    day_of_week6: String,
    work6: Boolean,
    start_time6: String,
    end_time6: String,
    start_lunch6: String,
    end_lunch6: String,
    day_of_week7: String,
    work7: Boolean,
    start_time7: String,
    end_time7: String,
    start_lunch7: String,
    end_lunch7: String
  },
  services: {
    lineUp: Number,
    fade: Number,
    haircut: Number,
    edgeUp: Number,
    design: Number,
    buzzCut: Number,
    trim: Number,
    neckTrim: Number,
    beardTrim: Number,
    hotTowel: Number,
    mustacheTrim: Number,
    razoring: Number,
    shave: Number,
    sideburnShave: Number
  },

  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = BusinessInfo = mongoose.model(
  "businessInfo",
  BusinessInfoSchema
);
