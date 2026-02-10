import React, { useState } from 'react';
import './LocationPopup.css';

const LocationPopup = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    basic_wind_speed: '',
    seismic_zone: 'II',
    zone_factor: '0.10',
    max_shade_air_temp: '',
    min_shade_air_temp: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'seismic_zone') {
      const factors = { 'II': 0.10, 'III': 0.16, 'IV': 0.24, 'V': 0.36 };
      setFormData(prev => ({
        ...prev,
        zone_factor: factors[value]
      }));
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.basic_wind_speed) {
      newErrors.basic_wind_speed = 'Required';
    }
    if (!formData.max_shade_air_temp) {
      newErrors.max_shade_air_temp = 'Required';
    }
    if (!formData.min_shade_air_temp) {
      newErrors.min_shade_air_temp = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        basic_wind_speed: parseFloat(formData.basic_wind_speed),
        seismic_zone: formData.seismic_zone,
        zone_factor: parseFloat(formData.zone_factor),
        max_shade_air_temp: parseFloat(formData.max_shade_air_temp),
        min_shade_air_temp: parseFloat(formData.min_shade_air_temp)
      });
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Custom Loading Parameters</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="popup-content">
          <div className="spreadsheet-grid">
            <div className="form-group">
              <label>Basic Wind Speed (m/s)</label>
              <input
                type="number"
                value={formData.basic_wind_speed}
                onChange={(e) => handleChange('basic_wind_speed', e.target.value)}
                className={`form-control ${errors.basic_wind_speed ? 'error' : ''}`}
              />
              {errors.basic_wind_speed && <div className="error-message">{errors.basic_wind_speed}</div>}
            </div>

            <div className="form-group">
              <label>Seismic Zone</label>
              <select
                value={formData.seismic_zone}
                onChange={(e) => handleChange('seismic_zone', e.target.value)}
                className="form-control"
              >
                <option value="II">Zone II</option>
                <option value="III">Zone III</option>
                <option value="IV">Zone IV</option>
                <option value="V">Zone V</option>
              </select>
            </div>

            <div className="form-group">
              <label>Zone Factor</label>
              <input
                type="number"
                value={formData.zone_factor}
                onChange={(e) => handleChange('zone_factor', e.target.value)}
                className="form-control"
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Max Temperature (°C)</label>
              <input
                type="number"
                value={formData.max_shade_air_temp}
                onChange={(e) => handleChange('max_shade_air_temp', e.target.value)}
                className={`form-control ${errors.max_shade_air_temp ? 'error' : ''}`}
              />
              {errors.max_shade_air_temp && <div className="error-message">{errors.max_shade_air_temp}</div>}
            </div>

            <div className="form-group">
              <label>Min Temperature (°C)</label>
              <input
                type="number"
                value={formData.min_shade_air_temp}
                onChange={(e) => handleChange('min_shade_air_temp', e.target.value)}
                className={`form-control ${errors.min_shade_air_temp ? 'error' : ''}`}
              />
              {errors.min_shade_air_temp && <div className="error-message">{errors.min_shade_air_temp}</div>}
            </div>
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

export default LocationPopup;