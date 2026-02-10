import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GeometryPopup from './GeometryPopup';
import LocationPopup from './LocationPopup';
import './BasicInputs.css';

const API_BASE_URL = 'http://localhost:8000/api';

const BasicInputs = () => {
  const [structureType, setStructureType] = useState('highway');
  const [locationMode, setLocationMode] = useState('location');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [span, setSpan] = useState('');
  const [carriageway, setCarriageway] = useState('');
  const [footpath, setFootpath] = useState('none');
  const [skewAngle, setSkewAngle] = useState('');
  const [girderSteel, setGirderSteel] = useState('E250');
  const [bracingSteel, setBracingSteel] = useState('E250');
  const [deckConcrete, setDeckConcrete] = useState('M25');

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [customLocationData, setCustomLocationData] = useState(null);

  const [geometryData, setGeometryData] = useState({
    girder_spacing: '',
    num_girders: '',
    deck_overhang: ''
  });

  const [showGeometryPopup, setShowGeometryPopup] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchLocationData(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (structureType === 'other') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [structureType]);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/states/`);
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/districts/?state_id=${stateId}`);
      setDistricts(response.data);
      setSelectedDistrict('');
      setLocationData(null);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchLocationData = async (districtId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/districts/${districtId}/location_data/`);
      setLocationData(response.data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const handleStructureTypeChange = (e) => {
    setStructureType(e.target.value);
    if (e.target.value === 'other') {
      setErrors({});
    }
  };

  const handleLocationModeChange = (mode) => {
    setLocationMode(mode);
    if (mode === 'location') {
      setCustomLocationData(null);
    } else {
      setLocationData(null);
      setSelectedState('');
      setSelectedDistrict('');
    }
  };

  const validateSpan = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 5 || numValue > 100) {
      setErrors(prev => ({ ...prev, span: 'Outside the software range.' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.span;
        return newErrors;
      });
    }
  };

  const validateCarriageway = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 3 || numValue > 50) {
      setErrors(prev => ({ ...prev, carriageway: 'Outside the software range.' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.carriageway;
        return newErrors;
      });
    }
  };

  const validateSkewAngle = (value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 20) {
      setErrors(prev => ({ 
        ...prev, 
        skewAngle: 'IRC 24 (2010) requires detailed analysis for skew angles > 20°' 
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.skewAngle;
        return newErrors;
      });
    }
  };

  const handleGeometryUpdate = (data) => {
    setGeometryData(data);
  };

  const handleCustomLocationUpdate = (data) => {
    setCustomLocationData(data);
  };

  const getDisplayLocationData = () => {
    if (locationMode === 'location' && locationData) {
      return locationData;
    } else if (locationMode === 'custom' && customLocationData) {
      return customLocationData;
    }
    return null;
  };

  const displayData = getDisplayLocationData();

  return (
    <div className="basic-inputs">
      {/* Type of Structure */}
      <div className="form-section">
        <h3>Type of Structure</h3>
        <div className="form-group">
          <select
            value={structureType}
            onChange={handleStructureTypeChange}
            className="form-control"
          >
            <option value="highway">Highway</option>
            <option value="other">Other</option>
          </select>
          {structureType === 'other' && (
            <div className="warning-message">
              Other structures not included.
            </div>
          )}
        </div>
      </div>

      {/* Project Location */}
      <div className="form-section">
        <h3>Project Location</h3>
        
        <div className="location-mode">
          <label className="checkbox-label">
            <input
              type="radio"
              name="locationMode"
              checked={locationMode === 'location'}
              onChange={() => handleLocationModeChange('location')}
              disabled={disabled}
            />
            <span>Enter Location Name</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="radio"
              name="locationMode"
              checked={locationMode === 'custom'}
              onChange={() => handleLocationModeChange('custom')}
              disabled={disabled}
            />
            <span>Tabulate Custom Loading Parameters</span>
          </label>
          
          {locationMode === 'custom' && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowLocationPopup(true)}
              disabled={disabled}
            >
              Open Spreadsheet
            </button>
          )}
        </div>

        {locationMode === 'location' && (
          <div className="location-inputs">
            <div className="form-group">
              <label>State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="form-control"
                disabled={disabled}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="form-control"
                disabled={disabled || !selectedState}
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {displayData && (
          <div className="location-data">
            <div className="data-row">
              <label>Basic Wind Speed (m/s):</label>
              <span className="value-green">{displayData.basic_wind_speed}</span>
            </div>
            <div className="data-row">
              <label>Seismic Zone:</label>
              <span className="value-green">{displayData.seismic_zone}</span>
            </div>
            <div className="data-row">
              <label>Zone Factor:</label>
              <span className="value-green">{displayData.zone_factor}</span>
            </div>
            <div className="data-row">
              <label>Max Shade Air Temperature (°C):</label>
              <span className="value-green">{displayData.max_shade_air_temp}</span>
            </div>
            <div className="data-row">
              <label>Min Shade Air Temperature (°C):</label>
              <span className="value-green">{displayData.min_shade_air_temp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Geometric Details */}
      <div className="form-section">
        <h3>Geometric Details</h3>
        
        <div className="form-group">
          <label>Span (m)</label>
          <input
            type="number"
            step="0.1"
            value={span}
            onChange={(e) => {
              setSpan(e.target.value);
              validateSpan(e.target.value);
            }}
            className={`form-control ${errors.span ? 'error' : ''}`}
            disabled={disabled}
          />
          {errors.span && <div className="error-message">{errors.span}</div>}
        </div>

        <div className="form-group">
          <label>Carriageway Width (m)</label>
          <input
            type="number"
            step="0.1"
            value={carriageway}
            onChange={(e) => {
              setCarriageway(e.target.value);
              validateCarriageway(e.target.value);
            }}
            className={`form-control ${errors.carriageway ? 'error' : ''}`}
            disabled={disabled}
          />
          {errors.carriageway && <div className="error-message">{errors.carriageway}</div>}
        </div>

        <div className="form-group">
          <label>Footpath</label>
          <select
            value={footpath}
            onChange={(e) => setFootpath(e.target.value)}
            className="form-control"
            disabled={disabled}
          >
            <option value="none">None</option>
            <option value="single">Single-sided</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="form-group">
          <label>Skew Angle (°)</label>
          <input
            type="number"
            step="0.1"
            value={skewAngle}
            onChange={(e) => {
              setSkewAngle(e.target.value);
              validateSkewAngle(e.target.value);
            }}
            className={`form-control ${errors.skewAngle ? 'error' : ''}`}
            disabled={disabled}
          />
          {errors.skewAngle && <div className="error-message">{errors.skewAngle}</div>}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowGeometryPopup(true)}
          disabled={disabled || !carriageway}
        >
          Modify Additional Geometry
        </button>

        {geometryData.num_girders && (
          <div className="geometry-summary">
            <p><strong>Girder Spacing:</strong> {geometryData.girder_spacing} m</p>
            <p><strong>Number of Girders:</strong> {geometryData.num_girders}</p>
            <p><strong>Deck Overhang:</strong> {geometryData.deck_overhang} m</p>
          </div>
        )}
      </div>

      {/* Material Inputs */}
      <div className="form-section">
        <h3>Material Inputs</h3>
        
        <div className="form-group">
          <label>Girder Steel</label>
          <select
            value={girderSteel}
            onChange={(e) => setGirderSteel(e.target.value)}
            className="form-control"
            disabled={disabled}
          >
            <option value="E250">E250</option>
            <option value="E350">E350</option>
            <option value="E450">E450</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cross Bracing Steel</label>
          <select
            value={bracingSteel}
            onChange={(e) => setBracingSteel(e.target.value)}
            className="form-control"
            disabled={disabled}
          >
            <option value="E250">E250</option>
            <option value="E350">E350</option>
            <option value="E450">E450</option>
          </select>
        </div>

        <div className="form-group">
          <label>Deck Concrete</label>
          <select
            value={deckConcrete}
            onChange={(e) => setDeckConcrete(e.target.value)}
            className="form-control"
            disabled={disabled}
          >
            <option value="M25">M25</option>
            <option value="M30">M30</option>
            <option value="M35">M35</option>
            <option value="M40">M40</option>
            <option value="M45">M45</option>
            <option value="M50">M50</option>
            <option value="M55">M55</option>
            <option value="M60">M60</option>
          </select>
        </div>
      </div>

      {showGeometryPopup && (
        <GeometryPopup
          carriageway={parseFloat(carriageway)}
          initialData={geometryData}
          onClose={() => setShowGeometryPopup(false)}
          onSave={handleGeometryUpdate}
        />
      )}

      {showLocationPopup && (
        <LocationPopup
          onClose={() => setShowLocationPopup(false)}
          onSave={handleCustomLocationUpdate}
        />
      )}
    </div>
  );
};

export default BasicInputs;