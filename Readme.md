# Chatbot

This is a simple demonstration of dialogue(conversational) chatbot functionality

## used packages

1 front-end

- react
- mui
- formik

2 back-end

- flask
- natural language toolkit (nltk)
- pickle
- numpy
- tensorflow

## Installation

1. clone repository

2. After cloning the repository make sure to install the dependencies then you can add desired data inside data.json for the bot to learn

### data.json structure

```
{
    "intents":[
        {
            "tag": "Greetings"
            "patterns":["it's nice to see you",
        "lovely to see you"]
        responses":["You too. I missed your face!",
        "The pleasure is mine.",]
        }
    ]
}
```

3. run training.py script then it generates 3 files to be used by the chatbot

4. run the chatbot.py script as a flask server to interact by sending requests or uncomment those lines to interact with it on the terminal.

```while True:
    message= input('')
    ints = predict_class(message)
    res = get_response(ints, intents)
    print(res)
```
