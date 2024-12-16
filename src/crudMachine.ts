
import { setup, assign, assertEvent } from 'xstate'
import type { Person } from './types'

const INITIAL_PEOPLE: Person[] = [
  {
    name: "Joe",
    surname: "Shmoe",
    id: 0,
  },
  {
    name: "Linda",
    surname: "Shminda",
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
  {
    name: "Annette",
    surname: "Emeterius",
    id: 4,
  },
  {
    name: "Fritiof",
    surname: "Hiacynta",
    id: 5,
  },
  {
    name: "Paavo",
    surname: "Hampus",
    id: 6,
  },
  {
    name: "Phuntso",
    surname: "Von Ingersleben",
    id: 7,
  },
  {
    name: "Paul",
    surname: "Vijaya",
    id: 8,
  },
  {
    name: "Amit",
    surname: "Kranz",
    id: 9,
  },
  {
    name: "Henrik",
    surname: "Blakely",
    id: 10,
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
