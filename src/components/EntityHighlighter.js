import React from 'react';
import PropTypes from 'prop-types';
import { deleteEntity, hashString, updateEntitiesAfterTextChange } from './helpers';

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
  deleteButton: { 
    border: '0 none', 
    cursor: 'pointer', 
    backgroundColor: 'transparent' 
  },
};

const colors = [
  { name: 'blue', bg: '#0074d9' },
  { name: 'navy', bg: '#001f3f' },
  { name: 'lime', bg: '#01ff70' },
  { name: 'teal', bg: '#39cccc' },
  { name: 'olive', bg: '#3d9970' },
  { name: 'fuchsia', bg: '#f012be' },
  { name: 'red', bg: '#ff4136' },
  { name: 'green', bg: '#2ecc40' },
  { name: 'orange', bg: '#ff851b' },
  { name: 'maroon', bg: '#85144b' },
  { name: 'purple', bg: '#b10dc9' },
  { name: 'yellow', bg: '#ffdc00' },
  { name: 'aqua', bg: '#7fdbff' },
];

// TODO: consider moving to its own component file
const HighlightedEntity = ({ text, entity }) => {
  const start = text.substr(0, entity.start);
  const value = text.substr(entity.start, entity.end - entity.start);
  const end = text.substr(entity.end);
  const color = colors[hashString(entity.label) % colors.length].bg;
  return (
    <div style={{ ...styles.zeroPos, ...styles.highlightText }}>
      <span>{start}</span>
      <span style={{ opacity: 0.3, backgroundColor: color }}>{value}</span>
      <span>{end}</span>
    </div>
  );
};

function EntityHighlighter({ text, entities, onChange }) {
  const [highlighted, setHighlighted] = React.useState({
    selectionStart: 0, 
    selectionEnd: 0,
  });
  const [entityLabel, setEntityLabel] = React.useState('');

  const inputNode = React.useRef(null);

  const selectionChangeHandler = (event) => {
    console.log('TCL: ~ selectionChangeHandler ~ inputNode', inputNode)
    if (
      event.target === inputNode.current
    ) {
      setHighlighted({
        selectionStart: inputNode.current.selectionStart,
        selectionEnd: inputNode.current.selectionEnd
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener('select', selectionChangeHandler, false);
    document.addEventListener('click', selectionChangeHandler, false);
    document.addEventListener('keydown', selectionChangeHandler, false);

    return () => {
      document.removeEventListener('select', selectionChangeHandler);
      document.removeEventListener('click', selectionChangeHandler);
      document.removeEventListener('keydown', selectionChangeHandler);
    }
  })

  const handleTextChange = (event) =>{
    const newText = event.target.value;
    const newEntities = updateEntitiesAfterTextChange(newText, text, entities);
    onChange(newText, newEntities);
  }

  // TODO: focus is not used. find out what it should used for or whether it should be removed.
  const focus = () =>{
    if (inputNode) inputNode.current.focus();
  }

  const findEntities = (index) => {
    return entities.filter(e => e.start <= index && e.end > index);
  };

  const handleDelete = (entity) => {
    onChange(text, deleteEntity(entity, entities));
  };

  const handleAddEntity = () => {
    const newEntities = entities.concat({ 
      start: highlighted.selectionStart, 
      end: highlighted.selectionEnd, 
      label: entityLabel 
    });
    onChange(text, newEntities);
    setEntityLabel('');
  }

  const shouldDisplaySelectedEntries = () => {
    const {selectionStart, selectionEnd } = highlighted
    return selectionStart === selectionEnd && findEntities(selectionStart).length > 0
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <textarea
          style={styles.input}
          ref={inputNode}
          onChange={event => handleTextChange(event)}
          value={text}
          rows={10}
        />
        {entities.map((entity, index) => (
          <HighlightedEntity text={text} entity={entity} key={index} />
        ))}
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Entity label"
          value={entityLabel}
          onChange={(event) => setEntityLabel(event.target.value)}
          disabled={highlighted.selectionStart === highlighted.selectionEnd}
        />
        <button
          onClick={handleAddEntity}
          disabled={highlighted.selectionStart === highlighted.selectionEnd}
        >Add entity for selection</button>
      </div>
      {shouldDisplaySelectedEntries() && (
        <div style={{ marginTop: 10 }}>
          {findEntities(highlighted.selectionStart).map((e, i) => (
            <span key={i}>
              {text.substring(e.start, e.end)} ({e.label})
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(e)}
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

EntityHighlighter.propTypes = {
  text: PropTypes.string.isRequired,
  entities: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  })),
  onChange: PropTypes.func.isRequired,
};

HighlightedEntity.propTypes = {
  text: PropTypes.string.isRequired,
  entity: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default EntityHighlighter;
