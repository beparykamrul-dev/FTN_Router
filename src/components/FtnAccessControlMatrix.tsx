
import React from 'react';

export const FtnAccessControlMatrix = () => {
  const roles = ['Admin', 'NOC', 'Family'];
  const services = ['NOC', 'DNS', 'SIEM'];

  return (
    <div className="p-6 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[#9f7aea]">Access Control Matrix</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Role</th>
            {services.map(s => <th key={s}>{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {roles.map(r => (
            <tr key={r}>
              <td>{r}</td>
              {services.map(s => <td key={s}><input type="checkbox" /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
