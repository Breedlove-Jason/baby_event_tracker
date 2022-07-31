import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

import "./App.css";

const baseUrl = "http://localhost:5000";

function App() {
  const [description, setDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);

  const fetchEvents = async () => {
    const data = await axios.get(`${baseUrl}/events`);
    const { events } = data.data;
    setEventsList(events);

    console.log("Data", data);
  };

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(description);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="App">
      <h1>Welcome to the Baby Tracker App</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor={"description"}></label>
        <input
          onChange={handleChange}
          type="text"
          id={"description"}
          name={"description"}
          value={description}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
