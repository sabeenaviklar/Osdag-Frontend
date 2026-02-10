import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GeometryPopup.css';

const API_BASE_URL = 'http://localhost:8000/api';

const GeometryPopup = ({ carriageway, initialData, onClose, onSave }) => {
  const [girderSpacing, setGirderSpacing] = useState(initialData.girder_spacing || '');
  const [numGirders, setNumGirders] = useState(initialData.num_girders || '');
  const [deckOverhang, setDeckOverhang] = useState(initialData.deck_overhang || '');
  const [errors, setErrors] = useState({});
  const [overallWidth, setOverallWidth] = useState(0);

  useEffect(() => {
    const overall = carriageway + 5;
    setOverallWidth(overall);
  }, [carriageway]);

  const calculateGeometry = async (changedField) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculate-geometry/`, {
        carriageway_width: carriageway,
        girder_spacing: girderSpacing !== '' ? parseFloat(girderSpacing) : null,
        num_girders: numGirders !== '' ? parseInt(numGirders) : null,
        deck_overhang: deckOverhang !== '' ? parseFloat(deckOverhang) : null,
        changed_field: changedField
      });

      if (response.data.success) {
        const data = response.data.data;
        setGirderSpacing(data.girder_spacing || '');
        setNumGirders(data.num_girders || '');
        setDeckOverhang(data.deck_overhang || '');
        setErrors({});
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleSave = () => {
    if (girderSpacing && numGirders && deckOverhang && Object.keys(errors).length === 0) {
      onSave({
        girder_spacing: parseFloat(girderSpacing),
        num_girders: parseInt(numGirders),
        deck_overhang: parseFloat(deckOverhang),
        overall_width: overallWidth
      });
      onClose();
    } else {
      alert('Please fill all fields correctly before saving.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Modify Additional Geometry</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="popup-content">
          <div className="formula-box">
            <p><strong>Constraints:</strong></p>
            <p>Overall Bridge Width = Carriageway Width + 5 meters</p>
            <p>(Overall Width - Overhang) / Spacing = No. of Girders</p>
            <p className="highlight">Overall Width = {overallWidth.toFixed(1)} m</p>
          </div>

          <div className="geometry-inputs">
            <div className="form-group">
              <label>Girder Spacing (m)</label>
              <input
                type="number"
                step="0.1"
                value={girderSpacing}
                onChange={(e) => setGirderSpacing(e.target.value)}
                onBlur={() => girderSpacing !== '' && (numGirders !== '' || deckOverhang !== '') && calculateGeometry('girder_spacing')}
                className={`form-control ${errors.girder_spacing ? 'error' : ''}`}
              />
              {errors.girder_spacing && (
                <div className="error-message">{errors.girder_spacing}</div>
              )}
            </div>

            <div className="form-group">
              <label>Number of Girders</label>
              <input
                type="number"
                value={numGirders}
                onChange={(e) => setNumGirders(e.target.value)}
                onBlur={() => numGirders !== '' && (girderSpacing !== '' || deckOverhang !== '') && calculateGeometry('num_girders')}
                className={`form-control ${errors.num_girders ? 'error' : ''}`}
              />
              {errors.num_girders && (
                <div className="error-message">{errors.num_girders}</div>
              )}
            </div>

            <div className="form-group">
              <label>Deck Overhang Width (m)</label>
              <input
                type="number"
                step="0.1"
                value={deckOverhang}
                onChange={(e) => setDeckOverhang(e.target.value)}
                onBlur={() => deckOverhang !== '' && (girderSpacing !== '' || numGirders !== '') && calculateGeometry('deck_overhang')}
                className={`form-control ${errors.deck_overhang ? 'error' : ''}`}
              />
              {errors.deck_overhang && (
                <div className="error-message">{errors.deck_overhang}</div>
              )}
            </div>
          </div>

          <div className="help-text">
            <p><strong>How it works:</strong></p>
            <ul>
              <li>Enter any two values, third will auto-calculate</li>
              <li>All values must be less than overall width ({overallWidth.toFixed(1)} m)</li>
            </ul>
          </div>
        </div>

        <div className="popup-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default GeometryPopup;