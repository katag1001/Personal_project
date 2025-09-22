import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:4444/api";

const clothingTypes = ["top", "bottom", "outerwear", "onepiece"];

function App() {
  const [type, setType] = useState("top");
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    min_temp: "",
    max_temp: "",
    colors: "",
    styles: "",
    type: "top",
    spring: false,
    summer: false,
    autumn: false,
    winter: false,
  });
  const [matches, setMatches] = useState([]);

  // Fetch items when `type` changes
  useEffect(() => {
    fetchItems(type);
  }, [type]);

  // Fetch all matches once on mount
  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchItems(type) {
    const res = await fetch(`${API_BASE}/clothing/${type}`);
    const data = await res.json();
    setItems(data);
  }

  async function fetchMatches() {
    const res = await fetch(`${API_BASE}/match`);
    const data = await res.json();
    if (!data.error) {
      setMatches(data);
    } else {
      alert("Error fetching matches: " + data.error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Wrap colors and styles as arrays since user selects only one each
    const payload = {
      ...formData,
      colors: [formData.colors],
      styles: [formData.styles],
      min_temp: parseFloat(formData.min_temp),
      max_temp: parseFloat(formData.max_temp),
    };
    const res = await fetch(`${API_BASE}/clothing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.error) {
      fetchItems(type);
      // Optionally fetch matches again if they update when new item is created
      fetchMatches();
      setFormData({
        name: "",
        imageUrl: "",
        min_temp: "",
        max_temp: "",
        colors: "",
        styles: "",
        type: type,
        spring: false,
        summer: false,
        autumn: false,
        winter: false,
      });
    } else {
      alert("Error: " + data.error);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    const res = await fetch(`${API_BASE}/clothing/${type}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.error) {
      fetchItems(type);
      // Optionally fetch matches if relevant
      fetchMatches();
    } else {
      alert("Error: " + data.error);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>Clothing Manager</h1>

      <label>
        Select Type:{" "}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setFormData((fd) => ({ ...fd, type: e.target.value }));
          }}
        >
          {clothingTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <h2>Create New {type}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((fd) => ({ ...fd, name: e.target.value }))
          }
          required
        />
        <br />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData((fd) => ({ ...fd, imageUrl: e.target.value }))
          }
        />
        <br />
        <input
          type="number"
          placeholder="Min Temp"
          value={formData.min_temp}
          onChange={(e) =>
            setFormData((fd) => ({ ...fd, min_temp: e.target.value }))
          }
          required
        />
        <br />
        <input
          type="number"
          placeholder="Max Temp"
          value={formData.max_temp}
          onChange={(e) =>
            setFormData((fd) => ({ ...fd, max_temp: e.target.value }))
          }
          required
        />
        <br />

        <label>
          Style:
          <select
            value={formData.styles}
            onChange={(e) =>
              setFormData((fd) => ({ ...fd, styles: e.target.value }))
            }
            required
          >
            <option value="">Select style</option>
            <option value="plain">Plain</option>
            <option value="patterned">Patterned</option>
          </select>
        </label>
        <br />

        <label>
          Color:
          <select
            value={formData.colors}
            onChange={(e) =>
              setFormData((fd) => ({ ...fd, colors: e.target.value }))
            }
            required
          >
            <option value="">Select color</option>
            <option value="cream">Cream</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="black">Black</option>
            <option value="white">White</option>
          </select>
        </label>
        <br />

        <label>
          Spring:
          <input
            type="checkbox"
            checked={formData.spring}
            onChange={(e) =>
              setFormData((fd) => ({ ...fd, spring: e.target.checked }))
            }
          />
        </label>
        <label>
          Summer:
          <input
            type="checkbox"
            checked={formData.summer}
            onChange={(e) =>
              setFormData((fd) => ({ ...fd, summer: e.target.checked }))
            }
          />
        </label>
        <label>
          Autumn:
          <input
            type="checkbox"
            checked={formData.autumn}
            onChange={(e) =>
              setFormData((fd) => ({ ...fd, autumn: e.target.checked }))
            }
          />
        </label>
        <label>
          Winter:
          <input
            type="checkbox"
            checked={formData.winter}
            onChange={(e) =>
              setFormData((fd) => ({ ...fd, winter: e.target.checked }))
            }
          />
        </label>
        <br />
        <button type="submit">Create Item</button>
      </form>

      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Items</h2>
      <ul>
        {items.length === 0 && <li>No items found</li>}
        {items.map((item) => (
          <li key={item._id} style={{ marginBottom: 10 }}>
            <strong>{item.name}</strong>{" "}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
            <br />
            <small>Colors: {item.colors.join(", ")}</small>
            <br />
            <small>Styles: {item.styles.join(", ")}</small>
          </li>
        ))}
      </ul>

      <h2>All Matches</h2>
      {matches.length === 0 && <p>No matches found</p>}
      <ul>
        {matches.map((match, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <strong>
              {match.top ? `Top: ${match.top}` : ""}
              {match.bottom ? ` Bottom: ${match.bottom}` : ""}
              {match.outer ? ` Outer: ${match.outer}` : ""}
              {match.onepiece ? ` OnePiece: ${match.onepiece}` : ""}
            </strong>
            <br />
            <small>
              Colors: {match.colors?.join(", ")} | Color Score: {match.colorScore}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
