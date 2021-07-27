import React from "react";

export const FoundEntities = ({foundEntities, text, deleteEntity}) => {
  return (
    foundEntities.length > 0 && (
      <div style={{ marginTop: 10 }}>
        {foundEntities.map((e,i) => (
          <span key={i}>
            {text.substring(e.start, e.end)} ({e.label})
            <button
              style={{ border: '0 none', cursor: 'pointer', backgroundColor: 'transparent' }}
              onClick={() => deleteEntity(e)}
            >
              <span role="img" aria-label="Delete">🗑️</span>
            </button>
          </span>
        ))}
      </div>
    )
  )
}