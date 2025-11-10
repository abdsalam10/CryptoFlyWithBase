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

  const handleConnect = async () => {
    try {
      setError(null)
      console.log('Starting wallet connection...')
      console.log('Available connectors:', connectors)
      
      if (!connectors || connectors.length === 0) {
        const errMsg = 'No wallet connectors available. Please ensure a wallet extension is installed.'
        console.error(errMsg)
        setError(errMsg)
        return
      }
      
      console.log('Connectors found:', connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })))
      
      // Try Farcaster miniapp connector first, then injected wallet
      const miniAppConn = connectors.find(c => c.id === 'farcasterMiniApp')
      const injectedConn = connectors.find(c => c.id === 'injected' || c.name?.toLowerCase().includes('injected'))
      
      // Prefer miniApp if available and ready, otherwise use injected or first available
      let connector
      if (miniAppConn && miniAppConn.ready) {
        connector = miniAppConn
      } else if (injectedConn) {
        connector = injectedConn
      } else {
        connector = connectors[0]
      }
      
      console.log('Selected connector:', { id: connector.id, name: connector.name, ready: connector.ready })
      console.log('Attempting to connect with:', connector.name)
      
      await connect({ connector })
      console.log('Connection successful!')
      
    } catch (err) {
      console.error('Error connecting wallet:', err)
      let errorMessage = 'Failed to connect wallet. '
      
      if (err?.message?.includes('User rejected')) {
        errorMessage = 'Connection rejected. Please approve the connection in your wallet.'
      } else if (err?.message?.includes('No provider')) {
        errorMessage = 'No wallet detected. Please install MetaMask or another wallet extension.'
      } else if (err?.message) {
        errorMessage += err.message
      }
      
      setError(errorMessage)
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
