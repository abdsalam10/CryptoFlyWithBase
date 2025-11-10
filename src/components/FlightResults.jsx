import React, { useState, useEffect } from 'react'
import './FlightResults.css'

const FlightResults = ({ searchParams, onSelectFlight, onBack }) => {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('price')

  useEffect(() => {
    // Simulate flight search with mock data
    const searchFlights = () => {
      setLoading(true)
      
      setTimeout(() => {
        const mockFlights = generateMockFlights(searchParams)
        setFlights(mockFlights)
        setLoading(false)
      }, 1500)
    }

    searchFlights()
  }, [searchParams])

  const generateMockFlights = (params) => {
    const airlines = [
      { name: 'CryptoAir', logo: '✈️', rating: 4.5 },
      { name: 'BlockChain Airways', logo: '🚀', rating: 4.7 },
      { name: 'Ethereum Express', logo: '💎', rating: 4.3 },
      { name: 'Web3 Wings', logo: '🦅', rating: 4.6 },
      { name: 'Decentralized Air', logo: '🌐', rating: 4.4 }
    ]

    const basePrice = 0.5 + Math.random() * 2 // ETH

    return airlines.map((airline, index) => {
      const departTime = `${8 + index * 2}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`
      const duration = 3 + Math.floor(Math.random() * 8)
      const stops = Math.floor(Math.random() * 3)
      const priceMultiplier = 1 + (stops * 0.1) + (Math.random() * 0.3)
      
      return {
        id: `FL${1000 + index}`,
        airline: airline.name,
        logo: airline.logo,
        rating: airline.rating,
        from: params.from,
        to: params.to,
        departDate: params.departDate,
        returnDate: params.returnDate,
        departTime: departTime,
        arriveTime: calculateArrivalTime(departTime, duration),
        duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
        stops: stops,
        price: (basePrice * priceMultiplier).toFixed(4),
        seats: 12 + Math.floor(Math.random() * 38),
        class: 'Economy'
      }
    })
  }

  const calculateArrivalTime = (departTime, duration) => {
    const [hours, minutes] = departTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration * 60
    const arriveHours = Math.floor(totalMinutes / 60) % 24
    const arriveMinutes = totalMinutes % 60
    return `${arriveHours.toString().padStart(2, '0')}:${arriveMinutes.toString().padStart(2, '0')}`
  }

  const sortFlights = (flightsToSort) => {
    const sorted = [...flightsToSort]
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      case 'duration':
        return sorted.sort((a, b) => {
          const aDuration = parseInt(a.duration)
          const bDuration = parseInt(b.duration)
          return aDuration - bDuration
        })
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      default:
        return sorted
    }
  }

  const sortedFlights = sortFlights(flights)

  if (loading) {
    return (
      <div className="flight-results-container">
        <div className="results-header">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <h2>Searching Flights...</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Finding the best flights for you</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flight-results-container">
      <div className="results-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="route-info">
          <h2>{searchParams.from} → {searchParams.to}</h2>
          <p>{searchParams.departDate} {searchParams.tripType === 'roundtrip' ? `• ${searchParams.returnDate}` : ''}</p>
        </div>
      </div>

      <div className="results-controls">
        <div className="results-count">
          {flights.length} flights found
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="price">Price (Low to High)</option>
            <option value="duration">Duration</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="flights-list">
        {sortedFlights.map(flight => (
          <div key={flight.id} className="flight-card">
            <div className="flight-main-info">
              <div className="airline-section">
                <span className="airline-logo">{flight.logo}</span>
                <div className="airline-details">
                  <h3>{flight.airline}</h3>
                  <div className="flight-rating">
                    ⭐ {flight.rating}
                  </div>
                </div>
              </div>

              <div className="flight-time-section">
                <div className="time-block">
                  <div className="time">{flight.departTime}</div>
                  <div className="location">{searchParams.from}</div>
                </div>

                <div className="flight-duration">
                  <div className="duration-line">
                    <div className="dot"></div>
                    <div className="line"></div>
                    <div className="dot"></div>
                  </div>
                  <div className="duration-text">{flight.duration}</div>
                  <div className="stops-text">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>

                <div className="time-block">
                  <div className="time">{flight.arriveTime}</div>
                  <div className="location">{searchParams.to}</div>
                </div>
              </div>
            </div>

            <div className="flight-footer">
              <div className="flight-details">
                <span className="detail-item">
                  <span className="detail-icon">💺</span>
                  {flight.seats} seats left
                </span>
                <span className="detail-item">
                  <span className="detail-icon">🎫</span>
                  {flight.class}
                </span>
              </div>

              <div className="flight-action">
                <div className="price-section">
                  <div className="price">{flight.price} ETH</div>
                  <div className="price-label">per person</div>
                </div>
                <button 
                  className="select-btn"
                  onClick={() => onSelectFlight(flight)}
                >
                  Select Flight
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlightResults
