
export interface Answer{
    date : {
        day:Number,
        month:Number,
        year:Number
    },
    username:String,
    categories: [String],
    terms: [String],
    approveds: [Boolean]
}