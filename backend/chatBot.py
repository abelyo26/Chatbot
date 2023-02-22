import random
import json
import pickle
import numpy as np
import nltk
# nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer
from tensorflow import keras
from keras.models import load_model
from flask import Flask, make_response
# import flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

lemetizer = WordNetLemmatizer()
intents = json.loads(open('data.json').read())

words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('chatBotModel.h5')

def clean_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemetizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_sentence(sentence)
    bag = [0] * len(words)
    for w in  sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)
     
def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i,r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list

def get_response(intents_list, intents_json):
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

print ("Go! Bot is running")

""" while True:
    message= input('')
    ints = predict_class(message)
    res = get_response(ints, intents)
    print(res)

@app.route('/')

def index():
    return "<h1>hello world</h1>" """

@app.route('/bot/<param>',methods=['GET'])

def bot(param):
    ints = predict_class(param)
    res = get_response(ints, intents)
    
    # response = flask.jsonify({'some': 'data'})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    
    response = make_response(res, 200)
    response.mimetype = "text/plain"
    return response
