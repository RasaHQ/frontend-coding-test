import React, { Component } from 'react';

import logo from './rasa.svg';
import { EntityHighlighter } from './EntityHighlighter';

const styles = {
  app: {
    textAlign: 'center',
    padding: '2em',
    width: '60%',
    margin: '0 auto',
    color: 'black',
    maxWidth: 750,
    minWidth: 250,
  },
  logo: {
    height: '5vmin',
  },
};

class App extends Component {
  state = {
    text: 'Venture first mover advantage learning curve market ecosystem funding stealth disruptive social proof scrum project growth hacking niche market user experience graphical user interface.',
    entities: [
      { start: 160, end: 184, label: 'very important'},
      { start: 144, end: 159, label: 'very important'},
      { start: 62, end: 69, label: 'important' },
      { start: 116, end: 130, label: 'nonsense' },
      { start: 8, end: 29, label: 'nonsense' },
    ],
  }

  render() {
    return (
      <div style={styles.app}>
        <header>
          <img src={logo} style={styles.logo} alt="Rasa" />
          <h1>
            Entity Highlighting
          </h1>
        </header>
        <section>
          <p>
            Rasa is writing a new natural language classifier to sort useful concepts in tech from meaningless jargon <span role="img" aria-label="Hell yeah">💯</span>.
            You are writing the interface to help us train the classifier! One of the important parts of the interface is
            what we call the EntityHighlighter, which allows the user to highlight and identify parts of a string.
            Try clicking existing highlights, or adding some of your own by selecting some text and filling the form.
          </p>
          <p>
            However, the code is in a bit of a mess and a nightmare to maintain - <span role="img" aria-label="Oh no">😱</span> everyone is afraid of touching it!
            Your task is to refactor <code>EntityHighlighter.js</code> and fix any bugs you find.
          </p>
        </section>
        <section>
          <EntityHighlighter />
        </section>
      </div>
    );
  }
}

export default App;
