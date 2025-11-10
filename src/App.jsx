import React, { useState, useEffect } from 'react'
import './App.css'
import { sdk } from '@farcaster/miniapp-sdk'
import WalletConnect from './components/WalletConnect'
import Profile from './components/Profile'
import FlightSearch from './components/FlightSearch'
import FlightResults from './components/FlightResults'
import BookingConfirmation from './components/BookingConfirmation'

function App() {
  const [walletAddress, setWalletAddress] = useState(null)
  const [currentView, setCurrentView] = useState('home')
  const [userProfile, setUserProfile] = useState({
    email: '',
    phone: '',
    country: '',
    fullName: '',
    passportNumber: '',
    dateOfBirth: ''
  })
  const [searchParams, setSearchParams] = useState(null)
  const [selectedFlight, setSelectedFlight] = useState(null)

  useEffect(() => {
    sdk.actions.ready()
    // Load saved profile from localStorage
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleWalletConnect = (address) => {
    setWalletAddress(address)
  }

  const handleWalletDisconnect = () => {
    setWalletAddress(null)
    setCurrentView('home')
  }

  const handleProfileUpdate = (profile) => {
    setUserProfile(profile)
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }

  const handleSearch = (params) => {
    setSearchParams(params)
    setCurrentView('results')
  }

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight)
    setCurrentView('booking')
  }

  const handleBookingComplete = () => {
    setCurrentView('home')
    setSelectedFlight(null)
    setSearchParams(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L28 10V22L16 30L4 22V10L16 2Z" fill="url(#gradient)" />
            <path d="M16 8L10 14H14V20H18V14H22L16 8Z" fill="white" />
            <defs>
              <linearGradient id="gradient" x1="4" y1="2" x2="28" y2="30">
                <stop offset="0%" stopColor="#4facfe" />
                <stop offset="100%" stopColor="#00f2fe" />
              </linearGradient>
            </defs>
          </svg>
          <h1>CryptoFly</h1>
        </div>
        <WalletConnect 
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
          walletAddress={walletAddress}
        />
      </header>

      {walletAddress && (
        <nav className="app-nav">
          <button 
            className={currentView === 'home' ? 'active' : ''}
            onClick={() => setCurrentView('home')}
          >
            <span>✈️</span> Search Flights
          </button>
          <button 
            className={currentView === 'profile' ? 'active' : ''}
            onClick={() => setCurrentView('profile')}
          >
            <span>👤</span> Profile
          </button>
        </nav>
      )}

      <main className="app-main">
        {!walletAddress ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon">✈️</div>
              <h2>Welcome to CryptoFly</h2>
              <p>Book flights to anywhere in the world and pay with cryptocurrency</p>
              <div className="features">
                <div className="feature">
                  <span className="feature-icon">🌍</span>
                  <span>Global Destinations</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💎</span>
                  <span>Pay with ETH</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span>Secure & Fast</span>
                </div>
              </div>
              <p className="connect-prompt">Connect your Ethereum wallet to get started</p>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <FlightSearch onSearch={handleSearch} />
            )}
            {currentView === 'results' && searchParams && (
              <FlightResults 
                searchParams={searchParams}
                onSelectFlight={handleFlightSelect}
                onBack={() => setCurrentView('home')}
              />
            )}
            {currentView === 'booking' && selectedFlight && (
              <BookingConfirmation
                flight={selectedFlight}
                userProfile={userProfile}
                walletAddress={walletAddress}
                onComplete={handleBookingComplete}
                onBack={() => setCurrentView('results')}
              />
            )}
            {currentView === 'profile' && (
              <Profile 
                profile={userProfile}
                onUpdate={handleProfileUpdate}
                walletAddress={walletAddress}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Ethereum • Base Miniapp</p>
      </footer>
    </div>
  )
}

export default App
