import { deleteEntity } from "./helpers";

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
