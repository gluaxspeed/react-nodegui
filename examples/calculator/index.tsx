import React, { useReducer, Reducer } from "react";
import { Renderer, View, Text, Button, Window } from "../../src/index";
import {
  QPushButtonEvents,
  QMainWindowEvents,
  QWidgetEvents,
  QKeyEvent,
  NativeEvent
} from "@nodegui/nodegui";

interface state {
  display: string;
  total: number;
  pendingOp: string;
  valueBuffer: string;
}
interface action {
  type: "operation" | "value";
  value: string;
}
const initialState: state = {
  display: "",
  total: 0,
  pendingOp: "~",
  valueBuffer: ""
};

const reducer: Reducer<state, action> = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case "operation": {
      switch (newState.pendingOp) {
        case "+": {
          newState.total =
            newState.total + parseFloat(state.valueBuffer || "0");
          break;
        }
        case "-": {
          newState.total =
            newState.total - parseFloat(state.valueBuffer || "0");
          break;
        }
        case "*": {
          newState.total =
            newState.total * parseFloat(state.valueBuffer || "0");
          break;
        }
        case "/": {
          newState.total =
            newState.total / parseFloat(state.valueBuffer || "1");
          break;
        }
        case "=": {
          break;
        }
        case "~": {
          newState.total = parseFloat(state.valueBuffer || "0");
        }
        default:
      }
      newState.valueBuffer = "";
      newState.display = action.value;
      if (action.value === "=") {
        const total = newState.total;
        Object.assign(newState, initialState);
        newState.total = total;
        newState.display = `${total}`;
      }
      if (action.value === "~") {
        Object.assign(newState, initialState);
      }
      newState.pendingOp = `${action.value}`;
      break;
    }
    case "value": {
      if (state.pendingOp === "=") {
        newState.pendingOp = "~";
      }
      if (!state.valueBuffer) {
        newState.display = action.value;
        newState.valueBuffer = `${action.value}`;
      } else {
        newState.display = `${state.display}` + `${action.value}`;
        newState.valueBuffer += `${action.value}`;
      }
      break;
    }
    default:
      throw new Error("Invalid operation");
  }
  return newState;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onOperator = (value: string) => () => {
    dispatch({ type: "operation", value });
  };
  const onValue = (value: string) => () => {
    dispatch({ type: "value", value });
  };
  const onKeyRelease = (evt: NativeEvent) => {
    const operatorKeys = ["~", "/", "*", "-", "=", "+"];
    const valueKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
    const keyEvt = new QKeyEvent(evt);
    const keyText = keyEvt.text();
    if (operatorKeys.includes(keyText)) {
      dispatch({ type: "operation", value: keyText });
    } else if (valueKeys.includes(keyText)) {
      dispatch({ type: "value", value: keyText });
    }
  };

  return (
    <>
      <Window
        on={{
          [QMainWindowEvents.KeyRelease]: onKeyRelease
        }}
        maxSize={{ width: 500, height: 700 }}
        minSize={{ width: 200, height: 300 }}
        styleSheet={styleSheet}
      >
        <View on={{ [QWidgetEvents.KeyRelease]: onKeyRelease }} id="container">
          <View id="row0">
            <Button
              id="opBtn"
              text="AC"
              on={{ [QPushButtonEvents.clicked]: onOperator("~") }}
            />
            <Text id="result">{state.display || "0"}</Text>
          </View>
          <View id="row1">
            <Button
              id="valueBtn"
              text="7"
              on={{ [QPushButtonEvents.clicked]: onValue("7") }}
            />
            <Button
              id="valueBtn"
              text="8"
              on={{ [QPushButtonEvents.clicked]: onValue("8") }}
            />
            <Button
              id="valueBtn"
              text="9"
              on={{ [QPushButtonEvents.clicked]: onValue("9") }}
            />
            <Button
              id="opBtnY"
              text="/"
              on={{ [QPushButtonEvents.clicked]: onOperator("/") }}
            />
          </View>
          <View id="row">
            <Button
              id="valueBtn"
              text="4"
              on={{ [QPushButtonEvents.clicked]: onValue("4") }}
            />
            <Button
              id="valueBtn"
              text="5"
              on={{ [QPushButtonEvents.clicked]: onValue("5") }}
            />
            <Button
              id="valueBtn"
              text="6"
              on={{ [QPushButtonEvents.clicked]: onValue("6") }}
            />
            <Button
              id="opBtnY"
              text="x"
              on={{ [QPushButtonEvents.clicked]: onOperator("*") }}
            />
          </View>
          <View id="row">
            <Button
              id="valueBtn"
              text="1"
              on={{ [QPushButtonEvents.clicked]: onValue("1") }}
            />
            <Button
              id="valueBtn"
              text="2"
              on={{ [QPushButtonEvents.clicked]: onValue("2") }}
            />
            <Button
              id="valueBtn"
              text="3"
              on={{ [QPushButtonEvents.clicked]: onValue("3") }}
            />
            <Button
              id="opBtnY"
              text="-"
              on={{ [QPushButtonEvents.clicked]: onOperator("-") }}
            />
          </View>
          <View id="row">
            <Button
              id="valueBtn"
              text="0"
              on={{ [QPushButtonEvents.clicked]: onValue("0") }}
            />
            <Button
              id="valueBtn"
              text="."
              enabled={!state.valueBuffer.includes(".")}
              on={{ [QPushButtonEvents.clicked]: onValue(".") }}
            />
            <Button
              id="opBtn"
              text="="
              on={{ [QPushButtonEvents.clicked]: onOperator("=") }}
            />
            <Button
              id="opBtnY"
              text="+"
              on={{ [QPushButtonEvents.clicked]: onOperator("+") }}
            />
          </View>
        </View>
      </Window>
    </>
  );
};

// const win = new QMainWindow();
// win.resize(230, 300);
const styleSheet = `
  #container {
    qproperty-flex: 1;
    qproperty-flexDirection: column;
    qproperty-minHeight: '100%';
    background: blue;
  }
  #row, #row0, #row1 {
    qproperty-flex: 1;
    qproperty-alignItems: stretch;
    qproperty-justifyContent: space-between;
    qproperty-flexDirection: row;
    background: #4B4B4B;
  }
  #row0 {
    background: #1E1E1E;
  }
  #row1 {
      background: #2E2E2E;
  }
  #valueBtn, #opBtn, #opBtnY {
    qproperty-minWidth: '25%';
    qproperty-border: 1;
    border: 1px solid black;
    font-size: 20px;
    color: white;
  }
  #opBtnY {
    background: #FD8D0E;
  }
  #valueBtn:pressed, #opBtn:pressed, #opBtnY:pressed {
    background: grey;
  }
  #result {
    qproperty-alignment: 'AlignRight|AlignVCenter';
    padding-right: 5px;
    padding-left:5px;
    qproperty-paddingHorizontal: 5px;
    font-size: 40px;
    qproperty-flex: 1;
    color: white;
  }
`;

Renderer.render(<App />);