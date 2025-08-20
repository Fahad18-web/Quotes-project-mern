import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, default: 'Unknown', trim: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

QuoteSchema.index({ text: 'text', author: 'text', tags: 'text' });

export default mongoose.model('Quote', QuoteSchema);
