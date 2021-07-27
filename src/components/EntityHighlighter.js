import React, { useRef, useState } from 'react';
import { colors } from "./colors";

const styles = {
  text: {},
  highlightText: {
    color: 'transparent',
    pointerEvents: 'none',
    padding: '0',
    whiteSpace: 'pre-wrap',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
  },
  zeroPos: {
    textAlign: 'left',
    position: 'absolute',
    top: 1,
    left: 1,
  },
  input: {
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
    background: 'none',
    border: '1px solid',
    width: '100%',
    resize: 'none',
  },
};


function hashString(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash > 0 ? hash : -hash;
}

export const EntityHighlighter = () => {

  const [{selectionStart, selectionEnd}, setSelection] = useState({ selectionStart: 0, selectionEnd: 0});
  const [text, setText] = useState('Venture first mover advantage learning curve market ecosystem funding stealth disruptive social proof scrum project growth hacking niche market user experience graphical user interface.');
  const [inputText, setInputText] = useState('');
  const [entities, setEntities] = useState([
    { start: 160, end: 184, label: 'very important'},
    { start: 144, end: 159, label: 'very important'},
    { start: 62, end: 69, label: 'important' },
    { start: 116, end: 130, label: 'nonsense' },
    { start: 8, end: 29, label: 'nonsense' },
  ]);

  const inputNode = useRef(null);

  const onChange = (text, entities) => {
    setText(text);
    setEntities(entities);
  }

  const selectionChangeHandler = (event) => {
    const target = event.target;

    if (
      target === inputNode.current
    ) {
      setSelection({
        selectionStart: inputNode.current.selectionStart,
        selectionEnd: inputNode.current.selectionEnd
      });
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    const newEntities = [];

    // update the entity boudaries
    entities.forEach(({start, end, label}) => {
      const oldSelection = text.substr(start, end - start);

      function findClosestStart(lastMatch) {
        if (lastMatch == null) {
          const index = newText.indexOf(oldSelection);
          if (index === -1) {
            return index;
          }
          return findClosestStart(index);
        }
        const from = lastMatch + oldSelection.length;
        const index = newText.indexOf(oldSelection, from);
        if (index === -1) {
          return lastMatch;
        }
        const prevDiff = Math.abs(start - lastMatch);
        const nextDiff = Math.abs(start - index);
        if (prevDiff < nextDiff) {
          return lastMatch;
        }
        return findClosestStart(index);
      }

      const newStart = findClosestStart();
      console.log({newStart, end: newStart + oldSelection.length});
      if (newStart === -1) {
        return;
      }

      newEntities.push({
        label,
        start: newStart,
        end: newStart + oldSelection.length,
      });
    });

    onChange(newText, newEntities);
  }

  const focus = () => {
    if (inputNode.current) inputNode.current.focus();
  }

  const findEntities = (index) => {
    return entities.filter(e => e.start <= index && e.end > index);
  };

  const renderEntityHighlight = (text, entity) => {
    const { start, end, label } = entity;
    const highlightStart = text.substr(0, start);
    const value = text.substr(start, end - start);
    const highlightEnd = text.substr(end);
    const color = colors[hashString(label) % colors.length].bg;
    return (
      <div key={`${start}-${end}-${label}`} style={{ ...styles.zeroPos, ...styles.highlightText }}>
        <span>{highlightStart}</span>
        <span style={{ opacity: 0.3, backgroundColor: color }}>{value}</span>
        <span>{highlightEnd}</span>
      </div>
    );
  };

  const deleteEntity = (entity) => {
    const deleted = entities.findIndex(e => e.start === entity.start && e.end === entity.end && e.label === entity.label);
    entities.splice(deleted, 1);
    onChange(text, entities);
  }

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <textarea
          style={styles.input}
          ref={inputNode}
          onChange={event => handleTextChange(event)}
          onSelect={selectionChangeHandler}
          onKeyDown={selectionChangeHandler}
          onClick={selectionChangeHandler}
          value={text}
          rows={10}
        />
        {entities.map(entity => renderEntityHighlight(text, entity))}
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Entity label"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          disabled={selectionStart === selectionEnd}

        />
        <button
          onClick={() => {
            onChange(text, entities.concat({ start: selectionStart, end: selectionEnd, label: inputText }));
            focus();
          }}
          disabled={selectionStart === selectionEnd}
        >Add entity for selection</button>
      </div>
      {selectionStart === selectionEnd && findEntities(selectionStart).length > 0 && (
        <div style={{ marginTop: 10 }}>
          {findEntities(selectionStart).map((e,i) => (
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
      )}
    </div>
  );

}
