import { neo4jSession, toNeo4jNumber, runCypher, CypherCallback, Entity, BaseTime } from './base';

export enum PersonRole {
    Directed = "DIRECTED",
    ActedIn = "ACTED_IN", 
    Produced = "PRODUCED", 
    Wrote = "WROTE",
}
export namespace PersonRole {
    export function fromString(value:string):PersonRole {
        return Object.keys(PersonRole).filter((key)=>PersonRole[key]===value).map((key)=>PersonRole[key])[0];
    }
}
const neo4jPersonRole = {
    "DIRECTED": PersonRole.Directed,
    "ACTED_IN": PersonRole.ActedIn,
    "PRODUCED": PersonRole.Produced,
    "WROTE": PersonRole.Wrote,
}

export interface Person {
    name: string;
    born: number;
    roles: PersonRole[]
}

export interface PersonModel extends Person, BaseTime, Entity { }

////// Functions ////////

const ZERO = toNeo4jNumber(0)

export function getPeople(limit = 5) {
    let session = neo4jSession()
    return session
        .run(`  match (p:Person)
                optional match (p)-[r]-(m:Movie)
                return id(p) as _id, p.name as name, p.born as born, collect(distinct(type(r))) as roles
                limit $limit`,
        { limit })
        .then((result) => {
            let people:PersonModel[] = []
            result.records.forEach((record:any) => {
                console.log(record._fields[record._fieldLookup['born']] || ZERO);
                
                people.push({
                    _id: record._fields[record._fieldLookup['_id']],
                    name: record._fields[record._fieldLookup['name']],
                    born: (record._fields[record._fieldLookup['born']] || ZERO).toNumber(),
                    roles: record._fields[record._fieldLookup['roles']] || [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                    })
                });
            session.close();
            return people;
        })
        .catch(function (error) {
            console.error(error);
        });
}

export function addPerson(input:Person) {
    let session = neo4jSession()
    return session
        .run(`  merge (p:Person { name: $name})
                  set p.born = $born
                return id(p) as _id, p.name as name, p.born as born`,
        {
            name: input.name,
            born: toNeo4jNumber(input.born)
        })
        .then((result) => {
            let people:PersonModel[] = []
            result.records.forEach((record:any) => {
                console.log(JSON.stringify(record));
                people.push({
                    _id: record._fields[record._fieldLookup['_id']],
                    name: record._fields[record._fieldLookup['name']],
                    born: (record._fields[record._fieldLookup['born']] || 0).toNumber(),
                    roles: [record._fields[record._fieldLookup['roles']]] || [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                    })
                });
            session.close();
            return people[0];
        })
        .catch(function (error) {
            console.error(error);
        });
}

export function removePerson(root, { id }) {
    console.log(JSON.stringify(root));
    console.log(JSON.stringify(id));
    
    let session = neo4jSession()
    return session
        .run(`  match (p:Person)
                where id(p) = $id
                delete p`,
        { id: toNeo4jNumber(id) })
        .then((result) => {
            console.log(JSON.stringify(result));
            return id
        })
        .catch(function (error) {
            console.error(error);
        });
}
