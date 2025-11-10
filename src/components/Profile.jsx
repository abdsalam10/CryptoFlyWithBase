import React, { useState } from 'react'
import './Profile.css'

const Profile = ({ profile, onUpdate, walletAddress }) => {
  const [formData, setFormData] = useState(profile)
  const [isEditing, setIsEditing] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
    setSaveStatus('saved')
    setIsEditing(false)
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ Edit
          </button>
        )}
      </div>

      {saveStatus === 'saved' && (
        <div className="save-notification">
          ✓ Profile updated successfully!
        </div>
      )}

      <div className="wallet-section">
        <label>Connected Wallet</label>
        <div className="wallet-display">
          <span className="wallet-icon">🔗</span>
          <span className="wallet-text">{walletAddress}</span>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="+1 234 567 8900"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country of Residence *</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Select your country</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="CN">China</option>
            <option value="IN">India</option>
            <option value="BR">Brazil</option>
            <option value="MX">Mexico</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="NL">Netherlands</option>
            <option value="SE">Sweden</option>
            <option value="SG">Singapore</option>
            <option value="AE">United Arab Emirates</option>
            <option value="ZA">South Africa</option>
            <option value="KR">South Korea</option>
            <option value="TH">Thailand</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passportNumber">Passport Number</label>
          <input
            type="text"
            id="passportNumber"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Optional - for faster booking"
          />
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        )}
      </form>

      <div className="profile-info">
        <p className="info-text">
          ℹ️ Your profile information is stored locally and used for faster flight bookings.
        </p>
      </div>
    </div>
  )
}

export default Profile
