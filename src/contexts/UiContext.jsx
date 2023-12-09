import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  notify: false,
  notifyMsg: "",
  notifyColor: "",
  spinning: false,
  loginStatus: false, 
};

const actionTypes = {
  showNotifications: "showNotifications",
  hideNotifications: "hideNotifications",
  newNotifications: "newNotifications",
  showSpinner: "showSpinner",
  hideSpinner: "hideSpinner",
  loginStatus: "loginStatus", 
};

function uiReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.showNotifications:
      return { ...state, notify: true };

    case actionTypes.hideNotifications:
      return { ...state, notify: false };

    case actionTypes.newNotifications:
      return { ...state, notifyMsg: payload.msg, notifyColor: payload.color };

    case actionTypes.showSpinner:
      return { ...state, spinning: true };

    case actionTypes.hideSpinner:
      return { ...state, spinning: false };

    case actionTypes.loginStatus:
      return { ...state, loginStatus: payload }; 

    default:
      throw new Error(`${action.type} is not defined`);
  }
}

const uiContext = createContext();

function UiContext({ children }) {
  const [
    { notify, notifyMsg, notifyColor, spinning, loginStatus },
    dispatch,
  ] = useReducer(uiReducer, initialState);

  function toSpin() {
    dispatch({ type: actionTypes.showSpinner });
  }

  function toStopSpin() {
    dispatch({ type: actionTypes.hideSpinner });
  }

  function timedNotification(time = 2000) {
    dispatch({ type: actionTypes.showNotifications });
    setTimeout(() => {
      dispatch({ type: actionTypes.hideNotifications });
    }, time);
  }

  function toNotify(color, msg) {
    dispatch({ type: actionTypes.newNotifications, payload: { color, msg } });
    timedNotification();
  }

  function updateLoginStatus(status) {
    dispatch({ type: actionTypes.loginStatus, payload: status });
  }

  
 

  return (
    <uiContext.Provider
      value={{
        notify,
        notifyMsg,
        notifyColor,
        spinning,
        dispatch,
        timedNotification,
        toNotify,
        toSpin,
        toStopSpin,
        loginStatus,
        updateLoginStatus,
        
      }}
    >
      {children}
    </uiContext.Provider>
  );
}

function useUiContext() {
  const context = useContext(uiContext);
  if (context === undefined)
    throw new Error("UiContext was used outside the Ui Provider");

  return context;
}

export { UiContext, useUiContext };
