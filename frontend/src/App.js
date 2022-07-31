import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { button } from "react-bootstrap";

import "./App.css";

const baseUrl = "http://localhost:5000";

function App() {
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);

  const fetchEvents = async () => {
    const data = await axios.get(`${baseUrl}/events`);
    const { events } = data.data;
    setEventsList(events);
  };

  const handleChange = (e, field) => {
    if (field === "edit") {
      setEditDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
    setDescription(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/events/${id}`);
      const updatedList = eventsList.filter((event) => event.id !== id);
      setEventsList(updatedList);
    } catch (error) {
      console.error(error.message);
    }
  };
  const toggleEdit = (event) => {
    setEventId(event.id);
    setEditDescription(event.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDescription) {
        const data = await axios.put(`${baseUrl}/events/${eventId}`, {
          description: editDescription,
        });
        const updatedEvent = data.data.event;
        const updatedList = eventsList.map((event) => {
          if (event.id === eventId) {
            return (event = updatedEvent);
          }
          return event;
        });
        setEventsList(updatedList);
      } else {
        const data = await axios.post(`${baseUrl}/events`, { description });
        setEventsList([...eventsList, data.data]);
        setDescription("");
      }
      setDescription("");
      setEditDescription("");
      setEventId(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="App">
      <h1 style={{ color: "white" }}>Welcome to the Baby Event Tracker App</h1>
      <section>
        <form className={"mb-3"} onSubmit={handleSubmit}>
          <label className={"form-label"} htmlFor={"description"}>
            Description
          </label>
          <input
            className={"form-control"}
            onChange={(e) => handleChange(e, "description")}
            type="text"
            id={"description"}
            name={"description"}
            value={description}
            placeholder={"Describe the event"}
          />
          <button className={"btn btn-primary"} type="submit">
            Submit
          </button>
        </form>
      </section>
      <section>
        <ul className={"list-group"}>
          {eventsList.map((event) => {
            if (eventId === event.id) {
              return (
                <li key={event.id}>
                  <form onSubmit={handleSubmit} key={event.id}>
                    <input
                      className={"form-control"}
                      onChange={(e) => handleChange(e, "edit")}
                      type="text"
                      id={"editDescription"}
                      name={"editDescription"}
                      value={editDescription}
                    />
                    <button className={"btn btn-primary"} type="submit">
                      Submit
                    </button>
                  </form>
                </li>
              );
            } else {
              return (
                <li className={"list-group-item mb-3"} key={event.id}>
                  {event.description}
                  <br />
                  {format(new Date(event.created_at), "M/dd @ H:mm")}
                  <div>
                    <button
                      className={"btn btn-primary"}
                      onClick={() => toggleEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className={"btn btn-danger"}
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      </section>
    </div>
  );
}

export default App;
