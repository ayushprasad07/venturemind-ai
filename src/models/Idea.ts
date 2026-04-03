import mongoose from "mongoose";

export interface IdeaI {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  problem: string;
  targetUser: string;
  industry: string;

  analysis : string

  pineconeId?: string;

  embeddingSnippet: number[];

  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new mongoose.Schema<IdeaI>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    title: { type: String, required: true },
    problem: { type: String, required: true },
    targetUser: { type: String, required: true },
    industry: { type: String, required: true },
    analysis : {type : String, required : true},

    pineconeId: String,

    embeddingSnippet: {
      type: [Number]
    }
  },
  { timestamps: true }
);

export default mongoose.models.Idea || mongoose.model("Idea", IdeaSchema);