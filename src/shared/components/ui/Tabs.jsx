import React from 'react';
import { NavLink } from 'react-router-dom';

export function Tabs({ items }) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
