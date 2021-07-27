import React from "react";
import { colors } from "./utils/colors";
import { findClosestStart } from './utils/find-closest-start';
import { hashString } from "./utils/hash-string";
import { styles } from "./styles"

export const TextArea = ({entities, inputNode, setSelection, setText, setEntities, text}) => {

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

      const newStart = findClosestStart(newText, oldSelection, start);
      if (newStart === -1) {
        return;
      }

      newEntities.push({
        label,
        start: newStart,
        end: newStart + oldSelection.length,
      });
    });

    setText(newText);
    setEntities(newEntities);
  }

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

  return (
    <div style={styles.textArea}>
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
  )
}