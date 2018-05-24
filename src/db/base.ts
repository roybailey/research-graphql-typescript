import * as neo4j from 'neo4j-driver';
import {toNumber} from 'neo4j-driver/lib/v1/integer.js'

export interface Entity {
    _id: string;
}

export interface BaseTime {
    createdAt: Date;
    updatedAt: Date;
}

export function preSave(next) {
    const now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
}

export interface CypherCallback {
    onNext: (record:any)=>void;
    onCompleted: ()=>void;
    onError: (error:Error)=>void;
}

// Setup Neo4j Session
export const neo4jDriver = neo4j.v1.driver("bolt://localhost:7687");
// const neo4jDriver = neo4j.driver("bolt://localhost:7687", neo4j.v1.auth.basic("neo4j", "neo4j"));
export const neo4jSession = () => neo4jDriver.session();

export const toNeo4jNumber = neo4j.v1.int;

export function subscribeCypher(callback: CypherCallback, cypher:string, params: any = {}) {
    // Create a session to run Cypher statements in.
    // Note: Always make sure to close sessions when you are done using them!
    var session = neo4jSession();

    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
        .run(cypher, params)
        .subscribe({
            onNext: function (record) {
                callback.onNext(record);
            },
            onCompleted: function () {
                session.close();
                callback.onCompleted();
            },
            onError: function (error) {
                console.log(error);
                callback.onError(error);
            }
        });
}

export function runCypher(cypher:string, params: any = {}): Promise<any> {
    // Create a session to run Cypher statements in.
    // Note: Always make sure to close sessions when you are done using them!
    var session = neo4jSession();

    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    return session
        .run(cypher, params)
        .then(function (result) {
            result.records.forEach(function (record) {
                console.log(record);
            });
            session.close();
        })
        .catch(function (error) {
            console.log(error);
        });
}
