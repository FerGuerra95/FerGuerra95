import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BrainCircuit, Calculator, Landmark, ShieldCheck } from 'lucide-react';
import { routeGroups } from '../router/routeConfig.jsx';

const workspaceMeta = {
  ma: {
    icon: <Calculator size={18} />,
    title: 'M&A Intelligence',
    description: 'Valoración, deal design, buyer matching y reporting ejecutivo.'
  },
  compliance: {
    icon: <ShieldCheck size={18} />,
    title: 'Compliance OS',
    description: 'Proveedores, alertas, evidencias, revisión humana y reportes DSS.'
  },
  funding: {
    icon: <Landmark size={18} />,
    title: 'Funding Studio',
    description: 'Readiness, estructura de capital, escenarios y data room inversor.'
  }
};

function getActiveWorkspace(pathname) {
  if (pathname.startsWith('/compliance')) return 'compliance';
  if (pathname.startsWith('/funding')) return 'funding';
  return 'ma';
}

export function Sidebar() {
  const { pathname } = useLocation();

  const activeWorkspace = getActiveWorkspace(pathname);
  const activeMeta = workspaceMeta[activeWorkspace];

  return (
    <aside
      className="sidebar"
      style={{
        borderRight: '1px solid rgba(255,255,255,0.10)',
        background:
          'linear-gradient(180deg, rgba(15,23,42,0.98), rgba(17,24,39,0.98))'
      }}
    >
      <div
        style={{
          padding: '22px 18px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 14
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              display: 'grid',
              placeItems: 'center',
              background:
                'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(59,130,246,0.18))',
              border: '1px solid rgba(16,185,129,0.35)',
              color: '#34d399'
            }}
          >
            <BrainCircuit size={22} />
          </div>

          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: -0.3,
                color: '#ffffff'
              }}
            >
              CEO’s OS
            </div>

            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.54)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Executive Command Center
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 16,
            background: 'rgba(16,185,129,0.10)',
            border: '1px solid rgba(16,185,129,0.20)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#34d399',
              fontSize: 12,
              fontWeight: 900,
              marginBottom: 6
            }}
          >
            {activeMeta.icon}
            {activeMeta.title}
          </div>

          <p
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.62)',
              fontSize: 12,
              lineHeight: 1.45
            }}
          >
            {activeMeta.description}
          </p>
        </div>
      </div>

      <nav
        style={{
          padding: '18px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        {Object.entries(routeGroups).map(([groupKey, group]) => {
          const isGroupActive = groupKey === activeWorkspace;

          return (
            <div key={groupKey}>
              <div
                style={{
                  padding: '0 8px 8px',
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                  color: isGroupActive ? '#34d399' : 'rgba(255,255,255,0.38)'
                }}
              >
                {group.label}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
              >
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 11px',
                      borderRadius: 13,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 800,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.68)',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.24), rgba(59,130,246,0.14))'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(16,185,129,0.28)'
                        : '1px solid transparent',
                      boxShadow: isActive
                        ? '0 10px 30px rgba(0,0,0,0.20)'
                        : 'none'
                    })}
                  >
                    <span
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: 24,
                        height: 24
                      }}
                    >
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          padding: 16,
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: 4
            }}
          >
            Stable Demo Build
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.45,
              color: 'rgba(255,255,255,0.52)'
            }}
          >
            M&A + Compliance conectados a backend JSON. Funding integrado como
            tercera línea estratégica.
          </p>
        </div>
      </div>
    </aside>
  );
}