
import { setup, assign, assertEvent } from 'xstate'
import type { Person } from './types'

const INITIAL_PEOPLE: Person[] = [
  {
    name: "Joe",
    surname: "aShmoe",
    id: 0,
  },
  {
    name: "Linda",
    surname: "aShminda",
    id: 1,
  },
  {
    name: "Brett",
    surname: "Shmett",
    id: 2,
  },
  {
    name: "Eve",
    surname: "Shmeve",
    id: 3,
  },
]

export const crudMachine = setup({
  "types": {
    "context": {} as { 'people': Person[], lastID: number },
    "events": {} as { type: 'DELETE', id: number } | { type: 'UPDATE', id: number, surname: string, name: string } | { type: 'CREATE', surname: string, name: string }
  },
  "actions": {
    "create": assign(({ context, event }) => {
      assertEvent(event, 'CREATE');

      const newPerson = {
        surname: event.surname,
        name: event.name,
        id: context.lastID + 1
      }
      return {
        people: context.people.toSpliced(context.people.length, 0, newPerson),
        lastID: context.lastID + 1
      }
    }
    ),
    "update": assign(({ context, event }) => {
      assertEvent(event, 'UPDATE');

      const updatedPerson = {
        surname: event.surname,
        name: event.name,
        id: event.id
      }
      return {
        people: context.people.toSpliced(context.people.findIndex((el: Person) => el.id === event.id), 1, updatedPerson),
      }
    }
    ),
    "delete": assign(({ context, event }) => {
      assertEvent(event, 'DELETE');

      return {
        people: context.people.toSpliced(context.people.findIndex((el: Person) => el.id === event.id), 1),
      }
    }
    )
  }
})
  .createMachine({
    "context": {
      "people": INITIAL_PEOPLE,
      "lastID": INITIAL_PEOPLE.length - 1
    },
    "id": "CRUD",
    "initial": "ready",
    "states": {
      "ready": {
        "on": {
          "CREATE": {
            "target": "ready",
            "actions": {
              "type": "create"
            }
          },
          "UPDATE": {
            "target": "ready",
            "actions": {
              "type": "update",
              "params": {
                "id": "number"
              }
            }
          },
          "DELETE": {
            "target": "ready",
            "actions": {
              "type": "delete"
            }
          }
        }
      }
    }
  })
