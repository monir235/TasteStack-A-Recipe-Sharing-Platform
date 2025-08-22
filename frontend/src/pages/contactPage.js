import React, { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");
  const [statusColor, setStatusColor] = useState("");

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setFormStatus("Please fill in all fields.");
      setStatusColor("red");
      return;
    }

    if (!validateEmail(email)) {
      setFormStatus("Please enter a valid email address.");
      setStatusColor("red");
      return;
    }

    setFormStatus("Sending message...");
    setStatusColor("blue");

    // Simulate sending
    setTimeout(() => {
      setFormStatus("Message sent successfully!");
      setStatusColor("green");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);

    // Example: send to server
    /*
    fetch('/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormStatus("Message sent successfully!");
          setStatusColor("green");
          setFormData({ name: "", email: "", message: "" });
        } else {
          setFormStatus("Error sending message. Please try again.");
          setStatusColor("red");
        }
      })
      .catch(() => {
        setFormStatus("An error occurred. Please try again.");
        setStatusColor("red");
      });
    */
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your name"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Message:</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter some good advice"
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Send Message
          </button>
        </form>
        <div style={{ marginTop: "15px", textAlign: "center", fontWeight: "bold", color: statusColor }}>
          {formStatus}
        </div>
      </div>
    </div>
  );
};

// Inline CSS (merged from your CSS)
const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    margin: 0,
  },
  container: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  textarea: {
    width: "calc(100% - 20px)",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
};

export default Page;
