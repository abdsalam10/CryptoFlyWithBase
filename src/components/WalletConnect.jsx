import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import './WalletConnect.css'

const WalletConnect = ({ onConnect, onDisconnect, walletAddress }) => {
  const { isConnected, address } = useAccount()
  const { connect, connectors, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const [error, setError] = useState(null)
  
  // Get balance on Base network
  const { data: balance } = useBalance({
    address: address,
  })

  // Sync with parent component
  React.useEffect(() => {
    if (isConnected && address && address !== walletAddress) {
      onConnect(address)
    } else if (!isConnected && walletAddress) {
      onDisconnect()
    }
  }, [isConnected, address, walletAddress, onConnect, onDisconnect])

  React.useEffect(() => {
    if (connectError) {
      setError(connectError.message)
      console.error('Connection error:', connectError)
    }
  }, [connectError])

  const handleConnect = () => {
    setError(null)
    if (connectors && connectors[0]) {
      connect({ connector: connectors[0] })
    } else {
      setError('No Farcaster wallet available. Please open inside Base/Warpcast or install a wallet.')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    onDisconnect()
  }

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-details">
            <div className="wallet-indicator"></div>
            <div className="wallet-text-group">
              <span className="wallet-address">{formatAddress(address)}</span>
              {balance && (
                <span className="wallet-balance">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              )}
            </div>
          </div>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wallet-connect">
      <button 
        className="connect-btn" 
        onClick={handleConnect}
      >
        Connect Wallet
      </button>
      {error && <div className="wallet-error">{error}</div>}
    </div>
  )
}

export default WalletConnect
