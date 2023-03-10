import React, { useState, useReducer, useEffect, useRef } from "react";
import "./App.css";
import { TextField } from "@mui/material";
import bot from "./assets/bot.png";
import user from "./assets/user.png";
import send from "./assets/sendIcon-2.png";
import { Formik } from "formik";

const initialChat: { id: number; user: string; bot: string }[] = [];

/* const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "USER":
      return [...state, { id: state.length + 1, user: action.text, bot: "" }];
    case "BOT":
      return state.map((todo: { id: number; user: string; bot: string }) => {
        if (todo.id === state.length) {
          return { ...todo, bot: action.text };
        } else {
          return todo;
        }
      });
    default:
      return state;
  }
}; */

const reducer = (state: any, action: any) => {
  const actionMap = {
    User: () => [
      ...state,
      { id: state.length + 1, user: action.text, bot: "" },
    ],
    Bot: () => {
      return state.map((todo: { id: number; user: string; bot: string }) => {
        if (todo.id === state.length) {
          return { ...todo, bot: action.text };
        } else {
          return todo;
        }
      });
    },
  };
  //@ts-ignore
  return actionMap[action.type]() ?? state;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, dispatch] = useReducer(reducer, initialChat);

  const scrollToEndRef = useRef(null);

  const scrollToEnd = () => {
    //@ts-ignore
    scrollToEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToEnd();
  }, [chats]);

  function handleFetch(text: string) {
    setIsLoading(true);
    dispatch({ type: "User", text: text });

    fetch(`http://127.0.0.1:5000/bot/${text}`)
      .then((response) => response.text())
      .then((text) => {
        dispatch({ type: "Bot", text: text });
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 800,
          height: 800,
          borderColor: "#18293A",
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: 20,
        }}
      >
        <div
          style={{
            backgroundColor: "#001E3C",
            width: "100%",
            height: "100%",
            display: "flex",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            flexDirection: "column",
            overflow: "scroll",
          }}
        >
          {chats.length ? (
            chats.map((data: any) => (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignSelf: "flex-end",
                    margin: 10,
                  }}
                >
                  <img
                    style={{ borderRadius: 100, width: 50, height: 50 }}
                    src={user}
                    className="logo"
                    alt="bot"
                  />
                  <div
                    style={{
                      backgroundColor: "#0A1929",
                      borderRadius: 10,
                      maxWidth: 400,
                      display: "flex",
                      flexDirection: "column",
                      paddingRight: 10,
                      // padding: 20,
                      minWidth: 150,
                    }}
                  >
                    <text
                      className="read-the-docs"
                      style={{ alignSelf: "flex-end" }}
                    >
                      User
                    </text>
                    <text
                      className="read-the-docs"
                      style={{ color: "white", marginLeft: 10 }}
                    >
                      {data.user}
                    </text>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: 10,
                  }}
                >
                  <img
                    style={{ borderRadius: 100, width: 50, height: 50 }}
                    src={bot}
                    className="logo"
                    alt="bot"
                  />
                  {!isLoading ? (
                    <div
                      style={{
                        backgroundColor: "#0A1929",
                        borderRadius: 10,
                        maxWidth: 400,
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: 10,
                        minWidth: 150,
                      }}
                    >
                      <text
                        className="read-the-docs"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Bot
                      </text>
                      <text
                        className="read-the-docs"
                        style={{ color: "white", marginRight: 10 }}
                      >
                        {data.bot}
                      </text>
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#0A1929",
                        borderRadius: 10,
                        maxWidth: 400,
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: 10,
                        minWidth: 150,
                      }}
                    >
                      <text
                        className="read-the-docs"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Bot
                      </text>
                      ...
                    </div>
                  )}
                </div>
              </>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{ borderRadius: 50, width: 150, height: 150 }}
                src={bot}
                className="logo"
                alt="bot"
              />
              <text className="read-the-docs" style={{ maxWidth: 500 }}>
                Hello, I am boo th bot i am here to assist you, you can start a
                conversation by saying 'hi' or anything on your mind.
              </text>
            </div>
          )}
          <div ref={scrollToEndRef} />
        </div>
        <Formik
          initialValues={{ text: "" }}
          onSubmit={(values, actions) => {
            actions.resetForm();
            handleFetch(values.text);
          }}
        >
          {(props) => (
            <div
              style={{
                display: "flex",
                padding: 10,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextField
                color="primary"
                sx={{ width: "90%", input: { color: "red" } }}
                id="outlined-multiline-flexible"
                inputProps={{ style: { color: "white" } }}
                placeholder="write here"
                multiline
                onChange={(event) =>
                  props.setFieldValue("text", event.target.value)
                }
                name="text"
                value={props.values.text}
                maxRows={4}
              />
              <button
                style={{ backgroundColor: "#0A1929" }}
                onClick={() => {
                  if (props.values.text) {
                    props.handleSubmit();
                  }
                }}
              >
                <img style={{ width: 50, height: 50 }} src={send} alt="bot" />
              </button>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default App;
