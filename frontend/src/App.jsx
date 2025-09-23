import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:4444/api";

const clothingTypes = ["top", "bottom", "outerwear", "onepiece"];

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
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

  // Fetch all items for all clothing types on mount
  useEffect(() => {
    fetchAllItems();
  }, []);

  // Fetch all matches once on mount
  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchAllItems() {
    let allItems = [];
    for (const type of clothingTypes) {
      const res = await fetch(`${API_BASE}/clothing/${type}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        allItems = allItems.concat(data);
      }
    }
    setItems(allItems);
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
      fetchAllItems();
      fetchMatches();
      setFormData({
        name: "",
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
    } else {
      alert("Error: " + data.error);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm("Delete this item?")) return;
    const res = await fetch(`${API_BASE}/clothing/${item.type}/${item._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.error) {
      fetchAllItems();
      fetchMatches();
    } else {
      alert("Error: " + data.error);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Create New Item</h2>
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
        {/* Removed imageUrl input as requested */}

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
          Clothing Type:
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((fd) => ({ ...fd, type: e.target.value }))
            }
            required
          >
            {clothingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
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

      <h2>All Clothing Items</h2>
      <ul>
        {items.length === 0 && <li>No items found</li>}
        {items.map((item) => (
          <li key={item._id} style={{ marginBottom: 10 }}>
            <strong>{item.name}</strong> ({item.type}){" "}
            <button onClick={() => handleDelete(item)}>Delete</button>
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
