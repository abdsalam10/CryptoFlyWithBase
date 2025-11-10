import React, { useState } from 'react'
import './FlightSearch.css'

const FlightSearch = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'roundtrip'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchData)
  }

  const popularDestinations = [
    { code: 'NYC', city: 'New York', country: 'USA', icon: '🗽' },
    { code: 'LHR', city: 'London', country: 'UK', icon: '🇬🇧' },
    { code: 'DXB', city: 'Dubai', country: 'UAE', icon: '🏜️' },
    { code: 'TYO', city: 'Tokyo', country: 'Japan', icon: '🗼' },
    { code: 'PAR', city: 'Paris', country: 'France', icon: '🗼' },
    { code: 'SIN', city: 'Singapore', country: 'Singapore', icon: '🦁' }
  ]

  const setQuickDestination = (code, city) => {
    setSearchData(prev => ({
      ...prev,
      to: `${code} - ${city}`
    }))
  }

  return (
    <div className="flight-search-container">
      <div className="search-header">
        <h2>Find Your Next Adventure</h2>
        <p>Book flights worldwide with cryptocurrency</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="trip-type-selector">
          <label className={searchData.tripType === 'roundtrip' ? 'active' : ''}>
            <input
              type="radio"
              name="tripType"
              value="roundtrip"
              checked={searchData.tripType === 'roundtrip'}
              onChange={handleChange}
            />
            <span>Round Trip</span>
          </label>
          <label className={searchData.tripType === 'oneway' ? 'active' : ''}>
            <input
              type="radio"
              name="tripType"
              value="oneway"
              checked={searchData.tripType === 'oneway'}
              onChange={handleChange}
            />
            <span>One Way</span>
          </label>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="from">From</label>
            <div className="input-with-icon">
              <span className="icon">🛫</span>
              <input
                type="text"
                id="from"
                name="from"
                value={searchData.from}
                onChange={handleChange}
                placeholder="City or Airport"
                required
              />
            </div>
          </div>

          <div className="swap-button-container">
            <button 
              type="button" 
              className="swap-btn"
              onClick={() => setSearchData(prev => ({
                ...prev,
                from: prev.to,
                to: prev.from
              }))}
            >
              ⇄
            </button>
          </div>

          <div className="form-field">
            <label htmlFor="to">To</label>
            <div className="input-with-icon">
              <span className="icon">🛬</span>
              <input
                type="text"
                id="to"
                name="to"
                value={searchData.to}
                onChange={handleChange}
                placeholder="City or Airport"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="departDate">Departure</label>
            <div className="input-with-icon">
              <span className="icon">📅</span>
              <input
                type="date"
                id="departDate"
                name="departDate"
                value={searchData.departDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {searchData.tripType === 'roundtrip' && (
            <div className="form-field">
              <label htmlFor="returnDate">Return</label>
              <div className="input-with-icon">
                <span className="icon">📅</span>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={searchData.returnDate}
                  onChange={handleChange}
                  min={searchData.departDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="passengers">Passengers</label>
            <div className="input-with-icon">
              <span className="icon">👤</span>
              <select
                id="passengers"
                name="passengers"
                value={searchData.passengers}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="search-btn">
          <span>🔍</span>
          Search Flights
        </button>
      </form>

      <div className="popular-destinations">
        <h3>Popular Destinations</h3>
        <div className="destination-grid">
          {popularDestinations.map(dest => (
            <button
              key={dest.code}
              type="button"
              className="destination-card"
              onClick={() => setQuickDestination(dest.code, dest.city)}
            >
              <span className="dest-icon">{dest.icon}</span>
              <div className="dest-info">
                <span className="dest-city">{dest.city}</span>
                <span className="dest-country">{dest.country}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FlightSearch
