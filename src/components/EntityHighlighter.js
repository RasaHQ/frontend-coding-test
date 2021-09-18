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

class EntityHighlighter extends React.Component {
  state = { selectionStart: 0, selectionEnd: 0, text: '' };

  componentDidMount() {
    document.addEventListener('select', this.selectionChangeHandler, false);
    document.addEventListener('click', this.selectionChangeHandler, false);
    document.addEventListener('keydown', this.selectionChangeHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('select', this.selectionChangeHandler);
    document.removeEventListener('click', this.selectionChangeHandler);
    document.removeEventListener('keydown', this.selectionChangeHandler);
  }

  selectionChangeHandler = (event) => {
    if (
      event.target === this.inputNode
    ) {
      this.setState({
        selectionStart: this.inputNode.selectionStart,
        selectionEnd: this.inputNode.selectionEnd
      });
    }
  };

  handleTextChange(event) {
    const { text: oldText, entities: oldEntities, onChange } = this.props;
    const text = event.target.value;
    const entities = updateEntitiesAfterTextChange(text, oldText, oldEntities);
    onChange(text, entities);
  }

  // TODO: focus is not used. find out what it should used for or whether it should be removed.
  focus() {
    if (this.inputNode) this.inputNode.focus();
  }

  findEntities = (index) => {
    return this.props.entities.filter(e => e.start <= index && e.end > index);
  };

  handleDelete = (entity) => {
    this.props.onChange(this.props.text, deleteEntity(entity, this.props.entities));
  };

  handleAddEntity = () => {
    const newEntities = this.props.entities.concat({ 
      start: this.state.selectionStart, 
      end: this.state.selectionEnd, 
      label: this.state.text 
    })
    this.props.onChange(this.props.text, newEntities)
  }

  shouldDisplaySelectedEntries = () => {
    return this.state.selectionStart === this.state.selectionEnd && this.findEntities(this.state.selectionStart).length > 0
  };

  render() {
    const { text, entities = [], } = this.props;
    const { selectionStart, selectionEnd, text: stateText } = this.state;

    return (
      <div>
        <div style={{ position: 'relative' }}>
          <textarea
            style={styles.input}
            ref={node => {
              if (node) {
                this.inputNode = node;
              }
            }}
            onChange={event => this.handleTextChange(event)}
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
            value={stateText}
            onChange={(event) => this.setState({ text: event.target.value })}
            disabled={selectionStart === selectionEnd}
          />
          <button
            onClick={this.handleAddEntity}
            disabled={selectionStart === selectionEnd}
          >Add entity for selection</button>
        </div>
        {this.shouldDisplaySelectedEntries() && (
          <div style={{ marginTop: 10 }}>
            {this.findEntities(selectionStart).map((e, i) => (
              <span key={i}>
                {text.substring(e.start, e.end)} ({e.label})
                <button
                  style={styles.deleteButton}
                  onClick={() => this.handleDelete(e)}
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
