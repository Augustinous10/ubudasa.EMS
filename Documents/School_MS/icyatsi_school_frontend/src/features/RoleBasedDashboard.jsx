import React from 'react';
import { Navigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaPhone } from 'react-icons/fa';

function RoleBasedDashboard({ userRole }) {
  const socialLinks = [
    { icon: FaFacebook, url: 'https://web.facebook.com/icyatsi', className: 'facebook' },
    { icon: FaInstagram, url: 'https://www.instagram.com/icyatsi_technology/', className: 'instagram' },
    { icon: FaTwitter, url: 'https://x.com/icyatsi72', className: 'twitter' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/company/100032603', className: 'linkedin' },
    { icon: FaYoutube, url: 'https://www.youtube.com/@Kwihugura_rw-q9c', className: 'youtube' },
    { icon: FaTiktok, url: 'https://tiktok.com/@icyatsitechnology', className: 'tiktok' },
  ];

  // Updated paths to match your routing
  if (userRole === 'admin') return <Navigate to="/dashboard/admin" />;
  if (userRole === 'headteacher') return <Navigate to="/dashboard/headteacher" />;
  if (userRole === 'accountant') return <Navigate to="/dashboard/accountant" />;
  if (userRole === 'cashier') return <Navigate to="/dashboard/cashier" />;

  // Access denied UI if no valid role
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: '2px solid #ffffffff'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          🚫
        </div>
        <h1 style={{
          color: '#e11919ff',
          fontSize: '32px',
          marginBottom: '16px',
          fontWeight: 'bold'
        }}>
          Access Denied
        </h1>
        <p style={{
          color: '#6c757d',
          fontSize: '16px',
          marginBottom: '30px'
        }}>
          You don't have permission to access this page.
        </p>

        <div style={{
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#495057',
            fontSize: '18px',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Contact Us
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <FaPhone style={{
              color: '#28a745',
              fontSize: '18px',
              marginRight: '10px'
            }} />
            <span style={{
              color: '#495057',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              0781345944
            </span>
          </div>
        </div>

        <div>
          <h3 style={{
            color: '#495057',
            fontSize: '18px',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Follow Us on Social Media
          </h3>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: getSocialBgColor(link.className),
                    color: '#ffffff'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <IconComponent style={{ fontSize: '20px' }} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getSocialBgColor(className) {
  const colors = {
    facebook: '#1877f2',
    instagram: '#e4405f',
    twitter: '#1da1f2',
    linkedin: '#0077b5',
    youtube: '#ff0000',
    tiktok: '#000000'
  };
  return colors[className] || '#6c757d';
}

export default RoleBasedDashboard;
