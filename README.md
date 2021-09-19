![Rasa](/src/components/rasa.svg)

# Rasa Frontend Take Home Task

Clone this repo, run `npm install` and start the project using `npm start`. 
The instructions for completing the task can be found in the site that will launch.

### Notes regarding the commits

- Changes were made in order of importance, since I didn't know where I will get with the refactoring changes I planned. Therefore, the order of the commits signify what I've found more or less important. Earliest commit - more important changes, later commits - less important.

## Changes made during the task

- General refactoring for readability.
- Add prop-type.
- Make functions pure and move them to helpers file.
- Make a component for renderHighlightedText.
- Add tests to helper functions (as much as possible).
- Added TODO comments for needed improvements.
- Migrate to React Hooks.
- Fix label input doesn't clean after entity creation.

## Stuff I would do with more time

- Add Styled Components (SC) and migrate from object styles to styling with SC.
- Add react-testing-library and add component test.
- Add and configure Prettier for consistent, headache-free code style (was annoying to work without, but making Prettier work would mean time wasted on configuring the tool).

## Run tests

```sh
$ npm test
```