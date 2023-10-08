import { Schema, model} from "mongoose";

interface Document {
    id: string;
    data: Object;
}

const schema = new Schema<Document>({
    id: { type: String },
    data: { type: JSON }
})

const DocumentModel = model<Document>('Document', schema);

export default DocumentModel;