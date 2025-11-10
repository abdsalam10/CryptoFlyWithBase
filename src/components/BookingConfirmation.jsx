import React, { useState } from 'react'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import './BookingConfirmation.css'

const BookingConfirmation = ({ flight, userProfile, walletAddress, onComplete, onBack }) => {
  const [error, setError] = useState(null)
  const [bookingComplete, setBookingComplete] = useState(false)
  
  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  React.useEffect(() => {
    if (isSuccess && hash) {
      setBookingComplete(true)
      // Auto-complete after 3 seconds
      setTimeout(() => {
        onComplete()
      }, 3000)
    }
  }, [isSuccess, hash, onComplete])

  const handlePayment = async () => {
    if (!userProfile.email || !userProfile.phone || !userProfile.fullName) {
      setError('Please complete your profile before booking')
      return
    }

    setError(null)

    try {
      // In a real app, this would be a smart contract address for flight booking
      const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      
      sendTransaction({
        to: recipientAddress,
        value: parseEther(flight.price)
      })

    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment failed. Please try again.')
    }
  }

  const isProcessing = isPending || isConfirming

  if (bookingComplete) {
    return (
      <div className="booking-confirmation-container">
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Your flight has been successfully booked</p>
          
          <div className="confirmation-details">
            <div className="detail-row">
              <span className="label">Transaction Hash:</span>
              <a 
                href={`https://basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                {hash?.slice(0, 10)}...{hash?.slice(-8)}
              </a>
            </div>
            <div className="detail-row">
              <span className="label">Flight:</span>
              <span className="value">{flight.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Route:</span>
              <span className="value">{flight.from} → {flight.to}</span>
            </div>
          </div>

          <p className="redirect-message">Redirecting to home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-confirmation-container">
      <div className="booking-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Confirm Booking</h2>
      </div>

      <div className="booking-content">
        <div className="flight-summary">
          <h3>Flight Details</h3>
          <div className="summary-card">
            <div className="summary-row">
              <span className="airline-info">
                <span className="airline-logo">{flight.logo}</span>
                <span>{flight.airline}</span>
              </span>
              <span className="flight-id">Flight {flight.id}</span>
            </div>

            <div className="route-summary">
              <div className="route-point">
                <div className="route-time">{flight.departTime}</div>
                <div className="route-location">{flight.from}</div>
                <div className="route-date">{flight.departDate}</div>
              </div>
              
              <div className="route-line">
                <div className="route-duration">
                  <span>✈️</span>
                  <span>{flight.duration}</span>
                </div>
              </div>

              <div className="route-point">
                <div className="route-time">{flight.arriveTime}</div>
                <div className="route-location">{flight.to}</div>
                <div className="route-date">{flight.departDate}</div>
              </div>
            </div>

            <div className="summary-details">
              <div className="detail-item">
                <span className="icon">🎫</span>
                <span>{flight.class}</span>
              </div>
              <div className="detail-item">
                <span className="icon">🔄</span>
                <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="passenger-info">
          <h3>Passenger Information</h3>
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{userProfile.fullName || 'Not set'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{userProfile.email || 'Not set'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{userProfile.phone || 'Not set'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Country:</span>
              <span className="info-value">{userProfile.country || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="payment-summary">
          <h3>Payment Summary</h3>
          <div className="payment-card">
            <div className="payment-row">
              <span>Flight Price</span>
              <span>{flight.price} ETH</span>
            </div>
            <div className="payment-row">
              <span>Service Fee</span>
              <span>0.00001 ETH</span>
            </div>
            <div className="payment-row total">
              <span>Total</span>
              <span>{(parseFloat(flight.price) + 0.00001).toFixed(5)} ETH</span>
            </div>

            <div className="wallet-info">
              <span className="wallet-label">Paying with:</span>
              <span className="wallet-address">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <button 
          className="confirm-payment-btn"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-small"></span>
              Processing Payment...
            </>
          ) : (
            <>
              <span>💳</span>
              Confirm & Pay {(parseFloat(flight.price) + 0.00001).toFixed(5)} ETH
            </>
          )}
        </button>

        <p className="payment-notice">
          🔒 Secure payment powered by Ethereum blockchain
        </p>
      </div>
    </div>
  )
}

export default BookingConfirmation
