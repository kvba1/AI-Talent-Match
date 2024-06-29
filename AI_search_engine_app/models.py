from sentence_transformers import SentenceTransformer

def get_bi_encoder():
    model_name = 'paraphrase-MiniLM-L6-v2'
    model = SentenceTransformer(model_name)
    return model
