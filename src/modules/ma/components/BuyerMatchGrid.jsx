import React from 'react';
import {
  Building2,
  CheckCircle2,
  Landmark,
  Network,
  ShieldCheck,
  Target,
  Users
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

const buyerMatchGridCss = `
  .buyer-match-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .buyer-match-header {
    position: relative;
    overflow: hidden;
    border-radius: 31px;
    padding: 30px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.14), transparent 32%),
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.062), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.68);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .buyer-match-header::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.62), transparent 85%);
    pointer-events: none;
  }

  .buyer-match-header-inner {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .buyer-match-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .buyer-match-header h2 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .buyer-match-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .buyer-match-header-icon {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .buyer-match-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
    align-items: stretch;
  }

  .buyer-match-card {
    position: relative;
    overflow: hidden;
    min-height: 290px;
    border-radius: 30px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.11), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.062), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.66);
    box-shadow:
      0 22px 62px rgba(0, 0, 0, 0.20),
      inset 0 1px 0 rgba(255,255,255,0.035);
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .buyer-match-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.14), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .buyer-match-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.020) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.020) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.48), transparent 85%);
    pointer-events: none;
  }

  .buyer-match-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .buyer-match-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .buyer-match-title-wrap {
    min-width: 0;
  }

  .buyer-match-title {
    margin: 10px 0 0;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .buyer-match-icon {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .buyer-match-score-box {
    display: grid;
    grid-template-columns: 92px minmax(0, 1fr);
    gap: 16px;
    align-items: center;
    padding: 18px;
    border-radius: 24px;
    background:
      linear-gradient(135deg, rgba(16, 185, 129, 0.105), rgba(59, 130, 246, 0.055));
    border: 1px solid rgba(16, 185, 129, 0.16);
  }

  .buyer-match-ring {
    width: 82px;
    height: 82px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 16px 34px rgba(0, 0, 0, 0.26),
      0 0 28px rgba(16, 185, 129, 0.14);
  }

  .buyer-match-ring-core {
    width: 60px;
    height: 60px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .buyer-match-ring-core strong {
    font-size: 18px;
    letter-spacing: -0.05em;
  }

  .buyer-match-score-copy strong {
    display: block;
    margin-bottom: 7px;
  }

  .buyer-match-score-copy p {
    margin: 0;
    color: rgba(148, 163, 184, 0.9);
    line-height: 1.5;
  }

  .buyer-match-description {
    margin: 0;
    color: var(--muted);
    line-height: 1.65;
  }

  .buyer-match-footer {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
  }

  .buyer-match-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.052);
    border: 1px solid rgba(255,255,255,0.075);
    color: rgba(226, 232, 240, 0.88);
    font-size: 12px;
    font-weight: 720;
  }

  .buyer-match-empty {
    border-radius: 30px;
    padding: 36px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018)),
      rgba(15, 23, 42, 0.58);
    text-align: center;
  }

  .buyer-match-empty-icon {
    width: 58px;
    height: 58px;
    margin: 0 auto 18px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .buyer-match-empty h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .buyer-match-empty p {
    max-width: 560px;
    margin: 12px auto 0;
    line-height: 1.65;
  }

  @media (max-width: 1180px) {
    .buyer-match-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .buyer-match-header {
      border-radius: 24px;
      padding: 24px;
    }

    .buyer-match-header-inner {
      flex-direction: column;
    }

    .buyer-match-grid {
      grid-template-columns: 1fr;
    }

    .buyer-match-card {
      border-radius: 24px;
    }

    .buyer-match-score-box {
      grid-template-columns: 1fr;
    }
  }
`;

function getSafeBuyers(buyers) {
  if (!Array.isArray(buyers)) return [];

  return buyers.filter(Boolean);
}

function getBuyerScore(item) {
  const rawScore = item?.fitScore ?? item?.fit ?? item?.score;
  const parsed = Number(rawScore);

  if (!Number.isFinite(parsed)) return 0;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function getBuyerTitle(item, index) {
  return item?.title || item?.name || `Buyer profile ${index + 1}`;
}

function getBuyerDescription(item) {
  return (
    item?.desc ||
    item?.description ||
    item?.rationale ||
    'Perfil comprador generado según encaje estratégico, capacidad financiera, calidad del activo y lógica de ejecución.'
  );
}

function getBuyerType(item) {
  return item?.type || 'Buyer profile';
}

function getBuyerIcon(type) {
  const normalized = String(type || '').toLowerCase();

  if (normalized.includes('financial') || normalized.includes('fund')) {
    return Landmark;
  }

  if (normalized.includes('strategic') || normalized.includes('industrial')) {
    return Building2;
  }

  return Users;
}

function getScoreLabel(score) {
  if (score >= 80) return 'High fit';
  if (score >= 60) return 'Qualified fit';
  if (score >= 40) return 'Moderate fit';

  return 'Early signal';
}

export function BuyerMatchGrid({ buyers }) {
  const safeBuyers = getSafeBuyers(buyers);

  return (
    <section className="buyer-match-section">
      <style>{buyerMatchGridCss}</style>

      <div className="buyer-match-header">
        <div className="buyer-match-header-inner">
          <div>
            <div className="buyer-match-kicker">
              <Network size={14} />
              Buyer pipeline
            </div>

            <h2>Prioritized buyer universe</h2>

            <p className="muted">
              Perfiles de comprador priorizados por encaje estratégico,
              capacidad financiera, probabilidad de ejecución y valor potencial
              después de la adquisición.
            </p>
          </div>

          <div className="buyer-match-header-icon">
            <Target size={20} />
          </div>
        </div>
      </div>

      {safeBuyers.length === 0 ? (
        <div className="buyer-match-empty">
          <div className="buyer-match-empty-icon">
            <Users size={24} />
          </div>

          <h3>Buyer universe pendiente</h3>

          <p className="muted">
            Actualiza la valoración del activo para priorizar perfiles de
            comprador y conversaciones de mayor probabilidad.
          </p>
        </div>
      ) : (
        <div className="buyer-match-grid">
          {safeBuyers.map((item, index) => {
            const type = getBuyerType(item);
            const title = getBuyerTitle(item, index);
            const description = getBuyerDescription(item);
            const score = getBuyerScore(item);
            const scoreAngle = `${score * 3.6}deg`;
            const BuyerIcon = getBuyerIcon(type);

            return (
              <Card key={`${type}-${title}-${index}`} className="buyer-match-card">
                <div className="buyer-match-inner">
                  <div className="buyer-match-top">
                    <div className="buyer-match-title-wrap">
                      <Badge>{type}</Badge>

                      <h3 className="buyer-match-title">{title}</h3>
                    </div>

                    <div className="buyer-match-icon">
                      <BuyerIcon size={18} />
                    </div>
                  </div>

                  <div className="buyer-match-score-box">
                    <div
                      className="buyer-match-ring"
                      style={{ '--score-angle': scoreAngle }}
                    >
                      <div className="buyer-match-ring-core">
                        <strong>{score}</strong>
                      </div>
                    </div>

                    <div className="buyer-match-score-copy">
                      <strong>{getScoreLabel(score)}</strong>

                      <p>{score}/100 estimated match</p>
                    </div>
                  </div>

                  <p className="buyer-match-description">{description}</p>

                  <div className="buyer-match-footer">
                    <span className="buyer-match-chip">
                      <CheckCircle2 size={13} />
                      Buyer fit
                    </span>

                    <span className="buyer-match-chip">
                      <ShieldCheck size={13} />
                      Execution logic
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
