import React from 'react';
import { Database, RefreshCw, CheckCircle, Server } from 'lucide-react';
import { stitchService } from '../services/stitchService';

export default function StitchStatus() {
  const status = stitchService.getStatus();

  return (
    <div 
      style={{
        padding: '2.5rem 0',
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-secondary) 100%)',
        color: '#ffffff'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}>
            <Database size={28} color="var(--color-peach)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>
              <span>Backend stitch Integration</span>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: '#10B981', fontSize: '0.75rem', color: '#ffffff' }}>
                Online
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.2rem' }}>
              App ID: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{status.appId}</code> • Sincronización dinámica de productos y creadoras activa.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a 
            href="/src/config/stitch_schema.json" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '600',
              backdropFilter: 'blur(8px)',
              textDecoration: 'none'
            }}
          >
            <Server size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Ver Esquema MongoDB/Stitch
          </a>
        </div>
      </div>
    </div>
  );
}
