
import { setup, assign } from 'xstate'

interface Person {
  name: string;
  surname: string;
}

const INITIAL_PEOPLE: Person[] = [
  {
    name: "Joe",
    surname: "Shmoe"
  },
  {
    name: "Linda",
    surname: "Shminda"
  },
  {
    name: "Brett",
    surname: "Shmett"
  },
  {
    name: "Eve",
    surname: "Shmeve"
  },
]

export const crudMachine = setup({
  "types": {
    "context": {} as { 'people': Person[] },
    "events": {} as { type: 'DELETE', id: number } | { type: 'UPDATE', id: number, person: Person } | { type: 'CREATE', person: Person }
  },
  "actions": {
    "create": assign(({ context, event }) => {
      return {
        people: context.people.toSpliced(context.people.length, 0, event.person),
      }
    }
    ),
    "update": assign(({ context, event }) => {
      return {
        people: context.people.toSpliced(event.id, 1, event.person),
      }
    }
    ),
    "delete": assign(({ context, event }) => {
      return {
        people: context.people.toSpliced(event.id, 1),
      }
    }
    )
  }
})
  .createMachine({
    "context": {
      "people": INITIAL_PEOPLE
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
