import React, { useReducer, useEffect } from "react";

import { Container, Col, Row } from "reactstrap";

// react-router-dom3
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// react toastify stuffs
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// firebase stuffs
//TODO: import firebase config and firebase database

// components
import AddContact from "./pages/AddContact";
import Contacts from "./pages/Contacts";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ViewContact from "./pages/ViewContact";
import PageNotFound from "./pages/PageNotFound";

// context api stuffs
//TODO: import reducers and contexts
import reducer from "./context/reducer";
import { ContactContext } from "./context/Context";
import { SET_CONTACT,SET_LOADING } from "./context/action.types";

//initializing firebase app with the firebase config which are in ./utils/firebaseConfig
//TODO: initialize FIREBASE

import {firebaseConfig} from "./utils/config.js"

import firebase from "firebase/compat/app"

import { getDatabase, ref, onValue } from "firebase/database";


firebase.initializeApp(firebaseConfig)
 
// first state to provide in react reducer
const initialState = {
  contacts: [],
  contact: {},
  contactToUpdate: null,
  contactToUpdateKey: null,
  isLoading: false
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // will get contacts from firebase and set it on state contacts array
  const getContacts =() => {
    // TODO: load existing data

    dispatch({
      type:SET_LOADING,
      payload: true
    })
     
    const db=getDatabase()
    const contactsRef= ref(db, 'contacts/')
    onValue(contactsRef, (snapshot)=>{
      dispatch({
        type: SET_CONTACT,
        payload: snapshot.val()
      })
      dispatch({
        type:SET_LOADING,
        payload: false
      })
    })

   
  };

  // getting contact  when component did mount
  useEffect(() => {
    getContacts()
  }, []);

  return (
    <Router>
      {/* FIXME: Provider is not configured */}
      <ContactContext.Provider value={{state, dispatch}}>
        <ToastContainer />
        <Header />
        <Container>
          <Routes>
            <Route exact path="/contact/add" element={<AddContact/>} />
            <Route exact path="/contact/view" element={<ViewContact/>} />
            <Route exact path="/" element={<Contacts/>} />
            <Route exact path="*" element={<PageNotFound/>} />
            </Routes>
        </Container>
      </ContactContext.Provider>
      <Footer/>
    </Router>
  );
};

export default App;
