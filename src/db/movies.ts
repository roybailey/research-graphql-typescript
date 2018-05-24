import { runCypher, CypherCallback, Entity, BaseTime, neo4jSession } from './base';

export interface Movie {
    title: string;
    released: number;
    tagline: string;
}

export interface MovieModel extends Movie, Entity { }

////// Functions ////////

export function getMovies(limit = 10) {
    let session = neo4jSession()
    return session
        .run(`match (m:Movie) return m limit $limit`, { limit })
        .then((result) => {
            let movies:MovieModel[] = []
            result.records.forEach((record:any) => {
                // console.log(record);
                let m = record._fields[record._fieldLookup['m']]
                console.log(JSON.stringify(m))
                movies.push({
                    _id: m.identity.toNumber().toString(),
                    title: m.properties.title,
                    released: m.properties.released.toNumber(),
                    tagline: m.properties.tagline
                })
            });
            session.close();
            return movies;
        })
        .catch(function (error) {
            console.error(error);
        });
}
