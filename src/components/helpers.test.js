import { deleteEntity, updateEntitiesAfterTextChange } from "./helpers";

describe("deleteEntity", () => {
  it("can delete an entity", () => {
    const entity = { start: 62, end: 69, label: 'important' }

    const entities = [
      { start: 160, end: 184, label: 'very important'},
      entity
    ]

    const result = deleteEntity(entity, entities);
    const expected = [
      { start: 160, end: 184, label: 'very important'},
    ]
    expect(result).toEqual(expected); 
  });

  it("with empty entity does nothing", () => {
    const entity = {}

    const entities = [
      { start: 160, end: 184, label: 'very important'},
    ]

    const actual = deleteEntity(entity, entities);
    expect(actual).toEqual(entities); 
  });
});

describe('updateEntitiesAfterTextChange', () => {
  it('properly updates entities list after the text was changed', () => {
    const oldText = 'This is a test.';
    const entities = [
      { start: 0, end: 6, label: 'nonsense'},
      { start: 10, end: 13, label: 'important'},
    ]

    const text = 'This is a new test.';
    const actual = updateEntitiesAfterTextChange(text, oldText, entities)
    const expected = [
      entities[0],
      { start: 14, end: 17, label: 'important'},
    ]
    expect(actual).toEqual(expected)
  })
  // TODO: add more tests
})
